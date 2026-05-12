import { createContext, useContext } from "react";

interface WorkspaceLayoutContextType {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  isMobile: boolean;
}

export const WorkspaceLayoutContext = createContext<
  WorkspaceLayoutContextType | undefined
>(undefined);

export function useWorkspaceLayout() {
  const context = useContext(WorkspaceLayoutContext);
  if (context === undefined) {
    throw new Error(
      "useWorkspaceLayout must be used within WorkspaceLayoutContext.Provider",
    );
  }
  return context;
}