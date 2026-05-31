# Deploy checklist (MarketCard AI)

## Payments — required environment variables

### Payme

| Variable | Description |
|----------|-------------|
| `PAYME_MERCHANT_ID` | Merchant ID from Payme Business |
| `PAYME_SECRET_KEY` | Secret key for Basic auth on callbacks |
| `PAYME_BASE_URL` | Optional, default `https://checkout.paycom.uz` |

Callback URL (configure in Payme cabinet): `https://marketcard.uz/api/payments/payme/callback`

### Click

| Variable | Description |
|----------|-------------|
| `CLICK_SERVICE_ID` | Service ID |
| `CLICK_MERCHANT_ID` | Merchant ID |
| `CLICK_SECRET_KEY` | Secret for signature verification on callbacks |

Callback URL: `https://marketcard.uz/api/payments/click/callback`

## Backend

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (required on production) |
| `DEBUG` | Set `0` on production |
| `CORS_EXTRA_ORIGINS` | Comma-separated extra origins |
| `GENERATED_CARDS_DIR` | Path for generated images (default `/var/www/marketcard/generated_cards`) |
| `GENERATED_REPORTS_DIR` | Path for reports |
| `TEMP_DIR` | Temp uploads directory |
| `FRONTEND_URL` | Used in auth emails, default `https://marketcard.uz` |

## Frontend

| Variable | Description |
|----------|-------------|
| `API_ORIGIN` | Backend base URL for Next.js rewrites (e.g. `http://127.0.0.1:8000`) |

## Tariff prices (UZS)

| Plan | Price | Generations |
|------|-------|-------------|
| Start | 249 000 | 20 |
| Business | 799 000 | 60 |
| Premium | 1 900 000 | 200 |

Demo on landing is free; paid plans are activated after Payme/Click payment.

## Server update (git pull)

```bash
cd /path/to/marketcard-ai-main/marketcard-ai-main
git pull origin main
# backend
cd backend && source venv/bin/activate && pip install -r requirements.txt
sudo systemctl restart marketcard-api marketcard-worker  # your unit names
# frontend
cd ../frontend && npm ci && npm run build
sudo systemctl restart marketcard-frontend
```

Set `JWT_SECRET_KEY`, `DATABASE_URL`, and payment env vars before restart.

## Not in this release (planned)

- Alembic migrations (still `create_all` on startup)
- Subscription / auto-renewal billing
- Full refund UX
- Visa card payments
