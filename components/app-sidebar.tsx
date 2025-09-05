'use client';

import * as React from 'react';
import {
    ArrowUpCircleIcon,
    BarChartIcon,
    CameraIcon,
    ClipboardListIcon,
    DatabaseIcon,
    FileCodeIcon,
    FileIcon,
    FileTextIcon,
    FolderIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    ListIcon,
    SearchIcon,
    SettingsIcon,
    UsersIcon,
} from 'lucide-react';

import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
        {
            title: 'Dashboard',
            url: '#',
            icon: LayoutDashboardIcon,
        },
        {
            title: 'Lifecycle',
            url: '#',
            icon: ListIcon,
        },
        {
            title: 'Analytics',
            url: '#',
            icon: BarChartIcon,
        },
        {
            title: 'Projects',
            url: '#',
            icon: FolderIcon,
        },
        {
            title: 'Team',
            url: '#',
            icon: UsersIcon,
        },
    ],

    navClouds: [
        {
            title: 'Capture',
            icon: CameraIcon,
            isActive: true,
            url: '#',
            items: [
                {
                    title: 'Active Proposals',
                    url: '#',
                },
                {
                    title: 'Archived',
                    url: '#',
                },
            ],
        },
        {
            title: 'Proposal',
            icon: FileTextIcon,
            url: '#',
            items: [
                {
                    title: 'Active Proposals',
                    url: '#',
                },
                {
                    title: 'Archived',
                    url: '#',
                },
            ],
        },
        {
            title: 'Prompts',
            icon: FileCodeIcon,
            url: '#',
            items: [
                {
                    title: 'Active Proposals',
                    url: '#',
                },
                {
                    title: 'Archived',
                    url: '#',
                },
            ],
        },
    ],

    navSecondary: [
        {
            title: 'Settings',
            url: '#',
            icon: SettingsIcon,
        },
        {
            title: 'Get Help',
            url: '#',
            icon: HelpCircleIcon,
        },
        {
            title: 'Search',
            url: '#',
            icon: SearchIcon,
        },
    ],

    documents: [
        {
            name: 'Data Library',
            url: '#',
            icon: DatabaseIcon,
        },
        {
            name: 'Reports',
            url: '#',
            icon: ClipboardListIcon,
        },
        {
            name: 'Word Assistant',
            url: '#',
            icon: FileIcon,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props} data-oid="8fv44pz">
            <SidebarHeader data-oid="tn91x4q">
                <SidebarMenu data-oid="bguh297">
                    <SidebarMenuItem data-oid="pims1v3">
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                            data-oid="dgi:aez"
                        >
                            <a href="#" data-oid="2k7cpfy">
                                <ArrowUpCircleIcon className="h-5 w-5" data-oid="_8jnhy8" />
                                <span className="text-base font-semibold" data-oid="kyww:rd">
                                    Acme Inc.
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent data-oid="ynj4lcu">
                <NavMain items={data.navMain} data-oid="xijzxt3" />
                <NavDocuments items={data.documents} data-oid="wr:7.gm" />
                <NavSecondary items={data.navSecondary} className="mt-auto" data-oid="u7p-x01" />
            </SidebarContent>
            <SidebarFooter data-oid="kolc-5h">
                <NavUser user={data.user} data-oid="a8mulcw" />
            </SidebarFooter>
        </Sidebar>
    );
}
