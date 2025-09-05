'use client';

import * as React from 'react';
import { LucideIcon } from 'lucide-react';

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavSecondary({
    items,
    ...props
}: { items: { title: string; url: string; icon: LucideIcon }[] } & React.ComponentPropsWithoutRef<
    typeof SidebarGroup
>) {
    return (
        <SidebarGroup {...props} data-oid=":foeezs">
            <SidebarGroupContent data-oid="1g7-nq2">
                <SidebarMenu data-oid="w4.t.5j">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title} data-oid="nqbgagz">
                            <SidebarMenuButton asChild data-oid="t:apxon">
                                <a href={item.url} data-oid="ed-s68g">
                                    <item.icon data-oid="editc:l" />
                                    <span data-oid="zd81fc:">{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
