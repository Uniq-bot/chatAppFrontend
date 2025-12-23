"use client";

import React, { createContext, useMemo } from "react";
import { usePathname } from "next/navigation";

export const LocationContext = createContext({ pathname: "/", isHome: true });

export default function LocationProvider({ children }) {
  const pathname = usePathname();
  const value = useMemo(
    () => ({ pathname, isHome: pathname === "/" }),
    [pathname]
  );

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
}
