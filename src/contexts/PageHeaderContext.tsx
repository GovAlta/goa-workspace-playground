import React, { createContext, useContext, useState, useLayoutEffect, useMemo, ReactNode } from 'react';

interface PageHeaderValuesType {
  title: string;
  actions?: ReactNode;
  tabs?: ReactNode;
}

interface PageHeaderSettersType {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setActions: React.Dispatch<React.SetStateAction<ReactNode>>;
  setTabs: React.Dispatch<React.SetStateAction<ReactNode>>;
}

// Separate contexts - setters are stable, values change
const PageHeaderSettersContext = createContext<PageHeaderSettersType | undefined>(undefined);
const PageHeaderValuesContext = createContext<PageHeaderValuesType | undefined>(undefined);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('');
  const [actions, setActions] = useState<ReactNode>(undefined);
  const [tabs, setTabs] = useState<ReactNode>(undefined);

  // Setters are stable - this object never changes
  const setters = useMemo(() => ({
    setTitle,
    setActions,
    setTabs,
  }), []);

  // Values change when state changes
  const values = useMemo(() => ({
    title,
    actions,
    tabs,
  }), [title, actions, tabs]);

  return (
    <PageHeaderSettersContext.Provider value={setters}>
      <PageHeaderValuesContext.Provider value={values}>
        {children}
      </PageHeaderValuesContext.Provider>
    </PageHeaderSettersContext.Provider>
  );
}

interface UsePageHeaderOptions {
  actions?: ReactNode;
  tabs?: ReactNode;
}

export function usePageHeader(title: string, options?: UsePageHeaderOptions | ReactNode) {
  // Only use setters context - this won't cause re-renders when values change
  const setters = useContext(PageHeaderSettersContext);
  if (!setters) {
    throw new Error('usePageHeader must be used within PageHeaderProvider');
  }

  // Support both old signature (title, actions) and new signature (title, { actions, tabs })
  const isOptionsObject = options && typeof options === 'object' && ('actions' in options || 'tabs' in options);
  const actions = isOptionsObject ? (options as UsePageHeaderOptions).actions : options as ReactNode;
  const tabs = isOptionsObject ? (options as UsePageHeaderOptions).tabs : undefined;

  // Update context when values change - setters are stable so no loop
  useLayoutEffect(() => {
    setters.setTitle(title);
  }, [title, setters]);

  useLayoutEffect(() => {
    setters.setActions(actions);
  }, [actions, setters]);

  useLayoutEffect(() => {
    setters.setTabs(tabs);
  }, [tabs, setters]);
}

export function usePageHeaderContext() {
  // Only use values context - for components that display the header
  const values = useContext(PageHeaderValuesContext);
  if (!values) {
    throw new Error('usePageHeaderContext must be used within PageHeaderProvider');
  }
  return values;
}
