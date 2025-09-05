'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useEffect, useState } from 'react';

export function AuthDebug() {
    const { user, isAuthenticated } = useAuth();
    const [cookieInfo, setCookieInfo] = useState<string>('');

    useEffect(() => {
        // Check cookies
        const cookies = document.cookie;
        setCookieInfo(cookies);
    }, []);

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm z-50">
            <h3 className="font-bold text-sm mb-2">🔍 Auth Debug Info</h3>
            <div className="text-xs space-y-1">
                <div>
                    <strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
                </div>
                <div>
                    <strong>User:</strong> {user ? user.email : 'None'}
                </div>
                <div>
                    <strong>Role:</strong> {user ? user.role : 'None'}
                </div>
                <div>
                    <strong>Current URL:</strong>{' '}
                    {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}
                </div>
                <div>
                    <strong>Cookies:</strong> {cookieInfo || 'None'}
                </div>
            </div>
        </div>
    );
}
('use client');

import { useAuth } from '@/lib/contexts/AuthContext';

export function AuthDebug() {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div
            className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50"
            data-oid="neh:gpl"
        >
            <h4 className="font-bold mb-2" data-oid="5yuox51">
                Auth Debug
            </h4>
            <div data-oid="pk_kdor">Loading: {isLoading ? 'Yes' : 'No'}</div>
            <div data-oid="jmggs7-">Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
            <div data-oid="52iza1n">User: {user ? user.email : 'None'}</div>
            <div data-oid="naa75to">Role: {user ? user.role : 'None'}</div>
            <div data-oid="4qt5kb_">
                LocalStorage:{' '}
                {typeof window !== 'undefined'
                    ? localStorage.getItem('cura_user')
                        ? 'Set'
                        : 'Empty'
                    : 'N/A'}
            </div>
        </div>
    );
}
