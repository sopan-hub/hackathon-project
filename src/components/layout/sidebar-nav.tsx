
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { navItems } from '@/lib/data';
import { Icons } from '@/components/icons';
import { useUserProgress } from '@/context/user-progress-context';

export function SidebarNav() {
  const pathname = usePathname();
  const { userProfile } = useUserProgress();

  return (
    <>
      
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
        
      </SidebarFooter>
    </>
  );
}
