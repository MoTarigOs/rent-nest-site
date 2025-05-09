import { ProperitiesCatagories, VehicleCatagories, contactsPlatforms, reservationType } from "./Data";
import imageCompression from 'browser-image-compression';

// new Compressor(image, {      //npm install compressorjs
// quality: 0.8,
// success: (compressedResult) => {
//     // compressedResult has the compressed file.
//     // Use the compressed file to upload the images to your server.
//     setCompressedFile(res)
// },
// });

const allowedFilenameChar = 'ABCDEFGHIJKLMNOPQRSTUVWYZabcdefghijklmnopqrstuvwyz0123456789-_.';
const allowedUsernameChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
const testCharacaters = 'ABCDEFGHIJKLMNOPQRSTUVWYZabcdefghijklmnopqrstuvwyz -!_*&%?.#+/@0123456789أابتثجحخدذرزعغلمنهويئسشصضطكفقةىءؤ';
const imageCompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1300,
    useWebWorker: true,
};
const maxImageSize = 1054000;
const maxVideoSize = 128000000;
const oneDayMillieseconds = 86400000;

export const blockDurationsArray = [
    { value: '1 day', ms: 86400000, arabicName: '1 يوم' },
    { value: '1 week', ms: 604800000, arabicName: 'اسبوع' },
    { value: '1 month', ms: 2629746000, arabicName: 'شهر' },
    { value: '6 months', ms: 15778800000, arabicName: '6 شهور' },
    { value: 'One year', ms: 31556952000, arabicName: 'سنة' },
    { value: '10 years', ms: 315360000000   , arabicName: '10 سنة' },
    { value: '100 years', ms: 3155695200000, arabicName: '100 سنة' }
];

export const propsSections = [
    { value: 'check-properties', arabicName: 'عروض غير مقبولة' },
    { value: 'hidden-properties', arabicName: 'عروض مخفية' },
    { value: 'properties-by-files', arabicName: 'عروض حسب حجم الملفات' },
];

export const usersSections = [
    { value: 'all-users', arabicName: 'كل المستخدمين' },
    { value: 'Host_requests', arabicName: 'طلبات تحويل الى معلن' },
    { value: 'blocked-true', arabicName: 'محظور' },
    { value: 'blocked-false', arabicName: 'غير محظور' },
    { value: 'email_verified-true', arabicName: 'موثق الحساب' },
    { value: 'email_verified-false', arabicName: 'غير موثق للحساب' },
    { value: 'user', arabicName: 'مستخدم عادي' },
    { value: 'admin', arabicName: 'مسؤول' },
    { value: 'owner', arabicName: 'مالك' },
];

export function getRoleArabicName (role) {
    switch(role){
        case 'user':
            return 'مستخدم';
        case 'admin':
            return 'مسؤول';
        case 'owner':
            return 'مالك';
        default:
            return '';
    }
};

export const getItemDetails = () => {
    return {
        title: 'this is title',
        desc: 'this is desc'
    }
};

export const isValidUsername = (name) => {

    let notAllowed = [];

    for (let i = 0; i < name.length; i++) {
        if(!allowedUsernameChars.includes(name[i])){
            if(!notAllowed.find(item => item === name[i])) notAllowed.push(name[i]);
        }
    }

    if(notAllowed.length > 0){
        return { ok: false, dt: notAllowed }
    } else {
        return { ok: true, dt: '' };
    }

};

export const isValidEmail = (email) => {

    if(typeof email !== "string" || email.length < 5 || email.length > 45) return { ok: false };

    const regexPattern = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,})$/;

    if(!regexPattern.test(email))
      return { ok: false };
  
    return { ok: true };

};

export const isValidPassword = (ps, isEn) => {

    if(typeof ps !== "string" || ps.length < 8 || ps.length > 30) return { ok: false,  };

    if(ps.length < 8) return { ok: false, dt: isEn ? 'password is too short, must contain 8 characters or more.' : 'كلمة السر قصيرة جدا, يجب أن تنكون من 8 حروف على الأقل' }
    
    if(ps.length > 30) return { ok: false, dt: isEn ? 'password is too long, must not exceed 30 characters.' : 'كلمة السر طويلة جدا, يجب أن لاتزيد عن 30 حرف' };
    
    for (let i = 0; i < ps.length; i++) {
        if(!testCharacaters.includes(ps[i])) 
            return { ok: false, dt: isEn ? `this letter ${ps[i]} is not valid, please use another one.` : `هذا الحرف ${ps[i]} غير صالج, الرجاء استخدام حرف غيره.` };
    };

    return { ok: true };

};

