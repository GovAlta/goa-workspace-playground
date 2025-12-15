import React, { createContext, useContext, useState, useLayoutEffect, useMemo, ReactNode } from 'react';

interface PageHeaderValuesType {
  title: string;
  actions?: ReactNode;
  tabs?: ReactNode;
  toolbar?: ReactNode; // Search, sort, filter controls that appear in collapsed header
  hideTitleOnScroll?: boolean; // Hide title when header is collapsed
}

interface PageHeaderSettersType {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setActions: React.Dispatch<React.SetStateAction<ReactNode>>;
  setTabs: React.Dispatch<React.SetStateAction<ReactNode>>;
  setToolbar: React.Dispatch<React.SetStateAction<ReactNode>>;
  setHideTitleOnScroll: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

// Separate contexts - setters are stable, values change
const PageHeaderSettersContext = createContext<PageHeaderSettersType | undefined>(undefined);
const PageHeaderValuesContext = createContext<PageHeaderValuesType | undefined>(undefined);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('');
  const [actions, setActions] = useState<ReactNode>(undefined);
  const [tabs, setTabs] = useState<ReactNode>(undefined);
  const [toolbar, setToolbar] = useState<ReactNode>(undefined);
  const [hideTitleOnScroll, setHideTitleOnScroll] = useState<boolean | undefined>(undefined);

  // Setters are stable - this object never changes
  const setters = useMemo(() => ({
    setTitle,
    setActions,
    setTabs,
    setToolbar,
    setHideTitleOnScroll,
  }), []);

  // Values change when state changes
  const values = useMemo(() => ({
    title,
    actions,
    tabs,
    toolbar,
    hideTitleOnScroll,
  }), [title, actions, tabs, toolbar, hideTitleOnScroll]);

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
  toolbar?: ReactNode; // Search, sort, filter controls
  hideTitleOnScroll?: boolean; // Hide title when header is collapsed
}

export function usePageHeader(title: string, options?: UsePageHeaderOptions | ReactNode) {
  // Only use setters context - this won't cause re-renders when values change
  const setters = useContext(PageHeaderSettersContext);
  if (!setters) {
    throw new Error('usePageHeader must be used within PageHeaderProvider');
  }

  // Support both old signature (title, actions) and new signature (title, { actions, tabs, toolbar, hideTitleOnScroll })
  const isOptionsObject = options && typeof options === 'object' && ('actions' in options || 'tabs' in options || 'toolbar' in options || 'hideTitleOnScroll' in options);
  const actions = isOptionsObject ? (options as UsePageHeaderOptions).actions : options as ReactNode;
  const tabs = isOptionsObject ? (options as UsePageHeaderOptions).tabs : undefined;
  const toolbar = isOptionsObject ? (options as UsePageHeaderOptions).toolbar : undefined;
  const hideTitleOnScroll = isOptionsObject ? (options as UsePageHeaderOptions).hideTitleOnScroll : undefined;

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

  useLayoutEffect(() => {
    setters.setToolbar(toolbar);
  }, [toolbar, setters]);

  useLayoutEffect(() => {
    setters.setHideTitleOnScroll(hideTitleOnScroll);
  }, [hideTitleOnScroll, setters]);
}

export function usePageHeaderContext() {
  // Only use values context - for components that display the header
  const values = useContext(PageHeaderValuesContext);
  if (!values) {
    throw new Error('usePageHeaderContext must be used within PageHeaderProvider');
  }
  return values;
}
