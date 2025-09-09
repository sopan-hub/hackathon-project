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
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { navItems } from '@/lib/data';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
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
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <SidebarSeparator />
         <div className="p-4 rounded-lg bg-secondary/50 mt-2 space-y-4">
            <div>
                <h3 className="font-semibold text-foreground">Upgrade to Pro</h3>
                <p className="text-sm text-muted-foreground mt-1">Unlock all features and get access to exclusive content.</p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                    <Icons.lightbulb className="h-4 w-4 text-primary" />
                    <span>AI-Powered Personal Eco-Coach</span>
                </li>
                 <li className="flex items-center gap-2">
                    <Icons.star className="h-4 w-4 text-primary" />
                    <span>Exclusive Masterclass Content</span>
                </li>
                 <li className="flex items-center gap-2">
                    <Icons.barChart className="h-4 w-4 text-primary" />
                    <span>Advanced Impact Tracking</span>
                </li>
            </ul>
            <Button size="sm" className="w-full mt-4 bg-primary hover:bg-primary/90">Upgrade</Button>
         </div>
      </SidebarFooter>
    </>
  );
}