export const getArabicNameCatagory = (thisCatagory, isEnglish) => {
    const ct = ProperitiesCatagories.find(i => i.value === thisCatagory);
    if(ct) return isEnglish ? ct.value : ct.arabicName;
    const vct = VehicleCatagories.find(i => i.value === thisCatagory);
    if(vct) return isEnglish ? vct.value : vct.arabicName;
    return thisCatagory === 'multiple' ? (isEnglish ? 'Multiple selected' : 'عدة اختيارات') : (isEnglish ? 'All' : 'كل التصنيفات');
};

export const arrangeArray = (type, arr) => {

    switch(type){
        
        case 'default':
            return arr;

        case 'address':
            return arr;
        case 'ratings':
            return arr;
        case 'low-price':
            return arr;
        case 'high-price':
            return arr;
        default:
            return arr;   
             
    }
    
};

export const isValidVerificationCode = (code) => {
    if(!code || typeof code !== 'string' || code.length !== 6)
        return false;
    return true;
};

export const getOptimizedAttachedFiles = async(arr) => {

    console.log('arr before optimise: ', arr);

    let optimizedArray = [];
    let badFiles = [];
    let totalSize = [];

    for (let i = 0; i < arr.length; i++) {

        if(arr[i].type.split('/')[0] === 'image'){

            if(arr[i].size <= maxImageSize){
                optimizedArray.push(arr[i]);
                totalSize += arr[i].size;
            } else {
                try {
                    const compressedFile = await imageCompression(arr[i], imageCompressionOptions)
                    if(compressedFile) {
                        optimizedArray.push(new File(
                            [compressedFile], 
                            compressedFile.name, 
                            { type: compressedFile.type })
                        );  
                        totalSize += compressedFile.size;
                    } else {
                        badFiles.push(arr[i]);
                    };
                } catch (err) {
                    console.log(err.message);
                    badFiles.push(arr[i]);
                }
            }

        } else if (arr[i].type.split('/')[0] === 'video') {
            if(arr[i].size <= maxVideoSize){
                optimizedArray.push(arr[i]);
                totalSize += arr[i].size;
            } else {
                badFiles.push(arr[i]);
            }
        }

    }

    console.log('after: ', optimizedArray);

    return { optArr: optimizedArray, badFiles };

};

export function getDurationReadable(milliseconds) {

    if(milliseconds < 0) return 'انتهت مدة الحظر, يستطيع المستخدم الدخول الى حسابه في أي وقت.';

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
  
    const formattedDuration = [
      hours ? `${hours} ساع${hours !== 1 ? 'ات' : 'ة'}` : '',
      minutes % 60 ? `${minutes % 60} دقيقة` : '',
      seconds % 60 ? `${seconds % 60} ثانية` : ''
    ]
      .filter(part => part) // Remove empty parts
      .join(' و '); // Join with 'و' (and)
  
    return formattedDuration;

};

