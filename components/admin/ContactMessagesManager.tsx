'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    category: string;
    timestamp: string;
    status: 'unread' | 'read' | 'replied';
    type: 'contact_form';
}

export function ContactMessagesManager() {
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = () => {
        const storedMessages = JSON.parse(localStorage.getItem('admin_messages') || '[]');
        setMessages(storedMessages);
    };

    const markAsRead = (messageId: string) => {
        const updatedMessages = messages.map((msg) =>
            msg.id === messageId ? { ...msg, status: 'read' as const } : msg,
        );
        setMessages(updatedMessages);
        localStorage.setItem('admin_messages', JSON.stringify(updatedMessages));
    };

    const markAsReplied = (messageId: string) => {
        const updatedMessages = messages.map((msg) =>
            msg.id === messageId ? { ...msg, status: 'replied' as const } : msg,
        );
        setMessages(updatedMessages);
        localStorage.setItem('admin_messages', JSON.stringify(updatedMessages));
    };

    const deleteMessage = (messageId: string) => {
        const updatedMessages = messages.filter((msg) => msg.id !== messageId);
        setMessages(updatedMessages);
        localStorage.setItem('admin_messages', JSON.stringify(updatedMessages));
        setSelectedMessage(null);
    };

    const filteredMessages = messages.filter((msg) => {
        if (filter === 'all') return true;
        return msg.status === filter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'unread':
                return 'bg-red-100 text-red-800';
            case 'read':
                return 'bg-yellow-100 text-yellow-800';
            case 'replied':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryLabel = (category: string) => {
        const categories: { [key: string]: string } = {
            general: 'General Inquiry',
            prescription: 'Prescription Help',
            order: 'Order Support',
            technical: 'Technical Issue',
            pharmacy: 'Pharmacy Partnership',
        };
        return categories[category] || category;
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    const unreadCount = messages.filter((msg) => msg.status === 'unread').length;

    return (
        <div className="space-y-6" data-oid=":z:p6ya">
            {/* Header */}
            <div className="flex items-center justify-between" data-oid="jhaf4fd">
                <div data-oid="dea0dyl">
                    <h2 className="text-2xl font-bold text-gray-900" data-oid="xe1a9lh">
                        Contact Messages
                    </h2>
                    <p className="text-gray-600" data-oid="_br90fm">
                        Manage customer inquiries and support requests
                    </p>
                </div>
                <div className="flex items-center space-x-4" data-oid="hapi5dl">
                    <span
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                        data-oid="b780hhf"
                    >
                        {unreadCount} Unread
                    </span>
                    <button
                        onClick={loadMessages}
                        className="px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors"
                        data-oid="j__p61r"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-2" data-oid="0tw4js2">
                {(['all', 'unread', 'read', 'replied'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === status
                                ? 'bg-[#1F1F6F] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        data-oid=":2805ep"
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        {status !== 'all' && (
                            <span className="ml-1" data-oid="7aiebkc">
                                ({messages.filter((msg) => msg.status === status).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="zyn-ipc">
                {/* Messages List */}
                <div className="space-y-4" data-oid="2m64mxm">
                    <h3 className="text-lg font-semibold text-gray-900" data-oid="8gvfwli">
                        Messages ({filteredMessages.length})
                    </h3>

                    {filteredMessages.length === 0 ? (
                        <div
                            className="bg-white rounded-lg border border-gray-200 p-8 text-center"
                            data-oid="25co3o1"
                        >
                            <div
                                className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
                                data-oid="ce8:asg"
                            >
                                <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="2knoxxn"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4-4-4m0 0l-4 4-4-4"
                                        data-oid="thyo-hw"
                                    />
                                </svg>
                            </div>
                            <h4
                                className="text-lg font-medium text-gray-900 mb-2"
                                data-oid=".cohhze"
                            >
                                No Messages
                            </h4>
                            <p className="text-gray-600" data-oid="j-rzxpg">
                                No contact messages match your current filter.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3" data-oid="5wtob_r">
                            {filteredMessages.map((message) => (
                                <div
                                    key={message.id}
                                    onClick={() => {
                                        setSelectedMessage(message);
                                        if (message.status === 'unread') {
                                            markAsRead(message.id);
                                        }
                                    }}
                                    className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all ${
                                        selectedMessage?.id === message.id
                                            ? 'ring-2 ring-[#1F1F6F]'
                                            : ''
                                    } ${
                                        message.status === 'unread'
                                            ? 'border-l-4 border-l-red-500'
                                            : ''
                                    }`}
                                    data-oid="el06s.l"
                                >
                                    <div
                                        className="flex items-start justify-between mb-2"
                                        data-oid="gbtk5sb"
                                    >
                                        <div className="flex-1" data-oid=".95e_7j">
                                            <h4
                                                className="font-semibold text-gray-900"
                                                data-oid="supbh._"
                                            >
                                                {message.name}
                                            </h4>
                                            <p className="text-sm text-gray-600" data-oid="-yhh1t:">
                                                {message.email}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}
                                            data-oid="reoeqkl"
                                        >
                                            {message.status}
                                        </span>
                                    </div>
                                    <p
                                        className="font-medium text-gray-900 mb-1"
                                        data-oid="htx122n"
                                    >
                                        {message.subject}
                                    </p>
                                    <p
                                        className="text-sm text-gray-600 mb-2 line-clamp-2"
                                        data-oid="xkxzr:h"
                                    >
                                        {message.message}
                                    </p>
                                    <div
                                        className="flex items-center justify-between text-xs text-gray-500"
                                        data-oid="oh33cv4"
                                    >
                                        <span data-oid="dueqzwh">
                                            {getCategoryLabel(message.category)}
                                        </span>
                                        <span data-oid="prchqom">
                                            {formatDate(message.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Message Details */}
                <div data-oid="eorzjq_">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="s-q4wd4">
                        Message Details
                    </h3>

                    {selectedMessage ? (
                        <div
                            className="bg-white rounded-lg border border-gray-200 p-6"
                            data-oid="5d:o42e"
                        >
                            <div
                                className="flex items-start justify-between mb-4"
                                data-oid="-xa326g"
                            >
                                <div data-oid="1wwn3kl">
                                    <h4
                                        className="text-xl font-semibold text-gray-900"
                                        data-oid="9_.755:"
                                    >
                                        {selectedMessage.subject}
                                    </h4>
                                    <p className="text-gray-600" data-oid="9xpdqce">
                                        {getCategoryLabel(selectedMessage.category)}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMessage.status)}`}
                                    data-oid="_haw:_h"
                                >
                                    {selectedMessage.status}
                                </span>
                            </div>

                            <div className="space-y-4 mb-6" data-oid="as:ekm3">
                                <div data-oid="p-x1gd.">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="kz6:6tf"
                                    >
                                        From
                                    </label>
                                    <p className="text-gray-900" data-oid="3kkmzcq">
                                        {selectedMessage.name}
                                    </p>
                                    <p className="text-gray-600" data-oid="7s46ks5">
                                        {selectedMessage.email}
                                    </p>
                                    {selectedMessage.phone && (
                                        <p className="text-gray-600" data-oid="1e963u6">
                                            {selectedMessage.phone}
                                        </p>
                                    )}
                                </div>

                                <div data-oid="yukmbc1">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="j3:j6nc"
                                    >
                                        Date
                                    </label>
                                    <p className="text-gray-900" data-oid="gtvpsms">
                                        {formatDate(selectedMessage.timestamp)}
                                    </p>
                                </div>

                                <div data-oid="5:6hec3">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="ui2j7w1"
                                    >
                                        Message
                                    </label>
                                    <div className="bg-gray-50 rounded-lg p-4" data-oid="-7.49z-">
                                        <p
                                            className="text-gray-900 whitespace-pre-wrap"
                                            data-oid="lp.59cn"
                                        >
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3" data-oid="mvbbq9d">
                                <button
                                    onClick={() => markAsReplied(selectedMessage.id)}
                                    disabled={selectedMessage.status === 'replied'}
                                    className="flex-1 px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-oid="2ffyz8o"
                                >
                                    Mark as Replied
                                </button>
                                <button
                                    onClick={() => {
                                        if (
                                            confirm('Are you sure you want to delete this message?')
                                        ) {
                                            deleteMessage(selectedMessage.id);
                                        }
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    data-oid="_mq92co"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="bg-white rounded-lg border border-gray-200 p-8 text-center"
                            data-oid="z3n8nqm"
                        >
                            <div
                                className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
                                data-oid="byeezo8"
                            >
                                <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="zj_l_v."
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.544-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                                        data-oid="tx6_nnn"
                                    />
                                </svg>
                            </div>
                            <h4
                                className="text-lg font-medium text-gray-900 mb-2"
                                data-oid="5:8bpco"
                            >
                                Select a Message
                            </h4>
                            <p className="text-gray-600" data-oid="k3oyfuz">
                                Choose a message from the list to view details and take actions.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
