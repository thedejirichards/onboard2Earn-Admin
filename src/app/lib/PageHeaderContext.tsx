import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface PageHeaderValue {
  title: string;
  description?: string;
}

interface PageHeaderContextValue {
  pageHeader: PageHeaderValue | null;
  setPageHeader: (value: PageHeaderValue | null) => void;
}

const PageHeaderContext = createContext<PageHeaderContextValue | null>(null);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [pageHeader, setPageHeader] = useState<PageHeaderValue | null>(null);
  return (
    <PageHeaderContext.Provider value={{ pageHeader, setPageHeader }}>
      {children}
    </PageHeaderContext.Provider>
  );
}

// Read-only access for the layout shell that renders the current page's heading.
export function usePageHeaderValue() {
  const ctx = useContext(PageHeaderContext);
  if (!ctx) throw new Error("usePageHeaderValue must be used within PageHeaderProvider");
  return ctx.pageHeader;
}

// Called by each page to publish its title/description into the top navigation bar.
// Both arguments are plain strings, so the effect dependency array is safe from the
// "new object every render" trap that a JSX actions node would introduce.
export function usePageHeader(title: string, description?: string) {
  const ctx = useContext(PageHeaderContext);
  if (!ctx) throw new Error("usePageHeader must be used within PageHeaderProvider");
  const { setPageHeader } = ctx;

  useEffect(() => {
    setPageHeader({ title, description });
    return () => setPageHeader(null);
  }, [title, description, setPageHeader]);
}
