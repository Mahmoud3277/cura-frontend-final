// Egyptian City data structure
export interface City {
    id: string;
    nameEn: string;
    nameAr: string;
    governorateId: string;
    governorateName: string;
    governorateNameAr: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    isEnabled: boolean; // Admin controls this
    pharmacyCount: number;
    doctorCount: number;
    canAddDynamically?: boolean; // For admin to add new cities
}

// Egyptian cities data - organized by governorate
export const cities: City[] = [
    // ISMAILIA GOVERNORATE (DEFAULT ENABLED)
    {
        id: 'ismailia-city',
        nameEn: 'Ismailia City',
        nameAr: 'مدينة الإسماعيلية',
        governorateId: 'ismailia',
        governorateName: 'Ismailia',
        governorateNameAr: 'الإسماعيلية',
        coordinates: { lat: 30.5965, lng: 32.2715 },
        isEnabled: true, // DEFAULT ENABLED
        pharmacyCount: 45,
        doctorCount: 35,
    },
    {
        id: 'fayed',
        nameEn: 'Fayed',
        nameAr: 'فايد',
        governorateId: 'ismailia',
        governorateName: 'Ismailia',
        governorateNameAr: 'الإسماعيلية',
        coordinates: { lat: 30.3167, lng: 32.3 },
        isEnabled: false,
        pharmacyCount: 15,
        doctorCount: 12,
    },
    {
        id: 'abu-suwir',
        nameEn: 'Abu Suwir',
        nameAr: 'أبو صوير',
        governorateId: 'ismailia',
        governorateName: 'Ismailia',
        governorateNameAr: 'الإسماعيلية',
        coordinates: { lat: 30.4667, lng: 32.1167 },
        isEnabled: false,
        pharmacyCount: 8,
        doctorCount: 6,
    },
    {
        id: 'qantara',
        nameEn: 'Qantara',
        nameAr: 'القنطرة',
        governorateId: 'ismailia',
        governorateName: 'Ismailia',
        governorateNameAr: 'الإسماعيلية',
        coordinates: { lat: 30.8333, lng: 32.3167 },
        isEnabled: false,
        pharmacyCount: 12,
        doctorCount: 8,
    },

    // PORT SAID GOVERNORATE (DISABLED)
    {
        id: 'port-said-city',
        nameEn: 'Port Said City',
        nameAr: 'مدينة بورسعيد',
        governorateId: 'port-said',
        governorateName: 'Port Said',
        governorateNameAr: 'بورسعيد',
        coordinates: { lat: 31.2653, lng: 32.3019 },
        isEnabled: false,
        pharmacyCount: 35,
        doctorCount: 25,
    },
    {
        id: 'port-fouad',
        nameEn: 'Port Fouad',
        nameAr: 'بور فؤاد',
        governorateId: 'port-said',
        governorateName: 'Port Said',
        governorateNameAr: 'بورسعيد',
        coordinates: { lat: 31.25, lng: 32.3167 },
        isEnabled: false,
        pharmacyCount: 10,
        doctorCount: 8,
    },

    // CAIRO GOVERNORATE (ENABLED)
    {
        id: 'cairo-city',
        nameEn: 'Cairo City',
        nameAr: 'مدينة القاهرة',
        governorateId: 'cairo',
        governorateName: 'Cairo',
        governorateNameAr: 'القاهرة',
        coordinates: { lat: 30.0444, lng: 31.2357 },
        isEnabled: true, // ENABLED
        pharmacyCount: 200,
        doctorCount: 150,
    },
    {
        id: 'new-cairo',
        nameEn: 'New Cairo',
        nameAr: 'القاهرة الجديدة',
        governorateId: 'cairo',
        governorateName: 'Cairo',
        governorateNameAr: 'القاهرة',
        coordinates: { lat: 30.033, lng: 31.4913 },
        isEnabled: false,
        pharmacyCount: 80,
        doctorCount: 60,
    },
    {
        id: 'helwan',
        nameEn: 'Helwan',
        nameAr: 'حلوان',
        governorateId: 'cairo',
        governorateName: 'Cairo',
        governorateNameAr: 'القاهرة',
        coordinates: { lat: 29.85, lng: 31.3333 },
        isEnabled: false,
        pharmacyCount: 45,
        doctorCount: 35,
    },
    {
        id: 'maadi',
        nameEn: 'Maadi',
        nameAr: 'المعادي',
        governorateId: 'cairo',
        governorateName: 'Cairo',
        governorateNameAr: 'القاهرة',
        coordinates: { lat: 29.9597, lng: 31.2584 },
        isEnabled: false,
        pharmacyCount: 55,
        doctorCount: 40,
    },

    // ALEXANDRIA GOVERNORATE (ENABLED)
    {
        id: 'alexandria-city',
        nameEn: 'Alexandria City',
        nameAr: 'مدينة الإسكندرية',
        governorateId: 'alexandria',
        governorateName: 'Alexandria',
        governorateNameAr: 'الإسكندرية',
        coordinates: { lat: 31.2001, lng: 29.9187 },
        isEnabled: true, // ENABLED
        pharmacyCount: 180,
        doctorCount: 140,
    },
    {
        id: 'borg-el-arab',
        nameEn: 'Borg El Arab',
        nameAr: 'برج العرب',
        governorateId: 'alexandria',
        governorateName: 'Alexandria',
        governorateNameAr: 'الإسكندرية',
        coordinates: { lat: 30.9167, lng: 29.6333 },
        isEnabled: false,
        pharmacyCount: 25,
        doctorCount: 20,
    },

    // GIZA GOVERNORATE (ENABLED)
    {
        id: 'giza-city',
        nameEn: 'Giza City',
        nameAr: 'مدينة الجيزة',
        governorateId: 'giza',
        governorateName: 'Giza',
        governorateNameAr: 'الجيزة',
        coordinates: { lat: 30.0131, lng: 31.2089 },
        isEnabled: true, // ENABLED
        pharmacyCount: 120,
        doctorCount: 90,
    },
    {
        id: '6th-october',
        nameEn: '6th of October City',
        nameAr: 'مدينة 6 أكتوبر',
        governorateId: 'giza',
        governorateName: 'Giza',
        governorateNameAr: 'الجيزة',
        coordinates: { lat: 29.9097, lng: 30.9746 },
        isEnabled: false,
        pharmacyCount: 65,
        doctorCount: 50,
    },

    // SUEZ GOVERNORATE (DISABLED)
    {
        id: 'suez-city',
        nameEn: 'Suez City',
        nameAr: 'مدينة السويس',
        governorateId: 'suez',
        governorateName: 'Suez',
        governorateNameAr: 'السويس',
        coordinates: { lat: 29.9668, lng: 32.5498 },
        isEnabled: false,
        pharmacyCount: 35,
        doctorCount: 25,
    },
    {
        id: 'ain-sokhna',
        nameEn: 'Ain Sokhna',
        nameAr: 'العين السخنة',
        governorateId: 'suez',
        governorateName: 'Suez',
        governorateNameAr: 'السويس',
        coordinates: { lat: 29.5833, lng: 32.3167 },
        isEnabled: false,
        pharmacyCount: 15,
        doctorCount: 12,
    },

    // DAKAHLIA GOVERNORATE (DISABLED)
    {
        id: 'mansoura',
        nameEn: 'Mansoura',
        nameAr: 'المنصورة',
        governorateId: 'dakahlia',
        governorateName: 'Dakahlia',
        governorateNameAr: 'الدقهلية',
        coordinates: { lat: 31.0409, lng: 31.3785 },
        isEnabled: true, // ENABLED
        pharmacyCount: 85,
        doctorCount: 65,
    },
    {
        id: 'talkha',
        nameEn: 'Talkha',
        nameAr: 'طلخا',
        governorateId: 'dakahlia',
        governorateName: 'Dakahlia',
        governorateNameAr: 'الدقهلية',
        coordinates: { lat: 31.0539, lng: 31.3781 },
        isEnabled: false,
        pharmacyCount: 25,
        doctorCount: 20,
    },
    {
        id: 'mit-ghamr',
        nameEn: 'Mit Ghamr',
        nameAr: 'ميت غمر',
        governorateId: 'dakahlia',
        governorateName: 'Dakahlia',
        governorateNameAr: 'الدقهلية',
        coordinates: { lat: 30.7167, lng: 31.2667 },
        isEnabled: false,
        pharmacyCount: 30,
        doctorCount: 25,
    },

    // SHARQIA GOVERNORATE (DISABLED)
    {
        id: 'zagazig',
        nameEn: 'Zagazig',
        nameAr: 'الزقازيق',
        governorateId: 'sharqia',
        governorateName: 'Sharqia',
        governorateNameAr: 'الشرقية',
        coordinates: { lat: 30.5852, lng: 31.5041 },
        isEnabled: false,
        pharmacyCount: 70,
        doctorCount: 55,
    },
    {
        id: '10th-ramadan',
        nameEn: '10th of Ramadan City',
        nameAr: 'مدينة العاشر من رمضان',
        governorateId: 'sharqia',
        governorateName: 'Sharqia',
        governorateNameAr: 'الشرقية',
        coordinates: { lat: 30.3128, lng: 31.743 },
        isEnabled: false,
        pharmacyCount: 45,
        doctorCount: 35,
    },
    {
        id: 'bilbeis',
        nameEn: 'Bilbeis',
        nameAr: 'بلبيس',
        governorateId: 'sharqia',
        governorateName: 'Sharqia',
        governorateNameAr: 'الشرقية',
        coordinates: { lat: 30.4167, lng: 31.5667 },
        isEnabled: false,
        pharmacyCount: 25,
        doctorCount: 20,
    },

    // QALYUBIA GOVERNORATE (DISABLED)
    {
        id: 'benha',
        nameEn: 'Benha',
        nameAr: 'بنها',
        governorateId: 'qalyubia',
        governorateName: 'Qalyubia',
        governorateNameAr: 'القليوبية',
        coordinates: { lat: 30.4648, lng: 31.1786 },
        isEnabled: false,
        pharmacyCount: 60,
        doctorCount: 45,
    },
    {
        id: 'shubra-el-kheima',
        nameEn: 'Shubra El Kheima',
        nameAr: 'شبرا الخيمة',
        governorateId: 'qalyubia',
        governorateName: 'Qalyubia',
        governorateNameAr: 'القليوبية',
        coordinates: { lat: 30.1286, lng: 31.2441 },
        isEnabled: false,
        pharmacyCount: 40,
        doctorCount: 30,
    },

    // GHARBIA GOVERNORATE (DISABLED)
    {
        id: 'tanta',
        nameEn: 'Tanta',
        nameAr: 'طنطا',
        governorateId: 'gharbia',
        governorateName: 'Gharbia',
        governorateNameAr: 'الغربية',
        coordinates: { lat: 30.7865, lng: 31.0004 },
        isEnabled: true, // ENABLED
        pharmacyCount: 75,
        doctorCount: 60,
    },
    {
        id: 'mahalla-el-kubra',
        nameEn: 'Mahalla El Kubra',
        nameAr: 'المحلة الكبرى',
        governorateId: 'gharbia',
        governorateName: 'Gharbia',
        governorateNameAr: 'الغربية',
        coordinates: { lat: 30.9707, lng: 31.1669 },
        isEnabled: false,
        pharmacyCount: 50,
        doctorCount: 40,
    },

    // MENOUFIA GOVERNORATE (DISABLED)
    {
        id: 'shibin-el-kom',
        nameEn: 'Shibin El Kom',
        nameAr: 'شبين الكوم',
        governorateId: 'menoufia',
        governorateName: 'Menoufia',
        governorateNameAr: 'المنوفية',
        coordinates: { lat: 30.5594, lng: 31.0118 },
        isEnabled: false,
        pharmacyCount: 45,
        doctorCount: 35,
    },

    // BEHEIRA GOVERNORATE (DISABLED)
    {
        id: 'damanhour',
        nameEn: 'Damanhour',
        nameAr: 'دمنهور',
        governorateId: 'beheira',
        governorateName: 'Beheira',
        governorateNameAr: 'البحيرة',
        coordinates: { lat: 31.0341, lng: 30.4682 },
        isEnabled: false,
        pharmacyCount: 65,
        doctorCount: 50,
    },

    // KAFR EL SHEIKH GOVERNORATE (DISABLED)
    {
        id: 'kafr-el-sheikh-city',
        nameEn: 'Kafr El Sheikh City',
        nameAr: 'مدينة كفر الشيخ',
        governorateId: 'kafr-el-sheikh',
        governorateName: 'Kafr El Sheikh',
        governorateNameAr: 'كفر الشيخ',
        coordinates: { lat: 31.1107, lng: 30.9388 },
        isEnabled: false,
        pharmacyCount: 55,
        doctorCount: 40,
    },
    {
        id: 'desouk',
        nameEn: 'Desouk',
        nameAr: 'دسوق',
        governorateId: 'kafr-el-sheikh',
        governorateName: 'Kafr El Sheikh',
        governorateNameAr: 'كفر الشيخ',
        coordinates: { lat: 31.1333, lng: 30.6333 },
        isEnabled: false,
        pharmacyCount: 35,
        doctorCount: 25,
    },

    // BENI SUEF GOVERNORATE (NEW)
    {
        id: 'beni-suef-city',
        nameEn: 'Beni Suef City',
        nameAr: 'مدينة بني سويف',
        governorateId: 'beni-suef',
        governorateName: 'Beni Suef',
        governorateNameAr: 'بني سويف',
        coordinates: { lat: 29.0661, lng: 31.0994 },
        isEnabled: false,
        pharmacyCount: 60,
        doctorCount: 45,
    },
    {
        id: 'new-beni-suef',
        nameEn: 'New Beni Suef',
        nameAr: 'بني سويف الجديدة',
        governorateId: 'beni-suef',
        governorateName: 'Beni Suef',
        governorateNameAr: 'بني سويف',
        coordinates: { lat: 29.0833, lng: 31.1167 },
        isEnabled: false,
        pharmacyCount: 20,
        doctorCount: 15,
    },

    // FAYOUM GOVERNORATE (NEW)
    {
        id: 'fayoum-city',
        nameEn: 'Fayoum City',
        nameAr: 'مدينة الفيوم',
        governorateId: 'fayoum',
        governorateName: 'Fayoum',
        governorateNameAr: 'الفيوم',
        coordinates: { lat: 29.3084, lng: 30.8428 },
        isEnabled: false,
        pharmacyCount: 50,
        doctorCount: 40,
    },
    {
        id: 'tamiya',
        nameEn: 'Tamiya',
        nameAr: 'طامية',
        governorateId: 'fayoum',
        governorateName: 'Fayoum',
        governorateNameAr: 'الفيوم',
        coordinates: { lat: 29.4667, lng: 30.9667 },
        isEnabled: false,
        pharmacyCount: 20,
        doctorCount: 15,
    },

    // MINYA GOVERNORATE (NEW)
    {
        id: 'minya-city',
        nameEn: 'Minya City',
        nameAr: 'مدينة المنيا',
        governorateId: 'minya',
        governorateName: 'Minya',
        governorateNameAr: 'المنيا',
        coordinates: { lat: 28.1099, lng: 30.7503 },
        isEnabled: false,
        pharmacyCount: 70,
        doctorCount: 55,
    },
    {
        id: 'mallawi',
        nameEn: 'Mallawi',
        nameAr: 'ملوي',
        governorateId: 'minya',
        governorateName: 'Minya',
        governorateNameAr: 'المنيا',
        coordinates: { lat: 27.7333, lng: 30.8333 },
        isEnabled: false,
        pharmacyCount: 25,
        doctorCount: 20,
    },

    // ASYUT GOVERNORATE (NEW)
    {
        id: 'asyut-city',
        nameEn: 'Asyut City',
        nameAr: 'مدينة أسيوط',
        governorateId: 'asyut',
        governorateName: 'Asyut',
        governorateNameAr: 'أسيوط',
        coordinates: { lat: 27.1809, lng: 31.1837 },
        isEnabled: false,
        pharmacyCount: 80,
        doctorCount: 60,
    },
    {
        id: 'new-asyut',
        nameEn: 'New Asyut',
        nameAr: 'أسيوط الجديدة',
        governorateId: 'asyut',
        governorateName: 'Asyut',
        governorateNameAr: 'أسيوط',
        coordinates: { lat: 27.2167, lng: 31.1667 },
        isEnabled: false,
        pharmacyCount: 30,
        doctorCount: 25,
    },

    // SOHAG GOVERNORATE (NEW)
    {
        id: 'sohag-city',
        nameEn: 'Sohag City',
        nameAr: 'مدينة سوهاج',
        governorateId: 'sohag',
        governorateName: 'Sohag',
        governorateNameAr: 'سوهاج',
        coordinates: { lat: 26.5569, lng: 31.6948 },
        isEnabled: false,
        pharmacyCount: 65,
        doctorCount: 50,
    },
    {
        id: 'akhmim',
        nameEn: 'Akhmim',
        nameAr: 'أخميم',
        governorateId: 'sohag',
        governorateName: 'Sohag',
        governorateNameAr: 'سوهاج',
        coordinates: { lat: 26.5667, lng: 31.7333 },
        isEnabled: false,
        pharmacyCount: 25,
        doctorCount: 20,
    },

    // QENA GOVERNORATE (NEW)
    {
        id: 'qena-city',
        nameEn: 'Qena City',
        nameAr: 'مدينة قنا',
        governorateId: 'qena',
        governorateName: 'Qena',
        governorateNameAr: 'قنا',
        coordinates: { lat: 26.1551, lng: 32.716 },
        isEnabled: false,
        pharmacyCount: 55,
        doctorCount: 45,
    },
    {
        id: 'nag-hammadi',
        nameEn: 'Nag Hammadi',
        nameAr: 'نجع حمادي',
        governorateId: 'qena',
        governorateName: 'Qena',
        governorateNameAr: 'قنا',
        coordinates: { lat: 26.0333, lng: 32.25 },
        isEnabled: false,
        pharmacyCount: 20,
        doctorCount: 15,
    },

    // LUXOR GOVERNORATE (NEW)
    {
        id: 'luxor-city',
        nameEn: 'Luxor City',
        nameAr: 'مدينة الأقصر',
        governorateId: 'luxor',
        governorateName: 'Luxor',
        governorateNameAr: 'الأقصر',
        coordinates: { lat: 25.6872, lng: 32.6396 },
        isEnabled: false,
        pharmacyCount: 40,
        doctorCount: 30,
    },
    {
        id: 'esna',
        nameEn: 'Esna',
        nameAr: 'إسنا',
        governorateId: 'luxor',
        governorateName: 'Luxor',
        governorateNameAr: 'الأقصر',
        coordinates: { lat: 25.2917, lng: 32.5542 },
        isEnabled: false,
        pharmacyCount: 10,
        doctorCount: 8,
    },

    // ASWAN GOVERNORATE (NEW)
    {
        id: 'aswan-city',
        nameEn: 'Aswan City',
        nameAr: 'مدينة أسوان',
        governorateId: 'aswan',
        governorateName: 'Aswan',
        governorateNameAr: 'أسوان',
        coordinates: { lat: 24.0889, lng: 32.8998 },
        isEnabled: false,
        pharmacyCount: 45,
        doctorCount: 35,
    },
    {
        id: 'kom-ombo',
        nameEn: 'Kom Ombo',
        nameAr: 'كوم أمبو',
        governorateId: 'aswan',
        governorateName: 'Aswan',
        governorateNameAr: 'أسوان',
        coordinates: { lat: 24.4667, lng: 32.9333 },
        isEnabled: false,
        pharmacyCount: 15,
        doctorCount: 12,
    },

    // DAMIETTA GOVERNORATE (NEW)
    {
        id: 'damietta-city',
        nameEn: 'Damietta City',
        nameAr: 'مدينة دمياط',
        governorateId: 'damietta',
        governorateName: 'Damietta',
        governorateNameAr: 'دمياط',
        coordinates: { lat: 31.4165, lng: 31.8133 },
        isEnabled: false,
        pharmacyCount: 45,
        doctorCount: 35,
    },
    {
        id: 'new-damietta',
        nameEn: 'New Damietta',
        nameAr: 'دمياط الجديدة',
        governorateId: 'damietta',
        governorateName: 'Damietta',
        governorateNameAr: 'دمياط',
        coordinates: { lat: 31.4167, lng: 31.8167 },
        isEnabled: false,
        pharmacyCount: 15,
        doctorCount: 12,
    },

    // RED SEA GOVERNORATE (NEW)
    {
        id: 'hurghada',
        nameEn: 'Hurghada',
        nameAr: 'الغردقة',
        governorateId: 'red-sea',
        governorateName: 'Red Sea',
        governorateNameAr: 'البحر الأحمر',
        coordinates: { lat: 27.2574, lng: 33.8129 },
        isEnabled: false,
        pharmacyCount: 30,
        doctorCount: 25,
    },
    {
        id: 'safaga',
        nameEn: 'Safaga',
        nameAr: 'سفاجا',
        governorateId: 'red-sea',
        governorateName: 'Red Sea',
        governorateNameAr: 'البحر الأحمر',
        coordinates: { lat: 26.7333, lng: 33.9333 },
        isEnabled: false,
        pharmacyCount: 10,
        doctorCount: 8,
    },

    // NORTH SINAI GOVERNORATE (NEW)
    {
        id: 'arish',
        nameEn: 'Arish',
        nameAr: 'العريش',
        governorateId: 'north-sinai',
        governorateName: 'North Sinai',
        governorateNameAr: 'شمال سيناء',
        coordinates: { lat: 31.1342, lng: 33.8421 },
        isEnabled: false,
        pharmacyCount: 25,
        doctorCount: 20,
    },
    {
        id: 'sheikh-zuweid',
        nameEn: 'Sheikh Zuweid',
        nameAr: 'الشيخ زويد',
        governorateId: 'north-sinai',
        governorateName: 'North Sinai',
        governorateNameAr: 'شمال سيناء',
        coordinates: { lat: 31.2, lng: 34.2333 },
        isEnabled: false,
        pharmacyCount: 10,
        doctorCount: 8,
    },

    // SOUTH SINAI GOVERNORATE (NEW)
    {
        id: 'sharm-el-sheikh',
        nameEn: 'Sharm El Sheikh',
        nameAr: 'شرم الشيخ',
        governorateId: 'south-sinai',
        governorateName: 'South Sinai',
        governorateNameAr: 'جنوب سيناء',
        coordinates: { lat: 27.9158, lng: 34.33 },
        isEnabled: false,
        pharmacyCount: 20,
        doctorCount: 15,
    },
    {
        id: 'dahab',
        nameEn: 'Dahab',
        nameAr: 'دهب',
        governorateId: 'south-sinai',
        governorateName: 'South Sinai',
        governorateNameAr: 'جنوب سيناء',
        coordinates: { lat: 28.5, lng: 34.5167 },
        isEnabled: false,
        pharmacyCount: 10,
        doctorCount: 8,
    },

    // MATROUH GOVERNORATE (NEW)
    {
        id: 'marsa-matrouh',
        nameEn: 'Marsa Matrouh',
        nameAr: 'مرسى مطروح',
        governorateId: 'matrouh',
        governorateName: 'Matrouh',
        governorateNameAr: 'مطروح',
        coordinates: { lat: 31.3543, lng: 27.2373 },
        isEnabled: false,
        pharmacyCount: 35,
        doctorCount: 25,
    },
    {
        id: 'alamein',
        nameEn: 'Alamein',
        nameAr: 'العلمين',
        governorateId: 'matrouh',
        governorateName: 'Matrouh',
        governorateNameAr: 'مطروح',
        coordinates: { lat: 30.8333, lng: 28.9667 },
        isEnabled: false,
        pharmacyCount: 10,
        doctorCount: 8,
    },

    // NEW VALLEY GOVERNORATE (NEW)
    {
        id: 'kharga',
        nameEn: 'Kharga',
        nameAr: 'الخارجة',
        governorateId: 'new-valley',
        governorateName: 'New Valley',
        governorateNameAr: 'الوادي الجديد',
        coordinates: { lat: 25.4552, lng: 30.5428 },
        isEnabled: false,
        pharmacyCount: 20,
        doctorCount: 15,
    },
    {
        id: 'dakhla',
        nameEn: 'Dakhla',
        nameAr: 'الداخلة',
        governorateId: 'new-valley',
        governorateName: 'New Valley',
        governorateNameAr: 'الوادي الجديد',
        coordinates: { lat: 25.5, lng: 29.1667 },
        isEnabled: false,
        pharmacyCount: 5,
        doctorCount: 4,
    },

    // ADD MORE CITIES TO EXISTING GOVERNORATES

    // More CAIRO cities
    {
        id: 'nasr-city',
        nameEn: 'Nasr City',
        nameAr: 'مدينة نصر',
        governorateId: 'cairo',
        governorateName: 'Cairo',
        governorateNameAr: 'القاهرة',
        coordinates: { lat: 30.0626, lng: 31.3219 },
        isEnabled: false,
        pharmacyCount: 70,
        doctorCount: 55,
    },
    {
        id: 'zamalek',
        nameEn: 'Zamalek',
        nameAr: 'الزمالك',
        governorateId: 'cairo',
        governorateName: 'Cairo',
        governorateNameAr: 'القاهرة',
        coordinates: { lat: 30.0626, lng: 31.2197 },
        isEnabled: false,
        pharmacyCount: 40,
        doctorCount: 35,
    },
    {
        id: 'shubra',
        nameEn: 'Shubra',
        nameAr: 'شبرا',
        governorateId: 'cairo',
        governorateName: 'Cairo',
        governorateNameAr: 'القاهرة',
        coordinates: { lat: 30.1086, lng: 31.2441 },
        isEnabled: false,
        pharmacyCount: 35,
        doctorCount: 25,
    },

    // More ALEXANDRIA cities
    {
        id: 'montaza',
        nameEn: 'Montaza',
        nameAr: 'المنتزه',
        governorateId: 'alexandria',
        governorateName: 'Alexandria',
        governorateNameAr: 'الإسكندرية',
        coordinates: { lat: 31.2833, lng: 30.0167 },
        isEnabled: false,
        pharmacyCount: 45,
        doctorCount: 35,
    },
    {
        id: 'agami',
        nameEn: 'Agami',
        nameAr: 'العجمي',
        governorateId: 'alexandria',
        governorateName: 'Alexandria',
        governorateNameAr: 'الإسكندرية',
        coordinates: { lat: 31.0833, lng: 29.7833 },
        isEnabled: false,
        pharmacyCount: 25,
        doctorCount: 20,
    },

    // More GIZA cities
    {
        id: 'dokki',
        nameEn: 'Dokki',
        nameAr: 'الدقي',
        governorateId: 'giza',
        governorateName: 'Giza',
        governorateNameAr: 'الجيزة',
        coordinates: { lat: 30.0388, lng: 31.2125 },
        isEnabled: false,
        pharmacyCount: 50,
        doctorCount: 40,
    },
    {
        id: 'sheikh-zayed',
        nameEn: 'Sheikh Zayed City',
        nameAr: 'مدينة الشيخ زايد',
        governorateId: 'giza',
        governorateName: 'Giza',
        governorateNameAr: 'الجيزة',
        coordinates: { lat: 30.0777, lng: 30.9717 },
        isEnabled: false,
        pharmacyCount: 40,
        doctorCount: 30,
    },

    // More DAKAHLIA cities
    {
        id: 'belqas',
        nameEn: 'Belqas',
        nameAr: 'بلقاس',
        governorateId: 'dakahlia',
        governorateName: 'Dakahlia',
        governorateNameAr: 'الدقهلية',
        coordinates: { lat: 31.2167, lng: 31.35 },
        isEnabled: false,
        pharmacyCount: 20,
        doctorCount: 15,
    },
    {
        id: 'dekernes',
        nameEn: 'Dekernes',
        nameAr: 'دكرنس',
        governorateId: 'dakahlia',
        governorateName: 'Dakahlia',
        governorateNameAr: 'الدقهلية',
        coordinates: { lat: 30.9667, lng: 31.6 },
        isEnabled: false,
        pharmacyCount: 15,
        doctorCount: 12,
    },

    // More SHARQIA cities
    {
        id: 'abu-hammad',
        nameEn: 'Abu Hammad',
        nameAr: 'أبو حماد',
        governorateId: 'sharqia',
        governorateName: 'Sharqia',
        governorateNameAr: 'الشرقية',
        coordinates: { lat: 30.5333, lng: 31.9167 },
        isEnabled: false,
        pharmacyCount: 18,
        doctorCount: 14,
    },
    {
        id: 'faqous',
        nameEn: 'Faqous',
        nameAr: 'فاقوس',
        governorateId: 'sharqia',
        governorateName: 'Sharqia',
        governorateNameAr: 'الشرقية',
        coordinates: { lat: 30.7333, lng: 31.7833 },
        isEnabled: false,
        pharmacyCount: 22,
        doctorCount: 18,
    },
];

