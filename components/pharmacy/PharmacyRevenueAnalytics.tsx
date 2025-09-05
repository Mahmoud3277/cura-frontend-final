'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    pharmacyManagementService,
    PharmacyDetails,
} from '@/lib/services/pharmacyManagementService';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    Target,
    RotateCcw,
    AlertCircle,
    BarChart3,
} from 'lucide-react';

interface PharmacyRevenueAnalyticsProps {
    pharmacy: PharmacyDetails;
    timeframe?: string;
}

export function PharmacyRevenueAnalytics({
    pharmacy,
    timeframe = '1m',
}: PharmacyRevenueAnalyticsProps) {
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);

    useEffect(() => {
        loadAnalytics();
    }, [pharmacy.id]); // Only reload when pharmacy changes, not timeframe

    const loadAnalytics = async () => {
        setIsLoading(true);
        // Simulate API call only on initial load
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Static data that doesn't change
        const data = {
            periods: [
                {
                    period: 'Today',
                    revenue: 2840,
                    orders: 23,
                    sales: 89,
                    returns: 3,
                    avgOrder: 123,
                },
                {
                    period: '7 Days',
                    revenue: 19850,
                    orders: 167,
                    sales: 634,
                    returns: 12,
                    avgOrder: 119,
                },
                {
                    period: '1 Month',
                    revenue: 52340,
                    orders: 423,
                    sales: 1567,
                    returns: 34,
                    avgOrder: 124,
                },
                {
                    period: '6 Months',
                    revenue: 287650,
                    orders: 2134,
                    sales: 8234,
                    returns: 178,
                    avgOrder: 135,
                },
                {
                    period: '1 Year',
                    revenue: 634890,
                    orders: 4876,
                    sales: 18456,
                    returns: 367,
                    avgOrder: 130,
                },
                {
                    period: 'All Time',
                    revenue: 1456789,
                    orders: 11234,
                    sales: 42567,
                    returns: 723,
                    avgOrder: 130,
                },
            ],

            performance: {
                score: 91.8,
                avgOrder: 124,
                returnRate: 7.5,
                efficiency: 4.2,
            },
            growth: {
                revenue: 28.7,
                orders: 31.2,
                sales: 26.8,
            },
        };

        setAnalytics(data);
        setIsLoading(false);
    };

    // Function to get current period data based on selected timeframe
    const getCurrentPeriodData = () => {
        if (!analytics) return null;

        const periodMap: { [key: string]: string } = {
            today: 'Today',
            '7d': '7 Days',
            '1m': '1 Month',
            '6m': '6 Months',
            '1y': '1 Year',
            all: 'All Time',
        };

        const periodName = periodMap[selectedTimeframe] || '1 Month';
        const currentPeriod = analytics.periods.find((p: any) => p.period === periodName);
        return currentPeriod || analytics.periods[2]; // Default to 1 Month
    };

    const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;

    if (isLoading) {
        return (
            <div className="space-y-6" data-oid="pharmacy-loading">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-gray-200 animate-pulse rounded-xl h-32"
                        data-oid={`pharmacy-loading-${i}`}
                    ></div>
                ))}
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center py-8" data-oid="pharmacy-error">
                <AlertCircle
                    className="w-12 h-12 text-gray-400 mx-auto mb-4"
                    data-oid="pharmacy-error-icon"
                />

                <p className="text-gray-500" data-oid="pharmacy-error-text">
                    Unable to load revenue analytics
                </p>
            </div>
        );
    }

    const currentData = getCurrentPeriodData();
    if (!currentData) return null;

    return (
        <div className="space-y-6" data-oid="pharmacy-analytics">
            {/* Header with Timeframe Selector */}
            <div className="flex items-center justify-between" data-oid="pharmacy-header">
                <h3 className="text-lg font-semibold" data-oid="pharmacy-title">
                    Pharmacy Analytics Overview
                </h3>
                <select
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    data-oid="pharmacy-timeframe-selector"
                >
                    <option value="today" data-oid="pharmacy-today">
                        Today
                    </option>
                    <option value="7d" data-oid="pharmacy-7d">
                        7 Days
                    </option>
                    <option value="1m" data-oid="pharmacy-1m">
                        1 Month
                    </option>
                    <option value="6m" data-oid="pharmacy-6m">
                        6 Months
                    </option>
                    <option value="1y" data-oid="pharmacy-1y">
                        1 Year
                    </option>
                    <option value="all" data-oid="pharmacy-all">
                        All Time
                    </option>
                </select>
            </div>

            {/* Summary Cards */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                data-oid="pharmacy-summary-cards"
            >
                <Card
                    className="bg-gradient-to-br from-cura-primary/10 to-cura-primary/20 border-cura-primary/30"
                    data-oid="pharmacy-commission-card"
                >
                    <CardContent className="p-6" data-oid="pharmacy-commission-content">
                        <div
                            className="flex items-center justify-between mb-4"
                            data-oid="pharmacy-commission-header"
                        >
                            <div data-oid="pharmacy-commission-info">
                                <h4
                                    className="text-sm font-medium text-cura-primary"
                                    data-oid="pharmacy-commission-title"
                                >
                                    My Commission Revenue
                                </h4>
                                <p
                                    className="text-xs text-cura-primary/70"
                                    data-oid="pharmacy-commission-subtitle"
                                >
                                    Commission & fees earned
                                </p>
                            </div>
                            <div
                                className="p-2 bg-cura-primary/20 rounded-lg"
                                data-oid="pharmacy-commission-icon-bg"
                            >
                                <DollarSign
                                    className="h-5 w-5 text-cura-primary"
                                    data-oid="pharmacy-commission-icon"
                                />
                            </div>
                        </div>
                        <div
                            className="text-3xl font-bold text-cura-primary mb-2"
                            data-oid="pharmacy-commission-amount"
                        >
                            {formatCurrency(Math.round(currentData.revenue * 0.12))}
                        </div>
                        <div
                            className="flex items-center text-sm"
                            data-oid="pharmacy-commission-growth"
                        >
                            <TrendingUp
                                className="h-4 w-4 text-green-600 mr-1"
                                data-oid="pharmacy-commission-growth-icon"
                            />

                            <span
                                className="text-green-600 font-medium"
                                data-oid="pharmacy-commission-growth-percent"
                            >
                                +16.4%
                            </span>
                            <span
                                className="text-cura-primary/70 ml-1"
                                data-oid="pharmacy-commission-growth-text"
                            >
                                vs last period
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="bg-gradient-to-br from-cura-secondary/10 to-cura-secondary/20 border-cura-secondary/30"
                    data-oid="pharmacy-revenue-card"
                >
                    <CardContent className="p-6" data-oid="pharmacy-revenue-content">
                        <div
                            className="flex items-center justify-between mb-4"
                            data-oid="pharmacy-revenue-header"
                        >
                            <div data-oid="pharmacy-revenue-info">
                                <h4
                                    className="text-sm font-medium text-cura-secondary"
                                    data-oid="pharmacy-revenue-title"
                                >
                                    Pharmacy Total Revenue
                                </h4>
                                <p
                                    className="text-xs text-cura-secondary/70"
                                    data-oid="pharmacy-revenue-subtitle"
                                >
                                    Gross sales revenue
                                </p>
                            </div>
                            <div
                                className="p-2 bg-cura-secondary/20 rounded-lg"
                                data-oid="pharmacy-revenue-icon-bg"
                            >
                                <BarChart3
                                    className="h-5 w-5 text-cura-secondary"
                                    data-oid="pharmacy-revenue-icon"
                                />
                            </div>
                        </div>
                        <div
                            className="text-3xl font-bold text-cura-secondary mb-2"
                            data-oid="pharmacy-revenue-amount"
                        >
                            {formatCurrency(currentData.revenue)}
                        </div>
                        <div
                            className="flex items-center text-sm"
                            data-oid="pharmacy-revenue-growth"
                        >
                            <TrendingUp
                                className="h-4 w-4 text-green-600 mr-1"
                                data-oid="pharmacy-revenue-growth-icon"
                            />

                            <span
                                className="text-green-600 font-medium"
                                data-oid="pharmacy-revenue-growth-percent"
                            >
                                +28.7%
                            </span>
                            <span
                                className="text-cura-secondary/70 ml-1"
                                data-oid="pharmacy-revenue-growth-text"
                            >
                                vs last period
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="bg-gradient-to-br from-cura-accent/10 to-cura-accent/20 border-cura-accent/30"
                    data-oid="pharmacy-net-revenue-card"
                >
                    <CardContent className="p-6" data-oid="pharmacy-net-revenue-content">
                        <div
                            className="flex items-center justify-between mb-4"
                            data-oid="pharmacy-net-revenue-header"
                        >
                            <div data-oid="pharmacy-net-revenue-info">
                                <h4
                                    className="text-sm font-medium text-cura-accent"
                                    data-oid="pharmacy-net-revenue-title"
                                >
                                    Pharmacy{"'"}s Net Revenue
                                </h4>
                                <p
                                    className="text-xs text-cura-accent/70"
                                    data-oid="pharmacy-net-revenue-subtitle"
                                >
                                    After commission deduction
                                </p>
                            </div>
                            <div
                                className="p-2 bg-cura-accent/20 rounded-lg"
                                data-oid="pharmacy-net-revenue-icon-bg"
                            >
                                <Target
                                    className="h-5 w-5 text-cura-accent"
                                    data-oid="pharmacy-net-revenue-icon"
                                />
                            </div>
                        </div>
                        <div
                            className="text-3xl font-bold text-cura-accent mb-2"
                            data-oid="pharmacy-net-revenue-amount"
                        >
                            {formatCurrency(Math.round(currentData.revenue * 0.88))}
                        </div>
                        <div
                            className="flex items-center text-sm"
                            data-oid="pharmacy-net-revenue-growth"
                        >
                            <TrendingUp
                                className="h-4 w-4 text-green-600 mr-1"
                                data-oid="pharmacy-net-revenue-growth-icon"
                            />

                            <span
                                className="text-green-600 font-medium"
                                data-oid="pharmacy-net-revenue-growth-percent"
                            >
                                +24.3%
                            </span>
                            <span
                                className="text-cura-accent/70 ml-1"
                                data-oid="pharmacy-net-revenue-growth-text"
                            >
                                vs last period
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="bg-gradient-to-br from-cura-primary/5 to-cura-primary/15 border-cura-primary/20"
                    data-oid="pharmacy-sales-volume-card"
                >
                    <CardContent className="p-6" data-oid="pharmacy-sales-volume-content">
                        <div
                            className="flex items-center justify-between mb-4"
                            data-oid="pharmacy-sales-volume-header"
                        >
                            <div data-oid="pharmacy-sales-volume-info">
                                <h4
                                    className="text-sm font-medium text-cura-primary/80"
                                    data-oid="pharmacy-sales-volume-title"
                                >
                                    Total Sales Volume
                                </h4>
                                <p
                                    className="text-xs text-cura-primary/60"
                                    data-oid="pharmacy-sales-volume-subtitle"
                                >
                                    Units sold & orders
                                </p>
                            </div>
                            <div
                                className="p-2 bg-cura-primary/15 rounded-lg"
                                data-oid="pharmacy-sales-volume-icon-bg"
                            >
                                <ShoppingCart
                                    className="h-5 w-5 text-cura-primary/80"
                                    data-oid="pharmacy-sales-volume-icon"
                                />
                            </div>
                        </div>
                        <div
                            className="text-3xl font-bold text-cura-primary/90 mb-2"
                            data-oid="pharmacy-sales-volume-amount"
                        >
                            {currentData.sales.toLocaleString()}
                        </div>
                        <div
                            className="flex items-center justify-between text-sm"
                            data-oid="pharmacy-sales-volume-details"
                        >
                            <div
                                className="flex items-center"
                                data-oid="pharmacy-sales-volume-growth"
                            >
                                <TrendingUp
                                    className="h-4 w-4 text-green-600 mr-1"
                                    data-oid="pharmacy-sales-volume-growth-icon"
                                />

                                <span
                                    className="text-green-600 font-medium"
                                    data-oid="pharmacy-sales-volume-growth-percent"
                                >
                                    +26.8%
                                </span>
                            </div>
                            <div
                                className="text-cura-primary/70"
                                data-oid="pharmacy-sales-volume-orders"
                            >
                                {currentData.orders} orders
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Trends Section */}
            <div data-oid="pharmacy-revenue-trends">
                <h3 className="text-lg font-semibold mb-4" data-oid="pharmacy-revenue-trends-title">
                    Revenue Trends
                </h3>

                {/* Detailed Metrics Cards */}
                <div
                    className="grid grid-cols-1 md:grid-cols-4 gap-4"
                    data-oid="pharmacy-detailed-metrics"
                >
                    <Card data-oid="pharmacy-revenue-metric">
                        <CardContent className="p-4" data-oid="pharmacy-revenue-metric-content">
                            <div
                                className="flex items-center justify-between mb-2"
                                data-oid="pharmacy-revenue-metric-header"
                            >
                                <span
                                    className="text-sm text-gray-600"
                                    data-oid="pharmacy-revenue-metric-label"
                                >
                                    Revenue
                                </span>
                                <DollarSign
                                    className="h-4 w-4 text-gray-400"
                                    data-oid="pharmacy-revenue-metric-icon"
                                />
                            </div>
                            <div
                                className="text-2xl font-bold text-cura-primary"
                                data-oid="pharmacy-revenue-metric-value"
                            >
                                {formatCurrency(currentData.revenue)}
                            </div>
                            <div
                                className="text-xs text-cura-secondary"
                                data-oid="pharmacy-revenue-metric-growth"
                            >
                                +28.7% vs last period
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="pharmacy-orders-metric">
                        <CardContent className="p-4" data-oid="pharmacy-orders-metric-content">
                            <div
                                className="flex items-center justify-between mb-2"
                                data-oid="pharmacy-orders-metric-header"
                            >
                                <span
                                    className="text-sm text-gray-600"
                                    data-oid="pharmacy-orders-metric-label"
                                >
                                    Orders
                                </span>
                                <ShoppingCart
                                    className="h-4 w-4 text-gray-400"
                                    data-oid="pharmacy-orders-metric-icon"
                                />
                            </div>
                            <div
                                className="text-2xl font-bold text-cura-primary"
                                data-oid="pharmacy-orders-metric-value"
                            >
                                {currentData.orders.toLocaleString()}
                            </div>
                            <div
                                className="text-xs text-cura-secondary"
                                data-oid="pharmacy-orders-metric-growth"
                            >
                                +31.2% vs last period
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="pharmacy-sales-metric">
                        <CardContent className="p-4" data-oid="pharmacy-sales-metric-content">
                            <div
                                className="flex items-center justify-between mb-2"
                                data-oid="pharmacy-sales-metric-header"
                            >
                                <span
                                    className="text-sm text-gray-600"
                                    data-oid="pharmacy-sales-metric-label"
                                >
                                    Sales
                                </span>
                                <Target
                                    className="h-4 w-4 text-gray-400"
                                    data-oid="pharmacy-sales-metric-icon"
                                />
                            </div>
                            <div
                                className="text-2xl font-bold text-cura-primary"
                                data-oid="pharmacy-sales-metric-value"
                            >
                                {currentData.sales.toLocaleString()}
                            </div>
                            <div
                                className="text-xs text-cura-secondary"
                                data-oid="pharmacy-sales-metric-growth"
                            >
                                +26.8% vs last period
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="pharmacy-returns-metric">
                        <CardContent className="p-4" data-oid="pharmacy-returns-metric-content">
                            <div
                                className="flex items-center justify-between mb-2"
                                data-oid="pharmacy-returns-metric-header"
                            >
                                <span
                                    className="text-sm text-gray-600"
                                    data-oid="pharmacy-returns-metric-label"
                                >
                                    Returns
                                </span>
                                <RotateCcw
                                    className="h-4 w-4 text-gray-400"
                                    data-oid="pharmacy-returns-metric-icon"
                                />
                            </div>
                            <div
                                className="text-2xl font-bold text-cura-primary"
                                data-oid="pharmacy-returns-metric-value"
                            >
                                {currentData.returns}
                            </div>
                            <div
                                className="text-xs text-red-500"
                                data-oid="pharmacy-returns-metric-growth"
                            >
                                -5.2% vs last period
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Analytics Table */}
                <Card data-oid="pharmacy-detailed-analytics">
                    <CardHeader data-oid="pharmacy-detailed-analytics-header">
                        <CardTitle data-oid="pharmacy-detailed-analytics-title">
                            Detailed Analytics
                        </CardTitle>
                    </CardHeader>
                    <CardContent data-oid="pharmacy-detailed-analytics-content">
                        <div
                            className="overflow-x-auto"
                            data-oid="pharmacy-analytics-table-container"
                        >
                            <table className="w-full" data-oid="pharmacy-analytics-table">
                                <thead data-oid="pharmacy-analytics-table-head">
                                    <tr
                                        className="border-b"
                                        data-oid="pharmacy-analytics-table-header-row"
                                    >
                                        <th
                                            className="text-left py-2 text-sm font-medium text-gray-600"
                                            data-oid="pharmacy-analytics-period-header"
                                        >
                                            Period
                                        </th>
                                        <th
                                            className="text-right py-2 text-sm font-medium text-gray-600"
                                            data-oid="pharmacy-analytics-revenue-header"
                                        >
                                            Revenue
                                        </th>
                                        <th
                                            className="text-right py-2 text-sm font-medium text-gray-600"
                                            data-oid="pharmacy-analytics-orders-header"
                                        >
                                            Orders
                                        </th>
                                        <th
                                            className="text-right py-2 text-sm font-medium text-gray-600"
                                            data-oid="pharmacy-analytics-sales-header"
                                        >
                                            Sales
                                        </th>
                                        <th
                                            className="text-right py-2 text-sm font-medium text-gray-600"
                                            data-oid="pharmacy-analytics-returns-header"
                                        >
                                            Returns
                                        </th>
                                        <th
                                            className="text-right py-2 text-sm font-medium text-gray-600"
                                            data-oid="pharmacy-analytics-avg-order-header"
                                        >
                                            Avg Order
                                        </th>
                                    </tr>
                                </thead>
                                <tbody data-oid="pharmacy-analytics-table-body">
                                    {analytics.periods.map((period: any, index: number) => {
                                        const isSelected =
                                            period.period === getCurrentPeriodData()?.period;
                                        return (
                                            <tr
                                                key={index}
                                                className={`border-b ${isSelected ? 'bg-blue-50' : ''}`}
                                                data-oid={`pharmacy-analytics-row-${index}`}
                                            >
                                                <td
                                                    className="py-2 text-sm"
                                                    data-oid={`pharmacy-analytics-period-${index}`}
                                                >
                                                    {period.period}
                                                    {isSelected && (
                                                        <Badge
                                                            variant="outline"
                                                            className="ml-2 text-xs"
                                                            data-oid={`pharmacy-analytics-selected-badge-${index}`}
                                                        >
                                                            Selected
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td
                                                    className="py-2 text-sm text-right font-medium text-cura-primary"
                                                    data-oid={`pharmacy-analytics-revenue-${index}`}
                                                >
                                                    {formatCurrency(period.revenue)}
                                                </td>
                                                <td
                                                    className="py-2 text-sm text-right"
                                                    data-oid={`pharmacy-analytics-orders-${index}`}
                                                >
                                                    {period.orders}
                                                </td>
                                                <td
                                                    className="py-2 text-sm text-right"
                                                    data-oid={`pharmacy-analytics-sales-${index}`}
                                                >
                                                    {period.sales}
                                                </td>
                                                <td
                                                    className="py-2 text-sm text-right"
                                                    data-oid={`pharmacy-analytics-returns-${index}`}
                                                >
                                                    {period.returns}
                                                </td>
                                                <td
                                                    className="py-2 text-sm text-right"
                                                    data-oid={`pharmacy-analytics-avg-order-${index}`}
                                                >
                                                    {formatCurrency(period.avgOrder)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Metrics and Growth Analytics */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    data-oid="pharmacy-performance-growth"
                >
                    <Card data-oid="pharmacy-performance-metrics">
                        <CardHeader data-oid="pharmacy-performance-metrics-header">
                            <CardTitle
                                className="flex items-center space-x-2"
                                data-oid="pharmacy-performance-metrics-title"
                            >
                                <BarChart3
                                    className="w-5 h-5"
                                    data-oid="pharmacy-performance-metrics-icon"
                                />

                                <span data-oid="pharmacy-performance-metrics-text">
                                    Performance Metrics
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent data-oid="pharmacy-performance-metrics-content">
                            <div
                                className="flex items-center justify-center mb-6"
                                data-oid="pharmacy-performance-score-container"
                            >
                                <div
                                    className="relative w-32 h-32"
                                    data-oid="pharmacy-performance-score-circle"
                                >
                                    <svg
                                        className="w-32 h-32 transform -rotate-90"
                                        viewBox="0 0 36 36"
                                        data-oid="pharmacy-performance-score-svg"
                                    >
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#e5e7eb"
                                            strokeWidth="2"
                                            data-oid="pharmacy-performance-score-bg"
                                        />

                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#1F1F6F"
                                            strokeWidth="2"
                                            strokeDasharray={`${analytics.performance.score}, 100`}
                                            data-oid="pharmacy-performance-score-fill"
                                        />
                                    </svg>
                                    <div
                                        className="absolute inset-0 flex items-center justify-center"
                                        data-oid="pharmacy-performance-score-text-container"
                                    >
                                        <div
                                            className="text-center"
                                            data-oid="pharmacy-performance-score-text"
                                        >
                                            <div
                                                className="text-2xl font-bold text-cura-primary"
                                                data-oid="pharmacy-performance-score-value"
                                            >
                                                {analytics.performance.score}%
                                            </div>
                                            <div
                                                className="text-xs text-gray-500"
                                                data-oid="pharmacy-performance-score-label"
                                            >
                                                Score
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3" data-oid="pharmacy-performance-details">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="pharmacy-performance-avg-order"
                                >
                                    <span
                                        className="text-sm text-gray-600"
                                        data-oid="pharmacy-performance-avg-order-label"
                                    >
                                        Avg Order
                                    </span>
                                    <span
                                        className="font-medium"
                                        data-oid="pharmacy-performance-avg-order-value"
                                    >
                                        {formatCurrency(analytics.performance.avgOrder)}
                                    </span>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="pharmacy-performance-return-rate"
                                >
                                    <span
                                        className="text-sm text-gray-600"
                                        data-oid="pharmacy-performance-return-rate-label"
                                    >
                                        Return Rate
                                    </span>
                                    <span
                                        className="font-medium"
                                        data-oid="pharmacy-performance-return-rate-value"
                                    >
                                        {analytics.performance.returnRate}%
                                    </span>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="pharmacy-performance-efficiency"
                                >
                                    <span
                                        className="text-sm text-gray-600"
                                        data-oid="pharmacy-performance-efficiency-label"
                                    >
                                        Efficiency
                                    </span>
                                    <span
                                        className="font-medium"
                                        data-oid="pharmacy-performance-efficiency-value"
                                    >
                                        {analytics.performance.efficiency}%
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="pharmacy-growth-analytics">
                        <CardHeader data-oid="pharmacy-growth-analytics-header">
                            <CardTitle
                                className="flex items-center space-x-2"
                                data-oid="pharmacy-growth-analytics-title"
                            >
                                <TrendingUp
                                    className="w-5 h-5"
                                    data-oid="pharmacy-growth-analytics-icon"
                                />

                                <span data-oid="pharmacy-growth-analytics-text">
                                    Growth Analytics
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent data-oid="pharmacy-growth-analytics-content">
                            <div className="space-y-4" data-oid="pharmacy-growth-metrics">
                                <div data-oid="pharmacy-growth-revenue">
                                    <div
                                        className="flex items-center justify-between mb-2"
                                        data-oid="pharmacy-growth-revenue-header"
                                    >
                                        <span
                                            className="text-sm text-gray-600"
                                            data-oid="pharmacy-growth-revenue-label"
                                        >
                                            Revenue Growth
                                        </span>
                                        <span
                                            className="font-bold text-cura-secondary"
                                            data-oid="pharmacy-growth-revenue-value"
                                        >
                                            +{analytics.growth.revenue}%
                                        </span>
                                    </div>
                                    <div
                                        className="w-full bg-gray-200 rounded-full h-2"
                                        data-oid="pharmacy-growth-revenue-bar-bg"
                                    >
                                        <div
                                            className="bg-cura-secondary h-2 rounded-full"
                                            style={{
                                                width: `${Math.min(analytics.growth.revenue * 2, 100)}%`,
                                            }}
                                            data-oid="pharmacy-growth-revenue-bar"
                                        ></div>
                                    </div>
                                </div>
                                <div data-oid="pharmacy-growth-orders">
                                    <div
                                        className="flex items-center justify-between mb-2"
                                        data-oid="pharmacy-growth-orders-header"
                                    >
                                        <span
                                            className="text-sm text-gray-600"
                                            data-oid="pharmacy-growth-orders-label"
                                        >
                                            Orders Growth
                                        </span>
                                        <span
                                            className="font-bold text-cura-secondary"
                                            data-oid="pharmacy-growth-orders-value"
                                        >
                                            +{analytics.growth.orders}%
                                        </span>
                                    </div>
                                    <div
                                        className="w-full bg-gray-200 rounded-full h-2"
                                        data-oid="pharmacy-growth-orders-bar-bg"
                                    >
                                        <div
                                            className="bg-cura-primary h-2 rounded-full"
                                            style={{
                                                width: `${Math.min(analytics.growth.orders * 2, 100)}%`,
                                            }}
                                            data-oid="pharmacy-growth-orders-bar"
                                        ></div>
                                    </div>
                                </div>
                                <div data-oid="pharmacy-growth-sales">
                                    <div
                                        className="flex items-center justify-between mb-2"
                                        data-oid="pharmacy-growth-sales-header"
                                    >
                                        <span
                                            className="text-sm text-gray-600"
                                            data-oid="pharmacy-growth-sales-label"
                                        >
                                            Sales Growth
                                        </span>
                                        <span
                                            className="font-bold text-cura-secondary"
                                            data-oid="pharmacy-growth-sales-value"
                                        >
                                            +{analytics.growth.sales}%
                                        </span>
                                    </div>
                                    <div
                                        className="w-full bg-gray-200 rounded-full h-2"
                                        data-oid="pharmacy-growth-sales-bar-bg"
                                    >
                                        <div
                                            className="bg-cura-accent h-2 rounded-full"
                                            style={{
                                                width: `${Math.min(analytics.growth.sales * 2, 100)}%`,
                                            }}
                                            data-oid="pharmacy-growth-sales-bar"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 text-center" data-oid="pharmacy-growth-overall">
                                <div
                                    className="text-lg font-bold text-cura-secondary"
                                    data-oid="pharmacy-growth-overall-rating"
                                >
                                    Excellent
                                </div>
                                <div
                                    className="text-sm text-gray-500"
                                    data-oid="pharmacy-growth-overall-label"
                                >
                                    Overall Performance
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
