'use client';

import {
    BellIcon,
    CreditCardIcon,
    LogOutIcon,
    MoreVerticalIcon,
    UserCircleIcon,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

export function NavUser({ user }: { user: { name: string; email: string; avatar: string } }) {
    const { isMobile } = useSidebar();

    return (
        <SidebarMenu data-oid="3.8pjrj">
            <SidebarMenuItem data-oid="dirkpne">
                <DropdownMenu data-oid="98n.d__">
                    <DropdownMenuTrigger asChild data-oid="9rnn2io">
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            data-oid="-9yinja"
                        >
                            <Avatar className="h-8 w-8 rounded-lg grayscale" data-oid="a67f74x">
                                <AvatarImage src={user.avatar} alt={user.name} data-oid="0zhohst" />
                                <AvatarFallback className="rounded-lg" data-oid="fxyaxc-">
                                    CN
                                </AvatarFallback>
                            </Avatar>
                            <div
                                className="grid flex-1 text-left text-sm leading-tight"
                                data-oid="5j8xx1t"
                            >
                                <span className="truncate font-medium" data-oid="t8um.v1">
                                    {user.name}
                                </span>
                                <span
                                    className="truncate text-xs text-muted-foreground"
                                    data-oid="43n6:s6"
                                >
                                    {user.email}
                                </span>
                            </div>
                            <MoreVerticalIcon className="ml-auto size-4" data-oid="ujkj53:" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                        data-oid="j-dcrgg"
                    >
                        <DropdownMenuLabel className="p-0 font-normal" data-oid="y1rp7l.">
                            <div
                                className="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
                                data-oid="r7r5q.3"
                            >
                                <Avatar className="h-8 w-8 rounded-lg" data-oid="usxu1r4">
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={user.name}
                                        data-oid="cd.ne60"
                                    />

                                    <AvatarFallback className="rounded-lg" data-oid="3fovygf">
                                        CN
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className="grid flex-1 text-left text-sm leading-tight"
                                    data-oid="zew2-c."
                                >
                                    <span className="truncate font-medium" data-oid="_.oyq_h">
                                        {user.name}
                                    </span>
                                    <span
                                        className="truncate text-xs text-muted-foreground"
                                        data-oid="jkuowjz"
                                    >
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator data-oid="wizzbuw" />
                        <DropdownMenuGroup data-oid="kkj1_9g">
                            <DropdownMenuItem data-oid="1ozkdy4">
                                <UserCircleIcon data-oid="x6vcc5q" />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem data-oid="0y9:ax3">
                                <CreditCardIcon data-oid="jzj545j" />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem data-oid="7cystw:">
                                <BellIcon data-oid="i9ywnm1" />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator data-oid="uiby9wz" />
                        <DropdownMenuItem data-oid="lv3gm.d">
                            <LogOutIcon data-oid="w-og.xy" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
