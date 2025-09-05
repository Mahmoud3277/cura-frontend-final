'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { masterProductDatabase } from '@/lib/database/masterProductDatabase';
import { productAnalysisService, ProductIssue } from '@/lib/services/productAnalysisService';

interface AnalysisStats {
    totalProducts: number;
    productsWithIssues: number;
    criticalIssues: number;
    warnings: number;
    recommendations: number;
    completionRate: number;
    issuesByCategory: Record<string, number>;
    issuesByField: Record<string, number>;
}

export function ProductAnalysisWidget() {
    const router = useRouter();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [issues, setIssues] = useState<ProductIssue[]>([]);
    const [stats, setStats] = useState<AnalysisStats>({
        totalProducts: 0,
        productsWithIssues: 0,
        criticalIssues: 0,
        warnings: 0,
        recommendations: 0,
        completionRate: 0,
    });
    const [selectedSeverity, setSelectedSeverity] = useState<
        'all' | 'critical' | 'warning' | 'info'
    >('all');

    useEffect(() => {
        runAnalysis();
    }, []);

    const runAnalysis = async () => {
        setIsAnalyzing(true);

        try {
            // Simulate analysis delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const analysisResult = productAnalysisService.analyzeProducts(masterProductDatabase);

            setIssues(analysisResult.issues);
            setStats(analysisResult.stats);
        } catch (error) {
            console.error('Error running analysis:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const exportReport = () => {
        const csvContent = productAnalysisService.exportIssuesReport(issues);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `product_analysis_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const filteredIssues =
        selectedSeverity === 'all'
            ? issues
            : issues.filter((issue) => issue.severity === selectedSeverity);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'info':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical':
                return '🚨';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return '📝';
        }
    };

    return (
        <Card className="h-full" data-oid="iu96_gy">
            <CardHeader data-oid="qzkuxe:">
                <div className="flex items-center justify-between" data-oid="e49k4n9">
                    <CardTitle className="text-gray-800" data-oid="ti5o7ts">
                        Product Data Analysis
                    </CardTitle>
                    <Button
                        onClick={runAnalysis}
                        disabled={isAnalyzing}
                        size="sm"
                        className="bg-[#1F1F6F] text-white hover:bg-[#14274E]"
                        data-oid="jlcif3r"
                    >
                        {isAnalyzing ? (
                            <>
                                <div
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                    data-oid=".x_770j"
                                />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="b7i6w5y"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        data-oid="q7tmnkl"
                                    />
                                </svg>
                                Re-analyze
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent data-oid="ukqmzqe">
                {/* Statistics Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" data-oid="k_f-98p">
                    <div
                        className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200"
                        data-oid="av_f7q3"
                    >
                        <div className="text-2xl font-bold text-blue-600" data-oid="8kcrd-8">
                            {stats.totalProducts}
                        </div>
                        <div className="text-sm text-blue-700" data-oid="6vwnj-1">
                            Total Products
                        </div>
                    </div>
                    <div
                        className="text-center p-3 bg-red-50 rounded-lg border border-red-200"
                        data-oid="chtuofy"
                    >
                        <div className="text-2xl font-bold text-red-600" data-oid="etw69a0">
                            {stats.criticalIssues}
                        </div>
                        <div className="text-sm text-red-700" data-oid="a904p-a">
                            Critical Issues
                        </div>
                    </div>
                    <div
                        className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                        data-oid=".a797o9"
                    >
                        <div className="text-2xl font-bold text-yellow-600" data-oid="t4zmabi">
                            {stats.warnings}
                        </div>
                        <div className="text-sm text-yellow-700" data-oid="1_u.n0g">
                            Warnings
                        </div>
                    </div>
                    <div
                        className="text-center p-3 bg-green-50 rounded-lg border border-green-200"
                        data-oid="bk6l1f8"
                    >
                        <div className="text-2xl font-bold text-green-600" data-oid="4onm69h">
                            {stats.completionRate}%
                        </div>
                        <div className="text-sm text-green-700" data-oid="nsa8usw">
                            Data Quality
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                {stats.criticalIssues > 0 && (
                    <Alert className="mb-4 border-red-200 bg-red-50" data-oid="d0akxa:">
                        <AlertDescription data-oid="wcnttba">
                            <strong className="text-red-800" data-oid="i2283ur">
                                Action Required:
                            </strong>{' '}
                            {stats.criticalIssues} critical issues found that need immediate
                            attention.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Filter Tabs */}
                <Tabs
                    value={selectedSeverity}
                    onValueChange={(value) => setSelectedSeverity(value as any)}
                    className="mb-4"
                    data-oid="oz5aqh_"
                >
                    <TabsList className="grid w-full grid-cols-4" data-oid="t134_z0">
                        <TabsTrigger value="all" data-oid="vs8hvvb">
                            All ({issues.length})
                        </TabsTrigger>
                        <TabsTrigger value="critical" data-oid="-s_mrvk">
                            Critical ({stats.criticalIssues})
                        </TabsTrigger>
                        <TabsTrigger value="warning" data-oid="g22enc7">
                            Warnings ({stats.warnings})
                        </TabsTrigger>
                        <TabsTrigger value="info" data-oid="zrbnjrb">
                            Info ({stats.recommendations})
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Issues List */}
                <div className="space-y-3 max-h-96 overflow-y-auto" data-oid="r9nkkl-">
                    {filteredIssues.length === 0 ? (
                        <div className="text-center py-8 text-gray-500" data-oid="gq70czk">
                            {selectedSeverity === 'all' ? (
                                <>
                                    <svg
                                        className="w-16 h-16 mx-auto mb-4 text-green-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="umxqr2o"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="i.m9csu"
                                        />
                                    </svg>
                                    <p
                                        className="text-lg font-medium text-green-600"
                                        data-oid="amjnp9d"
                                    >
                                        All products look good!
                                    </p>
                                    <p className="text-sm" data-oid="1rq6fwo">
                                        No issues found in your product database.
                                    </p>
                                </>
                            ) : (
                                <p data-oid="wy3bttf">No {selectedSeverity} issues found.</p>
                            )}
                        </div>
                    ) : (
                        filteredIssues.map((issue, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)} hover:shadow-md transition-shadow cursor-pointer`}
                                onClick={() =>
                                    router.push(`/database-input/products?edit=${issue.productId}`)
                                }
                                data-oid="ynowb91"
                            >
                                <div
                                    className="flex items-start justify-between"
                                    data-oid="xfro._9"
                                >
                                    <div className="flex-1" data-oid="_wji-t8">
                                        <div
                                            className="flex items-center space-x-2 mb-2"
                                            data-oid="vfq1sx_"
                                        >
                                            <span className="text-lg" data-oid="vf2bb_e">
                                                {getSeverityIcon(issue.severity)}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                                data-oid="gc.u_qg"
                                            >
                                                {issue.field}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                                data-oid="qayl8d6"
                                            >
                                                {issue.category}
                                            </Badge>
                                        </div>
                                        <h4
                                            className="font-medium text-gray-900 mb-1"
                                            data-oid="3uz3gsx"
                                        >
                                            {issue.productName}
                                        </h4>
                                        <p
                                            className="text-sm text-gray-700 mb-2"
                                            data-oid="72dflvk"
                                        >
                                            {issue.message}
                                        </p>
                                        {issue.suggestion && (
                                            <p
                                                className="text-xs text-gray-600 italic"
                                                data-oid="jg_czr5"
                                            >
                                                💡 {issue.suggestion}
                                            </p>
                                        )}
                                    </div>
                                    <div className="ml-4" data-oid="p.48t3i">
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="p0ab36v"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                                data-oid="g3yi56l"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Action Buttons */}
                {filteredIssues.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-3" data-oid="-.jcyfj">
                        <Button
                            onClick={() => router.push('/database-input/products')}
                            className="bg-[#1F1F6F] text-white hover:bg-[#14274E]"
                            data-oid="jf4.umk"
                        >
                            View All Products
                        </Button>
                        <Button
                            onClick={() => router.push('/database-input/bulk-import')}
                            variant="outline"
                            className="border-[#1F1F6F] text-[#1F1F6F] hover:bg-[#1F1F6F] hover:text-white"
                            data-oid="qchnt62"
                        >
                            Bulk Fix Issues
                        </Button>
                        <Button
                            onClick={exportReport}
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            data-oid="ig46ewx"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="ecv7_v3"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-4-4m4 4l4-4m5-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z"
                                    data-oid="y1sgsgs"
                                />
                            </svg>
                            Export Report
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
