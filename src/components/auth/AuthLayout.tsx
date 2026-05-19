'use client'

import type { ReactNode } from 'react'
import styles from './AuthLayout.module.scss'

interface TestimonialData {
  quote: string
  name: string
  role: string
  initials: string
}

interface AuthLayoutProps {
  headline: [string, string]
  subtitle: string
  testimonial: TestimonialData
  children: ReactNode
}

export default function AuthLayout({ headline, subtitle, testimonial, children }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.panelLogo}>
          <div className={styles.logoMark}>B</div>
          <span className={styles.logoText}>BudgetFlow</span>
        </div>

        <div className={styles.heroSection}>
          <h1 className={styles.headline}>
            {headline[0]}
            <span>{headline[1]}</span>
          </h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.testimonial}>
          <p className={styles.testimonialQuote}>{testimonial.quote}</p>
          <div className={styles.testimonialAuthor}>
            <div className={styles.testimonialAvatar}>{testimonial.initials}</div>
            <div>
              <div className={styles.testimonialName}>{testimonial.name}</div>
              <div className={styles.testimonialRole}>{testimonial.role}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>{children}</div>
    </div>
  )
}