export function getReadableFileSizeString(fileSizeInBytes) {
    const byteUnits = [' B', ' kB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
    let i = 0;
    while (fileSizeInBytes > 1024 && i < byteUnits.length - 1) {
        fileSizeInBytes /= 1024;
        i++;
    }
    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}

export function getReadableDate (date, isSimple, isEnglish) {
    if(!date || date <= 0) return isEnglish ? 'undefined' : 'غير محدد';
    let obj = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    if(!isSimple){
        obj.hour = 'numeric';
        obj.minute = '2-digit';
    }
    return (new Intl.DateTimeFormat(isEnglish ? 'en' : 'ar', obj)
        .format(date).toString());
};

export const getNumOfBookDays = (bookDate) => {
  
    if(!bookDate || !bookDate[0] || !bookDate[1] || bookDate[0] === bookDate[1]) return 1;

    const x = Math.ceil((bookDate[1]?.getTime() - bookDate[0]?.getTime()) / (1000 * 60 * 60 * 24)) - 1;

    if(x > 1) return x;

    return 1;

};

function getMonthDaysCondition(doubleVal, daysBooked) {

    const startDate = new Date(doubleVal[0]);
    const endDate = new Date(doubleVal[1]);

    const month = startDate?.getMonth();
    const year = startDate?.getYear();
    const daysInMonths = [31, (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if(startDate?.getDay() === 0){
        if(daysBooked < daysInMonths[month - 1])
            return false;
    }


};

export const getBookDateFormat = (date) => {
    try{
        if(!date) return null;
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        if(day === null || month === null || year === null)
            return null;
        return `${day}-${month}-${year}`;
    } catch(err) {}
};

const isOkayText = s => (!/[^\u0600-\u06FF\u0020-\u0040\u005B-\u0060\u007B-\u007E-\u0000-\u007F]/.test(s));

export const isValidText = (text, minLength) => {

    if(!text) return false;

    if(!minLength && (!text || typeof text !== "string" || text.length <= 0)) return false;

    if(minLength && (!text || typeof text !== "string" || text.length < minLength)) return false;

    if(!isOkayText(text)) return false;

    const notAllowedTextChars = ['<', '>', '&','/','"',"'", '`'];

    for (let i = 0; i < notAllowedTextChars.length; i++) {
      if(text.includes(notAllowedTextChars[i])) return false;
    };
    
    return true;
};

export const isValidNumber = (num, maxLength, minLength, type) => {

    if(isNaN(Number(num))) return false;

    if(Boolean(maxLength) && (typeof num !== "number" || num > maxLength)) return false;

    if(Boolean(minLength <= 0 ? 1 : minLength) && (typeof num !== "number" || num < minLength)) return false;

    if(!Boolean(maxLength) && !Boolean(minLength) && (typeof num !== "number" || num <= 0)) return false;
    
    return true;

};

export const isValidContactURL = (contact) => {

    console.log(contact);

    if(!contactsPlatforms.includes(contact.platform))
        return false;

    let origin;

    try {
        origin = (new URL(contact.val))?.origin;
    } catch(err) {
        if(contact.platform !== 'whatsapp') return false;
        if(!isValidNumber(Number(contact.val))) return false;
    }

    switch(contact.platform){
        case 'youtube':
            if(origin !== 'https://www.youtube.com' && origin !== 'https://youtu.be'){
                return false;
            } else {
                return true;
            }
        case 'whatsapp':
            if(origin && origin !== 'https://wa.me'){
                return false;
            } else if(!origin && !isValidNumber(Number(contact.val))){
                return false;
            } else {
                return true;
            }
        case 'telegram':
            if(origin !== 'https://t.me'){
                return false;
            } else {
                return true;
            }
        case 'facebook':
            if(origin !== 'https://www.facebook.com'){
                return false;
            } else {
                return true;
            }
        case 'snapchat':
            if(origin !== 'https://www.snapchat.com' && origin !== 'https://youtu.be'){
                return false;
            } else {
                return true;
            }
        case 'linkedin':
            if(origin !== 'https://www.linkedin.com'){
                return false;
            } else {
                return true;
            }
        case 'instagram':
            if(origin !== 'https://www.instagram.com'){
                return false;
            } else {
                return true;
            }
        case 'x-twitter':
            if(origin !== 'https://twitter.com' && origin !== 'https://www.twitter.com' && origin !== 'https://www.x.com' && origin !== 'https://x.com'){
                return false;
            } else {
                return true;
            }
        case 'tiktok':
            if(origin !== 'https://www.tiktok.com'){
                return false;
            } else {
                return true;
            }
        default:
            return false;
    }

};

export const isValidArrayOfStrings = (arr) => {

    if(!arr?.length > 0 || !Array.isArray(arr)) return false;

    for (let i = 0; i < arr.length; i++) {
        if(!isValidText(arr[i])) return false;
    }

    return true;

};

export const getExtension = (file) => {

    if(file?.split('')?.reverse()?.join('')?.split('.')?.at(0)?.split('')?.reverse()?.join('') === 'png'
        || file?.split('')?.reverse()?.join('')?.split('.')?.at(0)?.split('')?.reverse()?.join('') === 'jpg') 
        return 'img';

    if(file?.split('')?.reverse()?.join('')?.split('.')?.at(0)?.split('')?.reverse()?.join('') === 'mp4'
        || file?.split('')?.reverse()?.join('')?.split('.')?.at(0)?.split('')?.reverse()?.join('') === 'avi') 
        return 'video';

    return null;    
        
};

export const isValidFilename = (filename) => {

    if(!getExtension(filename)) return false;

    for (let i = 0; i < filename.length; i++) {
        if(!allowedFilenameChar.includes(filename[i])){
            return false;
        }
    }

    return true;

};

export const isOkayBookDays = (dateArr, notAllowedDays) => {

    console.log('booked days: ', notAllowedDays);

    if(!notAllowedDays) return true;

    if(!dateArr) return false;

    const startDate = dateArr[0];

    const endDate = dateArr[1];

    if(!startDate || !endDate) return false;

    const numOfDays = getNumOfBookDays(dateArr);

    for (let i = 0; i <= numOfDays; i++) {

        const format = getBookDateFormat(new Date(startDate.getTime() + (oneDayMillieseconds * i)));

        if(!format){
            return false;
        } else if(notAllowedDays.includes(format)){
            return false;
        }

    }

    return true;

};

export const getErrorText = (errorName, isEnglish) => {

    if(isEnglish){

        switch(errorName){
            case 'pass error': 
                return 'Invalid password';
            case 'name error': 
                return 'Invalid name.';
            case 'email error': 
                return 'Invalid email.';
            case 'email error 2': 
                return 'Invalid email, try logging in';
            case 'captcha error': 
                return 'Please prove that you are not a robot';
            case 'input error': 
                return '.Error in the data entered, please correct it';
            case 'request error': 
                return 'Connection error, please try again';
            case 'empty field': 
                return 'All fields are required, please fill in the empty fields';
            case 'user not exist': 
                return 'Error in the data entered. Please enter a valid email address';
            case 'login': 
                return 'Log in to your account';
            case 'access error': 
                return 'The request is not allowed to be executed';
            case 'send code error': 
                return 'The code is invalid, please send a new code';
            case 'not exist error':
                return 'Not exist';
            case 'attempts exceeded':
                return 'The intended login attempts number has been exceeded. Please change your password from the Forgot Password page.';
            default:
                return errorName || 'Error occured';
        }

    } else {
    
        switch(errorName){
            case 'pass error': 
                return 'كلمة مرور غير صالحة';
            case 'name error': 
                return 'اسم غير صالح.';
            case 'email error': 
                return 'بريد الكتروني غير صالح.';
            case 'email error 2': 
                return '.بريد الكتروني غير صالح, جرب تسجيل الدخول';
            case 'captcha error': 
                return '.الرجاء اثبات انك لست روبوت';
            case 'input error': 
                return '.خطأ في البيانات المدخلة, الرجاء تصحيحها';
            case 'request error': 
                return '.خطأ في الاتصال, الرجاء المحاولة مجددا';
            case 'empty field': 
                return '.كل الحقول مطلوبة, الرجاء ملء الحقول الخالية';
            case 'user not exist': 
                return '.خطأ في البيانات المدخلة, الرجاء ادخال بريد الكتروني صحيح';
            case 'login': 
                return '.سجل الدخول الى حسابك';
            case 'access error': 
                return '.غير مسموح بتنفيذ الطلب';
            case 'send code error': 
                return '.الرمز غير صالح, الرجاء ارسال رمز جديد';
            case 'not exist error':
                return 'غير موجود.';
            case 'attempts exceeded':
                return 'تم تجاوز عدد محاولات تسجيل الدخول المسموح, الرجاء تغيير كلمة من صفحة نسيت كلمة السر.';
            default:
                return errorName || 'حدث خطأ';
        }
           
    }

};

const names = [
    ['عروضنا المميزة', 'Special Offers'],
    ['هل تبحث عن سيارة للإيجار أو شقة للإقامة؟ نحن هنا لمساعدتك في العثور على أفضل الخيارات, اختر من بين مجموعة متنوعة من السيارات، بدءًا من الاقتصادية إلى الفاخرة, بحث عن شقق مفروشة أو غير مفروشة، وفلل، وشقق مشتركة.', 'Are you looking for a car to rent or an apartment to stay in? We are here to help you find the best options. Choose from a variety of cars, from economical to luxury. Search for furnished or unfurnished apartments, villas, and shared apartments.'],
    ['استكشف', 'Explore'],
    ['توجد لدينا عروض بمختلف أصناف العقارات و السيارات من شقق و منازل الى مزارع و مخيمات و سيارات أينما كنت في الاردن ستجد ما يناسبك', 'We have offers for various types of real estate and cars, from apartments and houses to farms, camps and cars. Wherever you are in Jordan, you will find what suits you.'],
    ['استفد من عروضنا الحصرية لإِيجار السيارات و العقارات في كل أنحاء الاردن', 'Take advantage of our exclusive offers for car and real estate rentals throughout Jordan'],
    ['ايجارك المثالي', 'Your Ideal Rent'],
    ['تمتع بمرونة كبيرة في الأسعار و الخيارات.', 'Enjoy great flexibility in prices and options.'],
    ['تفقد آخر العروض الحصرية', 'Check out the latest exclusive offers'],
    ['ماذا نقدم لك؟', 'What do we offer you?'],
    ['سنساعد في إِيجاد إِيجارك المثالي', 'We will help find your perfect rental'],
    ['مزارع و شاليهات', 'Farms & Chalets'],
    ['شقق و استوديوهات', 'Apartments and Studios'],
    ['مخيمات و منتجعات', 'Camps & Resorts'],
    ['سكن طلاب', 'Students housing'],
    ['وسائل نقل', 'Vehicles'],
    ['وسائل نقل و سيارات', 'Transports & Vehicles'],
    ['أضف عقارك', 'Add Property'],
    ['الدخول أو انشاء حساب', 'Log in or create an account'],
    ['عرض الخريطة', 'Show map'],
    ['اختر المدينة', 'choose a city'],
    ['التصنيف', 'choose catagory'],
    ['تاريخ الحجز', 'booking date'],
    ['تاريخ انتهاء الحجز', 'expiry date'],
    ['كل المدن', 'All cities'],
    ['كل التصنيفات', 'All catagories'],
    ['السعر', 'price'],
    ['عقارات', 'properties'],
    ['ابحث', 'Search'],
    ['ابحث عن', 'Search about'],
    ['أو أكثر', 'or more'],
    ['التقييم', 'Evaluation'],
    ['تقييم', 'Evaluation'],
    ['ترتيب', 'Sort'],
    ['تصفية', 'Filter'],
    ['صفحة الادارة', 'Admin page'],
    ['خطأ في سيرفر تخزين الملفات', 'Error occured in storage server'],
    ['خطأ في السيرفر الأساسي', 'Error occured in the main server'],
    ['حذف الخطأ', 'Delete error'],
    ['جاري حذف الخطأ...', 'Deleting error...'],
    ['المدينة', 'City'],
    ['الذهاب', 'Go'],
    ['تخطي', 'Skip'],
    ['تواصل معنا', 'Contact Us'],
    ['عدة اختيارات', 'Multiple Choices'],
    ['كل السيارات', 'All Vehicles'],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
];

export const getNameByLang = (desired, isEn) => {

    if(!desired) return '';

    let desiredName = '';

    const searchName = desired.toUpperCase();

    for (let i = 0; i < names.length; i++) {
        if(names[i][0].toUpperCase() === searchName){
            desiredName = isEn && names[i][1].length > 0 ? names[i][1] : (names[i][0].length > 0 ? names[i][0] : desired)
        }
    }

    return desiredName;

};

export function decodeArabicUrl(url) {
    try {
      // Decode the URL-encoded string
      const decodedString = decodeURIComponent(url);
      return decodedString?.replaceAll('-', ' ');
    } catch (error) {
      return null; // Handle the error as needed
    }
};

export const getDetailedResTypeNum = (onlyText, resType, resTypeNum, isEn, noPuralS) => {

    const dayName = (isAnd) => { return isEn ? ` Day${noPuralS ? '' : 's'} ${isAnd ? '& ' : ''}` : ` يوم ${isAnd ? 'و ' : ''}` };
    const weekName = (isAnd) => { return isEn ?  ` Week${noPuralS ? '' : 's'} ${isAnd ? '& ' : ''}` : ` اسبوع ${isAnd ? 'و ' : ''}` };
    const monthName = (isAnd) => { return isEn ? ` Month${noPuralS ? '' : 's'} ${isAnd ? '& ' : ''}` : ` شهر ${isAnd ? 'و ' : ''}` };
    const yearName = (isAnd) => { return isEn ?  ` Year${noPuralS ? '' : 's'} ${isAnd ? '& ' : ''}` : ` سنة ${isAnd ? 'و ' : ''}` };
    const seasonName = isEn ? ' Season ' : ' فصل' ;
    const eventsName = isEn ? ' Event ' : ' مناسبة ';

    const getMultipleName = (mulId) => {
        return isEn 
        ? reservationType()?.find(i => i.id === mulId)?.multipleEn + ' '
        : reservationType()?.find(i => i.id === mulId)?.multipleAr
    };

    if(!onlyText)
      switch(resType?.id){

        case 0:
          return resTypeNum;

        case 1:
          if((resTypeNum - Math.floor(resTypeNum)) === 0) 
            return Math.floor(resTypeNum);
          else 
            return <>{Math.floor(resTypeNum)} <span>{isEn ? ' & ' : ' وعدد '} {getMultipleName(0)}</span> {' ' + Math.round((resTypeNum - Math.floor(resTypeNum)) * 7)}</>

        case 2:
          const daysBookedInThisBook = Math.round((resTypeNum - Math.floor(resTypeNum)) * 30);
          const daysRemainingInWeeks = daysBookedInThisBook / 7;

          if((resTypeNum - Math.floor(resTypeNum)) === 0) 
            return Math.floor(resTypeNum);
          else if(daysBookedInThisBook < 7)
            return <>{Math.floor(resTypeNum)} <span>{(isEn ? ' & ' : ' و عدد ') + getMultipleName(0)}</span> {' ' + Math.round((resTypeNum - Math.floor(resTypeNum)) * 30)}</>
          else if((daysRemainingInWeeks - Math.floor(daysRemainingInWeeks)) === 0)
            return <>{Math.floor(resTypeNum)} <span>{(isEn ? ' & ' : ' و عدد ') + getMultipleName(1)}</span> {' ' + Math.floor(daysRemainingInWeeks)}</>
          else
            return <>{Math.floor(resTypeNum)} <span>{(isEn ? ' & ' : ' و عدد ') + getMultipleName(1)}</span> {' ' + Math.floor(daysRemainingInWeeks)} <span> {(isEn ? ' & ' : ' و عدد ') + getMultipleName(0)}</span> {' ' + Math.round((daysRemainingInWeeks - Math.floor(daysRemainingInWeeks)) * 7)}</>

        case 3:
          return resTypeNum;

        case 4:
          const daysBookedInThisBook2 = Math.round((resTypeNum - Math.floor(resTypeNum)) * 365);
          const daysRemainingInMonths = daysBookedInThisBook2 / 30;
          const daysRemainingInWeeks2 = Math.round((daysRemainingInMonths - Math.floor(daysRemainingInMonths)) * 30) / 7;

          if((resTypeNum - Math.floor(resTypeNum)) === 0) 
            return Math.floor(resTypeNum);

          else if(daysBookedInThisBook2 >= 30 && (daysRemainingInMonths - Math.floor(daysRemainingInMonths)) === 0)
            return <>{Math.floor(resTypeNum)} <span>{(isEn ? ' & ' : ' و عدد ') + getMultipleName(2)}</span> {' ' + Math.floor(daysRemainingInMonths)}</>

          else if(daysBookedInThisBook2 >= 30 && (daysRemainingInWeeks2 - Math.floor(daysRemainingInWeeks2)) === 0)
            return <>{Math.floor(resTypeNum)} <span>{(isEn ? ' & ' : ' و عدد ') + getMultipleName(2)}</span> {' ' + Math.floor(daysRemainingInMonths)} <span>{(isEn ? ' & ' : ' و عدد ') + getMultipleName(1)}</span> {' ' + Math.floor(daysRemainingInWeeks2)}</>

          else if(daysBookedInThisBook2 < 30 && (daysRemainingInWeeks2 - Math.floor(daysRemainingInWeeks2)) === 0)
            return <>{Math.floor(resTypeNum)} <span>{(isEn ? ' & ' : ' و عدد ') + getMultipleName(1)}</span> {' ' + Math.floor(daysRemainingInWeeks2)}</>

          else if(daysBookedInThisBook2 < 30)
            return <>{Math.floor(resTypeNum)} <span>{(isEn ? ' & ' : ' و عدد ') + getMultipleName(1)}</span> {' ' + Math.floor(daysRemainingInWeeks2)} <span> {(isEn ? ' & ' : ' و عدد ') + getMultipleName(0)}</span> {' ' + Math.round((daysRemainingInWeeks2 - Math.floor(daysRemainingInWeeks2)) * 7)}</>

          else
            return <>{Math.floor(resTypeNum)} <span>{(isEn ? ' & ' : ' و عدد ') + getMultipleName(2)}</span> {' ' + Math.floor(daysRemainingInMonths)} <span>{(isEn ? ' & ' : ' و عدد ') + getMultipleName(1)}</span> {' ' + Math.floor(daysRemainingInWeeks2)}<span> {(isEn ? ' & ' : ' و عدد ') + getMultipleName(0)}</span> {' ' + Math.round((daysRemainingInWeeks2 - Math.floor(daysRemainingInWeeks2)) * 7)}</>
        
        case 5:
            return resTypeNum;
            
      }
    else 
      switch(resType?.id){

        case 0:
          return resTypeNum + dayName();

        case 1:
          if((resTypeNum - Math.floor(resTypeNum)) === 0) 
            return Math.floor(resTypeNum) + weekName();
          else 
            return Math.floor(resTypeNum) + weekName(true) + Math.round((resTypeNum - Math.floor(resTypeNum)) * 7) + dayName();

        case 2:
          const daysBookedInThisBook = Math.round((resTypeNum - Math.floor(resTypeNum)) * 30);
          const daysRemainingInWeeks = daysBookedInThisBook / 7;

          if((resTypeNum - Math.floor(resTypeNum)) === 0) 
            return Math.floor(resTypeNum) + monthName();
          else if(daysBookedInThisBook < 7)
            return Math.floor(resTypeNum) + monthName(true) + Math.round((resTypeNum - Math.floor(resTypeNum)) * 30) + dayName();
          else if((daysRemainingInWeeks - Math.floor(daysRemainingInWeeks)) === 0)
            return Math.floor(resTypeNum) + monthName(true) + Math.floor(daysRemainingInWeeks) + weekName();
          else
            return Math.floor(resTypeNum) + monthName(true) + Math.floor(daysRemainingInWeeks) + weekName(true) + Math.round((daysRemainingInWeeks - Math.floor(daysRemainingInWeeks)) * 7) + dayName();

        case 3:
          return resTypeNum + seasonName;

        case 4:
          const daysBookedInThisBook2 = Math.round((resTypeNum - Math.floor(resTypeNum)) * 365);
          const daysRemainingInMonths = daysBookedInThisBook2 / 30;
          const daysRemainingInWeeks2 = Math.round((daysRemainingInMonths - Math.floor(daysRemainingInMonths)) * 30) / 7;

          if((resTypeNum - Math.floor(resTypeNum)) === 0) 
            return Math.floor(resTypeNum) + yearName();

          else if(daysBookedInThisBook2 >= 30 && (daysRemainingInMonths - Math.floor(daysRemainingInMonths)) === 0)
            return Math.floor(resTypeNum) + yearName(true) + Math.floor(daysRemainingInMonths) + monthName();

          else if(daysBookedInThisBook2 >= 30 && (daysRemainingInWeeks2 - Math.floor(daysRemainingInWeeks2)) === 0)
            return Math.floor(resTypeNum) + yearName(true) + Math.floor(daysRemainingInMonths) + monthName(true) + Math.floor(daysRemainingInWeeks2) + weekName();

          else if(daysBookedInThisBook2 < 30 && (daysRemainingInWeeks2 - Math.floor(daysRemainingInWeeks2)) === 0)
            return Math.floor(resTypeNum) + yearName(true) + Math.floor(daysRemainingInWeeks2) + weekName();

          else if(daysBookedInThisBook2 < 30)
            return Math.floor(resTypeNum) + yearName(true) + Math.floor(daysRemainingInWeeks2) + weekName(true) + Math.round((daysRemainingInWeeks2 - Math.floor(daysRemainingInWeeks2)) * 7) + dayName();

          else
            return Math.floor(resTypeNum) + yearName(true) + Math.floor(daysRemainingInMonths) + monthName(true) + Math.floor(daysRemainingInWeeks2) + weekName(true) + ' ' + Math.round((daysRemainingInWeeks2 - Math.floor(daysRemainingInWeeks2)) * 7) + dayName();
        
        case 5:
            return resTypeNum + eventsName;

      }


    //   switch(resType?.id){

    //     case 0:
    //       return isEn ? resTypeNum + ' days' : resTypeNum;

    //     case 1:
    //       if((resTypeNum - Math.floor(resTypeNum)) === 0) 
    //         return Math.floor(resTypeNum) + (isEn && ' weeks');
    //       else 
    //         return <>{Math.floor(resTypeNum)}  {' ' + Math.round((resTypeNum - Math.floor(resTypeNum)) * 7)}</>

    //     case 2:
    //       const daysBookedInThisBook = Math.round((resTypeNum - Math.floor(resTypeNum)) * 30);
    //       const daysRemainingInWeeks = daysBookedInThisBook / 7;

    //       if((resTypeNum - Math.floor(resTypeNum)) === 0) 
    //         return Math.floor(resTypeNum);
    //       else if(daysBookedInThisBook < 7)
    //         return <>{Math.floor(resTypeNum)} <span>{' و عدد ' + reservationType()?.find(i => i.id === 0)?.multipleAr}</span> {' ' + Math.round((resTypeNum - Math.floor(resTypeNum)) * 30)}</>
    //       else if((daysRemainingInWeeks - Math.floor(daysRemainingInWeeks)) === 0)
    //         return <>{Math.floor(resTypeNum)} <span>{' و عدد ' + reservationType()?.find(i => i.id === 1)?.multipleAr}</span> {' ' + Math.floor(daysRemainingInWeeks)}</>
    //       else
    //         return <>{Math.floor(resTypeNum)} <span>{' و عدد ' + reservationType()?.find(i => i.id === 1)?.multipleAr}</span> {' ' + Math.floor(daysRemainingInWeeks)} <span> {' و عدد ' + reservationType()?.find(i => i.id === 0)?.multipleAr}</span> {' ' + Math.round((daysRemainingInWeeks - Math.floor(daysRemainingInWeeks)) * 7)}</>

    //     case 3:
    //       return resTypeNum;

    //     case 4:
    //       const daysBookedInThisBook2 = Math.round((resTypeNum - Math.floor(resTypeNum)) * 365);
    //       const daysRemainingInMonths = daysBookedInThisBook2 / 30;
    //       const daysRemainingInWeeks2 = Math.round((daysRemainingInMonths - Math.floor(daysRemainingInMonths)) * 30) / 7;

    //       if((resTypeNum - Math.floor(resTypeNum)) === 0) 
    //         return Math.floor(resTypeNum);

    //       else if(daysBookedInThisBook2 >= 30 && (daysRemainingInMonths - Math.floor(daysRemainingInMonths)) === 0)
    //         return <>{Math.floor(resTypeNum)} <span>{' و عدد ' + reservationType()?.find(i => i.id === 2)?.multipleAr}</span> {' ' + Math.floor(daysRemainingInMonths)}</>

    //       else if(daysBookedInThisBook2 >= 30 && (daysRemainingInWeeks2 - Math.floor(daysRemainingInWeeks2)) === 0)
    //         return <>{Math.floor(resTypeNum)} <span>{' و عدد ' + reservationType()?.find(i => i.id === 2)?.multipleAr}</span> {' ' + Math.floor(daysRemainingInMonths)} <span>{' و عدد ' + reservationType()?.find(i => i.id === 1)?.multipleAr}</span> {' ' + Math.floor(daysRemainingInWeeks2)}</>

    //       else if(daysBookedInThisBook2 < 30 && (daysRemainingInWeeks2 - Math.floor(daysRemainingInWeeks2)) === 0)
    //         return <>{Math.floor(resTypeNum)} <span>{' و عدد ' + reservationType()?.find(i => i.id === 1)?.multipleAr}</span> {' ' + Math.floor(daysRemainingInWeeks2)}</>

    //       else if(daysBookedInThisBook2 < 30)
    //         return <>{Math.floor(resTypeNum)} <span>{' و عدد ' + reservationType()?.find(i => i.id === 1)?.multipleAr}</span> {' ' + Math.floor(daysRemainingInWeeks2)} <span> {' و عدد ' + reservationType()?.find(i => i.id === 0)?.multipleAr}</span> {' ' + Math.round((daysRemainingInWeeks2 - Math.floor(daysRemainingInWeeks2)) * 7)}</>

    //       else
    //         return <>{Math.floor(resTypeNum)} <span>{' و عدد ' + reservationType()?.find(i => i.id === 2)?.multipleAr}</span> {' ' + Math.floor(daysRemainingInMonths)} <span>{' و عدد ' + reservationType()?.find(i => i.id === 1)?.multipleAr}</span> {' ' + Math.floor(daysRemainingInWeeks2)}<span> {' و عدد ' + reservationType()?.find(i => i.id === 0)?.multipleAr}</span> {' ' + Math.round((daysRemainingInWeeks2 - Math.floor(daysRemainingInWeeks2)) * 7)}</>
        
    //   }
};

export const handleDays = (
    calendarDoubleValue, setResType, setResTypeNum
) => {

    const daysBooked = getNumOfBookDays(calendarDoubleValue);

    const setDayBook = () => {
      setResType(reservationType()?.find(i=>i.id===0));
      setResTypeNum(daysBooked);
    };

    const setWeekBook = () => {
      setResType(reservationType()?.find(i=>i.id===1));
      setResTypeNum(daysBooked / 7);
    };

    const setMonthBook = () => {
      setResType(reservationType()?.find(i=>i.id===2));
      setResTypeNum(daysBooked / 30);
    };

    const setYearBook = () => {
      setResType(reservationType()?.find(i=>i.id===4));
      setResTypeNum(daysBooked / 365);
    };

    const setResTypeFromDaysBooked = () => {
      if(daysBooked < 7) return setDayBook();
      if(daysBooked < 30) return setWeekBook();
      if(daysBooked < 365) return setMonthBook();
      return setYearBook();
      // if(daysBooked < 7) return setSesBook();
    }
    
    setResTypeFromDaysBooked();

};