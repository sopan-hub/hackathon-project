
'use client';

import Link from 'next/link';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';
import { useUserProgress } from '@/context/user-progress-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { Skeleton } from '../ui/skeleton';

export function Header({className}: {className?: string}) {
  const { userProfile, loading } = useUserProgress();
  
  return (
      <header className={cn("sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b-0 bg-transparent px-4 sm:px-6", className)}>
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1" />
         <div className="flex items-center gap-4">
          
        </div>
      </header>
  );
}
