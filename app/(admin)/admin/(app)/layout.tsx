import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

async function SessionGate({ children }: { children: ReactNode }) {
  const sess = await getCurrentSession();
  if (!sess) redirect("/admin/login");
  return (
    <div className="adm adm-shell">
      <AdminSidebar user={{ name: sess.user.name, email: sess.user.email }} />
      <div className="adm-main">{children}</div>
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="adm" style={{ minHeight: "100vh" }} />}>
      <SessionGate>{children}</SessionGate>
    </Suspense>
  );
}
