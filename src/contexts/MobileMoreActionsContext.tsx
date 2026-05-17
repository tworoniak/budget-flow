import { createContext, useContext } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';

export interface MobileMoreAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

export const MobileMoreActionsContext = createContext<Dispatch<SetStateAction<MobileMoreAction[]>>>(
  () => {}
);

export function useSetMobileMoreActions() {
  return useContext(MobileMoreActionsContext);
}
