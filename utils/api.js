import axios from 'axios';
import { getDurationReadable, getErrorText, getReadableDate, usersSections } from './Logic';
import { errorsSection, maximumPrice } from './Data';
import { poolType } from './Facilities';
axios.defaults.withCredentials = true;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const uploadServerBaseUrl = process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL;


// App api methods
export const getLocation = async() => {

    try {

        const url = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

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
    setLoading, setStorageKey, setUserAddressEN, 
    setUserUsernameEN
) => {

    try {
        const url = `${baseUrl}/user/info`;
        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        if(!res?.status || res.status !== 200 || !res.data) {
            setLoading(false);
            return { success: false, dt: res.data.message };
        }
        if(res.data.user_id) setUserId(res.data.user_id);
        if(res.data.user_username) setUserUsername(res.data.user_username);
        if(res.data.user_usernameEN) setUserUsernameEN(res.data.user_usernameEN);
        if(res.data.user_email) setUserEmail(res.data.user_email);
        if(res.data.address) setUserAddress(res.data.address);
        if(res.data.addressEN) setUserAddressEN(res.data.addressEN);
        if(res.data.phone) setUserPhone(res.data.phone);
        if(res.data.is_verified !== undefined) setIsVerified(res.data.is_verified);
        if(res.data.role) setUserRole(res.data.role);
        if(res.data.my_books) setBooksIds(res.data.my_books);
        if(res.data.my_fav) setFavouritesIds(res.data.my_fav);
        if(res.data.storage_key) setStorageKey(res.data.storage_key);
        setLoading(false);
        return { success: true, dt: res.data };
    } catch (err) {
        setLoading(false);
        return { success: false, dt: err?.response?.data ? err.response.data : getErrorText('') };
    }

};

export const register = async(username, email, password, isEnglish, token) => {

    try {

        const url = `${baseUrl}/user/register`;

        const body = {
            username, email, password, gRecaptchaToken: token
        };

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data ? res.data : '', isEnglish) };
        }

        return { success: true, dt: res.data };
        
    } catch (err) {
        return { success: false, dt: getErrorText(err.response?.data, isEnglish) };
    }

};

export const login = async(email, password, isEnglish, token) => {

    try {

        const url = `${baseUrl}/user/login`;

        const body = {
            email, password, gRecaptchaToken: token
        };

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        console.log(res);
        
        if(!res?.status || res.status !== 201){
            if(res.data.blockTime){
                return { success: false, dt: isEnglish ? 'Your account is currently blocked, please log back in after ' : 'حسابك محظور حاليا، يرجى تسجيل الدخول مرة أخرى بعد ' + getReadableDate(res.data.blockTime, null, isEnglish) }
            } else {
                return { success: false, dt: getErrorText(res.data.message, isEnglish) };
            }
        }

        return { success: true, dt: res.data };

    } catch (err) {
        console.log(err.message);
        return { success: false, dt: err?.response?.data?.blockTime 
            ? 'Your account is currently blocked, please log back in after' + ' ' + getDurationReadable(err.response.data.blockTime) + (err?.response?.data?.blockReason ? err.response.data.blockReason : '')
            : getErrorText(err?.response?.data?.message, isEnglish) };
    }

};

export const refresh = async(isEnglish) => {

    try {

        const url = `${baseUrl}/user/refresh-token`;

        const res = await axios.post(url, null, { 
            withCredentials: true, 'Access-Control-Allow-Credentials': true 
        });

        if(!res?.status || res.status !== 201) 
            return { success: false, dt: getErrorText(res.data, isEnglish) };
        
        return { success: true, dt: 'success' };

    } catch (err) {
        console.log(err);
        return { success: false, dt: getErrorText(err?.response?.data, isEnglish) }
    }

};

export const sendCode = async(email, isEnglish) => {

    try {
        
        const url = `${baseUrl}/user/send-code${email ? '-sign-page?email=' + email : ''}`;

        const res = await axios.post(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });        

        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data?.message, isEnglish) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err?.response?.data?.message, isEnglish) };
    }

};

