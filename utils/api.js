import axios from 'axios';
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
            return '.سجل الدخول الى حسابك';
        default:
            return 'خطأ غير معروف, الرجاء المحاولة مجددا.';
    }

}


// User api methods

export const getUserInfo = async(setUserId, setUserUsername, setUserRole) => {

    try {
        const url = `${baseUrl}/user/info`;
        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        if(!res?.status || res.status !== 200) return { success: false, dt: res.data.message };
        console.log(res);
        if(res.data.user_id) setUserId(res.data.user_id);
        if(res.data.user_username) setUserUsername(res.data.user_username);
        if(res.data.role) setUserRole(res.data.role);
        //res.data.tokenExp
        return { success: true, dt: res.data };
    } catch (err) {
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
            type_is_vehicle, specific_catagory, title, description, city, neighbourhood,
            map_coordinates, price, details, terms_and_conditions
        };

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data ? res.data : '') };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt:err.response?.data ? err.response.data.message : 'unknown error' };
    }

};

export const uploadFiles = async(files, type, id) => {

    try {

        const url = `${uploadServerBaseUrl}/upload/${type}/${id}`;
        
        const data = new FormData();

        files.forEach((file, i) => {
          data.append('FilesForUpload', file, file.name);
        });

        const res = await axios.post(url, data, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
    
        if(res.status === 201) return { success: true, dt: res.data };

        return { success: false, dt: res.data };

    } catch (err) {
        return { success: false, dt: err?.response?.data ? err.response.data : 'خطأ غير معروف' };
    }

};

export const getOwnerProperties = async() => {

    try {

        const url = `${baseUrl}/property/owner`;

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
    city, isType, specific, priceRange, minRate, searchText, sort, skip
) => {

    try {

        const url = `${baseUrl}/property?${city?.length > 0 ? 'city=' + city : ''}${(isType === false || isType === true) ? '&type_is_vehicle=' + isType.toString() : ''}${specific?.length > 0 ? '&specific=' + specific : ''}${priceRange?.length > 1 ? '&price_range=' + priceRange : ''}${typeof minRate === 'number' ? '&min_rate=' + minRate : ''}${searchText?.length > 0 ? '&text=' + searchText : ''}${sort?.length > 0 ? '&sort=' + sort : ''}${(typeof skip === 'number' && skip > 0) ? '&skip=' + skip : ''}`;

        console.log('fetching data url: ', url);

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        console.log('res: ', res);

        if(!res?.status || res.status !== 200) return { success: false, dt: getErrorText(res?.data?.message ? res.data.messsage : '') }
    
        return { success: true, dt: res.data };
    
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }
};