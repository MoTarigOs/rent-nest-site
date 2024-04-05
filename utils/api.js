import axios from 'axios';
import { getDurationReadable, getReadableDate, propsSections, usersSections } from './Logic';
axios.defaults.withCredentials = true;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const uploadServerBaseUrl = process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL;

const getErrorText = (errorName) => {
    
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
        default:
            return 'خطأ غير معروف, الرجاء المحاولة مجددا.';
    }

}

// App api methods
export const getLocation = async() => {

    try {

        const url = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

        const res = await axios.get(url);

        if(res && res.latitude && res.longitude){
            return { long: res.longitude, lat: res.latitude };
        }

        return { long: null, lat: null };
        
    } catch (err) {
        console.log(err.message);
        return { long: null, lat: null };
    }

};


// User api methods

export const getUserInfo = async(
    setUserId, setUserUsername, setUserRole, 
    setUserEmail, setIsVerified, setUserAddress,
    setUserPhone, setBooksIds, setFavouritesIds,
    setLoading, setStorageKey
) => {

    try {
        const url = `${baseUrl}/user/info`;
        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        if(!res?.status || res.status !== 200) {
            setLoading(false);
            return { success: false, dt: res.data.message };
        }
        if(res.data.user_id) setUserId(res.data.user_id);
        if(res.data.user_username) setUserUsername(res.data.user_username);
        if(res.data.user_email) setUserEmail(res.data.user_email);
        if(res.data.address) setUserAddress(res.data.address);
        if(res.data.phone) setUserPhone(res.data.phone);
        if(res.data.is_verified !== undefined) setIsVerified(res.data.is_verified);
        if(res.data.role) setUserRole(res.data.role);
        if(res.data.my_books) setBooksIds(res.data.my_books);
        if(res.data.my_fav) setFavouritesIds(res.data.my_fav);
        if(res.data.storage_key) setStorageKey(res.data.storage_key);
        //res.data.tokenExp
        setLoading(false);
        console.log('storage key: ', res.data.storage_key);
        return { success: true, dt: res.data };
    } catch (err) {
        setLoading(false);
        return { success: false, dt: err?.response?.data ? err.response.data : getErrorText('') };
    }

};

export const register = async(username, email, password) => {

    try {
        const url = `${baseUrl}/user/register`;
        const body = {
            username, email, password
        };
        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data ? res.data : '') };
        }
        return { success: true, dt: res.data };
    } catch (err) {
        return { success: false, dt: getErrorText(err.response?.data ? err.response.data : '') };
    }

};

export const login = async(email, password) => {

    try {
        const url = `${baseUrl}/user/login`;
        const body = {
            email, password
        };
        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        console.log(res);
        if(!res?.status || res.status !== 201){
            if(res.data.blockTime){
                return { ok: false, dt: 'حسابك في حالة حظر حاليا, يرجى معاودة تسجيل الدخول بعد' + getReadableDate(res.data.blockTime) }
            } else {
                return { success: false, dt: getErrorText(res.data.message) };
            }
        }
        return { success: true, dt: res.data };
    } catch (err) {
        console.log(err.message);
        return { success: false, dt: err?.response?.data?.blockTime 
            ? 'حسابك في حالة حظر حاليا, يرجى معاودة تسجيل الدخول بعد' + ' ' + getDurationReadable(err.response.data.blockTime) + (err?.response?.data?.blockReason ? err.response.data.blockReason : '')
            : getErrorText(err?.response?.data?.message) };
    }

};

export const sendCode = async() => {

    try {
        
        const url = `${baseUrl}/user/send-code`;

        const res = await axios.post(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });        

        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data.message) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response.data.message) };
    }

};

export const verifyMyEmail = async(code) => {

    try {
        
        const url = `${baseUrl}/user/verify-email`;

        const body = {
            eCode: code
        }

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });        

        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data.message) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response.data.message) };
    }

};

export const changeMyPass = async(code, email, newPassword) => {

    try {
        
        const url = `${baseUrl}/user/change-password`;

        const body = {
            eCode: code, newPassword, email
        }

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });        

        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data.message) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response.data.message) };
    }

};

