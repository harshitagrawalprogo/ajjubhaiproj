import React, { createContext, useState } from "react";
import {
  governanceTabs,
  type GovernanceMember,
  type GovernanceTabId,
} from "@/data/governance";

interface GovernanceContextType {
  activeTab: GovernanceTabId;
  setActiveTab: (tab: GovernanceTabId) => void;
  activeData: GovernanceMember[];
  tabs: typeof governanceTabs;
}

const GovernanceContext = createContext<GovernanceContextType | undefined>(undefined);

export function GovernanceProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<GovernanceTabId>(governanceTabs[0].id);
  const activeData = governanceTabs.find((t) => t.id === activeTab)?.data || [];

  return (
    <GovernanceContext.Provider
      value={{ activeTab, setActiveTab, activeData, tabs: governanceTabs }}
    >
      {children}
    </GovernanceContext.Provider>
  );
}