export const verifyMyEmail = async(code, email, isEnglish) => {

    try {
        
        const url = `${baseUrl}/user/verify-email${email ? '-sign-page?email=' + email : ''}`;

        const body = {
            eCode: code
        }

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });        

        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data.message, isEnglish) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response.data.message, isEnglish) };
    }

};

export const changeMyPass = async(code, email, newPassword, isEnglish) => {

    try {
        
        const url = `${baseUrl}/user/change-password`;

        const body = {
            eCode: code, newPassword, email
        }

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });        

        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data.message, isEnglish) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response.data.message, isEnglish) };
    }

};

export const changePasswordSignPage = async(code, email, newPassword, isEnglish, token) => {

    try {
        
        const url = `${baseUrl}/user/change-password-sign-page`;

        const body = {
            eCode: code, newPassword, email, gRecaptchaToken: token
        }

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });        

        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data.message, isEnglish) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response.data.message, isEnglish) };
    }

};

export const editUser = async(infoObj, isEnglish) => {

    try {
        
        const url = `${baseUrl}/user/edit`;

        const res = await axios.patch(url, infoObj, { withCredentials: true, 'Access-Control-Allow-Credentials': true });        

        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data.message, isEnglish) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response.data.message, isEnglish) };
    }

};

export const deleteMyAccount = async(eCode, key, email, isEnglish) => {

    try {
        
        const deleteFilesUrl = `${uploadServerBaseUrl}/delete/multiple-properties-files?eCode=${eCode}&&email=${email}`;

        const deleteFilesRes = await axios.delete(deleteFilesUrl, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true, 
            headers: {"authorization" : `Bearer ${key}`}
        });        

        if(!deleteFilesRes?.status || deleteFilesRes.status !== 201){
            return { success: false, dt: getErrorText(res.data.message, isEnglish) };
        }

        const url = `${baseUrl}/user/delete?eCode=${eCode}`;

        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });        

        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data.message, isEnglish) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response.data.message, isEnglish) };
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

export const signOut = async(isEnglish) => {

    try {
        
        const url = `${baseUrl}/user/logout`;

        const res = await axios.post(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });;

        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data.message, isEnglish) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response.data.message, isEnglish) };
    }

};


// property api methods

export const createProperty = async(
    type_is_vehicle, specific_catagory, title, description, city, neighbourhood,
    map_coordinates, price, details, terms_and_conditions, area,
    contacts, isEnglish, gRecaptchaToken, capacity, customer_type, 
    en_data, cancellation, vehicleType
) => {

    try {

        const url = `${baseUrl}/property/create`;

        let body = { 
            type_is_vehicle, specific_catagory, title, description, 
            city, neighbourhood, map_coordinates, price, details, 
            terms_and_conditions, area: type_is_vehicle ? null : area, contacts, gRecaptchaToken, vehicleType: !type_is_vehicle ? null : vehicleType,
            capacity: type_is_vehicle ? null : capacity, customer_type: type_is_vehicle ? null : customer_type, en_data, cancellation
        };

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data ? res.data : '', isEnglish) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response?.data ? err.response.data.message : 'unknown error', isEnglish) };
    }

};

export const getHost = async(id) => {

    try {
        
        const url = `${baseUrl}/property/host-details/${id}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 200) return { ok: false, dt: getErrorText(res.data) };

        return { ok: true, dt: res.data };

    } catch (err) {
        console.log(err);
        return { ok: false, dt: getErrorText(err?.response?.data?.message) };
    }
};

export const getPropIdByUnitCode = async(unit_code) => {

    try {
        
        const url = `${baseUrl}/property/item-by-unit/${unit_code}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        console.log('unit res: ', res);

        if(!res || res?.status !== 200) return { ok: false, dt: getErrorText(res.data) };

        return { ok: true, dt: res.data };

    } catch (err) {
        console.log(err);
        return { ok: false, dt: getErrorText(err?.response?.data) };
    }
};

