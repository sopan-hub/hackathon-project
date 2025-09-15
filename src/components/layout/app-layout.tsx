
'use client';

import { type ReactNode, useState, useEffect } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarMenuSkeleton } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';

export function AppLayout({ children }: { children: ReactNode }) {
    
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
