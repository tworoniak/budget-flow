'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Receipt,
  Target,
  BarChart2,
  DollarSign,
  RefreshCw,
  Tag,
  Settings,
  LogOut,
  ChevronUp,
} from 'lucide-react'


import styles from './Sidebar.module.scss'

interface NavItemDef {
  to: string
  label: string
  icon: LucideIcon
  disabled?: true
}

interface NavSection {
  label: string
  items: NavItemDef[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Main',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/expenses', label: 'Expenses', icon: Receipt },
      { to: '/budget', label: 'Budgets', icon: Target },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/analytics', label: 'Analytics', icon: BarChart2, disabled: true },
      { to: '/income', label: 'Income', icon: DollarSign },
      { to: '/recurring', label: 'Recurring', icon: RefreshCw },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { to: '/categories', label: 'Categories', icon: Tag, disabled: true },
      { to: '/settings', label: 'Settings', icon: Settings, disabled: true },
    ],
  },
]

interface NavItemProps {
  to: string
  label: string
  icon: LucideIcon
  disabled?: boolean
}

function NavItem({ to, label, icon: Icon, disabled }: NavItemProps) {
  const pathname = usePathname()
  const isActive = to === '/' ? pathname === '/' : pathname === to

  if (disabled) {
    return (
      <span className={`${styles.navItem} ${styles.disabled}`}>
        <Icon size={15} className={styles.navIcon} />
        <span className={styles.navLabel}>{label}</span>
      </span>
    )
  }
  return (
    <Link href={to} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
      <Icon size={15} className={styles.navIcon} />
      <span className={styles.navLabel}>{label}</span>
    </Link>
  )
}

function getInitials(name: string | null | undefined): string {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function getAvatarColor(name: string | null | undefined): string {
  const colors = [
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #06b6d4, #6366f1)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #22c55e, #06b6d4)',
    'linear-gradient(135deg, #ec4899, #8b5cf6)',
  ]
  if (!name) return colors[0]
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}

export default function Sidebar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const userName = session?.user?.name ?? null
  const userEmail = session?.user?.email ?? null
  const userImage = session?.user?.image ?? null
  const initials = getInitials(userName)
  const avatarColor = getAvatarColor(userName)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>B</div>
        <span className={styles.logoText}>BudgetFlow</span>
      </div>

      <nav className={styles.nav}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className={styles.section}>
            <span className={styles.sectionLabel}>{section.label}</span>
            <div className={styles.sectionItems}>
              {section.items.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className={styles.bottomSection}>
        <div className={styles.trackCard}>
          <div className={styles.trackDot} />
          <div className={styles.trackText}>
            <span className={styles.trackLabel}>You're on track</span>
            <span className={styles.trackSub}>Spending is within budget</span>
          </div>
        </div>

        <div className={styles.profileWrapper} ref={menuRef}>
          {menuOpen && (
            <div className={styles.profileMenu}>
              <button
                className={styles.signOutBtn}
                onClick={() => signOut({ callbackUrl: '/sign-in' })}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
          <button
            className={styles.profileCard}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <div className={styles.avatar} style={{ background: userImage ? undefined : avatarColor }}>
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userImage}
                  alt={userName ?? 'User avatar'}
                  referrerPolicy="no-referrer"
                  className={styles.avatarImg}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              ) : (
                initials
              )}
            </div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>{userName ?? 'Account'}</span>
              <span className={styles.profileRole}>{userEmail ?? 'Personal'}</span>
            </div>
            <ChevronUp size={14} className={`${styles.chevron} ${menuOpen ? styles.chevronDown : ''}`} />
          </button>
        </div>
      </div>
    </aside>
  )
}