export const editProperty = async(
    propertyId, title, description, price, 
    details, terms_and_conditions, contacts,
    discount, isEnglish, gRecaptchaToken
) => {

    try {

        const url = `${baseUrl}/property/edit/${propertyId}`;

        const body = { 
            title, description, price, 
            details, terms_and_conditions,
            contacts, discount, gRecaptchaToken
        };

        const res = await axios.put(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res?.status || res.status !== 201){
            return { success: false, dt: getErrorText(res.data ? res.data : '', isEnglish) };
        }

        return { success: true, dt: res.data };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response?.data?.message, isEnglish) };
    }

};

export const uploadFiles = async(files, id, key, email, isEnglish) => {

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

        return { success: false, dt: getErrorText(res.data, isEnglish) };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response?.data ? err.response.data.message : 'unknown error', isEnglish) };
    }

};

export const deleteFiles = async(id, filenames, key, email, isEnglish) => {

    try {

        const url = `${uploadServerBaseUrl}/delete/property-specific-files/${id}?email=${email}`;
        
        const body = { filenamesArray: filenames };

        const res = await axios.post(url, body, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true,
            headers: {"authorization" : `Bearer ${key}`}
        });
    
        if(res.status === 201) return { success: true, dt: res.data };

        return { success: false, dt: getErrorText(res.data, isEnglish) };

    } catch (err) {
        return { success: false, dt: getErrorText(err.response?.data ? err.response.data.message : 'unknown error', isEnglish) };
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

export const getGuests = async() => {

    try {

        const url = `${baseUrl}/user/guests`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res?.status || res.status !== 200) return { success: false, dt: getErrorText(res?.data?.message ? res.data.messsage : '') }
    
        return { success: true, dt: res.data };
    
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }
};

export const verifyGuest = async(guestId, propertyId) => {

    try {
        
        const url = `${baseUrl}/user/verify-guest?guestId=${guestId}&propertyId=${propertyId}`;

        const res = await axios.patch(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 201) return { ok: false, dt: getErrorText(res.data) };

        return { ok: true, dt: res.data };

    } catch (err) {
        console.log(err);
        return { ok: false, dt: getErrorText(err?.response?.data) };    
    }

};

export const removeGuest = async(guestId, propertyId) => {

    try {

        const url = `${baseUrl}/user/guest?guestId=${guestId}&propertyId=${propertyId}`;

        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 201) return { ok: false, dt: getErrorText(res.data) };

        return { ok: true, dt: res.data };
        
    } catch (err) {
        console.log(err);
        return { ok: false, dt: getErrorText(err?.response?.data) };    
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
    skip,
    quickFilter,
    neighbourSearchText,
    unitCode,
    bedroomFilter,
    capacityFilter,
    poolFilter,
    customersTypesFilter,
    companiansFilter,
    bathroomsFilterNum,
    bathroomsCompaniansFilter,
    kitchenFilter,
    categoryArray,
    vehicleType,
    cardsPerPage
) => {

    try {

        const url = `${baseUrl}/property?${city?.length > 0 ? 'city=' + city.replaceAll(' ', '-') : ''}${(isType === true) ? '&type_is_vehicle=true' + (vehicleType >= 0 ? '&vehicleType=' + vehicleType : '') : ''}${categoryArray?.length > 0 ? '&categories=' + categoryArray.map(o=>o?.value).join(',') : (specific?.length > 0 ? '&specific=' + specific : '')}${(priceRange?.length > 1 && (priceRange[0] > 0 || priceRange[1] < maximumPrice)) ? '&price_range=' + priceRange.toString() : ''}${minRate > 0 ? '&min_rate=' + minRate : ''}${(searchText?.length > 0 || neighbourSearchText?.length > 0) ? '&text=' + searchText + neighbourSearchText : ''}${sort?.length > 0 ? '&sort=' + sort : ''}${long > 0 ? '&long=' + long : ''}${lat > 0 ? '&lat=' + lat : ''}${(typeof skip === 'number' && skip > 0) ? '&skip=' + skip : ''}${quickFilter?.length > 0 ? '&quickFilter=' + quickFilter.map(o => o.idName).join(",") : ''}${unitCode > 0 ? '&unitCode=' + unitCode : ''}${(bedroomFilter?.num || bedroomFilter?.single_beds || bedroomFilter?.double_beds) ? '&bedroomFilter=' + bedroomFilter?.num + ',' + bedroomFilter?.single_beds + ',' + bedroomFilter?.double_beds : ''}${(capacityFilter?.min >= 0 || capacityFilter?.max > 0) ? '&capacityFilter=' + capacityFilter.min + ',' + capacityFilter.max : ''}${poolFilter?.length > 0 ? '&poolFilter=' + poolFilter.toString() : ''}${customersTypesFilter?.length > 0 ? '&customers=' + customersTypesFilter.toString() : ''}${companiansFilter?.length > 0 ? '&companiansFilter=' + companiansFilter.toString() : ''}${bathroomsFilterNum > 0 ? '&bathroomsNum=' + bathroomsFilterNum : ''}${bathroomsCompaniansFilter?.length > 0 ? '&bathroomFacilities=' + bathroomsCompaniansFilter.toString() : ''}${kitchenFilter?.length > 0 ? '&kitchenFilter=' + kitchenFilter.toString() : ''}${cardsPerPage ? '&cardsPerPage=' + cardsPerPage : ''}`;

        console.log('url: ', url);

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res?.status || res.status !== 200) return { success: false, dt: getErrorText(res?.data?.message ? res.data.messsage : '') }
    
        return { success: true, dt: res.data?.properties, count: res.data?.count };
    
    } catch (err) {
        console.log(err);
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }
};

