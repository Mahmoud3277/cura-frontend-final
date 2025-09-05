// Egyptian Governorates data structure
export interface Governorate {
    id: string;
    nameEn: string;
    nameAr: string;
    isEnabled: boolean;
    coordinates: {
        lat: number;
        lng: number;
    };
    cityCount: number;
    pharmacyCount: number;
    doctorCount: number;
}

// All 27 Egyptian Governorates
export const governorates: Governorate[] = [
    // ISMAILIA - DEFAULT ENABLED
    {
        id: 'ismailia',
        nameEn: 'Ismailia',
        nameAr: 'الإسماعيلية',
        isEnabled: true, // DEFAULT ENABLED
        coordinates: { lat: 30.5965, lng: 32.2715 },
        cityCount: 4,
        pharmacyCount: 85,
        doctorCount: 65,
    },

    // MAJOR GOVERNORATES
    {
        id: 'cairo',
        nameEn: 'Cairo',
        nameAr: 'القاهرة',
        isEnabled: false,
        coordinates: { lat: 30.0444, lng: 31.2357 },
        cityCount: 8,
        pharmacyCount: 450,
        doctorCount: 320,
    },
    {
        id: 'alexandria',
        nameEn: 'Alexandria',
        nameAr: 'الإسكندرية',
        isEnabled: false,
        coordinates: { lat: 31.2001, lng: 29.9187 },
        cityCount: 5,
        pharmacyCount: 320,
        doctorCount: 240,
    },
    {
        id: 'giza',
        nameEn: 'Giza',
        nameAr: 'الجيزة',
        isEnabled: false,
        coordinates: { lat: 30.0131, lng: 31.2089 },
        cityCount: 6,
        pharmacyCount: 280,
        doctorCount: 210,
    },
    {
        id: 'port-said',
        nameEn: 'Port Said',
        nameAr: 'بورسعيد',
        isEnabled: false,
        coordinates: { lat: 31.2653, lng: 32.3019 },
        cityCount: 3,
        pharmacyCount: 45,
        doctorCount: 35,
    },
    {
        id: 'suez',
        nameEn: 'Suez',
        nameAr: 'السويس',
        isEnabled: false,
        coordinates: { lat: 29.9668, lng: 32.5498 },
        cityCount: 2,
        pharmacyCount: 35,
        doctorCount: 25,
    },

    // DELTA GOVERNORATES
    {
        id: 'dakahlia',
        nameEn: 'Dakahlia',
        nameAr: 'الدقهلية',
        isEnabled: false,
        coordinates: { lat: 31.0409, lng: 31.3785 },
        cityCount: 12,
        pharmacyCount: 180,
        doctorCount: 140,
    },
    {
        id: 'sharqia',
        nameEn: 'Sharqia',
        nameAr: 'الشرقية',
        isEnabled: false,
        coordinates: { lat: 30.5852, lng: 31.5041 },
        cityCount: 10,
        pharmacyCount: 160,
        doctorCount: 120,
    },
    {
        id: 'qalyubia',
        nameEn: 'Qalyubia',
        nameAr: 'القليوبية',
        isEnabled: false,
        coordinates: { lat: 30.1792, lng: 31.2056 },
        cityCount: 8,
        pharmacyCount: 140,
        doctorCount: 110,
    },
    {
        id: 'kafr-el-sheikh',
        nameEn: 'Kafr El Sheikh',
        nameAr: 'كفر الشيخ',
        isEnabled: false,
        coordinates: { lat: 31.1107, lng: 30.9388 },
        cityCount: 6,
        pharmacyCount: 90,
        doctorCount: 70,
    },
    {
        id: 'gharbia',
        nameEn: 'Gharbia',
        nameAr: 'الغربية',
        isEnabled: false,
        coordinates: { lat: 30.8754, lng: 31.0335 },
        cityCount: 7,
        pharmacyCount: 120,
        doctorCount: 95,
    },
    {
        id: 'menoufia',
        nameEn: 'Menoufia',
        nameAr: 'المنوفية',
        isEnabled: false,
        coordinates: { lat: 30.5972, lng: 30.9876 },
        cityCount: 6,
        pharmacyCount: 100,
        doctorCount: 80,
    },
    {
        id: 'beheira',
        nameEn: 'Beheira',
        nameAr: 'البحيرة',
        isEnabled: false,
        coordinates: { lat: 30.8481, lng: 30.3436 },
        cityCount: 8,
        pharmacyCount: 110,
        doctorCount: 85,
    },
    {
        id: 'damietta',
        nameEn: 'Damietta',
        nameAr: 'دمياط',
        isEnabled: false,
        coordinates: { lat: 31.4165, lng: 31.8133 },
        cityCount: 4,
        pharmacyCount: 60,
        doctorCount: 45,
    },

    // UPPER EGYPT GOVERNORATES
    {
        id: 'beni-suef',
        nameEn: 'Beni Suef',
        nameAr: 'بني سويف',
        isEnabled: false,
        coordinates: { lat: 29.0661, lng: 31.0994 },
        cityCount: 5,
        pharmacyCount: 80,
        doctorCount: 60,
    },
    {
        id: 'fayoum',
        nameEn: 'Fayoum',
        nameAr: 'الفيوم',
        isEnabled: false,
        coordinates: { lat: 29.3084, lng: 30.8428 },
        cityCount: 4,
        pharmacyCount: 70,
        doctorCount: 55,
    },
    {
        id: 'minya',
        nameEn: 'Minya',
        nameAr: 'المنيا',
        isEnabled: false,
        coordinates: { lat: 28.1099, lng: 30.7503 },
        cityCount: 6,
        pharmacyCount: 95,
        doctorCount: 75,
    },
    {
        id: 'asyut',
        nameEn: 'Asyut',
        nameAr: 'أسيوط',
        isEnabled: false,
        coordinates: { lat: 27.1809, lng: 31.1837 },
        cityCount: 7,
        pharmacyCount: 110,
        doctorCount: 85,
    },
    {
        id: 'sohag',
        nameEn: 'Sohag',
        nameAr: 'سوهاج',
        isEnabled: false,
        coordinates: { lat: 26.5569, lng: 31.6948 },
        cityCount: 6,
        pharmacyCount: 90,
        doctorCount: 70,
    },
    {
        id: 'qena',
        nameEn: 'Qena',
        nameAr: 'قنا',
        isEnabled: false,
        coordinates: { lat: 26.1551, lng: 32.716 },
        cityCount: 5,
        pharmacyCount: 75,
        doctorCount: 60,
    },
    {
        id: 'luxor',
        nameEn: 'Luxor',
        nameAr: 'الأقصر',
        isEnabled: false,
        coordinates: { lat: 25.6872, lng: 32.6396 },
        cityCount: 3,
        pharmacyCount: 50,
        doctorCount: 40,
    },
    {
        id: 'aswan',
        nameEn: 'Aswan',
        nameAr: 'أسوان',
        isEnabled: false,
        coordinates: { lat: 24.0889, lng: 32.8998 },
        cityCount: 4,
        pharmacyCount: 60,
        doctorCount: 45,
    },

    // SINAI & RED SEA GOVERNORATES
    {
        id: 'red-sea',
        nameEn: 'Red Sea',
        nameAr: 'البحر الأحمر',
        isEnabled: false,
        coordinates: { lat: 26.0667, lng: 33.8 },
        cityCount: 3,
        pharmacyCount: 40,
        doctorCount: 30,
    },
    {
        id: 'north-sinai',
        nameEn: 'North Sinai',
        nameAr: 'شمال سيناء',
        isEnabled: false,
        coordinates: { lat: 31.1342, lng: 33.8421 },
        cityCount: 4,
        pharmacyCount: 35,
        doctorCount: 25,
    },
    {
        id: 'south-sinai',
        nameEn: 'South Sinai',
        nameAr: 'جنوب سيناء',
        isEnabled: false,
        coordinates: { lat: 28.9097, lng: 33.6073 },
        cityCount: 3,
        pharmacyCount: 30,
        doctorCount: 20,
    },

    // FRONTIER GOVERNORATES
    {
        id: 'matrouh',
        nameEn: 'Matrouh',
        nameAr: 'مطروح',
        isEnabled: false,
        coordinates: { lat: 31.3543, lng: 27.2373 },
        cityCount: 4,
        pharmacyCount: 45,
        doctorCount: 35,
    },
    {
        id: 'new-valley',
        nameEn: 'New Valley',
        nameAr: 'الوادي الجديد',
        isEnabled: false,
        coordinates: { lat: 25.4552, lng: 30.5428 },
        cityCount: 3,
        pharmacyCount: 25,
        doctorCount: 20,
    },
];
export async function getAllGovernorates(){
    const data = await fetch('http://localhost:5000/locations/governorates',{
        method:"GET"
    })
    const response = await data.json()
    if(response.success){
        return response.data
    }
    else{
        console.log(response.error)
    }
}
// Helper functions
export function getGovernorateById(id: string): Governorate | undefined {
    return governorates.find((gov) => gov.id === id);
}

export function getEnabledGovernorates(): Governorate[] {
    return governorates.filter((gov) => gov.isEnabled);
}
