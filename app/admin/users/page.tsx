'use client';

import { useState, useEffect } from 'react';
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
import axios from 'axios'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Download,
    Edit,
    Trash2,
    Eye,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Building,
    Stethoscope,
    Pill,
    Package,
    UserCheck,
    UserX,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { getAuthToken } from '@/lib/utils/cookies';

// Enhanced User Interface with comprehensive account information
interface User {
    id: string;
    // Personal Information
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    whatsappNumber?: string;
    nationalId?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female';

    // Location Information
    governorate: string;
    city: string;
    address: string;
    coordinates?: { lat: number; lng: number };

    // Account Information
    role:
        | 'customer'
        | 'pharmacy'
        | 'doctor'
        | 'vendor'
        | 'prescription-reader'
        | 'database-input'
        | 'admin';
    status: 'active' | 'inactive' | 'pending' | 'suspended' | 'banned';
    emailVerified: boolean;
    phoneVerified: boolean;
    profileComplete: boolean;

    // Authentication & Security
    lastLogin?: string;
    loginAttempts: number;
    passwordLastChanged?: string;
    twoFactorEnabled: boolean;

    // Role-Specific Information
    roleData: {
        // For Customers
        medicalHistory?: string[];
        allergies?: string[];
        emergencyContact?: { name: string; phone: string; relation: string };
        insuranceInfo?: { provider: string; policyNumber: string };

        // For Pharmacies
        businessName?: string;
        businessNameArabic?: string;
        licenseNumber?: string;
        operatingHours?: { open: string; close: string };
        commissionRate?: number;
        servicesOffered?: string[];
        phone?: string; // Keep for backward compatibility
        phone?: string[]; // New field for multiple phone numbers

        // For Doctors
        specialization?: string;
        clinicName?: string;
        clinicAddress?: string;
        referralCommission?: number;
        phone?: string; // Keep for backward compatibility
        phone?: string[]; // New field for multiple clinic phone numbers
        availableHours?: { day: string; start: string; end: string }[];

        // For Vendors
        companyName?: string;
        productCategories?: string[];
        supplierType?: 'manufacturer' | 'distributor' | 'wholesaler';
        phone?: string; // Keep for backward compatibility
        phone?: string[]; // New field for multiple vendor phone numbers

        // For Staff
        department?: string;
        position?: string;
        hireDate?: string;
        salary?: number;
        permissions?: string[];
    };

    // Performance Metrics
    metrics: {
        totalOrders?: number;
        totalRevenue?: number;
        rating?: number;
        reviewsCount?: number;
        completionRate?: number;
        responseTime?: number;
    };

    // Timestamps
    createdAt: string;
    updatedAt: string;
    lastActivity?: string;
}

interface UserStats {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    banned: number;
    byType: {
        customer: number;
        pharmacy: number;
        doctor: number;
        vendor: number;
        'prescription-reader': number;
        'database-input': number;
        admin: number;
    };
    verification: {
        emailVerified: number;
        phoneVerified: number;
        profileComplete: number;
    };
    newThisMonth: number;
    growth: number;
}

