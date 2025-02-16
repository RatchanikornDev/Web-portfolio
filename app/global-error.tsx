'use client'

import * as Sentry from '@sentry/nextjs'
import NextError from 'next/error'
import { useEffect } from 'react'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    // ส่งข้อผิดพลาดไปยัง Sentry
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong...</h1>
          <p>Our team has been notified of the issue and will look into it.</p>
        </div>
        {/* ถ้าต้องการให้ NextError ควบคุมการแสดงข้อผิดพลาดเพิ่มเติม */}
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
