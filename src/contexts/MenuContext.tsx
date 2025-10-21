import { createContext, useContext } from 'react';

interface MenuContextType {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  isMobile: boolean;
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within MenuContext.Provider');
  }
  return context;
}