export default function UserAccountManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState('all');
  
    // Filters
    const [filters, setFilters] = useState({
      search: '',
      role: '',
      status: '',
      governorate: '',
      city: '',
      verified: '',
      dateRange: '',
    });
  
    // Form state for creating new users
    const [newUser, setNewUser] = useState<Partial<User>>({
      role: 'customer',
      // ... other new user fields from the Mongoose schema
    });
  
    useEffect(() => {
      loadUserData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);
  
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Make the actual API call to your backend endpoint
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth`);
        const fetchedUsers: User[] = response.data;
  
        // The new API endpoint returns all users, so we can now
        // perform filtering and stats calculation on the client side.
        let filteredUsers = fetchedUsers;
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredUsers = filteredUsers.filter(
            (user) =>
              user.name.toLowerCase().includes(searchTerm) ||
              user.email.toLowerCase().includes(searchTerm) ||
              user.phone.includes(searchTerm)
          );
        }
        if (filters.role) {
            console.log(filters.role, 'filter ')
          filteredUsers = filteredUsers.filter(
            (user) => user.role == filters.role
          );
        }
        if(filters.status){
            filteredUsers = filteredUsers.filter(
                (user) => user.status == filters.status
              );
        }
        // Add other filters as needed
  
        // Update the users state with the fetched and filtered data
        setUsers(filteredUsers);
  
        // Now, we can calculate stats based on the full fetched data, not the mock data
        const userStats: UserStats = {
          total: fetchedUsers.length,
          active: fetchedUsers.filter((u) => u.isActive).length,
          pending: fetchedUsers.filter((u) => !u.isActive).length, // Adjust as per your new schema's "pending" logic
          suspended: 0, // Not available in the new schema, so you'll have to adjust
          banned: 0, // Not available in the new schema, so you'll have to adjust
          byType: {
            customer: fetchedUsers.filter((u) => u.role == 'customer').length,
            pharmacy: fetchedUsers.filter((u) => u.role == 'pharmacy').length,
            doctor: fetchedUsers.filter((u) => u.role == 'doctor').length,
            vendor: fetchedUsers.filter((u) => u.role == 'vendor').length,
            'prescription-reader': fetchedUsers.filter(
              (u) => u.role == 'prescription-reader'
            ).length,
            'database-input': fetchedUsers.filter(
              (u) => u.role == 'database-input'
            ).length,
            admin: fetchedUsers.filter((u) => u.role == 'admin').length,
          },
          verification: {
            emailVerified: fetchedUsers.filter((u) => u.emailVerifiedAt).length, // Adjusted to new schema
            phoneVerified: fetchedUsers.filter((u) => u.phoneVerifiedAt).length, // Adjusted to new schema
            profileComplete: 0, // Not available in the new schema, so you'll have to adjust
          },
          newThisMonth: 0,
          growth: 0,
        };
  
        setStats(userStats);
      } catch (error) {
        console.error('Error loading user data:', error);
        // You can add an error state to display a message to the user
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleEditUser = async () => {
      // This function will need to be updated to make an API call to your backend
      // to update the user.
      try {
        if (!editingUser) return;
        const token = getAuthToken();
        // Example PUT request
        // await axios.put(`http://localhost:5000/users/${editingUser._id}`, editingUser);
        const updatingUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/edit`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body:JSON.stringify(editingUser)
        })
        const data = await updatingUser.json()
        if(data){
            console.log('Updating user:', editingUser);
            loadUserData()
        }
        // setUsers logic remains the same for optimistic UI updates
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id == editingUser._id ? editingUser : user))
        );
  
        // Close modal and reset
        setShowEditModal(false);
        setEditingUser(null);
        setSelectedUser(null);
  
        alert('User updated successfully!');
      } catch (error) {
        console.error('Error updating user:', error);
        alert('Error updating user. Please try again.');
      }
    };
  
    const handleCreateUser = async () => {
      // This function will also need to be updated to make a POST request to your backend
      // to create a new user.
      try {
        if (
          !newUser.name ||
          !newUser.email ||
          !newUser.phone ||
          !newUser.role
        ) {
          alert('Please fill in all required fields');
          return;
        }
        // Example POST request
        // await axios.post('http://localhost:5000/users', newUser);
        console.log('Creating user:', newUser);
  
        // Reset form and close modal
        setNewUser({
          role: 'customer',
        });
        setShowCreateModal(false);
  
        // Reload data to show the new user
        loadUserData();
        alert('User created successfully!');
      } catch (error) {
        console.error('Error creating user:', error);
        alert('Error creating user. Please try again.');
      }
    };
  
    const getroleIcon = (type: string) => {
      // Same as before
    };
  
    const getStatusColor = (status: boolean) => {
      // Adjust logic to use isActive boolean
      return status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    };
  
    const getStatusIcon = (status: boolean) => {
      // Adjust logic to use isActive boolean
      return status ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Clock className="w-4 h-4 text-yellow-600" />;
    };

    if (isLoading && !stats) {
        return (
            <div className="space-y-6" data-oid="t1.ncq6">
                <div
                    className="bg-white rounded-lg border border-gray-200 px-6 py-4"
                    data-oid="7.affef"
                >
                    <div className="animate-pulse" data-oid="g9e3d7m">
                        <div
                            className="h-8 bg-gray-200 rounded w-1/4 mb-2"
                            data-oid="uyfh-6z"
                        ></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2" data-oid="mhe2ijv"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="d8fdyan">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-200 animate-pulse rounded-xl h-32"
                            data-oid="lx9:jpr"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="ucrn.la">
            {/* User Type Distribution */}
            {stats && (
                <Card data-oid="f094ho.">
                    <CardHeader data-oid="t7y.cab">
                        <CardTitle data-oid="nn3w2o-">Account Distribution by User Type</CardTitle>
                        <CardDescription data-oid="pxx1_xd">
                            Overview of different user types across the platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent data-oid="ux_fyrb">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-oid="d:6mz:6">
                            {/* Customers Card */}
                            <div
                                className="bg-gradient-to-br from-cura-primary/5 to-cura-primary/10 rounded-xl border border-cura-primary/20 p-6 hover:shadow-lg hover:shadow-cura-primary/10 transition-all duration-200 hover:border-cura-primary/30"
                                data-oid="e313erq"
                            >
                                <div
                                    className="flex items-start justify-between mb-4"
                                    data-oid="tr25q7."
                                >
                                    <div
                                        className="text-sm font-medium text-cura-primary/80"
                                        data-oid="j0uh0mu"
                                    >
                                        Total Customers
                                    </div>
                                    <div
                                        className="p-2 bg-cura-primary/15 rounded-lg"
                                        data-oid="md44z89"
                                    >
                                        <Users
                                            className="w-5 h-5 text-cura-primary"
                                            data-oid="d::qj20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1" data-oid="6fblwhu">
                                    <div
                                        className="text-3xl font-bold text-cura-primary"
                                        data-oid="21ng1al"
                                    >
                                        {stats.byType.customer}
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid="5cglo_x">
                                        <div
                                            className="text-sm text-cura-primary font-medium"
                                            data-oid="jgyb1m9"
                                        >
                                            ↗ +
                                            {((stats.byType.customer / stats.total) * 100).toFixed(
                                                1,
                                            )}
                                            % from last month
                                        </div>
                                    </div>
                                    <div
                                        className="text-sm text-cura-primary/70"
                                        data-oid="yvljsl:"
                                    >
                                        {stats.byType.customer} active,{' '}
                                        {Math.floor(stats.byType.customer * 0.1)} new
                                    </div>
                                </div>
                            </div>

                            {/* Pharmacies Card */}
                            <div
                                className="bg-gradient-to-br from-cura-secondary/5 to-cura-secondary/10 rounded-xl border border-cura-secondary/20 p-6 hover:shadow-lg hover:shadow-cura-secondary/10 transition-all duration-200 hover:border-cura-secondary/30"
                                data-oid="txxyx3y"
                            >
                                <div
                                    className="flex items-start justify-between mb-4"
                                    data-oid="tqjldhi"
                                >
                                    <div
                                        className="text-sm font-medium text-cura-secondary/80"
                                        data-oid="5o_3kp7"
                                    >
                                        Total Pharmacies
                                    </div>
                                    <div
                                        className="p-2 bg-cura-secondary/15 rounded-lg"
                                        data-oid="ufn-fhh"
                                    >
                                        <Pill
                                            className="w-5 h-5 text-cura-secondary"
                                            data-oid="m1owj9u"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1" data-oid="y-3mjlm">
                                    <div
                                        className="text-3xl font-bold text-cura-secondary"
                                        data-oid="ge_w-yj"
                                    >
                                        {stats.byType.pharmacy}
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid="-kw-fvi">
                                        <div
                                            className="text-sm text-cura-secondary font-medium"
                                            data-oid="qv8bbl0"
                                        >
                                            ↗ +
                                            {((stats.byType.pharmacy / stats.total) * 100).toFixed(
                                                1,
                                            )}
                                            % from last month
                                        </div>
                                    </div>
                                    <div
                                        className="text-sm text-cura-secondary/70"
                                        data-oid="iwn33je"
                                    >
                                        {stats.byType.pharmacy} verified partners
                                    </div>
                                </div>
                            </div>

                            {/* Doctors Card */}
                            <div
                                className="bg-gradient-to-br from-cura-accent/5 to-cura-accent/10 rounded-xl border border-cura-accent/20 p-6 hover:shadow-lg hover:shadow-cura-accent/10 transition-all duration-200 hover:border-cura-accent/30"
                                data-oid="ue9f6ym"
                            >
                                <div
                                    className="flex items-start justify-between mb-4"
                                    data-oid="_r0-14y"
                                >
                                    <div
                                        className="text-sm font-medium text-cura-accent/80"
                                        data-oid="g9k0.uo"
                                    >
                                        Total Doctors
                                    </div>
                                    <div
                                        className="p-2 bg-cura-accent/15 rounded-lg"
                                        data-oid="tbiaxs8"
                                    >
                                        <Stethoscope
                                            className="w-5 h-5 text-cura-accent"
                                            data-oid="_l149tv"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1" data-oid="l5s.87t">
                                    <div
                                        className="text-3xl font-bold text-cura-accent"
                                        data-oid="tv6adth"
                                    >
                                        {stats.byType.doctor}
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid="uqwxykn">
                                        <div
                                            className="text-sm text-cura-accent font-medium"
                                            data-oid="v78.op:"
                                        >
                                            ↗ +
                                            {((stats.byType.doctor / stats.total) * 100).toFixed(1)}
                                            % from last month
                                        </div>
                                    </div>
                                    <div className="text-sm text-cura-accent/70" data-oid="wtax46i">
                                        {stats.byType.doctor} licensed professionals
                                    </div>
                                </div>
                            </div>

                            {/* Vendors Card */}
                            <div
                                className="bg-gradient-to-br from-cura-accent/8 to-cura-accent/15 rounded-xl border border-cura-accent/30 p-6 hover:shadow-lg hover:shadow-cura-accent/15 transition-all duration-200 hover:border-cura-accent/40"
                                data-oid="1n8owgm"
                            >
                                <div
                                    className="flex items-start justify-between mb-4"
                                    data-oid="xe3ev20"
                                >
                                    <div
                                        className="text-sm font-medium text-cura-accent"
                                        data-oid="uwc7x9e"
                                    >
                                        Total Vendors
                                    </div>
                                    <div
                                        className="p-2 bg-cura-accent/20 rounded-lg"
                                        data-oid="2:3s59u"
                                    >
                                        <Package
                                            className="w-5 h-5 text-cura-accent"
                                            data-oid="2o153ag"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1" data-oid="tdvfkph">
                                    <div
                                        className="text-3xl font-bold text-cura-accent"
                                        data-oid="k5pzmd7"
                                    >
                                        {stats.byType.vendor}
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid="_hljryx">
                                        <div
                                            className="text-sm text-cura-accent font-medium"
                                            data-oid="5lj9d43"
                                        >
                                            ↗ +
                                            {((stats.byType.vendor / stats.total) * 100).toFixed(1)}
                                            % from last month
                                        </div>
                                    </div>
                                    <div className="text-sm text-cura-accent/80" data-oid=".3gcgb9">
                                        {stats.byType.vendor} supply partners
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Users Table */}
            <Card data-oid="kngca0d">
                <CardHeader data-oid="jrdsr-f">
                    <CardTitle data-oid="w1m3fn.">All User Accounts</CardTitle>
                    <CardDescription data-oid="3xjw-wm">
                        Comprehensive list of all user accounts in the system
                    </CardDescription>
                </CardHeader>
                <CardContent data-oid="bc4y3:2">
                    <div className="space-y-4" data-oid="2b91926">
                        {/* Search and Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4" data-oid="6td:2-8">
                            <div className="md:col-span-2" data-oid="gmov1ev">
                                <div className="relative" data-oid="pv3s699">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                        data-oid="seh-cid"
                                    />

                                    <Input
                                        placeholder="Search by name, email, phone, or ID..."
                                        value={filters.search}
                                        onChange={(e) =>
                                            setFilters({ ...filters, search: e.target.value })
                                        }
                                        className="pl-10"
                                        data-oid="c6npxvj"
                                    />
                                </div>
                            </div>

                            <Select
                                value={filters.role || 'all-types'}
                                onValueChange={(value) =>
                                    setFilters({
                                        ...filters,
                                        role: value == 'all-types' ? '' : value,
                                    })
                                }
                                data-oid="67i636x"
                            >
                                <SelectTrigger data-oid="ye50mpz">
                                    <SelectValue placeholder="User Type" data-oid="jv5aaze" />
                                </SelectTrigger>
                                <SelectContent data-oid="l2ndd0d">
                                    <SelectItem value="all-types" data-oid="4vv0k_s">
                                        All Types
                                    </SelectItem>
                                    <SelectItem value="customer" data-oid="51f:ndy">
                                        Customer
                                    </SelectItem>
                                    <SelectItem value="pharmacy" data-oid="riexllg">
                                        Pharmacy
                                    </SelectItem>
                                    <SelectItem value="doctor" data-oid="n_h5atl">
                                        Doctor
                                    </SelectItem>
                                    <SelectItem value="vendor" data-oid=":f3hds9">
                                        Vendor
                                    </SelectItem>
                                    <SelectItem value="prescription-reader" data-oid="45g4hlr">
                                        Prescription Reader
                                    </SelectItem>
                                    <SelectItem value="database-input" data-oid="0tb0ilw">
                                        Database Input
                                    </SelectItem>
                                    <SelectItem value="admin" data-oid="r6_qjbr">
                                        Admin
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.status || 'all-statuses'}
                                onValueChange={(value) =>
                                    setFilters({
                                        ...filters,
                                        status: value == 'all-statuses' ? '' : value,
                                    })
                                }
                                data-oid="jy6amh9"
                            >
                                <SelectTrigger data-oid="0sab_gp">
                                    <SelectValue placeholder="Status" data-oid="1f7w6a5" />
                                </SelectTrigger>
                                <SelectContent data-oid="94_rn1j">
                                    <SelectItem value="all-statuses" data-oid="fi6-oga">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="active" data-oid="v:2d86y">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="pending" data-oid="nkz3:ac">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="suspended" data-oid="7jcinv-">
                                        Suspended
                                    </SelectItem>
                                    <SelectItem value="banned" data-oid="y0t68eh">
                                        Banned
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.governorate || 'all-governorates'}
                                onValueChange={(value) =>
                                    setFilters({
                                        ...filters,
                                        governorate: value == 'all-governorates' ? '' : value,
                                    })
                                }
                                data-oid=":y.r_ua"
                            >
                                <SelectTrigger data-oid="-rwiave">
                                    <SelectValue placeholder="Governorate" data-oid=":cbs5kb" />
                                </SelectTrigger>
                                <SelectContent
                                    className="max-h-60 overflow-y-auto"
                                    data-oid="23s_46h"
                                >
                                    <SelectItem value="all-governorates" data-oid="_ue0pgd">
                                        All Governorates
                                    </SelectItem>
                                    <SelectItem value="Cairo" data-oid="zec5m2k">
                                        Cairo
                                    </SelectItem>
                                    <SelectItem value="Giza" data-oid="ghw9uw1">
                                        Giza
                                    </SelectItem>
                                    <SelectItem value="Alexandria" data-oid="4-zl3vj">
                                        Alexandria
                                    </SelectItem>
                                    <SelectItem value="Ismailia" data-oid="2-o2myt">
                                        Ismailia
                                    </SelectItem>
                                    <SelectItem value="Dakahlia" data-oid="can8tzq">
                                        Dakahlia
                                    </SelectItem>
                                    <SelectItem value="Sharqia" data-oid=":f-tdwl">
                                        Sharqia
                                    </SelectItem>
                                    <SelectItem value="Qalyubia" data-oid="ts:i2cy">
                                        Qalyubia
                                    </SelectItem>
                                    <SelectItem value="Beheira" data-oid="lbylr3:">
                                        Beheira
                                    </SelectItem>
                                    <SelectItem value="Gharbia" data-oid="2jmbsa7">
                                        Gharbia
                                    </SelectItem>
                                    <SelectItem value="Kafr al-Sheikh" data-oid="9bfbi05">
                                        Kafr al-Sheikh
                                    </SelectItem>
                                    <SelectItem value="Damietta" data-oid="jcyxfeo">
                                        Damietta
                                    </SelectItem>
                                    <SelectItem value="Port Said" data-oid="r2aei-d">
                                        Port Said
                                    </SelectItem>
                                    <SelectItem value="Suez" data-oid="vfenodw">
                                        Suez
                                    </SelectItem>
                                    <SelectItem value="North Sinai" data-oid="px56_w4">
                                        North Sinai
                                    </SelectItem>
                                    <SelectItem value="South Sinai" data-oid="ktpoy3k">
                                        South Sinai
                                    </SelectItem>
                                    <SelectItem value="Red Sea" data-oid="nlxqg9f">
                                        Red Sea
                                    </SelectItem>
                                    <SelectItem value="Matrouh" data-oid="w-7jsqg">
                                        Matrouh
                                    </SelectItem>
                                    <SelectItem value="New Valley" data-oid="w613k:b">
                                        New Valley
                                    </SelectItem>
                                    <SelectItem value="Fayyum" data-oid="9atj_8r">
                                        Fayyum
                                    </SelectItem>
                                    <SelectItem value="Beni Suef" data-oid="aif08rx">
                                        Beni Suef
                                    </SelectItem>
                                    <SelectItem value="Minya" data-oid="i4vys11">
                                        Minya
                                    </SelectItem>
                                    <SelectItem value="Asyut" data-oid="yqziej5">
                                        Asyut
                                    </SelectItem>
                                    <SelectItem value="Sohag" data-oid=".ye_i59">
                                        Sohag
                                    </SelectItem>
                                    <SelectItem value="Qena" data-oid="t..tu9t">
                                        Qena
                                    </SelectItem>
                                    <SelectItem value="Luxor" data-oid="yrzgpc9">
                                        Luxor
                                    </SelectItem>
                                    <SelectItem value="Aswan" data-oid="r1:igm7">
                                        Aswan
                                    </SelectItem>
                                    <SelectItem value="Monufia" data-oid="nb_:5.r">
                                        Monufia
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                onClick={() =>
                                    setFilters({
                                        search: '',
                                        role: '',
                                        status: '',
                                        governorate: '',
                                        city: '',
                                        verified: '',
                                        dateRange: '',
                                    })
                                }
                                data-oid="r:5bmmg"
                            >
                                Clear Filters
                            </Button>
                        </div>

                        {/* Users Scrollable List */}
                        <div
                            className="h-screen overflow-y-auto border border-gray-200 rounded-lg"
                            data-oid="625l5pn"
                        >
                            <div className="space-y-2 p-4" data-oid="fmlrgfk">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="bg-white border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                        data-oid="g5qmnf4"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="l:1uzi3"
                                        >
                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid="x2ll698"
                                            >
                                                <div
                                                    className="w-12 h-12 bg-[#1F1F6F] text-white rounded-full flex items-center justify-center text-sm font-bold"
                                                    data-oid="uv8...h"
                                                >
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div data-oid="s3wc79p">
                                                    <div
                                                        className="font-medium text-gray-900"
                                                        data-oid="yvfa7gc"
                                                    >
                                                        {user.name}
                                                    </div>
                                                    <div
                                                        className="flex items-center space-x-4 text-sm text-gray-600"
                                                        data-oid="9wssjw:"
                                                    >
                                                        <div
                                                            className="flex items-center"
                                                            data-oid="hfpun.z"
                                                        >
                                                            <Mail
                                                                className="w-3 h-3 mr-1"
                                                                data-oid="iam23zh"
                                                            />

                                                            {user.email}
                                                        </div>
                                                        <div
                                                            className="flex items-center"
                                                            data-oid="a6ng-u8"
                                                        >
                                                            <Phone
                                                                className="w-3 h-3 mr-1"
                                                                data-oid="l9ialj3"
                                                            />

                                                            {user.phone}
                                                        </div>
                                                        {user.whatsappNumber && (
                                                            <div
                                                                className="flex items-center"
                                                                data-oid="mtre_-t"
                                                            >
                                                                <svg
                                                                    className="w-3 h-3 mr-1 text-green-600"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    data-oid="6w3ke98"
                                                                >
                                                                    <path
                                                                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386"
                                                                        data-oid="gznyt_j"
                                                                    />
                                                                </svg>
                                                                {user.whatsappNumber}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div
                                                        className="flex items-center space-x-4 text-xs text-gray-500 mt-1"
                                                        data-oid="cqp2l7t"
                                                    >
                                                        <div
                                                            className="flex items-center space-x-1"
                                                            data-oid="0dg.vv0"
                                                        >
                                                            {getroleIcon(user.role)}
                                                            <span
                                                                className="capitalize"
                                                                data-oid="i2-w82z"
                                                            >
                                                                {user.role}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="flex items-center"
                                                            data-oid="x_pbd:6"
                                                        >
                                                            <MapPin
                                                                className="w-3 h-3 mr-1"
                                                                data-oid="r38z60h"
                                                            />
                                                            {user.cityId}, {user.governorateId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className="flex items-center space-x-4"
                                                data-oid="fj0.vrd"
                                            >
                                                <div className="text-right" data-oid="d595tex">
                                                    <div
                                                        className="flex items-center space-x-2 mb-2"
                                                        data-oid="x1t_pz1"
                                                    >
                                                        {getStatusIcon(user?.status)}
                                                        <Badge
                                                            className={getStatusColor(user?.status)}
                                                            data-oid="1k0h1tx"
                                                        >
                                                            {user?.status}
                                                        </Badge>
                                                    </div>
                                                    <div
                                                        className="flex items-center space-x-3 text-xs"
                                                        data-oid="2cpp.1z"
                                                    >
                                                        <div
                                                            className="flex items-center space-x-1"
                                                            data-oid="4-anee0"
                                                        >
                                                            {user.emailVerified ? (
                                                                <CheckCircle
                                                                    className="w-3 h-3 text-green-600"
                                                                    data-oid="l79exl8"
                                                                />
                                                            ) : (
                                                                <XCircle
                                                                    className="w-3 h-3 text-red-600"
                                                                    data-oid="l-:-xp3"
                                                                />
                                                            )}
                                                            <span data-oid="xjctnkh">Email</span>
                                                        </div>
                                                        <div
                                                            className="flex items-center space-x-1"
                                                            data-oid="2d54lya"
                                                        >
                                                            {user.phoneVerified ? (
                                                                <CheckCircle
                                                                    className="w-3 h-3 text-green-600"
                                                                    data-oid="xy3.mzi"
                                                                />
                                                            ) : (
                                                                <XCircle
                                                                    className="w-3 h-3 text-red-600"
                                                                    data-oid="24w5399"
                                                                />
                                                            )}
                                                            <span data-oid="w3idnnl">Phone</span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="text-xs text-gray-500 mt-1"
                                                        data-oid="5id3j-8"
                                                    >
                                                        Last:{' '}
                                                        {user.lastActivity
                                                            ? new Date(
                                                                  user.lastActivity,
                                                              ).toLocaleDateString()
                                                            : 'Never'}
                                                    </div>
                                                </div>

                                                <div
                                                    className="flex flex-col space-y-2"
                                                    data-oid="sw3-xtn"
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowUserDetails(true);
                                                        }}
                                                        className="w-20"
                                                        data-oid="vwg3qp2"
                                                    >
                                                        <Eye
                                                            className="w-3 h-3 mr-1"
                                                            data-oid="9trtjag"
                                                        />
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            // Create a deep copy of the user for editing
                                                            const initialEditingUser = JSON.parse(
                                                                JSON.stringify(user),
                                                            );

                                                            // Ensure pharmacy phones and clinic phones are properly initialized
                                                            if (user.role == 'pharmacy') {
                                                                initialEditingUser.phone =
                                                                    user.phone ||
                                                                    (user.phone
                                                                        ? [
                                                                              user.roleData
                                                                                  .phone,
                                                                          ]
                                                                        : ['']);
                                                            }

                                                            if (user.role == 'doctor') {
                                                                initialEditingUser.phone =
                                                                    user.phone ||
                                                                    (user.phone
                                                                        ? [
                                                                              user.roleData
                                                                                  .phone,
                                                                          ]
                                                                        : ['']);
                                                            }

                                                            if (user.role == 'vendor') {
                                                                initialEditingUser.phone =
                                                                    user.phone ||
                                                                    (user.phone
                                                                        ? [
                                                                              user.roleData
                                                                                  .phone,
                                                                          ]
                                                                        : ['']);
                                                            }

                                                            setEditingUser(initialEditingUser);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="w-20"
                                                        data-oid="a714loy"
                                                    >
                                                        <Edit
                                                            className="w-3 h-3 mr-1"
                                                            data-oid="vj1roy6"
                                                        />
                                                        Edit
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Role-specific information */}
                                        {(user.specialization ||
                                            user.businessName ||
                                            user.companyName) && (
                                            <div
                                                className="mt-3 pt-3 border-t border-gray-100"
                                                data-oid="gbpc_.8"
                                            >
                                                <div
                                                    className="text-xs text-gray-600"
                                                    data-oid="oryrxzv"
                                                >
                                                    {user.specialization && (
                                                        <span
                                                            className="bg-purple-100 text-purple-800 px-2 py-1 rounded mr-2"
                                                            data-oid="44eocpv"
                                                        >
                                                            {user.specialization}
                                                        </span>
                                                    )}
                                                    {user.businessName && (
                                                        <span
                                                            className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2"
                                                            data-oid="55vyf1e"
                                                        >
                                                            {user.businessName}
                                                        </span>
                                                    )}
                                                    {user.companyName && (
                                                        <span
                                                            className="bg-orange-100 text-orange-800 px-2 py-1 rounded mr-2"
                                                            data-oid="lqqcuxk"
                                                        >
                                                            {user.companyName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit User Modal */}
            <Dialog
                open={showEditModal}
                onOpenChange={(open) => {
                    setShowEditModal(open);
                    if (!open) {
                        setEditingUser(null);
                        setSelectedUser(null);
                    }
                }}
                data-oid=":k39-9o"
            >
                <DialogContent
                    className="max-w-4xl max-h-[90vh] overflow-y-auto"
                    data-oid="zb527u6"
                >
                    <DialogHeader data-oid="rboyx0s">
                        <DialogTitle data-oid="q6_a53f">Edit User Account</DialogTitle>
                        <DialogDescription data-oid="f5:_o02">
                            Update user information and account settings
                        </DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <Tabs defaultValue="personal" className="w-full" data-oid="gxitv8m">
                            <TabsList className="grid w-full grid-cols-4" data-oid="qn61me7">
                                <TabsTrigger value="personal" data-oid="_89wua0">
                                    Personal Info
                                </TabsTrigger>
                                <TabsTrigger value="location" data-oid="wg80yqr">
                                    Location
                                </TabsTrigger>
                                <TabsTrigger value="role" data-oid="quhsy5y">
                                    Role Details
                                </TabsTrigger>
                                <TabsTrigger value="account" data-oid="f2p0-3l">
                                    Account Settings
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal" className="space-y-4" data-oid=".ihwb6q">
                                <div className="grid grid-cols-2 gap-4" data-oid="dp-k_eg">
                                    <div data-oid="sevb9c3">
                                        <Label htmlFor="edit-firstName" data-oid="w788h4i">
                                            Name *
                                        </Label>
                                        <Input
                                            id="edit-firstName"
                                            value={editingUser?.name ?? ''}
                                            onChange={(e) =>
                                                setEditingUser((prev) =>
                                                    prev
                                                        ? { ...prev, name: e.target.value }
                                                        : {
                                                              ...selectedUser,
                                                              name: e.target.value,
                                                          },
                                                )
                                            }
                                            placeholder="Enter first name"
                                            data-oid="e46bdlk"
                                        />
                                    </div>
                                    
                                    <div data-oid="swqf9.:">
                                        <Label htmlFor="edit-email" data-oid="t.aanq7">
                                            Email Address *
                                        </Label>
                                        <Input
                                            id="edit-email"
                                            type="email"
                                            value={editingUser?.email ?? ''}
                                            onChange={(e) =>
                                                setEditingUser((prev) =>
                                                    prev
                                                        ? { ...prev, email: e.target.value }
                                                        : {
                                                              ...selectedUser,
                                                              email: e.target.value,
                                                          },
                                                )
                                            }
                                            placeholder="Enter email address"
                                            data-oid="mjhueyi"
                                        />
                                    </div>
                                    <div data-oid="niig5od">
                                        <Label htmlFor="edit-phone" data-oid="0l2ghtk">
                                            Phone Number *
                                        </Label>
                                        <Input
                                            id="edit-phone"
                                            value={editingUser?.phone ?? ''}
                                            onChange={(e) =>
                                                setEditingUser((prev) =>
                                                    prev
                                                        ? { ...prev, phone: e.target.value }
                                                        : {
                                                              ...selectedUser,
                                                              phone: e.target.value,
                                                          },
                                                )
                                            }
                                            placeholder="+20 XXX XXX XXXX"
                                            data-oid="2sgycjf"
                                        />
                                    </div>
                                    <div data-oid="zwsi3z4">
                                        <Label htmlFor="edit-whatsapp" data-oid="jhznhij">
                                            WhatsApp Number
                                        </Label>
                                        <Input
                                            id="edit-whatsapp"
                                            value={
                                                editingUser?.whatsappNumber ||
                                                selectedUser?.whatsappNumber ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                setEditingUser((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              whatsappNumber: e.target.value,
                                                          }
                                                        : {
                                                              ...selectedUser,
                                                              whatsappNumber: e.target.value,
                                                          },
                                                )
                                            }
                                            placeholder="+20 XXX XXX XXXX"
                                            data-oid="lb262o2"
                                        />
                                    </div>
                                    {(selectedUser?.role == 'customer' ||
                                        selectedUser?.role == 'admin' ||
                                        selectedUser?.role == 'prescription-reader' ||
                                        selectedUser?.role == 'database-input') && (
                                        <div data-oid="u1a39zr">
                                            <Label htmlFor="edit-nationalId" data-oid="ze:72s0">
                                                National ID
                                            </Label>
                                            <Input
                                                id="edit-nationalId"
                                                value={
                                                    editingUser?._id ||
                                                    selectedUser?._id ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setEditingUser((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  nationalId: e.target.value,
                                                              }
                                                            : {
                                                                  ...selectedUser,
                                                                  nationalId: e.target.value,
                                                              },
                                                    )
                                                }
                                                placeholder="14 digit national ID"
                                                data-oid="vgypvna"
                                            />
                                        </div>
                                    )}
                                    <div data-oid="j8kgxzi">
                                        <Label htmlFor="edit-dateOfBirth" data-oid="m1iigg8">
                                            Date of Birth
                                        </Label>
                                        <Input
                                            id="edit-dateOfBirth"
                                            type="date"
                                            value={
                                                editingUser?.dateOfBirth ||
                                                selectedUser?.dateOfBirth ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                setEditingUser((prev) =>
                                                    prev
                                                        ? { ...prev, dateOfBirth: e.target.value }
                                                        : {
                                                              ...selectedUser,
                                                              dateOfBirth: e.target.value,
                                                          },
                                                )
                                            }
                                            data-oid="li_98.4"
                                        />
                                    </div>
                                    <div data-oid="uscz2u1">
                                        <Label htmlFor="edit-gender" data-oid="k9apou-">
                                            Gender
                                        </Label>
                                        <Select
                                            value={
                                                editingUser?.gender ||
                                                selectedUser?.gender ||
                                                'not-specified'
                                            }
                                            onValueChange={(value) =>
                                                setEditingUser((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              gender:
                                                                  value == 'not-specified'
                                                                      ? undefined
                                                                      : (value as
                                                                            | 'male'
                                                                            | 'female'),
                                                          }
                                                        : {
                                                              ...selectedUser,
                                                              gender:
                                                                  value == 'not-specified'
                                                                      ? undefined
                                                                      : (value as
                                                                            | 'male'
                                                                            | 'female'),
                                                          },
                                                )
                                            }
                                            data-oid=".u-:95r"
                                        >
                                            <SelectTrigger data-oid="lmhs.vg">
                                                <SelectValue
                                                    placeholder="Select gender"
                                                    data-oid=":6k2vkd"
                                                />
                                            </SelectTrigger>
                                            <SelectContent data-oid="xueu9rf">
                                                <SelectItem
                                                    value="not-specified"
                                                    data-oid="r.o0l59"
                                                >
                                                    Not Specified
                                                </SelectItem>
                                                <SelectItem value="male" data-oid="xxvzb8o">
                                                    Male
                                                </SelectItem>
                                                <SelectItem value="female" data-oid="1bp18ww">
                                                    Female
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="location" className="space-y-4" data-oid="j9740-b">
                                <div className="grid grid-cols-2 gap-4" data-oid="tdn9stf">
                                    <div data-oid="4nf3un2">
                                        <Label htmlFor="edit-governorate" data-oid="rwiq2lp">
                                            Governorate *
                                        </Label>
                                        <Select
                                            value={
                                                editingUser?.governorate || selectedUser?.governorateId
                                            }
                                            onValueChange={(value) => {
                                                setEditingUser((prev) =>
                                                    prev
                                                        ? { ...prev, governorate: value, city: '' }
                                                        : {
                                                              ...selectedUser,
                                                              governorate: value,
                                                              city: '',
                                                          },
                                                );
                                            }}
                                            data-oid="zr8k3yw"
                                        >
                                            <SelectTrigger data-oid="em1x4az">
                                                <SelectValue
                                                    placeholder="Select governorate"
                                                    data-oid="cz67:4h"
                                                />
                                            </SelectTrigger>
                                            <SelectContent
                                                className="max-h-60 overflow-y-auto"
                                                data-oid="3cqbllv"
                                            >
                                                <SelectItem value="Cairo" data-oid="7p.n0tz">
                                                    Cairo
                                                </SelectItem>
                                                <SelectItem value="Giza" data-oid="r1v8yrq">
                                                    Giza
                                                </SelectItem>
                                                <SelectItem value="Alexandria" data-oid="xgln:l_">
                                                    Alexandria
                                                </SelectItem>
                                                <SelectItem value="Ismailia" data-oid="zdomvsx">
                                                    Ismailia
                                                </SelectItem>
                                                <SelectItem value="Dakahlia" data-oid="9uprych">
                                                    Dakahlia
                                                </SelectItem>
                                                <SelectItem value="Sharqia" data-oid="pnghmjf">
                                                    Sharqia
                                                </SelectItem>
                                                <SelectItem value="Qalyubia" data-oid="wm2wdff">
                                                    Qalyubia
                                                </SelectItem>
                                                <SelectItem value="Beheira" data-oid="bwz06p1">
                                                    Beheira
                                                </SelectItem>
                                                <SelectItem value="Gharbia" data-oid="2axhl2c">
                                                    Gharbia
                                                </SelectItem>
                                                <SelectItem
                                                    value="Kafr al-Sheikh"
                                                    data-oid="5k67l9k"
                                                >
                                                    Kafr al-Sheikh
                                                </SelectItem>
                                                <SelectItem value="Damietta" data-oid="5rty.av">
                                                    Damietta
                                                </SelectItem>
                                                <SelectItem value="Port Said" data-oid="0-k:71-">
                                                    Port Said
                                                </SelectItem>
                                                <SelectItem value="Suez" data-oid="usuyetj">
                                                    Suez
                                                </SelectItem>
                                                <SelectItem value="North Sinai" data-oid="g6yqo83">
                                                    North Sinai
                                                </SelectItem>
                                                <SelectItem value="South Sinai" data-oid="v.gy33f">
                                                    South Sinai
                                                </SelectItem>
                                                <SelectItem value="Red Sea" data-oid="790mmo1">
                                                    Red Sea
                                                </SelectItem>
                                                <SelectItem value="Matrouh" data-oid="xd7zaqn">
                                                    Matrouh
                                                </SelectItem>
                                                <SelectItem value="New Valley" data-oid="rgbolf7">
                                                    New Valley
                                                </SelectItem>
                                                <SelectItem value="Fayyum" data-oid="ly-pt7e">
                                                    Fayyum
                                                </SelectItem>
                                                <SelectItem value="Beni Suef" data-oid="lkoemkm">
                                                    Beni Suef
                                                </SelectItem>
                                                <SelectItem value="Minya" data-oid="nj10vsq">
                                                    Minya
                                                </SelectItem>
                                                <SelectItem value="Asyut" data-oid="_j.ge9j">
                                                    Asyut
                                                </SelectItem>
                                                <SelectItem value="Sohag" data-oid="5nax9q:">
                                                    Sohag
                                                </SelectItem>
                                                <SelectItem value="Qena" data-oid="acwbcyk">
                                                    Qena
                                                </SelectItem>
                                                <SelectItem value="Luxor" data-oid="thfg6jg">
                                                    Luxor
                                                </SelectItem>
                                                <SelectItem value="Aswan" data-oid="lz:x6o:">
                                                    Aswan
                                                </SelectItem>
                                                <SelectItem value="Monufia" data-oid="_7hmoq:">
                                                    Monufia
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div data-oid="80vk62x">
                                        <Label htmlFor="edit-city" data-oid="g9wu8cy">
                                            City *
                                        </Label>
                                        <Input
                                            id="edit-city"
                                            value={editingUser?.city || selectedUser?.cityId}
                                            onChange={(e) =>
                                                setEditingUser((prev) =>
                                                    prev
                                                        ? { ...prev, cityId: e.target.value }
                                                        : { ...selectedUser, cityId: e.target.value },
                                                )
                                            }
                                            placeholder="Enter city"
                                            data-oid="6bxynt1"
                                        />
                                    </div>
                                </div>
                                <div data-oid="eechg_t">
                                    <Label htmlFor="edit-address" data-oid="88ggkmj">
                                        Full Address *
                                    </Label>
                                    <Textarea
                                        id="edit-address"
                                        value={editingUser?.address || selectedUser?.address}
                                        onChange={(e) =>
                                            setEditingUser((prev) =>
                                                prev
                                                    ? { ...prev, address: e.target.value }
                                                    : { ...selectedUser, address: e.target.value },
                                            )
                                        }
                                        placeholder="Enter complete address"
                                        rows={3}
                                        data-oid="8x93zx:"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="role" className="space-y-4" data-oid="4j02_p6">
                                {selectedUser?.role == 'pharmacy' && (
                                    <div className="space-y-4" data-oid="g43sarm">
                                        <h3 className="text-lg font-semibold" data-oid="mkn:qcy">
                                            Pharmacy Information
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4" data-oid="gl1:mx3">
                                            <div data-oid="sdalk3m">
                                                <Label
                                                    htmlFor="edit-businessName"
                                                    data-oid="-389df3"
                                                >
                                                    Pharmacy Name (English)
                                                </Label>
                                                <Input
                                                    id="edit-businessName"
                                                    value={
                                                        editingUser?.businessName ?? ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditingUser((prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                          businessName:
                                                                              e.target.value,
                                                                      
                                                                  }
                                                                : {
                                                                      ...selectedUser,
                                                                      businessName:
                                                                        e.target.value,
                                                                      
                                                                  },
                                                        )
                                                    }
                                                    placeholder="Enter pharmacy name in English"
                                                    data-oid="6-ygmje"
                                                />
                                            </div>
                                            <div data-oid="kphx.pp">
                                                <Label
                                                    htmlFor="edit-businessNameArabic"
                                                    data-oid="d12beb."
                                                >
                                                    Pharmacy Name (Arabic)
                                                </Label>
                                                <Input
                                                    id="edit-businessNameArabic"
                                                    value={
                                                        editingUser?.businessNameAr ??
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditingUser((prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,businessNameAr:
                                                                      e.target.value,
                                                                  }
                                                                : {
                                                                      ...selectedUser,
                                                                      businessNameAr:
                                                                              e.target.value,
                                                                  },
                                                        )
                                                    }
                                                    placeholder="أدخل اسم الصيدلية بالعربية"
                                                    className="text-right"
                                                    dir="rtl"
                                                    data-oid="5qp-lnv"
                                                />
                                            </div>
                                            <div data-oid="7zz5fe5">
                                                <Label
                                                    htmlFor="edit-licenseNumber"
                                                    data-oid="b1cyssn"
                                                >
                                                    License Number
                                                </Label>
                                                <Input
                                                    id="edit-licenseNumber"
                                                    value={
                                                        editingUser?.licenseNumber ||
                                                        selectedUser?.licenseNumber ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditingUser((prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      roleData: {
                                                                          ...prev.roleData,
                                                                          licenseNumber:
                                                                              e.target.value,
                                                                      },
                                                                  }
                                                                : {
                                                                      ...selectedUser,
                                                                      roleData: {
                                                                          ...selectedUser?.roleData,
                                                                          licenseNumber:
                                                                              e.target.value,
                                                                      },
                                                                  },
                                                        )
                                                    }
                                                    placeholder="Enter license number"
                                                    data-oid="pk9d:_i"
                                                />
                                            </div>
                                            <div data-oid="b3fp.cr">
                                                <Label
                                                    htmlFor="edit-operatingHoursOpen"
                                                    data-oid="h4l6wrw"
                                                >
                                                    Opening Time
                                                </Label>
                                                <Input
                                                    id="edit-operatingHoursOpen"
                                                    type="time"
                                                    value={
                                                        editingUser?.operatingHours
                                                            ?.open ||
                                                        selectedUser?.operatingHours
                                                            ?.open ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditingUser((prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      roleData: {
                                                                          ...prev.roleData,
                                                                          operatingHours: {
                                                                              ...prev.roleData
                                                                                  ?.operatingHours,
                                                                              open: e.target.value,
                                                                              close:
                                                                                  prev.roleData
                                                                                      ?.operatingHours
                                                                                      ?.close || '',
                                                                          },
                                                                      },
                                                                  }
                                                                : {
                                                                      ...selectedUser,
                                                                      roleData: {
                                                                          ...selectedUser?.roleData,
                                                                          operatingHours: {
                                                                              ...selectedUser
                                                                                  .roleData
                                                                                  ?.operatingHours,
                                                                              open: e.target.value,
                                                                              close:
                                                                                  selectedUser
                                                                                      .roleData
                                                                                      ?.operatingHours
                                                                                      ?.close || '',
                                                                          },
                                                                      },
                                                                  },
                                                        )
                                                    }
                                                    data-oid="awja2fy"
                                                />
                                            </div>
                                            <div data-oid="p:0ea.x">
                                                <Label
                                                    htmlFor="edit-operatingHoursClose"
                                                    data-oid="x.tpwm-"
                                                >
                                                    Closing Time
                                                </Label>
                                                <Input
                                                    id="edit-operatingHoursClose"
                                                    type="time"
                                                    value={
                                                        editingUser?.operatingHours
                                                            ?.close ||
                                                        selectedUser?.operatingHours
                                                            ?.close ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditingUser((prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      roleData: {
                                                                          ...prev.roleData,
                                                                          operatingHours: {
                                                                              ...prev.roleData
                                                                                  ?.operatingHours,
                                                                              open:
                                                                                  prev.roleData
                                                                                      ?.operatingHours
                                                                                      ?.open || '',
                                                                              close: e.target.value,
                                                                          },
                                                                      },
                                                                  }
                                                                : {
                                                                      ...selectedUser,
                                                                      roleData: {
                                                                          ...selectedUser?.roleData,
                                                                          operatingHours: {
                                                                              ...selectedUser
                                                                                  .roleData
                                                                                  ?.operatingHours,
                                                                              open:
                                                                                  selectedUser
                                                                                      .roleData
                                                                                      ?.operatingHours
                                                                                      ?.open || '',
                                                                              close: e.target.value,
                                                                          },
                                                                      },
                                                                  },
                                                        )
                                                    }
                                                    data-oid="s_kidf5"
                                                />
                                            </div>
                                            <div data-oid=".l8vg8x">
                                                <Label
                                                    htmlFor="edit-commissionRate"
                                                    data-oid="wlobr6g"
                                                >
                                                    Commission Rate (%)
                                                </Label>
                                                <Input
                                                    id="edit-commissionRate"
                                                    type="number"
                                                    value={
                                                        editingUser?.commissionRate ||
                                                        selectedUser?.commissionRate ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditingUser((prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      roleData: {
                                                                          ...prev.roleData,
                                                                          commissionRate:
                                                                              parseFloat(
                                                                                  e.target.value,
                                                                              ),
                                                                      },
                                                                  }
                                                                : {
                                                                      ...selectedUser,
                                                                      roleData: {
                                                                          ...selectedUser?.roleData,
                                                                          commissionRate:
                                                                              parseFloat(
                                                                                  e.target.value,
                                                                              ),
                                                                      },
                                                                  },
                                                        )
                                                    }
                                                    placeholder="Enter commission rate"
                                                    data-oid=".4sb4jw"
                                                />
                                            </div>
                                            <div className="col-span-2" data-oid="hxaqt.c">
                                                <Label
                                                    htmlFor="edit-phone"
                                                    data-oid="gg-9w0v"
                                                >
                                                    Pharmacy Phone Numbers
                                                </Label>
                                                {/* <div className="space-y-2 mt-2" data-oid="jtdz300">
                                                    {(
                                                        editingUser?.phone ||
                                                        selectedUser?.phone || [
                                                            selectedUser?.phone ||
                                                                '',
                                                        ]
                                                    ).map((phone, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center space-x-2"
                                                            data-oid="hx7f0h_"
                                                        >
                                                            <Input
                                                                value={phone}
                                                                onChange={(e) => {
                                                                    const currentPhones =
                                                                        editingUser?.roleData
                                                                            ?.phone ||
                                                                            selectedUser?.roleData
                                                                                ?.phone || [
                                                                                selectedUser
                                                                                    .roleData
                                                                                    ?.phone ||
                                                                                    '',
                                                                            ];

                                                                    const updatedPhones = [
                                                                        ...currentPhones,
                                                                    ];

                                                                    updatedPhones[index] =
                                                                        e.target.value;

                                                                    setEditingUser((prev) =>
                                                                        prev
                                                                            ? {
                                                                                  ...prev,
                                                                                  roleData: {
                                                                                      ...prev.roleData,
                                                                                      phone:
                                                                                          updatedPhones,
                                                                                  },
                                                                              }
                                                                            : {
                                                                                  ...selectedUser,
                                                                                  roleData: {
                                                                                      ...selectedUser?.roleData,
                                                                                      phone:
                                                                                          updatedPhones,
                                                                                  },
                                                                              },
                                                                    );
                                                                }}
                                                                placeholder="+20 XXX XXX XXXX"
                                                                className="flex-1"
                                                                data-oid="1wtcp.9"
                                                            />

                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    console.log(
                                                                        'Remove phone button clicked for index:',
                                                                        index,
                                                                    );

                                                                    const currentPhones =
                                                                        editingUser?.roleData
                                                                            ?.phone ||
                                                                            selectedUser?.roleData
                                                                                ?.phone || [
                                                                                selectedUser
                                                                                    .roleData
                                                                                    ?.phone ||
                                                                                    '',
                                                                            ];

                                                                    console.log(
                                                                        'Current phones before removal:',
                                                                        currentPhones,
                                                                    );

                                                                    const updatedPhones =
                                                                        currentPhones.filter(
                                                                            (_, i) => i !== index,
                                                                        );

                                                                    // Ensure at least one empty phone field remains
                                                                    if (
                                                                        updatedPhones.length == 0
                                                                    ) {
                                                                        updatedPhones.push('');
                                                                    }

                                                                    console.log(
                                                                        'Updated phones after removal:',
                                                                        updatedPhones,
                                                                    );

                                                                    setEditingUser((prev) => {
                                                                        const newUser = prev
                                                                            ? {
                                                                                  ...prev,
                                                                                  roleData: {
                                                                                      ...prev.roleData,
                                                                                      phone:
                                                                                          updatedPhones,
                                                                                  },
                                                                              }
                                                                            : {
                                                                                  ...selectedUser,
                                                                                  roleData: {
                                                                                      ...selectedUser?.roleData,
                                                                                      phone:
                                                                                          updatedPhones,
                                                                                  },
                                                                              };

                                                                        console.log(
                                                                            'Setting new user state after removal:',
                                                                            newUser,
                                                                        );
                                                                        return newUser;
                                                                    });
                                                                }}
                                                                className="text-red-600 hover:text-red-700"
                                                                data-oid="unzfu-a"
                                                            >
                                                                <Trash2
                                                                    className="w-4 h-4"
                                                                    data-oid="cr20v26"
                                                                />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            console.log(
                                                                'Add Phone Number button clicked',
                                                            );

                                                            const currentPhones = editingUser
                                                                ?.phone ||
                                                                selectedUser?.roleData
                                                                    ?.phone || [
                                                                    selectedUser?.roleData
                                                                        ?.phone || '',
                                                                ];

                                                            console.log(
                                                                'Current phones:',
                                                                currentPhones,
                                                            );

                                                            const updatedPhones = [
                                                                ...currentPhones.filter(
                                                                    (phone) => phone.trim() !== '',
                                                                ),
                                                                '',
                                                            ];

                                                            console.log(
                                                                'Updated phones:',
                                                                updatedPhones,
                                                            );

                                                            setEditingUser((prev) => {
                                                                const newUser = prev
                                                                    ? {
                                                                          ...prev,
                                                                          roleData: {
                                                                              ...prev.roleData,
                                                                              phone:
                                                                                  updatedPhones,
                                                                          },
                                                                      }
                                                                    : {
                                                                          ...selectedUser,
                                                                          roleData: {
                                                                              ...selectedUser?.roleData,
                                                                              phone:
                                                                                  updatedPhones,
                                                                          },
                                                                      };

                                                                console.log(
                                                                    'Setting new user state:',
                                                                    newUser,
                                                                );
                                                                return newUser;
                                                            });
                                                        }}
                                                        className="w-full"
                                                        data-oid="yh:upy2"
                                                    >
                                                        <Phone
                                                            className="w-4 h-4 mr-2"
                                                            data-oid="a-9klcd"
                                                        />
                                                        Add Phone Number
                                                    </Button>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div data-oid="uek1ktu">
                                            <Label
                                                htmlFor="edit-servicesOffered"
                                                data-oid="3kpoamv"
                                            >
                                                Services Offered
                                            </Label>
                                            <Textarea
                                                id="edit-servicesOffered"
                                                value={
                                                    editingUser?.servicesOffered?.join(
                                                        ', ',
                                                    ) ||
                                                    selectedUser?.servicesOffered?.join(
                                                        ', ',
                                                    ) ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setEditingUser((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  roleData: {
                                                                      ...prev.roleData,
                                                                      servicesOffered:
                                                                          e.target.value
                                                                              .split(', ')
                                                                              .filter((item) =>
                                                                                  item.trim(),
                                                                              ),
                                                                  },
                                                              }
                                                            : {
                                                                  ...selectedUser,
                                                                  roleData: {
                                                                      ...selectedUser?.roleData,
                                                                      servicesOffered:
                                                                          e.target.value
                                                                              .split(', ')
                                                                              .filter((item) =>
                                                                                  item.trim(),
                                                                              ),
                                                                  },
                                                              },
                                                    )
                                                }
                                                placeholder="Enter services separated by commas"
                                                rows={3}
                                                data-oid="cjg5q9e"
                                            />
                                        </div>
                                    </div>
                                )}

                                {selectedUser?.role == 'doctor' && (
                                    <div className="space-y-4" data-oid="ig5dv.8">
                                        <h3 className="text-lg font-semibold" data-oid="y3ivzxq">
                                            Doctor Information
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4" data-oid=":e5y7_y">
                                            <div data-oid="ebh7itb">
                                                <Label
                                                    htmlFor="edit-specialization"
                                                    data-oid="e3frn77"
                                                >
                                                    Specialization
                                                </Label>
                                                <Input
                                                    id="edit-specialization"
                                                    value={
                                                        editingUser?.specialization ||
                                                        selectedUser?.specialization ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditingUser((prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      roleData: {
                                                                          ...prev.roleData,
                                                                          specialization:
                                                                              e.target.value,
                                                                      },
                                                                  }
                                                                : {
                                                                      ...selectedUser,
                                                                      roleData: {
                                                                          ...selectedUser?.roleData,
                                                                          specialization:
                                                                              e.target.value,
                                                                      },
                                                                  },
                                                        )
                                                    }
                                                    placeholder="Enter specialization"
                                                    data-oid="8i::x7y"
                                                />
                                            </div>

                                            <div data-oid="m4gwjq0">
                                                <Label htmlFor="edit-clinicName" data-oid="o50-fdz">
                                                    Clinic Name
                                                </Label>
                                                <Input
                                                    id="edit-clinicName"
                                                    value={
                                                        editingUser?.clinicName ||
                                                        selectedUser?.clinicName ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditingUser((prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      roleData: {
                                                                          ...prev.roleData,
                                                                          clinicName:
                                                                              e.target.value,
                                                                      },
                                                                  }
                                                                : {
                                                                      ...selectedUser,
                                                                      roleData: {
                                                                          ...selectedUser?.roleData,
                                                                          clinicName:
                                                                              e.target.value,
                                                                      },
                                                                  },
                                                        )
                                                    }
                                                    placeholder="Enter clinic name"
                                                    data-oid="0zk93ub"
                                                />
                                            </div>
                                            <div data-oid="mgxeg:5">
                                                <Label
                                                    htmlFor="edit-referralCommission"
                                                    data-oid="7lx:f6d"
                                                >
                                                    Referral Commission (%)
                                                </Label>
                                                <Input
                                                    id="edit-referralCommission"
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.1"
                                                    value={
                                                        editingUser?.referralCommission ||
                                                        selectedUser?.referralCommission ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditingUser((prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      roleData: {
                                                                          ...prev.roleData,
                                                                          referralCommission:
                                                                              parseFloat(
                                                                                  e.target.value,
                                                                              ),
                                                                      },
                                                                  }
                                                                : {
                                                                      ...selectedUser,
                                                                      roleData: {
                                                                          ...selectedUser?.roleData,
                                                                          referralCommission:
                                                                              parseFloat(
                                                                                  e.target.value,
                                                                              ),
                                                                      },
                                                                  },
                                                        )
                                                    }
                                                    placeholder="Enter referral commission percentage"
                                                    data-oid="sbtcksb"
                                                />
                                            </div>
                                            <div className="col-span-2" data-oid="9p0e7wr">
                                                <Label
                                                    htmlFor="edit-phone"
                                                    data-oid="9dvldx9"
                                                >
                                                    Clinic Phone Numbers
                                                </Label>
                                                {/* <div className="space-y-2 mt-2" data-oid="bnqde5:">
                                                    {(
                                                        editingUser?.phone ||
                                                        selectedUser?.phone || [
                                                            selectedUser?.phone ||
                                                                '',
                                                        ]
                                                    ).map((phone, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center space-x-2"
                                                            data-oid="ycnneli"
                                                        >
                                                            <Input
                                                                value={phone}
                                                                onChange={(e) => {
                                                                    const currentPhones =
                                                                        editingUser?.roleData
                                                                            ?.phone ||
                                                                            selectedUser?.roleData
                                                                                ?.phone || [
                                                                                selectedUser
                                                                                    .roleData
                                                                                    ?.phone ||
                                                                                    '',
                                                                            ];

                                                                    const updatedPhones = [
                                                                        ...currentPhones,
                                                                    ];

                                                                    updatedPhones[index] =
                                                                        e.target.value;

                                                                    setEditingUser((prev) =>
                                                                        prev
                                                                            ? {
                                                                                  ...prev,
                                                                                  roleData: {
                                                                                      ...prev.roleData,
                                                                                      phone:
                                                                                          updatedPhones,
                                                                                  },
                                                                              }
                                                                            : {
                                                                                  ...selectedUser,
                                                                                  roleData: {
                                                                                      ...selectedUser?.roleData,
                                                                                      phone:
                                                                                          updatedPhones,
                                                                                  },
                                                                              },
                                                                    );
                                                                }}
                                                                placeholder="+20 XXX XXX XXXX"
                                                                className="flex-1"
                                                                data-oid="vyu4an6"
                                                            />

                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    console.log(
                                                                        'Remove clinic phone button clicked for index:',
                                                                        index,
                                                                    );

                                                                    const currentPhones =
                                                                        editingUser?.roleData
                                                                            ?.phone ||
                                                                            selectedUser?.roleData
                                                                                ?.phone || [
                                                                                selectedUser
                                                                                    .roleData
                                                                                    ?.phone ||
                                                                                    '',
                                                                            ];

                                                                    console.log(
                                                                        'Current clinic phones before removal:',
                                                                        currentPhones,
                                                                    );

                                                                    const updatedPhones =
                                                                        currentPhones.filter(
                                                                            (_, i) => i !== index,
                                                                        );

                                                                    // Ensure at least one empty phone field remains
                                                                    if (
                                                                        updatedPhones.length == 0
                                                                    ) {
                                                                        updatedPhones.push('');
                                                                    }

                                                                    console.log(
                                                                        'Updated clinic phones after removal:',
                                                                        updatedPhones,
                                                                    );

                                                                    setEditingUser((prev) => {
                                                                        const newUser = prev
                                                                            ? {
                                                                                  ...prev,
                                                                                  roleData: {
                                                                                      ...prev.roleData,
                                                                                      phone:
                                                                                          updatedPhones,
                                                                                  },
                                                                              }
                                                                            : {
                                                                                  ...selectedUser,
                                                                                  roleData: {
                                                                                      ...selectedUser?.roleData,
                                                                                      phone:
                                                                                          updatedPhones,
                                                                                  },
                                                                              };

                                                                        console.log(
                                                                            'Setting new user state after clinic phone removal:',
                                                                            newUser,
                                                                        );
                                                                        return newUser;
                                                                    });
                                                                }}
                                                                className="text-red-600 hover:text-red-700"
                                                                data-oid="hb9m_qf"
                                                            >
                                                                <Trash2
                                                                    className="w-4 h-4"
                                                                    data-oid="q9870bq"
                                                                />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            console.log(
                                                                'Add Clinic Phone Number button clicked',
                                                            );

                                                            const currentPhones = editingUser
                                                                ?.phone ||
                                                                selectedUser?.roleData
                                                                    ?.phone || [
                                                                    selectedUser?.roleData
                                                                        ?.phone || '',
                                                                ];

                                                            console.log(
                                                                'Current clinic phones:',
                                                                currentPhones,
                                                            );

                                                            const updatedPhones = [
                                                                ...currentPhones.filter(
                                                                    (phone) => phone.trim() !== '',
                                                                ),
                                                                '',
                                                            ];

                                                            console.log(
                                                                'Updated clinic phones:',
                                                                updatedPhones,
                                                            );

                                                            setEditingUser((prev) => {
                                                                const newUser = prev
                                                                    ? {
                                                                          ...prev,
                                                                          roleData: {
                                                                              ...prev.roleData,
                                                                              phone:
                                                                                  updatedPhones,
                                                                          },
                                                                      }
                                                                    : {
                                                                          ...selectedUser,
                                                                          roleData: {
                                                                              ...selectedUser?.roleData,
                                                                              phone:
                                                                                  updatedPhones,
                                                                          },
                                                                      };

                                                                console.log(
                                                                    'Setting new user state for clinic phones:',
                                                                    newUser,
                                                                );
                                                                return newUser;
                                                            });
                                                        }}
                                                        className="w-full"
                                                        data-oid=".h7skj0"
                                                    >
                                                        <Phone
                                                            className="w-4 h-4 mr-2"
                                                            data-oid="m3bn_lm"
                                                        />
                                                        Add Clinic Phone Number
                                                    </Button>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div data-oid="sg20dx8">
                                            <Label htmlFor="edit-clinicAddress" data-oid="ablbdde">
                                                Clinic Address
                                            </Label>
                                            <Textarea
                                                id="edit-clinicAddress"
                                                value={
                                                    editingUser?.clinicAddress ||
                                                    selectedUser?.clinicAddress ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setEditingUser((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  roleData: {
                                                                      ...prev.roleData,
                                                                      clinicAddress: e.target.value,
                                                                  },
                                                              }
                                                            : {
                                                                  ...selectedUser,
                                                                  roleData: {
                                                                      ...selectedUser?.roleData,
                                                                      clinicAddress: e.target.value,
                                                                  },
                                                              },
                                                    )
                                                }
                                                placeholder="Enter clinic address"
                                                rows={3}
                                                data-oid="hpeg24_"
                                            />
                                        </div>
                                    </div>
                                )}

                                {selectedUser?.role == 'customer' && (
                                    <div className="space-y-4" data-oid="hi-:v6j">
                                        <h3 className="text-lg font-semibold" data-oid="q2j:1j:">
                                            Customer Information
                                        </h3>
                                        <div className="space-y-4" data-oid="e1z7c3w">
                                            <div data-oid="y75e7da">
                                                <Label
                                                    htmlFor="edit-medicalHistory"
                                                    data-oid="-yws20a"
                                                >
                                                    Medical History
                                                </Label>
                                                <Textarea
                                                    id="edit-medicalHistory"
                                                    value={
                                                        editingUser?.medicalHistory?.join(
                                                            ', ',
                                                        ) ||
                                                        selectedUser?.medicalHistory?.join(
                                                            ', ',
                                                        ) ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditingUser((prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      roleData: {
                                                                          ...prev.roleData,
                                                                          medicalHistory:
                                                                              e.target.value
                                                                                  .split(', ')
                                                                                  .filter((item) =>
                                                                                      item.trim(),
                                                                                  ),
                                                                      },
                                                                  }
                                                                : {
                                                                      ...selectedUser,
                                                                      roleData: {
                                                                          ...selectedUser?.roleData,
                                                                          medicalHistory:
                                                                              e.target.value
                                                                                  .split(', ')
                                                                                  .filter((item) =>
                                                                                      item.trim(),
                                                                                  ),
                                                                      },
                                                                  },
                                                        )
                                                    }
                                                    placeholder="Enter medical conditions separated by commas"
                                                    rows={2}
                                                    data-oid="0s.g8wt"
                                                />
                                            </div>
                                            <div data-oid="7rb4r.-">
                                                <Label htmlFor="edit-allergies" data-oid="cg7489p">
                                                    Allergies
                                                </Label>
                                                <Textarea
                                                    id="edit-allergies"
                                                    value={
                                                        editingUser?.allergies?.join(
                                                            ', ',
                                                        ) ||
                                                        selectedUser?.allergies?.join(
                                                            ', ',
                                                        ) ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditingUser((prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      roleData: {
                                                                          ...prev.roleData,
                                                                          allergies: e.target.value
                                                                              .split(', ')
                                                                              .filter((item) =>
                                                                                  item.trim(),
                                                                              ),
                                                                      },
                                                                  }
                                                                : {
                                                                      ...selectedUser,
                                                                      roleData: {
                                                                          ...selectedUser?.roleData,
                                                                          allergies: e.target.value
                                                                              .split(', ')
                                                                              .filter((item) =>
                                                                                  item.trim(),
                                                                              ),
                                                                      },
                                                                  },
                                                        )
                                                    }
                                                    placeholder="Enter allergies separated by commas"
                                                    rows={2}
                                                    data-oid="zboby3o"
                                                />
                                            </div>
                                            <div
                                                className="grid grid-cols-3 gap-4"
                                                data-oid="83:w9b."
                                            >
                                                <div data-oid=":7g2ggl">
                                                    <Label
                                                        htmlFor="edit-emergencyContactName"
                                                        data-oid="i4d:9ni"
                                                    >
                                                        Emergency Contact Name
                                                    </Label>
                                                    <Input
                                                        id="edit-emergencyContactName"
                                                        value={
                                                            editingUser?.emergencyContact
                                                                ?.name ||
                                                            selectedUser?.emergencyContact
                                                                ?.name ||
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            setEditingUser((prev) =>
                                                                prev
                                                                    ? {
                                                                          ...prev,
                                                                          roleData: {
                                                                              ...prev.roleData,
                                                                              emergencyContact: {
                                                                                  ...prev.roleData
                                                                                      ?.emergencyContact,
                                                                                  name: e.target
                                                                                      .value,
                                                                                  phone:
                                                                                      prev.roleData
                                                                                          ?.emergencyContact
                                                                                          ?.phone ||
                                                                                      '',
                                                                                  relation:
                                                                                      prev.roleData
                                                                                          ?.emergencyContact
                                                                                          ?.relation ||
                                                                                      '',
                                                                              },
                                                                          },
                                                                      }
                                                                    : {
                                                                          ...selectedUser,
                                                                          roleData: {
                                                                              ...selectedUser?.roleData,
                                                                              emergencyContact: {
                                                                                  ...selectedUser
                                                                                      .roleData
                                                                                      ?.emergencyContact,
                                                                                  name: e.target
                                                                                      .value,
                                                                                  phone:
                                                                                      selectedUser
                                                                                          .roleData
                                                                                          ?.emergencyContact
                                                                                          ?.phone ||
                                                                                      '',
                                                                                  relation:
                                                                                      selectedUser
                                                                                          .roleData
                                                                                          ?.emergencyContact
                                                                                          ?.relation ||
                                                                                      '',
                                                                              },
                                                                          },
                                                                      },
                                                            )
                                                        }
                                                        placeholder="Enter contact name"
                                                        data-oid="3j2o3oe"
                                                    />
                                                </div>
                                                <div data-oid="9z:naxf">
                                                    <Label
                                                        htmlFor="edit-emergencyContactPhone"
                                                        data-oid="bvqdxt1"
                                                    >
                                                        Emergency Contact Phone
                                                    </Label>
                                                    <Input
                                                        id="edit-emergencyContactPhone"
                                                        value={
                                                            editingUser?.emergencyContact
                                                                ?.phone ||
                                                            selectedUser?.emergencyContact
                                                                ?.phone ||
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            setEditingUser((prev) =>
                                                                prev
                                                                    ? {
                                                                          ...prev,
                                                                          roleData: {
                                                                              ...prev.roleData,
                                                                              emergencyContact: {
                                                                                  ...prev.roleData
                                                                                      ?.emergencyContact,
                                                                                  name:
                                                                                      prev.roleData
                                                                                          ?.emergencyContact
                                                                                          ?.name ||
                                                                                      '',
                                                                                  phone: e.target
                                                                                      .value,
                                                                                  relation:
                                                                                      prev.roleData
                                                                                          ?.emergencyContact
                                                                                          ?.relation ||
                                                                                      '',
                                                                              },
                                                                          },
                                                                      }
                                                                    : {
                                                                          ...selectedUser,
                                                                          roleData: {
                                                                              ...selectedUser?.roleData,
                                                                              emergencyContact: {
                                                                                  ...selectedUser
                                                                                      .roleData
                                                                                      ?.emergencyContact,
                                                                                  name:
                                                                                      selectedUser
                                                                                          .roleData
                                                                                          ?.emergencyContact
                                                                                          ?.name ||
                                                                                      '',
                                                                                  phone: e.target
                                                                                      .value,
                                                                                  relation:
                                                                                      selectedUser
                                                                                          .roleData
                                                                                          ?.emergencyContact
                                                                                          ?.relation ||
                                                                                      '',
                                                                              },
                                                                          },
                                                                      },
                                                            )
                                                        }
                                                        placeholder="Enter contact phone"
                                                        data-oid="wk0ttwg"
                                                    />
                                                </div>
                                                <div data-oid=".mp9y1l">
                                                    <Label
                                                        htmlFor="edit-emergencyContactRelation"
                                                        data-oid="irx4akp"
                                                    >
                                                        Relation
                                                    </Label>
                                                    <Input
                                                        id="edit-emergencyContactRelation"
                                                        value={
                                                            editingUser?.emergencyContact
                                                                ?.relation ||
                                                            selectedUser?.emergencyContact
                                                                ?.relation ||
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            setEditingUser((prev) =>
                                                                prev
                                                                    ? {
                                                                          ...prev,
                                                                          roleData: {
                                                                              ...prev.roleData,
                                                                              emergencyContact: {
                                                                                  ...prev.roleData
                                                                                      ?.emergencyContact,
                                                                                  name:
                                                                                      prev.roleData
                                                                                          ?.emergencyContact
                                                                                          ?.name ||
                                                                                      '',
                                                                                  phone:
                                                                                      prev.roleData
                                                                                          ?.emergencyContact
                                                                                          ?.phone ||
                                                                                      '',
                                                                                  relation:
                                                                                      e.target
                                                                                          .value,
                                                                              },
                                                                          },
                                                                      }
                                                                    : {
                                                                          ...selectedUser,
                                                                          roleData: {
                                                                              ...selectedUser?.roleData,
                                                                              emergencyContact: {
                                                                                  ...selectedUser
                                                                                      .roleData
                                                                                      ?.emergencyContact,
                                                                                  name:
                                                                                      selectedUser
                                                                                          .roleData
                                                                                          ?.emergencyContact
                                                                                          ?.name ||
                                                                                      '',
                                                                                  phone:
                                                                                      selectedUser
                                                                                          .roleData
                                                                                          ?.emergencyContact
                                                                                          ?.phone ||
                                                                                      '',
                                                                                  relation:
                                                                                      e.target
                                                                                          .value,
                                                                              },
                                                                          },
                                                                      },
                                                            )
                                                        }
                                                        placeholder="Enter relation"
                                                        data-oid="41ourn:"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedUser?.role == 'vendor' && (
                                    <div className="space-y-4" data-oid="e7ioauy">
                                        <h3 className="text-lg font-semibold" data-oid="vu6tly2">
                                            Vendor Information
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4" data-oid="mmddt:i">
                                            <div data-oid="_.52e7o">
                                                <Label
                                                    htmlFor="edit-companyName"
                                                    data-oid="bmc9ony"
                                                >
                                                    Company Name
                                                </Label>
                                                <Input
                                                    id="edit-companyName"
                                                    value={
                                                        editingUser?.companyName ||
                                                        selectedUser?.companyName ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditingUser((prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      roleData: {
                                                                          ...prev.roleData,
                                                                          companyName:
                                                                              e.target.value,
                                                                      },
                                                                  }
                                                                : {
                                                                      ...selectedUser,
                                                                      roleData: {
                                                                          ...selectedUser?.roleData,
                                                                          companyName:
                                                                              e.target.value,
                                                                      },
                                                                  },
                                                        )
                                                    }
                                                    placeholder="Enter company name"
                                                    data-oid="zmeh4t."
                                                />
                                            </div>

                                            <div data-oid="enwdrgt">
                                                <Label
                                                    htmlFor="edit-supplierType"
                                                    data-oid="tuwb_j4"
                                                >
                                                    Supplier Type
                                                </Label>
                                                <Select
                                                    value={
                                                        editingUser?.supplierType ||
                                                        selectedUser?.supplierType ||
                                                        'select-type'
                                                    }
                                                    onValueChange={(value) =>
                                                        setEditingUser((prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      roleData: {
                                                                          ...prev.roleData,
                                                                          supplierType:
                                                                              value ==
                                                                              'select-type'
                                                                                  ? undefined
                                                                                  : (value as
                                                                                        | 'manufacturer'
                                                                                        | 'distributor'
                                                                                        | 'wholesaler'),
                                                                      },
                                                                  }
                                                                : {
                                                                      ...selectedUser,
                                                                      roleData: {
                                                                          ...selectedUser?.roleData,
                                                                          supplierType:
                                                                              value ==
                                                                              'select-type'
                                                                                  ? undefined
                                                                                  : (value as
                                                                                        | 'manufacturer'
                                                                                        | 'distributor'
                                                                                        | 'wholesaler'),
                                                                      },
                                                                  },
                                                        )
                                                    }
                                                    data-oid="3lahjxq"
                                                >
                                                    <SelectTrigger data-oid="evj68nx">
                                                        <SelectValue
                                                            placeholder="Select supplier type"
                                                            data-oid="tsez9n7"
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent data-oid="whcnsao">
                                                        <SelectItem
                                                            value="select-type"
                                                            data-oid="4czb-ha"
                                                        >
                                                            Select Type
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="manufacturer"
                                                            data-oid="pfcn.h-"
                                                        >
                                                            Manufacturer
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="distributor"
                                                            data-oid="w1609x."
                                                        >
                                                            Distributor
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="wholesaler"
                                                            data-oid="o:1bnag"
                                                        >
                                                            Wholesaler
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="col-span-2" data-oid="2myk4a5">
                                                <Label
                                                    htmlFor="edit-phone"
                                                    data-oid="8g_ze5v"
                                                >
                                                    Vendor Phone Numbers
                                                </Label>
                                                <div className="space-y-2 mt-2" data-oid="ebqpu.i">
                                                    {(
                                                        editingUser?.phone ||
                                                        selectedUser?.phone || [
                                                            selectedUser?.phone ||
                                                                '',
                                                        ]
                                                    ).map((phone, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center space-x-2"
                                                            data-oid="eba:15b"
                                                        >
                                                            <Input
                                                                value={phone}
                                                                onChange={(e) => {
                                                                    const currentPhones =
                                                                        editingUser?.roleData
                                                                            ?.phone ||
                                                                            selectedUser?.roleData
                                                                                ?.phone || [
                                                                                selectedUser
                                                                                    .roleData
                                                                                    ?.phone ||
                                                                                    '',
                                                                            ];

                                                                    const updatedPhones = [
                                                                        ...currentPhones,
                                                                    ];

                                                                    updatedPhones[index] =
                                                                        e.target.value;

                                                                    setEditingUser((prev) =>
                                                                        prev
                                                                            ? {
                                                                                  ...prev,
                                                                                  roleData: {
                                                                                      ...prev.roleData,
                                                                                      phone:
                                                                                          updatedPhones,
                                                                                  },
                                                                              }
                                                                            : {
                                                                                  ...selectedUser,
                                                                                  roleData: {
                                                                                      ...selectedUser?.roleData,
                                                                                      phone:
                                                                                          updatedPhones,
                                                                                  },
                                                                              },
                                                                    );
                                                                }}
                                                                placeholder="+20 XXX XXX XXXX"
                                                                className="flex-1"
                                                                data-oid="f6mwr67"
                                                            />

                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    console.log(
                                                                        'Remove vendor phone button clicked for index:',
                                                                        index,
                                                                    );

                                                                    const currentPhones =
                                                                        editingUser?.roleData
                                                                            ?.phone ||
                                                                            selectedUser?.roleData
                                                                                ?.phone || [
                                                                                selectedUser
                                                                                    .roleData
                                                                                    ?.phone ||
                                                                                    '',
                                                                            ];

                                                                    console.log(
                                                                        'Current vendor phones before removal:',
                                                                        currentPhones,
                                                                    );

                                                                    const updatedPhones =
                                                                        currentPhones.filter(
                                                                            (_, i) => i !== index,
                                                                        );

                                                                    // Ensure at least one empty phone field remains
                                                                    if (
                                                                        updatedPhones.length == 0
                                                                    ) {
                                                                        updatedPhones.push('');
                                                                    }

                                                                    console.log(
                                                                        'Updated vendor phones after removal:',
                                                                        updatedPhones,
                                                                    );

                                                                    setEditingUser((prev) => {
                                                                        const newUser = prev
                                                                            ? {
                                                                                  ...prev,
                                                                                  roleData: {
                                                                                      ...prev.roleData,
                                                                                      phone:
                                                                                          updatedPhones,
                                                                                  },
                                                                              }
                                                                            : {
                                                                                  ...selectedUser,
                                                                                  roleData: {
                                                                                      ...selectedUser?.roleData,
                                                                                      phone:
                                                                                          updatedPhones,
                                                                                  },
                                                                              };

                                                                        console.log(
                                                                            'Setting new user state after vendor phone removal:',
                                                                            newUser,
                                                                        );
                                                                        return newUser;
                                                                    });
                                                                }}
                                                                className="text-red-600 hover:text-red-700"
                                                                data-oid="hp7s5:t"
                                                            >
                                                                <Trash2
                                                                    className="w-4 h-4"
                                                                    data-oid="81gfo0a"
                                                                />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            console.log(
                                                                'Add Vendor Phone Number button clicked',
                                                            );

                                                            const currentPhones = editingUser
                                                                ?.phone ||
                                                                selectedUser?.roleData
                                                                    ?.phone || [
                                                                    selectedUser?.roleData
                                                                        ?.phone || '',
                                                                ];

                                                            console.log(
                                                                'Current vendor phones:',
                                                                currentPhones,
                                                            );

                                                            const updatedPhones = [
                                                                ...currentPhones.filter(
                                                                    (phone) => phone.trim() !== '',
                                                                ),
                                                                '',
                                                            ];

                                                            console.log(
                                                                'Updated vendor phones:',
                                                                updatedPhones,
                                                            );

                                                            setEditingUser((prev) => {
                                                                const newUser = prev
                                                                    ? {
                                                                          ...prev,
                                                                          roleData: {
                                                                              ...prev.roleData,
                                                                              phone:
                                                                                  updatedPhones,
                                                                          },
                                                                      }
                                                                    : {
                                                                          ...selectedUser,
                                                                          roleData: {
                                                                              ...selectedUser?.roleData,
                                                                              phone:
                                                                                  updatedPhones,
                                                                          },
                                                                      };

                                                                console.log(
                                                                    'Setting new user state for vendor phones:',
                                                                    newUser,
                                                                );
                                                                return newUser;
                                                            });
                                                        }}
                                                        className="w-full"
                                                        data-oid="gcl99nb"
                                                    >
                                                        <Phone
                                                            className="w-4 h-4 mr-2"
                                                            data-oid="2x79vlw"
                                                        />
                                                        Add Vendor Phone Number
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div data-oid="htlwmi0">
                                            <Label
                                                htmlFor="edit-productCategories"
                                                data-oid="mn5nl8d"
                                            >
                                                Product Categories
                                            </Label>
                                            <Textarea
                                                id="edit-productCategories"
                                                value={
                                                    editingUser?.productCategories?.join(
                                                        ', ',
                                                    ) ||
                                                    selectedUser?.productCategories?.join(
                                                        ', ',
                                                    ) ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setEditingUser((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  roleData: {
                                                                      ...prev.roleData,
                                                                      productCategories:
                                                                          e.target.value
                                                                              .split(', ')
                                                                              .filter((item) =>
                                                                                  item.trim(),
                                                                              ),
                                                                  },
                                                              }
                                                            : {
                                                                  ...selectedUser,
                                                                  roleData: {
                                                                      ...selectedUser?.roleData,
                                                                      productCategories:
                                                                          e.target.value
                                                                              .split(', ')
                                                                              .filter((item) =>
                                                                                  item.trim(),
                                                                              ),
                                                                  },
                                                              },
                                                    )
                                                }
                                                placeholder="Enter product categories separated by commas"
                                                rows={3}
                                                data-oid="scyo1c4"
                                            />
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="account" className="space-y-4" data-oid=":qhvt4l">
                                <div className="grid grid-cols-2 gap-4" data-oid="eupn_.h">
                                    <div data-oid="5qc8i-d">
                                        <Label htmlFor="edit-status" data-oid="1-ml8l3">
                                            Account Status
                                        </Label>
                                        <Select
                                            value={editingUser?.status || selectedUser?.status}
                                            onValueChange={(value) =>
                                                setEditingUser((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              status: value as
                                                                  | 'active'
                                                                  | 'inactive'
                                                                  | 'pending'
                                                                  | 'suspended'
                                                                  | 'banned',
                                                          }
                                                        : {
                                                              ...selectedUser,
                                                              status: value as
                                                                  | 'active'
                                                                  | 'inactive'
                                                                  | 'pending'
                                                                  | 'suspended'
                                                                  | 'banned',
                                                          },
                                                )
                                            }
                                            data-oid="83.weht"
                                        >
                                            <SelectTrigger data-oid="e62n8mb">
                                                <SelectValue
                                                    placeholder="Select status"
                                                    data-oid="::-rkxz"
                                                />
                                            </SelectTrigger>
                                            <SelectContent data-oid="xoemf1.">
                                                <SelectItem value="active" data-oid="r2mjag.">
                                                    Active
                                                </SelectItem>
                                                <SelectItem value="pending" data-oid="lh1gcde">
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value="suspended" data-oid="du.b16n">
                                                    Suspended
                                                </SelectItem>
                                                <SelectItem value="banned" data-oid="3tphsun">
                                                    Banned
                                                </SelectItem>
                                                <SelectItem value="inactive" data-oid="7u-epkz">
                                                    Inactive
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div data-oid="078q9v."></div>

                                    <div data-oid="s4_q.ta">
                                        <Label htmlFor="edit-emailVerified" data-oid="y4-m5kw">
                                            Email Verified
                                        </Label>
                                        <Select
                                            value={
                                                editingUser?.emailVerified && editingUser?.emailVerified !== undefined
                                                    ? editingUser?.emailVerified?.toString()
                                                    : selectedUser?.emailVerified?.toString()
                                            }
                                            onValueChange={(value) =>
                                                setEditingUser((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              emailVerified: value == 'true',
                                                          }
                                                        : {
                                                              ...selectedUser,
                                                              emailVerified: value == 'true',
                                                          },
                                                )
                                            }
                                            data-oid="j9:lr5r"
                                        >
                                            <SelectTrigger data-oid="9h64piw">
                                                <SelectValue
                                                    placeholder="Select verification status"
                                                    data-oid="svgituh"
                                                />
                                            </SelectTrigger>
                                            <SelectContent data-oid="vuc3f0y">
                                                <SelectItem value="true" data-oid="y.u7m-u">
                                                    Verified
                                                </SelectItem>
                                                <SelectItem value="false" data-oid="g-5ncpa">
                                                    Not Verified
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div data-oid="484gr19">
                                        <Label htmlFor="edit-phoneVerified" data-oid="0:wd9p4">
                                            Phone Verified
                                        </Label>
                                        <Select
                                            value={
                                                editingUser?.phoneVerified !== undefined
                                                    ? editingUser?.phoneVerified?.toString()
                                                    : selectedUser?.phoneVerified?.toString()
                                            }
                                            onValueChange={(value) =>
                                                setEditingUser((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              phoneVerified: value == 'true',
                                                          }
                                                        : {
                                                              ...selectedUser,
                                                              phoneVerified: value == 'true',
                                                          },
                                                )
                                            }
                                            data-oid="_lfsrw5"
                                        >
                                            <SelectTrigger data-oid="5ldmvvv">
                                                <SelectValue
                                                    placeholder="Select verification status"
                                                    data-oid="f2bsasa"
                                                />
                                            </SelectTrigger>
                                            <SelectContent data-oid="2:_qlh.">
                                                <SelectItem value="true" data-oid="uk-poy:">
                                                    Verified
                                                </SelectItem>
                                                <SelectItem value="false" data-oid="be2yqlf">
                                                    Not Verified
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div data-oid="ncsp1fu">
                                        <Label htmlFor="edit-twoFactorEnabled" data-oid="iowc4ql">
                                            Two-Factor Authentication
                                        </Label>
                                        <Select
                                            value={
                                                editingUser?.twoFactorEnabled !== undefined
                                                    ? editingUser?.twoFactorEnabled?.toString()
                                                    : selectedUser?.twoFactorEnabled?.toString()
                                            }
                                            onValueChange={(value) =>
                                                setEditingUser((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              twoFactorEnabled: value == 'true',
                                                          }
                                                        : {
                                                              ...selectedUser,
                                                              twoFactorEnabled: value == 'true',
                                                          },
                                                )
                                            }
                                            data-oid="52_9ox5"
                                        >
                                            <SelectTrigger data-oid="2d9o_.f">
                                                <SelectValue
                                                    placeholder="Select 2FA status"
                                                    data-oid="vqxr9rk"
                                                />
                                            </SelectTrigger>
                                            <SelectContent data-oid="2w1fya1">
                                                <SelectItem value="true" data-oid="x7nu9eu">
                                                    Enabled
                                                </SelectItem>
                                                <SelectItem value="false" data-oid="-mxuy27">
                                                    Disabled
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}

                    <div className="flex justify-end space-x-2 pt-4 border-t" data-oid="nv21zmc">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowEditModal(false);
                                setEditingUser(null);
                                setSelectedUser(null);
                            }}
                            data-oid="96tbx-c"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditUser}
                            className="bg-cura-primary hover:bg-cura-secondary"
                            data-oid="jma4fcr"
                        >
                            Save Changes
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* User Details Modal */}
            <Dialog open={showUserDetails} onOpenChange={setShowUserDetails} data-oid="z10tu4r">
                <DialogContent
                    className="max-w-4xl max-h-[90vh] overflow-y-auto"
                    data-oid="xci1q4:"
                >
                    <DialogHeader data-oid="c5i6nht">
                        <DialogTitle data-oid="spt9y-a">User Account Details</DialogTitle>
                        <DialogDescription data-oid="lgvfuqq">
                            Complete information for {selectedUser?.name}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <Tabs defaultValue="overview" className="w-full" data-oid="kczz6ct">
                            <TabsList className="grid w-full grid-cols-5" data-oid="g-rzsiv">
                                <TabsTrigger value="overview" data-oid="1uh.kwd">
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger value="personal" data-oid="o:1b4d1">
                                    Personal
                                </TabsTrigger>
                                <TabsTrigger value="role" data-oid="659ud2q">
                                    Role Info
                                </TabsTrigger>
                                <TabsTrigger value="activity" data-oid="1miaa3x">
                                    Activity
                                </TabsTrigger>
                                <TabsTrigger value="security" data-oid="ryuua2o">
                                    Security
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4" data-oid="wsg3fqn">
                                <div className="grid grid-cols-2 gap-4" data-oid="a2c8_sf">
                                    <Card data-oid="swpa5:q">
                                        <CardHeader data-oid="uqurkbm">
                                            <CardTitle className="text-lg" data-oid="tu79jmu">
                                                Account Summary
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2" data-oid="u8e:vd1">
                                            <div
                                                className="flex justify-between"
                                                data-oid="c34o:87"
                                            >
                                                <span className="text-gray-600" data-oid="6kpyrlp">
                                                    Status:
                                                </span>
                                                <Badge
                                                    className={getStatusColor(selectedUser?.status)}
                                                    data-oid="6n:g.d3"
                                                >
                                                    {selectedUser?.status}
                                                </Badge>
                                            </div>
                                            <div
                                                className="flex justify-between"
                                                data-oid="8.x1f2k"
                                            >
                                                <span className="text-gray-600" data-oid="wastomy">
                                                    User Type:
                                                </span>
                                                <span
                                                    className="font-medium capitalize"
                                                    data-oid="xhov52y"
                                                >
                                                    {selectedUser?.role}
                                                </span>
                                            </div>
                                            <div
                                                className="flex justify-between"
                                                data-oid="qhg8pu9"
                                            >
                                                <span className="text-gray-600" data-oid="tc4us1x">
                                                    Member Since:
                                                </span>
                                                <span data-oid="gdfr4nb">
                                                    {new Date(
                                                        selectedUser?.createdAt,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div
                                                className="flex justify-between"
                                                data-oid="szwtyeq"
                                            >
                                                <span className="text-gray-600" data-oid="s8j3kt8">
                                                    Profile Complete:
                                                </span>
                                                <span data-oid="oc9esqk">
                                                    {selectedUser?.profileComplete ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card data-oid="gr1hl-:">
                                        <CardHeader data-oid="_4ebh5j">
                                            <CardTitle className="text-lg" data-oid="lea-e-j">
                                                Performance Metrics
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2" data-oid="eax-sh2">
                                            {selectedUser?.order && (
                                                <div
                                                    className="flex justify-between"
                                                    data-oid="z8y_o.."
                                                >
                                                    <span
                                                        className="text-gray-600"
                                                        data-oid="kdt5:no"
                                                    >
                                                        Total Orders:
                                                    </span>
                                                    <span
                                                        className="font-medium"
                                                        data-oid=".h125af"
                                                    >
                                                        {selectedUser?.order.length}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedUser?.totalRevenue && (
                                                <div
                                                    className="flex justify-between"
                                                    data-oid="q7mpmov"
                                                >
                                                    <span
                                                        className="text-gray-600"
                                                        data-oid="vn57_6r"
                                                    >
                                                        Total Revenue:
                                                    </span>
                                                    <span
                                                        className="font-medium"
                                                        data-oid="pecrj8o"
                                                    >
                                                        EGP{' '}
                                                        NA
                                                    </span>
                                                </div>
                                            )}

                                            {selectedUser?.completedOrders && (
                                                <div
                                                    className="flex justify-between"
                                                    data-oid="afvb116"
                                                >
                                                    <span
                                                        className="text-gray-600"
                                                        data-oid="d5t5reu"
                                                    >
                                                        Completion Rate:
                                                    </span>
                                                    <span
                                                        className="font-medium"
                                                        data-oid="0yqvoj-"
                                                    >
                                                        NA%
                                                    </span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="personal" className="space-y-4" data-oid="k3et-zh">
                                <div className="grid grid-cols-2 gap-4" data-oid="6za17mb">
                                    <div data-oid="4d35mtb">
                                        <Label data-oid="hqd:xm.">Full Name</Label>
                                        <div className="text-lg font-medium" data-oid="7exjl1j">
                                            {selectedUser?.name}
                                        </div>
                                    </div>
                                    <div data-oid="6abx549">
                                        <Label data-oid="v_0pm_g">National ID</Label>
                                        <div data-oid="svcusb3">
                                            {selectedUser?.nationalId || 'Not provided'}
                                        </div>
                                    </div>
                                    <div data-oid="z2ik2cc">
                                        <Label data-oid="flwag46">Email Address</Label>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="1dbr_j5"
                                        >
                                            <span data-oid="0ch-atn">{selectedUser?.email}</span>
                                            {selectedUser?.emailVerified && (
                                                <CheckCircle
                                                    className="w-4 h-4 text-green-600"
                                                    data-oid="0n9f9ar"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div data-oid="m-vm3km">
                                        <Label data-oid="kgn9cgv">Phone Number</Label>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="n1gi2bo"
                                        >
                                            <span data-oid="ft3349z">{selectedUser?.phone}</span>
                                            {selectedUser?.phoneVerified && (
                                                <CheckCircle
                                                    className="w-4 h-4 text-green-600"
                                                    data-oid="v5cxpm:"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {selectedUser?.whatsappNumber && (
                                        <div data-oid="m73bdun">
                                            <Label data-oid="9odw90y">WhatsApp Number</Label>
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="6xj:2vn"
                                            >
                                                <svg
                                                    className="w-4 h-4 text-green-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                    data-oid="q5war09"
                                                >
                                                    <path
                                                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386"
                                                        data-oid="bvh.1h2"
                                                    />
                                                </svg>
                                                <span data-oid="rbwcg:n">
                                                    {selectedUser?.whatsappNumber}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div data-oid="g_b3-3v">
                                        <Label data-oid=".k:l.::">Date of Birth</Label>
                                        <div data-oid="z9l4abk">
                                            {selectedUser?.dateOfBirth
                                                ? new Date(
                                                      selectedUser?.dateOfBirth,
                                                  ).toLocaleDateString()
                                                : 'Not provided'}
                                        </div>
                                    </div>
                                    <div data-oid="nrgiso.">
                                        <Label data-oid="bl3hc8p">Gender</Label>
                                        <div className="capitalize" data-oid="7m.x.la">
                                            {selectedUser?.gender || 'Not specified'}
                                        </div>
                                    </div>
                                </div>

                                <div data-oid="r3p1gk.">
                                    <Label data-oid="c32e51b">Address</Label>
                                    <div className="mt-1" data-oid="85.cj.3">
                                        <div data-oid="4mj32yf">{selectedUser?.address}</div>
                                        <div className="text-sm text-gray-600" data-oid="ssv3m:c">
                                            {selectedUser?.city}, {selectedUser?.governorate}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="role" className="space-y-4" data-oid="s9cv1ku">
                                <div data-oid="o64f6xl">
                                    <Label className="text-lg" data-oid="s3iu-_3">
                                        Role-Specific Information
                                    </Label>
                                    <div className="mt-2 space-y-4" data-oid="a7p09mi">
                                        {selectedUser?.role == 'pharmacy' &&
                                              (
                                                <div className="space-y-2" data-oid="zuvec82">
                                                    <div data-oid="gzutrow">
                                                        <strong data-oid="uxmu:z2">
                                                            Pharmacy Name (English):
                                                        </strong>{' '}
                                                        {selectedUser?.businessName}
                                                    </div>
                                                    {selectedUser?.businessNameArabic && (
                                                        <div data-oid="e2o22au">
                                                            <strong data-oid="u0t8l_4">
                                                                Pharmacy Name (Arabic):
                                                            </strong>{' '}
                                                            <span
                                                                dir="rtl"
                                                                className="text-right inline-block"
                                                                data-oid="a.0vbgw"
                                                            >
                                                                {
                                                                    selectedUser?.businessNameAr
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div data-oid="62a-3y-">
                                                        <strong data-oid="-1t7r3.">
                                                            License Number:
                                                        </strong>{' '}
                                                        {selectedUser?.licenseNumber}
                                                    </div>
                                                    <div data-oid="pntrw-k">
                                                        <strong data-oid="d1gefps">
                                                            Operating Hours:
                                                        </strong>{' '}
                                                        {selectedUser?.operatingHours?.open}{' '}
                                                        -{' '}
                                                        {
                                                            selectedUser?.operatingHours
                                                                ?.close
                                                        }
                                                    </div>
                                                    <div data-oid="c2qtl-a">
                                                        <strong data-oid="4gx6nh1">
                                                            Commission Rate:
                                                        </strong>{' '}
                                                        {selectedUser?.commision}%
                                                    </div>
                                                    {/* {(selectedUser?.phone ||
                                                        selectedUser?.phone) && (
                                                        <div data-oid="6duacjp">
                                                            <strong data-oid="6p8vmw_">
                                                                Phone Numbers:
                                                            </strong>
                                                            <ul
                                                                className="list-disc list-inside mt-1"
                                                                data-oid="9lbyitf"
                                                            >
                                                                {selectedUser?.phone
                                                                    ? selectedUser?.phone.map(
                                                                          (phone, index) => (
                                                                              <li
                                                                                  key={index}
                                                                                  data-oid="qg74zy1"
                                                                              >
                                                                                  {phone}
                                                                              </li>
                                                                          ),
                                                                      )
                                                                    : selectedUser?.roleData
                                                                          .phone && (
                                                                          <li data-oid="maax6ea">
                                                                              {
                                                                                  selectedUser.phone
                                                                              }
                                                                          </li>
                                                                      )}
                                                            </ul>
                                                        </div>
                                                    )} */}
                                                    {selectedUser?.servicesOffered && (
                                                        <div data-oid="xgcnj_0">
                                                            <strong data-oid="-4u__bo">
                                                                Services Offered:
                                                            </strong>
                                                            <ul
                                                                className="list-disc list-inside mt-1"
                                                                data-oid="-.0fqgw"
                                                            >
                                                                {selectedUser?.servicesOffered.map(
                                                                    (service, index) => (
                                                                        <li
                                                                            key={index}
                                                                            data-oid="nadw1yk"
                                                                        >
                                                                            {service}
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        {selectedUser?.role == 'doctor' &&
                                              (
                                                <div className="space-y-2" data-oid="zd01kf5">
                                                    <div data-oid="f-5rux9">
                                                        <strong data-oid="z7zqtif">
                                                            Specialization:
                                                        </strong>{' '}
                                                        {selectedUser?.specialization}
                                                    </div>

                                                    <div data-oid="_:7safp">
                                                        <strong data-oid="jzrnni9">
                                                            Clinic Name:
                                                        </strong>{' '}
                                                        {selectedUser?.clinicName}
                                                    </div>
                                                    <div data-oid="pvkeot7">
                                                        <strong data-oid="rva:7r1">
                                                            Clinic Address:
                                                        </strong>{' '}
                                                        {selectedUser?.clinicAddress}
                                                    </div>
                                                    {(selectedUser?.phone ||
                                                        selectedUser?.phone) && (
                                                        <div data-oid="ki44mh-">
                                                            <strong data-oid="3ctiwce">
                                                                Clinic Phone Numbers:
                                                            </strong>
                                                            <ul
                                                                className="list-disc list-inside mt-1"
                                                                data-oid="ikdj2wv"
                                                            >
                                                                {selectedUser?.phone
                                                                    ? selectedUser?.phone.map(
                                                                          (phone, index) => (
                                                                              <li
                                                                                  key={index}
                                                                                  data-oid=":yz4983"
                                                                              >
                                                                                  {phone}
                                                                              </li>
                                                                          ),
                                                                      )
                                                                    : selectedUser?.roleData
                                                                          .phone && (
                                                                          <li data-oid="9eyfj:d">
                                                                              {
                                                                                  selectedUser
                                                                                      .roleData
                                                                                      .phone
                                                                              }
                                                                          </li>
                                                                      )}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {selectedUser?.commision && (
                                                        <div data-oid="d9w:rza">
                                                            <strong data-oid="9fkebpf">
                                                                Referral Commission:
                                                            </strong>{' '}
                                                            {
                                                                selectedUser?.commission
                                                            }
                                                            %
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        {selectedUser?.role == 'vendor' &&
                                              (
                                                <div className="space-y-2" data-oid="4y_lkh:">
                                                    <div data-oid="espv.zn">
                                                        <strong data-oid="x9-m7s:">
                                                            Company Name:
                                                        </strong>{' '}
                                                        {selectedUser?.vendorName}
                                                    </div>
                                                    {selectedUser?.supplierType && (
                                                        <div data-oid="8v1qi-.">
                                                            <strong data-oid="0:pzmll">
                                                                Supplier Type:
                                                            </strong>{' '}
                                                            <span
                                                                className="capitalize"
                                                                data-oid="fpw6i0v"
                                                            >
                                                                {selectedUser?.supplierType}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {(selectedUser?.phone ||
                                                        selectedUser?.phone) && (
                                                        <div data-oid="e8sea3w">
                                                            <strong data-oid="t:db:uy">
                                                                Vendor Phone Numbers:
                                                            </strong>
                                                            <ul
                                                                className="list-disc list-inside mt-1"
                                                                data-oid="x1subja"
                                                            >
                                                                <li>
                                                                    {selectedUser?.phone && selectedUser.phone}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {selectedUser?.productCategories && (
                                                        <div data-oid="7gwn-av">
                                                            <strong data-oid="gidhi13">
                                                                Product Categories:
                                                            </strong>
                                                            <ul
                                                                className="list-disc list-inside mt-1"
                                                                data-oid="8se3nxz"
                                                            >
                                                                {selectedUser?.productCategories.map(
                                                                    (category, index) => (
                                                                        <li
                                                                            key={index}
                                                                            data-oid="pz2x7ql"
                                                                        >
                                                                            {category}
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        {selectedUser?.role == 'customer' &&
                                              (
                                                <div className="space-y-2" data-oid="or-nib7">
                                                    {selectedUser?.medicalHistory && (
                                                        <div data-oid="cm:mef7">
                                                            <strong data-oid="gxv259w">
                                                                Medical History:
                                                            </strong>
                                                            <ul
                                                                className="list-disc list-inside mt-1"
                                                                data-oid="c9sv6l6"
                                                            >
                                                                {selectedUser?.medicalHistory.map(
                                                                    (condition, index) => (
                                                                        <li
                                                                            key={index}
                                                                            data-oid="5pngsge"
                                                                        >
                                                                            {condition}
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {selectedUser?.allergies && (
                                                        <div data-oid="9442l3r">
                                                            <strong data-oid="2q3-3xs">
                                                                Allergies:
                                                            </strong>
                                                            <ul
                                                                className="list-disc list-inside mt-1"
                                                                data-oid="_rwrknt"
                                                            >
                                                                {selectedUser?.allergies.map(
                                                                    (allergy, index) => (
                                                                        <li
                                                                            key={index}
                                                                            data-oid="iin3eek"
                                                                        >
                                                                            {allergy}
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {selectedUser?.emergencyContact && (
                                                        <div data-oid="o-c6b-n">
                                                            <strong data-oid="knf0k:o">
                                                                Emergency Contact:
                                                            </strong>
                                                            <div
                                                                className="mt-1"
                                                                data-oid="9wll8t0"
                                                            >
                                                                {
                                                                    selectedUser?.contactPerson
                                                                }{' '}
                                                                (
                                                                {
                                                                    "owner"
                                                                }
                                                                )
                                                                <br data-oid="2r0en0d" />
                                                                {
                                                                    selectedUser?.phone
                                                                }
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="activity" className="space-y-4" data-oid="1unytiy">
                                <div className="space-y-4" data-oid="fv417dv">
                                    <div data-oid="4jp1uuh">
                                        <Label data-oid="5yj:auw">Account Activity</Label>
                                        <div className="mt-2 space-y-2" data-oid="y03sqan">
                                            <div
                                                className="flex justify-between"
                                                data-oid="swej0c_"
                                            >
                                                <span data-oid="r4bs-y_">Last Login:</span>
                                                <span data-oid="nqsuz1e">
                                                    {selectedUser?.lastLogin
                                                        ? new Date(
                                                              selectedUser?.lastLogin,
                                                          ).toLocaleString()
                                                        : 'Never'}
                                                </span>
                                            </div>
                                            <div
                                                className="flex justify-between"
                                                data-oid=".n1gjlq"
                                            >
                                                <span data-oid="a9z14f.">Last Activity:</span>
                                                <span data-oid="9cklqq9">
                                                    {selectedUser?.lastActivity
                                                        ? new Date(
                                                              selectedUser?.lastActivity,
                                                          ).toLocaleString()
                                                        : 'Never'}
                                                </span>
                                            </div>
                                            <div
                                                className="flex justify-between"
                                                data-oid="tsen9ry"
                                            >
                                                <span data-oid="t314wsw">Account Created:</span>
                                                <span data-oid="hd6qr8n">
                                                    {new Date(
                                                        selectedUser?.createdAt,
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                            <div
                                                className="flex justify-between"
                                                data-oid="iqkhyia"
                                            >
                                                <span data-oid="j33.:ls">Last Updated:</span>
                                                <span data-oid="jxiajm-">
                                                    {new Date(
                                                        selectedUser?.updatedAt,
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="security" className="space-y-4" data-oid="4u3-tv_">
                                <div className="space-y-4" data-oid="us-llhe">
                                    <div data-oid="-4s7:8q">
                                        <Label data-oid="k20f.m.">Security Settings</Label>
                                        <div className="mt-2 space-y-2" data-oid=":7sluub">
                                            <div
                                                className="flex justify-between items-center"
                                                data-oid="b4.n_sj"
                                            >
                                                <span data-oid="wnu_is-">Email Verified:</span>
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid=".8-qyl4"
                                                >
                                                    {selectedUser?.emailVerified ? (
                                                        <CheckCircle
                                                            className="w-4 h-4 text-green-600"
                                                            data-oid="r6:m.wa"
                                                        />
                                                    ) : (
                                                        <XCircle
                                                            className="w-4 h-4 text-red-600"
                                                            data-oid="hw7lvh2"
                                                        />
                                                    )}
                                                    <span data-oid="enoit3f">
                                                        {selectedUser?.emailVerified ? 'Yes' : 'No'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="flex justify-between items-center"
                                                data-oid="4qmv-zk"
                                            >
                                                <span data-oid="cdztzr9">Phone Verified:</span>
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="lor028k"
                                                >
                                                    {selectedUser?.phoneVerified ? (
                                                        <CheckCircle
                                                            className="w-4 h-4 text-green-600"
                                                            data-oid="xsc88ki"
                                                        />
                                                    ) : (
                                                        <XCircle
                                                            className="w-4 h-4 text-red-600"
                                                            data-oid="3.l7z6q"
                                                        />
                                                    )}
                                                    <span data-oid="0c1h_ht">
                                                        {selectedUser?.phoneVerified ? 'Yes' : 'No'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="flex justify-between items-center"
                                                data-oid="rcrb505"
                                            >
                                                <span data-oid="bnubo0:">
                                                    Two-Factor Authentication:
                                                </span>
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="z317n00"
                                                >
                                                    {selectedUser?.twoFactorEnabled ? (
                                                        <CheckCircle
                                                            className="w-4 h-4 text-green-600"
                                                            data-oid="7k2caaa"
                                                        />
                                                    ) : (
                                                        <XCircle
                                                            className="w-4 h-4 text-red-600"
                                                            data-oid="qwv:x.a"
                                                        />
                                                    )}
                                                    <span data-oid="bwheqw5">
                                                        {selectedUser?.twoFactorEnabled
                                                            ? 'Enabled'
                                                            : 'Disabled'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="flex justify-between"
                                                data-oid="awk_icg"
                                            >
                                                <span data-oid="jr9s6yc">Login Attempts:</span>
                                                <span data-oid="p83_2mh">
                                                    {selectedUser?.loginAttempts || "NA"}
                                                </span>
                                            </div>
                                            <div
                                                className="flex justify-between"
                                                data-oid="q0gn0_0"
                                            >
                                                <span data-oid="f2m5r15">
                                                    Password Last Changed:
                                                </span>
                                                <span data-oid="br_0qum">
                                                    {selectedUser?.passwordLastChanged
                                                        ? new Date(
                                                              selectedUser?.passwordLastChanged,
                                                          ).toLocaleDateString()
                                                        : 'Never'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
