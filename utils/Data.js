import testImagePic from '@assets/images/test.jpg';

export const maxBookDateYears = 1;

export const JordanCities = [{ city_id: "AMM", value: "Amman", arabicName: "عمان" }, { city_id: "AQJ", value: "Aqaba", arabicName: "العقبة" }, { city_id: "IRB", value: "Irbid", arabicName: "اربد" }, { city_id: "ZAR", value: "Zarqa", arabicName: "الزرقاء" }, { city_id: "KWI", value: "Kufranjah", arabicName: "كفرنجة" }, { city_id: "MDA", value: "Madaba", arabicName: "مادبا" }, { city_id: "KAR", value: "Karak", arabicName: "الكرك" }, { city_id: "TAF", value: "Tafila", arabicName: "الطفيلة" }, { city_id: "MAF", value: "Maan", arabicName: "معان" }, { city_id: "AJL", value: "Ajloun", arabicName: "عجلون" }]

// export const JordanCities = [
//     { city_id: '', name: 'Oman', arabicName: 'عمان' },
//     "عمان",
//     "الزرقاء",
//     "اربد",
//     "الرصيفة",
//     "السحاب",
//     "الرمثا",
//     "العقبة",
//     "المفرق",
//     "مادبا",
//     "السلط",
//     "الجيزة",
//     "عين الباشا",
//     "عيدون",
//     "الضليل",
//     "جرش",
//     "السارحة",
//     "الهاشمية",
//     "معان",
//     "بيت راس",
//     "الحصن",
//     "الطرة",
//     "ناعور",
//     "الكرك",
//     "كفرنجة",
//     "دير أبي سعيد",
//     "نوعيمة",
//     "الشجرة",
//     "الطفيلة",
//     "المؤتة",
//     "غور الصافي",
//     "عنجرة",
//     "المشارع",
//     "حوارة",
//     "كفر يوبا",
//     "كريمة",
//     "الطيبة",
//     "المزار الشمالي",
//     "السخنة",
//     "الخالدية الجديدة",
//     "بشرى",
//     "أم السماق الجنوبي",
//     "جديتة",
//     "الفحيص",
//     "المزار الجنوبي",
//     "شونة الشمالية",
//     "كفر الماء",
//     "محيس"
// ];

export const ProperitiesCatagories = [
    { _id: '0', value: 'farm', arabicName: 'مزرعة' },
    { _id: '1', value: 'apartment', arabicName: 'شقق و منازل سكنية' },
    { _id: '2', value: 'resort', arabicName: 'منتجعات و استراحات' },
    { _id: '3', value: 'commercial', arabicName: 'مراكز تجارية' },
    // "سكني",
    // "تجاري",
    // "صناعي",
    // "زراعي",
    // "أرض فارغة",
    // "استثمار",
    // "فاخر",
    // "شقة",
    // "منزل منفصل",
    // "منزل متنقل",
    // "مزرعة",
    // "ريفي",
    // "حضري",
    // "منتجع تزلج",
    // "بناء جديد",
    // "محتاج للتجديد",
    // "شقة مفتوحة",
    // "شقة مع سطح",
    // "استوديو",
    // "مستودع",
    // "مطعم",
    // "فندق",
    // "منتجع",
    // "مخيم",
    // "منتجع صحي",
    // "صالون",
    // "مسرح",
    // "معرض فني",
    // "متحف",
    // "مكتبة",
    // "مركز مجتمعي",
    // "مرفق ديني",
    // "مدرسة",
    // "مستشفى"
];

export const homePageCatagories = [
    'مخيمات عمان',
    'مخيمات عمان',
    'مخيمات عمان',
    'مخيمات عمان',
    'مخيمات عمان',
    'مخيمات عمان',
    'مخيمات عمان',
    'مخيمات عمان',
    'مخيمات عمان',
    'مخيمات عمان',
    'مخيمات عمان',
    'مخيمات عمان',
    'مخيمات عمان',
    'مخيمات عمان',
    'مخيمات عمان'
];

export const VehicleCatagories = [
    { value: 'micro', arabicName: "سيارة مايكرو", _id: '0' }, 
    { value: 'sedan', arabicName: "صالون", _id: '1' }, 
    { value: 'high', arabicName: "سيارة عالية", _id: '2' }, 
    { value: 'luxury', arabicName: "سيارة فاخرة", _id: '3' }, 
    { value: 'mini-bus', arabicName: "ميني باص", _id: '4' }, 
    { value: 'sport', arabicName: "سيارة رياضية", _id: '5' }, 
];

export const AllCatgories = [
    'farm', 'apartment', 'resort', 'commercial', 
    'micro', 'sedan', 'high', 'luxury', 'mini-bus', 'sport'
];

export const existedDetailIcon = ['bathrooms'];

export const PropertyDetails = [
    { name: 'عدد الغرف', type: 'number' },
    { name: 'تاريخ التجديد', type: 'number' },
    { name: 'عدد الغرف', type: 'text' },
    { name: 'عدد الغرف', type: 'number' },
    { name: 'عدد الغرف', type: 'number' },
    { name: 'عدد الغرف', type: 'number' },
    { name: 'عدد الغرف', type: 'number' }
];

export const minimumPrice = 5;
export const maximumPrice = 100000;

export const testImage = () => {
    return testImagePic
}