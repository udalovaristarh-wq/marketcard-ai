"use client"

import { Suspense } from "react"
import ResetPasswordInner from "./reset-inner"

export default function Page() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <ResetPasswordInner />
    </Suspense>
  )
}
