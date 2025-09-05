'use client';

import { useToast } from '@/hooks/use-toast';
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from '@/components/ui/toast';

export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider data-oid="012il0q">
            {toasts.map(function ({ id, title, description, action, ...props }) {
                return (
                    <Toast key={id} {...props} data-oid="uhpmfxu">
                        <div className="grid gap-1" data-oid="rgek-si">
                            {title && <ToastTitle data-oid="sxicwez">{title}</ToastTitle>}
                            {description && (
                                <ToastDescription data-oid="ak3yq9w">
                                    {description}
                                </ToastDescription>
                            )}
                        </div>
                        {action}
                        <ToastClose data-oid="d09z09d" />
                    </Toast>
                );
            })}
            <ToastViewport data-oid="gmwl02c" />
        </ToastProvider>
    );
}
