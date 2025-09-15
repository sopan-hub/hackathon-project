
'use client';

import { type ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset className="eco-sidebar m-0 md:m-2 !rounded-3xl">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
