# MarketCard AI frontend environment

Секреты сюда не кладем. Только публичные переменные Next.js.

```env
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=CHANGE_ME_GOOGLE_OAUTH_CLIENT_ID
```

`NEXT_PUBLIC_GOOGLE_CLIENT_ID` должен совпадать с `GOOGLE_CLIENT_ID` в `backend/.env`, иначе Google вход/регистрация не пройдут проверку audience на backend.