// Helper functions
export function getCityById(id: string): City | undefined {
    return cities.find((city) => city.id === id);
}

export function getEnabledCities(): City[] {
    return cities.filter((city) => city.isEnabled);
}

export function getCitiesByGovernorate(governorateId: string): City[] {
    return cities.filter((city) => city.governorateId === governorateId);
}

export function getEnabledCitiesByGovernorate(governorateId: string): City[] {
    return cities.filter((city) => city.governorateId === governorateId && city.isEnabled);
}

export function searchCities(query: string, language: 'en' | 'ar' = 'en'): City[] {
    const searchTerm = query.toLowerCase();
    return cities.filter((city) => {
        if (language === 'ar') {
            return city.nameAr.includes(query) || city.governorateNameAr.includes(query);
        }
        return (
            city.nameEn.toLowerCase().includes(searchTerm) ||
            city.governorateName.toLowerCase().includes(searchTerm)
        );
    });
}

export function searchEnabledCities(query: string, language: 'en' | 'ar' = 'en'): City[] {
    return searchCities(query, language).filter((city) => city.isEnabled);
}

// New function to search cities based on admin settings
export function searchCitiesWithAdminSettings(
    query: string,
    enabledCityIds: string[],
    language: 'en' | 'ar' = 'en',
): City[] {
    const searchTerm = query.toLowerCase();
    return cities.filter((city) => {
        // Only include cities that are enabled by admin
        if (!enabledCityIds.includes(city.id)) return false;

        if (language === 'ar') {
            return city.nameAr.includes(query) || city.governorateNameAr.includes(query);
        }
        return (
            city.nameEn.toLowerCase().includes(searchTerm) ||
            city.governorateName.toLowerCase().includes(searchTerm)
        );
    });
}
