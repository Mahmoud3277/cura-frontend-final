'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PrescriptionWorkflowService } from '@/lib/services/prescriptionWorkflowService';
import { PrescriptionWorkflow, ProcessedMedicine } from '@/lib/data/prescriptionWorkflow';
import { CompletedPrescriptionsView } from '@/components/prescription/CompletedPrescriptionsView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { filterProducts, Product } from '@/lib/data/products';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { prescriptionAPIService } from '@/lib/data/prescriptionWorkflow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/ui/Logo';
import {
    Pill,
    FileText,
    Clock,
    User,
    Phone,
    Calendar,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    Plus,
    Minus,
    Search,
    Star,
    ShoppingCart,
    Maximize2,
    X,
} from 'lucide-react';

// Using ProcessedMedicine from @/lib/data/prescriptionWorkflow
// Extended locally to include additional fields needed for the prescription reader
interface LocalProcessedMedicine extends ProcessedMedicine {
    product: Product;
    name: string;
    packagingUnit?: string;
    alternativeProducts?: Product[];
    frequency?: string;
    duration?: string;
    notes?: string;
}

export default function PrescriptionReaderPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [prescriptions, setPrescriptions] = useState<PrescriptionWorkflow[]>([]);
    const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionWorkflow | null>(
        null,
    );
    const [processedMedicines, setProcessedMedicines] = useState<LocalProcessedMedicine[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCompleted, setShowCompleted] = useState(false);
    const [processingNotes, setProcessingNotes] = useState('');
    const [showProductSelector, setShowProductSelector] = useState(false);
    const [productSearchQuery, setProductSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isPrescriptionQueueMinimized, setIsPrescriptionQueueMinimized] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<any>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showAlternativeSelector, setShowAlternativeSelector] = useState(false);
    const [selectedMedicineForAlternative, setSelectedMedicineForAlternative] =
        useState<ProcessedMedicine | null>(null);
    const [alternativeSearchQuery, setAlternativeSearchQuery] = useState('');
    const [alternativeSelectedCategory, setAlternativeSelectedCategory] = useState('all');
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [suspendReason, setSuspendReason] = useState('');
    const [suspendCategory, setSuspendCategory] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const navigation = [
        {
            name: 'Prescriptions',
            href: '/prescription-reader/queue',
            badge: prescriptions.length,
            current: pathname === '/prescription-reader/queue',
        },
    ];

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsAccountDropdownOpen(false);
            }
        };

        if (isAccountDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAccountDropdownOpen]);

    const getPageTitle = () => {
        switch (pathname) {
            case '/prescription-reader/queue':
                return 'Prescription Queue';
            case '/prescription-reader/completed':
                return 'Completed Prescriptions';
            default:
                return 'Prescription Queue';
        }
    };

    useEffect(() => {
        loadPrescriptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const loadPrescriptions = async () => {
        if (!user) return;
        try {
            setIsLoading(true);
            const data = await prescriptionAPIService.getAllPrescriptions({assignedReaderId : user._id});
            
            // Filter for prescriptions that need reader attention
            const readerPrescriptions = data.data.filter((p) =>
                ['submitted', 'reviewing'].includes(p.currentStatus),
            );

            setPrescriptions(readerPrescriptions);
        } catch (error) {
            console.error('Error loading prescriptions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrescriptionSelect = async (prescription: PrescriptionWorkflow) => {
        console.log('Selected prescription:', prescription.id);
        console.log('Current selected:', selectedPrescription?.id);
    
        // If prescription is in 'submitted' status, automatically move it to 'reviewing'
        if (prescription.currentStatus === 'submitted' && user) {
            try {
                console.log('Auto-transitioning prescription to reviewing status...');
                await prescriptionAPIService.updatePrescriptionStatus(
                    prescription._id,
                    'reviewing',
                    user.id,
                    user.role,
                    user.name,
                    'Started prescription review',
                    convertToAPIFormat(processedMedicines), // Empty processed medicines array for reviewing status
                );
    
                // Reload prescriptions to get updated status
                await loadPrescriptions();
    
                // Find the updated prescription
                const updatedPrescriptions = await prescriptionAPIService.getAllPrescriptions(
                    'prescription-reader',
                    user.id,
                );
                const updatedPrescription = updatedPrescriptions.find(
                    (p) => p.id === prescription.id,
                );
    
                if (updatedPrescription) {
                    setSelectedPrescription(updatedPrescription);
                } else {
                    setSelectedPrescription(prescription);
                }
            } catch (error) {
                console.error('Error transitioning to reviewing:', error);
                setSelectedPrescription(prescription);
            }
        } else {
            setSelectedPrescription(prescription);
        }
    
        setProcessedMedicines([]);
        setProcessingNotes('');
        setShowProductSelector(false);
        setProductSearchQuery('');
        setSelectedCategory('all');
        console.log('New selected prescription set:', prescription.id);
    };

    const handleAddMedicine = (product: Product) => {
        console.log('products', product)
        // Determine default packaging unit based on product pack size
        const defaultPackagingUnit = product.packSize?.includes('blister')
            ? 'per blister'
            : product.packSize?.includes('box')
              ? 'per box'
              : product.packSize?.includes('bottle')
                ? 'per bottle'
                : product.packSize?.includes('tube')
                  ? 'per tube'
                  : product.packSize?.includes('jar')
                    ? 'per jar'
                    : product.packSize?.includes('pack')
                      ? 'per pack'
                      : product.packSize?.includes('tin')
                        ? 'per tin'
                        : 'per unit';

        const newMedicine: LocalProcessedMedicine = {
            id: product._id.toString(),
            productId: product._id.toString(),
            productName: product.name,
            product: product,
            name: product.name,
            quantity: 1,
            dosage: '',
            instructions: '',
            price: product.price || 0,
            pharmacyId: '', // This should be set appropriately
            image: product.images && product.images[0]?.url ? product.images[0].url : undefined,
            packagingUnit: defaultPackagingUnit,
            notes: '',
            isAvailable: true,
        };

        setProcessedMedicines([...processedMedicines, newMedicine]);
        setShowProductSelector(false);
        setProductSearchQuery('');
    };

    const handleUpdateMedicine = (medicineId: string, updates: Partial<LocalProcessedMedicine>) => {
        console.log('Updating medicine:', medicineId, 'with updates:', updates);
        setProcessedMedicines((prev) => {
            const updated = prev.map((med) =>
                med.id === medicineId ? { ...med, ...updates } : med,
            );
            console.log('Updated processedMedicines:', updated);
            return updated;
        });
    };

    const handleRemoveMedicine = (medicineId: string) => {
        setProcessedMedicines((prev) => prev.filter((med) => med.id !== medicineId));
    };

    const handleSelectAlternative = (alternativeProduct: Product) => {
        if (!selectedMedicineForAlternative) return;

        const currentAlternatives = selectedMedicineForAlternative.alternativeProducts || [];
        const isAlreadySelected = currentAlternatives.some(
            (alt) => alt.id === alternativeProduct.id,
        );

        let updatedAlternatives;
        if (isAlreadySelected) {
            // Remove if already selected
            updatedAlternatives = currentAlternatives.filter(
                (alt) => alt.id !== alternativeProduct.id,
            );
        } else {
            // Add to selection
            updatedAlternatives = [...currentAlternatives, alternativeProduct];
        }

        // Update the medicine in the processedMedicines array
        handleUpdateMedicine(selectedMedicineForAlternative.id, {
            alternativeProducts: updatedAlternatives,
        });

        // Also update the selectedMedicineForAlternative state to reflect changes immediately
        setSelectedMedicineForAlternative((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                alternativeProducts: updatedAlternatives,
            };
        });
    };

    const handleFinishAlternativeSelection = () => {
        setShowAlternativeSelector(false);
        setSelectedMedicineForAlternative(null);
        setAlternativeSearchQuery('');
        setAlternativeSelectedCategory('all');
    };

    const getTotalAmount = () => {
        return processedMedicines.reduce((total, med) => {
            const productToUse = med.alternativeProduct || med.product;
            return total + productToUse.price * med.quantity;
        }, 0);
    };

    const filteredProducts = allProducts.filter((product) => {
        // Search filter
        const matchesSearch =
            product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
            product.manufacturer.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
            product.activeIngredient.toLowerCase().includes(productSearchQuery.toLowerCase());

        // Category filter
        const matchesCategory = selectedCategory === 'all' || allProducts.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Convert LocalProcessedMedicine to ProcessedMedicine for API calls
    const convertToAPIFormat = (localMedicines: LocalProcessedMedicine[]): ProcessedMedicine[] => {
        return localMedicines.map(med => ({
            id: med.id,
            productId: med.productId,
            productName: med.productName,
            quantity: med.quantity,
            dosage: med.dosage || '',
            frequency: med.frequency || '', // Fixed: Include frequency
            duration: med.duration || '',   // Fixed: Include duration
            instructions: med.instructions,
            price: med.price,
            pharmacyId: med.pharmacyId,
            image: med.image,
            alternatives: med.alternativeProducts?.map(alt => ({
                productId: alt._id.toString(),
                productName: alt.name,
                price: alt.price || 0,
                image: alt.images && alt.images[0]?.url ? alt.images[0].url : undefined
            })) || [],
            isAvailable: med.isAvailable
        }));
    };

    const handleStatusUpdate = async (status: 'approved' | 'rejected' | 'suspended') => {
        console.log('handleStatusUpdate called with status:', status);
        console.log('selectedPrescription:', selectedPrescription);
        console.log('user:', user);
        console.log('processedMedicines:', processedMedicines);
    
        if (!selectedPrescription || !user) {
            console.log('Missing selectedPrescription or user, returning early');
            return;
        }
    
        try {
            // Handle suspension - show modal for reason
            if (status === 'suspended') {
                setShowSuspendModal(true);
                return;
            }
    
            // Validate required fields for approval
            if (status === 'approved') {
                console.log('Validating medicines for approval...');
                const hasIncompleteMedicines = processedMedicines.some((med) => {
                    console.log('Checking medicine:', med);
                    console.log(
                        'Frequency:',
                        med.frequency,
                        'Duration:',
                        med.duration,
                        'Quantity:',
                        med.quantity,
                    );
                    return !med.frequency || !med.duration || med.quantity <= 0;
                });
    
                console.log('hasIncompleteMedicines:', hasIncompleteMedicines);
    
                if (hasIncompleteMedicines) {
                    alert(
                        'Please complete all required medicine information (frequency, duration) before approving.',
                    );
                    return;
                }
            }
    
            console.log('Calling PrescriptionWorkflowService.updatePrescriptionStatus...');
            
            // Pass processedMedicines to the API call
            await prescriptionAPIService.updatePrescriptionStatus(
                selectedPrescription._id,
                status,
                user.id,
                user.role,
                user.name,
                processingNotes,
                convertToAPIFormat(processedMedicines), // Add this parameter
            );
    
            console.log('Prescription status updated successfully', processedMedicines);
    
            // Log processed medicines for approved prescriptions
            if (status === 'approved' && processedMedicines.length > 0) {
                console.log('Processed medicines sent to backend:', processedMedicines);
            }
    
            console.log('Reloading prescriptions and resetting state...');
            loadPrescriptions();
            setSelectedPrescription(null);
            setProcessedMedicines([]);
            setProcessingNotes('');
            setShowProductSelector(false);
            setProductSearchQuery('');
        } catch (error) {
            console.error('Error updating prescription:', error);
            alert(
                `Error updating prescription: ${error.message || 'Unknown error'}. Please try again.`,
            );
        }
    };
    const handleSuspendPrescription = async () => {
        if (!selectedPrescription || !user || !suspendReason.trim() || !suspendCategory) {
            alert('Please provide both a category and reason for suspension.');
            return;
        }
    
        try {
            console.log('Starting suspension process...');
            console.log('Selected prescription:', selectedPrescription.id);
            console.log('User:', user);
            console.log('Category:', suspendCategory);
            console.log('Reason:', suspendReason);
    
            // Create suspension data
            const suspensionData = {
                category: suspendCategory,
                reason: suspendReason.trim(),
                suspendedBy: user.name || 'Unknown User',
                suspendedById: user.id || 'unknown',
                suspendedAt: new Date(),
                processedMedicines: convertToAPIFormat(processedMedicines),
                processingNotes: processingNotes,
            };
    
            console.log('Suspension data:', suspensionData);
    
            // Update prescription status to suspended with suspension data and processed medicines
            const result = await prescriptionAPIService.updatePrescriptionStatus(
                selectedPrescription._id,
                'suspended',
                user.id || 'unknown',
                user.role || 'prescription-reader',
                user.name || 'Unknown User',
                `SUSPENDED - ${suspendCategory}: ${suspendReason}`,
                convertToAPIFormat(processedMedicines), // Add processed medicines parameter
                suspensionData, // Additional data
            );
    
            console.log('Suspension successful:', result);
    
            // Reset states
            loadPrescriptions();
            setSelectedPrescription(null);
            setProcessedMedicines([]);
            setProcessingNotes('');
            setShowProductSelector(false);
            setProductSearchQuery('');
            setShowSuspendModal(false);
            setSuspendReason('');
            setSuspendCategory('');
    
            alert('Prescription has been suspended and sent to App Services for review.');
        } catch (error) {
            console.error('Detailed error suspending prescription:', error);
            console.error('Error stack:', error.stack);
            alert(
                `Error suspending prescription: ${error.message || 'Unknown error'}. Please try again.`,
            );
        }
    };
    useEffect(() => {
       console.log(filteredProducts)
    }, [filteredProducts]);
    const filteredPrescriptions = prescriptions.filter(
        (p) =>
            p._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'normal':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'routine':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    useEffect(() => {
        const fetchAndFilterProducts = async () => {
            setIsLoading(true);
            try {
                // Fetch products based on the current filters
                const fetchedProducts = await filterProducts({
                    
                });
                console.log(fetchedProducts, 'fetched products')
            

                setAllProducts(fetchedProducts.products);
            } catch (error) {
                console.error('Failed to fetch and filter products:', error);
                setAllProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndFilterProducts();
    }, [searchQuery]);
    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center"
                data-oid="vz.r7ix"
            >
                <div className="text-center" data-oid="b9fsdn3">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
                        data-oid="02b0rge"
                    ></div>
                    <p className="text-gray-600" data-oid="2fd0tne">
                        Loading prescriptions...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="zodq:06">
            {/* Compact Header */}
            <header
                className="bg-white shadow-lg border-b border-slate-200/50 sticky top-0 z-40"
                data-oid="fd5ktzb"
            >
                {/* Brand accent line */}
                <div
                    className="h-1 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] w-full"
                    data-oid="zqnfp-:"
                />

                <div className="px-4 py-2" data-oid="pc:djnm">
                    <div className="flex items-center justify-between" data-oid="h45amcd">
                        {/* Left Section - Logo and Title */}
                        <div className="flex items-center space-x-4" data-oid="5umlvsn">
                            <Logo size="sm" variant="gradient" data-oid="vnoatpf" />
                            <div
                                className="h-6 w-px bg-gray-300 hidden lg:block"
                                data-oid="tppoo7f"
                            />

                            <div className="hidden lg:block" data-oid="be6o3xl">
                                <h1 className="text-lg font-bold text-gray-900" data-oid="qw7-p8n">
                                    {getPageTitle()}
                                </h1>
                                <p className="text-xs text-gray-500" data-oid="z92mtfn">
                                    Prescription Reading System
                                </p>
                            </div>
                        </div>

                        {/* Right Section - Account Menu */}
                        <div className="flex items-center space-x-3" data-oid="97bgdtg">
                            {/* Account Dropdown */}
                            <div className="relative" ref={dropdownRef} data-oid="h41gyt0">
                                <button
                                    className="flex items-center space-x-2 cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
                                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                    data-oid="0ge45:s"
                                >
                                    <div className="relative" data-oid="1fsp7y0">
                                        <div
                                            className="w-8 h-8 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full flex items-center justify-center shadow-md"
                                            data-oid="do:o:-k"
                                        >
                                            <span
                                                className="text-white text-sm font-semibold"
                                                data-oid="qsq2xi0"
                                            >
                                                {user?.name?.charAt(0) || 'P'}
                                            </span>
                                        </div>
                                        <div
                                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                                            data-oid="kkroe-x"
                                        ></div>
                                    </div>
                                    <div className="hidden lg:block text-left" data-oid=".24k5_d">
                                        <p
                                            className="text-sm font-semibold text-gray-800"
                                            data-oid="lgvk_ap"
                                        >
                                            {user?.name || 'Prescription Reader'}
                                        </p>
                                        <p className="text-xs text-gray-500" data-oid=".ewt..q">
                                            Prescription Reader
                                        </p>
                                    </div>
                                    <svg
                                        className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors hidden lg:block"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="ghmupty"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                            data-oid="f988de8"
                                        />
                                    </svg>
                                </button>

                                {/* Simple Dropdown Menu */}
                                {isAccountDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-1 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 z-50 border border-gray-100"
                                        data-oid="u5i911."
                                    >
                                        {/* User Info Header */}
                                        <div
                                            className="px-4 py-2 border-b border-gray-100"
                                            data-oid="njdg52p"
                                        >
                                            <p
                                                className="text-sm font-medium text-gray-900 truncate"
                                                data-oid="u99o43q"
                                            >
                                                {user?.name || 'Prescription Reader'}
                                            </p>
                                            <p
                                                className="text-xs text-gray-500 truncate"
                                                data-oid="h3pf:lx"
                                            >
                                                {user?.email || 'reader@cura.com'}
                                            </p>
                                        </div>

                                        {/* Navigation Items */}
                                        <Link
                                            href="/prescription-reader/queue"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                            data-oid="qhivwwj"
                                        >
                                            Prescriptions
                                        </Link>

                                        {/* Settings & Logout */}
                                        <div
                                            className="border-t border-gray-100 mt-2 pt-2"
                                            data-oid="46thq4-"
                                        >
                                            <button
                                                onClick={() => {
                                                    setIsAccountDropdownOpen(false);
                                                    logout();
                                                }}
                                                className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2"
                                                data-oid="02f20vs"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex" data-oid="-e1k1j4">
                {/* Sidebar */}
                <div
                    className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
                    data-oid="8aoi:fv"
                >
                    {/* Sidebar Header */}
                    <div className="p-3 border-b border-gray-200" data-oid="vq3qcua">
                        <div className="flex items-center justify-between" data-oid="2:i-q64">
                            {!sidebarCollapsed && (
                                <div data-oid="m78smzc">
                                    <h2
                                        className="text-sm font-bold text-gray-900"
                                        data-oid="4a7xmir"
                                    >
                                        Prescription Workflow
                                    </h2>
                                    <p className="text-xs text-gray-500" data-oid=".z2a8e2">
                                        Reading Tools
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="p-1 rounded hover:bg-gray-100 transition-colors"
                                data-oid="c1ugmd7"
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="vsvii_w"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                        data-oid="gcdzsgl"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="p-2 space-y-1" data-oid="sl:6e1b">
                        <div
                            className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2"
                            data-oid="135wuo4"
                        >
                            {!sidebarCollapsed && 'WORKFLOW MENU'}
                        </div>
                        {navigation.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => router.push(item.href)}
                                className={`w-full flex items-center px-2 py-2 rounded-lg text-left transition-all duration-200 group ${
                                    item.current
                                        ? 'bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white shadow-md'
                                        : 'text-gray-700 hover:bg-[#1F1F6F]/5 hover:text-[#1F1F6F]'
                                }`}
                                data-oid="e-q-pbu"
                            >
                                {!sidebarCollapsed && (
                                    <>
                                        <span
                                            className="flex-1 font-medium text-sm"
                                            data-oid=".h8zggu"
                                        >
                                            {item.name}
                                        </span>
                                        {item.badge && (
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                    item.current
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-red-500 text-white'
                                                }`}
                                                data-oid="-pz3.z8"
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Completed Prescriptions Button in Sidebar */}
                    <div className="p-2 border-t border-gray-200 mt-4" data-oid="a38tg6.">
                        <Dialog
                            open={showCompleted}
                            onOpenChange={setShowCompleted}
                            data-oid="bsjoqho"
                        >
                            <DialogTrigger asChild data-oid="a.mpedp">
                                <button
                                    className="w-full flex items-center px-2 py-2 rounded-lg text-left transition-all duration-200 group text-gray-700 hover:bg-green-50 hover:text-green-700"
                                    data-oid="9fevswl"
                                >
                                    {!sidebarCollapsed ? (
                                        <>
                                            <CheckCircle
                                                className="w-4 h-4 mr-2"
                                                data-oid="w.c-.zs"
                                            />

                                            <span
                                                className="flex-1 font-medium text-sm"
                                                data-oid="uz1cnaw"
                                            >
                                                Completed
                                            </span>
                                        </>
                                    ) : (
                                        <CheckCircle
                                            className="w-4 h-4 mx-auto"
                                            data-oid="2xpn3jz"
                                        />
                                    )}
                                </button>
                            </DialogTrigger>
                            <DialogContent
                                className="max-w-4xl max-h-[80vh] overflow-y-auto"
                                data-oid="j0vse._"
                            >
                                <DialogHeader data-oid="q5wcq76">
                                    <DialogTitle data-oid="f6sr7_m">
                                        Completed Prescriptions
                                    </DialogTitle>
                                    <DialogDescription data-oid="lq:pr3n">
                                        View your completed prescription processing history
                                    </DialogDescription>
                                </DialogHeader>
                                <CompletedPrescriptionsView data-oid="s1ijkgz" />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex" data-oid="u6hsqf.">
                    {/* Prescription List */}
                    <div
                        className={`bg-white border-r border-gray-200 overflow-y-auto h-[calc(100vh-73px)] transition-all duration-300 ${isPrescriptionQueueMinimized ? 'w-16' : 'w-1/3'}`}
                        data-oid="8tdzpfy"
                    >
                        {isPrescriptionQueueMinimized ? (
                            /* Minimized View */
                            <div className="p-2 h-full" data-oid="0.4l3yl">
                                <div className="flex flex-col items-center" data-oid="9y8--s8">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsPrescriptionQueueMinimized(false)}
                                        className="text-gray-500 hover:text-gray-700 p-2 w-full"
                                        title="Expand Queue"
                                        data-oid="u3i9pak"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="pv8i36o"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                                data-oid="g2jcumx"
                                            />
                                        </svg>
                                    </Button>
                                    <div
                                        className="text-xs font-medium text-gray-600 transform rotate-90 whitespace-nowrap mt-8"
                                        data-oid="5hcil-s"
                                    >
                                        Queue ({filteredPrescriptions.length})
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Full View */
                            <div className="p-6" data-oid="z4b7h1u">
                                <div
                                    className="flex items-center justify-between mb-4"
                                    data-oid="3c7x0w2"
                                >
                                    <div className="flex items-center space-x-3" data-oid="7jr4o1e">
                                        <h2
                                            className="text-lg font-semibold text-gray-900"
                                            data-oid="hll3n8m"
                                        >
                                            Prescription Queue
                                        </h2>
                                        <Badge variant="secondary" data-oid="x7su3cq">
                                            {filteredPrescriptions.length}
                                        </Badge>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsPrescriptionQueueMinimized(true)}
                                        className="text-gray-500 hover:text-gray-700 p-1"
                                        title="Minimize Queue"
                                        data-oid="-d0fbni"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="r6319b7"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                                data-oid="3afwexo"
                                            />
                                        </svg>
                                    </Button>
                                </div>

                                <Input
                                    placeholder="Search prescriptions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="mb-4"
                                    data-oid="oe0_m2t"
                                />

                                <div className="space-y-3" data-oid="57k236t">
                                    {filteredPrescriptions.map((prescription) => (
                                        <Card
                                            key={prescription.id}
                                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                                selectedPrescription?.id === prescription.id
                                                    ? 'ring-2 ring-blue-500 bg-blue-50'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => handlePrescriptionSelect(prescription)}
                                            data-oid="v4092fa"
                                        >
                                            <CardContent className="p-4" data-oid="b6wpe-t">
                                                <div
                                                    className="flex items-start justify-between mb-2"
                                                    data-oid="uy.zk3z"
                                                >
                                                    <div data-oid="zh:23_s">
                                                        <h3
                                                            className="font-semibold text-gray-900"
                                                            data-oid="jzcwb7a"
                                                        >
                                                            {prescription.id}
                                                        </h3>
                                                        <p
                                                            className="text-sm text-gray-600 flex items-center"
                                                            data-oid="po7wmx8"
                                                        >
                                                            <User
                                                                className="w-3 h-3 mr-1"
                                                                data-oid="wd0_j.u"
                                                            />

                                                            {prescription.patientName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    className="text-xs text-gray-500 flex items-center space-x-4"
                                                    data-oid="67nm.ra"
                                                >
                                                    <span
                                                        className="flex items-center"
                                                        data-oid="89emb5-"
                                                    >
                                                        <Clock
                                                            className="w-3 h-3 mr-1"
                                                            data-oid="44o4912"
                                                        />

                                                        {(prescription.updatedAt)}
                                                    </span>
                                                    <span
                                                        className="flex items-center"
                                                        data-oid="zl53hj5"
                                                    >
                                                        <FileText
                                                            className="w-3 h-3 mr-1"
                                                            data-oid="cjaa2p1"
                                                        />
                                                        {prescription.files.length} files
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Processing Panel */}
                    <div
                        className="flex-1 overflow-y-auto bg-gray-50 h-[calc(100vh-73px)]"
                        data-oid=".aelcf:"
                    >
                        {selectedPrescription ? (
                            <div className="p-4 space-y-4" data-oid=":f19.9b">
                                {/* Prescription Files - Enhanced with Image Preview */}
                                <Card data-oid="06aew29">
                                    <CardHeader className="pb-3" data-oid="gjvym4y">
                                        <CardTitle
                                            className="flex items-center justify-between text-lg"
                                            data-oid="-z0dqee"
                                        >
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="xp.n3r:"
                                            >
                                                <Eye className="w-4 h-4" data-oid="5wrf47n" />
                                                <span data-oid="3fud9vf">Prescription Files</span>
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2"
                                                    data-oid="0ul8g:i"
                                                >
                                                    {selectedPrescription.files.length}
                                                </Badge>
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0" data-oid=":rfk28z">
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                            data-oid="dw9jaxi"
                                        >
                                            {selectedPrescription.files.map((file) => {
                                                const fileUrl = getFileUrl(file);
                                                const fileWithUrl = { ...file, url: fileUrl };

                                                return (
                                                    <div
                                                        key={file.id}
                                                        className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-[#1F1F6F]/30 bg-white"
                                                        data-oid="i6bk7xo"
                                                    >
                                                        {/* Image Preview */}
                                                        <div
                                                            className="relative group"
                                                            data-oid="csynkz4"
                                                        >
                                                            <div
                                                                className="aspect-[4/3] bg-gray-100 overflow-hidden"
                                                                data-oid="71gl197"
                                                            >
                                                                {fileUrl ? (
                                                                    <img
                                                                        src={fileUrl}
                                                                        alt={file.name}
                                                                        className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                                                                        onClick={() => {
                                                                            setSelectedImageFile(
                                                                                fileWithUrl,
                                                                            );
                                                                            setShowImageModal(true);
                                                                        }}
                                                                        data-oid="7e3xiy_"
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
                                                                        data-oid="z-msdsv"
                                                                    >
                                                                        <div
                                                                            className="text-center"
                                                                            data-oid="j2in1ne"
                                                                        >
                                                                            <FileText
                                                                                className="w-12 h-12 text-gray-400 mx-auto mb-2"
                                                                                data-oid="yb:q.3k"
                                                                            />

                                                                            <p
                                                                                className="text-xs text-gray-500"
                                                                                data-oid="o_.62j7"
                                                                            >
                                                                                No Preview
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Overlay with maximize button */}
                                                            {fileUrl && (
                                                                <div
                                                                    className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                                                                    data-oid="orf:49p"
                                                                >
                                                                    <Button
                                                                        variant="secondary"
                                                                        size="sm"
                                                                        className="bg-white/90 hover:bg-white text-gray-800 shadow-lg"
                                                                        onClick={() => {
                                                                            setSelectedImageFile(
                                                                                fileWithUrl,
                                                                            );
                                                                            setShowImageModal(true);
                                                                        }}
                                                                        data-oid="yesb4uc"
                                                                    >
                                                                        <Maximize2
                                                                            className="w-4 h-4 mr-1"
                                                                            data-oid="d_4zi8-"
                                                                        />
                                                                        View Full
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* File Info */}
                                                        <div className="p-3" data-oid="lco2jhu">
                                                            <div
                                                                className="flex items-start justify-between"
                                                                data-oid="safsf-u"
                                                            >
                                                                <div
                                                                    className="flex-1 min-w-0"
                                                                    data-oid="d:qrl4i"
                                                                >
                                                                    <p
                                                                        className="font-medium text-gray-900 text-sm truncate"
                                                                        data-oid="4ywpmf."
                                                                    >
                                                                        {file.name}
                                                                    </p>
                                                                    <p
                                                                        className="text-xs text-gray-500 mt-1"
                                                                        data-oid="rzqm7_a"
                                                                    >
                                                                        {file.type.toUpperCase()} •{' '}
                                                                        {file.size ||
                                                                            'Unknown size'}
                                                                    </p>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-[#1F1F6F] hover:bg-[#1F1F6F]/10 p-1 h-auto"
                                                                    onClick={() => {
                                                                        setSelectedImageFile(
                                                                            fileWithUrl,
                                                                        );
                                                                        setShowImageModal(true);
                                                                    }}
                                                                    data-oid="2n998y8"
                                                                >
                                                                    <Maximize2
                                                                        className="w-4 h-4"
                                                                        data-oid="zhht_:8"
                                                                    />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {selectedPrescription.files.length === 0 && (
                                            <div
                                                className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl"
                                                data-oid="wahkqx9"
                                            >
                                                <FileText
                                                    className="w-12 h-12 text-gray-400 mx-auto mb-3"
                                                    data-oid="tr8p.w6"
                                                />

                                                <p className="text-gray-600" data-oid="nsi0mmt">
                                                    No prescription files uploaded
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Medicine Selection & Processing - Enhanced */}
                                <Card className="border-2 border-[#1F1F6F]/20" data-oid="1fauwap">
                                    <CardHeader
                                        className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white py-4"
                                        data-oid="xx5oo:s"
                                    >
                                        <CardTitle
                                            className="flex items-center justify-between"
                                            data-oid="sgcl3kb"
                                        >
                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid="c5m_v0d"
                                            >
                                                <div
                                                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"
                                                    data-oid="70oh25d"
                                                >
                                                    <Pill className="w-5 h-5" data-oid="4rbq_df" />
                                                </div>
                                                <div data-oid="87cjef5">
                                                    <span
                                                        className="text-lg font-bold"
                                                        data-oid="dnt9xv7"
                                                    >
                                                        Medicine Selection & Processing
                                                    </span>
                                                    <p
                                                        className="text-white/80 text-sm font-normal"
                                                        data-oid="2o5yo1d"
                                                    >
                                                        Add and configure medicines for this
                                                        prescription
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => setShowProductSelector(true)}
                                                size="lg"
                                                className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-6"
                                                data-oid="o06j8hi"
                                            >
                                                <Plus className="w-4 h-4 mr-2" data-oid="k9duj2t" />
                                                Add Medicine
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4" data-oid="lq8s9o3">
                                        {processedMedicines.length === 0 ? (
                                            <div
                                                className="text-center py-16 border-2 border-dashed border-[#1F1F6F]/20 rounded-xl bg-gradient-to-br from-[#1F1F6F]/5 to-[#14274E]/5"
                                                data-oid="wo68ybk"
                                            >
                                                <div
                                                    className="w-20 h-20 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full flex items-center justify-center mx-auto mb-6"
                                                    data-oid="s.ah_g:"
                                                >
                                                    <Pill
                                                        className="w-10 h-10 text-white"
                                                        data-oid="0y4f_v9"
                                                    />
                                                </div>
                                                <h3
                                                    className="text-2xl font-bold text-gray-900 mb-3"
                                                    data-oid="xa.cqic"
                                                >
                                                    No Medicines Added
                                                </h3>
                                                <p
                                                    className="text-gray-600 mb-6 text-lg max-w-md mx-auto"
                                                    data-oid="l.z-m.n"
                                                >
                                                    Start by adding medicines from our comprehensive
                                                    database to process this prescription
                                                </p>
                                                <Button
                                                    onClick={() => setShowProductSelector(true)}
                                                    size="lg"
                                                    className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] hover:from-[#14274E] hover:to-[#1F1F6F] px-8 py-3 text-lg"
                                                    data-oid="wj9ht.0"
                                                >
                                                    <Plus
                                                        className="w-5 h-5 mr-3"
                                                        data-oid="b1ex6f3"
                                                    />
                                                    Add First Medicine
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4" data-oid="pdrfz4v">
                                                {processedMedicines.length > 0 && processedMedicines.map((medicine) => (
                                                    <div
                                                        key={medicine.id}
                                                        className="border-2 border-[#1F1F6F]/10 rounded-xl p-4 bg-gradient-to-br from-white to-[#1F1F6F]/5 hover:shadow-lg transition-all duration-300"
                                                        data-oid="vth1i9j"
                                                    >
                                                        <div
                                                            className="flex items-start justify-between mb-3"
                                                            data-oid="4id8s7f"
                                                        >
                                                            <div
                                                                className="flex items-center space-x-3"
                                                                data-oid="mi9yrb1"
                                                            >
                                                                <div
                                                                    className="w-12 h-12 bg-white rounded-lg border-2 border-[#1F1F6F]/20 flex items-center justify-center overflow-hidden"
                                                                    data-oid="0-p9l87"
                                                                >
                                                                    {medicine.product.images && medicine.product.images[0]?.url ? (
                                                                        <img
                                                                            src={
                                                                                medicine.product.images[0].url
                                                                            }
                                                                            alt={
                                                                                medicine.product
                                                                                    .name
                                                                            }
                                                                            className="w-full h-full object-contain"
                                                                            data-oid="vnnrcpf"
                                                                        />
                                                                    ) : (
                                                                        <Pill
                                                                            className="w-6 h-6 text-[#1F1F6F]"
                                                                            data-oid="d6_mrl0"
                                                                        />
                                                                    )}
                                                                </div>
                                                                <div data-oid="2abdtyd">
                                                                    <h4
                                                                        className="text-base font-bold text-gray-900"
                                                                        data-oid="cejh:nq"
                                                                    >
                                                                        {medicine.product.name}
                                                                    </h4>
                                                                    <p
                                                                        className="text-xs text-gray-600"
                                                                        data-oid="5gdron0"
                                                                    >
                                                                        {
                                                                            medicine.product
                                                                                .manufacturer
                                                                        }
                                                                    </p>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs mt-1"
                                                                        data-oid="xexul0:"
                                                                    >
                                                                        {medicine.product.dosage ||
                                                                            medicine.product
                                                                                .packSize}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleRemoveMedicine(
                                                                        medicine.id,
                                                                    )
                                                                }
                                                                className="text-red-600 border-red-600 hover:bg-red-50 h-8 w-8 p-0"
                                                                data-oid=".7.vu1m"
                                                            >
                                                                <Minus
                                                                    className="w-4 h-4"
                                                                    data-oid="7b.8apq"
                                                                />
                                                            </Button>
                                                        </div>

                                                        <div
                                                            className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3"
                                                            data-oid="kne:lb1"
                                                        >
                                                            <div data-oid="cb8d6f_">
                                                                {/* Check if product is medicine (tablets/capsules) */}
                                                                {medicine.product.packSize?.includes(
                                                                    'tablets',
                                                                ) ||
                                                                medicine.product.packSize?.includes(
                                                                    'capsules',
                                                                ) ? (
                                                                    <>
                                                                        <label
                                                                            className="block text-sm font-medium text-gray-700 mb-3"
                                                                            data-oid="6zo_2ge"
                                                                        >
                                                                            Purchase Option:
                                                                        </label>

                                                                        {/* Compact Packaging Cards - Only for Medicines */}
                                                                        <div
                                                                            className="grid grid-cols-2 gap-3 mb-4"
                                                                            data-oid="nokl28v"
                                                                        >
                                                                            <div
                                                                                className={`border-2 rounded-lg p-3 cursor-pointer transition-all text-center ${
                                                                                    medicine.packagingUnit ===
                                                                                    'per blister'
                                                                                        ? 'border-[#1F1F6F] bg-[#1F1F6F]/5'
                                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                                }`}
                                                                                onClick={() =>
                                                                                    handleUpdateMedicine(
                                                                                        medicine.id,
                                                                                        {
                                                                                            packagingUnit:
                                                                                                'per blister',
                                                                                        },
                                                                                    )
                                                                                }
                                                                                data-oid="3sxrz8z"
                                                                            >
                                                                                <div
                                                                                    className="text-2xl mb-1"
                                                                                    data-oid="hokj3pn"
                                                                                >
                                                                                    💊
                                                                                </div>
                                                                                <div
                                                                                    className="font-semibold text-sm text-gray-900"
                                                                                    data-oid="uonhm41"
                                                                                >
                                                                                    Per Blister
                                                                                </div>
                                                                                <div
                                                                                    className="text-xs text-gray-600 font-medium"
                                                                                    data-oid="4snx7f6"
                                                                                >
                                                                                    EGP{' '}
                                                                                    {medicine.product.pharmacyStocks[0].price.toFixed(
                                                                                        2,
                                                                                    )}
                                                                                </div>
                                                                                <div
                                                                                    className="text-xs text-gray-500"
                                                                                    data-oid="knb815e"
                                                                                >
                                                                                    {`${Math.ceil(parseInt(medicine.product.packSize.match(/\d+/)?.[0] || '10') / 2)} pills/blister`}
                                                                                </div>
                                                                            </div>

                                                                            <div
                                                                                className={`border-2 rounded-lg p-3 cursor-pointer transition-all text-center ${
                                                                                    medicine.packagingUnit ===
                                                                                    'per box'
                                                                                        ? 'border-[#1F1F6F] bg-[#1F1F6F]/5'
                                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                                }`}
                                                                                onClick={() =>
                                                                                    handleUpdateMedicine(
                                                                                        medicine.id,
                                                                                        {
                                                                                            packagingUnit:
                                                                                                'per box',
                                                                                        },
                                                                                    )
                                                                                }
                                                                                data-oid="tlqldjr"
                                                                            >
                                                                                <div
                                                                                    className="text-2xl mb-1"
                                                                                    data-oid="qpxy_a2"
                                                                                >
                                                                                    📦
                                                                                </div>
                                                                                <div
                                                                                    className="font-semibold text-sm text-gray-900"
                                                                                    data-oid="p8il9pl"
                                                                                >
                                                                                    Per Box
                                                                                </div>
                                                                                <div
                                                                                    className="text-xs text-gray-600 font-medium"
                                                                                    data-oid=".e14wsw"
                                                                                >
                                                                                    EGP{' '}
                                                                                    {(
                                                                                        medicine
                                                                                            .product
                                                                                            .price *
                                                                                        2
                                                                                    ).toFixed(2)}
                                                                                </div>
                                                                                <div
                                                                                    className="text-xs text-gray-500"
                                                                                    data-oid="r3kgw82"
                                                                                >
                                                                                    {(() => {
                                                                                        const totalPills =
                                                                                            parseInt(
                                                                                                medicine.product.packSize.match(
                                                                                                    /\d+/,
                                                                                                )?.[0] ||
                                                                                                    '20',
                                                                                            );
                                                                                        const blistersPerBox = 2;
                                                                                        return `${blistersPerBox} blisters (${totalPills} pills)`;
                                                                                    })()}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Quantity Selection for Medicines */}
                                                                        <div
                                                                            className="space-y-2"
                                                                            data-oid="0uft-d3"
                                                                        >
                                                                            <label
                                                                                className="block text-sm font-medium text-gray-700"
                                                                                data-oid="f9uf6ak"
                                                                            >
                                                                                Quantity:
                                                                            </label>
                                                                            <div
                                                                                className="flex items-center justify-center space-x-3"
                                                                                data-oid="9l3hede"
                                                                            >
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        handleUpdateMedicine(
                                                                                            medicine.id,
                                                                                            {
                                                                                                quantity:
                                                                                                    Math.max(
                                                                                                        1,
                                                                                                        medicine.quantity -
                                                                                                            1,
                                                                                                    ),
                                                                                            },
                                                                                        )
                                                                                    }
                                                                                    className="w-8 h-8 p-0 rounded-full"
                                                                                    data-oid="ryt94q3"
                                                                                >
                                                                                    <Minus
                                                                                        className="w-3 h-3"
                                                                                        data-oid="7h9quu2"
                                                                                    />
                                                                                </Button>
                                                                                <div
                                                                                    className="text-center"
                                                                                    data-oid="m.e8-qt"
                                                                                >
                                                                                    <div
                                                                                        className="text-2xl font-bold text-[#1F1F6F]"
                                                                                        data-oid="pb7b6ux"
                                                                                    >
                                                                                        {
                                                                                            medicine.quantity
                                                                                        }
                                                                                    </div>
                                                                                    <div
                                                                                        className="text-xs text-gray-500"
                                                                                        data-oid="c0emd__"
                                                                                    >
                                                                                        {medicine.packagingUnit ||
                                                                                            'per unit'}{' '}
                                                                                        (s)
                                                                                    </div>
                                                                                </div>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        handleUpdateMedicine(
                                                                                            medicine.id,
                                                                                            {
                                                                                                quantity:
                                                                                                    medicine.quantity +
                                                                                                    1,
                                                                                            },
                                                                                        )
                                                                                    }
                                                                                    className="w-8 h-8 p-0 rounded-full"
                                                                                    data-oid="_3o0g42"
                                                                                >
                                                                                    <Plus
                                                                                        className="w-3 h-3"
                                                                                        data-oid="f-dc0jd"
                                                                                    />
                                                                                </Button>
                                                                            </div>
                                                                        </div>

                                                                        <p
                                                                            className="text-xs text-gray-500 mt-3 text-center"
                                                                            data-oid="-tdptc4"
                                                                        >
                                                                            Customer will see this
                                                                            packaging option in
                                                                            their selection.
                                                                        </p>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {/* Normal Quantity Selector - For Non-Medicine Products */}
                                                                        <label
                                                                            className="block text-sm font-medium text-gray-700 mb-2"
                                                                            data-oid="bv.53v2"
                                                                        >
                                                                            Required Quantity *
                                                                        </label>
                                                                        <div
                                                                            className="flex items-center justify-center space-x-3"
                                                                            data-oid="6eu74bp"
                                                                        >
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleUpdateMedicine(
                                                                                        medicine.id,
                                                                                        {
                                                                                            quantity:
                                                                                                Math.max(
                                                                                                    1,
                                                                                                    medicine.quantity -
                                                                                                        1,
                                                                                                ),
                                                                                        },
                                                                                    )
                                                                                }
                                                                                className="w-8 h-8 p-0 rounded-full"
                                                                                data-oid="3nv75r1"
                                                                            >
                                                                                <Minus
                                                                                    className="w-3 h-3"
                                                                                    data-oid="xl:91i1"
                                                                                />
                                                                            </Button>
                                                                            <div
                                                                                className="text-center"
                                                                                data-oid="19_pugc"
                                                                            >
                                                                                <div
                                                                                    className="text-2xl font-bold text-[#1F1F6F]"
                                                                                    data-oid="z6xwti:"
                                                                                >
                                                                                    {
                                                                                        medicine.quantity
                                                                                    }
                                                                                </div>
                                                                                <div
                                                                                    className="text-xs text-gray-500"
                                                                                    data-oid="j4ozdl9"
                                                                                >
                                                                                    unit(s)
                                                                                </div>
                                                                            </div>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleUpdateMedicine(
                                                                                        medicine.id,
                                                                                        {
                                                                                            quantity:
                                                                                                medicine.quantity +
                                                                                                1,
                                                                                        },
                                                                                    )
                                                                                }
                                                                                className="w-8 h-8 p-0 rounded-full"
                                                                                data-oid="xo2g0u7"
                                                                            >
                                                                                <Plus
                                                                                    className="w-3 h-3"
                                                                                    data-oid="zvuouv6"
                                                                                />
                                                                            </Button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>

                                                            {/* Alternative Medicine Section - Only for Medicine Products */}
                                                            {[
                                                                'otc',
                                                                'prescription',
                                                                'supplements',
                                                            ].includes(
                                                                medicine.product.category,
                                                            ) && (
                                                                <div data-oid="ypa5rle">
                                                                    <label
                                                                        className="block text-sm font-medium text-gray-700 mb-2"
                                                                        data-oid="uxhaebn"
                                                                    >
                                                                        Alternative Medicine
                                                                    </label>
                                                                    <div
                                                                        className="space-y-2"
                                                                        data-oid="552vy3."
                                                                    >
                                                                        {/* Current Selection Display */}
                                                                        <div
                                                                            className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                                                                            data-oid="v23y69k"
                                                                        >
                                                                            <div
                                                                                className="flex items-center justify-between"
                                                                                data-oid="ags19j5"
                                                                            >
                                                                                <div
                                                                                    className="flex-1"
                                                                                    data-oid="mi4_br2"
                                                                                >
                                                                                    {medicine.alternativeProducts &&
                                                                                    medicine
                                                                                        .alternativeProducts
                                                                                        .length >
                                                                                        0 ? (
                                                                                        <div data-oid=":8p9wau">
                                                                                            <div
                                                                                                className="flex items-center space-x-2 mb-2"
                                                                                                data-oid="zzxui:-"
                                                                                            >
                                                                                                <span
                                                                                                    className="text-sm font-medium text-gray-900"
                                                                                                    data-oid="jw6vae4"
                                                                                                >
                                                                                                    {
                                                                                                        medicine
                                                                                                            .alternativeProducts
                                                                                                            .length
                                                                                                    }{' '}
                                                                                                    Alternative
                                                                                                    {medicine
                                                                                                        .alternativeProducts
                                                                                                        .length >
                                                                                                    1
                                                                                                        ? 's'
                                                                                                        : ''}{' '}
                                                                                                    Selected
                                                                                                </span>
                                                                                                <Badge
                                                                                                    variant="outline"
                                                                                                    className="text-xs text-blue-600 border-blue-600"
                                                                                                    data-oid="msv8ebn"
                                                                                                >
                                                                                                    {
                                                                                                        medicine
                                                                                                            .alternativeProducts
                                                                                                            .length
                                                                                                    }{' '}
                                                                                                    Option
                                                                                                    {medicine
                                                                                                        .alternativeProducts
                                                                                                        .length >
                                                                                                    1
                                                                                                        ? 's'
                                                                                                        : ''}
                                                                                                </Badge>
                                                                                            </div>
                                                                                            <div
                                                                                                className="space-y-2 max-h-32 overflow-y-auto"
                                                                                                data-oid="tp8d0bv"
                                                                                            >
                                                                                                {medicine.alternativeProducts.map(
                                                                                                    (
                                                                                                        alt,
                                                                                                    ) => (
                                                                                                        <div
                                                                                                            key={
                                                                                                                alt.id
                                                                                                            }
                                                                                                            className="flex items-center justify-between bg-blue-50 rounded-lg p-2"
                                                                                                            data-oid="ijqgn17"
                                                                                                        >
                                                                                                            <div
                                                                                                                className="flex-1"
                                                                                                                data-oid=":adgrdg"
                                                                                                            >
                                                                                                                <div
                                                                                                                    className="text-xs font-medium text-gray-900"
                                                                                                                    data-oid="-a_gn3-"
                                                                                                                >
                                                                                                                    {
                                                                                                                        alt.name
                                                                                                                    }
                                                                                                                </div>
                                                                                                                <div
                                                                                                                    className="text-xs text-gray-600"
                                                                                                                    data-oid="w6mlvch"
                                                                                                                >
                                                                                                                    {
                                                                                                                        alt.manufacturer
                                                                                                                    }{' '}
                                                                                                                    •
                                                                                                                    EGP{' '}
                                                                                                                    {alt.price.toFixed(
                                                                                                                        2,
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <Button
                                                                                                                variant="ghost"
                                                                                                                size="sm"
                                                                                                                onClick={() => {
                                                                                                                    const updatedAlternatives =
                                                                                                                        medicine.alternativeProducts!.filter(
                                                                                                                            (
                                                                                                                                a,
                                                                                                                            ) =>
                                                                                                                                a.id !==
                                                                                                                                alt.id,
                                                                                                                        );
                                                                                                                    handleUpdateMedicine(
                                                                                                                        medicine.id,
                                                                                                                        {
                                                                                                                            alternativeProducts:
                                                                                                                                updatedAlternatives.length >
                                                                                                                                0
                                                                                                                                    ? updatedAlternatives
                                                                                                                                    : undefined,
                                                                                                                        },
                                                                                                                    );
                                                                                                                }}
                                                                                                                className="text-red-600 hover:bg-red-100 h-6 w-6 p-0"
                                                                                                                data-oid="17gryb."
                                                                                                            >
                                                                                                                <X
                                                                                                                    className="w-3 h-3"
                                                                                                                    data-oid="1ii5m3o"
                                                                                                                />
                                                                                                            </Button>
                                                                                                        </div>
                                                                                                    ),
                                                                                                )}
                                                                                            </div>
                                                                                            <p
                                                                                                className="text-xs text-blue-600 mt-2"
                                                                                                data-oid="2mqjn03"
                                                                                            >
                                                                                                ℹ️
                                                                                                Customer
                                                                                                will
                                                                                                see
                                                                                                these
                                                                                                alternatives
                                                                                                and
                                                                                                can
                                                                                                choose
                                                                                            </p>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div data-oid="yhjuq-c">
                                                                                            <div
                                                                                                className="flex items-center space-x-2 mb-1"
                                                                                                data-oid="ygzqx4h"
                                                                                            >
                                                                                                <span
                                                                                                    className="text-sm font-medium text-gray-500"
                                                                                                    data-oid="bxomuq."
                                                                                                >
                                                                                                    No
                                                                                                    alternatives
                                                                                                    selected
                                                                                                </span>
                                                                                                <Badge
                                                                                                    variant="outline"
                                                                                                    className="text-xs text-gray-500 border-gray-300"
                                                                                                    data-oid="kvb:3bv"
                                                                                                >
                                                                                                    Original
                                                                                                    will
                                                                                                    be
                                                                                                    used
                                                                                                </Badge>
                                                                                            </div>
                                                                                            <p
                                                                                                className="text-xs text-gray-500"
                                                                                                data-oid="1ygvxir"
                                                                                            >
                                                                                                Click
                                                                                                {"'"}Select
                                                                                                Alternative{"'"}
                                                                                                to
                                                                                                choose
                                                                                                different
                                                                                                medicines
                                                                                            </p>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div
                                                                                    className="flex space-x-2"
                                                                                    data-oid="lut0ao5"
                                                                                >
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        onClick={() => {
                                                                                            setSelectedMedicineForAlternative(
                                                                                                medicine,
                                                                                            );
                                                                                            setShowAlternativeSelector(
                                                                                                true,
                                                                                            );
                                                                                        }}
                                                                                        className="text-[#1F1F6F] border-[#1F1F6F] hover:bg-[#1F1F6F]/10"
                                                                                        data-oid="2486dgy"
                                                                                    >
                                                                                        <Search
                                                                                            className="w-3 h-3 mr-1"
                                                                                            data-oid="enzbfpu"
                                                                                        />

                                                                                        {medicine.alternativeProducts &&
                                                                                        medicine
                                                                                            .alternativeProducts
                                                                                            .length >
                                                                                            0
                                                                                            ? 'Manage Alternatives'
                                                                                            : 'Select Alternatives'}
                                                                                    </Button>
                                                                                    {medicine.alternativeProducts &&
                                                                                        medicine
                                                                                            .alternativeProducts
                                                                                            .length >
                                                                                            0 && (
                                                                                            <Button
                                                                                                variant="outline"
                                                                                                size="sm"
                                                                                                onClick={() =>
                                                                                                    handleUpdateMedicine(
                                                                                                        medicine.id,
                                                                                                        {
                                                                                                            alternativeProducts:
                                                                                                                undefined,
                                                                                                        },
                                                                                                    )
                                                                                                }
                                                                                                className="text-gray-600 border-gray-300 hover:bg-gray-50"
                                                                                                data-oid="jv4ajg7"
                                                                                            >
                                                                                                <X
                                                                                                    className="w-3 h-3"
                                                                                                    data-oid="drzxctm"
                                                                                                />
                                                                                            </Button>
                                                                                        )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div
                                                            className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3"
                                                            data-oid="6hharld"
                                                        >
                                                            <div data-oid="jrj_g-r">
                                                                <label
                                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                                    data-oid="ul6py.a"
                                                                >
                                                                    Frequency *
                                                                </label>
                                                                <Select
                                                                    value={medicine.frequency || ''}
                                                                    onValueChange={(value) =>
                                                                        handleUpdateMedicine(
                                                                            medicine.id,
                                                                            { frequency: value },
                                                                        )
                                                                    }
                                                                    data-oid="y4vawn:"
                                                                >
                                                                    <SelectTrigger
                                                                        className="border-[#1F1F6F]/20 focus:border-[#1F1F6F] focus:ring-[#1F1F6F]"
                                                                        data-oid=".w1jb_z"
                                                                    >
                                                                        <SelectValue
                                                                            placeholder="Select frequency"
                                                                            data-oid="5cxji53"
                                                                        />
                                                                    </SelectTrigger>
                                                                    <SelectContent data-oid="0o49qrl">
                                                                        <SelectItem
                                                                            value="once-daily"
                                                                            data-oid="ahqv9ef"
                                                                        >
                                                                            Once daily
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="twice-daily"
                                                                            data-oid="ngfxwue"
                                                                        >
                                                                            Twice daily
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="three-times-daily"
                                                                            data-oid="8tcvyvp"
                                                                        >
                                                                            Three times daily
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="four-times-daily"
                                                                            data-oid="sc2bwcy"
                                                                        >
                                                                            Four times daily
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="every-6-hours"
                                                                            data-oid="n7-6egs"
                                                                        >
                                                                            Every 6 hours
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="every-8-hours"
                                                                            data-oid="m82:ejv"
                                                                        >
                                                                            Every 8 hours
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="every-12-hours"
                                                                            data-oid="yw.t0nn"
                                                                        >
                                                                            Every 12 hours
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="as-needed"
                                                                            data-oid="sv7u_w_"
                                                                        >
                                                                            As needed
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="before-meals"
                                                                            data-oid="_ygd.cy"
                                                                        >
                                                                            Before meals
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="after-meals"
                                                                            data-oid="gnvbbao"
                                                                        >
                                                                            After meals
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="with-meals"
                                                                            data-oid="0gykd-o"
                                                                        >
                                                                            With meals
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div data-oid="n.d2mi8">
                                                                <label
                                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                                    data-oid="re7f1z9"
                                                                >
                                                                    Duration *
                                                                </label>
                                                                <Input
                                                                    value={medicine.duration || ''}
                                                                    onChange={(e) =>
                                                                        handleUpdateMedicine(
                                                                            medicine.id,
                                                                            {
                                                                                duration:
                                                                                    e.target.value,
                                                                            },
                                                                        )
                                                                    }
                                                                    placeholder="e.g., 7 days, 2 weeks, 1 month"
                                                                    className="border-[#1F1F6F]/20 focus:border-[#1F1F6F] focus:ring-[#1F1F6F]"
                                                                    data-oid="gfue_c5"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="mb-3" data-oid="sdlait0">
                                                            <label
                                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                                data-oid="4qt3.bo"
                                                            >
                                                                Special Instructions
                                                            </label>
                                                            <Textarea
                                                                value={medicine.instructions}
                                                                onChange={(e) =>
                                                                    handleUpdateMedicine(
                                                                        medicine.id,
                                                                        {
                                                                            instructions:
                                                                                e.target.value,
                                                                        },
                                                                    )
                                                                }
                                                                placeholder="e.g., Take with food, Avoid alcohol, Take on empty stomach"
                                                                rows={2}
                                                                className="border-[#1F1F6F]/20 focus:border-[#1F1F6F] focus:ring-[#1F1F6F]"
                                                                data-oid="lx-8-_e"
                                                            />
                                                        </div>

                                                        <div data-oid="xk3huto">
                                                            <label
                                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                                data-oid="-skn50_"
                                                            >
                                                                Additional Notes
                                                            </label>
                                                            <Textarea
                                                                value={medicine.notes || ''}
                                                                onChange={(e) =>
                                                                    handleUpdateMedicine(
                                                                        medicine.id,
                                                                        { notes: e.target.value },
                                                                    )
                                                                }
                                                                placeholder="Any additional notes or special instructions..."
                                                                rows={1}
                                                                className="border-[#1F1F6F]/20 focus:border-[#1F1F6F] focus:ring-[#1F1F6F]"
                                                                data-oid="2sc-yb-"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Prescription Summary - Compact & Clean */}
                                                <div
                                                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                                                    data-oid="0offdei"
                                                >
                                                    <div
                                                        className="flex items-center justify-between"
                                                        data-oid=":jnu81s"
                                                    >
                                                        <div
                                                            className="flex items-center space-x-3"
                                                            data-oid="5f5qaok"
                                                        >
                                                            <div
                                                                className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                                                                data-oid="1:1061g"
                                                            >
                                                                <CheckCircle
                                                                    className="w-5 h-5 text-green-600"
                                                                    data-oid="0hvn2ef"
                                                                />
                                                            </div>
                                                            <div data-oid="y9y61rt">
                                                                <h4
                                                                    className="text-sm font-semibold text-gray-900"
                                                                    data-oid="j7i.o88"
                                                                >
                                                                    {processedMedicines.length}{' '}
                                                                    Medicine
                                                                    {processedMedicines.length !== 1
                                                                        ? 's'
                                                                        : ''}{' '}
                                                                    Added
                                                                </h4>
                                                                <p
                                                                    className="text-xs text-gray-500"
                                                                    data-oid="j6p7u.4"
                                                                >
                                                                    Ready for customer review
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-green-50 text-green-700 border-green-200"
                                                            data-oid="y06lly_"
                                                        >
                                                            Complete
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Bottom Row - Processing Notes & Actions Side by Side */}
                                <div
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-4"
                                    data-oid="xt:igcn"
                                >
                                    {/* Processing Notes - Takes 2/3 width */}
                                    <div className="lg:col-span-2" data-oid="g_fzjxz">
                                        <Card
                                            className="border-2 border-[#1F1F6F]/20 h-full"
                                            data-oid="81nrgs1"
                                        >
                                            <CardHeader
                                                className="bg-gradient-to-r from-[#1F1F6F]/10 to-[#14274E]/10 pb-3"
                                                data-oid="5g-mam6"
                                            >
                                                <CardTitle
                                                    className="text-[#1F1F6F] text-lg"
                                                    data-oid="p2smqgm"
                                                >
                                                    Processing Notes
                                                </CardTitle>
                                                <CardDescription
                                                    className="text-sm"
                                                    data-oid="p4vaxta"
                                                >
                                                    Add any additional notes about the prescription
                                                    processing
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0" data-oid="yy2t2o9">
                                                <Textarea
                                                    value={processingNotes}
                                                    onChange={(e) =>
                                                        setProcessingNotes(e.target.value)
                                                    }
                                                    placeholder="Add any notes about the prescription processing, customer requests, or special instructions..."
                                                    rows={3}
                                                    className="border-[#1F1F6F]/20 focus:border-[#1F1F6F] focus:ring-[#1F1F6F]"
                                                    data-oid="awgne9x"
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Action Buttons - Takes 1/3 width */}
                                    <div className="lg:col-span-1" data-oid="irlc5xo">
                                        <Card
                                            className="border-2 border-gray-200 h-full"
                                            data-oid="wf-k9qw"
                                        >
                                            <CardHeader className="pb-3" data-oid="sihx423">
                                                <CardTitle
                                                    className="text-gray-900 text-lg"
                                                    data-oid="l2k:sqw"
                                                >
                                                    Actions
                                                </CardTitle>
                                                <CardDescription
                                                    className="text-sm"
                                                    data-oid="-3y8eqd"
                                                >
                                                    Review and process prescription
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0" data-oid="4xny9z8">
                                                <div className="space-y-3" data-oid="-iv1nkr">
                                                    <Button
                                                        onClick={() => {
                                                            console.log('Approve button clicked');
                                                            console.log(
                                                                'processedMedicines:',
                                                                processedMedicines,
                                                            );
                                                            console.log(
                                                                'processedMedicines.length:',
                                                                processedMedicines.length,
                                                            );
                                                            const isDisabled =
                                                                processedMedicines.length === 0 ||
                                                                processedMedicines.some((med) => {
                                                                    console.log(
                                                                        'Checking med for disable condition:',
                                                                        med,
                                                                    );
                                                                    return (
                                                                        !med.frequency ||
                                                                        !med.duration
                                                                    );
                                                                });
                                                            console.log(
                                                                'Button should be disabled:',
                                                                isDisabled,
                                                            );
                                                            handleStatusUpdate('approved');
                                                        }}
                                                        disabled={
                                                            processedMedicines.length === 0 ||
                                                            processedMedicines.some(
                                                                (med) =>
                                                                    !med.frequency || !med.duration,
                                                            )
                                                        }
                                                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-3"
                                                        data-oid="ctwlc:k"
                                                    >
                                                        <CheckCircle
                                                            className="w-4 h-4"
                                                            data-oid="ptj33ug"
                                                        />

                                                        <span data-oid="4:iswy:">
                                                            Approve Prescription
                                                        </span>
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleStatusUpdate('suspended')
                                                        }
                                                        className="w-full flex items-center justify-center space-x-2 py-3 border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600"
                                                        data-oid="jlk66q3"
                                                    >
                                                        <AlertCircle
                                                            className="w-4 h-4"
                                                            data-oid="w6vvmyq"
                                                        />

                                                        <span data-oid="5olmyp2">
                                                            Suspend Prescription
                                                        </span>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="flex items-center justify-center h-full min-h-[500px]"
                                data-oid="8z6h379"
                            >
                                <div className="text-center" data-oid="7m2jcn.">
                                    <FileText
                                        className="w-16 h-16 text-gray-400 mx-auto mb-4"
                                        data-oid="8_hh02r"
                                    />

                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="a0.zi6c"
                                    >
                                        Select a Prescription
                                    </h3>
                                    <p className="text-gray-600" data-oid="kc90atc">
                                        Choose a prescription from the list to start processing
                                    </p>
                                    <div className="mt-4 text-sm text-gray-500" data-oid="s6r7ms4">
                                        <p data-oid="m8_qdja">
                                            Available prescriptions: {filteredPrescriptions.length}
                                        </p>
                                        <p data-oid="0p:sgbs">
                                            Selected:{' '}
                                            {selectedPrescription
                                                ? selectedPrescription.id
                                                : 'None'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Viewer Modal */}
            {showImageModal && selectedImageFile && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    data-oid="i_m84:6"
                >
                    <div
                        className="relative max-w-7xl max-h-[95vh] w-full h-full flex items-center justify-center"
                        data-oid="o19tbdf"
                    >
                        {/* Close Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setShowImageModal(false);
                                setSelectedImageFile(null);
                            }}
                            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-white/20"
                            data-oid="tzhus8p"
                        >
                            <X className="w-5 h-5" data-oid="-5ab0ia" />
                        </Button>

                        {/* Image Container */}
                        <div
                            className="relative w-full h-full flex items-center justify-center"
                            data-oid="xy-l_dw"
                        >
                            {selectedImageFile.url ? (
                                <img
                                    src={selectedImageFile.url}
                                    alt={selectedImageFile.name}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                    data-oid="-5ecjg0"
                                />
                            ) : (
                                <div
                                    className="bg-white rounded-lg p-8 text-center"
                                    data-oid="-atr1q7"
                                >
                                    <FileText
                                        className="w-16 h-16 text-gray-400 mx-auto mb-4"
                                        data-oid="jc_4f89"
                                    />

                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="znc3j9c"
                                    >
                                        {selectedImageFile.name}
                                    </h3>
                                    <p className="text-gray-600" data-oid="38dpjn2">
                                        Preview not available for this file type
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* File Info Overlay */}
                        <div
                            className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg"
                            data-oid="do48xq0"
                        >
                            <p className="font-medium" data-oid="758ds7e">
                                {selectedImageFile.name}
                            </p>
                            <p className="text-sm text-gray-300" data-oid="2hxhmou">
                                {selectedImageFile.type.toUpperCase()} •{' '}
                                {selectedImageFile.size || 'Unknown size'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Alternative Medicine Selector Modal */}
            {showAlternativeSelector && selectedMedicineForAlternative && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    data-oid="j1wrfq_"
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden"
                        data-oid=".xz4_3-"
                    >
                        {/* Modal Header */}
                        <div className="bg-white border-b border-gray-200 p-4" data-oid="3zr4ihj">
                            <div className="flex items-center justify-between" data-oid="u.l0fqz">
                                <div className="flex items-center space-x-3" data-oid="5qq-0yo">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleFinishAlternativeSelection}
                                        className="text-gray-600 hover:bg-gray-100"
                                        data-oid="kj6hgji"
                                    >
                                        <XCircle className="w-5 h-5" data-oid="7myhmk6" />
                                        Close
                                    </Button>
                                    <div className="h-6 w-px bg-gray-300" data-oid="zpg8c4v" />
                                    <div data-oid="ntlmczj">
                                        <h2
                                            className="text-xl font-bold text-gray-900"
                                            data-oid="3-6:-qm"
                                        >
                                            Select Alternative Medicines
                                        </h2>
                                        <p className="text-sm text-gray-600" data-oid="5biwn12">
                                            Choose alternatives for:{' '}
                                            <span className="font-medium" data-oid="lfddc08">
                                                {selectedMedicineForAlternative.product.name}
                                            </span>
                                            {selectedMedicineForAlternative.alternativeProducts &&
                                                selectedMedicineForAlternative.alternativeProducts
                                                    .length > 0 && (
                                                    <span
                                                        className="ml-2 text-blue-600 font-medium"
                                                        data-oid="pi:epmn"
                                                    >
                                                        (
                                                        {
                                                            selectedMedicineForAlternative
                                                                .alternativeProducts.length
                                                        }{' '}
                                                        selected)
                                                    </span>
                                                )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Selected Alternatives Summary */}
                        {selectedMedicineForAlternative.alternativeProducts &&
                            selectedMedicineForAlternative.alternativeProducts.length > 0 && (
                                <div
                                    className="bg-blue-50 border-b border-blue-200 p-3"
                                    data-oid="p5qz-e-"
                                >
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="6_sne1f"
                                    >
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="z4gve_6"
                                        >
                                            <CheckCircle
                                                className="w-4 h-4 text-blue-600"
                                                data-oid="_2rpfp2"
                                            />

                                            <span
                                                className="text-sm font-medium text-blue-900"
                                                data-oid="yruvdoj"
                                            >
                                                {
                                                    selectedMedicineForAlternative
                                                        .alternativeProducts.length
                                                }{' '}
                                                alternative
                                                {selectedMedicineForAlternative.alternativeProducts
                                                    .length > 1
                                                    ? 's'
                                                    : ''}{' '}
                                                selected
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="1zm90g:"
                                        >
                                            <span
                                                className="text-xs text-blue-700"
                                                data-oid="hm6q445"
                                            >
                                                Click products below to add/remove alternatives
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                        {/* Search and Filter Bar */}
                        <div className="bg-gray-50 border-b border-gray-200 p-4" data-oid="5eja1uz">
                            <div className="flex items-center space-x-4" data-oid="dh-fphi">
                                <div className="flex-1 relative" data-oid=".k6.p4x">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                                        data-oid="lq1p8qm"
                                    />

                                    <Input
                                        type="text"
                                        placeholder="Search for alternative medicines by name, ingredient, manufacturer..."
                                        value={alternativeSearchQuery}
                                        onChange={(e) => setAlternativeSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 border-gray-300 focus:border-[#1F1F6F] focus:ring-[#1F1F6F]"
                                        data-oid="f0ogd5h"
                                    />
                                </div>
                                <Select
                                    value={alternativeSelectedCategory}
                                    onValueChange={setAlternativeSelectedCategory}
                                    data-oid="66jh7pw"
                                >
                                    <SelectTrigger className="w-48" data-oid="l3z:jh0">
                                        <SelectValue
                                            placeholder="All Categories"
                                            data-oid=":jp3:hx"
                                        />
                                    </SelectTrigger>
                                    <SelectContent data-oid="_nwogcc">
                                        <SelectItem value="all" data-oid="m6o0ptp">
                                            All Categories
                                        </SelectItem>
                                        <SelectItem value="otc" data-oid="vxodr_a">
                                            OTC
                                        </SelectItem>
                                        <SelectItem value="prescription" data-oid="9x0ll4z">
                                            Prescription
                                        </SelectItem>
                                        <SelectItem value="supplements" data-oid="u-s-spe">
                                            Supplements
                                        </SelectItem>
                                        <SelectItem value="medical" data-oid="l50_tse">
                                            Medical
                                        </SelectItem>
                                        <SelectItem value="baby" data-oid="rfskili">
                                            Baby
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Alternative Products Grid */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto" data-oid="g4bw5vd">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                                data-oid="4bsb060"
                            >
                                {(() => {
                                    // Filter products for alternatives - ONLY MEDICINE PRODUCTS
                                    const filteredAlternatives = products
                                        .filter((product) => {
                                            // Don't show the original product as an alternative
                                            if (
                                                product.id ===
                                                selectedMedicineForAlternative.product.id
                                            )
                                                return false;

                                            // ONLY ALLOW MEDICINE CATEGORIES
                                            const isMedicineProduct = [
                                                'otc',
                                                'prescription',
                                                'supplements',
                                            ].includes(product.category);
                                            if (!isMedicineProduct) return false;

                                            // Search filter
                                            const matchesSearch =
                                                product.name
                                                    .toLowerCase()
                                                    .includes(
                                                        alternativeSearchQuery.toLowerCase(),
                                                    ) ||
                                                product.manufacturer
                                                    .toLowerCase()
                                                    .includes(
                                                        alternativeSearchQuery.toLowerCase(),
                                                    ) ||
                                                product.activeIngredient
                                                    .toLowerCase()
                                                    .includes(alternativeSearchQuery.toLowerCase());

                                            // Category filter - only apply if it's a medicine category
                                            const matchesCategory =
                                                alternativeSelectedCategory === 'all' ||
                                                (isMedicineProduct &&
                                                    product.category ===
                                                        alternativeSelectedCategory);

                                            return matchesSearch && matchesCategory;
                                        })
                                        .sort((a, b) => {
                                            // Sort by similarity first, then by name
                                            const aSimilar =
                                                a.activeIngredient
                                                    .toLowerCase()
                                                    .includes(
                                                        selectedMedicineForAlternative.product.activeIngredient.toLowerCase(),
                                                    ) ||
                                                selectedMedicineForAlternative.product.activeIngredient
                                                    .toLowerCase()
                                                    .includes(a.activeIngredient.toLowerCase());

                                            const bSimilar =
                                                b.activeIngredient
                                                    .toLowerCase()
                                                    .includes(
                                                        selectedMedicineForAlternative.product.activeIngredient.toLowerCase(),
                                                    ) ||
                                                selectedMedicineForAlternative.product.activeIngredient
                                                    .toLowerCase()
                                                    .includes(b.activeIngredient.toLowerCase());

                                            if (aSimilar && !bSimilar) return -1;
                                            if (!aSimilar && bSimilar) return 1;
                                            return a.name.localeCompare(b.name);
                                        });

                                    return filteredAlternatives.map((product) => {
                                        // Check if this product is selected as an alternative
                                        const isSelected =
                                            selectedMedicineForAlternative.alternativeProducts?.some(
                                                (alt) => alt.id === product.id,
                                            ) || false;

                                        return (
                                            <div
                                                key={product.id}
                                                className={`border-2 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col h-full ${
                                                    isSelected
                                                        ? 'border-green-400 bg-green-50'
                                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => handleSelectAlternative(product)}
                                                data-oid="a27w94n"
                                            >
                                                {/* Product Image */}
                                                <div className="relative mb-3" data-oid="aoq7wu:">
                                                    <div
                                                        className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
                                                        data-oid="o6:fpq4"
                                                    >
                                                        {product.images && product.images[0]?.url ? (
                                                            <img
                                                                src={product.images[0].url}
                                                                alt={product.name}
                                                                className="w-full h-full object-contain"
                                                                data-oid="qq4i5s:"
                                                            />
                                                        ) : (
                                                            <div
                                                                className="text-center"
                                                                data-oid="mg8etxm"
                                                            >
                                                                <Pill
                                                                    className="w-8 h-8 text-gray-400 mx-auto mb-1"
                                                                    data-oid="um6a2lc"
                                                                />

                                                                <span
                                                                    className="text-xs text-gray-500"
                                                                    data-oid="worno-:"
                                                                >
                                                                    Product
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Selection Badge */}
                                                    {isSelected && (
                                                        <Badge
                                                            className="absolute top-2 right-2 bg-green-600 text-white text-xs"
                                                            data-oid="3wffgee"
                                                        >
                                                            ✓ Added
                                                        </Badge>
                                                    )}
                                                    {/* Similarity Badge */}
                                                    {!isSelected &&
                                                        (product.activeIngredient
                                                            .toLowerCase()
                                                            .includes(
                                                                selectedMedicineForAlternative.product.activeIngredient.toLowerCase(),
                                                            ) ||
                                                            selectedMedicineForAlternative.product.activeIngredient
                                                                .toLowerCase()
                                                                .includes(
                                                                    product.activeIngredient.toLowerCase(),
                                                                )) && (
                                                            <Badge
                                                                className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs"
                                                                data-oid="a3n59d:"
                                                            >
                                                                Similar
                                                            </Badge>
                                                        )}
                                                </div>

                                                {/* Product Info */}
                                                <div
                                                    className="space-y-2 flex-1 flex flex-col"
                                                    data-oid="h.4u7.:"
                                                >
                                                    <h3
                                                        className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2"
                                                        data-oid="rn16u14"
                                                    >
                                                        {product.name}
                                                    </h3>
                                                    <p
                                                        className="text-xs text-gray-600"
                                                        data-oid="h2d_3ec"
                                                    >
                                                        {product.manufacturer}
                                                    </p>
                                                    <div
                                                        className="text-xs text-gray-600 flex-1"
                                                        data-oid="4w1v0mq"
                                                    >
                                                        <div
                                                            className="flex items-center gap-1 mb-1"
                                                            data-oid="r2hhf4j"
                                                        >
                                                            <span data-oid="49pve.n">Active:</span>
                                                            <span
                                                                className="font-medium text-gray-900 truncate"
                                                                data-oid="gznfkgf"
                                                            >
                                                                {product.activeIngredient}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Price and Stock Status */}
                                                    <div
                                                        className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto"
                                                        data-oid="jk7v:ak"
                                                    >
                                                        <div data-oid="w48y8db">
                                                            <div
                                                                className="text-lg font-bold text-[#1F1F6F]"
                                                                data-oid="hifybed"
                                                            >
                                                                EGP {product.price.toFixed(2)}
                                                            </div>
                                                        </div>

                                                        {/* Stock Status */}
                                                        <div
                                                            className="text-right"
                                                            data-oid="i_3:hmm"
                                                        >
                                                            {!product.pharmacyStocks[0].inStock && (
                                                                <Badge
                                                                    variant="destructive"
                                                                    className="text-xs"
                                                                    data-oid="-543x6v"
                                                                >
                                                                    Out of Stock
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Select/Deselect Button */}
                                                    <Button
                                                        size="sm"
                                                        className={`w-full mt-3 group-hover:shadow-md transition-all duration-200 ${
                                                            isSelected
                                                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                                                : 'bg-gradient-to-r from-[#1F1F6F] to-[#14274E] hover:from-[#14274E] hover:to-[#1F1F6F]'
                                                        }`}
                                                        disabled={!product.pharmacyStocks[0].inStock}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            console.log(
                                                                'Button clicked for product:',
                                                                product.name,
                                                            );
                                                            console.log(
                                                                'Current isSelected state:',
                                                                isSelected,
                                                            );
                                                            console.log(
                                                                'Current alternatives:',
                                                                selectedMedicineForAlternative.alternativeProducts,
                                                            );
                                                            handleSelectAlternative(product);
                                                        }}
                                                        data-oid="qbtqrg8"
                                                    >
                                                        {isSelected ? (
                                                            <>
                                                                <CheckCircle
                                                                    className="w-4 h-4 mr-2"
                                                                    data-oid=":d-9jb."
                                                                />
                                                                Added as Alternative
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Plus
                                                                    className="w-4 h-4 mr-2"
                                                                    data-oid="z7ar9o_"
                                                                />
                                                                Add as Alternative
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>

                            {/* No Alternatives Found */}
                            {(() => {
                                const filteredAlternatives = allProducts.filter((product) => {
                                    if (product.id === selectedMedicineForAlternative?.product.id)
                                        return false;

                                    // ONLY ALLOW MEDICINE CATEGORIES
                                    const isMedicineProduct = [
                                        'otc',
                                        'prescription',
                                        'supplements',
                                    ].includes(product.category);
                                    if (!isMedicineProduct) return false;

                                    const matchesSearch =
                                        product.name
                                            .toLowerCase()
                                            .includes(alternativeSearchQuery.toLowerCase()) ||
                                        product.manufacturer
                                            .toLowerCase()
                                            .includes(alternativeSearchQuery.toLowerCase()) ||
                                        product.activeIngredient
                                            .toLowerCase()
                                            .includes(alternativeSearchQuery.toLowerCase());

                                    const matchesCategory =
                                        alternativeSelectedCategory === 'all' ||
                                        (isMedicineProduct &&
                                            product.category === alternativeSelectedCategory);

                                    return matchesSearch && matchesCategory;
                                });

                                return (
                                    filteredAlternatives.length === 0 && (
                                        <div className="text-center py-16" data-oid="t9k330:">
                                            <div
                                                className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                                data-oid="xr3co7e"
                                            >
                                                <Search
                                                    className="w-10 h-10 text-gray-400"
                                                    data-oid=":0thvbv"
                                                />
                                            </div>
                                            <h3
                                                className="text-lg font-semibold text-gray-900 mb-2"
                                                data-oid="29zamuy"
                                            >
                                                No alternatives found
                                            </h3>
                                            <p className="text-gray-600 mb-4" data-oid="mh8n.mn">
                                                Try adjusting your search terms or filters
                                            </p>
                                            <Button
                                                variant="outline"
                                                onClick={() => setAlternativeSearchQuery('')}
                                                data-oid="5b1ptbj"
                                            >
                                                Clear Search
                                            </Button>
                                        </div>
                                    )
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Product Selector Modal */}
            {showProductSelector && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    data-oid="5w1mczz"
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden"
                        data-oid="8vz7-9:"
                    >
                        {/* Modal Header */}
                        <div className="bg-white border-b border-gray-200 p-4" data-oid="rejdq1o">
                            <div className="flex items-center justify-between" data-oid="utzgb2u">
                                <div className="flex items-center space-x-3" data-oid="uz2k.be">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setShowProductSelector(false);
                                            setProductSearchQuery('');
                                        }}
                                        className="text-gray-600 hover:bg-gray-100"
                                        data-oid="botytyi"
                                    >
                                        <XCircle className="w-5 h-5" data-oid="0.tow3x" />
                                        Close
                                    </Button>
                                    <div className="h-6 w-px bg-gray-300" data-oid="wz7t0vx" />
                                    <h2
                                        className="text-xl font-bold text-gray-900"
                                        data-oid="lltdc:2"
                                    >
                                        Product Management
                                    </h2>
                                    <p className="text-sm text-gray-600" data-oid="43df_f4">
                                        Pharmacy Management System
                                    </p>
                                </div>
                                <div
                                    className="flex items-center space-x-3"
                                    data-oid="65yqv5e"
                                ></div>
                            </div>
                        </div>

                        {/* Search and Filter Bar */}
                        <div className="bg-gray-50 border-b border-gray-200 p-4" data-oid="gf9.ed2">
                            <div className="flex items-center space-x-4" data-oid="i8a8.w3">
                                <div className="flex-1 relative" data-oid="-51pvz6">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                                        data-oid="58cz.jq"
                                    />

                                    <Input
                                        type="text"
                                        placeholder="Search products by name, ingredient, manufacturer..."
                                        value={productSearchQuery}
                                        onChange={(e) => setProductSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 border-gray-300 focus:border-[#1F1F6F] focus:ring-[#1F1F6F]"
                                        data-oid="k7h_n16"
                                    />
                                </div>
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                    data-oid="nz-_y3p"
                                >
                                    <SelectTrigger className="w-48" data-oid="lof5y4x">
                                        <SelectValue
                                            placeholder="All Categories"
                                            data-oid="82u9b9z"
                                        />
                                    </SelectTrigger>
                                    <SelectContent data-oid="_in4x17">
                                        <SelectItem value="all" data-oid="9e-cfx4">
                                            All Categories
                                        </SelectItem>
                                        <SelectItem value="otc" data-oid="ow-ma6.">
                                            OTC
                                        </SelectItem>
                                        <SelectItem value="prescription" data-oid="r0nsgv-">
                                            Prescription
                                        </SelectItem>
                                        <SelectItem value="supplements" data-oid="ofbw8pm">
                                            Supplements
                                        </SelectItem>
                                        <SelectItem value="medical" data-oid="n3qu5k8">
                                            Medical
                                        </SelectItem>
                                        <SelectItem value="baby" data-oid="0ukx2l7">
                                            Baby
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto" data-oid="2zric0k">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                                data-oid="t2489_v"
                            >
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col h-full"
                                        onClick={() => handleAddMedicine(product)}
                                        data-oid="ts1ro9j"
                                    >
                                        {/* Product Image */}
                                        <div className="relative mb-3" data-oid="2f20y12">
                                            <div
                                                className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
                                                data-oid=".pt37-s"
                                            >
                                                {product.images && product.images[0]?.url ? (
                                                    <img
                                                        src={product.images[0].url}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain"
                                                        data-oid="dlbom:x"
                                                    />
                                                ) : (
                                                    <div className="text-center" data-oid=":1wulwy">
                                                        <Pill
                                                            className="w-8 h-8 text-gray-400 mx-auto mb-1"
                                                            data-oid="3rln1ei"
                                                        />

                                                        <span
                                                            className="text-xs text-gray-500"
                                                            data-oid="fwb8g-v"
                                                        >
                                                            Product
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div
                                            className="space-y-2 flex-1 flex flex-col"
                                            data-oid="pqfj14o"
                                        >
                                            <h3
                                                className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2"
                                                data-oid="6svae:a"
                                            >
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-gray-600" data-oid="v.3:-e_">
                                                {product.manufacturer}
                                            </p>
                                            <div
                                                className="text-xs text-gray-600 flex-1"
                                                data-oid="-gkuhr4"
                                            >
                                                <div
                                                    className="flex items-center gap-1 mb-1"
                                                    data-oid="ouvad._"
                                                >
                                                    <span data-oid="b-b1eij">Active:</span>
                                                    <span
                                                        className="font-medium text-gray-900 truncate"
                                                        data-oid="rsgf-eg"
                                                    >
                                                        {product.activeIngredient}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Price and Stock Status */}
                                            <div
                                                className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto"
                                                data-oid="e-ydf:h"
                                            >
                                                <div data-oid="021sn6s">
                                                    <div
                                                        className="text-lg font-bold text-[#1F1F6F]"
                                                        data-oid="c.vg1p9"
                                                    >
                                                        EGP {product.pharmacyStocks[0]?.price?.toFixed(2)}
                                                    </div>
                                                    {product.originalPrice && (
                                                        <div
                                                            className="text-xs text-gray-500 line-through"
                                                            data-oid="468u1in"
                                                        >
                                                            EGP {product.pharmacyStocks[0]?.originalPrice?.toFixed(2)}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Stock Status - Only show if out of stock */}
                                                <div className="text-right" data-oid="8n--mp5">
                                                    {!product.pharmacyStocks[0]?.inStock && (
                                                        <Badge
                                                            variant="destructive"
                                                            className="text-xs"
                                                            data-oid="v5fbei:"
                                                        >
                                                            Out of Stock
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Add Button */}
                                            <Button
                                                size="sm"
                                                className="w-full mt-3 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] hover:from-[#14274E] hover:to-[#1F1F6F] group-hover:shadow-md transition-all duration-200"
                                                disabled={!product.pharmacyStocks[0]?.inStock}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddMedicine(product);
                                                }}
                                                data-oid="u_n5aud"
                                            >
                                                <Plus className="w-4 h-4 mr-2" data-oid=".3cfk6." />
                                                Add to Prescription
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* No Products Found */}
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-16" data-oid="fu9cw6l">
                                    <div
                                        className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                        data-oid="c0a1f2n"
                                    >
                                        <Search
                                            className="w-10 h-10 text-gray-400"
                                            data-oid="81413ji"
                                        />
                                    </div>
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="exd02bv"
                                    >
                                        No products found
                                    </h3>
                                    <p className="text-gray-600 mb-4" data-oid="_efe88z">
                                        Try adjusting your search terms or filters
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setProductSearchQuery('')}
                                        data-oid="0939_3."
                                    >
                                        Clear Search
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Suspend Prescription Modal */}
            {showSuspendModal && selectedPrescription && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    data-oid="3w:.olr"
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                        data-oid="ahke-1k"
                    >
                        {/* Modal Header */}
                        <div
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6"
                            data-oid="-jix_h3"
                        >
                            <div className="flex items-center justify-between" data-oid="fcq5.a-">
                                <div className="flex items-center space-x-3" data-oid="kh3q-h8">
                                    <div
                                        className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                                        data-oid="swu:nij"
                                    >
                                        <AlertCircle className="w-6 h-6" data-oid="5te2zct" />
                                    </div>
                                    <div data-oid="bfs7gok">
                                        <h2 className="text-xl font-bold" data-oid="tl3-o_4">
                                            Suspend Prescription
                                        </h2>
                                        <p className="text-orange-100 text-sm" data-oid="_c.do84">
                                            Prescription ID: {selectedPrescription.id}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setShowSuspendModal(false);
                                        setSuspendReason('');
                                        setSuspendCategory('');
                                    }}
                                    className="text-white hover:bg-white/20"
                                    data-oid="0xg1gb_"
                                >
                                    <X className="w-5 h-5" data-oid="_1b3ri:" />
                                </Button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6 overflow-y-auto flex-1" data-oid="076phmg">
                            {/* Prescription Info */}
                            <div
                                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                data-oid="vbd_r2p"
                            >
                                <h3 className="font-semibold text-gray-900 mb-2" data-oid="xcozd5s">
                                    Prescription Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm" data-oid="clt4ts7">
                                    <div data-oid="2sz3qg4">
                                        <span className="text-gray-600" data-oid="m3y4vsx">
                                            Patient:
                                        </span>
                                        <span className="font-medium ml-2" data-oid="3ephvf0">
                                            {selectedPrescription.patientName}
                                        </span>
                                    </div>
                                    <div data-oid="n1vj8sl">
                                        <span className="text-gray-600" data-oid="jriugid">
                                            Customer:
                                        </span>
                                        <span className="font-medium ml-2" data-oid="rgwbcp0">
                                            {selectedPrescription.customerName}
                                        </span>
                                    </div>
                                    <div data-oid="gdxec_7">
                                        <span className="text-gray-600" data-oid="nd4xe-f">
                                            Medicines Added:
                                        </span>
                                        <span className="font-medium ml-2" data-oid="7f7nf5j">
                                            {processedMedicines.length}
                                        </span>
                                    </div>
                                    <div data-oid="qb7_pt3">
                                        <span className="text-gray-600" data-oid="jaqh_nu">
                                            Files:
                                        </span>
                                        <span className="font-medium ml-2" data-oid="c91xk30">
                                            {selectedPrescription.files.length}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Suspension Category */}
                            <div data-oid="2tpgbi_">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="fb:1tq."
                                >
                                    Suspension Category *
                                </label>
                                <Select
                                    value={suspendCategory}
                                    onValueChange={setSuspendCategory}
                                    data-oid=".heffhy"
                                >
                                    <SelectTrigger
                                        className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                        data-oid="mxj6t6o"
                                    >
                                        <SelectValue
                                            placeholder="Select suspension category"
                                            data-oid="51zdf.s"
                                        />
                                    </SelectTrigger>
                                    <SelectContent data-oid="9t6-sp5">
                                        <SelectItem value="medicine-unavailable" data-oid="_-5sx8l">
                                            Medicine Unavailable
                                        </SelectItem>
                                        <SelectItem value="dosage-unclear" data-oid="yu7j43b">
                                            Dosage Instructions Unclear
                                        </SelectItem>
                                        <SelectItem
                                            value="prescription-illegible"
                                            data-oid="r-:wrc:"
                                        >
                                            Prescription Illegible
                                        </SelectItem>
                                        <SelectItem value="drug-interaction" data-oid="c3j:.gf">
                                            Potential Drug Interaction
                                        </SelectItem>
                                        <SelectItem value="patient-allergy" data-oid="1ce32vt">
                                            Patient Allergy Concern
                                        </SelectItem>
                                        <SelectItem value="insurance-issue" data-oid="_-6jeiu">
                                            Insurance/Payment Issue
                                        </SelectItem>
                                        <SelectItem value="doctor-verification" data-oid="j2j4.f0">
                                            Doctor Verification Required
                                        </SelectItem>
                                        <SelectItem value="technical-issue" data-oid="_iuga8r">
                                            Technical Issue
                                        </SelectItem>
                                        <SelectItem value="other" data-oid="vwv36gj">
                                            Other
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Suspension Reason */}
                            <div data-oid="pl-_49m">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="x__a79m"
                                >
                                    Detailed Reason for Suspension *
                                </label>
                                <Textarea
                                    value={suspendReason}
                                    onChange={(e) => setSuspendReason(e.target.value)}
                                    placeholder="Please provide a detailed explanation of why this prescription needs to be suspended. Include any specific issues, missing information, or concerns that require App Services attention..."
                                    rows={4}
                                    className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                    data-oid=".50itaq"
                                />

                                <p className="text-xs text-gray-500 mt-1" data-oid="b9dy30f">
                                    This information will be sent to App Services to help them
                                    resolve the issue.
                                </p>
                            </div>

                            {/* Warning Notice */}
                            <div
                                className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                                data-oid="5w_zzoq"
                            >
                                <div className="flex items-start space-x-3" data-oid="ytknmo8">
                                    <AlertCircle
                                        className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0"
                                        data-oid="2ii_jx7"
                                    />

                                    <div data-oid="rfo6zyf">
                                        <h4
                                            className="font-medium text-orange-800 mb-1"
                                            data-oid="erwiqlo"
                                        >
                                            Important Notice
                                        </h4>
                                        <p className="text-sm text-orange-700" data-oid="0rhtfoc">
                                            Suspending this prescription will send it to the App
                                            Services dashboard for review and resolution. The
                                            customer will be notified about the delay, and App
                                            Services will work to resolve the issue as quickly as
                                            possible.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div
                            className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0"
                            data-oid="kdse2yz"
                        >
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowSuspendModal(false);
                                    setSuspendReason('');
                                    setSuspendCategory('');
                                }}
                                data-oid="ida7m32"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSuspendPrescription}
                                disabled={!suspendReason.trim() || !suspendCategory}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                                data-oid="2xopp5j"
                            >
                                <AlertCircle className="w-4 h-4 mr-2" data-oid="btfzc.r" />
                                Suspend Prescription
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper function to get file URL
function getFileUrl(file: any) {
    // Implement your file URL retrieval logic here
    return file.url || null;
}
