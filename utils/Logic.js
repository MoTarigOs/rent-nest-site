import { ProperitiesCatagories, VehicleCatagories } from "./Data";
import imageCompression from 'browser-image-compression';

// new Compressor(image, {      //npm install compressorjs
// quality: 0.8,
// success: (compressedResult) => {
//     // compressedResult has the compressed file.
//     // Use the compressed file to upload the images to your server.
//     setCompressedFile(res)
// },
// });

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
    { value: 86400000, arabicName: '1 يوم' },
    { value: 120, arabicName: 'اسبوع' },
    { value: 1200, arabicName: 'شهر' },
    { value: 12000, arabicName: '6 شهور' },
    { value: 120000, arabicName: 'سنة' },
    { value: 1200000, arabicName: '10 سنة' },
    { value: 12000000, arabicName: '100 سنة' },
];

export const propsSections = [
    { value: 'check-properties', arabicName: 'عروض غير مقبولة' },
    { value: 'hidden-properties', arabicName: 'عروض مخفية' },
    { value: 'properties-by-files', arabicName: 'عروض حسب حجم الملفات' },
];

export const usersSections = [
    { value: 'all-users', arabicName: 'كل المستخدمين' },
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
        if(!testCharacaters.includes(name[i])){
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

export const isValidPassword = (ps) => {

    if(typeof ps !== "string" || ps.length < 8 || ps.length > 30) return { ok: false };

    for (let i = 0; i < ps.length; i++) {

        let passed = false;

        for (let j = 0; j < testCharacaters.length; j++) {
            if(ps[i] === testCharacaters[j]) 
                passed = true;
        }

        if(!passed) return { ok: false };

    };

    return { ok: true };

};

export const getArabicNameCatagory = (thisCatagory) => {
    const ct = ProperitiesCatagories.find(i => i.value === thisCatagory);
    if(ct) return ct.arabicName;
    const vct = VehicleCatagories.find(i => i.value === thisCatagory);
    if(vct) return vct.arabicName;
    return 'كل التصنيفات';
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

export function getReadableDate (date, isSimple) {
    if(!date || date <= 0) return 'غير محدد';
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
    return (new Intl.DateTimeFormat('ar', obj)
        .format(date).toString());
};

export const getNumOfBookDays = (bookDate) => {
  
    if(!bookDate || !bookDate[0] || !bookDate[1] || bookDate[0] === bookDate[1]) return 1;

    const x = Math.ceil((bookDate[1].getTime() - bookDate[0].getTime()) / (1000 * 60 * 60 * 24)) - 1;

    if(x > 1) return x;

    return 1;

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

export const isOkayBookDays = (dateArr, notAllowedDays) => {

    if(!dateArr || !notAllowedDays) return false;

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