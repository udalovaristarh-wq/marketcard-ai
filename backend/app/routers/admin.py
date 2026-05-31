from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db import get_session
from app.models import User, UserError
from app.security import get_current_admin
import psutil
import os

router = APIRouter(prefix="/admin", tags=["admin"])


class AdminPasswordRequest(BaseModel):
    password: str


@router.post("/verify-password")
def verify_admin_password(
    data: AdminPasswordRequest,
    current_user: User = Depends(get_current_admin),
):
    admin_password = os.getenv("ADMIN_PANEL_PASSWORD", "").strip()
    if not admin_password:
        raise HTTPException(status_code=500, detail="Admin password not configured")
    if data.password.strip() != admin_password:
        raise HTTPException(status_code=403, detail="Неверный пароль администратора")
    return {"success": True}


@router.get("/users")
def get_users(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin),
):
    users = session.exec(select(User).order_by(User.id.desc())).all()

    return [
        {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "tariff_name": user.tariff_name,
            "tariff_active": user.tariff_active,
            "tariff_generations_total": user.tariff_generations_total,
            "tariff_generations_used": user.tariff_generations_used,
            "tariff_generations_left": max(
                0, user.tariff_generations_total - user.tariff_generations_used
            ),
            "is_admin": getattr(user, "is_admin", False),
            "is_banned": getattr(user, "is_banned", False),
            "ban_reason": getattr(user, "ban_reason", None),
            "created_at": getattr(user, "created_at", None),
            "last_login": getattr(user, "last_login", None),
        }
        for user in users
    ]


@router.get("/errors")
def get_all_errors(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin),
):
    errors = session.exec(
        select(UserError).order_by(UserError.id.desc())
    ).all()
    return errors


@router.get("/errors/{user_id}")
def get_user_errors(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin),
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    errors = session.exec(
        select(UserError)
        .where(UserError.user_id == user_id)
        .order_by(UserError.id.desc())
    ).all()

    return [
        {
            "id": error.id,
            "user_id": error.user_id,
            "error_type": error.error_type,
            "error_message": error.error_message,
            "error_trace": getattr(error, "error_trace", None),
            "solution": getattr(error, "solution", None),
            "is_resolved": getattr(error, "is_resolved", False),
            "created_at": getattr(error, "created_at", None),
            "translated_message": translate_error_message(error.error_message),
            "suggested_fix": build_suggested_fix(
                error.error_type,
                error.error_message,
                getattr(error, "solution", None),
            ),
        }
        for error in errors
    ]


@router.post("/errors/{error_id}/resolve")
def resolve_error(
    error_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin),
):
    error = session.get(UserError, error_id)
    if not error:
        raise HTTPException(status_code=404, detail="Ошибка не найдена")

    error.is_resolved = True
    session.add(error)
    session.commit()
    session.refresh(error)

    return {"success": True, "message": "Ошибка отмечена как решённая"}


def translate_error_message(message: str | None) -> str:
    if not message:
        return "Нет текста ошибки"

    text = message.lower()

    if "insufficient_quota" in text or "quota" in text:
        return "Закончился баланс или лимит API."
    if "billing" in text:
        return "Проблема с оплатой или биллингом API."
    if "timeout" in text:
        return "Превышено время ожидания ответа."
    if "connection" in text or "could not connect" in text:
        return "Проблема подключения к серверу или внешнему сервису."
    if "401" in text or "unauthorized" in text:
        return "Ошибка авторизации. Ключ или токен недействителен."
    if "403" in text or "forbidden" in text:
        return "Доступ запрещён."
    if "404" in text or "not found" in text:
        return "Нужный ресурс не найден."
    if "500" in text:return "Внутренняя ошибка сервера."
    if "image file is required" in text:
        return "Пользователь не загрузил изображение."
    if "uploaded image has no filename" in text:
        return "Файл изображения повреждён или передан без имени."
    if "лимит генераций исчерпан" in text:
        return "У пользователя закончился лимит генераций."
    if "пользователь не найден" in text:
        return "Пользователь для генерации не найден в базе."
    if "syntaxerror" in text:
        return "Синтаксическая ошибка в коде."
    if "nameerror" in text:
        return "В коде используется переменная или объект без импорта/определения."
    if "indentationerror" in text:
        return "Ошибка отступов в Python-коде."
    if "permission denied" in text:
        return "Недостаточно прав для операции в базе или файловой системе."

    return message


