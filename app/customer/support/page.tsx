'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerSupportPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to contact page immediately when component mounts
        router.replace('/contact');
    }, [router]);

    // Return null or a loading state since we're redirecting
    return null;
}
