import {
  UtensilsCrossed, Car, Home, Music, Heart, ShoppingBag, Zap, Tag,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CategoryConfig {
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  Food:          { icon: UtensilsCrossed, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  Transport:     { icon: Car,             color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  Housing:       { icon: Home,            color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)'  },
  Entertainment: { icon: Music,           color: '#ec4899', bg: 'rgba(236,72,153,0.12)'  },
  Healthcare:    { icon: Heart,           color: '#22c55e', bg: 'rgba(34,197,94,0.12)'   },
  Shopping:      { icon: ShoppingBag,     color: '#f97316', bg: 'rgba(249,115,22,0.12)'  },
  Utilities:     { icon: Zap,             color: '#06b6d4', bg: 'rgba(6,182,212,0.12)'   },
  Other:         { icon: Tag,             color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
};
