
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarMenuSkeleton, SidebarHeader, SidebarContent } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';
import { Icons } from '../icons';

export function AppLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <SidebarProvider>
      {mounted ? (
        <Sidebar>
          <SidebarNav />
        </Sidebar>
      ) : (
         <div className="hidden md:block text-sidebar-foreground w-[16rem] p-2">
            <div className="flex h-full w-full flex-col bg-background/80 backdrop-blur-sm rounded-lg border">
                 <SidebarHeader>
                    <div className="flex items-center gap-2">
                      <Icons.leaf className="h-8 w-8 text-primary" />
                      <span className="text-xl font-bold tracking-tight font-headline text-foreground">
                        EcoChallenge
                      </span>
                    </div>
                </SidebarHeader>
                <SidebarContent className="p-2">
                    <div className="flex flex-col gap-1">
                        <SidebarMenuSkeleton showIcon />
                        <SidebarMenuSkeleton showIcon />
                        <SidebarMenuSkeleton showIcon />
                        <SidebarMenuSkeleton showIcon />
                        <SidebarMenuSkeleton showIcon />
                         <SidebarMenuSkeleton showIcon />
                        <SidebarMenuSkeleton showIcon />
                        <SidebarMenuSkeleton showIcon />
                    </div>
                </SidebarContent>
            </div>
         </div>
      )}
      <SidebarInset>
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
