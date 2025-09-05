'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
    Users,
    UserPlus,
    Building2,
    Stethoscope,
    Package,
    Shield,
    FileText,
    Database,
    MapPin,
    CheckCircle,
    User,
    MapIcon,
    Settings,
    Eye,
    Pill,
    Edit,
} from 'lucide-react';

// Define an interface for each specific user role's data
interface BaseRoleData {
    whatsappNumber?: string;
}

interface PharmacyRoleData extends BaseRoleData {
    pharmacyName?: string;
    pharmacyNameArabic?: string;
    pharmacyLicense?: string;
    operatingHoursOpen?: string;
    operatingHoursClose?: string;
    servicesOffered?: string[];
    businessName?: string;
    businessNameAr?: string;
    businessType?: string;
    taxNumber?: string;
    coordinates?: { lat: number; lng: number };
    workingHours?: { [key: string]: string };
    specialties?: string[];
    features?: string[];
    commissionRate?: number;
}

interface DoctorRoleData extends BaseRoleData {
    specialization?: string;
    medicalLicense?: string;
    clinicName?: string;
    clinicAddress?: string;
    commissionRate?: number;
    availableDays?: string[];
    availableHoursStart?: string;
    availableHoursEnd?: string;
    businessName?: string;
}

interface VendorRoleData extends BaseRoleData {
    companyName?: string;
    businessLicense?: string;
    productCategories?: string[];
    supplierType?: 'manufacturer' | 'distributor' | 'wholesaler';
    businessName?: string;
}

interface StaffRoleData extends BaseRoleData {
    department?: string;
    position?: string;
    permissions?: string[];
}

interface PrescriptionReaderRoleData extends BaseRoleData {
    shiftStartTime?: string;
    shiftEndTime?: string;
    experienceLevel?: 'junior' | 'senior' | 'expert';
    languagesSpoken?: string[];
    certifications?: string[];
}

interface DatabaseInputRoleData extends BaseRoleData {
    workingHoursStart?: string;
    workingHoursEnd?: string;
    specializedCategories?: string[];
}

// The main interface for the component's state
export interface AccountCreationData {
    // Personal Information
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    nationalId: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | '';
    // Location Information
    governorate: string;
    city: string;
    address: string;
    // Account Information
    userType: 'customer' | 'pharmacy' | 'doctor' | 'vendor' | 'prescription-reader' | 'database-input' | 'admin';
    status: 'active' | 'pending' | 'suspended';
    // Role-Specific Data
    roleSpecificData:
        | PharmacyRoleData
        | DoctorRoleData
        | VendorRoleData
        | StaffRoleData
        | PrescriptionReaderRoleData
        | DatabaseInputRoleData
        | {};
}

// Type for account types used in the component
type AccountTypeKey = 'pharmacy' | 'doctor' | 'vendor' | 'staff' | 'prescription-reader' | 'database-input';

