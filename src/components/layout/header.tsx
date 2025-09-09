
'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';

export function Header({className}: {className?: string}) {
  return (
    <header className={cn("sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6", className)}>
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1" />
    </header>
  );
}
