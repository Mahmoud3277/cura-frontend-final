import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function SiteHeader() {
    return (
        <header
            className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear"
            data-oid="n.2z9ee"
        >
            <div
                className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6"
                data-oid="b8m48m7"
            >
                <SidebarTrigger className="-ml-1" data-oid=".9z_m-x" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                    data-oid="72:3c9s"
                />

                <h1 className="text-base font-medium" data-oid="8ie4:lr">
                    Documents
                </h1>
            </div>
        </header>
    );
}
