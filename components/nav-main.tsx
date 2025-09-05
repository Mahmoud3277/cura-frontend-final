'use client';

import { MailIcon, PlusCircleIcon, type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain({ items }: { items: { title: string; url: string; icon?: LucideIcon }[] }) {
    return (
        <SidebarGroup data-oid="b-o4:f6">
            <SidebarGroupContent className="flex flex-col gap-2" data-oid="my.xua4">
                <SidebarMenu data-oid="i9crsfo">
                    <SidebarMenuItem className="flex items-center gap-2" data-oid="7:1m.-h">
                        <SidebarMenuButton
                            tooltip="Quick Create"
                            className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                            data-oid="j_hs0w7"
                        >
                            <PlusCircleIcon data-oid="-j-4ava" />
                            <span data-oid=":56widb">Quick Create</span>
                        </SidebarMenuButton>
                        <Button
                            size="icon"
                            className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
                            variant="outline"
                            data-oid="kgwc2tg"
                        >
                            <MailIcon data-oid="o.h38ii" />
                            <span className="sr-only" data-oid="j2onf_l">
                                Inbox
                            </span>
                        </Button>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu data-oid="k0kmkk1">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title} data-oid="c_aq86z">
                            <SidebarMenuButton tooltip={item.title} data-oid="g_br4r-">
                                {item.icon && <item.icon data-oid="vtkk_-k" />}
                                <span data-oid="ikypg22">{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
