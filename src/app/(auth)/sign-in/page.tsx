'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import AuthLayout from '@/components/auth/AuthLayout'
import styles from '@/components/auth/AuthLayout.module.scss'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
)

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.705 17.64 9.2z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setServerError(null)
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    setIsLoading(false)
    if (result?.error) {
      setServerError('Invalid email or password. Please try again.')
    } else {
      router.push('/')
    }
  }

  return (
    <AuthLayout
      headline={['Welcome back.', 'Your money is waiting.']}
      subtitle="Track your spending, hit your goals, and take control of your finances — all in one place."
      testimonial={{
        quote: "BudgetFlow helped me save $300 in the first month just by making my spending patterns obvious.",
        name: "Marco T.",
        role: "Product Designer",
        initials: "MT",
      }}
    >
      <div className={styles.topNav}>
        <span>New to BudgetFlow?</span>
        <Link href="/register">Create an account →</Link>
      </div>

      <div className={styles.formContent}>
        <h1 className={styles.heading}>Log in to your account</h1>
        <p className={styles.subheading}>Welcome back — let's pick up where you left off.</p>

        <div className={styles.oauthButtons}>
          <button
            type="button"
            className={styles.oauthBtn}
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            <GoogleIcon />
            Continue with Google
          </button>
          <button
            type="button"
            className={styles.oauthBtn}
            onClick={() => signIn('github', { callbackUrl: '/' })}
          >
            <GitHubIcon />
            Continue with GitHub
          </button>
        </div>

        <div className={styles.divider}>
          <span>OR WITH EMAIL</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {serverError && <div className={styles.serverError}>{serverError}</div>}

          <div className={styles.field}>
            <label htmlFor="signin-email">Email address</label>
            <input
              id="signin-email"
              type="email"
              placeholder="you@example.com"
              className={styles.input}
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="signin-password">Password</label>
            <div className={styles.passwordWrapper}>
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={styles.input}
                autoComplete="current-password"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className={styles.fieldError}>{errors.password.message}</span>}
          </div>

          <div className={styles.formRow}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" />
              Remember me
            </label>
            <Link href="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className={styles.cta} disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Log in →'}
          </button>
        </form>

        <p className={styles.terms}>
          By signing in you agree to our{' '}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </AuthLayout>
  )
}