export const sendReview = async(score, text, propertyId, isEnglish) => {

    try {

        const url = `${baseUrl}/property/write-review?propertyId=${propertyId}`;

        const body = {
            text,
            user_rating: score
        };

        const res = await axios.put(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res || !res.status || res.status !== 201) return { success: false, dt: getErrorText(res.data, true) };

        return { success: true, dt: res.data };
        
    } catch (err) {
        return { success: false, dt: getErrorText(err?.response?.data?.message, isEnglish) }
    }

};

export const showProp = async(propertyId, type, isEnglish) => {

    try {

        const url = `${baseUrl}/property/${type}/${propertyId}`;
        
        const res = await axios.put(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res || !res.status || res.status !== 201) return { success: false, dt: getErrorText(res.data) };

        return { success: true, dt: res.data };
        
    } catch (err) {
        return { success: false, dt: getErrorText(err?.response?.data?.message, isEnglish)}
    }

};

export const setBookable = async(propertyId, type, isEnglish) => {

    try {

        const url = `${baseUrl}/property/${type}/${propertyId}`;

        console.log('url: ', url);
        
        const res = await axios.put(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res || !res.status || res.status !== 201) return { success: false, dt: getErrorText(res.data, isEnglish) };

        return { success: true, dt: res.data };
        
    } catch (err) {
        return { success: false, dt: getErrorText(err?.response?.data?.message, isEnglish)}
    }

};

