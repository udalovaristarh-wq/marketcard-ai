# MarketCard AI backend environment

Секреты не коммитим в репозиторий. Эти переменные нужно добавить в `backend/.env` на сервере.

```env
DATABASE_URL=postgresql://marketcard_user:CHANGE_ME@127.0.0.1:5432/marketcard
SECRET_KEY=CHANGE_ME_LONG_RANDOM_SECRET
APP_DEBUG=0
SQL_ECHO=0
FRONTEND_URL=https://marketcard.uz

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=CHANGE_ME_EMAIL
SMTP_PASSWORD=CHANGE_ME_APP_PASSWORD

GOOGLE_CLIENT_ID=CHANGE_ME_GOOGLE_OAUTH_CLIENT_ID
GOOGLE_CLIENT_SECRET=CHANGE_ME_GOOGLE_OAUTH_CLIENT_SECRET

SMS_WEBHOOK_URL=https://sms-provider.example/send
SMS_WEBHOOK_TOKEN=CHANGE_ME_SMS_PROVIDER_TOKEN

SOLIQ_IKPU_SEARCH_URLS=https://tasnif.soliq.uz/api/cl-api/classifier/search
SOLIQ_IKPU_TIMEOUT=18

MARKETCARD_IMAGE_MODE=template
PHOTOROOM_API_KEY=CHANGE_ME_OPTIONAL_CUTOUT_PROVIDER
CLIPDROP_API_KEY=CHANGE_ME_OPTIONAL_CUTOUT_PROVIDER
REMOVE_BG_API_KEY=CHANGE_ME_OPTIONAL_CUTOUT_PROVIDER

MARKETCARD_VIDEO_PROVIDER=local
MARKETCARD_GENERATED_VIDEO_DIR=/var/www/marketcard/generated_videos
BUDGET_VIDEO_API_URL=
BUDGET_VIDEO_API_KEY=
BUDGET_VIDEO_MODEL=image-to-video
BUDGET_VIDEO_STRICT=0

DIDOX_CLIENT_ID=CHANGE_ME_DIDOX_CLIENT_ID
DIDOX_CLIENT_SECRET=CHANGE_ME_DIDOX_CLIENT_SECRET
DIDOX_API_BASE=https://api.didox.uz
```

Как подключить внешний бюджетный video API:

1. Поставить `MARKETCARD_VIDEO_PROVIDER` в название провайдера, например `replicate`, `runway`, `luma` или свой шлюз.
2. В `BUDGET_VIDEO_API_URL` указать endpoint, который принимает multipart `image` и поля `model`, `prompt`, `title`, `marketplace`, `style`.
3. В `BUDGET_VIDEO_API_KEY` вставить ключ.
4. Если нужен строгий режим без локального fallback, поставить `BUDGET_VIDEO_STRICT=1`.

Локальный режим уже генерирует motion MP4 через `ffmpeg`, а если `ffmpeg` недоступен, делает GIF fallback.
