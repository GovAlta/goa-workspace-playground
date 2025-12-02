import React, { createContext, useContext, useState, useLayoutEffect, useRef, useMemo, ReactNode } from 'react';

interface PageHeaderContextType {
  title: string;
  actions?: ReactNode;
}

interface PageHeaderContextInternalType extends PageHeaderContextType {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setActions: React.Dispatch<React.SetStateAction<ReactNode>>;
}

const PageHeaderContext = createContext<PageHeaderContextInternalType | undefined>(undefined);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('');
  const [actions, setActions] = useState<ReactNode>(undefined);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    title,
    actions,
    setTitle,
    setActions,
  }), [title, actions]);

  return (
    <PageHeaderContext.Provider value={contextValue}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeader(title: string, actions?: ReactNode) {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error('usePageHeader must be used within PageHeaderProvider');
  }

  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  useLayoutEffect(() => {
    context.setTitle(title);
    context.setActions(actionsRef.current);
  }, [title]);
}

export function usePageHeaderContext() {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error('usePageHeaderContext must be used within PageHeaderProvider');
  }
  return {
    title: context.title,
    actions: context.actions,
  };
}
