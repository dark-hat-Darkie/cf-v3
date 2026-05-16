import { sql } from "drizzle-orm";
import { connection } from "next/server";
import { db, hasDatabase } from "@/db/client";
import { users } from "@/db/schema";
import { LoginForm } from "@/components/admin/LoginForm";
import { BootstrapAdminForm } from "@/components/admin/BootstrapAdminForm";

type SearchParams = { from?: string };

async function countUsers(): Promise<number> {
  if (!hasDatabase()) return 0;
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(users);
  return n;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await connection();
  const { from } = await searchParams;
  const n = await countUsers();
  const noUsers = n === 0;

  return (
    <div className="adm-login-shell">
      <div className="adm-login-card">
        <div className="adm-login-brand">
          <div className="adm-side-brand-mark">CF</div>
          <div>
            <h1 className="adm-login-title">{noUsers ? "Welcome" : "Sign in"}</h1>
            <p className="adm-login-sub" style={{ margin: 0 }}>
              {noUsers ? "Create the first admin account" : "Codeflee Content Studio"}
            </p>
          </div>
        </div>
        {noUsers ? <BootstrapAdminForm /> : <LoginForm fromPath={from ?? null} />}
        <p className="adm-login-foot">
          {noUsers
            ? "This setup screen disappears after the first admin is created."
            : "Trouble logging in? Reset via direct DB access."}
        </p>
      </div>
    </div>
  );
}
