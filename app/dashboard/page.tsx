import { AppSidebar } from '@/components/app-sidebar';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import data from './data.json';

export default function Page() {
    return (
        <SidebarProvider data-oid="11vdc6.">
            <AppSidebar variant="inset" data-oid="0qaa1xw" />
            <SidebarInset data-oid="q2-5sp-">
                <SiteHeader data-oid="ibk-qpt" />
                <div className="flex flex-1 flex-col" data-oid="6zwfhkv">
                    <div className="@container/main flex flex-1 flex-col gap-2" data-oid="b2hhc4j">
                        <div
                            className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"
                            data-oid="qb1.:yu"
                        >
                            <SectionCards data-oid="l1n:uj:" />
                            <div className="px-4 lg:px-6" data-oid="w9_cmc1">
                                <ChartAreaInteractive data-oid="y.pg7at" />
                            </div>
                            <DataTable data={data} data-oid="1k5_f-s" />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
