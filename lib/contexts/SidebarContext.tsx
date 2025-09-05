'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Load the sidebar state from localStorage on mount
    useEffect(() => {
        setIsMounted(true);
        try {
            const savedState = localStorage.getItem('sidebar-collapsed');
            if (savedState !== null) {
                setIsCollapsed(JSON.parse(savedState));
            }
        } catch (error) {
            console.warn('Failed to load sidebar state from localStorage:', error);
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);

        // Save to localStorage immediately
        try {
            localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
        } catch (error) {
            console.warn('Failed to save sidebar state to localStorage:', error);
        }
    };

    const setSidebarCollapsed = (collapsed: boolean) => {
        setIsCollapsed(collapsed);

        // Save to localStorage immediately
        try {
            localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
        } catch (error) {
            console.warn('Failed to save sidebar state to localStorage:', error);
        }
    };

    // Don't render until mounted to prevent hydration mismatch
    if (!isMounted) {
        return (
            <SidebarContext.Provider
                value={{
                    isCollapsed: false,
                    toggleSidebar: () => {},
                    setSidebarCollapsed: () => {},
                }}
                data-oid="8t71g-b"
            >
                {children}
            </SidebarContext.Provider>
        );
    }

    return (
        <SidebarContext.Provider
            value={{ isCollapsed, toggleSidebar, setSidebarCollapsed }}
            data-oid="0ztwxik"
        >
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
