'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/contexts/CartContext';
import { CameraCapture } from '@/components/prescription/CameraCapture';

export function BottomNavigation() {
    const pathname = usePathname();
    const { items } = useCart();
    const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showCamera, setShowCamera] = useState(false);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    // Scrolling down
                    setIsVisible(false);
                } else {
                    // Scrolling up
                    setIsVisible(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);
            return () => {
                window.removeEventListener('scroll', controlNavbar);
            };
        }
    }, [lastScrollY]);

    const navItems = [
        {
            name: 'Home',
            href: '/',
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid=":8hy0uv"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        data-oid=".r-:r.7"
                    />
                </svg>
            ),
        },
        {
            name: 'Shop Medicines',
            href: '/medicine',
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="74tb:ug"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        data-oid="tfh2p68"
                    />
                </svg>
            ),
        },
        {
            name: 'Prescription',
            href: '/prescription/upload',
            icon: (
                <div
                    className="w-14 h-14 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full flex items-center justify-center shadow-xl border-4 border-white"
                    data-oid="p_:_i2a"
                >
                    <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="4wcb6uy"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            data-oid="iualo0m"
                        />
                    </svg>
                </div>
            ),

            isCenter: true,
        },
        {
            name: 'Cart',
            href: '/cart',
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="vg_ddfn"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
                        data-oid="nde1qx-"
                    />
                </svg>
            ),

            badge: cartItemsCount > 0 ? cartItemsCount : undefined,
        },
        {
            name: 'Profile',
            href: '/customer/profile',
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="067mny3"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        data-oid="009nhk."
                    />
                </svg>
            ),
        },
    ];

    // Handle camera capture
    const handleCameraCapture = (file: File) => {
        console.log('Prescription captured:', file);
        // Here you can handle the captured file - upload it, process it, etc.
        // You can add upload logic here or redirect to processing page
        setShowCamera(false);

        // Create a simple success notification
        const notification = document.createElement('div');
        notification.className =
            'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce-in';
        notification.textContent = '📷 Prescription captured successfully!';
        document.body.appendChild(notification);

        // Remove notification after 3 seconds and redirect
        setTimeout(() => {
            document.body.removeChild(notification);
            window.location.href = '/prescription/status?success=true';
        }, 3000);
    };

    // Handle camera close
    const handleCameraClose = () => {
        setShowCamera(false);
    };

    // Handle prescription button click
    const handlePrescriptionClick = (e: React.MouseEvent) => {
        e.preventDefault();

        // Check if device has camera support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Camera is not supported on this device. Please use the upload option instead.');
            window.location.href = '/prescription/upload';
            return;
        }

        setShowCamera(true);
    };

    return (
        <nav
            className={`fixed bottom-4 left-4 right-4 transition-all duration-500 ease-in-out z-50 md:hidden ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            data-oid="4_80z1b"
        >
            <div
                className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 px-6 py-4 relative"
                data-oid="gyvi1ir"
            >
                <div className="flex items-end justify-between" data-oid="20akl0h">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href;

                        if (item.isCenter) {
                            return (
                                <div
                                    key={item.name}
                                    className="absolute left-1/2 transform -translate-x-1/2 -top-8"
                                    data-oid="8618wb."
                                >
                                    <button
                                        onClick={handlePrescriptionClick}
                                        className="block hover:scale-110 transition-all duration-300"
                                        data-oid="dpu54tp"
                                    >
                                        <div
                                            className="w-16 h-16 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full flex items-center justify-center shadow-2xl border-4 border-white"
                                            data-oid="no6iq7o"
                                        >
                                            <svg
                                                className="w-8 h-8 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="99fkn3_"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    data-oid="gpjcsls"
                                                />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center space-y-2 py-3 px-2 rounded-xl transition-all duration-300 flex-1 ${
                                    isActive
                                        ? 'text-[#1F1F6F] bg-[#1F1F6F]/10 scale-105'
                                        : 'text-gray-500 hover:text-[#1F1F6F] hover:bg-[#1F1F6F]/5 hover:scale-105'
                                }`}
                                data-oid="wsk9p79"
                            >
                                <div className="relative" data-oid="vfuh12m">
                                    {item.icon}
                                    {item.badge && (
                                        <span
                                            className="absolute -top-2 -right-2 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse"
                                            data-oid="t7v98l_"
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span
                                    className={`text-xs font-medium transition-colors text-center ${
                                        isActive ? 'text-[#1F1F6F]' : 'text-gray-500'
                                    }`}
                                    data-oid="u9h0_if"
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Camera Capture Modal */}
            <CameraCapture
                isOpen={showCamera}
                onCapture={handleCameraCapture}
                onClose={handleCameraClose}
                data-oid="s:_tsrb"
            />
        </nav>
    );
}
