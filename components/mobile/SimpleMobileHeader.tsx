'use client';

export function SimpleMobileHeader() {
    return (
        <header
            className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40 h-16"
            data-oid="simple-mobile-header"
        >
            <div className="px-4 h-full flex items-center justify-center" data-oid="header-content">
                {/* Simple Logo */}
                <div
                    className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1F1F6F] to-[#14274E]"
                    data-oid="5zpf9aw"
                >
                    CURA
                </div>
            </div>
        </header>
    );
}
