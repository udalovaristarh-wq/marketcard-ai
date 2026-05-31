from app.models.payment_order import PaymentOrder
from app.models.user import User


def grant_tariff_benefits(user: User, order: PaymentOrder) -> None:
    if order.tariff_name not in ("audit10", "audit30"):
        user.tariff_name = order.tariff_name
        user.tariff_active = True
        user.tariff_generations_used = 0

        if order.tariff_name == "Start":
            user.tariff_generations_total = 20
            user.tariff_generations_left = 20
        elif order.tariff_name == "Business":
            user.tariff_generations_total = 60
            user.tariff_generations_left = 60
        elif order.tariff_name == "Premium":
            user.tariff_generations_total = 200
            user.tariff_generations_left = 200

    if order.tariff_name == "audit10":
        user.audit_credits = (user.audit_credits or 0) + 10
    elif order.tariff_name == "audit30":
        user.audit_credits = (user.audit_credits or 0) + 30
    elif order.tariff_name == "Start":
        user.audit_credits = (user.audit_credits or 0) + 10
    elif order.tariff_name == "Business":
        user.audit_credits = (user.audit_credits or 0) + 30
    elif order.tariff_name == "Premium":
        user.audit_credits = (user.audit_credits or 0) + 100
