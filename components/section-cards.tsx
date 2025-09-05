import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function SectionCards() {
    return (
        <div
            className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6"
            data-oid="6uk5.fm"
        >
            <Card className="@container/card" data-oid="qu-4bqd">
                <CardHeader className="relative" data-oid="kl150pf">
                    <CardDescription data-oid="idwfcti">Total Revenue</CardDescription>
                    <CardTitle
                        className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                        data-oid="0zetuw6"
                    >
                        $1,250.00
                    </CardTitle>
                    <div className="absolute right-4 top-4" data-oid="xom9_fr">
                        <Badge
                            variant="outline"
                            className="flex gap-1 rounded-lg text-xs"
                            data-oid="l:1-1ej"
                        >
                            <TrendingUpIcon className="size-3" data-oid="1h83dcl" />
                            +12.5%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm" data-oid="7.1yt2h">
                    <div className="line-clamp-1 flex gap-2 font-medium" data-oid="84eo9rq">
                        Trending up this month{' '}
                        <TrendingUpIcon className="size-4" data-oid="7h2.rj_" />
                    </div>
                    <div className="text-muted-foreground" data-oid="rz_pz2a">
                        Visitors for the last 6 months
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card" data-oid="_yzj96d">
                <CardHeader className="relative" data-oid="u_yqztk">
                    <CardDescription data-oid="9lems70">New Customers</CardDescription>
                    <CardTitle
                        className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                        data-oid="yu:17j."
                    >
                        1,234
                    </CardTitle>
                    <div className="absolute right-4 top-4" data-oid="4e:anf0">
                        <Badge
                            variant="outline"
                            className="flex gap-1 rounded-lg text-xs"
                            data-oid="kqh2er8"
                        >
                            <TrendingDownIcon className="size-3" data-oid="rhjel-p" />
                            -20%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm" data-oid="rls__1c">
                    <div className="line-clamp-1 flex gap-2 font-medium" data-oid="w780469">
                        Down 20% this period{' '}
                        <TrendingDownIcon className="size-4" data-oid=".o9o2f:" />
                    </div>
                    <div className="text-muted-foreground" data-oid="tnoiiu7">
                        Acquisition needs attention
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card" data-oid="mdvc:9y">
                <CardHeader className="relative" data-oid="3yh6mee">
                    <CardDescription data-oid="8.19eme">Active Accounts</CardDescription>
                    <CardTitle
                        className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                        data-oid="4b68elw"
                    >
                        45,678
                    </CardTitle>
                    <div className="absolute right-4 top-4" data-oid="t-4ce:.">
                        <Badge
                            variant="outline"
                            className="flex gap-1 rounded-lg text-xs"
                            data-oid="z61llm5"
                        >
                            <TrendingUpIcon className="size-3" data-oid="rhmi77m" />
                            +12.5%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm" data-oid="_3ffaks">
                    <div className="line-clamp-1 flex gap-2 font-medium" data-oid="mh42so6">
                        Strong user retention{' '}
                        <TrendingUpIcon className="size-4" data-oid="a6_5ttt" />
                    </div>
                    <div className="text-muted-foreground" data-oid="on-7t93">
                        Engagement exceed targets
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card" data-oid="9n3ldis">
                <CardHeader className="relative" data-oid="s5g67h1">
                    <CardDescription data-oid="2stkduo">Growth Rate</CardDescription>
                    <CardTitle
                        className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                        data-oid="u9dadso"
                    >
                        4.5%
                    </CardTitle>
                    <div className="absolute right-4 top-4" data-oid="k5:jucs">
                        <Badge
                            variant="outline"
                            className="flex gap-1 rounded-lg text-xs"
                            data-oid="bm_p:c:"
                        >
                            <TrendingUpIcon className="size-3" data-oid="hoep8qv" />
                            +4.5%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm" data-oid="p-4h8re">
                    <div className="line-clamp-1 flex gap-2 font-medium" data-oid=":dg2e2p">
                        Steady performance <TrendingUpIcon className="size-4" data-oid="4ie4:u2" />
                    </div>
                    <div className="text-muted-foreground" data-oid="ke0s.57">
                        Meets growth projections
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
