
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { navItems } from '@/lib/data';
import { Icons } from '@/components/icons';
import { useUserProgress } from '@/context/user-progress-context';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function SidebarNav() {
  const pathname = usePathname();
  const { userProfile } = useUserProgress();

  return (
    <>
      <SidebarHeader className="p-2">
        <Link href="/" className="flex items-center gap-2 p-2">
          <Icons.leaf className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight font-headline text-foreground">
            EcoChallenge
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
           )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='p-2'>
        {userProfile && (
          <div className="flex items-center gap-3 p-2 rounded-md bg-secondary/50">
             <Avatar className="h-8 w-8">
                <AvatarImage src={userProfile.avatar_url} alt={userProfile.full_name} />
                <AvatarFallback>{userProfile.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className='flex-1 overflow-hidden'>
                <p className='text-sm font-semibold truncate'>{userProfile.full_name}</p>
                 <p className="text-xs text-muted-foreground truncate">{userProfile.email}</p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </>
  );
}
