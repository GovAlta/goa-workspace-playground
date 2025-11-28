import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PageHeaderContextType {
  title: string;
  setTitle: (title: string) => void;
  actions: ReactNode;
  setActions: (actions: ReactNode) => void;
}

const PageHeaderContext = createContext<PageHeaderContextType | undefined>(undefined);

interface PageHeaderProviderProps {
  children: ReactNode;
}

export function PageHeaderProvider({ children }: PageHeaderProviderProps) {
  const [title, setTitle] = useState<string>('');
  const [actions, setActions] = useState<ReactNode>(null);

  return (
    <PageHeaderContext.Provider value={{ title, setTitle, actions, setActions }}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeaderContext() {
  const context = useContext(PageHeaderContext);
  if (context === undefined) {
    throw new Error('usePageHeaderContext must be used within a PageHeaderProvider');
  }
  return context;
}

// Hook for pages to set their header title and actions
export function usePageHeader(title: string, actions?: ReactNode) {
  const { setTitle, setActions } = usePageHeaderContext();

  useEffect(() => {
    setTitle(title);
    setActions(actions || null);

    // Clean up on unmount
    return () => {
      setTitle('');
      setActions(null);
    };
  }, [title, actions, setTitle, setActions]);
}
