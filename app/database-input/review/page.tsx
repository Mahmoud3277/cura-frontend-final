'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReviewQueuePage() {
    const [pendingReviews] = useState([
        {
            id: 1,
            name: 'Paracetamol 500mg',
            category: 'analgesics',
            submittedBy: 'John Doe',
            submittedAt: '2024-01-15T10:30:00Z',
            status: 'pending',
        },
        {
            id: 2,
            name: 'Hand Sanitizer 500ml',
            category: 'hygiene',
            submittedBy: 'Jane Smith',
            submittedAt: '2024-01-15T09:15:00Z',
            status: 'pending',
        },
    ]);

    return (
        <>
            <Card data-oid="oxbnrd0">
                <CardHeader data-oid="-qeqok-">
                    <CardTitle data-oid="9ls1xky">
                        Pending Reviews ({pendingReviews.length})
                    </CardTitle>
                </CardHeader>
                <CardContent data-oid=".e1sb7v">
                    <div className="space-y-4" data-oid="d3f76a0">
                        {pendingReviews.map((item) => (
                            <div
                                key={item.id}
                                className="border border-gray-200 rounded-lg p-4"
                                data-oid="ikv_m2p"
                            >
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="-oid6ks"
                                >
                                    <div data-oid="q82:r5x">
                                        <h3
                                            className="font-semibold text-gray-900"
                                            data-oid="5klpwid"
                                        >
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-600" data-oid="cxoac3_">
                                            Category: {item.category}
                                        </p>
                                        <p className="text-sm text-gray-600" data-oid="9t64ynz">
                                            Submitted by: {item.submittedBy}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2" data-oid=".xtzlj9">
                                        <Button size="sm" variant="outline" data-oid="go3p.i6">
                                            Review
                                        </Button>
                                        <Button size="sm" data-oid="_9sypce">
                                            Approve
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
