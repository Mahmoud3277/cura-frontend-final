'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {
    TestRunner,
    TestResult,
    createCURATestSuite,
    testAccessibility,
} from '@/lib/utils/testing';
import { PerformanceMonitor, getMemoryUsage } from '@/lib/utils/performance';

export default function TestPage() {
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [memoryUsage, setMemoryUsage] = useState<any>(null);
    const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

    useEffect(() => {
        // Update memory usage every 5 seconds
        const interval = setInterval(() => {
            const usage = getMemoryUsage();
            setMemoryUsage(usage);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const runTests = async () => {
        setIsRunning(true);

        try {
            const testSuite = createCURATestSuite();
            const results = await testSuite.runAll();

            // Add accessibility tests
            const accessibilityTests = testAccessibility(document.body);

            setTestResults([...results, ...accessibilityTests]);

            // Get performance metrics
            const monitor = PerformanceMonitor.getInstance();
            setPerformanceMetrics(monitor.getMetrics());
        } catch (error) {
            console.error('Test execution failed:', error);
        } finally {
            setIsRunning(false);
        }
    };

    const summary =
        testResults.length > 0
            ? {
                  total: testResults.length,
                  passed: testResults.filter((r) => r.passed).length,
                  failed: testResults.filter((r) => !r.passed).length,
                  passRate: (testResults.filter((r) => r.passed).length / testResults.length) * 100,
              }
            : null;

    if (process.env.NODE_ENV === 'production') {
        return (
            <div className="min-h-screen flex items-center justify-center" data-oid="xt1_cnp">
                <div className="text-center" data-oid="19r6go4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4" data-oid="9x:jgoy">
                        Test Page Not Available
                    </h1>
                    <p className="text-gray-600" data-oid="rdkf0o:">
                        This page is only available in development mode.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="s3kny9g">
            <Header data-oid="6:bit8z" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-oid="g4t0hhd">
                <div className="mb-8" data-oid="3m1ex43">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2" data-oid="0wz0:d9">
                        CURA Testing Dashboard
                    </h1>
                    <p className="text-gray-600" data-oid="wxh1xxz">
                        Comprehensive testing and performance monitoring for the CURA platform.
                    </p>
                </div>

                {/* Test Controls */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8" data-oid="n309pux">
                    <div className="flex items-center justify-between mb-4" data-oid="a23az:e">
                        <h2 className="text-xl font-semibold text-gray-900" data-oid="ddm_2c.">
                            Test Suite
                        </h2>
                        <button
                            onClick={runTests}
                            disabled={isRunning}
                            className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-6 py-2 rounded-lg hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 disabled:opacity-50"
                            data-oid="5w7b5k2"
                        >
                            {isRunning ? 'Running Tests...' : 'Run All Tests'}
                        </button>
                    </div>

                    {isRunning && (
                        <div className="mb-4" data-oid="z6_o3vk">
                            <LoadingSpinner
                                text="Running comprehensive tests..."
                                data-oid="f5tz_bp"
                            />
                        </div>
                    )}

                    {/* Test Summary */}
                    {summary && (
                        <div
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                            data-oid="3d.4.dr"
                        >
                            <div className="bg-blue-50 p-4 rounded-lg" data-oid="q859ifg">
                                <div
                                    className="text-2xl font-bold text-blue-600"
                                    data-oid="kxoai5z"
                                >
                                    {summary.total}
                                </div>
                                <div className="text-sm text-blue-800" data-oid="3y_yxao">
                                    Total Tests
                                </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg" data-oid="e2u7f:q">
                                <div
                                    className="text-2xl font-bold text-green-600"
                                    data-oid=".yd0feh"
                                >
                                    {summary.passed}
                                </div>
                                <div className="text-sm text-green-800" data-oid="wbeahbm">
                                    Passed
                                </div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg" data-oid="d2-froy">
                                <div className="text-2xl font-bold text-red-600" data-oid="9f4v.rt">
                                    {summary.failed}
                                </div>
                                <div className="text-sm text-red-800" data-oid="w20.8.w">
                                    Failed
                                </div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg" data-oid="eyf14e1">
                                <div
                                    className="text-2xl font-bold text-purple-600"
                                    data-oid="73az3v2"
                                >
                                    {summary.passRate.toFixed(1)}%
                                </div>
                                <div className="text-sm text-purple-800" data-oid="2ovsusz">
                                    Pass Rate
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Test Results */}
                    {testResults.length > 0 && (
                        <div className="space-y-2" data-oid="oim3c1q">
                            <h3 className="font-semibold text-gray-900 mb-3" data-oid="3qz:mpj">
                                Test Results
                            </h3>
                            {testResults.map((result, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg border ${
                                        result.passed
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-red-50 border-red-200'
                                    }`}
                                    data-oid="fgw-6rd"
                                >
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="qswa_f2"
                                    >
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="96a7zju"
                                        >
                                            <span
                                                className={`text-lg ${
                                                    result.passed
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }`}
                                                data-oid="0fs5.vh"
                                            >
                                                {result.passed ? '✅' : '❌'}
                                            </span>
                                            <span className="font-medium" data-oid="ewrj-tz">
                                                {result.name}
                                            </span>
                                        </div>
                                        {result.duration && (
                                            <span
                                                className="text-sm text-gray-500"
                                                data-oid="qjojeos"
                                            >
                                                {result.duration.toFixed(2)}ms
                                            </span>
                                        )}
                                    </div>
                                    {result.error && (
                                        <div
                                            className="mt-2 text-sm text-red-600"
                                            data-oid="l9id:pz"
                                        >
                                            {result.error}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="vfo81um">
                    {/* Memory Usage */}
                    <div className="bg-white rounded-lg shadow-md p-6" data-oid="neiuy2v">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4" data-oid="4zkq32o">
                            Memory Usage
                        </h2>
                        {memoryUsage ? (
                            <div className="space-y-3" data-oid="vx4r1d0">
                                <div className="flex justify-between" data-oid="777ykk9">
                                    <span data-oid="h5v7asp">Used Memory:</span>
                                    <span className="font-mono" data-oid="o1rbtg1">
                                        {memoryUsage.used} MB
                                    </span>
                                </div>
                                <div className="flex justify-between" data-oid="do.8kjb">
                                    <span data-oid="3u8ee_j">Total Memory:</span>
                                    <span className="font-mono" data-oid="eu2vece">
                                        {memoryUsage.total} MB
                                    </span>
                                </div>
                                <div className="flex justify-between" data-oid=":u8gpkk">
                                    <span data-oid="9.4qwjd">Usage:</span>
                                    <span
                                        className={`font-mono ${
                                            memoryUsage.percentage > 80
                                                ? 'text-red-600'
                                                : memoryUsage.percentage > 60
                                                  ? 'text-yellow-600'
                                                  : 'text-green-600'
                                        }`}
                                        data-oid="ew4p94z"
                                    >
                                        {memoryUsage.percentage}%
                                    </span>
                                </div>
                                <div
                                    className="w-full bg-gray-200 rounded-full h-2"
                                    data-oid="g3jd94h"
                                >
                                    <div
                                        className={`h-2 rounded-full ${
                                            memoryUsage.percentage > 80
                                                ? 'bg-red-500'
                                                : memoryUsage.percentage > 60
                                                  ? 'bg-yellow-500'
                                                  : 'bg-green-500'
                                        }`}
                                        style={{ width: `${memoryUsage.percentage}%` }}
                                        data-oid="7csr1of"
                                    />
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500" data-oid="z:cyz9z">
                                Memory monitoring not available
                            </p>
                        )}
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-white rounded-lg shadow-md p-6" data-oid="fv:-woj">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4" data-oid=":1h8fjz">
                            Performance Metrics
                        </h2>
                        {performanceMetrics ? (
                            <div className="space-y-3" data-oid="dkv2rx1">
                                {Object.entries(performanceMetrics).map(
                                    ([name, metrics]: [string, any]) => (
                                        <div
                                            key={name}
                                            className="border-b border-gray-100 pb-2"
                                            data-oid="72k:au_"
                                        >
                                            <div className="font-medium text-sm" data-oid="wui8kyd">
                                                {name}
                                            </div>
                                            <div
                                                className="text-xs text-gray-600 space-y-1"
                                                data-oid="4pvd_c9"
                                            >
                                                <div data-oid="cxjr.0v">
                                                    Average: {metrics.average.toFixed(2)}ms
                                                </div>
                                                <div data-oid="lju70:5">Count: {metrics.count}</div>
                                                <div data-oid="zvtkr-h">
                                                    Latest: {metrics.latest.toFixed(2)}ms
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500" data-oid="8y40x_p">
                                No performance data available
                            </p>
                        )}
                    </div>
                </div>

                {/* Browser Information */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-8" data-oid="7an_8s:">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4" data-oid="f.xmj2c">
                        Browser Information
                    </h2>
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
                        data-oid="j-vw395"
                    >
                        <div data-oid="ib.r0vl">
                            <strong data-oid="ktr8_fy">User Agent:</strong>
                            <div className="font-mono text-xs mt-1 break-all" data-oid="bwdf:g3">
                                {navigator.userAgent}
                            </div>
                        </div>
                        <div data-oid="bxwizl1">
                            <strong data-oid="tjpe8ok">Viewport:</strong>
                            <div className="font-mono" data-oid="65hdm3h">
                                {window.innerWidth} x {window.innerHeight}
                            </div>
                        </div>
                        <div data-oid="mg.qd.3">
                            <strong data-oid="bs2voe5">Screen:</strong>
                            <div className="font-mono" data-oid="f0z:j0s">
                                {screen.width} x {screen.height}
                            </div>
                        </div>
                        <div data-oid="d_532-z">
                            <strong data-oid="fz8gjqt">Connection:</strong>
                            <div className="font-mono" data-oid="qx_zjn4">
                                {(navigator as any).connection?.effectiveType || 'Unknown'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer data-oid=".qc-m88" />
        </div>
    );
}