export const editUser = async(infoObj) => {

    try {
        
        const url = `${baseUrl}/user/edit`;

        const updateUsername = infoObj?.editUsername?.length > 0 ? infoObj.editUsername : null;
        const updateAddress = infoObj?.editAddress?.length > 0 ? infoObj.editAddress : null;
        const updatePhone = infoObj?.editPhone?.length > 0 ? infoObj.editPhone : null;

        const body = {
            updateUsername,
            updateAddress,
            updatePhone
        }

        const res = await axios.patch(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });        

        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data.message) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response.data.message) };
    }

};

export const deleteMyAccount = async(eCode, key, email) => {

    try {
        
        const deleteFilesUrl = `${uploadServerBaseUrl}/delete/multiple-properties-files?eCode=${eCode}&&email=${email}`;

        const deleteFilesRes = await axios.delete(deleteFilesUrl, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true, 
            headers: {"authorization" : `Bearer ${key}`}
        });        

        if(!deleteFilesRes?.status || deleteFilesRes.status !== 201){
            return { success: false, dt: getErrorText(res.data.message) };
        }

        const url = `${baseUrl}/user/delete`;

        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });        

        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data.message) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response.data.message) };
    }

};

export const handleFavourite = async(propId, isRemove) => {

    try {
        
        const url = `${baseUrl}/user/favourites/${propId}`;

        let res = null;

        if(isRemove){
            res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        } else {
            res = await axios.put(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        }
        
        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data.message) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response.data.message) };
    }

};

export const handleBooksAddRemove = async(propId, isRemove, startDate, endDate) => {

    try {
        
        const url = `${baseUrl}/user/books/${propId}`;

        const body = {
            startDate, endDate
        }

        let res = null;

        if(isRemove){
            res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        } else {
            res = await axios.put(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        }

        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data.message) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response.data.message) };
    }

};

export const signOut = async() => {

    try {
        
        const url = `${baseUrl}/user/logout`;

        const res = await axios.post(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });;

        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data.message) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response.data.message) };
    }

};


// property api methods

export const createProperty = async(
    type_is_vehicle, specific_catagory, title, description, city, neighbourhood,
    map_coordinates, price, details, terms_and_conditions
) => {

    try {

        const url = `${baseUrl}/property/create`;

        const body = { 
            type_is_vehicle, specific_catagory, title, description, 
            city, neighbourhood, map_coordinates, price, details, 
            terms_and_conditions
        };

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data ? res.data : '') };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response?.data ? err.response.data.message : 'unknown error') };
    }

};

export const editProperty = async(
    propertyId, title, description, price, details, terms_and_conditions
) => {

    try {

        const url = `${baseUrl}/property/edit/${propertyId}`;

        const body = { 
            title, description, price, 
            details, terms_and_conditions
        };

        const res = await axios.put(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data ? res.data : '') };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response?.data ? err.response.data.message : 'unknown error') };
    }

};

export const uploadFiles = async(files, id, key, email) => {

    try {

        const url = `${uploadServerBaseUrl}/upload/property/${id}?email=${email}`;
        
        const data = new FormData();

        files.forEach((file, i) => {
          data.append('FilesForUpload', file, file.name);
        });

        const res = await axios.post(url, data, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true,
            headers: {"authorization" : `Bearer ${key}`}
        });
    
        if(res.status === 201) return { success: true, dt: res.data };

        return { success: false, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response?.data ? err.response.data.message : 'unknown error') };
    }

};

export const deleteFiles = async(id, filenames, key, email) => {

    try {

        const url = `${uploadServerBaseUrl}/delete/property-specific-files/${id}?email=${email}`;
        
        const body = { filenamesArray: filenames };

        const res = await axios.post(url, body, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true,
            headers: {"authorization" : `Bearer ${key}`}
        });
    
        if(res.status === 201) return { success: true, dt: res.data };

        return { success: false, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response?.data ? err.response.data.message : 'unknown error') };
    }

};

