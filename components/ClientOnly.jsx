/** @format */

"use client";

import { isEmpty } from "@/lib/utils/isEmpty";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UidContext } from "@/context/UidContext";
import Spinner from "./Spinner";
import useLogout from "@/lib/hooks/useLogout";

export default function ClientOnly({
  pr,
  home,
  children,
  spin,
  loadJWT,
  activeTopLoading,
}) {
  const { user } = useSelector((state) => state.user);
  const { isLoadingJWT, setLoadingBar } = useContext(UidContext);
  const isLogout = useLogout();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (activeTopLoading) {
      setLoadingBar(100);
    }
  }, []);

  useEffect(() => {
    if (mounted && activeTopLoading) {
      setTimeout(() => {
        setLoadingBar(0);
      }, 500);
    }
  }, [mounted]);

  if (typeof window === "undefined" || (pr && isEmpty(user))) {
    return null;
  } else if (!mounted && spin) {
    return <Spinner />;
  } else if ((loadJWT && isLoadingJWT) || (home && isEmpty(user))) {
    if (isLogout.isActive) return null;
    return <Spinner sans />;
  } else if (!mounted) return null;

  return <>{children}</>;
}
