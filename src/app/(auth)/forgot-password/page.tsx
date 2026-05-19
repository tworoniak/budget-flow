'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { ArrowLeft, Info, CheckCircle } from 'lucide-react'
import AuthLayout from '@/components/auth/AuthLayout'
import styles from '@/components/auth/AuthLayout.module.scss'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    // Simulate async delay — actual email delivery is a future feature
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSubmittedEmail(data.email)
    setSubmitted(true)
    setIsLoading(false)
  }

  return (
    <AuthLayout
      headline={['Forgot your password?', 'No drama — let\'s reset it.']}
      subtitle="Enter your email and we'll send you a reset link. You'll be back in your dashboard in minutes."
      testimonial={{
        quote: "The onboarding took less than 5 minutes and I had my first month's budget set up before my morning coffee was done.",
        name: "James L.",
        role: "Software Engineer",
        initials: "JL",
      }}
    >
      <div className={styles.formContent} style={{ justifyContent: 'center' }}>
        <Link href="/sign-in" className={styles.backLink}>
          <ArrowLeft size={15} />
          Back to log in
        </Link>

        {submitted ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <CheckCircle size={26} />
            </div>
            <h1 className={styles.successTitle}>Check your inbox</h1>
            <p className={styles.successText}>
              We sent a reset link to <strong>{submittedEmail}</strong>. It expires in 30 minutes.
            </p>
            <p className={styles.successText} style={{ marginTop: '0.5rem' }}>
              Didn't get it? Check your spam folder or{' '}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}
              >
                try a different email
              </button>
              .
            </p>
          </div>
        ) : (
          <>
            <h1 className={styles.heading}>Reset your password</h1>
            <p className={styles.subheading}>
              Enter the email address associated with your account.
            </p>

            <div className={styles.infoNote}>
              <Info size={16} />
              <p>The reset link expires after 30 minutes. Check your spam folder if it doesn't arrive within a few minutes.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className={styles.field}>
                <label htmlFor="fp-email">Email address</label>
                <input
                  id="fp-email"
                  type="email"
                  placeholder="you@example.com"
                  className={styles.input}
                  autoComplete="email"
                  {...register('email')}
                />
                {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
              </div>

              <button type="submit" className={styles.cta} disabled={isLoading}>
                {isLoading ? 'Sending…' : 'Send reset link →'}
              </button>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
