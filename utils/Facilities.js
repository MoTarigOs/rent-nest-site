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
        'بانيو - حوض استحمام',
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
export const facilities = (isEnglish, isStudents) => { 
    
    if(!isStudents) return isEnglish ? [
        "Internet",
        "Air conditioning",
        "Additional lighting",
        "Speakers",
        "Childrens games",
        "Barbecue area",
        "Wood-burning stove",
        "Football field",
        "Volleyball court",
        "Basketball court",
        "Table tennis",
        "Billiards",
        "Bridal preparation room",
        "Maid room",
        "Tent",
        "Projector",
        "Illuminated stage",
        "Green gardens and spaces",
        "Trampoline",
        "PlayStation",
        "Outdoor seating",
        "Massage chair",
        "Barrel sauna",
        "Water games",
        "Parking spaces",
        "Drivers room",
        "Guard - security",
        "Private beach",
        "Dining hall",
        "External annex",
        "Tent",
        "Sea view",
        "Mountain view",
        "Cinema room",
        "Separate sections",
        "Balcony",
        "Television",
        "Public women's pool",
        "Mixed public pool",
        "Elevator",
        "Artificial waterfall",
        "Water fountain",
        "Self check-in",
        "Backup electrical system",
        "Central heating",
        "Facilities for people with disabilities",
        "Intercom",
        "Solar heater"
    ] : [
        'انترنت',               
        'تكييف',               
        'إضاءة اضافية',
        'سماعات', 
        'ألعاب أطفال',         
        'منطقة شواء',
        'موقد حطب',            
        'ملعب كرة قدم',        
        'ملعب كرة طائرة',
        'ملعب كرة سلة',        
        'طاولة تنس',           
        'بلياردو',
        'غرفة تجهيز عروس',     
        'غرفة خادمة',          
        'بيت شعر',
        'بروجيكتر',            
        'ستيج مضيء',           
        'حدائق و مسطحات خضراء',
        'ترامبولين',           
        'بلاي ستيشن',          
        'جلسات خارجية',
        'كرسي مساج',           
        'برميل زرب',           
        'ألعاب مائية',
        'مواقف سيارات',        
        'غرفة سائقين',         
        'حارس - أمن و حماية',
        'شاطيء خاص',           
        'صالة طعام',           
        'ملحق خارجي',
        'خيمة',   
        'إطلالة على البحر',    
        'إطلالة جبلية',
        'غرفة سينما',          
        'قسمين منفصلين',       
        'بلكونة',
        'تلفزيون',
        'مسبح عام للنساء',     
        'مسبح عام مختلط',
        'مصعد',   
        'شلال اصطناعي',        
        'نافورة ماء',
        'دخول ذاتي',           
        'نظام كهرباء احتياطي', 
        'تدفئة مركزية',
        'تسهيلات لأصحاب الهمم',
        'انتركم',              
        'سخان شمسي'
    ];

    if(isStudents) return isEnglish ? [
        'Internet',
        'Study area',
        'Library',
        'Gym',
        'Parking spaces',
        'Supervisor',
        'Dining hall',
        'Cinema room',
        'Balcony',
        'Backup electrical system',
        'Play area',
        'Public pool',
        'Elevator',
        'Air conditioning',
        'Heating',
        'Central air conditioning',
        'Self check-in',
        'Intercom',
        'Guard security',
        'Wall cabinets',
        'Laundry room',
        'Electric blinds'
    ] : [
        'انترنت',             
        'منطقة دراسة',
        'مكتبة',              
        'نادي رياضي (جيم)',
        'مواقف سيارات',       
        'مشرف - مشرفة',
        'صالة طعام',          
        'غرفة سينما',
        'بلكونة',             
        'نظام كهرباء احتياطي',
        'منطقة ألعاب',        
        'مسبح عام',
        'مصعد',               
        'تكييف',
        'تدفئة',              
        'تكييف مركزي',
        'دخول ذاتي',          
        'انتركم',
        'حارس - أمن و حماية', 
        'خزائن حائط',
        'غرفة غسيل',          
        'أباجورات كهربائية'
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
       'عائلات فقط',
       'عزاب و عائلات'
    ];
};

export const studentsTypesArray = (isEnglish) => {
    return isEnglish ? [
        'Male students only',
        'Female students only'
    ] : [
       'طلاب ذكور فقط',
       'طلاب اناث فقط'
    ];
};


// مرافق المسبح
export const poolType = (isEnglish) => {
    return isEnglish ? [
        'Barrier',
        'Without barrier',
        'Indoor',
        'Outdoor',
        'Water games',
        'Heating',
        'Fenced',
        'Children swimming pool'
    ] : [
        'بحاجز',
        'بدون حاجز', 
        'داخلي', 
        'خارجي',
        'العاب مائية', 
        'تدفئة', 
        'مسورة',
        'مسبح اطفال'
    ];
};


// الأماكن القريبة
export const nearPlacesNames = (isEnglish) => {
    return isEnglish ? [
        'Hospital',
        'School',
        'Mall - Shopping Center',
        'Supermarket',
        'Gym',
        'Mosque',
        'Dry Cleaner',
        'Bank - ATM',
        'Pharmacy',
        'Emergency Center',
        'Parking Lot'
    ] : [
       'مستشفى',
        'مدرسة', 
        'مول - مركز تسوق', 
        'سوبرماركت', 
        'صالة رياضية (جيم)', 
        'مسجد', 
        'دراي كلين', 
        'بنك - صراف آلي', 
        'صيدلية', 
        'مركز طواريء', 
        'مواقف سيارات'
    ];
};