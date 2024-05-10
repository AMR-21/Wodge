import { React } from "@repo/data";
import { atom, useAtom } from "jotai";
import { createContext, useContext, useState } from "react";
import * as Y from "yjs";

interface PageContextProps {
  doc?: Y.Doc;
  setDoc?: React.Dispatch<React.SetStateAction<Y.Doc | undefined>>;
}

const PageContext = createContext<PageContextProps>({});

export const PageProvider = ({ children }: { children: React.ReactNode }) => {
  const [doc, setDoc] = useState<Y.Doc | undefined>();

  return (
    <PageContext.Provider value={{ doc, setDoc }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageDoc = () => {
  const context = useContext(PageContext);

  if (context === undefined) {
    throw new Error("usePage must be used within a PageProvider");
  }

  return context;
};
