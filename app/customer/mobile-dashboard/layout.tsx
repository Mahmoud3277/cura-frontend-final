'use client';

export default function MobileDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen" data-oid="7eg7jv6">
            {/* Hide mobile header and side navigation for this page */}
            <style jsx global data-oid="p3pwytn">{`
                .mobile-header,
                .customer-mobile-side-navigation {
                    display: none !important;
                }
            `}</style>

            {children}
        </div>
    );
}
