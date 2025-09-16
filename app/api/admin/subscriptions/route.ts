import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
    try {
        // Forward the request to the backend
        const response = await fetch(`${BACKEND_URL}/api/admin/subscriptions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Forward any authorization headers if present
                ...(request.headers.get('authorization') && {
                    'authorization': request.headers.get('authorization')!
                })
            },
        });

        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }

        const subscriptions = await response.json();
        return NextResponse.json(subscriptions);
    } catch (error) {
        console.error('Error fetching admin subscriptions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscriptions' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { subscriptionId, status } = body;

        // Forward the request to the backend
        const response = await fetch(`${BACKEND_URL}/api/admin/subscriptions/${subscriptionId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(request.headers.get('authorization') && {
                    'authorization': request.headers.get('authorization')!
                })
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }

        const updatedSubscription = await response.json();
        return NextResponse.json(updatedSubscription);
    } catch (error) {
        console.error('Error updating subscription status:', error);
        return NextResponse.json(
            { error: 'Failed to update subscription status' },
            { status: 500 }
        );
    }
}
