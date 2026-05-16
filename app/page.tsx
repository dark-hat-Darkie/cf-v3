import { Suspense } from 'react';
import AppShell from '@/components/AppShell';
import BlogHomepage from '@/components/BlogHomepage';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AppShell blogSection={<BlogHomepage />} />
    </Suspense>
  );
}