export const getOwnerProperties = async(userId) => {

    try {

        const url = `${baseUrl}/property/owner/${userId}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res?.status || res.status !== 200) return { success: false, dt: getErrorText(res?.data?.message ? res.data.messsage : '') }
    
        return { success: true, dt: res.data };
    
    } catch (err) {
        return { success: false, dt: getErrorText(err.response?.data ? err.response.data.message : 'unknown error')}
    }
};

export const getFavourites = async() => {

    try {

        const url = `${baseUrl}/user/favourites`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res?.status || res.status !== 200) return { success: false, dt: getErrorText(res?.data?.message ? res.data.messsage : '') }
    
        return { success: true, dt: res.data };
    
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }
};

export const getBooks = async() => {

    try {

        const url = `${baseUrl}/user/books`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res?.status || res.status !== 200) return { success: false, dt: getErrorText(res?.data?.message ? res.data.messsage : '') }
    
        return { success: true, dt: res.data };
    
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }
};

export const fetchPropertyDetails = async(propertyId) => {

    try {

        const url = `${baseUrl}/property/item?propertyId=${propertyId}`;

        console.log(url);

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res?.status || res.status !== 200) return { success: false, dt: getErrorText(res?.data?.message ? res.data.messsage : '') }
    
        return { success: true, dt: res.data };
    
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }

};

export const getProperties = async(
    city, isType, specific, priceRange, 
    minRate, searchText, sort, long, lat,
    skip
) => {

    try {

        const url = `${baseUrl}/property?${city?.length > 0 ? 'city=' + city : ''}${(isType === false || isType === true) ? '&type_is_vehicle=' + isType.toString() : ''}${specific?.length > 0 ? '&specific=' + specific : ''}${priceRange?.length > 1 ? '&price_range=' + priceRange : ''}${minRate > 0 ? '&min_rate=' + minRate : ''}${searchText?.length > 0 ? '&text=' + searchText : ''}${sort?.length > 0 ? '&sort=' + sort : ''}${long?.length > 0 ? '&longitude=' + long : ''}${lat?.length > 0 ? '&latitude=' + lat : ''}${(typeof skip === 'number' && skip > 0) ? '&skip=' + skip : ''}`;

        console.log('fetching data url: ', url);

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        console.log('res: ', res);

        if(!res?.status || res.status !== 200) return { success: false, dt: getErrorText(res?.data?.message ? res.data.messsage : '') }
    
        return { success: true, dt: res.data };
    
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }
};

export const sendReview = async(score, text, propertyId) => {

    try {

        const url = `${baseUrl}/property/write-review?propertyId=${propertyId}`;

        const body = {
            text,
            user_rating: score
        };

        const res = await axios.put(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res || !res.status || res.status !== 201) return { success: false, dt: getErrorText(res.data) };

        return { success: true, dt: '' };
        
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }

};

export const showProp = async(propertyId, type) => {

    try {

        const url = `${baseUrl}/property/${type}/${propertyId}`;

        console.log('url: ', url);
        
        const res = await axios.put(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res || !res.status || res.status !== 201) return { success: false, dt: getErrorText(res.data) };

        return { success: true, dt: res.data };
        
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }

};

export const setBookable = async(propertyId, type) => {

    try {

        const url = `${baseUrl}/property/${type}/${propertyId}`;

        console.log('url: ', url);
        
        const res = await axios.put(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res || !res.status || res.status !== 201) return { success: false, dt: getErrorText(res.data) };

        return { success: true, dt: res.data };
        
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }

};

export const setNewBookedDays = async(propertyId, bookedDays) => {

    try {

        const url = `${baseUrl}/property/booked-days/${propertyId}`;

        console.log('url: ', url);

        const body = {
            bookedDays
        }
        
        const res = await axios.put(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res || !res.status || res.status !== 201) return { success: false, dt: getErrorText(res.data) };

        return { success: true, dt: res.data };
        
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }

};

export const deleteProp = async(propertyId) => {

    try {

        const url = `${baseUrl}/property/delete/${propertyId}`;

        console.log('url: ', url);

        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res || !res.status || res.status !== 201) return { success: false, dt: getErrorText(res.data) };

        return { success: true, dt: '' };
        
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }

};

export const deletePropFiles = async(propertyId, email) => {

    try {

        const url = `${uploadServerBaseUrl}/delete/property-files/${propertyId}?email=${email}`;

        const res = await axios.delete(url, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true,
            headers: {"authorization" : `Bearer ${key}`}
        });
        
        if(!res || !res.status || res.status !== 201) return { success: false, dt: getErrorText(res.data) };

        return { success: true, dt: '' };
        
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }

};



// Report api methods
export const makeReport = async(text, propertyId, writerId) => {

    try {

        const url = `${baseUrl}/report${writerId ? '/review?writerId=' + writerId + '&' : '?'}propertyId=${propertyId}`;

        const body = {
            text
        };

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res || !res.status || res.status !== 201) return { success: false, dt: getErrorText(res.data) };

        return { success: true, dt: '' };
        
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }

};


// Admin api methods
export const getReports = async() => {

    try {

        const url = `${baseUrl}/admin/reports`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        console.log('res: ', res);

        if(!res?.status || res.status !== 200) return { success: false, dt: getErrorText(res?.data?.message ? res.data.messsage : '') }
    
        return { success: true, dt: res.data };
    
    } catch (err) {
        console.log(err.message);
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }
};

export const getAdminProps = async(type, skip) => {

    try {

        console.log(type);

        if(type !== 'check-properties' && type !== 'hidden-properties' && type !== 'properties-by-files')
            return { success: false, dt: 'اختر تصنيف' };

        const url = `${baseUrl}/admin/${type}${skip?.length > 0 ? '&skip=' + skip : ''}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        console.log('res: ', res);

        if(!res?.status || res.status !== 200) return { success: false, dt: getErrorText(res?.data?.message ? res.data.messsage : '') }
    
        return { success: true, dt: res.data };
    
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }
};