export default function AccountCreationPage() {
    const { toast } = useToast();
    const [activeAccountType, setActiveAccountType] = useState<AccountTypeKey>('pharmacy');
    const [currentStep, setCurrentStep] = useState(1);
    const [isCreating, setIsCreating] = useState(false);
    const [accountData, setAccountData] = useState<AccountCreationData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        nationalId: '',
        dateOfBirth: '',
        gender: '',
        governorate: '',
        city: '',
        address: '',
        userType: 'pharmacy',
        status: 'pending',
        roleSpecificData: {},
    });

    // Custom SVG Icons for CURA brand
    const PharmacyIcon = () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" data-oid="puovr51">
            <path
                d="M19 8h-2V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm6 9h-2v2h-2v-2H9v-2h2v-2h2v2h2v2z"
                data-oid="fts-1in"
            />
        </svg>
    );

    const DoctorIcon = () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" data-oid="no5u4c6">
            <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                data-oid="pw-jx5-"
            />
        </svg>
    );

    const VendorIcon = () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" data-oid="3p4xc-l">
            <path
                d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"
                data-oid="-lst1a_"
            />
            <path d="M6 10h2v2H6zm3 0h7v2H9z" data-oid="tdwx71." />
        </svg>
    );

    const AdminIcon = () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" data-oid="5n11d5s">
            <path
                d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
                data-oid="n7h:kzp"
            />
        </svg>
    );

    const PrescriptionReaderIcon = () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" data-oid=".8ww9h.">
            <path
                d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                data-oid="w3d839g"
            />
        </svg>
    );

    const DatabaseIcon = () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" data-oid="6jdpln7">
            <path
                d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4zM4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4z"
                data-oid="v6.gm5d"
            />
            <path
                d="M4 14v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4z"
                data-oid="l:u0b31"
            />
        </svg>
    );

    const accountTypes = [
        {
            id: 'pharmacy' as const,
            title: 'Pharmacy Account',
            description: 'Create accounts for pharmacy partners',
            icon: <PharmacyIcon data-oid="a1..g0k" />,
            color: 'bg-cura-primary',
            hoverColor: 'hover:bg-cura-secondary',
            borderColor: 'border-cura-primary',
            textColor: 'text-cura-primary',
            bgLight: 'bg-cura-primary/10',
            fields: [
                'Personal Info',
                'Location',
                'Pharmacy Details',
                'License Info',
                'Operating Hours',
            ],
        },
        {
            id: 'doctor' as const,
            title: 'Doctor Account',
            description: 'Create accounts for medical professionals',
            icon: <DoctorIcon data-oid="kbn_h6s" />,
            color: 'bg-cura-secondary',
            hoverColor: 'hover:bg-cura-accent',
            borderColor: 'border-cura-secondary',
            textColor: 'text-cura-secondary',
            bgLight: 'bg-cura-secondary/10',
            fields: [
                'Personal Info',
                'Location',
                'Medical License',
                'Specialization',
                'Clinic Info',
            ],
        },
        {
            id: 'vendor' as const,
            title: 'Vendor Account',
            description: 'Create accounts for suppliers and vendors',
            icon: <VendorIcon data-oid="uv0yq::" />,
            color: 'bg-cura-accent',
            hoverColor: 'hover:bg-cura-light',
            borderColor: 'border-cura-accent',
            textColor: 'text-cura-accent',
            bgLight: 'bg-cura-accent/10',
            fields: [
                'Personal Info',
                'Location',
                'Company Details',
                'Business License',
                'Product Categories',
            ],
        },
        {
            id: 'staff' as const,
            title: 'Admin Account',
            description: 'Create accounts for internal admin members',
            icon: <AdminIcon data-oid="x6fq2ur" />,
            color: 'bg-gradient-to-br from-cura-primary to-cura-secondary',
            hoverColor: 'hover:from-cura-secondary hover:to-cura-accent',
            borderColor: 'border-cura-primary',
            textColor: 'text-cura-primary',
            bgLight: 'bg-gradient-to-br from-cura-primary/10 to-cura-secondary/10',
            fields: ['Personal Info', 'Location', 'Department', 'Position', 'Permissions'],
        },
        {
            id: 'prescription-reader' as const,
            title: 'Prescription Reader',
            description: 'Create accounts for prescription reading staff',
            icon: <PrescriptionReaderIcon data-oid="sbkhuu4" />,
            color: 'bg-cura-light',
            hoverColor: 'hover:bg-cura-accent',
            borderColor: 'border-cura-light',
            textColor: 'text-cura-light',
            bgLight: 'bg-cura-light/10',
            fields: [
                'Personal Info',
                'Location',
                'Experience Level',
                'Languages',
                'Certifications',
            ],
        },
        {
            id: 'database-input' as const,
            title: 'Database Input User',
            description: 'Create accounts for data entry specialists',
            icon: <DatabaseIcon data-oid="u4d_h:-" />,
            color: 'bg-gradient-to-br from-cura-accent to-cura-light',
            hoverColor: 'hover:from-cura-light hover:to-cura-primary',
            borderColor: 'border-cura-accent',
            textColor: 'text-cura-accent',
            bgLight: 'bg-gradient-to-br from-cura-accent/10 to-cura-light/10',
            fields: [
                'Personal Info',
                'Location',
                'Data Entry Skills',
                'Categories',
                'Working Hours',
            ],
        },
    ];

    const handleInputChange = (field: string, value: string | string[] | number) => {
        if (field.startsWith('roleSpecific.')) {
            const roleField = field.replace('roleSpecific.', '');
            setAccountData((prev) => ({
                ...prev,
                roleSpecificData: {
                    ...prev.roleSpecificData,
                    [roleField]: value,
                },
            }));
        } else {
            setAccountData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handleAccountTypeChange = (type: AccountTypeKey) => {
        setActiveAccountType(type);
        setCurrentStep(1);

        // Map account type to userType
        let userType: AccountCreationData['userType'] = 'pharmacy';
        switch (type) {
            case 'pharmacy':
                userType = 'pharmacy';
                break;
            case 'doctor':
                userType = 'doctor';
                break;
            case 'vendor':
                userType = 'vendor';
                break;
            case 'staff':
                userType = 'admin';
                break;
            case 'prescription-reader':
                userType = 'prescription-reader';
                break;
            case 'database-input':
                userType = 'database-input';
                break;
        }

        setAccountData((prev) => ({
            ...prev,
            userType,
            roleSpecificData: {},
        }));
    };

    // Enhanced handleCreateAccount function with comprehensive user type support
    const handleCreateAccount = async () => {
        try {
            setIsCreating(true);
            console.log('Creating account:', accountData);

            // Validate required fields
            if (!accountData.firstName || !accountData.lastName || !accountData.email || 
                !accountData.password || !accountData.phone) {
                toast({
                    title: "Validation Error",
                    description: "Please fill in all required fields.",
                    variant: "destructive"
                });
                return;
            }

            // Map the frontend state to the backend's expected request body
            let requestBody: any = {
                name: `${accountData.firstName} ${accountData.lastName}`,
                firstName: accountData.firstName,
                lastName: accountData.lastName,
                email: accountData.email,
                phone: accountData.phone,
                password: accountData.password,
                dateOfBirth: accountData.dateOfBirth,
                gender: accountData.gender,
                role: accountData.userType,
                status: accountData.status, // Add status field to request body
                cityId: accountData.city,
                governorateId: accountData.governorate,
                addresses: [{
                    street: accountData.address,
                    city: accountData.city,
                    governorate: accountData.governorate,
                    isDefault: true
                }]
            };

            // Add role-specific data based on userType
            if (accountData.userType === 'pharmacy') {
                const pharmacyRoleData = accountData.roleSpecificData as PharmacyRoleData;
                requestBody = {
                    ...requestBody,
                    businessName: pharmacyRoleData.businessName || pharmacyRoleData.pharmacyName,
                    businessNameAr: pharmacyRoleData.businessNameAr || pharmacyRoleData.pharmacyNameArabic,
                    businessType: pharmacyRoleData.businessType || 'pharmacy',
                    licenseNumber: pharmacyRoleData.pharmacyLicense,
                    taxNumber: pharmacyRoleData.taxNumber,
                    coordinates: pharmacyRoleData.coordinates,
                    businessAddress: {
                        street: accountData.address,
                        city: accountData.city,
                        governorate: accountData.governorate
                    },
                    workingHours: pharmacyRoleData.workingHours || {
                        open: pharmacyRoleData.operatingHoursOpen || '09:00',
                        close: pharmacyRoleData.operatingHoursClose || '22:00',
                        is24Hours: false
                    },
                    specialties: pharmacyRoleData.specialties || [],
                    features: pharmacyRoleData.features || [],
                    whatsappNumber: pharmacyRoleData.whatsappNumber
                };
            } else if (accountData.userType === 'doctor') {
                const doctorRoleData = accountData.roleSpecificData as DoctorRoleData;
                requestBody = {
                    ...requestBody,
                    businessName: doctorRoleData.businessName || doctorRoleData.clinicName,
                    businessType: 'clinic',
                    licenseNumber: doctorRoleData.medicalLicense,
                    specialization: doctorRoleData.specialization,
                    clinicName: doctorRoleData.clinicName,
                    clinicAddress: doctorRoleData.clinicAddress,
                    commission: doctorRoleData.commissionRate || 0,
                    availableDays: doctorRoleData.availableDays || [],
                    availableHoursStart: doctorRoleData.availableHoursStart,
                    availableHoursEnd: doctorRoleData.availableHoursEnd,
                    whatsappNumber: doctorRoleData.whatsappNumber
                };
            } else if (accountData.userType === 'vendor') {
                const vendorRoleData = accountData.roleSpecificData as VendorRoleData;
                requestBody = {
                    ...requestBody,
                    businessName: vendorRoleData.businessName || vendorRoleData.companyName,
                    businessType: vendorRoleData.supplierType || 'distributor',
                    licenseNumber: vendorRoleData.businessLicense,
                    productCategories: vendorRoleData.productCategories || [],
                    supplierType: vendorRoleData.supplierType,
                    whatsappNumber: vendorRoleData.whatsappNumber
                };
            } else if (accountData.userType === 'staff') {
                const staffRoleData = accountData.roleSpecificData as StaffRoleData;
                requestBody = {
                    ...requestBody,
                    department: staffRoleData.department,
                    position: staffRoleData.position,
                    permissions: staffRoleData.permissions || [],
                    whatsappNumber: staffRoleData.whatsappNumber
                };
            } else if (accountData.userType === 'prescription-reader') {
                const readerRoleData = accountData.roleSpecificData as PrescriptionReaderRoleData;
                requestBody = {
                    ...requestBody,
                    shiftStartTime: readerRoleData.shiftStartTime,
                    shiftEndTime: readerRoleData.shiftEndTime,
                    experienceLevel: readerRoleData.experienceLevel || 'junior',
                    languagesSpoken: readerRoleData.languagesSpoken || ['ar', 'en'],
                    certifications: readerRoleData.certifications || [],
                    whatsappNumber: readerRoleData.whatsappNumber
                };
            } else if (accountData.userType === 'database-input') {
                const dbRoleData = accountData.roleSpecificData as DatabaseInputRoleData;
                requestBody = {
                    ...requestBody,
                    workingHoursStart: dbRoleData.workingHoursStart,
                    workingHoursEnd: dbRoleData.workingHoursEnd,
                    specializedCategories: dbRoleData.specializedCategories || [],
                    whatsappNumber: dbRoleData.whatsappNumber
                };
            }

            // Use environment variable for API URL
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            
            // Send a POST request to the backend registration endpoint
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();

            if (response.ok) {
                // Show success toast
                toast({
                    title: "Account Created Successfully! 🎉",
                    description: `${accountData.userType.charAt(0).toUpperCase() + accountData.userType.slice(1)} account for ${requestBody.name} has been created successfully.`,
                    variant: "default"
                });

                // Reset form and navigate to first step
                setAccountData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    phone: '',
                    nationalId: '',
                    dateOfBirth: '',
                    gender: '',
                    governorate: '',
                    city: '',
                    address: '',
                    userType: 'pharmacy',
                    status: 'pending',
                    roleSpecificData: {},
                });
                setCurrentStep(1);
                setActiveAccountType('pharmacy');

            } else {
                // Show error toast with detailed information
                const errorMessage = result.details || result.error || result.message || 'Unknown error occurred. Please try again.';
                toast({
                    title: "Account Creation Failed",
                    description: errorMessage,
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error creating account:', error);
            toast({
                title: "Network Error",
                description: 'Unable to connect to the server. Please check your connection and try again.',
                variant: "destructive"
            });
        } finally {
            setIsCreating(false);
        }
    };
    const renderPersonalInfoStep = () => (
        <div className="space-y-8" data-oid="ycu4bi-">
            <div data-oid="ogo66dp">
                <h3
                    className="text-2xl font-bold text-cura-primary mb-2 flex items-center"
                    data-oid="y:m:z04"
                >
                    <Users className="w-6 h-6 mr-3" data-oid="l4l696l" />
                    {activeAccountType === 'pharmacy'
                        ? 'Pharmacy Owner Information'
                        : activeAccountType === 'vendor'
                          ? 'Vendor Owner Information'
                          : 'Personal Information'}
                </h3>
                <p className="text-cura-secondary/80 mb-6" data-oid="yw9wf.a">
                    {activeAccountType === 'pharmacy'
                        ? 'Please enter the personal information of the pharmacy owner/manager'
                        : activeAccountType === 'vendor'
                          ? 'Please enter the personal information of the vendor/company owner'
                          : 'Please provide the required personal information for account creation'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="o2hy4zg">
                    <div data-oid="zii63c5">
                        <Label htmlFor="firstName" data-oid="jpt1udf">
                            First Name *
                        </Label>
                        <Input
                            id="firstName"
                            value={accountData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="Enter first name"
                            data-oid="u2jzofh"
                        />
                    </div>
                    <div data-oid="2bcc1he">
                        <Label htmlFor="lastName" data-oid=":.0:f71">
                            Last Name *
                        </Label>
                        <Input
                            id="lastName"
                            value={accountData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Enter last name"
                            data-oid="nb6up5s"
                        />
                    </div>
                    <div data-oid="db6jyir">
                        <Label htmlFor="email" data-oid="6x_kgu9">
                            Email Address *
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={accountData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Enter email address"
                            data-oid="izhevec"
                        />
                    </div>
                    <div data-oid="jhi_vw_">
                        <Label htmlFor="phone" data-oid="h21tiz7">
                            {activeAccountType === 'pharmacy' || activeAccountType === 'vendor'
                                ? 'Owner Phone Number *'
                                : 'Phone Number *'}
                        </Label>
                        <Input
                            id="phone"
                            value={accountData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+20 XXX XXX XXXX"
                            data-oid="sdiyzg2"
                        />
                    </div>
                    {(activeAccountType === 'pharmacy' ||
                        activeAccountType === 'vendor' ||
                        activeAccountType === 'doctor' ||
                        activeAccountType === 'prescription-reader' ||
                        activeAccountType === 'database-input') && (
                        <div data-oid="awycagw">
                            <Label htmlFor="whatsappNumber" data-oid="5xhx20k">
                                {activeAccountType === 'pharmacy' || activeAccountType === 'vendor'
                                    ? 'Owner WhatsApp Number'
                                    : 'WhatsApp Number'}
                            </Label>
                            <Input
                                id="whatsappNumber"
                                value={(accountData.roleSpecificData as BaseRoleData).whatsappNumber || ''}
                                onChange={(e) =>
                                    handleInputChange('roleSpecific.whatsappNumber', e.target.value)
                                }
                                placeholder="+20 XXX XXX XXXX"
                                data-oid="l_983l8"
                            />
                        </div>
                    )}
                    <div data-oid="_kpv5i_">
                        <Label htmlFor="password" data-oid="066p1:s">
                            Password *
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={accountData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="Enter password"
                            data-oid="6xrmcj7"
                        />
                    </div>
                    {activeAccountType === 'staff' && (
                        <div data-oid="jvxspv7">
                            <Label htmlFor="nationalId" data-oid="r821cxl">
                                National ID
                            </Label>
                            <Input
                                id="nationalId"
                                value={accountData.nationalId}
                                onChange={(e) => handleInputChange('nationalId', e.target.value)}
                                placeholder="14 digit national ID"
                                data-oid=":3tqs47"
                            />
                        </div>
                    )}
                    <div data-oid="np_t._q">
                        <Label htmlFor="dateOfBirth" data-oid="1b53e33">
                            Date of Birth
                        </Label>
                        <Input
                            id="dateOfBirth"
                            type="date"
                            value={accountData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            data-oid="0llcwx5"
                        />
                    </div>
                    <div data-oid="wbda21n">
                        <Label htmlFor="gender" data-oid="w::46::">
                            Gender
                        </Label>
                        <Select
                            value={accountData.gender || 'not-specified'}
                            onValueChange={(value) =>
                                handleInputChange('gender', value === 'not-specified' ? '' : value)
                            }
                            data-oid="wqau0zn"
                        >
                            <SelectTrigger data-oid="i2r62sg">
                                <SelectValue placeholder="Select gender" data-oid="p_wg7-o" />
                            </SelectTrigger>
                            <SelectContent data-oid="_7cvu:r">
                                <SelectItem value="not-specified" data-oid=":a4.e8e">
                                    Not Specified
                                </SelectItem>
                                <SelectItem value="male" data-oid="wdy_4_x">
                                    Male
                                </SelectItem>
                                <SelectItem value="female" data-oid="i:pikds">
                                    Female
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );

    // const renderRoleSpecificFields = () => {
    //     // Ensure accountData.roleSpecificData is typed correctly to avoid errors
    //     const roleSpecificData = accountData.roleSpecificData as any;

    //     switch (activeAccountType) {
    //         case 'pharmacy':
    //             return (
    //                 <div className="space-y-6" data-oid="2k3m67m">
    //                     <div data-oid="c.g.ltd">
    //                         <h3
    //                             className="text-lg font-semibold text-gray-900 mb-4"
    //                             data-oid="f:f9f6e"
    //                         >
    //                             Pharmacy Information
    //                         </h3>
    //                         <div
    //                             className="grid grid-cols-1 md:grid-cols-2 gap-4"
    //                             data-oid="q8m6d_v"
    //                         >
    //                             <div data-oid="o301n4b">
    //                                 <Label htmlFor="pharmacyName" data-oid="w7f655u">
    //                                     Pharmacy Name *
    //                                 </Label>
    //                                 <Input
    //                                     id="pharmacyName"
    //                                     value={roleSpecificData.pharmacyName || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange('roleSpecific.pharmacyName', e.target.value)
    //                                     }
    //                                     placeholder="Enter pharmacy name"
    //                                     data-oid="i.a661y"
    //                                 />
    //                             </div>
    //                             <div data-oid="p81c_h6">
    //                                 <Label htmlFor="pharmacyNameArabic" data-oid="l4vj44x">
    //                                     Pharmacy Name (Arabic)
    //                                 </Label>
    //                                 <Input
    //                                     id="pharmacyNameArabic"
    //                                     value={roleSpecificData.pharmacyNameArabic || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange(
    //                                             'roleSpecific.pharmacyNameArabic',
    //                                             e.target.value,
    //                                         )
    //                                     }
    //                                     placeholder="ادخل اسم الصيدلية"
    //                                     data-oid="p11c47o"
    //                                     className="text-right"
    //                                 />
    //                             </div>
    //                             <div data-oid="jljx6-4">
    //                                 <Label htmlFor="pharmacyLicense" data-oid="c7v4c:9">
    //                                     Pharmacy License Number *
    //                                 </Label>
    //                                 <Input
    //                                     id="pharmacyLicense"
    //                                     value={roleSpecificData.pharmacyLicense || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange('roleSpecific.pharmacyLicense', e.target.value)
    //                                     }
    //                                     placeholder="Enter license number"
    //                                     data-oid="f0w2f2c"
    //                                 />
    //                             </div>
    //                             <div data-oid="t592h7j">
    //                                 <Label htmlFor="operatingHoursOpen" data-oid="1587272">
    //                                     Operating Hours (Open)
    //                                 </Label>
    //                                 <Input
    //                                     id="operatingHoursOpen"
    //                                     type="time"
    //                                     value={roleSpecificData.operatingHoursOpen || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange('roleSpecific.operatingHoursOpen', e.target.value)
    //                                     }
    //                                     data-oid="o-4-0m6"
    //                                 />
    //                             </div>
    //                             <div data-oid="o2t52-e">
    //                                 <Label htmlFor="operatingHoursClose" data-oid="m0z3o2q">
    //                                     Operating Hours (Close)
    //                                 </Label>
    //                                 <Input
    //                                     id="operatingHoursClose"
    //                                     type="time"
    //                                     value={roleSpecificData.operatingHoursClose || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange('roleSpecific.operatingHoursClose', e.target.value)
    //                                     }
    //                                     data-oid="g_5.p6l"
    //                                 />
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <div data-oid="9e2q_38">
    //                         <h3
    //                             className="text-lg font-semibold text-gray-900 mb-4"
    //                             data-oid="g3w4t6o"
    //                         >
    //                             Services Offered
    //                         </h3>
    //                         <Textarea
    //                             value={roleSpecificData.servicesOffered?.join(', ') || ''}
    //                             onChange={(e) =>
    //                                 handleInputChange(
    //                                     'roleSpecific.servicesOffered',
    //                                     e.target.value.split(', ').filter((item) => item.trim()),
    //                                 )
    //                             }
    //                             placeholder="Enter services separated by commas (e.g., Delivery, Vaccine, Consultation)"
    //                             rows={3}
    //                             data-oid="9a:907v"
    //                         />
    //                     </div>
    //                 </div>
    //             );
    //         case 'doctor':
    //             return (
    //                 <div className="space-y-6" data-oid="8g4_j-d">
    //                     <div data-oid="2v1z2o9">
    //                         <h3
    //                             className="text-lg font-semibold text-gray-900 mb-4"
    //                             data-oid="218.47s"
    //                         >
    //                             Doctor Information
    //                         </h3>
    //                         <div
    //                             className="grid grid-cols-1 md:grid-cols-2 gap-4"
    //                             data-oid="3p.b4:l"
    //                         >
    //                             <div data-oid="h1z222m">
    //                                 <Label htmlFor="specialization" data-oid="n17j8.f">
    //                                     Specialization *
    //                                 </Label>
    //                                 <Input
    //                                     id="specialization"
    //                                     value={roleSpecificData.specialization || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange('roleSpecific.specialization', e.target.value)
    //                                     }
    //                                     placeholder="e.g., Pediatrics, Dermatology"
    //                                     data-oid="q7n5f.b"
    //                                 />
    //                             </div>
    //                             <div data-oid="o92k23l">
    //                                 <Label htmlFor="medicalLicense" data-oid="b64593s">
    //                                     Medical License Number *
    //                                 </Label>
    //                                 <Input
    //                                     id="medicalLicense"
    //                                     value={roleSpecificData.medicalLicense || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange('roleSpecific.medicalLicense', e.target.value)
    //                                     }
    //                                     placeholder="Enter license number"
    //                                     data-oid="t5k5z_g"
    //                                 />
    //                             </div>
    //                             <div data-oid="2a-e8.w">
    //                                 <Label htmlFor="clinicName" data-oid="2m-63d1">
    //                                     Clinic Name
    //                                 </Label>
    //                                 <Input
    //                                     id="clinicName"
    //                                     value={roleSpecificData.clinicName || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange('roleSpecific.clinicName', e.target.value)
    //                                     }
    //                                     placeholder="Enter clinic name"
    //                                     data-oid="3t1r.8-"
    //                                 />
    //                             </div>
    //                             <div data-oid="3l0h4_k">
    //                                 <Label htmlFor="clinicAddress" data-oid="2n9k4p8">
    //                                     Clinic Address
    //                                 </Label>
    //                                 <Input
    //                                     id="clinicAddress"
    //                                     value={roleSpecificData.clinicAddress || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange('roleSpecific.clinicAddress', e.target.value)
    //                                     }
    //                                     placeholder="Enter clinic address"
    //                                     data-oid="q905g6x"
    //                                 />
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             );
    //         case 'vendor':
    //             return (
    //                 <div className="space-y-6" data-oid="5.7i68u">
    //                     <div data-oid="6v6e:p_">
    //                         <h3
    //                             className="text-lg font-semibold text-gray-900 mb-4"
    //                             data-oid="i7l3n8m"
    //                         >
    //                             Vendor Information
    //                         </h3>
    //                         <div
    //                             className="grid grid-cols-1 md:grid-cols-2 gap-4"
    //                             data-oid="s1w8j3f"
    //                         >
    //                             <div data-oid="f7t98q1">
    //                                 <Label htmlFor="companyName" data-oid="g_28r2g">
    //                                     Company Name *
    //                                 </Label>
    //                                 <Input
    //                                     id="companyName"
    //                                     value={roleSpecificData.companyName || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange('roleSpecific.companyName', e.target.value)
    //                                     }
    //                                     placeholder="Enter company name"
    //                                     data-oid="4g4p-wz"
    //                                 />
    //                             </div>
    //                             <div data-oid="d:d21g3">
    //                                 <Label htmlFor="businessLicense" data-oid="t65v64b">
    //                                     Business License Number *
    //                                 </Label>
    //                                 <Input
    //                                     id="businessLicense"
    //                                     value={roleSpecificData.businessLicense || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange('roleSpecific.businessLicense', e.target.value)
    //                                     }
    //                                     placeholder="Enter license number"
    //                                     data-oid="z3.n9-h"
    //                                 />
    //                             </div>
    //                             <div data-oid="4k5j8v0">
    //                                 <Label htmlFor="supplierType" data-oid="n4_s54.">
    //                                     Supplier Type
    //                                 </Label>
    //                                 <Select
    //                                     value={roleSpecificData.supplierType || ''}
    //                                     onValueChange={(value) =>
    //                                         handleInputChange('roleSpecific.supplierType', value)
    //                                     }
    //                                     data-oid="6h6z4g-"
    //                                 >
    //                                     <SelectTrigger data-oid="9s_8q7f">
    //                                         <SelectValue
    //                                             placeholder="Select a type"
    //                                             data-oid="p0.f9.q"
    //                                         />
    //                                     </SelectTrigger>
    //                                     <SelectContent data-oid="n0n8m8m">
    //                                         <SelectItem value="manufacturer" data-oid="v18c3-a">
    //                                             Manufacturer
    //                                         </SelectItem>
    //                                         <SelectItem value="distributor" data-oid="f4w-89o">
    //                                             Distributor
    //                                         </SelectItem>
    //                                         <SelectItem value="wholesaler" data-oid="z7n5o6b">
    //                                             Wholesaler
    //                                         </SelectItem>
    //                                     </SelectContent>
    //                                 </Select>
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <div data-oid="j7g9r4l">
    //                         <h3
    //                             className="text-lg font-semibold text-gray-900 mb-4"
    //                             data-oid="k1t9n5b"
    //                         >
    //                             Product Categories
    //                         </h3>
    //                         <Textarea
    //                             value={roleSpecificData.productCategories?.join(', ') || ''}
    //                             onChange={(e) =>
    //                                 handleInputChange(
    //                                     'roleSpecific.productCategories',
    //                                     e.target.value.split(', ').filter((item) => item.trim()),
    //                                 )
    //                             }
    //                             placeholder="Enter categories separated by commas (e.g., Medical Equipment, Pharmaceuticals)"
    //                             rows={3}
    //                             data-oid="s8z0q6n"
    //                         />
    //                     </div>
    //                 </div>
    //             );
    //         case 'staff':
    //             return (
    //                 <div className="space-y-6" data-oid="2h0x3u7">
    //                     <div data-oid="p9j4z6c">
    //                         <h3
    //                             className="text-lg font-semibold text-gray-900 mb-4"
    //                             data-oid="n3r9l2d"
    //                         >
    //                             Staff Information
    //                         </h3>
    //                         <div
    //                             className="grid grid-cols-1 md:grid-cols-2 gap-4"
    //                             data-oid="a1x5s3w"
    //                         >
    //                             <div data-oid="r9p0m1a">
    //                                 <Label htmlFor="department" data-oid="o2t8f7e">
    //                                     Department
    //                                 </Label>
    //                                 <Input
    //                                     id="department"
    //                                     value={roleSpecificData.department || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange('roleSpecific.department', e.target.value)
    //                                     }
    //                                     placeholder="e.g., Customer Support, Marketing"
    //                                     data-oid="u2i4p0l"
    //                                 />
    //                             </div>
    //                             <div data-oid="k0v9s3f">
    //                                 <Label htmlFor="position" data-oid="x1j2d4c">
    //                                     Position
    //                                 </Label>
    //                                 <Input
    //                                     id="position"
    //                                     value={roleSpecificData.position || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange('roleSpecific.position', e.target.value)
    //                                     }
    //                                     placeholder="e.g., Representative, Manager"
    //                                     data-oid="b5e8g1h"
    //                                 />
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <div data-oid="m9n0h8p">
    //                         <h3
    //                             className="text-lg font-semibold text-gray-900 mb-4"
    //                             data-oid="s7c2x5f"
    //                         >
    //                             Permissions
    //                         </h3>
    //                         <Textarea
    //                             value={roleSpecificData.permissions?.join(', ') || ''}
    //                             onChange={(e) =>
    //                                 handleInputChange(
    //                                     'roleSpecific.permissions',
    //                                     e.target.value.split(', ').filter((item) => item.trim()),
    //                                 )
    //                             }
    //                             placeholder="Enter permissions separated by commas (e.g., manage_users, view_reports)"
    //                             rows={3}
    //                             data-oid="q2w5z7n"
    //                         />
    //                     </div>
    //                 </div>
    //             );
    //         case 'prescription-reader':
    //             return (
    //                 <div className="space-y-6" data-oid="2exo:_e">
    //                     <div data-oid="8tc08ei">
    //                         <h3
    //                             className="text-lg font-semibold text-gray-900 mb-4"
    //                             data-oid="gyfnckq"
    //                         >
    //                             Prescription Reader Information
    //                         </h3>
    //                         <div
    //                             className="grid grid-cols-1 md:grid-cols-2 gap-4"
    //                             data-oid=".l_f6og"
    //                         >
    //                             <div data-oid="fv0_zc7">
    //                                 <Label htmlFor="experienceLevel" data-oid="ump5sol">
    //                                     Experience Level *
    //                                 </Label>
    //                                 <Select
    //                                     value={
    //                                         accountData.roleSpecificData.experienceLevel ||
    //                                         'select-level'
    //                                     }
    //                                     onValueChange={(value) =>
    //                                         handleInputChange(
    //                                             'roleSpecific.experienceLevel',
    //                                             value === 'select-level' ? '' : value,
    //                                         )
    //                                     }
    //                                     data-oid="5_yp::d"
    //                                 >
    //                                     <SelectTrigger data-oid="uck:fi5">
    //                                         <SelectValue
    //                                             placeholder="Select experience level"
    //                                             data-oid="jmlmpqv"
    //                                         />
    //                                     </SelectTrigger>
    //                                     <SelectContent data-oid="kj2ire5">
    //                                         <SelectItem value="select-level" data-oid="1pxihft">
    //                                             Select Level
    //                                         </SelectItem>
    //                                         <SelectItem value="junior" data-oid="y4:9w1f">
    //                                             Junior (0-2 years)
    //                                         </SelectItem>
    //                                         <SelectItem value="senior" data-oid="ie7l9qe">
    //                                             Senior (2-5 years)
    //                                         </SelectItem>
    //                                         <SelectItem value="expert" data-oid="dd.u9ew">
    //                                             Expert (5+ years)
    //                                         </SelectItem>
    //                                     </SelectContent>
    //                                 </Select>
    //                             </div>
    //                             <div data-oid="34fzx0c">
    //                                 <Label htmlFor="shiftStartTime" data-oid="hxsgb2u">
    //                                     Shift Start Time
    //                                 </Label>
    //                                 <Input
    //                                     id="shiftStartTime"
    //                                     type="time"
    //                                     value={accountData.roleSpecificData.shiftStartTime || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange(
    //                                             'roleSpecific.shiftStartTime',
    //                                             e.target.value,
    //                                         )
    //                                     }
    //                                     data-oid="fb.lwgx"
    //                                 />
    //                             </div>
    //                             <div data-oid="4k2.rz6">
    //                                 <Label htmlFor="shiftEndTime" data-oid="t70b5oa">
    //                                     Shift End Time
    //                                 </Label>
    //                                 <Input
    //                                     id="shiftEndTime"
    //                                     type="time"
    //                                     value={accountData.roleSpecificData.shiftEndTime || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange(
    //                                             'roleSpecific.shiftEndTime',
    //                                             e.target.value,
    //                                         )
    //                                     }
    //                                     data-oid="63abaol"
    //                                 />
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <div data-oid="3r7a04d">
    //                         <h3
    //                             className="text-lg font-semibold text-gray-900 mb-4"
    //                             data-oid="eckmfms"
    //                         >
    //                             Languages & Certifications
    //                         </h3>
    //                         <div className="space-y-4" data-oid="z3i5.dn">
    //                             <div data-oid="_s_s18b">
    //                                 <Label htmlFor="languagesSpoken" data-oid="4oiyxy3">
    //                                     Languages Spoken
    //                                 </Label>
    //                                 <Textarea
    //                                     id="languagesSpoken"
    //                                     value={
    //                                         accountData.roleSpecificData.languagesSpoken?.join(
    //                                             ', ',
    //                                         ) || ''
    //                                     }
    //                                     onChange={(e) =>
    //                                         handleInputChange(
    //                                             'roleSpecific.languagesSpoken',
    //                                             e.target.value
    //                                                 .split(', ')
    //                                                 .filter((item) => item.trim()),
    //                                         )
    //                                     }
    //                                     placeholder="Enter languages separated by commas (e.g., Arabic, English, French)"
    //                                     rows={2}
    //                                     data-oid="_19-3oa"
    //                                 />
    //                             </div>
    //                             <div data-oid="vq3pp58">
    //                                 <Label htmlFor="certifications" data-oid="6-32l2u">
    //                                     Certifications
    //                                 </Label>
    //                                 <Textarea
    //                                     id="certifications"
    //                                     value={
    //                                         accountData.roleSpecificData.certifications?.join(
    //                                             ', ',
    //                                         ) || ''
    //                                     }
    //                                     onChange={(e) =>
    //                                         handleInputChange(
    //                                             'roleSpecific.certifications',
    //                                             e.target.value
    //                                                 .split(', ')
    //                                                 .filter((item) => item.trim()),
    //                                         )
    //                                     }
    //                                     placeholder="Enter certifications separated by commas (e.g., Medical Terminology, Pharmacy Assistant)"
    //                                     rows={3}
    //                                     data-oid="07a_of3"
    //                                 />
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             );
    //         case 'database-input':
    //             return (
    //                 <div className="space-y-6" data-oid="v_up4df">
    //                     <div data-oid="xqki_jz">
    //                         <h3
    //                             className="text-lg font-semibold text-gray-900 mb-4"
    //                             data-oid="rwg6dy4"
    //                         >
    //                             Data Entry Specialist Information
    //                         </h3>
    //                         <div
    //                             className="grid grid-cols-1 md:grid-cols-2 gap-4"
    //                             data-oid="ez6lve2"
    //                         >
    //                             <div data-oid="vkg7wlq">
    //                                 <Label htmlFor="workingHoursStart" data-oid="ppuv_vi">
    //                                     Working Hours Start Time
    //                                 </Label>
    //                                 <Input
    //                                     id="workingHoursStart"
    //                                     type="time"
    //                                     value={accountData.roleSpecificData.workingHoursStart || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange(
    //                                             'roleSpecific.workingHoursStart',
    //                                             e.target.value,
    //                                         )
    //                                     }
    //                                     data-oid="tvrwkrd"
    //                                 />
    //                             </div>
    //                             <div data-oid="85:iew7">
    //                                 <Label htmlFor="workingHoursEnd" data-oid="7ku2obi">
    //                                     Working Hours End Time
    //                                 </Label>
    //                                 <Input
    //                                     id="workingHoursEnd"
    //                                     type="time"
    //                                     value={accountData.roleSpecificData.workingHoursEnd || ''}
    //                                     onChange={(e) =>
    //                                         handleInputChange(
    //                                             'roleSpecific.workingHoursEnd',
    //                                             e.target.value,
    //                                         )
    //                                     }
    //                                     data-oid="mfo8dl3"
    //                                 />
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <div data-oid="toqq:lj">
    //                         <h3
    //                             className="text-lg font-semibold text-gray-900 mb-4"
    //                             data-oid="ct303yn"
    //                         >
    //                             Specialized Categories
    //                         </h3>
    //                         <Textarea
    //                             value={
    //                                 accountData.roleSpecificData.specializedCategories?.join(
    //                                     ', ',
    //                                 ) || ''
    //                             }
    //                             onChange={(e) =>
    //                                 handleInputChange(
    //                                     'roleSpecific.specializedCategories',
    //                                     e.target.value.split(', ').filter((item) => item.trim()),
    //                                 )
    //                             }
    //                             placeholder="Enter specialized product categories separated by commas (e.g., Pharmaceuticals, Medical Devices, Supplements, Cosmetics)"
    //                             rows={3}
    //                             data-oid="6vfpcso"
    //                         />
    //                     </div>
    //                 </div>
    //             );
    //         case 'staff':
    //         default:
    //             return null;
    //     }
    // };


    // Complete Egyptian Governorates and Cities/Districts
    const egyptianLocations = {
        // Cairo Governorate
        Cairo: [
            'New Cairo',
            'Heliopolis',
            'Maadi',
            'Nasr City',
            'Zamalek',
            'Downtown Cairo',
            'Shubra',
            'Helwan',
            'Mokattam',
            'Ain Shams',
            'Shoubra El Kheima',
            'Rod El Farag',
            'Hadayek El Kobba',
            'Zeitoun',
            'Matariya',
            'Manshiyat Naser',
            'Sayeda Zeinab',
            'Old Cairo',
            'Fustat',
            'Masr El Qadima',
            'Dar El Salam',
            'Basatin',
            'Maasara',
            'Tora',
            'Tura',
            '15 May City',
            'Badr City',
            'Shorouk City',
            'Rehab City',
            'Madinaty',
            'Katameya',
            'Fifth Settlement',
            'First Settlement',
            'Third Settlement',
            'Tagamoa El Khames',
            'Tagamoa El Awal',
            'Tagamoa El Thaleth',
        ],

        // Giza Governorate
        Giza: [
            '6th of October City',
            'Sheikh Zayed',
            'Dokki',
            'Mohandessin',
            'Agouza',
            'Haram',
            'Faisal',
            'Imbaba',
            'Bulaq al-Dakrur',
            'Giza City',
            'Omraniya',
            'Warraq',
            'Kit Kat',
            'Sahel',
            'Munib',
            'Hawamdeya',
            'Badrasheen',
            'Saqqara',
            'Atfih',
            'Ayat',
            'Al-Bawaiti',
            'Abu Rawash',
            'Kerdasa',
            'Ausim',
            'Smart Village',
            'Dreamland',
            'Beverly Hills',
            'Allegria',
            'Palm Hills',
            'Zayed Dunes',
            'Hadaba Wosta',
            'Hadaba Olya',
        ],

        // Alexandria Governorate
        Alexandria: [
            'Montaza',
            'Miami',
            'Sidi Gaber',
            'Sporting',
            'Smouha',
            'Gleem',
            'Shatby',
            'Raml Station',
            'Kafr Abdo',
            'Agami',
            'Hannoville',
            'Bitash',
            'King Mariout',
            'Borg El Arab',
            'Amreya',
            'Dekheila',
            'Max',
            'Gomrok',
            'Anfushi',
            'Ras El Tin',
            'Karmouz',
            'Moharam Bek',
            'Azarita',
            'Bab Sharqi',
            'Cleopatra',
            'Stanley',
            'San Stefano',
            'Sidi Bishr',
            'Mandara',
            'Asafra',
            'Abuqir',
            'Tabia',
            'Victoria',
            'Camp Shizar',
            'Louran',
            'Janaklis',
            'Borg El Arab New City',
        ],

        // Ismailia Governorate - Complete List
        Ismailia: [
            'Ismailia City',
            'Fayed',
            'Qantarah Sharq',
            'Qantarah Gharb',
            'Abu Sultan',
            'Kasaseen',
            'Tel El Kebir',
            'Abu Swier',
            'Nefesha',
            'Serapeum',
            'Geneifa',
            'Fanara',
            'Deversoir',
            'Kabrit',
            'Shallufa',
            'Abu Atwa',
            'Sarabium',
            'Mahsama',
            'Nefisha',
            'Qassasin',
            'Abu Hammad',
            'Ismailiya El Gedida',
            'Sheikh Zayed (Ismailia)',
            'El Tal El Kebir',
            'El Qantara El Sharqiya',
            'El Qantara El Gharbiya',
            'Abu Sultan El Gedida',
            'Fayed El Gedida',
            'Industrial Zone',
            'Port Said Road',
            'Cairo-Ismailia Road',
            'Suez Canal University Area',
            'Military Colleges Area',
            'Lake Timsah Area',
            'Bitter Lakes Area',
        ],

        // Qalyubia Governorate
        Qalyubia: [
            'Shubra al-Khaymah',
            'Qaha',
            'Banha',
            'Shibin al-Qanater',
            'Tukh',
            'Kafr Shukr',
            'Khosous',
            'Obour City',
            'Qalyub',
            'Khanka',
            'Quesna',
            'Benha El Asal',
            'Mit Nama',
            'Kafr Shukr',
            'Toukh',
            'El Khanka',
            'El Qanater El Khairiya',
            'Mostorod',
            'El Khosous',
            'Shubra El Kheima',
            'El Obour',
            'New Obour',
            'Industrial Obour',
        ],

        // Port Said Governorate
        'Port Said': [
            'Port Said City',
            'Port Fouad',
            'Al-Sharq District',
            'Al-Manakh District',
            'Al-Arab District',
            'Al-Zohour District',
            'Al-Ganoub District',
            'Al-Dawahy District',
            'Port Said El Gedida',
            'Free Zone',
            'Container Terminal',
            'East Port Said',
            'West Port Said',
        ],

        // Suez Governorate
        Suez: [
            'Suez City',
            'Al-Arbaeen',
            'Ataqah',
            'Faisal District',
            'Al-Ganayen District',
            'Suez El Gedida',
            'Ain Sokhna',
            'Adabiya',
            'Petroleum City',
            'Industrial Zone',
            'Port Tawfiq',
            'Ganayen',
            'Arbaeen',
            'Suez Canal Area',
        ],

        // Luxor Governorate
        Luxor: [
            'Luxor City',
            'Karnak',
            'West Bank',
            'Armant',
            'Esna',
            'Al-Qurna',
            'East Bank',
            'Luxor El Gedida',
            'Al-Bayadiya',
            'Al-Zeiniya',
            'Tod',
            'Al-Uqsur',
            'Valley of the Kings',
            'Valley of the Queens',
            'Deir el-Medina',
            'Medinet Habu',
            'Ramesseum',
            'Colossi of Memnon',
        ],

        // Aswan Governorate
        Aswan: [
            'Aswan City',
            'Kom Ombo',
            'Edfu',
            'Daraw',
            'Abu Simbel',
            'Philae',
            'Aswan El Gedida',
            'Nasr El Nuba',
            'Kalabsha',
            'Elephantine Island',
            'Kitchener Island',
            'Seheil Island',
            'High Dam',
            'Old Dam',
            'Shellal',
            'Basma',
            'Sahary',
            'Gharby Aswan',
        ],

        // Asyut Governorate
        Asyut: [
            'Asyut City',
            'Dayrut',
            'Qusiya',
            'Manfalut',
            'Abnoub',
            'Al-Badari',
            'Asyut El Gedida',
            'Sahel Seleem',
            'Al-Fath',
            'Abnub',
            'Al-Ghanayem',
            'Sidfa',
            'Al-Qusiya',
            'Dairut',
            'Manfalut',
            'Abu Tig',
            'Sahel Selim',
            'Al-Badari',
        ],

        // Beheira Governorate
        Beheira: [
            'Damanhur',
            'Kafr al-Dawwar',
            'Rashid',
            'Idku',
            'Abu al-Matamir',
            'Delengat',
            'Rosetta',
            'Edko',
            'Abu Hummus',
            'Hosh Issa',
            'Shubrakhit',
            'Kom Hamada',
            'Badr',
            'Wadi El Natrun',
            'El Mahmudiyah',
            'Kafr El Dawar',
            'Abu El Matamir',
            'Rashid (Rosetta)',
            'Edko',
            'El Delengat',
        ],

        // Beni Suef Governorate
        'Beni Suef': [
            'Beni Suef City',
            'Al-Wasta',
            'Nasser',
            'Ihnasya',
            'Biba',
            'Fashn',
            'Beni Suef El Gedida',
            'Sumusta El Waqf',
            'El Lahun',
            'El Wasta',
            'Ehnasia',
            'Fashn',
            'Biba',
            'Nasser',
            'Sumusta',
        ],

        // Dakahlia Governorate
        Dakahlia: [
            'Mansoura',
            'Talkha',
            'Dekernes',
            'Aga',
            'Minyat al-Nasr',
            'Sinbillawain',
            'Mit Ghamr',
            'Belqas',
            'Sherbin',
            'Matariya',
            'Temay El Amdid',
            'Nabaroh',
            'El Manzala',
            'Gamasa',
            'El Mansoura El Gedida',
            'Mit Ghamr',
            'Belqas',
            'Sherbin',
            'El Matariya',
            'Temay El Amdid',
        ],

        // Damietta Governorate
        Damietta: [
            'Damietta City',
            'New Damietta',
            'Kafr Saad',
            'Faraskur',
            'Zarqa',
            'Damietta El Gedida',
            'Ras El Bar',
            'Ezbet El Borg',
            'Kafr El Batikh',
            'El Zarqa',
            'Faraskour',
            'Kafr Saad',
        ],

        // Fayyum Governorate
        Fayyum: [
            'Fayyum City',
            'Tamiya',
            'Snuris',
            'Itsa',
            'Yusuf al-Siddiq',
            'Abshway',
            'Fayyum El Gedida',
            'Sinnuris',
            'Etsa',
            'Youssef El Seddik',
            'Abshway',
            'Tamiya',
            'Qasr Qarun',
            'Tunis Village',
            'Wadi El Rayan',
        ],

        // Gharbia Governorate
        Gharbia: [
            'Tanta',
            'Al-Mahalla al-Kubra',
            'Kafr al-Zayat',
            'Zifta',
            'Samannud',
            'Qutour',
            'Bassioun',
            'El Santa',
            'Kafr El Zayat',
            'Zefta',
            'Samanoud',
            'Qotour',
            'Basyoun',
            'El Mahalla El Kubra',
            'Tanta El Gedida',
        ],

        // Kafr al-Sheikh Governorate
        'Kafr al-Sheikh': [
            'Kafr al-Sheikh City',
            'Desouk',
            'Fuwwah',
            'Metoubes',
            'Qallin',
            'Sidi Salem',
            'Baltim',
            'Hamoul',
            'Biyala',
            'Riyadh',
            'Kafr El Sheikh El Gedida',
            'Desouk',
            'Fouh',
            'Metoubes',
            'Qellin',
            'Sidi Salem',
            'Baltim',
            'Hamoul',
            'Biyala',
            'El Riad',
        ],

        // Matrouh Governorate
        Matrouh: [
            'Marsa Matrouh',
            'Al-Alamein',
            'Dabaa',
            'Sallum',
            'Siwa Oasis',
            'Barani',
            'El Alamein El Gedida',
            'El Dabaa',
            'Sallum',
            'Siwa',
            'Barani',
            'Ras El Hekma',
            'Marina',
            'Hacienda',
            'North Coast',
            'Sidi Abdel Rahman',
        ],

        // Minya Governorate
        Minya: [
            'Minya City',
            'Mallawi',
            'Samalut',
            'Matay',
            'Bani Mazar',
            'Abu Qurqas',
            'Minya El Gedida',
            'Maghagha',
            'Derr Mawas',
            'Adwa',
            'El Edwa',
            'Malawi',
            'Samalout',
            'Matay',
            'Beni Mazar',
            'Abu Qorqas',
            'Maghagha',
            'Deir Mawas',
        ],

        // Monufia Governorate
        Monufia: [
            'Shibin al-Kom',
            'Menouf',
            'Sadat City',
            'Ashmoun',
            'Al-Bagour',
            'Tala',
            'Quesna',
            'Berket El Sabaa',
            'Shibin El Kom',
            'Menouf',
            'Sadat City',
            'Ashmoun',
            'El Bagour',
            'Tala',
            'Quesna',
            'Berket El Sabaa',
            'Sers El Lyan',
        ],

        // New Valley Governorate
        'New Valley': [
            'Kharga',
            'Dakhla',
            'Farafra',
            'Balat',
            'Mut',
            'Paris Oasis',
            'El Kharga',
            'El Dakhla',
            'El Farafra',
            'Balat',
            'Mut',
            'Baris',
            'Qasr El Dakhla',
            'Qasr El Farafra',
        ],

        // North Sinai Governorate
        'North Sinai': [
            'Arish',
            'Sheikh Zuweid',
            'Rafah',
            'Bir al-Abd',
            'Hasana',
            'Nekhel',
            'El Arish',
            'Sheikh Zoweid',
            'Rafah',
            'Bir El Abd',
            'Hasana',
            'Nakhl',
            'Rumana',
            'El Qantara Sharq',
        ],

        // Qena Governorate
        Qena: [
            'Qena City',
            'Nag Hammadi',
            'Qus',
            'Dishna',
            'Abu Tesht',
            'Farshut',
            'Qena El Gedida',
            'Naqada',
            'El Waqf',
            'Qeft',
            'Nag Hammadi',
            'Qous',
            'Dishna',
            'Abu Tesht',
            'Farshout',
            'Naqada',
            'El Waqf',
            'Qeft',
        ],

        // Red Sea Governorate
        'Red Sea': [
            'Hurghada',
            'Safaga',
            'Quseer',
            'Marsa Alam',
            'Shalatin',
            'Berenice',
            'El Gouna',
            'Soma Bay',
            'Makadi Bay',
            'Sahl Hasheesh',
            'Ras Ghareb',
            'Halaib',
            'Abu Ramad',
            'Sharm El Naga',
            'Port Ghalib',
            'Wadi El Gemal',
            'Hamata',
        ],

        // Sharqia Governorate
        Sharqia: [
            'Zagazig',
            'Bilbeis',
            'Al-Qurayn',
            'Abu Kabir',
            'Faqous',
            'Kafr Saqr',
            'Minya El Qamh',
            'Hehya',
            'Abu Hammad',
            'Diarb Negm',
            'Mashtoul El Souk',
            'El Huseiniya',
            'Awlad Saqr',
            'El Ibrahimiya',
            'Zagazig El Gedida',
            'Belbeis',
            'El Qrain',
            'Abu Kabir',
            'Faqous',
            'Kafr Saqr',
            'Minya El Qamh',
            'Hehia',
            'Abu Hammad',
            'Diarb Negm',
        ],

        // Sohag Governorate
        Sohag: [
            'Sohag City',
            'Akhmim',
            'Girga',
            'Balyana',
            'Al-Maraghah',
            'Juhaynah',
            'Sohag El Gedida',
            'Tahta',
            "El Monsha'a",
            'Dar El Salam',
            'Sakolta',
            'El Usairat',
            'Akhmeem',
            'Gerga',
            'Balyana',
            'El Maragha',
            'Gohaina',
            'Tahta',
            'El Monshaa',
            'Dar El Salam',
            'Sakolta',
        ],

        // South Sinai Governorate
        'South Sinai': [
            'Sharm al-Sheikh',
            'Dahab',
            'Nuweiba',
            'Taba',
            'Saint Catherine',
            'Ras Sidr',
            'Tor',
            'Abu Rudeis',
            'Abu Zenima',
            'Ras Sudr',
            'El Tur',
            'Feiran',
            'Wadi Feiran',
            'Mount Sinai',
            'Nabq',
            'Ras Mohammed',
            'Sharks Bay',
            'Naama Bay',
            'Hadaba',
            'Ras Nasrani',
        ],
    };

    const getAvailableCities = () => {
        if (!accountData.governorate || accountData.governorate === 'select-governorate') {
            return [];
        }
        return egyptianLocations[accountData.governorate as keyof typeof egyptianLocations] || [];
    };

    const handleGovernorateChange = (value: string) => {
        handleInputChange('governorate', value === 'select-governorate' ? '' : value);
        // Reset city when governorate changes
        if (value !== accountData.governorate) {
            handleInputChange('city', '');
        }
    };

    const renderLocationStep = () => (
        <div className="space-y-8" data-oid="sxs63_i">
            <div data-oid="hu8_a2n">
                <h3
                    className="text-2xl font-bold text-cura-primary mb-2 flex items-center"
                    data-oid="o0ynphn"
                >
                    <MapPin className="w-6 h-6 mr-3" data-oid="sk9dqlk" />
                    Location Information
                </h3>
                <p className="text-cura-secondary/80 mb-6" data-oid="lvk9nud">
                    Specify the geographical location for service delivery and operations
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid=".9p1wlb">
                    <div data-oid="mj44o_r">
                        <Label htmlFor="governorate" data-oid="m58nsss">
                            Governorate *
                        </Label>
                        <Select
                            value={accountData.governorate || 'select-governorate'}
                            onValueChange={handleGovernorateChange}
                            data-oid="5ytwm4_"
                        >
                            <SelectTrigger data-oid="3997_:j">
                                <SelectValue placeholder="Select governorate" data-oid="fq9jj2k" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto" data-oid="p3hhidt">
                                <SelectItem value="select-governorate" data-oid="d3t0u1j">
                                    Select Governorate
                                </SelectItem>
                                {Object.keys(egyptianLocations)
                                    .sort()
                                    .map((governorate) => (
                                        <SelectItem
                                            key={governorate}
                                            value={governorate}
                                            data-oid="omj6ia7"
                                        >
                                            {governorate}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div data-oid=".bknlxp">
                        <Label htmlFor="city" data-oid="5-8tg_6">
                            City/District *
                        </Label>
                        <Select
                            value={accountData.city || 'select-city'}
                            onValueChange={(value) =>
                                handleInputChange('city', value === 'select-city' ? '' : value)
                            }
                            disabled={
                                !accountData.governorate ||
                                accountData.governorate === 'select-governorate'
                            }
                            data-oid="up_uk-z"
                        >
                            <SelectTrigger data-oid="3f82p9m">
                                <SelectValue
                                    placeholder={
                                        !accountData.governorate ||
                                        accountData.governorate === 'select-governorate'
                                            ? 'Select governorate first'
                                            : 'Select city/district'
                                    }
                                    data-oid="-che7eb"
                                />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto" data-oid="0laxqbt">
                                <SelectItem value="select-city" data-oid="crcg9.3">
                                    Select City/District
                                </SelectItem>
                                {getAvailableCities().map((city) => (
                                    <SelectItem key={city} value={city} data-oid="w:rmmew">
                                        {city}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="mt-4" data-oid="tisjuo:">
                    <Label htmlFor="address" data-oid=":ysbo3m">
                        Full Address *
                    </Label>
                    <Textarea
                        id="address"
                        value={accountData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter complete address including street name, building number, floor, apartment number, landmarks, etc."
                        rows={3}
                        data-oid="529qb61"
                    />

                    <p className="text-sm text-gray-500 mt-1" data-oid=":i6b:cb">
                        Example: 15 Tahrir Street, Building 7, Floor 3, Apt 12, Near Metro Station
                    </p>
                </div>
            </div>
        </div>
    );

    

    const renderAccountStatusStep = () => (
        <div className="space-y-8" data-oid="7puuu80">
            <div data-oid="hcdl7hb">
                <h3
                    className="text-2xl font-bold text-cura-primary mb-2 flex items-center"
                    data-oid="ldwm8n2"
                >
                    <CheckCircle className="w-6 h-6 mr-3" data-oid="sjd6jcw" />
                    Account Settings & Review
                </h3>
                <p className="text-cura-secondary/80 mb-6" data-oid=".8i1agi">
                    Review all information and configure final account settings
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="98ofcrs">
                    <div data-oid="im7yfeb">
                        <Label htmlFor="status" data-oid="0ywp:if">
                            Account Status
                        </Label>
                        <Select
                            value={accountData.status}
                            onValueChange={(value) => handleInputChange('status', value)}
                            data-oid="6ojskmb"
                        >
                            <SelectTrigger data-oid="5vwyx:0">
                                <SelectValue
                                    placeholder="Select account status"
                                    data-oid="m.eun:e"
                                />
                            </SelectTrigger>
                            <SelectContent data-oid=".g2kk9m">
                                <SelectItem value="pending" data-oid="iz5fysf">
                                    Pending Verification
                                </SelectItem>
                                <SelectItem value="active" data-oid="qrq6nw5">
                                    Active
                                </SelectItem>
                                <SelectItem value="suspended" data-oid="_gq-g4j">
                                    Suspended
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <div data-oid="1i15ay9">
                <h3
                    className="text-xl font-bold text-cura-primary mb-6 flex items-center"
                    data-oid="hrqcp0a"
                >
                    <Eye className="w-5 h-5 mr-3" data-oid="ksvlx1m" />
                    Account Summary
                </h3>
                <Card
                    className="border-cura-light/30 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"
                    data-oid="7z8ibi3"
                >
                    <CardContent className="p-6" data-oid="gi4ew0h">
                        <div className="space-y-3" data-oid="7bui4cn">
                            <div className="flex justify-between" data-oid="xvpb7bu">
                                <span className="text-gray-600" data-oid="w:34k1g">
                                    Name:
                                </span>
                                <span className="font-medium" data-oid="mslr9yc">
                                    {accountData.firstName} {accountData.lastName}
                                </span>
                            </div>
                            <div className="flex justify-between" data-oid="eu-0:ye">
                                <span className="text-gray-600" data-oid="1-b_st:">
                                    Email:
                                </span>
                                <span className="font-medium" data-oid="jzqb_66">
                                    {accountData.email}
                                </span>
                            </div>
                            <div className="flex justify-between" data-oid="t8qmqa4">
                                <span className="text-gray-600" data-oid="m66je0x">
                                    Phone:
                                </span>
                                <span className="font-medium" data-oid="p_zeevo">
                                    {accountData.phone}
                                </span>
                            </div>
                            <div className="flex justify-between" data-oid="4ru61mq">
                                <span className="text-gray-600" data-oid="tvtglv7">
                                    Account Type:
                                </span>
                                <span className="font-medium capitalize" data-oid="xooz7-9">
                                    {activeAccountType}
                                </span>
                            </div>
                            <div className="flex justify-between" data-oid="we-nt8o">
                                <span className="text-gray-600" data-oid="v4_nc2d">
                                    Location:
                                </span>
                                <span className="font-medium" data-oid="ig_oizg">
                                    {accountData.city}, {accountData.governorate}
                                </span>
                            </div>
                            <div className="flex justify-between" data-oid="45t65op">
                                <span className="text-gray-600" data-oid="_b9db7-">
                                    Status:
                                </span>
                                <Badge
                                    className={
                                        accountData.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : accountData.status === 'pending'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : 'bg-red-100 text-red-800'
                                    }
                                    data-oid="56_-aqw"
                                >
                                    {accountData.status}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const steps = [
        { id: 1, title: 'Personal Info', icon: <Users className="w-4 h-4" data-oid="pii:ucm" /> },
        { id: 2, title: 'Location', icon: <MapPin className="w-4 h-4" data-oid="yzm.oc6" /> },
        { id: 3, title: 'Role Details', icon: <FileText className="w-4 h-4" data-oid="yv1vf0c" /> },
        {
            id: 4,
            title: 'Review & Create',
            icon: <CheckCircle className="w-4 h-4" data-oid="o:ses5n" />,
        },
    ];

    return (
        <div className="space-y-6" data-oid="xkv67th">
            {/* Account Type Navigation */}
            <Card
                className="border-0 shadow-cura bg-gradient-to-br from-white to-cura-light/5"
                data-oid="y6r7e3d"
            >
                <CardHeader className="text-center pb-6" data-oid="inh95ch">
                    <div className="flex items-center justify-center mb-3" data-oid="26dlub:">
                        <div
                            className="w-10 h-10 rounded-lg bg-cura-gradient flex items-center justify-center shadow-cura"
                            data-oid="yl6cpk_"
                        >
                            <Users className="w-5 h-5 text-white" data-oid="npiz9jo" />
                        </div>
                    </div>
                    <CardTitle
                        className="text-2xl font-bold text-cura-primary mb-2"
                        data-oid="uw4c7l9"
                    >
                        Select Account Type
                    </CardTitle>
                    <CardDescription
                        className="text-sm text-cura-secondary/80 max-w-xl mx-auto"
                        data-oid="w9s.dsn"
                    >
                        Choose the type of account you want to create for the CURA platform.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6" data-oid="q99f72w">
                    <div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
                        data-oid="mni:gjk"
                    >
                        {accountTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => handleAccountTypeChange(type.id as any)}
                                className={`group relative p-4 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg transform hover:scale-105 ${
                                    activeAccountType === type.id
                                        ? `${type.borderColor} ${type.bgLight} shadow-lg scale-105`
                                        : 'border-gray-200/50 hover:border-cura-light/50 hover:bg-gradient-to-br hover:from-white hover:to-cura-light/5'
                                }`}
                                data-oid="1yk3zia"
                            >
                                {/* Background gradient overlay for active state */}
                                {activeAccountType === type.id && (
                                    <div
                                        className="absolute inset-0 bg-gradient-to-br from-cura-primary/5 to-cura-secondary/5 rounded-xl"
                                        data-oid="puvre71"
                                    ></div>
                                )}

                                <div className="relative z-10 text-center" data-oid="_rdoswd">
                                    <div
                                        className={`w-12 h-12 rounded-xl ${type.color} text-white flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-all duration-300 shadow-md ${type.hoverColor}`}
                                        data-oid="vllqew7"
                                    >
                                        <div className="scale-75" data-oid="753ds9c">
                                            {type.icon}
                                        </div>
                                    </div>
                                    <h3
                                        className={`font-bold mb-2 text-sm transition-colors duration-300 ${
                                            activeAccountType === type.id
                                                ? type.textColor
                                                : 'text-gray-900 group-hover:text-cura-primary'
                                        }`}
                                        data-oid="r9lw9rn"
                                    >
                                        {type.title}
                                    </h3>
                                    <p
                                        className="text-xs text-gray-600 mb-3 leading-tight"
                                        data-oid="i4mj-gy"
                                    >
                                        {type.description}
                                    </p>
                                    <div className="space-y-1" data-oid="qp6a.b-">
                                        {type.fields.slice(0, 2).map((field, index) => (
                                            <div
                                                key={index}
                                                className="text-xs text-gray-500 flex items-center justify-center"
                                                data-oid="t85hrj9"
                                            >
                                                <div
                                                    className={`w-2 h-2 rounded-full mr-1 ${
                                                        activeAccountType === type.id
                                                            ? 'bg-cura-primary'
                                                            : 'bg-green-500'
                                                    }`}
                                                    data-oid="r6wytx6"
                                                ></div>
                                                <span className="truncate" data-oid="obpgx.7">
                                                    {field}
                                                </span>
                                            </div>
                                        ))}
                                        {type.fields.length > 2 && (
                                            <div
                                                className={`text-xs font-medium transition-colors duration-300 ${
                                                    activeAccountType === type.id
                                                        ? type.textColor
                                                        : 'text-cura-accent group-hover:text-cura-primary'
                                                }`}
                                                data-oid="y.zqwol"
                                            >
                                                +{type.fields.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Step Progress */}
            <Card
                className="shadow-cura border-0 bg-gradient-to-r from-white via-cura-light/5 to-white backdrop-blur-sm"
                data-oid="zgu0c7-"
            >
                <CardContent className="p-8" data-oid="s8aj9zx">
                    <div className="flex items-center justify-between" data-oid="tnw481s">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className="flex items-center flex-1"
                                data-oid="x1b9xl2"
                            >
                                <div className="flex flex-col items-center" data-oid="l5rdcd.">
                                    <div
                                        className={`flex items-center justify-center w-14 h-14 rounded-2xl border-3 transition-all duration-500 transform ${
                                            currentStep >= step.id
                                                ? 'border-cura-primary bg-cura-gradient text-white shadow-cura scale-110'
                                                : currentStep === step.id - 1
                                                  ? 'border-cura-light bg-cura-light/10 text-cura-accent scale-105'
                                                  : 'border-gray-300 bg-white text-gray-400'
                                        }`}
                                        data-oid="vw7a:t4"
                                    >
                                        {currentStep > step.id ? (
                                            <svg
                                                className="w-6 h-6"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                data-oid="4rj8n:6"
                                            >
                                                <path
                                                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                                                    data-oid="e_pd4sv"
                                                />
                                            </svg>
                                        ) : (
                                            step.icon
                                        )}
                                    </div>
                                    <div className="mt-4 text-center" data-oid="c5myufm">
                                        <div
                                            className={`text-sm font-bold transition-colors duration-300 ${
                                                currentStep >= step.id
                                                    ? 'text-cura-primary'
                                                    : currentStep === step.id - 1
                                                      ? 'text-cura-accent'
                                                      : 'text-gray-400'
                                            }`}
                                            data-oid="esp-29a"
                                        >
                                            Step {step.id}
                                        </div>
                                        <div
                                            className={`text-xs mt-1 font-medium transition-colors duration-300 ${
                                                currentStep >= step.id
                                                    ? 'text-cura-secondary'
                                                    : currentStep === step.id - 1
                                                      ? 'text-cura-light'
                                                      : 'text-gray-400'
                                            }`}
                                            data-oid="qoyhekj"
                                        >
                                            {step.title}
                                        </div>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="flex-1 mx-6" data-oid="_wgn.yh">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-700 ${
                                                currentStep > step.id
                                                    ? 'bg-cura-gradient shadow-cura'
                                                    : currentStep === step.id
                                                      ? 'bg-gradient-to-r from-cura-primary to-cura-light/50'
                                                      : 'bg-gray-200'
                                            }`}
                                            data-oid="8o9inr5"
                                        ></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Form Content */}
            <Card className="shadow-cura border-0 bg-white/80 backdrop-blur-sm" data-oid="9rx501y">
                <CardContent className="p-8" data-oid="psou45-">
                    {currentStep === 1 && renderPersonalInfoStep()}
                    {currentStep === 2 && renderLocationStep()}
                    {/* {currentStep === 3 && renderRoleSpecificStep()} */}
                    {currentStep === 4 && renderAccountStatusStep()}

                    {/* Navigation Buttons */}
                    <div
                        className="flex justify-between pt-8 mt-8 border-t border-cura-light/20"
                        data-oid="_3empte"
                    >
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                            disabled={currentStep === 1}
                            className="px-8 py-3 border-cura-light/50 text-cura-secondary hover:bg-cura-primary/10 hover:border-cura-primary hover:text-cura-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid="tkbk1rv"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                data-oid="_wald4d"
                            >
                                <path
                                    d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                                    data-oid="9js7ji0"
                                />
                            </svg>
                            Previous
                        </Button>

                        {currentStep < 4 ? (
                            <Button
                                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                                disabled={
                                    (currentStep === 1 &&
                                        (!accountData.firstName ||
                                            !accountData.lastName ||
                                            !accountData.email ||
                                            !accountData.password ||
                                            !accountData.phone)) ||
                                    (currentStep === 2 &&
                                        (!accountData.governorate ||
                                            !accountData.city ||
                                            !accountData.address))
                                }
                                className="px-8 py-3 bg-cura-gradient hover:shadow-cura transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                data-oid="k-ge8::"
                            >
                                Continue
                                <svg
                                    className="w-4 h-4 ml-2"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    data-oid="98a5-ws"
                                >
                                    <path
                                        d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z"
                                        data-oid="eq1rsez"
                                    />
                                </svg>
                            </Button>
                        ) : (
                            <Button
                                onClick={handleCreateAccount}
                                disabled={isCreating}
                                className="px-8 py-3 bg-gradient-to-r from-cura-primary to-cura-secondary hover:from-cura-secondary hover:to-cura-accent shadow-cura hover:shadow-cura-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                data-oid="3hq4itv"
                            >
                                {isCreating ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" data-oid="y81i8h5" />
                                        Create CURA Account
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
