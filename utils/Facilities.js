// مرافق الحمام
export const bathroomFacilities = (isEnglish) => {
    return isEnglish ? [
        'Jacuzzi',
        'Sauna',
        'Bathtub',
        'Napkins',
        'Soap',
        'Shampoo',
        'Slippers',
        'Bathrobe',
        'Shower'
    ] : [ 
        'جاكوزي',
        'ساونا',
        'بانيو / حوض استحمام',
        'مناديل',
        'صابون',
        'شامبو',
        'سلبر',
        'رداء حمام',
        'دش'
    ]
};


// مرافق المطبخ
export const kitchenFacilities = (isEnglish) => {
    return isEnglish ? [
        'Freezer',
        'Oven',
        'Refrigerator',
        'Microwave',
        'Kettle',
        'Cookware',
        'Coffee machine'
    ] : [ 
        'فريزر',
        'فرن',
        'ثلاجه',
        'مايكرو ويف',
        'غلايه',
        'اوانى طبخ',
        'الة قهوه'
    ]
};


// المرافق باللغتين الانجليزية و العربية
export const facilities = (isEnglish) => { 
    return isEnglish ? [
        'Internet',
        'Additional lighting',
        'Headphones',
        'Kids Toys',
        'BBQ Corner',
        'Wood-burning stove',
        'Football field',
        'Volleyball court',
        'Projector',
        'Poetry house',
        'Illuminated stage',
        'Table tennis',
        'Bridal preparation room',
        'Green area',
        'Trampoline',
        'Basketball court',
        'PlayStation',
        'Royal poetry house',
        'Majlis (Arabic-style seating)',
        'Billiards',
        'Massage chair',
        'Traditional barbecue',
        'Mist',
        'Sand games',
        'Sand skiing',
        'Car entrance',
        'Driver\'s room',
        'Security office',
        'Private beach',
        'Slide',
        'Dining hall',
        'Outdoor annex',
        'Tent',
        'Two sections',
        'Sea view',
        'Cinema room',
        'Two separate sections',
        'Two connected sections with a door',
        'Mountain view',
        'Balcony',
        'Television',
        'Garden view',
        'Shared public swimming pool',
        'Public swimming pool for women',
        'Elevator - Lifts',
        'Mountain waterfall',
        'Self-entry'
    ] : [
        'انترنت',
        'إضاءة إضافية',
        'سماعات',
        'ألعاب أطفال',
        'ركن شواء',
        'موقد حطب',
        'ملعب كرة قدم',
        'ملعب كرة طائرة',
        'بروجكتر',
        'بيت شعر',
        'ستيج مضيئ',
        'طاولة تنس',
        'غرفة تجهيز عروس',
        'مسطح اخضر',
        'نطيطه',
        'ملعب كرة سله',
        'بلايستيشن',
        'بيت شعر ملكي',
        'جلسة عريش',
        'بلياردو',
        'كرسي مساج',
        'برميل مندي',
        'رذاذ',
        'العاب رمليه',
        'تزلج على الرمل',
        'مدخل سيارة',
        'غرفة سائقين',
        'مكتب امن',
        'شاطئ خاص',
        'زحليقه',
        'صالة طعام',
        'ملحق خارجي',
        'خيمه',
        'قسمين',
        'اطلاله على البحر',
        'غرفة سينما',
        'قسمين منفصلة',
        'قسمين متصلة بينهم باب',
        'اطلالة على الجبل',
        'بلكونة',
        'تلفزيون',
        'اطلالة على الحديقة',
        'مسبح عام مشترك',
        'مسبح عام للنساء',
        'اصنصير - مصاعد',
        'شلال على الجبل',
        'دخول ذاتي'
    ];
};


// تصنيفات العقار من حيث طبيعة الضيوف مثل عوائل أو افراد
export const customersTypesArray = (isEnglish) => {
    return isEnglish ? [
        'Events',
        'Pairs',
        'Travelers',
        'Families only',
        'Singles and families'
    ] : [
       'المناسبات',
       'أزواج',
       'المسافرين',
       'عوائل فقط',
       'عزاب و عوائل'
    ];
};


export const poolType = (isEnglish) => {
    return isEnglish ? [
        'Barrier',
        'Without barrier',
        'Indoor',
        'Outdoor',
        'Water games',
        'Heating',
        'Fenced'
    ] : [
        'بحاجز',
        'بدون حاجز', 
        'داخلي', 
        'خارجي',
        'العاب مائية', 
        'تدفئة', 
        'مسورة'
    ];
};