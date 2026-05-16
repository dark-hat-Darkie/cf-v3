"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/auth/actions";
import { Icon, type IconName } from "./icons";

type NavItem = { href: string; label: string; icon: IconName };

const NAV: { group?: string; items: NavItem[] }[] = [
  {
    items: [
      { href: "/admin", label: "Dashboard", icon: "Dashboard" },
      { href: "/admin/posts", label: "Posts", icon: "Posts" },
      { href: "/admin/media", label: "Media", icon: "Media" },
      { href: "/admin/seo-audit", label: "SEO audit", icon: "Audit" },
    ],
  },
  {
    group: "Taxonomy",
    items: [
      { href: "/admin/tags", label: "Tags", icon: "Tag" },
      { href: "/admin/categories", label: "Categories", icon: "Category" },
    ],
  },
  {
    group: "Site",
    items: [
      { href: "/admin/redirects", label: "Redirects", icon: "Redirect" },
      { href: "/admin/settings", label: "Settings", icon: "Settings" },
    ],
  },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function AdminSidebar({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="adm-side">
      <Link href="/admin" className="adm-side-brand">
        <div className="adm-side-brand-mark">CF</div>
        <div>
          <div className="adm-side-brand-text">Content Studio</div>
          <div className="adm-side-brand-sub">Codeflee</div>
        </div>
      </Link>

      <nav>
        {NAV.map((section, i) => (
          <div key={i}>
            {section.group ? <div className="adm-side-group">{section.group}</div> : null}
            {section.items.map((item) => {
              const IconCmp = Icon[item.icon];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`adm-side-link${isActive(item.href) ? " active" : ""}`}
                >
                  <IconCmp width={16} height={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="adm-side-foot">
        <div className="adm-side-user">
          <div className="adm-side-user-avatar">{initials(user.name)}</div>
          <div className="adm-side-user-meta adm-flex1 adm-truncate">
            <div className="adm-side-user-name adm-truncate">{user.name}</div>
            <div className="adm-side-user-email adm-truncate">{user.email}</div>
          </div>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="adm-btn adm-btn-ghost adm-btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