def build_suggested_fix(error_type: str | None, message: str | None, solution: str | None) -> str:
    if solution:
        return solution

    text = (message or "").lower()
    err_type = (error_type or "").lower()

    if "quota" in text or "insufficient_quota" in text:
        return "Пополнить баланс OpenAI API и проверить лимиты проекта."
    if "billing" in text:
        return "Проверить биллинг аккаунта и активность платёжного метода."
    if "timeout" in text:
        return "Увеличить timeout на backend/Nginx и проверить скорость внешнего API."
    if "connection" in text or "could not connect" in text:
        return "Проверить интернет, DNS, доступность API и настройки сервера."
    if "401" in text or "unauthorized" in text:
        return "Проверить API-ключ, токен и переменные окружения."
    if "403" in text or "forbidden" in text:
        return "Проверить права доступа, ограничения и настройки аккаунта."
    if "404" in text or "not found" in text:
        return "Проверить URL, роуты, путь к файлу или существование ресурса."
    if "image file is required" in text:
        return "Попросить пользователя загрузить фото товара."
    if "uploaded image has no filename" in text:
        return "Проверить загрузку файла и формат отправки multipart/form-data."
    if "лимит генераций исчерпан" in text:
        return "Активировать тариф или увеличить доступный лимит генераций."
    if "пользователь не найден" in text:
        return "Проверить email пользователя и наличие записи в базе."
    if "nameerror" in text:
        return "Проверить импорты и названия переменных в коде."
    if "indentationerror" in text or "syntaxerror" in text:
        return "Открыть проблемный файл и исправить код по строке из traceback."
    if "permission denied" in text:
        return "Выдать нужные права PostgreSQL или файловой системе."

    if err_type == "generation_error":
        return "Проверить логи генерации, входные данные пользователя и состояние AI API."

    return "Проверить traceback, логи backend и входные данные пользователя."


class BanUserPayload(BaseModel):
    user_id: int
    ban_reason: str | None = None


class UnbanUserPayload(BaseModel):
    user_id: int


@router.post("/ban-user")
def ban_user(
    payload: BanUserPayload,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin),
):

    user = session.exec(select(User).where(User.id == payload.user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if getattr(user, "is_admin", False):
        raise HTTPException(status_code=400, detail="Нельзя забанить администратора")

    user.is_banned = True
    user.ban_reason = payload.ban_reason or "Заблокирован администратором"
    user.token_version = int(getattr(user, "token_version", 0) or 0) + 1
    session.add(user)
    session.commit()
    session.refresh(user)

    return {"success": True, "user_id": user.id, "is_banned": user.is_banned}


@router.post("/unban-user")
def unban_user(
    payload: UnbanUserPayload,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin),
):

    user = session.exec(select(User).where(User.id == payload.user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    user.is_banned = False
    user.ban_reason = None
    session.add(user)
    session.commit()
    session.refresh(user)

    return {"success": True, "user_id": user.id, "is_banned": user.is_banned}


@router.get("/stats")
def get_admin_stats(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin),
):
    users = session.exec(select(User)).all()

    total_users = len(users)
    total_generations = sum(u.tariff_generations_total or 0 for u in users)
    used_generations = sum(u.tariff_generations_used or 0 for u in users)
    without_tariff = len([u for u in users if not u.tariff_name])

    cpu = psutil.cpu_percent(interval=0.5)
    memory = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent

    load_percent = int((cpu + memory + disk) / 3)

    return {
        "users": {
            "total": total_users,
            "without_tariff": without_tariff
        },
        "generations": {
            "total": total_generations,
            "used": used_generations
        },
        "system": {
            "cpu": cpu,
            "memory": memory,
            "disk": disk,
            "load_percent": load_percent
        }
    }
