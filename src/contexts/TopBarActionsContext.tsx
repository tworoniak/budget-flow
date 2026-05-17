import { createContext, useContext, type Dispatch, type SetStateAction, type ReactNode } from 'react';

export const TopBarActionsContext = createContext<Dispatch<SetStateAction<ReactNode>>>(
  () => {}
);

export function useSetTopBarActions() {
  return useContext(TopBarActionsContext);
}
