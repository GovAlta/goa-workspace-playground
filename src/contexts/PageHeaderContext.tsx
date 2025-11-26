import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PageHeaderContextType {
  title: string;
  actions?: ReactNode;
  setHeader: (title: string, actions?: ReactNode) => void;
}

const PageHeaderContext = createContext<PageHeaderContextType | undefined>(undefined);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('');
  const [actions, setActions] = useState<ReactNode>(undefined);

  const setHeader = (newTitle: string, newActions?: ReactNode) => {
    setTitle(newTitle);
    setActions(newActions);
  };

  return (
    <PageHeaderContext.Provider value={{ title, actions, setHeader }}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeader(title: string, actions?: ReactNode) {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error('usePageHeader must be used within PageHeaderProvider');
  }

  useEffect(() => {
    context.setHeader(title, actions);
  }, [title, actions]);
}

export function usePageHeaderContext() {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error('usePageHeaderContext must be used within PageHeaderProvider');
  }
  return context;
}