export const setNewBookedDays = async(propertyId, bookedDays, isEnglish) => {

    try {

        const url = `${baseUrl}/property/booked-days/${propertyId}`;

        console.log('url: ', url);

        const body = {
            bookedDays
        }
        
        const res = await axios.put(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res || !res.status || res.status !== 201) return { success: false, dt: getErrorText(res.data, isEnglish) };

        return { success: true, dt: res.data };
        
    } catch (err) {
        return { success: false, dt: getErrorText(err?.response?.data?.message, isEnglish)}
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

export const deletePropFiles = async(propertyId, email, isEnglish) => {

    try {

        const url = `${uploadServerBaseUrl}/delete/property-files/${propertyId}?email=${email}`;

        const res = await axios.delete(url, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true,
            headers: {"authorization" : `Bearer ${key}`}
        });
        
        if(!res || !res.status || res.status !== 201) return { success: false, dt: getErrorText(res.data, isEnglish) };

        return { success: true, dt: '' };
        
    } catch (err) {
        return { success: false, dt: getErrorText(err?.response?.data?.message, isEnglish)}
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

        if(type !== 'check-properties' && type !== 'hidden-properties' && type !== 'properties-by-files')
            return { success: false, dt: 'اختر تصنيف' };

        const url = `${baseUrl}/admin/${type}${skip > 0 ? '&skip=' + skip : ''}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        console.log('res: ', res);

        if(!res?.status || res.status !== 200) return { success: false, dt: getErrorText(res?.data?.message ? res.data.messsage : '') }
    
        return { success: true, dt: res.data };
    
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message) : getErrorText('')}
    }
};

export const getAdminErrors = async(type, skip) => {

    try {

        const url = `${baseUrl}/admin/errors${type === errorsSection[1].value ? '?is_storage=true' : ''}${skip > 0 ? '&skip=' + skip : ''}`;

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

export const getUserByEmailAdmin = async(email, isEnglish) => {

    try {

        const url = `${baseUrl}/admin/user-by-email/${email}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res?.status || res.status !== 200) return { success: false, dt: getErrorText(res?.data?.message ? res.data.messsage : '', isEnglish) }
    
        return { success: true, dt: res.data };
    
    } catch (err) {
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data.message, isEnglish) : getErrorText('', isEnglish)}
    }
};

export const deletePropFilesAdmin = async(propId, key, email, isEnglish) => {

    try {

        const url = `${uploadServerBaseUrl}/admin/property-files/${propId}?email=${email}`;

        console.log('url: ', url);
    
        const res = await axios.delete(url, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true,
            headers: {"authorization" : `Bearer ${key}`}
        });
    
        if(res.status === 201) return { success: true, dt: res.data };

        return { success: false, dt: getErrorText(res.data, isEnglish) };

    } catch (err) {
        console.log(err.message);
        return { success: false, dt: getErrorText(err?.response?.data, isEnglish) };
    }

};

export const handlePropAdmin = async(propertyId, type, reasons, isEnglish) => {

    try {

        if(type !== 'pass-property' 
            && type !== 'hide-property'
            && type !== 'show-property'
            && type !== 'delete-property'
            && type !== 'reject-property')
                return { success: false, dt: 'Error in one of the links' };

        const url = `${baseUrl}/admin/${type}/${propertyId}`;
        
        let res = null;

        const body = {
            reasons
        };
        
        if(type === 'delete-property'){
            res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        } else {
            res = await axios.put(url, type === 'reject-property' ? body : null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        }

        if(!res || !res.status || res.status !== 201) return { success: false, dt: getErrorText(res.data, isEnglish) };

        return { success: true, dt: res.data };
        
    } catch (err) {
        console.log(err.message);
        return { success: false, dt: getErrorText(err?.response?.data?.message) }
    }

};

export const deleteSpecificPropFilesAdmin = async(
    propertyId, filenamesArray, key, email, isEnglish
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

        return { success: false, dt: getErrorText(res.data, isEnglish) };

    } catch (err) {
        console.log(err.message);
        return { success: false, dt: getErrorText(err?.response?.data, isEnglish) };
    }

};

export const deleteSpecificFile = async(key, email, filename, isEnglish) => {

    try {

        const url = `${uploadServerBaseUrl}/admin/file/${filename}?email=${email}`;
    
        const res = await axios.delete(url, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true,
            headers: {"authorization" : `Bearer ${key}`} 
        });
    
        if(res.status === 201) return { success: true, dt: res.data };

        return { success: false, dt: getErrorText(res.data, isEnglish) };

    } catch (err) {
        console.log(err.message);
        return { success: false, dt: getErrorText(err?.response?.data, isEnglish) };
    }

};

