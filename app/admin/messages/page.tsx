'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    messageService,
    Message,
    MessageStats,
    MessageFilters,
} from '@/lib/services/messageService';

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [stats, setStats] = useState<MessageStats | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [readFilter, setReadFilter] = useState('all');

    useEffect(() => {
        loadMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, typeFilter, categoryFilter, readFilter]);

    const loadMessages = () => {
        setIsLoading(true);

        const filters: MessageFilters = {};
        if (searchTerm) filters.search = searchTerm;
        if (typeFilter !== 'all') filters.type = typeFilter;
        if (categoryFilter !== 'all') filters.category = categoryFilter;
        if (readFilter !== 'all') filters.isRead = readFilter === 'read';

        const filteredMessages = messageService.getMessages(filters);
        const messageStats = messageService.getMessageStats();

        setMessages(filteredMessages);
        setStats(messageStats);
        setIsLoading(false);
    };

    const handleMessageSelect = (message: Message) => {
        setSelectedMessage(message);
        if (!message.isRead) {
            messageService.markAsRead(message.id);
            loadMessages(); // Refresh to update read status
        }
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getMessageTypeIcon = (type: string) => {
        switch (type) {
            case 'contact_form':
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="n9m6_5r"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.544-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                            data-oid="c8427.6"
                        />
                    </svg>
                );

            case 'pharmacy_registration':
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="jgthwds"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            data-oid="b.seggy"
                        />
                    </svg>
                );

            default:
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="gsa-4aa"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            data-oid="j4ydlw5"
                        />
                    </svg>
                );
        }
    };

    const getStatusIcon = (isRead: boolean) => {
        if (isRead) {
            return (
                <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="gzva7ky"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        data-oid="_2qfmfm"
                    />
                </svg>
            );
        } else {
            return (
                <svg
                    className="w-4 h-4 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="-tfeekb"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        data-oid="mh-clzj"
                    />
                </svg>
            );
        }
    };

    if (isLoading && !stats) {
        return (
            <div className="space-y-6" data-oid="tqw0ye1">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="hhgx:2e">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-200 animate-pulse rounded-xl h-32"
                            data-oid="cmwv:3j"
                        />
                    ))}
                </div>
                <div className="bg-gray-200 animate-pulse rounded-xl h-96" data-oid="i-_kqqx" />
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="-wn6a1y">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="4jav-7z">
                <Card
                    className="bg-gradient-to-br from-[#14274E] to-[#394867] text-white"
                    data-oid="dm0wri3"
                >
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="71wfaqo"
                    >
                        <CardTitle className="text-sm font-medium opacity-90" data-oid="vfw:b.0">
                            Total Messages
                        </CardTitle>
                        <svg
                            className="h-4 w-4 opacity-90"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="yg63y4o"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                data-oid="yzg6lv3"
                            />
                        </svg>
                    </CardHeader>
                    <CardContent data-oid="scayqh9">
                        <div className="text-2xl font-bold" data-oid="0srf6:y">
                            {stats?.total || 0}
                        </div>
                        <div
                            className="flex items-center space-x-2 text-xs opacity-90"
                            data-oid="ev:g1v."
                        >
                            <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="jrp9-di"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                    data-oid="mpiyogl"
                                />
                            </svg>
                            <span data-oid="85azmkz">All user communications</span>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="e7n:kxd">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="1kmqsgc"
                    >
                        <CardTitle className="text-sm font-medium text-gray-600" data-oid="7y4m1_s">
                            Unread Messages
                        </CardTitle>
                        <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="6pj33do"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                data-oid="sz.swv0"
                            />
                        </svg>
                    </CardHeader>
                    <CardContent data-oid="dby-zl2">
                        <div className="text-2xl font-bold text-orange-600" data-oid="k_2p195">
                            {stats?.unread || 0}
                        </div>
                        <div
                            className="flex items-center space-x-2 text-xs text-gray-600"
                            data-oid="j0.jo01"
                        >
                            <svg
                                className="h-3 w-3 text-orange-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="7.psbej"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.832-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    data-oid="zh.t6nf"
                                />
                            </svg>
                            <span data-oid=":f1nsrg">Require attention</span>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="x5fwfn_">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="-2dti0v"
                    >
                        <CardTitle className="text-sm font-medium text-gray-600" data-oid="lv26lzg">
                            Contact Forms
                        </CardTitle>
                        <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="osnhlud"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.544-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                                data-oid="nxykikh"
                            />
                        </svg>
                    </CardHeader>
                    <CardContent data-oid="c4kbn63">
                        <div className="text-2xl font-bold text-blue-600" data-oid="8spaf0q">
                            {stats?.byType.contact_form || 0}
                        </div>
                        <div
                            className="flex items-center space-x-2 text-xs text-gray-600"
                            data-oid=".j8sx-6"
                        >
                            <span data-oid="uhgs1-f">General inquiries</span>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="q79py0:">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="2lnk08s"
                    >
                        <CardTitle className="text-sm font-medium text-gray-600" data-oid="po2xk3u">
                            Pharmacy Applications
                        </CardTitle>
                        <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="dr5wp0b"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                data-oid="ajoroh1"
                            />
                        </svg>
                    </CardHeader>
                    <CardContent data-oid="jsmtsne">
                        <div className="text-2xl font-bold text-green-600" data-oid="wusfy1-">
                            {stats?.byType.pharmacy_registration || 0}
                        </div>
                        <div
                            className="flex items-center space-x-2 text-xs text-gray-600"
                            data-oid="iyzfss."
                        >
                            <span data-oid="5mijwad">Registration requests</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card data-oid="k9.mn-i">
                <CardHeader data-oid="pdf68c9">
                    <CardTitle data-oid="2remb.j">Message Filters</CardTitle>
                    <CardDescription data-oid=".uk2.s1">
                        Filter messages by type, category, status, and search terms
                    </CardDescription>
                </CardHeader>
                <CardContent data-oid="w7v2.sd">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-oid="eqkk156">
                        <div data-oid="4hf18-x">
                            <Input
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                                data-oid="0:a4tji"
                            />
                        </div>
                        <div data-oid="afbo1u7">
                            <Select
                                value={typeFilter}
                                onValueChange={setTypeFilter}
                                data-oid="pth532n"
                            >
                                <SelectTrigger data-oid="mr8x1ex">
                                    <SelectValue placeholder="All Types" data-oid="-cmcigy" />
                                </SelectTrigger>
                                <SelectContent data-oid="ezqq3a7">
                                    <SelectItem value="all" data-oid="m2pz42q">
                                        All Types
                                    </SelectItem>
                                    <SelectItem value="contact_form" data-oid="r49:75r">
                                        Contact Form
                                    </SelectItem>
                                    <SelectItem value="pharmacy_registration" data-oid="nclj6:u">
                                        Pharmacy Registration
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div data-oid="sc15w9:">
                            <Select
                                value={categoryFilter}
                                onValueChange={setCategoryFilter}
                                data-oid="qy68mag"
                            >
                                <SelectTrigger data-oid="v_qvu1u">
                                    <SelectValue placeholder="All Categories" data-oid="k36e6de" />
                                </SelectTrigger>
                                <SelectContent data-oid="m_xvw1u">
                                    <SelectItem value="all" data-oid="2kuz5sp">
                                        All Categories
                                    </SelectItem>
                                    {messageService.getCategories().map((category) => (
                                        <SelectItem
                                            key={category}
                                            value={category}
                                            data-oid="jpx_3q0"
                                        >
                                            {messageService.getCategoryLabel(category)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div data-oid="x2--tt:">
                            <Select
                                value={readFilter}
                                onValueChange={setReadFilter}
                                data-oid="p4:yt7w"
                            >
                                <SelectTrigger data-oid="-r_81x_">
                                    <SelectValue placeholder="All Status" data-oid=".2uvyxt" />
                                </SelectTrigger>
                                <SelectContent data-oid="m8cieuj">
                                    <SelectItem value="all" data-oid="0y__fk.">
                                        All Messages
                                    </SelectItem>
                                    <SelectItem value="unread" data-oid="fq:pia0">
                                        Unread Only
                                    </SelectItem>
                                    <SelectItem value="read" data-oid="4i4xk3.">
                                        Read Only
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="6ef_7id">
                {/* Messages List */}
                <Card data-oid="01ma1v7">
                    <CardHeader data-oid="1z5o.ns">
                        <CardTitle data-oid="frk9id0">Messages ({messages.length})</CardTitle>
                        <CardDescription data-oid="mo-_fzw">
                            Click on a message to view details
                        </CardDescription>
                    </CardHeader>
                    <CardContent data-oid="7-vfm4k">
                        <div className="space-y-4 max-h-96 overflow-y-auto" data-oid="7o:inmm">
                            {messages.length === 0 ? (
                                <div className="text-center py-8" data-oid="u1t-esx">
                                    <div
                                        className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
                                        data-oid="e45137r"
                                    >
                                        <svg
                                            className="w-8 h-8 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="rf2bx6y"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                data-oid="5ps7600"
                                            />
                                        </svg>
                                    </div>
                                    <h4
                                        className="text-lg font-medium text-gray-900 mb-2"
                                        data-oid="_hy_xnk"
                                    >
                                        No Messages Found
                                    </h4>
                                    <p className="text-gray-600" data-oid="c2ko4xf">
                                        No messages match your current filters.
                                    </p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        onClick={() => handleMessageSelect(message)}
                                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                                            selectedMessage?.id === message.id
                                                ? 'ring-2 ring-[#14274E] bg-[#F1F6F9]'
                                                : 'hover:bg-gray-50'
                                        } ${
                                            !message.isRead ? 'border-l-4 border-l-orange-500' : ''
                                        }`}
                                        data-oid="6zdievj"
                                    >
                                        <div
                                            className="flex items-start justify-between mb-2"
                                            data-oid="dik6l3a"
                                        >
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="p_lw1zt"
                                            >
                                                <div className="text-gray-600" data-oid="3l2lo0g">
                                                    {getMessageTypeIcon(message.type)}
                                                </div>
                                                <div className="flex-1" data-oid="_tpcap4">
                                                    <h4
                                                        className="font-semibold text-gray-900"
                                                        data-oid="qq-cy:a"
                                                    >
                                                        {message.senderInfo.name}
                                                    </h4>
                                                    <p
                                                        className="text-sm text-gray-600"
                                                        data-oid="gowh20j"
                                                    >
                                                        {message.senderInfo.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="twl3-yh"
                                            >
                                                {getStatusIcon(message.isRead)}
                                            </div>
                                        </div>
                                        <p
                                            className="font-medium text-gray-900 mb-1"
                                            data-oid="thn5ow5"
                                        >
                                            {message.subject}
                                        </p>
                                        <p
                                            className="text-sm text-gray-600 mb-2 line-clamp-2"
                                            data-oid="ljd1k-t"
                                        >
                                            {message.content}
                                        </p>
                                        <div
                                            className="flex items-center justify-between text-xs text-gray-500"
                                            data-oid="5sgyeij"
                                        >
                                            <span data-oid="tf6_w-a">
                                                {messageService.getCategoryLabel(message.category)}
                                            </span>
                                            <span data-oid="p2kd0aq">
                                                {formatDate(message.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Message Details */}
                <Card data-oid="zc6j-5f">
                    <CardHeader data-oid="06_6w09">
                        <CardTitle data-oid="923qi:n">Message Details</CardTitle>
                        <CardDescription data-oid="bp1aee0">
                            View complete message information
                        </CardDescription>
                    </CardHeader>
                    <CardContent data-oid="-d8lqzx">
                        {selectedMessage ? (
                            <div className="space-y-6" data-oid="eg27a0o">
                                {/* Message Header */}
                                <div className="border-b border-gray-200 pb-4" data-oid="v62_:.0">
                                    <div
                                        className="flex items-start justify-between mb-2"
                                        data-oid=":r0es0h"
                                    >
                                        <h3
                                            className="text-xl font-semibold text-gray-900"
                                            data-oid="y9lg_kc"
                                        >
                                            {selectedMessage.subject}
                                        </h3>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="geu57t0"
                                        >
                                            {getStatusIcon(selectedMessage.isRead)}
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center space-x-2 text-sm text-gray-600"
                                        data-oid="bfuqkrj"
                                    >
                                        <div className="text-gray-600" data-oid="xc6m1fk">
                                            {getMessageTypeIcon(selectedMessage.type)}
                                        </div>
                                        <span data-oid="2yzu3b8">
                                            {messageService.getMessageTypeLabel(
                                                selectedMessage.type,
                                            )}
                                        </span>
                                        <span data-oid="vo6gbm1">•</span>
                                        <span data-oid="du6te_s">
                                            {messageService.getCategoryLabel(
                                                selectedMessage.category,
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Sender Information */}
                                <div data-oid="enp8y.w">
                                    <h4
                                        className="text-lg font-semibold text-gray-900 mb-3"
                                        data-oid="-l-k.n0"
                                    >
                                        Sender Information
                                    </h4>
                                    <div
                                        className="bg-[#F1F6F9] rounded-lg p-4 space-y-3"
                                        data-oid="2:pjcuc"
                                    >
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                            data-oid="25yl2-h"
                                        >
                                            <div data-oid="qix0mhe">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                    data-oid="tj0-stz"
                                                >
                                                    Name
                                                </label>
                                                <p className="text-gray-900" data-oid="erfrma8">
                                                    {selectedMessage.senderInfo.name}
                                                </p>
                                            </div>
                                            <div data-oid="zqs3:tj">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                    data-oid="3.dpwh8"
                                                >
                                                    Email
                                                </label>
                                                <p className="text-gray-900" data-oid="-6vx56:">
                                                    {selectedMessage.senderInfo.email}
                                                </p>
                                            </div>
                                            {selectedMessage.senderInfo.phone && (
                                                <div data-oid="985qrua">
                                                    <label
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                        data-oid="vvj-7y5"
                                                    >
                                                        Phone
                                                    </label>
                                                    <p className="text-gray-900" data-oid="e4jr33s">
                                                        {selectedMessage.senderInfo.phone}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedMessage.senderInfo.company && (
                                                <div data-oid="eb6l7mv">
                                                    <label
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                        data-oid="ywgnaj:"
                                                    >
                                                        Company
                                                    </label>
                                                    <p className="text-gray-900" data-oid="38mheaq">
                                                        {selectedMessage.senderInfo.company}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedMessage.senderInfo.position && (
                                                <div data-oid="gwzrgsd">
                                                    <label
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                        data-oid="y_109jf"
                                                    >
                                                        Position
                                                    </label>
                                                    <p className="text-gray-900" data-oid="xd5rlk5">
                                                        {selectedMessage.senderInfo.position}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Pharmacy Registration Details */}
                                {selectedMessage.type === 'pharmacy_registration' &&
                                    (selectedMessage as any).registrationData && (
                                        <div data-oid="dmbtoj1">
                                            <h4
                                                className="text-lg font-semibold text-gray-900 mb-3"
                                                data-oid="sz9l4h2"
                                            >
                                                Pharmacy Registration Details
                                            </h4>
                                            <div className="space-y-6" data-oid="dqx8qlu">
                                                {/* Basic Information */}
                                                <div
                                                    className="bg-white border border-gray-200 rounded-lg p-4"
                                                    data-oid="q1nu6f0"
                                                >
                                                    <h5
                                                        className="text-md font-semibold text-gray-900 mb-3 flex items-center"
                                                        data-oid=".i5-z6k"
                                                    >
                                                        <svg
                                                            className="w-5 h-5 mr-2 text-[#14274E]"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            data-oid="mtp748y"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                data-oid="u.mf51f"
                                                            />
                                                        </svg>
                                                        Basic Information
                                                    </h5>
                                                    <div
                                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                        data-oid="1uc6rv8"
                                                    >
                                                        <div data-oid="8u4rd32">
                                                            <label
                                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                                data-oid="0st96mq"
                                                            >
                                                                Pharmacy Name
                                                            </label>
                                                            <p
                                                                className="text-gray-900"
                                                                data-oid="eeikpu5"
                                                            >
                                                                {
                                                                    (selectedMessage as any)
                                                                        .registrationData
                                                                        .pharmacyName
                                                                }
                                                            </p>
                                                        </div>
                                                        <div data-oid="jbmh272">
                                                            <label
                                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                                data-oid="-ycp7s0"
                                                            >
                                                                Owner/Manager Name
                                                            </label>
                                                            <p
                                                                className="text-gray-900"
                                                                data-oid="awx.73a"
                                                            >
                                                                {
                                                                    (selectedMessage as any)
                                                                        .registrationData
                                                                        .ownerManagerName
                                                                }
                                                            </p>
                                                        </div>
                                                        <div data-oid="6dznukh">
                                                            <label
                                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                                data-oid="mgi3vv4"
                                                            >
                                                                Email Address
                                                            </label>
                                                            <p
                                                                className="text-gray-900"
                                                                data-oid="7.ds52v"
                                                            >
                                                                {
                                                                    (selectedMessage as any)
                                                                        .registrationData.email
                                                                }
                                                            </p>
                                                        </div>
                                                        <div data-oid="ftviy9d">
                                                            <label
                                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                                data-oid="_z-3h3n"
                                                            >
                                                                Phone Number
                                                            </label>
                                                            <p
                                                                className="text-gray-900"
                                                                data-oid="p3w36je"
                                                            >
                                                                {
                                                                    (selectedMessage as any)
                                                                        .registrationData
                                                                        .phoneNumber
                                                                }
                                                            </p>
                                                        </div>
                                                        <div
                                                            className="md:col-span-2"
                                                            data-oid="quxd_8r"
                                                        >
                                                            <label
                                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                                data-oid="roj-a1_"
                                                            >
                                                                Pharmacy License Number
                                                            </label>
                                                            <p
                                                                className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded"
                                                                data-oid="fu2zxv2"
                                                            >
                                                                {
                                                                    (selectedMessage as any)
                                                                        .registrationData
                                                                        .licenseNumber
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Location Information */}
                                                <div
                                                    className="bg-white border border-gray-200 rounded-lg p-4"
                                                    data-oid="0a..guu"
                                                >
                                                    <h5
                                                        className="text-md font-semibold text-gray-900 mb-3 flex items-center"
                                                        data-oid="pu000uk"
                                                    >
                                                        <svg
                                                            className="w-5 h-5 mr-2 text-[#14274E]"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            data-oid="08rrij4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                                data-oid=".5tcbl2"
                                                            />

                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                                data-oid="p:zqmm7"
                                                            />
                                                        </svg>
                                                        Location Information
                                                    </h5>
                                                    <div
                                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                        data-oid="hf6za_4"
                                                    >
                                                        <div
                                                            className="md:col-span-2"
                                                            data-oid="8_5i-6c"
                                                        >
                                                            <label
                                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                                data-oid="3lrgws6"
                                                            >
                                                                Full Address
                                                            </label>
                                                            <p
                                                                className="text-gray-900"
                                                                data-oid="trr._yr"
                                                            >
                                                                {
                                                                    (selectedMessage as any)
                                                                        .registrationData
                                                                        .fullAddress
                                                                }
                                                            </p>
                                                        </div>
                                                        <div data-oid="2hx2x6s">
                                                            <label
                                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                                data-oid="608k8ev"
                                                            >
                                                                City
                                                            </label>
                                                            <p
                                                                className="text-gray-900"
                                                                data-oid="y2_7y5g"
                                                            >
                                                                {
                                                                    (selectedMessage as any)
                                                                        .registrationData.city
                                                                }
                                                            </p>
                                                        </div>
                                                        <div data-oid="q6s00.e">
                                                            <label
                                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                                data-oid="prafo:x"
                                                            >
                                                                Governorate
                                                            </label>
                                                            <p
                                                                className="text-gray-900"
                                                                data-oid="ob327cf"
                                                            >
                                                                {
                                                                    (selectedMessage as any)
                                                                        .registrationData
                                                                        .governorate
                                                                }
                                                            </p>
                                                        </div>
                                                        <div
                                                            className="md:col-span-2"
                                                            data-oid="kd8ba7a"
                                                        >
                                                            <label
                                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                                data-oid="q6.:oze"
                                                            >
                                                                Operating Hours
                                                            </label>
                                                            <p
                                                                className="text-gray-900 bg-gray-50 px-3 py-2 rounded"
                                                                data-oid=":br:wel"
                                                            >
                                                                {
                                                                    (selectedMessage as any)
                                                                        .registrationData
                                                                        .operatingHours
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Business Information */}
                                                {((selectedMessage as any).registrationData
                                                    .website ||
                                                    (selectedMessage as any).registrationData
                                                        .socialMedia) && (
                                                    <div
                                                        className="bg-white border border-gray-200 rounded-lg p-4"
                                                        data-oid="nch73sz"
                                                    >
                                                        <h5
                                                            className="text-md font-semibold text-gray-900 mb-3 flex items-center"
                                                            data-oid="ph6r7x0"
                                                        >
                                                            <svg
                                                                className="w-5 h-5 mr-2 text-[#14274E]"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                data-oid="cxwrgg1"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                                                                    data-oid="pit-ao1"
                                                                />
                                                            </svg>
                                                            Business Information
                                                        </h5>
                                                        <div
                                                            className="grid grid-cols-1 gap-4"
                                                            data-oid="w23pcsi"
                                                        >
                                                            {(selectedMessage as any)
                                                                .registrationData.website && (
                                                                <div data-oid="bal49nv">
                                                                    <label
                                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                                        data-oid="cpjzxkj"
                                                                    >
                                                                        Website
                                                                    </label>
                                                                    <p
                                                                        className="text-blue-600 underline"
                                                                        data-oid="21bvzst"
                                                                    >
                                                                        {
                                                                            (selectedMessage as any)
                                                                                .registrationData
                                                                                .website
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {(selectedMessage as any)
                                                                .registrationData.socialMedia && (
                                                                <div data-oid="wx-kxgu">
                                                                    <label
                                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                                        data-oid="bxo4e2t"
                                                                    >
                                                                        Social Media
                                                                    </label>
                                                                    <p
                                                                        className="text-gray-900"
                                                                        data-oid="a:14cdl"
                                                                    >
                                                                        {
                                                                            (selectedMessage as any)
                                                                                .registrationData
                                                                                .socialMedia
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Additional Information */}
                                                <div
                                                    className="bg-white border border-gray-200 rounded-lg p-4"
                                                    data-oid=".h09mho"
                                                >
                                                    <h5
                                                        className="text-md font-semibold text-gray-900 mb-3 flex items-center"
                                                        data-oid="1i1v.j5"
                                                    >
                                                        <svg
                                                            className="w-5 h-5 mr-2 text-[#14274E]"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            data-oid=":k6..s3"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                data-oid="k:rp2co"
                                                            />
                                                        </svg>
                                                        About the Pharmacy
                                                    </h5>
                                                    <div
                                                        className="bg-gray-50 rounded-lg p-4"
                                                        data-oid="485y1r2"
                                                    >
                                                        <p
                                                            className="text-gray-900 whitespace-pre-wrap leading-relaxed"
                                                            data-oid="ytl.k-n"
                                                        >
                                                            {
                                                                (selectedMessage as any)
                                                                    .registrationData
                                                                    .pharmacyDescription
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                {/* Message Content */}
                                <div data-oid="ou154bg">
                                    <h4
                                        className="text-lg font-semibold text-gray-900 mb-3"
                                        data-oid="k7_ho3f"
                                    >
                                        Message Content
                                    </h4>
                                    <div
                                        className="bg-white border border-gray-200 rounded-lg p-4"
                                        data-oid="::2yawf"
                                    >
                                        <p
                                            className="text-gray-900 whitespace-pre-wrap"
                                            data-oid="oqtcysi"
                                        >
                                            {selectedMessage.content}
                                        </p>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div data-oid="argcmhc">
                                    <h4
                                        className="text-lg font-semibold text-gray-900 mb-3"
                                        data-oid="5d1m.1s"
                                    >
                                        Additional Information
                                    </h4>
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
                                        data-oid="az7nl-5"
                                    >
                                        <div data-oid="nda_-td">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                data-oid="r-bn_5j"
                                            >
                                                Received
                                            </label>
                                            <p className="text-gray-900" data-oid="hxdougv">
                                                {formatDate(selectedMessage.timestamp)}
                                            </p>
                                        </div>
                                        <div data-oid="2p0b7p_">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                data-oid="67sxvm2"
                                            >
                                                Message ID
                                            </label>
                                            <p
                                                className="text-gray-900 font-mono text-xs"
                                                data-oid="x4hy447"
                                            >
                                                {selectedMessage.id}
                                            </p>
                                        </div>
                                        {selectedMessage.tags &&
                                            selectedMessage.tags.length > 0 && (
                                                <div className="md:col-span-2" data-oid="78kmepf">
                                                    <label
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                        data-oid="81q6pnp"
                                                    >
                                                        Tags
                                                    </label>
                                                    <div
                                                        className="flex flex-wrap gap-2"
                                                        data-oid="r0du1rx"
                                                    >
                                                        {selectedMessage.tags.map((tag) => (
                                                            <Badge
                                                                key={tag}
                                                                variant="outline"
                                                                data-oid="3kbsm8p"
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8" data-oid="6f55geh">
                                <div
                                    className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
                                    data-oid="jo.65v_"
                                >
                                    <svg
                                        className="w-8 h-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid=":xh-o_g"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.544-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                                            data-oid="njj7di4"
                                        />
                                    </svg>
                                </div>
                                <h4
                                    className="text-lg font-medium text-gray-900 mb-2"
                                    data-oid="edz1:m8"
                                >
                                    Select a Message
                                </h4>
                                <p className="text-gray-600" data-oid="lh_88dd">
                                    Choose a message from the list to view details and sender
                                    information.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
