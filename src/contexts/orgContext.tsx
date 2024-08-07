"use client";

import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import { Organisation } from "~/types";
import { getAllOrg, getSubCount } from "../actions/organization";

interface OrgContextProperties {
  organizations: Organisation[];
  isLoading: boolean;
  subscriptionCount: number | undefined;
}

export const OrgContext = createContext({} as OrgContextProperties);

const OrgContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [organizations, setOrganizations] = useState<Organisation[]>([]);
  const [isLoading, startTransition] = useTransition();
  const [subscriptionCount, setSubscriptionCount] = useState<
    number | undefined
  >();

  useLayoutEffect(() => {
    startTransition(() => {
      getAllOrg().then((data) => {
        setOrganizations(data.organization);
      });
      getSubCount().then((subResponse) => {
        setSubscriptionCount(subResponse.sub);
      });
    });
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      organizations,
      subscriptionCount,
    }),
    [isLoading, subscriptionCount, organizations],
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
};

export const useOrgContext = () => {
  const context = useContext(OrgContext);

  if (!context) {
    throw new Error("useOrgContext must be used within a OrgContextProvider");
  }
  return context;
};

export default OrgContextProvider;
