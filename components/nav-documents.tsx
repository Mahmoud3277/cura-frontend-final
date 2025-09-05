'use client';

import { FolderIcon, MoreHorizontalIcon, ShareIcon, type LucideIcon } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

export function NavDocuments({
    items,
}: {
    items: { name: string; url: string; icon: LucideIcon }[];
}) {
    const { isMobile } = useSidebar();

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden" data-oid="b7hezl1">
            <SidebarGroupLabel data-oid="8b07-pj">Documents</SidebarGroupLabel>
            <SidebarMenu data-oid="ug7r6y9">
                {items.map((item) => (
                    <SidebarMenuItem key={item.name} data-oid="33der37">
                        <SidebarMenuButton asChild data-oid="87ima3a">
                            <a href={item.url} data-oid="ptmgzbl">
                                <item.icon data-oid="tad32kw" />
                                <span data-oid="hhvwnzx">{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                        <DropdownMenu data-oid="ujcmpx2">
                            <DropdownMenuTrigger asChild data-oid="3ac9z3p">
                                <SidebarMenuAction
                                    showOnHover
                                    className="rounded-sm data-[state=open]:bg-accent"
                                    data-oid="eqrh1d6"
                                >
                                    <MoreHorizontalIcon data-oid="-:r9lbu" />
                                    <span className="sr-only" data-oid="opi6cnt">
                                        More
                                    </span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-24 rounded-lg"
                                side={isMobile ? 'bottom' : 'right'}
                                align={isMobile ? 'end' : 'start'}
                                data-oid="mk:6rhf"
                            >
                                <DropdownMenuItem data-oid="2g65dl0">
                                    <FolderIcon data-oid="kvysib." />
                                    <span data-oid="vat1bsv">Open</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem data-oid="pka26eg">
                                    <ShareIcon data-oid="y1yyodn" />
                                    <span data-oid="t.tjmzn">Share</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem data-oid="5ugaf2s">
                    <SidebarMenuButton className="text-sidebar-foreground/70" data-oid="d148v-1">
                        <MoreHorizontalIcon
                            className="text-sidebar-foreground/70"
                            data-oid="5k4r8g0"
                        />

                        <span data-oid="zl4i8p3">More</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