export const deleteUserAccountFilesAdmin = async(userId, eCode, key, email, isEnglish) => {

    try {

        const url = `${uploadServerBaseUrl}/admin/multiple-properties-files/${userId}?eCode=${eCode}&&email=${email}`;

        const res = await axios.delete(url, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true,
            headers: {"authorization" : `Bearer ${key}`}
        });
    
        if(res.status === 201) return { success: true, dt: res.data };

        return { success: false, dt: getErrorText(res.data, isEnglish) };

    } catch (err) {
        console.log(err.message);
        return { success: false, dt: getErrorText(err?.response?.data, isEnglish) };
    }

};

export const deleteReviewsAdmin = async(propertyId, filenamesArray, isEnglish) => {

    try {

        const url = `${baseUrl}/admin/delete-reviews/${propertyId}`;

        const arr = filenamesArray.map(obj => obj.writer_id);

        const body = {
            writerIds: arr
        };
    
        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
    
        if(res.status === 201) return { success: true, dt: res.data };

        return { success: false, dt: getErrorText(res.data, isEnglish) };

    } catch (err) {
        console.log(err.message);
        return { success: false, dt: getErrorText(err?.response?.data, isEnglish) };
    }

};

export const deleteErrorAdmin = async(errorId) => {

    try {

        const url = `${baseUrl}/admin/errors/${errorId}`;

        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
    
        if(res.status === 201) return { success: true, dt: res.data };

        return { success: false, dt: getErrorText(res.data) };

    } catch (err) {
        console.log(err.message);
        return { success: false, dt: err?.response?.data ? getErrorText(err.response.data) : 'خطأ غير معروف' };
    }

};

export const deleteReportOnProp = async(propertyId) => {

    try {

        const url = `${baseUrl}/admin/reports/${propertyId}`;
    
        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
    
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

        const body = {
            reason, blockDuration: blockDuration.ms
        };
        
        const res = await axios.put(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 201) 
            return { success: false, dt: getErrorText(res.data, isEnglish) };

        return { success: true, dt: res.data };
        
    } catch (err) {
        console.log(err.message);
        return { success: false, dt: getErrorText(err?.response?.data?.message, isEnglish)}
    }

};

export const unBlockUser = async(userId, isEnglish) => {

    try {

        const url = `${baseUrl}/admin/un-block-user/${userId}`;

        const res = await axios.put(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 201) 
            return { success: false, dt: getErrorText(res.data, isEnglish) };

        return { success: true, dt: res.data };
        
    } catch (err) {
        console.log(err.message);
        return { success: false, dt: getErrorText(err?.response?.data?.message, isEnglish)}
    }

};

export const handlePromotion = async(type, userId, eCode, isEnglish) => {

    try {

        const url = `${baseUrl}/admin/${type}?userId=${userId}&eCode=${eCode}`;

        const res = await axios.put(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res || !res.status || res.status !== 201) 
            return { success: false, dt: getErrorText(res.data, isEnglish) };

        return { success: true, dt: res.data };
        
    } catch (err) {
        console.log(err);
        return { success: false, dt: getErrorText(err?.response?.data?.message, isEnglish)}
    }

};

export const getFiles = async(key, email) => {

    try {

        const url = `${uploadServerBaseUrl}/admin/all-files?email=${email}`;

        const res = await axios.get(url, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true,
            headers: {"authorization" : `Bearer ${key}`}
        });

        if(!res || res.status !== 200) return { ok: false, dt: getErrorText(res.data) };

        return { ok: true, dt: res.data };
        
    } catch (err) {
        console.log(err);
        return { ok: false, dt: getErrorText(err?.response?.data)};
    }

};

export const getStorageSize = async(key, email) => {

    try {

        const url = `${uploadServerBaseUrl}/admin/folder-size?email=${email}`;

        const res = await axios.get(url, { 
            withCredentials: true, 
            'Access-Control-Allow-Credentials': true,
            headers: {"authorization" : `Bearer ${key}`}
        });

        if(!res || res.status !== 200) return { ok: false, dt: getErrorText(res.data) };

        return { ok: true, dt: res.data };
        
    } catch (err) {
        console.log(err);
        return { ok: false, dt: getErrorText(err?.response?.data)};
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