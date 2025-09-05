'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div
                    className="min-h-screen flex items-center justify-center bg-gray-50"
                    data-oid="_8xiami"
                >
                    <div
                        className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center"
                        data-oid="tf96:g3"
                    >
                        <div className="text-6xl mb-4" data-oid="vk:dg_8">
                            ⚠️
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2" data-oid="hrfzktc">
                            Something went wrong
                        </h2>
                        <p className="text-gray-600 mb-6" data-oid="qnbl4ka">
                            We{"'"}re sorry, but something unexpected happened. Please try refreshing
                            the page.
                        </p>
                        <div className="space-y-3" data-oid="bo:rf:x">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-4 py-2 rounded-lg hover:from-[#14274E] hover:to-[#394867] transition-all duration-300"
                                data-oid="v1so9fd"
                            >
                                Refresh Page
                            </button>
                            <button
                                onClick={() => (window.location.href = '/')}
                                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                data-oid=".zd.:_p"
                            >
                                Go to Homepage
                            </button>
                        </div>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left" data-oid="2ay854w">
                                <summary
                                    className="cursor-pointer text-sm text-gray-500 hover:text-gray-700"
                                    data-oid="7bdh2sq"
                                >
                                    Error Details (Development)
                                </summary>
                                <pre
                                    className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40"
                                    data-oid="svcc2fk"
                                >
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook version for functional components
export function useErrorHandler() {
    return (error: Error, errorInfo?: ErrorInfo) => {
        console.error('Error caught by useErrorHandler:', error, errorInfo);
        // In a real app, you might want to send this to an error reporting service
    };
}