export const getUsersAdmin = async(type, skip) => {

    try {

        console.log(type);

        if(!usersSections.includes(type))
            return { success: false, dt: 'اختر تصنيف' };

        const url = `${baseUrl}/admin/users?filterType=${type.value}${skip > 0 ? '&skip=' + skip: ''}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        console.log('res: ', res);

        if(!res?.status || res.status !== 200) return { success: false, dt: getErrorText(res?.data?.message ? res.data.messsage : '') }
    
        return { success: true, dt: res.data };
    
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }
};

export const getUserByEmailAdmin = async(email) => {

    try {

        const url = `${baseUrl}/admin/user-by-email/${email}`;

        console.log('url: ', url);

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        console.log('res: ', res);

        if(!res?.status || res.status !== 200) return { success: false, dt: getErrorText(res?.data?.message ? res.data.messsage : '') }
    
        return { success: true, dt: res.data };
    
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }
};

export const deletePropFilesAdmin = async(propId, key, email) => {

    try {

        const url = `${uploadServerBaseUrl}/admin/property-files/${propId}?email=${email}`;

        console.log('url: ', url);
    
        const res = await axios.delete(url, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true,
            headers: {"authorization" : `Bearer ${key}`}
        });
    
        if(res.status === 201) return { success: true, dt: res.data };

        return { success: false, dt: getErrorText(res.data) };

    } catch (err) {
        console.log(err.message);
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data) : 'خطأ غير معروف' };
    }

};

export const handlePropAdmin = async(propertyId, type) => {

    try {

        console.log('api: ', type);

        if(type !== 'pass-property' 
            && type !== 'hide-property'
            && type !== 'show-property'
            && type !== 'delete-property')
                return { success: false, dt: 'خطأ في احد الروابط' };

        const url = `${baseUrl}/admin/${type}/${propertyId}`;

        console.log('url: ', url);
        
        let res = null;
        
        if(type === 'delete-property'){
            res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        } else {
            res = await axios.put(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        }

        if(!res || !res.status || res.status !== 201) return { success: false, dt: getErrorText(res.data) };

        return { success: true, dt: res.data };
        
    } catch (err) {
        console.log(err.message);
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }

};

export const deleteSpecificPropFilesAdmin = async(
    propertyId, filenamesArray, key, email
) => {

    try {

        const url = `${uploadServerBaseUrl}/admin/specific-property-files/${propertyId}?email=${email}`;

        const body = {
            filenamesArray
        };
    
        const res = await axios.post(url, body, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true,
            headers: {"authorization" : `Bearer ${key}`} 
        });
    
        if(res.status === 201) return { success: true, dt: res.data };

        return { success: false, dt: getErrorText(res.data) };

    } catch (err) {
        console.log(err.message);
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data) : 'خطأ غير معروف' };
    }

};

export const deleteUserAccountFilesAdmin = async(userId, eCode, key, email) => {

    try {

        const url = `${uploadServerBaseUrl}/admin/multiple-properties-files/${userId}?eCode=${eCode}&&email=${email}`;

        const res = await axios.delete(url, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true,
            headers: {"authorization" : `Bearer ${key}`}
        });
    
        if(res.status === 201) return { success: true, dt: res.data };

        return { success: false, dt: getErrorText(res.data) };

    } catch (err) {
        console.log(err.message);
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data) : 'خطأ غير معروف' };
    }

};

export const deleteReviewsAdmin = async(propertyId, filenamesArray) => {

    try {

        const url = `${baseUrl}/admin/delete-reviews/${propertyId}`;

        const arr = filenamesArray.map(obj => obj.writer_id);

        console.log('arr: ', arr);

        const body = {
            writerIds: arr
        };
    
        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
    
        if(res.status === 201) return { success: true, dt: res.data };

        return { success: false, dt: getErrorText(res.data) };

    } catch (err) {
        console.log(err.message);
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data) : 'خطأ غير معروف' };
    }

};

export const deleteAccountAdmin = async(userId, eCode, userEmail) => {

    try {

        const url = `${baseUrl}/admin/user-account/${userId}?eCode=${eCode}&userEmail=${userEmail}`;
    
        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
    
        if(res.status === 201) return { success: true, dt: res.data };

        return { success: false, dt: getErrorText(res.data) };

    } catch (err) {
        console.log(err.message);
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data) : 'خطأ غير معروف' };
    }

};

export const blockUser = async(userId, blockDuration, reason) => {

    try {

        const url = `${baseUrl}/admin/block-user/${userId}`;

        console.log('url: ', url);

        const body = {
            reason, blockDuration: blockDuration.value
        };
        
        const res = await axios.put(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 201) 
            return { success: false, dt: getErrorText(res.data) };

        return { success: true, dt: res.data };
        
    } catch (err) {
        console.log(err.message);
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }

};

export const unBlockUser = async(userId) => {

    try {

        const url = `${baseUrl}/admin/un-block-user/${userId}`;

        console.log('url: ', url);

        const res = await axios.put(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 201) 
            return { success: false, dt: getErrorText(res.data) };

        return { success: true, dt: res.data };
        
    } catch (err) {
        console.log(err.message);
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }

};

export const handlePromotion = async(type, userId, eCode) => {

    try {

        const url = `${baseUrl}/admin/${type}?userId=${userId}&eCode=${eCode}`;

        console.log('url: ', url);
        
        const res = await axios.put(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        console.log(res);
        
        if(!res || !res.status || res.status !== 201) 
            return { success: false, dt: getErrorText(res.data) };

        return { success: true, dt: res.data };
        
    } catch (err) {
        console.log(err.message, err.response);
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }

};


// test methods
export const sendTest = async(key, email) => {
    try {
        const url = `https://rent-nest-storage-server.onrender.com/test?email=${email}`;
        const res = await axios.get(url, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true,
            headers: {"authorization" : `Bearer ${key}`}
        });
        console.log('نجاح التست');
    } catch (err) {
        console.log(err.message);
    }
}