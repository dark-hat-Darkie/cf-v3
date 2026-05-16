"use client";

import { useEffect } from "react";

export function AdminBodyClass() {
  useEffect(() => {
    document.documentElement.classList.add("adm-html");
    document.body.classList.add("adm-body");
    return () => {
      document.documentElement.classList.remove("adm-html");
      document.body.classList.remove("adm-body");
    };
  }, []);
  return null;
}
