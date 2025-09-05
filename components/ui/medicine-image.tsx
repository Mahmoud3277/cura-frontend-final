import React from 'react';
import { Pill } from 'lucide-react';

interface MedicineImageProps {
    src?: string;
    alt: string;
    className?: string;
    fallbackClassName?: string;
}

export const MedicineImage: React.FC<MedicineImageProps> = ({
    src,
    alt,
    className = 'w-full h-full object-cover',
    fallbackClassName = 'w-8 h-8 text-gray-400',
}) => {
    const [imageError, setImageError] = React.useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    if (!src || imageError) {
        return (
            <div
                className="w-full h-full flex items-center justify-center bg-gray-100 rounded"
                data-oid="htom79d"
            >
                <Pill className={fallbackClassName} data-oid="bu03whf" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={handleImageError}
            data-oid="4mspanw"
        />
    );
};
