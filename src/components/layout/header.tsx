
'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';
import { useUserProgress } from '@/context/user-progress-context';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export function Header({className}: {className?: string}) {
  const { setChatOpen } = useUserProgress();
  
  return (
      <header className={cn("eco-surface sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 px-4 sm:px-6", className)}>
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1" />
         <div className="flex items-center gap-4">
          <Button variant="outline">Sign In</Button>
          <Button>Login</Button>
          <Button variant="outline" onClick={() => setChatOpen(true)}>
            <Icons.bot className="mr-2 h-4 w-4" />
            AI Chat
          </Button>
        </div>
      </header>
  );
}
