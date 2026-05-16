import { Suspense, type ReactNode } from "react";
import "../admin.css";
import { AdminBodyClass } from "@/components/admin/AdminBodyClass";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminBodyClass />
      <Suspense
        fallback={
          <div className="adm" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
            <span className="adm-spinner" />
          </div>
        }
      >
        {children}
      </Suspense>
    </>
  );
}
