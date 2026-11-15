import type { ReactNode } from 'react';
import './legal.css';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="cf-legal">
      <div className="cf-legal-main">{children}</div>
    </div>
  );
}
