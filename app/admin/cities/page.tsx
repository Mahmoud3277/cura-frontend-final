'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Plus,
    Search,
    MapPin,
    Users,
    Building2,
    Edit,
    Trash2,
    Filter,
    Download,
    Eye,
    Settings,
    ToggleLeft,
    ToggleRight,
    Stethoscope,
    ShoppingBag,
    Building,
} from 'lucide-react';
import { AddCityModal } from '@/components/city/AddCityModal';
import { cityManagementService, CityWithStatus } from '@/lib/services/cityManagementService';
import { getAllGovernorates } from '@/lib/data/governorates';

// New components for the enhanced functionality
import CityDetailsModal from '@/components/city/CityDetailsModal';
import AddDistrictModal from '@/components/city/AddDistrictModal';
import { EditCityModal } from '@/components/city/EditCityModal';
import { RealTimeCityStats } from '@/components/city/RealTimeCityStats';
import { DeleteCityModal } from '@/components/city/DeleteCityModal';
import { NotificationContainer, useNotification } from '@/components/ui/notification';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface FilterState {
    governorate: string;
    status: string;
    sortBy: string;
}
interface Governorate {
    _id: string;
    nameEn: string;
    nameAr: string;
}
export default function AdminCitiesPage() {
    const [cities, setCities] = useState<CityWithStatus[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { notifications, removeNotification, showSuccess, showError, showWarning } =
        useNotification();
    const [showAddCityModal, setShowAddCityModal] = useState(false);
    const [showAddDistrictModal, setShowAddDistrictModal] = useState(false);
    const [showCityDetailsModal, setShowCityDetailsModal] = useState(false);
    const [showEditCityModal, setShowEditCityModal] = useState(false);
    const [showDeleteCityModal, setShowDeleteCityModal] = useState(false);
    const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
    const [selectedCityForEdit, setSelectedCityForEdit] = useState<CityWithStatus | null>(null);
    const [selectedCityForDelete, setSelectedCityForDelete] = useState<CityWithStatus | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showSetDefaultConfirm, setShowSetDefaultConfirm] = useState(false);
    const [showRemoveDefaultConfirm, setShowRemoveDefaultConfirm] = useState(false);
    const [selectedCityForDefault, setSelectedCityForDefault] = useState<CityWithStatus | null>(
        null,
    );
    const [governorates, setgovernorates] = useState<Governorate[]>([]);
    const [isProcessingDefault, setIsProcessingDefault] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        governorate: 'all',
        status: 'all',
        sortBy: 'name',
    });
    const [stats, setStats] = useState({
        totalCities: 0,
        enabledCities: 0,
        totalPharmacies: 0,
        totalDoctors: 0,
        totalVendors: 0,
    });

    useEffect(() => {
        loadCities();
        // loadStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, searchTerm]);
    const loadCities = async () => {
        setIsLoading(true);
        try {
            // Use the city management service to get cities with status
            const citiesData =await  cityManagementService.getCitiesWithStatus({
                governorateId: filters.governorate !== 'all' ? filters.governorate : undefined,
                status:
                    filters.status !== 'all'
                        ? (filters.status as 'enabled' | 'disabled')
                        : undefined,
                search: searchTerm,
                sortBy: filters.sortBy as any,
                sortOrder: 'asc',
            });
            
            console.log('in component', citiesData)
            setCities(citiesData);
        } catch (error) {
            console.error('Error loading cities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // const loadStats = async () => {
    //     try {
    //         // Import the integrated account service
    //         const { integratedAccountService } = await import(
    //             '@/lib/services/integratedAccountService'
    //         );

    //         // Get real-time statistics from the integrated service
    //         const analytics = integratedAccountService.getAccountCreationAnalytics();
    //         const statsData = cityManagementService.getStats();

    //         setStats({
    //             totalCities: statsData.totalCities,
    //             enabledCities: statsData.enabledCities,
    //             totalPharmacies: analytics.accountsByType.pharmacy,
    //             totalDoctors: analytics.accountsByType.doctor,
    //             totalVendors: analytics.accountsByType.vendor,
    //         });
    //     } catch (error) {
    //         console.error('Error loading stats:', error);
    //         // Fallback to original method
    //         const statsData = cityManagementService.getStats();
    //         setStats({
    //             totalCities: statsData.totalCities,
    //             enabledCities: statsData.enabledCities,
    //             totalPharmacies: statsData.totalPharmacies,
    //             totalDoctors: statsData.totalDoctors,
    //             totalVendors: Math.floor(statsData.totalPharmacies * 0.3),
    //         });
    //     }
    // };

    const handleToggleCityStatus = async (cityId: string) => {
        try {
            const success = await cityManagementService.toggleCityStatus(cityId);
            if (success) {
                loadCities();
                // loadStats();
            }
        } catch (error) {
            console.error('Error toggling city status:', error);
        }
    };

    const handleAddCity = async (cityData: any) => {
        try {
            const success = await cityManagementService.addNewCity(cityData);
            if (success) {
                loadCities();
                // loadStats();
                setShowAddCityModal(false);
            }
        } catch (error) {
            console.error('Error adding city:', error);
        }
    };

    const handleViewCityDetails = (cityId: string) => {
        setSelectedCityId(cityId);
        setShowCityDetailsModal(true);
    };

    const handleEditCity = (cityId: string) => {
        console.log('Edit button clicked for city:', cityId);
        const cityToEdit = cities.find((city) => city.id === cityId);
        console.log('Found city to edit:', cityToEdit);
        if (cityToEdit) {
            setSelectedCityForEdit(cityToEdit);
            setShowEditCityModal(true);
            console.log('Edit modal should now be open');
        } else {
            console.error('City not found:', cityId);
        }
    };

    const handleUpdateCity = async (cityData: any) => {
        try {
            // Validate required fields
            if (!cityData.nameEn || !cityData.nameAr || !cityData.governorateId) {
                console.error('Missing required fields');
                return;
            }

            const success = await cityManagementService.updateCity(cityData);
            if (success) {
                loadCities();
                // loadStats();
                setShowEditCityModal(false);
                setSelectedCityForEdit(null);
                console.log('City updated successfully');
            } else {
                console.error('Failed to update city');
            }
        } catch (error) {
            console.error('Error updating city:', error);
        }
    };

    const handleDeleteCity = (cityId: string) => {
        const cityToDelete = cities.find((city) => city.id === cityId);
        if (cityToDelete) {
            setSelectedCityForDelete(cityToDelete);
            setShowDeleteCityModal(true);
        }
    };

    const handleConfirmDeleteCity = async () => {
        if (!selectedCityForDelete) return;

        // Check if city can be deleted
        const deleteCheck = cityManagementService.canDeleteCity(selectedCityForDelete.id);

        if (!deleteCheck.canDelete) {
            showWarning('Cannot Delete City', deleteCheck.reason);
            return;
        }

        setIsDeleting(true);
        try {
            const success = await cityManagementService.deleteCity(selectedCityForDelete.id);
            if (success) {
                await loadCities();
                // await loadStats();
                showSuccess(
                    'City Deleted',
                    `${selectedCityForDelete.nameEn} has been successfully deleted.`,
                );
                setShowDeleteCityModal(false);
                setSelectedCityForDelete(null);
            } else {
                showError('Delete Failed', 'Failed to delete city. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting city:', error);
            showError('Delete Error', 'An error occurred while deleting the city.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSetDefaultCity = (cityId: string) => {
        const city = cities.find((c) => c.id === cityId);
        if (city) {
            setSelectedCityForDefault(city);
            setShowSetDefaultConfirm(true);
        }
    };

    const handleConfirmSetDefault = async () => {
        if (!selectedCityForDefault) return;

        setIsProcessingDefault(true);
        try {
            const success = await cityManagementService.setDefaultCity(selectedCityForDefault.id);
            if (success) {
                await loadCities();
                // await loadStats();
                showSuccess(
                    'Default City Set',
                    `${selectedCityForDefault.nameEn} is now the default city.`,
                );
                setShowSetDefaultConfirm(false);
                setSelectedCityForDefault(null);
            } else {
                showError('Update Failed', 'Failed to set default city. Please try again.');
            }
        } catch (error) {
            console.error('Error setting default city:', error);
            showError('Update Error', 'An error occurred while setting the default city.');
        } finally {
            setIsProcessingDefault(false);
        }
    };

    const handleRemoveDefaultCity = (cityId: string) => {
        const city = cities.find((c) => c.id === cityId);
        if (city) {
            setSelectedCityForDefault(city);
            setShowRemoveDefaultConfirm(true);
        }
    };

    const handleConfirmRemoveDefault = async () => {
        if (!selectedCityForDefault) return;

        setIsProcessingDefault(true);
        try {
            const success =await cityManagementService.removeDefaultCity(selectedCityForDefault.id);
            if (success) {
                await loadCities();
                // await loadStats();
                showSuccess(
                    'Default Status Removed',
                    `${selectedCityForDefault.nameEn} is no longer the default city.`,
                );
                setShowRemoveDefaultConfirm(false);
                setSelectedCityForDefault(null);
            } else {
                showError('Update Failed', 'Failed to remove default status. Please try again.');
            }
        } catch (error) {
            console.error('Error removing default status:', error);
            showError('Update Error', 'An error occurred while removing default status.');
        } finally {
            setIsProcessingDefault(false);
        }
    };

    const handleToggleCityStatusWithCheck = async (cityId: string) => {
        // Check if city can be disabled
        const city = cities.find((c) => c._id === cityId);
        // if (city?.isEnabled) {
        //     const disableCheck = cityManagementService.canDisableCity(cityId);
        //     if (!disableCheck.canDisable) {
        //         showWarning('Cannot Disable City', disableCheck.reason);
        //         return;
        //     }
        // }

        try {
            console.log(cityId)
            const success = await cityManagementService.toggleCityStatus(cityId);
            if (success) {
                loadCities();
                // loadStats();
                const action = city?.isEnabled ? 'disabled' : 'enabled';
                showSuccess('City Status Updated', `${city?.nameEn} has been ${action}.`);
            }
        } catch (error) {
            console.error('Error toggling city status:', error);
            showError('Update Error', 'An error occurred while updating city status.');
        }
    };

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const exportData = () => {
        const dataToExport = cities.map((city) => ({
            name: city.nameEn,
            governorate: city.governorateName,
            status: city.isEnabled ? 'Enabled' : 'Disabled',
            pharmacies: city.pharmacyCount,
            doctors: city.doctorCount,
            isDefault: city.isDefault,
        }));

        const csvContent = [
            ['City Name', 'Governorate', 'Status', 'Pharmacies', 'Doctors', 'Is Default'],
            ...dataToExport.map((city) => [
                city.name,
                city.governorate,
                city.status,
                city.pharmacies.toString(),
                city.doctors.toString(),
                city.isDefault ? 'Yes' : 'No',
            ]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cities-data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };
    const loadGovernorate = async()=>{
        try {
            const data = await getAllGovernorates();
            if(data){
                setgovernorates(data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        // loadStats()
        loadCities()
        loadGovernorate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 px-6 py-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-32"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <NotificationContainer notifications={notifications} onRemove={removeNotification} />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="bg-white rounded-lg border border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                City & District Management
                            </h1>
                            <p className="text-sm text-gray-600">
                                Control city availability for customers and manage service coverage
                                across Egypt
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" size="sm" onClick={exportData}>
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAddDistrictModal(true)}
                            >
                                <Building className="w-4 h-4 mr-2" />
                                Add District
                            </Button>
                            <Button size="sm" onClick={() => setShowAddCityModal(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add City
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Cities
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                                {stats.totalCities}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <span>Across Egypt</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Available to Customers
                            </CardTitle>
                            <ToggleRight className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {stats.enabledCities}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-green-600">
                                <span>Currently serving</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Pharmacies
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                                {stats.totalPharmacies}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <span>Across all cities</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Doctors
                            </CardTitle>
                            <Stethoscope className="h-4 w-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                                {stats.totalDoctors}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <span>Registered doctors</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Vendors
                            </CardTitle>
                            <ShoppingBag className="h-4 w-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                                {stats.totalVendors}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <span>Active vendors</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cities & Districts Management</CardTitle>
                        <CardDescription>
                            Enable or disable cities for customer access and view detailed
                            information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

                                <Input
                                    placeholder="Search cities or governorates..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select
                                value={filters.governorate}
                                onValueChange={(value) => handleFilterChange('governorate', value)}
                            >
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="All Governorates" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Governorates</SelectItem>
                                    {governorates && governorates.map((gov) => (
                                        <SelectItem key={gov._id} value={gov._id}>
                                            {gov.nameEn}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.status}
                                onValueChange={(value) => handleFilterChange('status', value)}
                            >
                                <SelectTrigger className="w-full md:w-40">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="enabled">Available</SelectItem>
                                    <SelectItem value="disabled">Disabled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.sortBy}
                                onValueChange={(value) => handleFilterChange('sortBy', value)}
                            >
                                <SelectTrigger className="w-full md:w-40">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="governorate">Governorate</SelectItem>
                                    <SelectItem value="pharmacies">Pharmacies</SelectItem>
                                    <SelectItem value="doctors">Doctors</SelectItem>
                                    <SelectItem value="status">Status</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Cities List */}
                        <div className="space-y-4">
                            {cities && cities.map((city) => (
                                <div
                                    key={city.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: '#14274E' }}
                                        >
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h3 className="font-semibold text-gray-900">
                                                    {city.nameEn}
                                                </h3>
                                                {city.isDefault && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                                        title="This is the default city for new users"
                                                    >
                                                        Default
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {city.governorateName} Governorate
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-6">
                                        <RealTimeCityStats city={city} />

                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">
                                                {city.isEnabled ? 'Available' : 'Disabled'}
                                            </span>
                                            <Switch
                                                checked={city.isEnabled}
                                                onCheckedChange={() =>
                                                    handleToggleCityStatusWithCheck(city._id)
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewCityDetails(city.id)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditCity(city.id)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>

                                            {/* Default City Management */}
                                            {city.isDefault ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700"
                                                    onClick={() => handleRemoveDefaultCity(city.id)}
                                                    title="Remove default status"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-green-600 hover:text-green-700"
                                                    onClick={() => handleSetDefaultCity(city.id)}
                                                    title="Set as default city"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                </Button>
                                            )}

                                            {!city.isDefault && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDeleteCity(city.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {cities.length === 0 && (
                            <div className="text-center py-8">
                                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />

                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No cities found
                                </h3>
                                <p className="text-gray-500">
                                    {searchTerm
                                        ? 'Try adjusting your search terms'
                                        : 'No cities match your current filters'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Modals */}
                <AddCityModal
                    isOpen={showAddCityModal}
                    onClose={() => setShowAddCityModal(false)}
                    onSubmit={handleAddCity}
                    governorates = {governorates}
                />

                <AddDistrictModal
                    isOpen={showAddDistrictModal}
                    onClose={() => setShowAddDistrictModal(false)}
                    onSubmit={(districtData) => {
                        console.log('Adding district:', districtData);
                        setShowAddDistrictModal(false);
                    }}
                />

                <CityDetailsModal
                    isOpen={showCityDetailsModal}
                    onClose={() => setShowCityDetailsModal(false)}
                    cityId={selectedCityId}
                />

                <EditCityModal
                    isOpen={showEditCityModal}
                    onClose={() => {
                        console.log('Closing edit modal');
                        setShowEditCityModal(false);
                        setSelectedCityForEdit(null);
                    }}
                    onSubmit={handleUpdateCity}
                    city={selectedCityForEdit}
                />

                <DeleteCityModal
                    isOpen={showDeleteCityModal}
                    onClose={() => {
                        setShowDeleteCityModal(false);
                        setSelectedCityForDelete(null);
                    }}
                    onConfirm={handleConfirmDeleteCity}
                    city={selectedCityForDelete}
                    isLoading={isDeleting}
                />

                {/* Set Default City Confirmation */}
                <ConfirmationDialog
                    isOpen={showSetDefaultConfirm}
                    onClose={() => {
                        setShowSetDefaultConfirm(false);
                        setSelectedCityForDefault(null);
                    }}
                    onConfirm={handleConfirmSetDefault}
                    title="Set Default City"
                    description={`Set ${selectedCityForDefault?.nameEn} as the default city for new users? This will be the city automatically selected when new users register.`}
                    confirmText="Set as Default"
                    variant="default"
                    isLoading={isProcessingDefault}
                />

                {/* Remove Default City Confirmation */}
                <ConfirmationDialog
                    isOpen={showRemoveDefaultConfirm}
                    onClose={() => {
                        setShowRemoveDefaultConfirm(false);
                        setSelectedCityForDefault(null);
                    }}
                    onConfirm={handleConfirmRemoveDefault}
                    title="Remove Default Status"
                    description={`Remove default status from ${selectedCityForDefault?.nameEn}? Users will need to manually select a city during registration.`}
                    confirmText="Remove Default"
                    variant="warning"
                    isLoading={isProcessingDefault}
                />
            </div>
        </>
    );
}
