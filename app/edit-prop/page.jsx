'use client';

import '../add/Add.css';
import { Suspense, useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import CustomInputDiv from '@components/CustomInputDiv';
import { deleteFiles, deleteProp, deletePropFiles, editProperty, fetchPropertyDetails, setBookable, setNewBookedDays, showProp, uploadFiles } from '@utils/api';
import { useSearchParams } from 'next/navigation';
import Svgs from '@utils/Svgs';
import { Context } from '@utils/Context';
import Link from 'next/link';
import GoogleMapImage from '@assets/images/google-map-image.jpg';
import { getBookDateFormat, getOptimizedAttachedFiles, isValidContactURL, isValidNumber, isValidText } from '@utils/Logic';
import MyCalendar from '@components/MyCalendar';
import MySkeleton from '@components/MySkeleton';
import NotFound from '@components/NotFound';
import { JordanCities, cancellationsArray, carFuelTypesArray, carGearboxes, contactsPlatforms, currencyCode, getContactPlaceHolder, getNames, isInsideJordan, reservationType, vehicleRentTypesArray } from '@utils/Data';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import CustomInputDivWithEN from '@components/CustomInputDivWithEN';
import InfoDiv from '@components/InfoDiv';
import HeaderPopup from '@components/popups/HeaderPopup';
import { bathroomFacilities, customersTypesArray, facilities, kitchenFacilities, nearPlacesNames, poolType } from '@utils/Facilities';
import LoadingCircle from '@components/LoadingCircle';
import AddDetailsPopup from '@components/popups/AddDetailsPopup';
import { getUserLocation } from '@utils/ServerComponents';

const Page = () => {

    const id = useSearchParams().get('id');

    const {
        userId, storageKey, userEmail, loadingUserInfo, isVerified,
        arabicFont, setLatitude, setLongitude, setIsMap, setMapType,
        latitude, longitude
    } = useContext(Context);

    const [fetchingOnce, setFetchingOnce] = useState(true);
    const [fetchingUserInfo, setFetchingUserInfo] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [runOnce, setRunOnce] = useState(false);
    const [item, setItem] = useState(null);

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/avi'];
    const inputFilesRef = useRef();
    const attachImagesDivRef = useRef();

    const [contacts, setContacts] = useState([]);
    const [contactsError, setContactsError] = useState('');

    const [error, setError] = useState('');
    const [cityPopup, setCityPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const [visiblityIsLoading, setVisiblityIsLoading] = useState(false);
    const [isVisibilty, setIsVisibilty] = useState(false);
    const [visibiltyError, setIsVisibiltyError] = useState('');
    const [visibiltySuccess, setIsVisibiltySuccess] = useState('');

    const [section, setSection] = useState(0);
    const [sectionError, setSectionError] = useState('');
    const [freeSection, setFreeSection] = useState(false);
    const [sectionTitle, setSectionTitle] = useState('');
    const sectionsArray = [
        { id: 0, name: 'تعديل المعلومات الأساسية' },
        item?.type_is_vehicle ? { id: 1, name: 'تعديل الموقع الجغرافي' } : null,
        { id: 2, name: 'تعديل السعر و التخفيض' },
        { id: 3, name: 'تعديل الصور و الفيديوهات' },
        { id: 4, name: 'تعديل التفاصيل الدقيقة' },
        { id: 5, name: 'الارسال' }
    ];

    const [expandPrices, setExpandPrices] = useState(false);
    const [pricesError, setPricesError] = useState([]);

    const [detailsError, setDetailsError] = useState('');
    const [mapUsed, setMapUsed] = useState(false);

    const [bookableIsLoading, setBookableIsLoading] = useState(false);
    const [isBookable, setIsBookable] = useState(false);
    const [bookableError, setBookableError] = useState('');
    const [bookableSuccess, setBookableSuccess] = useState('');

    const [bookDaysIsLoading, setBookDaysIsLoading] = useState(false);
    const [isBookDays, setIsBookDays] = useState(false);
    const [bookDaysError, setBookDaysError] = useState('');
    const [bookDaysSuccess, setBookDaysSuccess] = useState('');

    const [selectBookedDays, setSelectBookedDays] = useState([]);
    const [triggerCalendarRender, setTriggerCalendarRender] = useState(true);
    const [calendarSelect, setCalenderSelect] = useState(null);

    const [isDeletingProp, setIsDeletingProp] = useState(false);
    const [isDeleteProp, setIsDeleteProp] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [deleteSuccess, setDeleteSuccess] = useState('');

    const [itemTitle, setItemTitle] = useState('');
    const [itemTitleEN, setItemTitleEN] = useState('');
    const [itemDesc, setItemDesc] = useState('');
    const [itemDescEN, setItemDescEN] = useState('');
    const [itemCity, setItemCity] = useState(null);
    const [itemNeighbour, setItemNeighbour] = useState('');
    const [itemNeighbourEN, setItemNeighbourEN] = useState('');
    const [specificCatagory, setSpecificCatagory] = useState('');
    const [area, setArea] = useState(0);
    const [landArea, setLandArea] = useState('');
    const [floor, setFloor] = useState('');
    const [withDriver, setWithDriver] = useState(false);
    const [vehicleRentType, setVehicleRentType] = useState('');
    const [carGearbox, setCarGearBox] = useState(false);
    const [carFuelType, setCarFuelType] = useState(false);
    const [itemPrice, setItemPrice] = useState(0);
    const [itemPrices, setItemPrices] = useState(null);
    const [requireInsurance, setRequireInsurance] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [attachedFilesUrls, setAttachedFilesUrls] = useState([]);
    const [discountPer, setDiscountPer] = useState(0);
    const [discountNights, setDiscountNights] = useState(0);

    const [cancellation, setCancellation] = useState('');
    const [isCancellation, setIsCancellation] = useState('');
    const [capacity, setCapacity] = useState(0);
    const [customerType, setCustomerType] = useState('');
    const [isCustomerType, setIsCustomerType] = useState(false);
    const [isVehicleRentType, setIsVehicleRentType] = useState(false);
    const [isCarFuelTypeShow, setIsCarFuelTypeShow] = useState(false);
    const [isCarGearboxShow, setIsCarGearboxShow ] = useState(false);

    const [locObj, setLocObj] = useState(null);
    const [fetchingLocation, setFetchingLocation] = useState(false);
    const [isUserLoc, setIsUserLoc] = useState('');
    const [isManualLocSet, setIsManualLocSet] = useState(true);
    const [itemLong, setItemLong] = useState(null);
    const [itemLat, setItemLat] = useState(null);

    const [guestRoomsDetailArray, setGuestRoomsDetailArray] = useState([]);
    const [companionsDetailArray, setCompanionsDetailArray] = useState([]);
    const [bathroomsDetailArray, setBathroomsDetailArray] = useState([]);
    const [roomsDetailArray, setRoomsDetailArray] = useState([]);
    const [bathroomsNum, setBathroomsNum] = useState(0);
    const [kitchenDetailArray, setKitchenDetailArray] = useState([]);
    const [roomObj, setRoomObj] = useState([]);
    const [conditionsAndTerms, setConditionsAndTerms] = useState([]);
    const [vehicleSpecifications, setVehicleSpecifications] = useState([]);
    const [vehicleFeatures, setVehicleFeatures] = useState([]);
    const [nearPlaces, setNearPlaces] = useState([]);
    const [poolsDetailArray, setPoolsDetailArray] = useState([]);
    const [poolNum, setPoolNum] = useState(0);
    
    const [filesToDelete, setFilesToDelete] = useState([]);
    const [isAddDetails, setIsAddDetails] = useState(false);

    const { executeRecaptcha } = useGoogleReCaptcha();

    const getRecaptchaToken = async() => {
      if (!executeRecaptcha) return;
      const gReCaptchaToken = await executeRecaptcha('submit');
      return gReCaptchaToken;
    };
    
    const [bathroomsAccompany, setBathroomsAccompany] = useState([]);
    const [kitchenAccompany, setKitchenAccompany] = useState([]);
    const [poolAccompany, setPoolAccompany] = useState([]);

    const [conditionsAndTermsEN, setConditionsAndTermsEN] = useState([]);
    const [nearPlacesEN, setNearPlacesEN] = useState([]);
    const [vehicleFeaturesEN, setVehicleFeaturesEN] = useState([]);
    const [companiansShow, setCompaniansShow] = useState(false);
    const [bathroomsShow, setBathroomsShow] = useState(false);
    const [kitchenShow, setKitchenShow] = useState(false);
    const [poolsShow, setPoolsShow] = useState(false);    
    const [guestRoomsShow, setGuestRoomsShow] = useState(false);
    const [bedroomsShow, setBedroomsShow] = useState(false);
    const [nearPlacesShow, setNearPlacesShow] = useState(false);

    const details = [
        {idName: 'guest_rooms', notAllowedCategories: ['students'], isNum: true, name: 'غرف الضيوف و المجالس',  isSelections: true, array: guestRoomsDetailArray, setArray: setGuestRoomsDetailArray, isShow: guestRoomsShow, setIsShow: setGuestRoomsShow},
        {idName: 'bathrooms', notAllowedCategories: ['students'], name: 'دورات المياه', isNum: true, isDimension: true, isSelections: true, isShow: bathroomsShow, setIsShow: setBathroomsShow, selectArray: bathroomFacilities(), array: bathroomsDetailArray, setArray: setBathroomsDetailArray, accompany: bathroomsAccompany, setAccompany: setBathroomsAccompany },
        {idName: 'kitchen', notAllowedCategories: ['students'], name: 'المطبخ', isNum: true, isDimension: true, isSelections: true, selectArray: kitchenFacilities(), isShow: kitchenShow, setIsShow: setKitchenShow, array: kitchenDetailArray, setArray: setKitchenDetailArray, accompany: kitchenAccompany, setAccompany: setKitchenAccompany},
        {idName: 'rooms', name: 'غرف النوم و الأسرّة', isNum: true, isSelections: true, isShow: bedroomsShow, setIsShow: setBedroomsShow, array: roomsDetailArray, setArray: setRoomsDetailArray},
        {idName: 'pool', notAllowedCategories: ['students'], name: 'المسبح', isDepth: true, isNum: true, isDimension: true, isSelections: true, isShow: poolsShow, setIsShow: setPoolsShow, selectArray: poolType(), array: poolsDetailArray, setArray: setPoolsDetailArray, accompany: poolAccompany, setAccompany: setPoolAccompany},
        {idName: 'near_places', name: 'الأماكن القريبة', isSelections: true, selectArray: nearPlacesNames(), isShow: nearPlacesShow, setIsShow: setNearPlacesShow, accompany: nearPlaces, setAccompany: setNearPlaces},
        {idName: 'facilities', name: 'المرافق', isSelections: true, isShow: companiansShow, setIsShow: setCompaniansShow, selectArray: facilities(false, specificCatagory === 'students'), accompany: companionsDetailArray, setAccompany: setCompanionsDetailArray},
        {idName: 'features', name: 'المزايا الاضافية', isWithEN: true, detailsEN: vehicleFeaturesEN, setDetailsEN: setVehicleFeaturesEN, array: vehicleFeatures, setArray: setVehicleFeatures},
        {idName: 'terms', name: 'شروط و أحكام الحجز', isWithEN: true, detailsEN: conditionsAndTermsEN, setDetailsEN: setConditionsAndTermsEN, array: conditionsAndTerms, setArray: setConditionsAndTerms},
    ];

    const vehiclesDetails = [
        {idName: 'features', name: 'المزايا الاضافية', isWithEN: true, detailsEN: vehicleFeaturesEN, setDetailsEN: setVehicleFeaturesEN, array: vehicleFeatures, setArray: setVehicleFeatures},
        {idName: 'terms', name: 'شروط و أحكام الحجز', isWithEN: true, detailsEN: conditionsAndTermsEN, setDetailsEN: setConditionsAndTermsEN,  array: conditionsAndTerms, setArray: setConditionsAndTerms},
    ];

    const getDetails = () => {
        if(item.type_is_vehicle){
            return vehiclesDetails;
        } else {
            return details;
        }
    };

    const getEnglishDetailsArray = (type, arabicValue, isEnDtlArray) => {
        
        if(item.en_data?.english_details?.length <= 0) return [];

        if(arabicValue){
            item.en_data?.english_details?.forEach(element => {
                if(element?.arName === arabicValue) return element?.enName;
            });
        }

        const getBaseEnglishdtlsArr = () => {
            switch(type){
                case 'places':
                    return item.details?.near_places;
                case 'terms':
                    return item.terms_and_conditions;
                case 'features':
                    return item.details?.features;
                default:
                    return null;
            }
        };
        
        const baseArray = getBaseEnglishdtlsArr();
        if(!baseArray) return [];
        let arr = [];
        for (let i = 0; i < baseArray.length; i++) {
            item.en_data?.english_details.forEach(dtl => {
                if(dtl?.arName === baseArray[i]) arr.push(isEnDtlArray ? dtl : dtl.enName);
            });
        }

        // if(arr?.length !== baseArray?.length){
        //     for (let i = 0; i < baseArray.length - arr?.length - 1; i++) {
        //         arr.push({ arName: baseArray[i], enName: '' });
        //     }
        // }
        return arr;

    };

    const isSomethingChanged = (withoutStorage) => {

        let tempContacts = [], tempItemContacts = [];

        contacts.forEach((cnt) => {
            tempContacts.push({
                platform: cnt.platform, val: cnt.val
            });
        });

        item.contacts?.forEach((cnt) => {
            tempItemContacts.push({
                platform: cnt.platform, val: cnt.val
            });
        });

        const compareTwoValuesIsNotEqual = (a, b, type) => {

            // if(type === 'array'){
            //     console.log('a array: ', a);
            //     console.log('b array: ', b);
            //     console.log(JSON.stringify(a) === JSON.stringify(b));
            // }

            if(type === 'array' && JSON.stringify(a) === JSON.stringify(b)) return false;

            if(type === 'array' && a?.length <= 0 && (b === null || b === undefined)) return false;

            if(a === b) return false;
            
            return true;

        };

        const compareAllValues = () => {

            if(!withoutStorage && attachedFilesUrls?.length > 0) return false;
            if(!withoutStorage && filesToDelete?.length > 0) return false;

            if(compareTwoValuesIsNotEqual(itemTitle, item.title)) return false;
            if(compareTwoValuesIsNotEqual(itemTitleEN, item.en_data?.titleEN)) return false;
            if(compareTwoValuesIsNotEqual(itemDesc, item.description)) return false;
            if(compareTwoValuesIsNotEqual(itemDescEN, item.en_data?.descEN)) return false;
            
            if(compareTwoValuesIsNotEqual(itemPrices?.daily, item.prices?.daily)) return false;
            if(compareTwoValuesIsNotEqual(itemPrices?.weekly, item.prices?.weekly)) return false;
            if(compareTwoValuesIsNotEqual(itemPrices?.monthly, item.prices?.monthly)) return false;
            if(compareTwoValuesIsNotEqual(itemPrices?.seasonly, item.prices?.seasonly)) return false;
            if(compareTwoValuesIsNotEqual(itemPrices?.yearly, item.prices?.yearly)) return false;

            if(compareTwoValuesIsNotEqual(discountNights, item.discount?.num_of_days_for_discount)) return false;
            if(compareTwoValuesIsNotEqual(discountPer, item.discount?.percentage)) return false;
            if(compareTwoValuesIsNotEqual(requireInsurance, item.details?.insurance)) return false;
            if(compareTwoValuesIsNotEqual(tempContacts, tempItemContacts, 'array')) return false;

            if(compareTwoValuesIsNotEqual(conditionsAndTerms, item.terms_and_conditions, 'array')) return false;
            if(compareTwoValuesIsNotEqual(conditionsAndTermsEN?.map(o=>o.enName), getEnglishDetailsArray('terms'), 'array')) return false;
            if(compareTwoValuesIsNotEqual(vehicleFeatures, item.details?.features, 'array')) return false;
            if(compareTwoValuesIsNotEqual(vehicleFeaturesEN?.map(o=>o.enName), getEnglishDetailsArray('vehicle features'), 'array')) return false;
            console.log(1);

            if(item.type_is_vehicle && compareTwoValuesIsNotEqual(withDriver, item.details?.vehicle_specifications?.driver)) return false;
            if(item.type_is_vehicle && compareTwoValuesIsNotEqual(vehicleRentTypesArray(true)[vehicleRentTypesArray().indexOf(vehicleRentType)], item.details?.vehicle_specifications?.rent_type)) return false;
            if(item.type_is_vehicle && compareTwoValuesIsNotEqual(carGearboxes(true)[carGearboxes().indexOf(carGearbox)], item.details?.vehicle_specifications?.gearbox)) return false;
            if(item.type_is_vehicle && compareTwoValuesIsNotEqual(carFuelTypesArray(true)[carFuelTypesArray().indexOf(carFuelType)], item.details?.vehicle_specifications?.fuel_type)) return false;
            if(item.type_is_vehicle && compareTwoValuesIsNotEqual(itemNeighbour, item.neighbourhood)) return false;
            if(item.type_is_vehicle && compareTwoValuesIsNotEqual(itemNeighbourEN, item.en_data?.neighbourEN)) return false;
            if(item.type_is_vehicle && compareTwoValuesIsNotEqual(itemCity?.value, item.city)) return false;
        
            if(item.type_is_vehicle && compareTwoValuesIsNotEqual(longitude, item.map_coordinates?.at(0))) return false;
            if(item.type_is_vehicle && compareTwoValuesIsNotEqual(latitude, item.map_coordinates?.at(1))) return false;
            

            if(item.type_is_vehicle) return true;

            if(compareTwoValuesIsNotEqual(cancellationsArray().indexOf(cancellation), item.cancellation)) return false;
            if(compareTwoValuesIsNotEqual(capacity, item.capacity)) return false;
            if(compareTwoValuesIsNotEqual(area, item.area)) return false;
            if(compareTwoValuesIsNotEqual(landArea, item.landArea)) return false;
            if(compareTwoValuesIsNotEqual(floor, item.floor)) return false;
            if(compareTwoValuesIsNotEqual(capacity, item.capacity)) return false;
            if(compareTwoValuesIsNotEqual(customerType, item.customer_type)) return false;

            console.log(2);

            if(compareTwoValuesIsNotEqual(guestRoomsDetailArray?.map(o=>o.capacity), item.details?.guest_rooms?.map(o=>o.capacity), 'array')) return false;
            if(compareTwoValuesIsNotEqual(bathroomsDetailArray?.map(o=>o.dim), item.details?.bathrooms?.array?.map(o=>o.dim), 'array')) return false;
            if(compareTwoValuesIsNotEqual(bathroomsAccompany, item.details?.bathrooms?.companians, 'array')) return false;
            if(compareTwoValuesIsNotEqual(kitchenDetailArray?.map(o=>o.dim), item.details?.kitchen?.array?.map(o=>o.dim), 'array')) return false;
            if(compareTwoValuesIsNotEqual(kitchenAccompany, item.details?.kitchen?.companians, 'array')) return false;
            

            if(compareTwoValuesIsNotEqual(roomsDetailArray?.map(o=>o.capacity), item.details?.rooms?.map(o=>o.capacity), 'array')) return false;
            if(compareTwoValuesIsNotEqual(roomsDetailArray?.map(o=>o.single_beds), item.details?.rooms?.map(o=>o.single_beds), 'array')) return false;
            if(compareTwoValuesIsNotEqual(roomsDetailArray?.map(o=>o.double_beds), item.details?.rooms?.map(o=>o.double_beds), 'array')) return false;
            
            if(compareTwoValuesIsNotEqual(poolsDetailArray?.map(o=>o.dim), item.details?.pool?.array?.map(o=>o.dim), 'array')) return false;
            if(compareTwoValuesIsNotEqual(poolsDetailArray?.map(o=>o.depth), item.details?.pool?.array?.map(o=>o.depth), 'array')) return false;
            if(compareTwoValuesIsNotEqual(poolAccompany, item.details?.pool?.companians, 'array')) return false;
            
            if(compareTwoValuesIsNotEqual(companionsDetailArray, item.details?.facilities, 'array')) return false;
            if(compareTwoValuesIsNotEqual(nearPlaces, item.details?.near_places, 'array')) return false;
            if(compareTwoValuesIsNotEqual(nearPlacesEN?.map(o=>o.enName), getEnglishDetailsArray('places'), 'array')) return false;

            
            console.log(3);

            return true;

        };

        return !compareAllValues();
    
    };

    const isValidPrices = () => {

        console.log(itemPrices);

        let priceErrorEncountered = false;
        let atLeastOneIsExit = false;

        if(itemPrices?.daily && !isValidNumber(itemPrices?.daily)){
            const obj = itemPrices;
            if(obj) obj.daily = undefined;
            setItemPrices(obj);
            let arr = pricesError;
            arr.push('daily');
            setPricesError(arr);
            priceErrorEncountered = true;
        } else {
            if(itemPrices?.daily > 0) atLeastOneIsExit = true;
            setPricesError(pricesError.filter(i => i === 'daily'));
        };

        if(itemPrices?.weekly && !isValidNumber(itemPrices?.weekly)){
            const obj = itemPrices;
            if(obj) obj.weekly = undefined;
            setItemPrices(obj);
            let arr = pricesError;
            arr.push('weekly');
            setPricesError(arr);
            priceErrorEncountered = true;
        } else {
            if(itemPrices?.weekly > 0) atLeastOneIsExit = true;
            setPricesError(pricesError.filter(i => i === 'weekly'));
        };

        if(itemPrices?.monthly && !isValidNumber(itemPrices?.monthly)){
            const obj = itemPrices;
            if(obj) obj.monthly = undefined;
            setItemPrices(obj);
            let arr = pricesError;
            arr.push('monthly');
            setPricesError(arr);
            priceErrorEncountered = true;
        } else {
            if(itemPrices?.monthly > 0) atLeastOneIsExit = true;
            setPricesError(pricesError.filter(i => i === 'monthly'));
        };

        if(itemPrices?.seasonly && !isValidNumber(itemPrices?.seasonly)){
            const obj = itemPrices;
            if(obj) obj.seasonly = undefined;
            setItemPrices(obj);
            let arr = pricesError;
            arr.push('seasonly');
            setPricesError(arr);
            priceErrorEncountered = true;
        } else {
            if(itemPrices?.seasonly > 0) atLeastOneIsExit = true;
            setPricesError(pricesError.filter(i => i === 'seasonly'));
        };

        if(itemPrices?.yearly && !isValidNumber(itemPrices?.yearly)){
            const obj = itemPrices;
            if(obj) obj.yearly = undefined;
            setItemPrices(obj);
            let arr = pricesError;
          
            arr.push('yearly');
            setPricesError(arr);
            priceErrorEncountered = true;
        } else {
            if(itemPrices?.yearly > 0) atLeastOneIsExit = true;
            setPricesError(pricesError.filter(i => i === 'yearly'));
        };

        if(priceErrorEncountered) return false;
        if(!atLeastOneIsExit) {
            let arr = pricesError;
            arr.push('daily');
            setPricesError(arr);
            return false;
        }
        return true;

    };

    const handleSubmit = async() => {

        if(!isTestSection(null, true)) return;

        let tempContacts = [];

        contacts.forEach((cnt) => {
            tempContacts.push({
                platform: cnt.platform, val: cnt.val
            });
        });

        if(!isSomethingChanged()){
            setError('لا يوجد تغيير لتعديل الوحدة');
            setSuccess(false);
            return;
        }

        let errorEncountered = false;

        const xDiscount = () => {
            if(discountPer <= 0) return null;
            return {
                num_of_days_for_discount: (!discountNights || discountNights < 0) ? 0 : discountNights,
                percentage: discountPer
            };
        };

        try {

            setLoading(true);

            const editMainInfo = async() => {
                try {
                    const xDetails = item.type_is_vehicle ? {
                        insurance:  requireInsurance, 
                        vehicle_specifications: {
                            driver: withDriver, 
                            rent_type: vehicleRentTypesArray(true)[vehicleRentTypesArray().indexOf(vehicleRentType)],
                            gearbox: carGearboxes(true)[carGearboxes().indexOf(carGearbox)], 
                            fuel_type: carFuelTypesArray(true)[carFuelTypesArray().indexOf(carFuelType)]
                        },
                        features: vehicleFeatures,
                        near_places: nearPlaces
                    } : {
                        insurance:  requireInsurance, 
                        guest_rooms: guestRoomsDetailArray, 
                        bathrooms: { array: bathroomsDetailArray, companians: bathroomsAccompany }, 
                        kitchen: { array: kitchenDetailArray, companians: kitchenAccompany }, 
                        rooms: roomsDetailArray,
                        pool: { array: poolsDetailArray, companians: poolAccompany },
                        near_places: nearPlaces,
                        facilities: companionsDetailArray, 
                        features: vehicleFeatures
                    };
        
                    const getEnObj = () => {
        
                        let enObj = {
                            english_details: []
                        };
            
                        const getEnglishBaseArray = () => {
                            if(item.type_is_vehicle){
                                return [vehiclesDetails[0], vehiclesDetails[1]];
                            } else {
                                return [...details]
                            }
                        }
            
                        getEnglishBaseArray().forEach(element => {
                            if(element.detailsEN?.length > 0){
                                enObj.english_details.push(...element.detailsEN);
                            }
                        });
            
                        if(itemTitleEN?.length > 0) enObj.titleEN = itemTitleEN;
                        if(itemDescEN?.length > 0) enObj.descEN = itemDescEN;
                        if(itemNeighbourEN?.length > 0) enObj.neighbourEN = itemNeighbourEN;
                        if(customersTypesArray().includes(customerType)){
                            let cst = '';
                            customersTypesArray().forEach((element, index) => {
                                if(customerType === element){
                                    cst = customersTypesArray(true)[index];
                                }
                            });
                            if(cst?.length > 0) enObj.customerTypeEN = cst;
                        }
        
                        return enObj;
        
                    };
        
                    const enObj = getEnObj();
        
                    const token = await getRecaptchaToken();
        
                    const res = await editProperty(
                        id, itemTitle, itemDesc, itemPrice, xDetails, conditionsAndTerms, 
                        tempContacts?.length > 0 ? tempContacts : null, xDiscount(), null,
                        token, enObj, cancellationsArray().indexOf(cancellation), capacity, 
                        customerType, itemPrices, landArea, floor, 
                        itemCity.value, itemNeighbour, [itemLong, itemLat], item.type_is_vehicle 
                    );
        
                    console.log('res: ', res);    
        
                    if(res.success !== true){
                        setError(res.dt.toString());
                        return { success: false };
                    } else if(res.success === true && res.dt.message !== 'no details to add') {
                        return res;
                    }
                } catch (err) {
                    console.log(err);
                    return { success: false };
                }
            };

            const editUploadFiles = async() => {
                try {
                    const optimizedFiles = await getOptimizedAttachedFiles(attachedFilesUrls);

                    setAttachedFilesUrls(optimizedFiles.optArr);

                    //attached and uploaded files, atleast one exist
                    if(optimizedFiles.optArr.length <= 0 && uploadedFiles.length <= 0){
                        attahcedFilesError = true;
                        errorEncountered = true;
                    }

                    if(errorEncountered === true)
                        return { success: false };

                    //upload files to storage server

                    let uploadFilesRes = { success: true, dt: 'no files to upload' };
                    
                    if(optimizedFiles.optArr.length > 0) 
                        uploadFilesRes = await uploadFiles(
                            optimizedFiles.optArr, id, storageKey, userEmail
                        );

                    console.log('upload res: ', uploadFilesRes);

                    if(uploadFilesRes.success !== true){
                        setError(uploadFilesRes.dt.toString());
                        return { success: false };
                    } else if(uploadFilesRes.success === true && attachedFilesUrls.length > 0) {
                        return uploadFilesRes;
                    };
                } catch (err) {
                    console.log(err);
                    return { success: false };
                }
            };

            const editDeleteFiles = async() => {
                try {
                    const deleteFilesRes = await deleteFiles(
                        id, filesToDelete, storageKey, userEmail
                    );
                    if(deleteFilesRes.success !== true){
                        setError(res.dt.toString());
                        return { success: false };
                    } else {
                        return deleteFilesRes;
                    }
                } catch (err) {
                    console.log(err);
                    return { success: false };
                }
            };

            let res = null;
            if(isSomethingChanged(true)) 
                res = await editMainInfo();

            if(res && res.success === false){
                setSuccess(false);
                setLoading(false);
                return;
            }

            let uploadRes = null;
            if(attachedFilesUrls?.length > 0)
                uploadRes = await editUploadFiles();

            if(uploadRes && uploadRes.success === false){
                if(res?.success === true) setItem(res.dt);
                setSuccess(false);
                setLoading(false);
                return;
            }
            
            let deleteRes = null;
            if(filesToDelete?.length > 0)
                deleteRes = await editDeleteFiles();
            
            if(deleteRes && deleteRes.success === false){
                if(uploadRes?.success === true) setItem(uploadRes?.dt);
                setSuccess(false);
                setLoading(false);
                return;
            }

            setError('');
            if(deleteRes?.success === true) setItem(deleteRes?.dt);
            else if(uploadRes?.success === true) setItem(uploadRes?.dt);
            else if(res?.success === true) setItem(res?.dt);
            setSuccess(true);
            setLoading(false);
            return;
            
        } catch (err) {
            setError(err.message);
            setSuccess(false);
            setLoading(false);
        }

    };

    async function fetchItemDetails () {

        try {
    
            if(!id || id.length < 10 || fetching) return;
        
            setFetching(true);
        
            const res = await fetchPropertyDetails(id);

            console.log('res: ', res);
        
            if(res.success !== true) {
                setFetching(false);
                setFetchingOnce(false);
                return;
            }
        
            console.log(res.dt);
        
            setItem(res.dt);

            setFetchingOnce(false);
          
        } catch (err) {
            setFetchingOnce(false);
        }
    
    };

    const handleVisible = async() => {

        try {

            setVisiblityIsLoading(true);

            const res = await showProp(id, item.visible ? 'hide' : 'show');

            if(res.success !==true){
                setIsVisibiltyError(res.dt);
                setIsVisibiltySuccess('');
                setVisiblityIsLoading(false);
                return
            };

            setIsVisibiltyError('');
            setIsVisibiltySuccess('تم تحديث الظهور بنجاح');
            setItem(res.dt);
            setVisiblityIsLoading(false);
            
        } catch (err) {
            console.log(err.message);
            setIsVisibiltyError('حدث خطأ ما');
            setIsVisibiltySuccess('');
            setVisiblityIsLoading(false);
        }

    };

    const handleBookable = async() => {

        try {

            setBookableIsLoading(true);

            const res = await setBookable(id, item.is_able_to_book ? 'prevent-book' : 'able-to-book');

            if(res.success !==true){
                setBookableError(res.dt);
                setBookableSuccess('');
                setBookableIsLoading(false);
                return
            };

            setBookableError('');
            setBookableSuccess('تم تحديث امكانية الحجز بنجاح.');
            setItem(res.dt);
            setBookableIsLoading(false);
            
        } catch (err) {
            console.log(err.message);
            setBookableError('حدث خطأ ما');
            setBookableSuccess('');
            setBookableIsLoading(false);
        }

    };

    const handleDeleteProp = async() => {

        try {

            if(isDeletingProp) return;

            setIsDeletingProp(true);

            const deleteFilesRes = await deletePropFiles(id, userEmail);

            console.log(deleteFilesRes);

            if(deleteFilesRes.success !== true){
                setDeleteError(deleteFilesRes.dt);
                setDeleteSuccess('');
                setIsDeletingProp(false);
                return;
            }

            const res = await deleteProp(id);

            if(res.success !== true){
                setDeleteError(res.dt);
                setDeleteSuccess('');
                setIsDeletingProp(false);
                return
            };

            setDeleteError('');
            setDeleteSuccess('تم حذف العرض');

            setTimeout(() => {
                setItem(null);
            }, 10000);

            setIsDeletingProp(false);
            
        } catch (err) {
            console.log(err.message);
            setDeleteError('حدث خطأ ما');
            setDeleteSuccess('');
            setIsDeletingProp(false);
        }

    };

    const handleNewBookedDays = async() => {

        if(bookDaysIsLoading || !isOkayNewBookedDays()) return;

        try {

            setBookDaysIsLoading(true);

            const res = await setNewBookedDays(id, selectBookedDays);
            
            if(res.success !== true){
                setBookDaysError(res.dt);
                setBookDaysSuccess('');
                setBookDaysIsLoading(false);
                return;
            }
            
            setBookDaysError('');
            setBookDaysSuccess('تم تحديث القائمة بنجاح.');
            setItem(res.dt);
            setBookDaysIsLoading(false);

        } catch (err) {
            console.log(err.message);
            setBookDaysError('خطأ غير معروف');
            setBookDaysSuccess('');
            setBookDaysIsLoading(false);
        }

    };

    const showMap = () => {      
        setMapUsed(true);
        setMapType('select-point');
        setIsMap(true);
    };

    const isOkayNewBookedDays = () => {
        if(selectBookedDays?.sort()?.toString() === item.booked_days?.sort()?.toString())
            return false;
        return true;    
    };

    const getInputPlaceHolder = (pl) => {
        switch(pl){
            case 'youtube':
                return 'ادخل رابط يوتيوب';
            case 'facebook':
                return 'ادخل رابط فيسبوك';
            case 'linkedin':
                return 'ادخل رابط لينكدان';
            default:
                return 'ادخل رابط حسابك';    
        }
    };

    const contactsIsChanged = () => {

        let tempContacts = [], tempItemContacts = [];

        contacts.forEach((item) => {
            tempContacts.push({
                platform: item.platform, val: item.val
            });
        });

        item.contacts?.forEach((item) => {
            tempItemContacts.push({
                platform: item.platform, val: item.val
            });
        });

        if(JSON.stringify(tempContacts) !== JSON.stringify(tempItemContacts) 
            || (tempContacts.length > 0 && (item.contacts === null || item.contacts === undefined)) )
            return true;

        return false;

    };

    const getPriceValue = (reservationType) => {
        switch(reservationType){
            case 'Daily':
              return itemPrices?.daily;
            case 'Weekly':
              return itemPrices?.weekly;
            case 'Monthly':
              return itemPrices?.monthly;
            case 'Seasonly':
              return itemPrices?.seasonly;
            case 'Yearly':
              return itemPrices?.yearly;
            default:
                return null;
        };
    };

    const handlePriceChange = (e, reservationType) => {
        switch(reservationType){
            case 'Daily':
                return setItemPrices({
                    daily: Number(e.target.value),
                    weekly: itemPrices?.weekly,
                    monthly: itemPrices?.monthly,
                    seasonly: itemPrices?.seasonly,
                    yearly: itemPrices?.yearly,
                });
            case 'Weekly':
                return setItemPrices({
                    daily: itemPrices?.daily,
                    weekly: Number(e.target.value),
                    monthly: itemPrices?.monthly,
                    seasonly: itemPrices?.seasonly,
                    yearly: itemPrices?.yearly,
                });
            case 'Monthly':
                return setItemPrices({
                    daily: itemPrices?.daily,
                    weekly: itemPrices?.weekly,
                    monthly: Number(e.target.value),
                    seasonly: itemPrices?.seasonly,
                    yearly: itemPrices?.yearly,
                });
            case 'Seasonly':
                return setItemPrices({
                    daily: itemPrices?.daily,
                    weekly: itemPrices?.weekly,
                    monthly: itemPrices?.monthly,
                    seasonly: Number(e.target.value),
                    yearly: itemPrices?.yearly,
                });
            case 'Yearly':
                return setItemPrices({
                    daily: itemPrices?.daily,
                
                    weekly: itemPrices?.weekly,
                    monthly: itemPrices?.monthly,
                    seasonly: itemPrices?.seasonly,
                    yearly: Number(e.target.value),
                });
        };
    };

    const setAutomaticLocation = async() => {
        try {

            setIsManualLocSet(false);
            setFetchingLocation(true);
            navigator.geolocation.getCurrentPosition((geoPos) => {
                setLocObj({
                    lat: geoPos?.coords?.latitude,
                    long: geoPos?.coords?.longitude,
                    // ...reverseGeoCode(geoPos?.coords?.latitude, geoPos?.coords?.longitude)
                });
                setLatitude(geoPos?.coords?.latitude);
                setLongitude(geoPos?.coords?.longitude);
                setIsUserLoc('true');
                setIsManualLocSet(true);
                setFetchingLocation(false);
            }, async() => {
                const res = await getUserLocation();
                console.log(res);
                if(res.ok !== true) return setFetchingLocation(false);
                setLocObj(res);
                setFetchingLocation(false);
            });
        } catch (err) {
            console.log(err);
            setLocObj(null);
            setFetchingLocation(false);
        }
    };

    const getDtlItemSections = (idName) => {
        let str = '';
        const obj = getDetails()?.find(i => i.idName === idName);
        if(!obj) return str;
        if(idName !== 'rooms' && idName !== 'guest_rooms') str += 'selections ';
        if(obj?.isNum) str += 'num ';
        if(obj?.isDimension) str += 'dim ';
        if(obj?.isDepth) str += 'depth ';
        if(idName === 'rooms' || idName === 'guest_rooms') str += 'capacity ';
        if(idName === 'rooms' && specificCatagory === 'students') str += 'roomType ';
        console.log('str: ', str);
        return str;
    };

    const isTestSection = (testAllUntilThis, all) => {

        setSectionError('');

        if(!isSomethingChanged()) return true;

        const testSec1 = () => {

            console.log('test1');

            let errorEncountered = false;

            if(itemTitle === '-1' || !isValidText(itemTitle) || (itemTitleEN && !isValidText(itemTitleEN))){
                setItemTitle('-1');
                errorEncountered = true;
            }
    
            if(itemDesc === '-1' || !isValidText(itemDesc) || (itemDescEN && !isValidText(itemDescEN))){
                setItemDesc('-1');
                errorEncountered = true;
            }

            if(!itemCity || !JordanCities.find(i=>i.city_id === itemCity?.city_id)){
                setItemCity({ city_id: -1 });
                errorEncountered = true;
            }
    
            if((itemNeighbour && !isValidText(itemNeighbour)) || (itemNeighbourEN && !isValidText(itemNeighbourEN))){
                setItemNeighbour('-1');
                setItemNeighbourEN('');
                errorEncountered = true;
            }

            if(errorEncountered){
                setSectionError('الرجاء اكمال المعلومات الأساسية و تصحيح الأخطاء بالحقول.');
            } else {
                setSectionError('');
            }

            return !errorEncountered;

        };

        const testSec2 = () => {

            console.log('test2: ', item.map_coordinates, longitude, latitude);

            if(!item.type_is_vehicle || !item.map_coordinates?.at(0) || !item.map_coordinates?.at(1)) return true;

            if(latitude === itemCity?.lat && longitude === itemCity?.long) {
                setSectionError('لم تقم بتحديد موقع جغرافي للعقار, التقدم على أي حال ؟');
                return false;
            } else if(!isInsideJordan(longitude, latitude)){
                setSectionError('الموقع خارج الأردن, الرجاء تحديد موقع صالح على الخريطة');
                return false;
            };
            setSectionError('');
            return true;
        };

        const testSec3 = () => {
            
            console.log('test3');

            let errorEncountered = false;
            let errMsg = '';

            if(!isValidPrices()) {
                msg = 'حدد اسعار للعقار';
                errorEncountered = true;
            } 

            if(discountNights > 0 && (typeof discountNights !== 'number' || discountNights < 0 || discountNights > 2000)){
                setDiscountNights(-1);
                errMsg += ', عدد أيام غير صالح يجب أن يكون بين (0 - 2000) يوم';
                errorEncountered = true;
            }
    
            if(discountPer > 0 && (typeof discountPer !== 'number' || discountPer < 0 || discountPer > 100)){
                setDiscountPer(-1);
                errMsg += ', رقم تخفيض غير صالح يجب أن يكون بين (0 - 100)%';
                errorEncountered = true;
            }

            setSectionError(errMsg);
            return !errorEncountered;

        };

        const testSec4 = () => {

            console.log('test4');

            if(item.images?.length <= 1 && filesToDelete?.length > 0){
                setSectionError('لا يمكن حذف آخر صورة تعبر عن ' + (item.type_is_vehicle ? 'السيارة' : 'العقار'));
                return false;
            } else {
                setSectionError('');
                return true;
            }

        };

        const testSec5 = () => {

            console.log('test5');

            let errorEncountered = false;
            let detailsErrorMsg = '';
            setDetailsError('');

            if(typeof requireInsurance !== 'boolean'){
                detailsErrorMsg = detailsErrorMsg + ' insurance ';
                errorEncountered = true;
            }

            if(cancellation?.length > 0 && !cancellationsArray().includes(cancellation)){
                detailsErrorMsg = detailsErrorMsg + ' cancellation ';
                errorEncountered = true;
            }

            if(!contacts || !contacts?.length > 0){
                detailsErrorMsg = detailsErrorMsg + 'contacts ';
                setContactsError('الرجاء كتابة طريقة تواصل واحدة على الأقل.');
                errorEncountered = true;
            } else {
                for (let i = 0; i < contacts.length; i++) {
                    if(!isValidContactURL(contacts[i])) {
                        detailsErrorMsg = detailsErrorMsg + 'contacts ';
                        setContactsError('هنالك رابط غير صالح, الرجاء اختيار منصة و ادخال رابط صالح.');
                        errorEncountered = true;
                        break;
                    }
                }
            }
            
            if(area && !isValidNumber(area)){
                detailsErrorMsg = detailsErrorMsg + ' area ';
                errorEncountered = true;
            }
    
            if(capacity && !isValidNumber(capacity)){
                detailsErrorMsg = detailsErrorMsg + ' capacity ';
                errorEncountered = true;
            }

            if(landArea && !isValidText(landArea)){
                detailsErrorMsg = detailsErrorMsg + ' landArea ';
                errorEncountered = true;
            }
    
            if(floor && !isValidText(floor)){
                detailsErrorMsg = detailsErrorMsg + ' floor ';
                errorEncountered = true;
            }

            if(customerType?.length > 0 && !(specificCatagory === 'students' ? studentsTypesArray() : customersTypesArray()).includes(customerType)){
                detailsErrorMsg = detailsErrorMsg + ' customerType ';
                detailsErrorMsg = detailsErrorMsg + ' customerType ';
                errorEncountered = true;
            }
    
            console.log('withDriver: ', withDriver);

            if(item.type_is_vehicle && typeof withDriver !== 'boolean'){
                detailsErrorMsg = detailsErrorMsg + ' withDriver ';
                errorEncountered = true;
            }

            if(item.type_is_vehicle && vehicleRentType && (!isValidText(vehicleRentType) || !vehicleRentTypesArray().includes(vehicleRentType))) {
                detailsErrorMsg = detailsErrorMsg + ' rentType ';
                errorEncountered = true;
            }

            if(item.type_is_vehicle && carGearbox && (!isValidText(carGearbox) || !carGearboxes().includes(carGearbox))) {
                detailsErrorMsg = detailsErrorMsg + ' carGearbox ';
                errorEncountered = true;
            }

            if(item.type_is_vehicle && carFuelType && (!isValidText(carFuelType) || !carFuelTypesArray().includes(carFuelType))) {
                detailsErrorMsg = detailsErrorMsg + ' carFuelType ';
                errorEncountered = true;
            }

            const validDetails = isValidDetails();
            if(!validDetails?.ok){
                detailsErrorMsg = detailsErrorMsg + validDetails.msg;
                errorEncountered = true;
            }

            console.log('detailsError: ', detailsErrorMsg);

            setDetailsError(detailsErrorMsg);

            if(errorEncountered) setSectionError('هنالك أخطاء في بعض الحقول الرجاء مراجعتها و تصحيحها');
            else setSectionError('');

            return !errorEncountered;

        };
        
        const isValidDetails = () => {
            const arr = getDetails();
            let msg = '';
            for (let i = 0; i < arr.length; i++) {
                const element = arr[i];
                
                if(element?.isWithEN){
                    for (let j = 0; j < element?.array?.length; j++) {
                        const elem = element.array[j];
                        if(!elem && !element.detailsEN?.find(i=>i.arName === elem)?.enName)
                            msg = msg + ` ${element.idName}.${j} `;
                        else if(!isValidText(elem || 'pass') || !isValidText(element.detailsEN?.find(i=>i.arName === elem)?.enName || 'pass')) 
                            msg = msg + ` ${element.idName}.${j} `;
                    }
                } 
                
                if(!element.isWithEN && element?.array?.length > 0) {
                    for (let k = 0; k < element?.array.length; k++) {
                        const elem = element?.array[k];
                        if(!isValidNumber(elem?.capacity || 200)) msg = msg + ` ${element.idName}.${k} `;
                        else if(!isValidNumber(elem?.single_beds || 200)) msg = msg + ` ${element.idName}.${k} `;
                        else if(!isValidNumber(elem?.double_beds || 200)) msg = msg + ` ${element.idName}.${k} `;
                        else if(!isValidText(elem?.room_type || 'pass')) msg = msg + ` ${element.idName}.${k} `;
                        else if(!isValidNumber(elem?.depth || 200)) msg = msg + ` ${element.idName}.${k} `;
                        else if(!isValidNumber(elem?.dim?.x || 200)) msg = msg + ` ${element.idName}.${k} `;
                        else if(!isValidNumber(elem?.dim?.y || 200)) msg = msg + ` ${element.idName}.${k} `;
                    }
                }

                if(!element.isWithEN && element?.accompany?.length > 0){
                    if(!Array.isArray(element.accompany)){
                        if(!isValidText(elem || 'pass')) 
                            msg = msg + ` ${element.idName}.accompany `;
                    }
                    for (let n = 0; n < element?.accompany.length; n++) {
                        const elem = element?.accompany[n];
                        if(!isValidText(elem || 'pass')) {
                            msg = msg + ` ${element.idName}.accompany `;
                            break;
                        }
                    }
                }

            }

            return { ok: !msg?.length > 0, msg };

        };

        console.log('testAllUntilThis: ', testAllUntilThis);

        if(all){
            let isAllError = false;
            if(!testSec1()) isAllError = true;
            if(!testSec2()) isAllError = true;
            if(!testSec3()) isAllError = true;
            if(!testSec4()) isAllError = true;
            if(!testSec5()) isAllError = true;
            return !isAllError;
        }
        
        if(testAllUntilThis >= 0){
            if(testAllUntilThis <= section) return true;
            let errorEncounteredIndex = -1;
            for (let i = section; i < testAllUntilThis; i++) {
                console.log('i is: ', i);
                if(i === 0) 
                    if(!testSec1()) errorEncounteredIndex = i;
                // if(i === 1) 
                //     if(!testSec2()) errorEncounteredIndex = i;
                if(i === 2) 
                    if(!testSec3()) errorEncounteredIndex = i;
                if(i === 3) 
                    if(!testSec4()) errorEncounteredIndex = i;
                if(i === 4) 
                    if(!testSec5()) errorEncounteredIndex = i;
            }
            if(errorEncounteredIndex !== -1) setSectionError('لا يمكن التنقل عن طريق رقم القسم نسبة لوجود خطأ في قسم رقم ' + errorEncounteredIndex + ' "' + sectionsArray.find(i => i.id === errorEncounteredIndex)?.name + '"');
            return errorEncounteredIndex === -1;
        } else {
            if(section === 0) return testSec1();
            if(section === 1) return testSec2();
            if(section === 2) return testSec3();
            if(section === 3) return testSec4();
            if(section === 4) return testSec5();
        }

        return true;

    };
    
    useEffect(() => {
        setRunOnce(true);
    }, []);
    
    useEffect(() => {
        if(runOnce === true) {
            fetchItemDetails();
        }
    }, [runOnce]);

    useEffect(() => {
        if(item){

            setAttachedFilesUrls([]);
            setFilesToDelete([]);
            setItemTitle(item.title);
            setItemTitleEN(item.en_data?.titleEN);
            setItemDesc(item.description);
            setItemDescEN(item.en_data?.descEN);
            setItemCity(JordanCities.find(i=>i.value === item.city));
            setItemNeighbour(item.neighbourhood);
            setItemNeighbourEN(item.en_data?.neighbourEN);
            setSpecificCatagory(item.specific_catagory);
            setItemPrices(item.prices);
            setUploadedFiles([...item.images, ...item.videos]);
            setRequireInsurance(item.details?.insurance);
            setSelectBookedDays(item.booked_days || []);
            if(item.contacts) setContacts(item.contacts);
            setDiscountNights(item.discount?.num_of_days_for_discount);
            setDiscountPer(item.discount?.percentage);
            setCancellation(cancellationsArray()[item.cancellation]);
            setCapacity(item.capacity);
            setCustomerType(item.customer_type);
            setArea(item.area);
            setLandArea(item.landArea);
            setFloor(item.floor);
            setWithDriver(item.details?.vehicle_specifications?.driver);
            setVehicleRentType(vehicleRentTypesArray()[vehicleRentTypesArray(true).indexOf(item.details?.vehicle_specifications?.rent_type)]);
            setCarGearBox(carGearboxes()[carGearboxes(true).indexOf(item.details?.vehicle_specifications?.gearbox)]);
            setCarFuelType(carFuelTypesArray()[carFuelTypesArray(true).indexOf(item.details?.vehicle_specifications?.fuel_type)]);
            if(item.type_is_vehicle && item.map_coordinates?.at(0)) setLongitude(item.map_coordinates[0]);
            if(item.type_is_vehicle && item.map_coordinates?.at(1)) setLatitude(item.map_coordinates[1]);

            if(item.type_is_vehicle){
                setVehicleFeatures(item.details?.features);
                setVehicleFeaturesEN(getEnglishDetailsArray('features', null, true));
            } else {
                setGuestRoomsDetailArray(item.details?.guest_rooms);
                setBathroomsDetailArray(item.details?.bathrooms?.array);
                setBathroomsAccompany(item.details?.bathrooms?.companians);
                setKitchenDetailArray(item.details?.kitchen?.array);
                setKitchenAccompany(item.details?.kitchen?.companians);
                setRoomsDetailArray(item.details?.rooms);
                setPoolsDetailArray(item.details?.pool.array);
                setPoolAccompany(item.details?.pool.companians);
                setCompanionsDetailArray(item.details?.facilities);
                setVehicleFeatures(item.details?.features);
                setNearPlaces(item.details?.near_places);
                setNearPlacesEN(getEnglishDetailsArray('places', null, true));
                setVehicleFeaturesEN(getEnglishDetailsArray('features', null, true));
            }
            
            setConditionsAndTerms(item.terms_and_conditions);
            setConditionsAndTermsEN(getEnglishDetailsArray('terms', null, true));

        }
    }, [item]);

    useEffect(() => {
        let timeout;
        const format = getBookDateFormat(calendarSelect);
        if(selectBookedDays?.includes(format)){
            setSelectBookedDays(selectBookedDays.filter(
                i => i !== format
            ));
            setTriggerCalendarRender(false);
            timeout = setTimeout(() => setTriggerCalendarRender(true), [5]);
        } else if(format && Array.isArray(selectBookedDays)) {
            setSelectBookedDays([...selectBookedDays, format]);
        }
        return () => clearTimeout(timeout);
    }, [calendarSelect]);

    useEffect(() => {
        setSuccess(false);
        setError('');
        setSectionTitle(sectionsArray.find(i => i?.id === section)?.name);
        if(section === 6) setFreeSection(true);
    }, [section]);

    useEffect(() => {
        if(mapUsed === true){
            setItemLong(longitude);
            setItemLat(latitude);
        }
    }, [longitude, latitude]);

    useEffect(() => {
        setContactsError('');
    }, [contacts]);

    useEffect(() => {
        if(!loadingUserInfo && userId?.length > 0) setFetchingUserInfo(false);
    }, [fetchingUserInfo]);

    const RightIconSpan = () => {
        return <span id='righticonspan'/>
    }

    if(!item || !userId?.length > 0 || !isVerified){
        return (
            (fetchingOnce || fetchingUserInfo) ? <MySkeleton isMobileHeader/> : <NotFound navToVerify={!isVerified} type={!isVerified ? 'not allowed' : undefined}/>
        )
    }

  return (

    <div className='add'>

        <span id='closePopups' onClick={() => {
            setCityPopup(false); setIsCustomerType(false); setCompaniansShow(false); setBathroomsShow(false); setKitchenShow(false);
            setPoolsShow(false); setIsCancellation(false);
        }} style={{ display: (!cityPopup && !isCustomerType && !companiansShow && !bathroomsShow && !isCancellation
            && !kitchenShow && !poolsShow) ? 'none' : undefined }}/>

        <div className='wrapper editProp'>

            <div className='functionality'>

                {item.isRejected ? <div className='rejection-div'>
                    <div className='status'>العرض <span>مرفوض</span></div>
                    <h2>أسباب رفض العرض</h2>
                    <ul>
                    {item?.reject_reasons?.map((reason, index) => (
                        <li key={index}>{reason}</li>
                    ))}
                    </ul>
                    <p><Svgs name={'info'}/>قم بتعديل العرض و ارساله مجددا</p>
                </div> : <div className='rejection-div' style={{ 
                    background: !item.checked ? 'var(--softYellow)' : 'var(--softGreen)'
                }}>
                    <div style={{ margin: 0 }} className='status'>حالة العرض <span>{!item.checked ? 'تحت المراجعة' : 'مقبول'}</span></div>
                </div>}

                <button onClick={() => setIsVisibilty(!isVisibilty)} className={!isVisibilty ? 'editDiv' : 'editDiv chngpassbtn'}>ظهور العرض<Svgs name={'dropdown arrow'}/></button>

                <div className='hide-show-prop' style={{ display: !isVisibilty && 'none' }}>
                    <span>الحالة <h4>{item.visible ? 'مرئي' : 'مخفي'}</h4></span>
                    <p><Svgs name={'info'}/> اخفاء أو اظهار العرض للعامة, للعلم تستطيع تغيير الظهور في أي وقت.</p>
                    <p style={{ display: (visibiltyError.length <= 0 && visibiltySuccess.length <= 0) && 'none', color: visibiltyError.length > 0 ? 'var(--softRed)' : 'var(--secondColor)' }}>{visibiltyError.length > 0 ? visibiltyError : visibiltySuccess}</p>
                    <button onClick={handleVisible} className='btnbackscndclr'>{(item.visible ? (visiblityIsLoading ? 'جاري اخفاء العرض...' : 'اخفاء العرض') : (visiblityIsLoading ? 'جاري اظهار العرض...' : 'اظهار العرض'))}</button>
                </div>

                <hr />

                <button onClick={() => setIsBookable(!isBookable)} className={!isBookable ? 'editDiv' : 'editDiv chngpassbtn'}>امكانية حجز العرض<Svgs name={'dropdown arrow'}/></button>

                <div className='hide-show-prop' style={{ display: !isBookable ? 'none' : null }}>
                    <span>الحالة <h4>{item.is_able_to_book ? 'يقبل الحجوزات' : 'لا يقبل الحجوزات'}</h4></span>
                    <p><Svgs name={'info'}/>تغيير حالة العرض من حيث قبول الحجوزات الجديدة أو عدم قبولها.</p>
                    <p style={{ display: (bookableError.length <= 0 && bookableSuccess.length <= 0) && 'none', color: bookableError.length > 0 ? 'var(--softRed)' : 'var(--secondColor)' }}>{bookableError.length > 0 ? bookableError : bookableSuccess}</p>
                    <button onClick={handleBookable} className='btnbackscndclr'>{(item.is_able_to_book ? (bookableIsLoading ? 'جاري قفل الحجوزات...' : 'قفل الحجوزات') : (bookableIsLoading ? 'جاري فتح الحجوزات...' : 'فتح الحجز'))}</button>
                </div>

                <hr />

                <button onClick={() => setIsBookDays(!isBookDays)} className={!isBookDays ? 'editDiv' : 'editDiv chngpassbtn'}>تحديد أيام عدم الحجز<Svgs name={'dropdown arrow'}/></button>

                <div className='hide-show-prop calendar-edit-prop' style={{ display: !isBookDays ? 'none' : null }}>
                    <p><Svgs name={'info'}/>حدد أيام لا يمكن الحجز فيها, تستطيع تغيير هذه الأيام في أي وقت.</p>
                    
                    <h3 style={{ marginBottom: 20 }}>الأيام المحجوزة حاليا</h3>

                    <p style={{ marginBottom: 8 }} id='detailed-by-color'>معلمة باللون <span />,</p> 
                    <p style={{ marginBottom: 24 }} id='detailed-by-color'>اضغط على اليوم لاضافته أو حذفه من قائمة الأيام.</p>

                    <div id='calendar-div'>
                        {triggerCalendarRender && <MyCalendar setCalender={setCalenderSelect} 
                        type={'edit-prop'} days={selectBookedDays}/>}
                    </div>

                    <p style={{ display: (bookDaysError?.length <= 0 && bookDaysSuccess.length <= 0) && 'none', color: bookDaysError?.length > 0 ? 'var(--softRed)' : 'var(--secondColor)' }}>{bookDaysError?.length > 0 ? bookDaysError : bookDaysSuccess}</p>
                    <button id={isOkayNewBookedDays() ? '' : 'disable-button'} onClick={handleNewBookedDays} className='btnbackscndclr'>{bookDaysIsLoading ? 'جاري تحديث الأيام...' : 'تحديث قائمة الأيام'}</button>

                </div>

                <hr />

                <button onClick={() => setIsDeleteProp(!isDeleteProp)} className={!isDeleteProp ? 'editDiv' : 'editDiv chngpassbtn'}>حذف العرض<Svgs name={'dropdown arrow'}/></button>

                <div className='hide-show-prop' style={{ display: !isDeleteProp && 'none' }}>
                    <p><Svgs name={'info'}/>سيتم حذف هذا العرض نهائيا.</p>
                    <p style={{ display: (deleteError.length <= 0 && deleteSuccess.length <= 0) && 'none', color: deleteError.length > 0 ? 'var(--softRed)' : 'var(--secondColor)' }}>{deleteError.length > 0 ? deleteError : deleteSuccess}</p>
                    <button onClick={handleDeleteProp} className='btnbackscndclr'>{isDeletingProp ? 'جاري الحذف...' : 'حذف'}</button>
                </div>

                <hr />

                <Link href={`/view/item?id=${id}`} className='editDiv'>رؤية كما يظهر للآخرين<Svgs name={'show password'}/></Link>

                <hr />
            
            </div>

            <div className='sections'>

                <div className='sections-show'>
                    <ul>
                        {sectionsArray.map((sec) => (
                            sec && <li className={section >= sec.id ? 'section-selected disable-text-copy' : undefined}>
                                <strong 
                                onClick={() => {
                                    if(sec.id < section) setSection(sec.id);
                                    else if(isTestSection(sec.id)) setSection(sec.id);
                                }} className='disable-text-copy'>
                                    {sec.id + 1 - ((!item.type_is_vehicle && sec.id > 1) ? 1 : 0)}
                                </strong>
                                {sec.id < 5 && <span style={{ background: section > sec.id ? undefined : 'var(--darkWhite)' }}/>}
                            </li>
                        ))}
                    </ul>
                    <p>{sectionTitle}</p>
                </div>

                {section === 0 && <>

                    <CustomInputDivWithEN value={itemTitle === '-1' ? null : itemTitle} 
                    enValue={itemTitleEN}
                    isError={itemTitle === '-1'} 
                    errorText={'الرجاء كتابة عنوان صالح, مع عدم استخدام حروف غير صالحة مثل <, &, " ...الخ'} 
                    title={'العنوان بالعربية و الانجليزية'} placholderValue={'اكتب العنوان باللغة العربية هنا'} 
                    enPlacholderValue={'اكتب العنوان باللغة الانجليزية هنا'} 
                    listener={(e) => { setItemTitle(e.target.value); }} 
                    enListener={(e) => setItemTitleEN(e.target.value)} isProfileDetails/>

                    <CustomInputDivWithEN isError={itemDesc === '-1'} 
                    errorText={'الرجاء كتابة وصف واضح عن ما تريد عرضه, مع عدم استخدام حروف غير صالحة مثل <, &, " ...الخ.'} 
                    title={'ادخل الوصف بالعربية و الانجليزية'} isTextArea={true} 
                    placholderValue={'اكتب الوصف باللغة العربية هنا'}
                    value={itemDesc === '-1' ? null : itemDesc} enValue={itemDescEN} 
                    enPlacholderValue={'اكتب الوصف باللغة الانجليزية هنا'} 
                    listener={(e) => { setItemDesc(e.target.value); }} isProfileDetails
                    enListener={(e) => setItemDescEN(e.target.value)} type={'text'}/>

                    {item.type_is_vehicle && <div className='address' style={{ zIndex: cityPopup ? 11 : 0 }}>
                        <div className='popup-wrapper'>
                            <CustomInputDivWithEN settingFocused={() => setCityPopup(true)} 
                            isCity={true} isError={itemCity?.city_id === -1} 
                            errorText={'حدد المدينة التي متاح فيها الإِيجار'} 
                            title={'المدينة'} value={itemCity?.arabicName} type={'text'} 
                            enValue={itemCity?.value} 
                            placholderValue={'اختر مدينة'}/>
                            {cityPopup && <AddDetailsPopup array={itemCity} setArray={setItemCity} type={'add-city'} sections={'selections'} isSingleSelect setIsShow={setCityPopup}/>}
                        </div>
                        <CustomInputDivWithEN title={'الحي'} isError={itemNeighbour === '-1'} 
                        errorText={'الرجاء عدم استخدام حروف غير صالحة مثل <, &, " ...الخ'} 
                        listener={(e) => setItemNeighbour(e.target.value)} 
                        placholderValue={'اكتب اسم الحي بالعربية'} value={itemNeighbour === '-1' ? null : itemNeighbour}
                        enPlacholderValue={'اكتب اسم الحي بالانجليزية'} isProfileDetails enValue={itemNeighbourEN}
                        enListener={(e) => setItemNeighbourEN(e.target.value)} type={'text'}/>
                    </div>}</>}

                {(section === 1 && item.type_is_vehicle) && <div className='location-div disable-text-copy'>
                    
                    <h3>تحديد موقع جغرافي للعقار</h3>
                    
                    <button className='editDiv' onClick={setAutomaticLocation}>{fetchingLocation ? <LoadingCircle isLightBg/> : 'تحديد تلقائي'}</button>

                    {locObj && <div className='automatic-location'>
                        {locObj?.city && 
                        <><h4>هل موقع العقار في مدينة {locObj?.city}, {locObj?.principalSubdivision}, {locObj?.locality} ؟</h4>
                        <button style={isUserLoc?.length > 0 ? {
                            background: 'white', color: 'black', fontWeight: 400,
                            cursor: 'default'
                        } : undefined} className={'btnbackscndclr ' + arabicFont} onClick={() => { 
                            setLatitude(locObj?.lat);
                            setLongitude(locObj?.long);
                            setIsUserLoc('true'); 
                            setIsManualLocSet(true); 
                        }}>نعم</button>
                        <button style={isUserLoc?.length > 0 ? {
                            background: 'white', color: 'black', fontWeight: 400,
                            cursor: 'default'
                        } : undefined} className={'btnbackscndclr' + arabicFont} onClick={() => { 
                            if(isUserLoc?.length > 0) return;
                            setIsUserLoc('false');
                            setIsManualLocSet(true);
                            setLatitude(itemCity?.lat || JordanCities[0]?.lat);
                            setLongitude(itemCity?.long || JordanCities[0]?.long);
                        }}>لا</button></>}
                        <p style={isUserLoc === '' ? { display: 'none', margin: 0 } : undefined}>{isUserLoc === 'false' ? 'الرجاء ايقاف VPN ان كنت تستعمله و جرب مرة اخرى, أو قم بتحديد الموقع يدويا.' : (isUserLoc === 'true' ? 'قم بالتأكد من الموقع عن طريق الخريطة' : '')}</p>
                    </div>}

                    <button style={{ margin: '24px 0' }} onClick={() => {
                        if(isUserLoc !== 'true'){
                            setLatitude(itemCity?.lat || JordanCities[0]?.lat);
                            setLongitude(itemCity?.long || JordanCities[0]?.long);
                        };             
                        setIsManualLocSet(true); 
                        setIsUserLoc(''); 
                        setLocObj(null);
                    }} className='editDiv'>تحديد يدوي</button>

                    {isManualLocSet && <div className='googleMapDiv' onClick={showMap}>
                        <span>{isUserLoc === 'true' ? 'تأكد من الموقع و قم بتعديله.' : 'تحديد الموقع باستخدام الخريطة'}</span>
                        <Image src={GoogleMapImage}/>
                    </div>}

                </div>}

                {section === 2 && <><div className='prices'>
                    
                    <h3>تحديد السعر </h3>

                    <p>قم بتحديد سعر لكل مدة حجز {'(يومي, اسبوعي, شهري, فصلي و سنوي)'}</p>

                    {(expandPrices ? reservationType() : [reservationType()[0]]).map((rsvType) => (
                        <div className='priceDiv'>
                            <CustomInputDiv isError={pricesError.includes(rsvType.enName?.toLowerCase())} 
                            errorText={'حدد سعر ' + rsvType.oneAr} 
                            title={`السعر بال${currencyCode(false, true)}`} 
                            listener={(e) => handlePriceChange(e, rsvType.enName)} 
                            min={0} value={getPriceValue(rsvType.enName)}
                            type={'number'}/>
                            <strong>/</strong>
                            <h4>{rsvType.oneAr}</h4>
                        </div>
                    ))}

                    <button className='editDiv' onClick={() => setExpandPrices(!expandPrices)}>{expandPrices ? 'أقل' : 'تمديد'}</button>

                </div>

                <hr />

                <div className='set-discount'>
                    <h3>تخفيض</h3>
                    <div><CustomInputDiv type={'number'} value={discountPer > 0 ? discountPer : null}
                        placholderValue={'حدد نسبة'} 
                        listener={(e) => setDiscountPer(Number(e.target.value))} 
                        min={0} max={100} isError={discountPer === -1}/> %</div>
                    <h3>في حال حجز</h3>
                    <div><CustomInputDiv type={'number'} value={discountNights > 0 ? discountNights : null} 
                        placholderValue={'عدد الليالي'}
                        listener={(e) => setDiscountNights(Number(e.target.value))} 
                        min={1} max={2000}/> ليلة أو أكثر</div>
                </div></>}

                {section === 3 && <div className='attachFiles' ref={attachImagesDivRef}>

                    <button onClick={() => inputFilesRef.current.click()}>اضافة ملف</button>

                    <ul style={{ gridTemplateColumns: attachedFilesUrls.length <= 0 && '1fr' }}>
                        {uploadedFiles.map((myUrl) => (
                            <li className='uploaded-file-li' onClick={() => {

                            }}>
                                {(myUrl.split("").reverse().join("").split('.')[0] === 'gpj' || myUrl.split("").reverse().join("").split('.')[0] === 'gnp')
                                ? <Image src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${myUrl}`} width={1200} height={1200}/>
                                : <video autoPlay loop src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${myUrl}`} />
                                }
                                <span style={{ 
                                    display: !filesToDelete.includes(myUrl) && 'none'
                                }}><Svgs name={'cross'}/></span>
                                <Svgs name={filesToDelete.includes(myUrl) ? 'cross' : 'delete'} on_click={() => {
                                    if(filesToDelete.includes(myUrl)){
                                        setFilesToDelete(filesToDelete.filter(i => i !== myUrl));
                                    } else {
                                        setFilesToDelete([...filesToDelete, myUrl]);
                                    }
                                }}/>
                            </li>
                        ))}
                        {attachedFilesUrls.map((attachedFile) => (
                            <li onClick={() => {
                                setAttachedFilesUrls(attachedFilesUrls.filter(f => f !== attachedFile))
                            }}>
                                {attachedFile.type.split('/')[0] === 'image'
                                ? <Image src={URL.createObjectURL(attachedFile)} width={100} height={100}/>
                                : <video autoPlay loop src={URL.createObjectURL(attachedFile)}/>
                                }
                            </li>
                        ))}
                        <li id='chooseFileLastLi'
                            onClick={() => inputFilesRef.current.click()}
                        >{attachedFilesUrls.length > 0 ? 'أضف المزيد' : 'اضافة ملفات'}<p>(يجب أن يكون نوع الملف PNG أو JPG أو MP4 أو AVI)</p></li>
                    </ul>

                    <p style={{ marginTop: 12, display: !attachedFilesUrls?.length > 0 ? 'none' : undefined }}>اضغط على الملف لحذفه</p>

                    <input ref={inputFilesRef} multiple accept='.png, .jpg, .mp4, .avi' type='file' onChange={(e) => {
                        const files = e.target.files;
                        let arr = [];
                        for (let i = 0; i < files.length; i++) {
                            if(files[i] && allowedMimeTypes.includes(files[i].type) 
                            && !attachedFilesUrls.find(f => f.name === files[i].name)){
                                arr.push(files[i]);
                            }
                        }
                        setAttachedFilesUrls([...attachedFilesUrls, ...arr]);
                    }}/>

                </div>}

                {section === 4 && <div className='detailsAboutItem'>

                    <h2>أضف تفاصيل عن ال{item.type_is_vehicle ? 'سيارة' : 'عقار'}</h2>

                    <div className='insuranceDetail'>
                        <h3>هل الايجار يتطلب تأمين؟</h3>
                        <input type='radio' checked={requireInsurance} name='insurance_group' onChange={() => setRequireInsurance(true)}/><label onClick={() => setRequireInsurance(true)}>نعم</label>
                        <input checked={!requireInsurance} type='radio' name='insurance_group' onChange={() => setRequireInsurance(false)}/><label onClick={() => setRequireInsurance(false)}>لا</label>
                        {detailsError.includes('insurance') && <p className='error'>ادخال غير صالح الرجاء الاختيار من نعم أو لا</p>}
                    </div>

                    <div className='detailItem area-div disable-text-copy' onClick={() => {
                        if(!isCancellation) setIsCancellation(true);
                    }} style={{ cursor: isCancellation ? 'default' : undefined }}>
                        <h3>حدد امكانية الغاء الحجز</h3>
                        <InfoDiv title={'الغاء الحجز'} value={cancellation === '' ? 'غير محدد' : cancellation}/>
                        {isCancellation && <AddDetailsPopup array={cancellation} setArray={setCancellation} 
                        type={'cancellation'} sections={'selections'} isSingleSelect setIsShow={setIsCancellation} 
                        baseArr={cancellationsArray()} isNotFacilities/>}
                    </div>

                    <div className='detailItem contacts-div'>
                        <h3>اضافة طرق تواصل</h3>
                        <p style={{ marginBottom: contactsError?.length > 0 ? null : 0 }} id='error'>{contactsError}</p>
                        <ul className='detailItem-ul'>
                        {contacts.map((c, index) => (
                            <li key={index}>
                                <CustomInputDiv value={c.val} 
                                deletable placholderValue={getContactPlaceHolder(c.platform)} handleDelete={() => {
                                    let arr = [];
                                    for (let i = 0; i < contacts.length; i++) {
                                        if(i !== index){
                                            arr.push(contacts[i]);
                                        }
                                    }
                                    setContacts(arr);
                                }}
                                listener={(e) => {
                                    let arr = [...contacts];
                                    arr[index] = { platform: arr[index].platform, val: e.target.value, isPlatforms: arr[index].isPlatforms };
                                    setContacts(arr);
                                    setContactsError('');
                                }}/>
                                <div className='choose-platform'>
                                    <button className={c.isPlatforms ? 'editDiv rotate-edit-div' : 'editDiv'} onClick={() => {
                                        let arr = [...contacts];
                                        arr[index] = { platform: arr[index].platform, val: arr[index].val, isPlatforms: !arr[index].isPlatforms };
                                        for (let i = 0; i < contacts.length; i++) {
                                            if(i !== index){
                                                arr[i] =  { platform: arr[i].platform, val: arr[i].val, isPlatforms: false };
                                            }
                                        }
                                        setContacts(arr);
                                    }}>
                                        {c?.platform?.length > 0 ? c.platform : 'اختر منصة'} <Svgs name={'dropdown arrow'}/>
                                    </button>
                                    <ul style={{ display: c.isPlatforms ? null : 'none' }}>
                                        {contactsPlatforms.map((p) => (
                                            <li onClick={() => {
                                                let arr = [...contacts];
                                                arr[index] = { platform: p, val: arr[index].val, isPlatforms: false };
                                                setContacts(arr);
                                                setContactsError('');
                                            }}>{p} {p === c.platform && <RightIconSpan />}</li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ))}
                        </ul>
                        <button className='btnbackscndclr' onClick={() => setContacts([...contacts, { platform: '', val: '', isPlatforms: false }])}>أضف المزيد</button>
                    </div>

                    {!item.type_is_vehicle && <div className='detailItem area-div' style={{ display: item.type_is_vehicle ? 'none' : null}}>
                        <h3>اكتب أقصى سعة أو عدد نزلاء متاح بالعقار</h3>
                        <CustomInputDiv title={capacity > 0 ? `${capacity} نزيل` : ''} max={150000} min={-1} myStyle={{ marginBottom: 0 }} 
                        placholderValue={'كم نزيل مسموح بالعقار؟'} type={'number'} 
                        isError={detailsError?.includes('capacity')} 
                        errorText={'الرجاء ادخال عدد من صفر الى 150000'} listener={(e) => {
                            if(Number(e.target.value)) {
                                setCapacity(Number(e.target.value))
                            } else {
                                setCapacity(0);
                            };
                        }} value={capacity}/>
                    </div>}

                    {(!item.type_is_vehicle && specificCatagory !== 'students') && <div className='detailItem area-div' style={{ display: (item.type_is_vehicle) ? 'none' : null}}>
                        <h3 style={{ cursor: 'text' }}>اكتب مساحة العقار بالأمتار</h3>
                        <CustomInputDiv title={area > 0 ? `${area} متر مربع` : ''} max={1000000} min={0} myStyle={{ marginBottom: 0 }} placholderValue={'غير محدد'} type={'number'} 
                        isError={detailsError.includes('area')} errorText={'الرجاء ادخال مساحة صالحة'} listener={(e) => {
                            if(Number(e.target.value)) {
                                setArea(Number(e.target.value))
                            } else {
                                setArea(0);
                            };
                        }} value={area}/>
                    </div>}

                    {(!item.type_is_vehicle && specificCatagory === 'farm') && <div className='detailItem area-div'>
                        <h3>اكتب مساحة أرض المزرعة أو الشاليه</h3>
                        <CustomInputDiv title={landArea || 'مساحة الأرض'} 
                        max={1000000} min={0} myStyle={{ marginBottom: 0 }} 
                        placholderValue={'مثال: 2 فدان أو 500 متر'} 
                        isError={detailsError.includes('landArea')} 
                        errorText={'الرجاء ادخال مساحة صالحة'} 
                        listener={(e) => setLandArea(e.target.value)}
                        value={landArea}/>
                    </div>}

                    {(!item.type_is_vehicle && specificCatagory === 'apartment') && <div className='detailItem area-div' style={{ display: (item.type_is_vehicle) ? 'none' : null}}>
                        <h3>اكتب رقم أو اسم الطابق</h3>
                        <CustomInputDiv title={'الطابق ' + floor} max={1000000} min={0} myStyle={{ marginBottom: 0 }} 
                        placholderValue={'مثل: الثامن أو 8'}  isError={detailsError.includes('floor')} 
                        errorText={'الرجاء ادخال اسم صالح'} 
                        listener={(e) => setFloor(e.target.value)} value={floor}/>
                    </div>}
                    
                    {!item.type_is_vehicle && <div className='detailItem area-div disable-text-copy' onClick={() => {
                        if(!isCustomerType) setIsCustomerType(true);
                    }}>
                        <h3>حدد فئة النزلاء المسموحة (اختياري)</h3>
                        <InfoDiv title={'الفئة المسموحة'} divClick={() => setIsCustomerType(!isCustomerType)} value={customerType === '' ? 'غير محدد' : customerType}/>
                        {isCustomerType && <AddDetailsPopup array={customerType} setArray={setCustomerType} type={'customerType'} sections={'selections'} 
                        isNotFacilities isSingleSelect setIsShow={setIsCustomerType} baseArr={specificCatagory === 'students' ? studentsTypesArray() : customersTypesArray(false)}/>}
                        {detailsError.includes('customerType') && <p className='error2'>ادخال غير صالح, الرجاء الاختيار من أحد خيارات فئة النزلاء</p>}
                    </div>}

                    {item.type_is_vehicle && <div className='insuranceDetail'>
                        <h3>هل الايجار مع سائق أو بدون؟</h3>
                        <input type='radio' checked={withDriver} name='driver_group' onChange={() => setWithDriver(true)}/><label onClick={() => setWithDriver(true)}>مع سائق</label>
                        <input checked={!withDriver} type='radio' name='driver_group' onChange={() => setWithDriver(false)}/><label onClick={() => setWithDriver(false)}>بدون سائق</label>
                        {detailsError.includes('withDriver') && <p className='error2'>ادخال غير صالح الرجاء الاختيار من نعم أو لا</p>}
                    </div>}

                    {item.type_is_vehicle && <div className='detailItem area-div disable-text-copy' onClick={() => {
                        if(!isVehicleRentType) setIsVehicleRentType(true);
                    }} style={{ cursor: isVehicleRentType ? 'default' : undefined}}>
                        <h3>حدد نوع الايجار أو طبيعة استعمال المركبة</h3>
                        <InfoDiv title={'نوع الايجار'} value={vehicleRentType === '' ? 'غير محدد' : vehicleRentType}/>
                        {isVehicleRentType && <AddDetailsPopup array={vehicleRentType} setArray={setVehicleRentType} type={'carRentType'} sections={'selections'} 
                        isNotFacilities isSingleSelect setIsShow={setIsVehicleRentType} baseArr={vehicleRentTypesArray()}/>}
                        {detailsError.includes('rentType') && <p className='error2'>ادخال غير صالح, الرجاء الاختيار من أحد الخيارات</p>}
                    </div>}

                    {item.type_is_vehicle && <div className='detailItem vehicle-specs'>

                        <h2>حدد مواصفات السيارة</h2>

                        <div className='selection-div disable-text-copy' onClick={() => {
                            if(!isCarGearboxShow) setIsCarGearboxShow(true);
                        }} style={{ cursor: isCarGearboxShow ? 'default' : undefined}}>
                            <h3>حدد نوع ناقل الحركة Gearbox</h3>
                            <InfoDiv title={'نوع ناقل الحركة'} 
                            value={carGearbox === '' ? 'غير محدد' : carGearbox}/>
                            {isCarGearboxShow && <AddDetailsPopup array={carGearbox} setArray={setCarGearBox} type={'carGearBox'} sections={'selections'} 
                            isNotFacilities isSingleSelect setIsShow={setIsCarGearboxShow} baseArr={carGearboxes()}/>}
                            {detailsError.includes('carGearbox') && <p className='error2'>ادخال غير صالح الرجاء الاختيار من قائمة الخيارات</p>}
                        </div>

                        <div className='selection-div disable-text-copy' onClick={() => {
                            if(!isCarFuelTypeShow) setIsCarFuelTypeShow(true);
                        }} style={{ cursor: isCarFuelTypeShow ? 'default' : undefined}}> 
                            <h3>حدد نوع الوقود </h3>
                            <InfoDiv title={'نوع الوقود'} divClick={() => setIsCarFuelTypeShow(!isCarFuelTypeShow)} 
                            value={carFuelType === '' ? 'غير محدد' : carFuelType}/>
                            {isCarFuelTypeShow && <AddDetailsPopup array={carFuelType} setArray={setCarFuelType} type={'carFuelType'} sections={'selections'} 
                            isNotFacilities isSingleSelect setIsShow={setIsCarFuelTypeShow} baseArr={carFuelTypesArray()}/>}
                            {detailsError.includes('carFuelType') && <p className='error2'>ادخال غير صالح الرجاء الاختيار من قائمة الخيارات</p>}
                        </div>

                    </div>}

                    {getDetails().map((dtlObj) => (
                        !dtlObj.notAllowedCategories?.includes(specificCatagory) 
                        && <>{!dtlObj.isSelections ? 
                            <div className='detailItem'>
                                <h3>{dtlObj.name}</h3>
                                <ul className='detailItem-ul'>
                                    {dtlObj.array.map((obj, myIndex) => (
                                        <li key={myIndex}>
                                            {!dtlObj.isWithEN ? <CustomInputDiv placholderValue={obj} value={obj} deletable handleDelete={() => {
                                                let arr = [];
                                                for (let i = 0; i < dtlObj.array.length; i++) {
                                                    if(i !== myIndex){
                                                        arr.push(dtlObj.array[i]);
                                                    }
                                                }
                                                dtlObj.setArray(arr);
                                            }} 
                                            listener={(e) => {
                                                let arr = [...dtlObj.array];
                                                arr[myIndex] = e.target.value;
                                                dtlObj.setArray(arr);
                                            }}/> : <CustomInputDivWithEN placholderValue={'أضف تفصيلة بالعربي'} 
                                            enPlacholderValue={'أضف ترجمة التفصيلة بالانجليزي'}  deletable 
                                            handleDelete={() => {
                                                let arr = [];
                                                for (let i = 0; i < dtlObj.array.length; i++) {
                                                    if(i !== myIndex){
                                                        arr.push(dtlObj.array[i]);
                                                    }
                                                }
                                                dtlObj.setArray(arr);

                                                let enArr = [];
                                                for (let i = 0; i < dtlObj.detailsEN.length; i++) {
                                                    if(i !== myIndex){
                                                        enArr.push(dtlObj.detailsEN[i]);
                                                    }
                                                }
                                                dtlObj.setDetailsEN(enArr);
                                            }} 
                                            listener={(e) => {

                                                let arr = [...dtlObj.array];
                                                arr[myIndex] = e.target.value;
                                                dtlObj.setArray(arr);
                                                
                                                let enArr = dtlObj.detailsEN;
                                                enArr[myIndex] = { enName: enArr[myIndex]?.enName, arName: e.target.value };
                                                dtlObj.setDetailsEN(enArr);

                                            }} enListener={(e) => {
                                                let arr = dtlObj.detailsEN;
                                                arr[myIndex] = { enName: e.target.value, arName: arr[myIndex]?.arName};
                                                dtlObj.setDetailsEN(arr);
                                            }} isError={detailsError.includes(`${dtlObj.idName}.${myIndex}`)}
                                            errorText={'الرجاء كتابة تفصيلة, مع عدم استخدتم حروف غير صالحة مثل >, &, " ...الخ'}
                                            value={obj} enValue={dtlObj.detailsEN?.find(i=>i.arName === obj)?.enName}
                                            isProfileDetails />}
                                        </li>
                                    ))}
                                </ul>
                                <button style={{ marginTop: dtlObj.array.length <= 0 ? 'unset' : undefined }} onClick={
                                    () => {
                                        dtlObj.setArray([...dtlObj.array, '']);
                                        if(dtlObj.isWithEN) dtlObj.setDetailsEN([...dtlObj.detailsEN, { enName: '', arName: '' }]);
                                    }
                                } className={arabicFont}>{'أضف تفصيلة'}</button>
                            </div> : <div className='detailItem area-div dtl-sels-div disable-text-copy' onClick={() => {
                                if(!dtlObj.isShow) {
                                    dtlObj.setIsShow(true);
                                    setIsAddDetails(true);
                                };
                            }} style={{ cursor: dtlObj.isShow ? 'text' : 'pointer' }}>

                                {dtlObj.isShow && <AddDetailsPopup setIsShow={dtlObj.setIsShow} 
                                setArray={dtlObj.setArray} array={dtlObj.array}
                                accompany={dtlObj.accompany} setAccompany={dtlObj.setAccompany}
                                sections={getDtlItemSections(dtlObj.idName)} 
                                setIsAddDetails={setIsAddDetails} detailsError={detailsError}
                                type={dtlObj.idName} baseArr={dtlObj.selectArray || []} isVehicles={dtlObj.type_is_vehicle}/>}

                                <h3>{dtlObj.name}</h3>

                                {dtlObj.isNum && (dtlObj.array?.length > 0 ? dtlObj.array?.map((obj) => (
                                    <p className='dtl-array-p'>{getNames('one', false, false, dtlObj.idName)} {obj?.room_type} {obj?.capacity ? 'بسعة ' + obj?.capacity + ' شخص' : ''} {obj?.dim ? 'بعرض ' + obj?.dim?.y + ' متر و بطول ' + obj?.dim?.x + ' متر ' : ''} {obj?.single_beds ? ', ' + obj?.single_beds + ' سرير مفرد ' : ''} {obj?.double_beds ? ', ' + obj?.double_beds + ' سرير ماستر ' : ''} {obj?.depth ? ', و بعمق ' + obj?.depth + ' متر ' : ''}</p>
                                )) : <p className='dtl-array-p'>لم يتم اضافة {getNames('one', false, false, dtlObj.idName)} بعد</p>)}

                                {(dtlObj.idName !== 'rooms' && dtlObj.idName !== 'guest_rooms') && <InfoDiv 
                                title={`${dtlObj.idName === 'near_places' ? '' : 'مرافق'} ${getNames('one', true, false, dtlObj.idName)}`} myStyle={{ cursor: 'pointer' }}
                                divClick={() => dtlObj.setIsShow(!dtlObj.isShow)} 
                                value={dtlObj.accompany?.length <= 0 
                                    ? 'لم تتم اضافة أي مرفق' 
                                    : dtlObj.accompany?.toString()?.replaceAll(',', ', ')}/>}
                                
                                {detailsError.includes(` ${dtlObj.idName}`) && <p id='error'>يوجد خطأ بأحد البيانات , لا تستخدم حروف غير صالحة مثل &, {'>'}, " ...الخ</p>}
                            
                            </div>}</>
                    ))}

                </div>}

                {section === 5 && <div className='submitItem submit-edit'>

                    <div className='imagesToDelete' style={{ display: filesToDelete.length <= 0 && 'none' }}>
                        <label><Svgs name={'info'}/> سيتم حذف هذه الملفات نهائيا, لالغاء التحديد ارجع الى خانة الملفات.</label>
                        <ul>
                            {filesToDelete.map((file) => (
                                <li>
                                    {(file.split("").reverse().join("").split('.')[0] === 'gpj' || file.split("").reverse().join("").split('.')[0] === 'gnp')
                                    ? <Image src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${file}`} width={1200} height={1200}/>
                                    : <video autoPlay loop src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${file}`} />
                                    }
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='imagesToDelete' style={{ display: attachedFilesUrls.length <= 0 && 'none' }}>
                        <label><Svgs name={'info'}/> سيتم اضافة هذه الملفات الى العرض.</label>
                        <ul>
                            {attachedFilesUrls.map((attachedFile) => (
                                <li>
                                    {attachedFile.type.split('/')[0] === 'image'
                                    ? <Image src={URL.createObjectURL(attachedFile)} width={1200} height={1200}/>
                                    : <video autoPlay loop src={URL.createObjectURL(attachedFile)} />
                                    }
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='edits-info' style={{ display: !isSomethingChanged() ? 'none' : undefined }}>
                        سيتم تعديل بعض بيانات الوحدة
                        {/* {itemTitle !== item.title && <h4 style={{ marginTop: 24}}> العنوان: {itemTitle}</h4>}
                        {itemDesc !== item.description && <h4> الوصف: {itemDesc}</h4>}
                        {itemPrice !== item.price && <h4>السعر: {itemPrice}</h4>}
                        {conditionsAndTerms !== item.terms_and_conditions && <h4>الشروط و الأحكام: {conditionsAndTerms.toString()}</h4>}
                        {contactsIsChanged() && <h4>طرق التواصل</h4>} */}
                    </div>

                    <label id='error2' style={{ padding: error.length <= 0 && 0, margin: error.length <= 0 && 0 }}>{error}</label>
                    
                    <label id='success' style={{ padding: !success && 0, margin: !success && 0 }}>{success && 'تم التعديل بنجاح'}</label>
                    
                    <button className='submit-btn' onClick={handleSubmit}>{loading ? <LoadingCircle /> : 'تعديل'}</button>
                    
                </div>}

                <div className='section-div'>
                    <p style={!sectionError?.length > 0 ? {
                        display: 'none', padding: 0, margin: 0
                    } : undefined}>{sectionError} {(section === 1 && !sectionError.includes('خارج الأردن')) 
                        ? <button className={arabicFont} onClick={() => {
                            setSectionError('');
                            setSection(section >= 5 ? 5 : section + 1); 
                        }}>نعم</button>
                        : null}</p>
                    <button style={{ display: section <= 0 ? 'none' : undefined }}
                    className={'editDiv disable-text-copy ' + arabicFont} onClick={() => {
                        setSectionError('');
                        setSection(section > 0 ? section - 1 : 0);
                    }}>رجوع</button>
                    <button style={{ 
                        display: section >= 5 ? 'none' : undefined
                    }} className={'btnbackscndclr disable-text-copy ' + arabicFont} onClick={() => {
                        if(isTestSection()) setSection(section >= 5 ? 5 : section + 1);
                    }}>تقدم</button>
                </div>

            </div>

        </div>

    </div>
  )
};

const SuspenseWrapper = () => (
	<Suspense>
		<Page />
	</Suspense>
);

export default SuspenseWrapper;



{/* 

                    <div className='detailItem contacts-div'>
                        <h3>تعديل طرق تواصل</h3>
                        <p style={{ marginBottom: contactsError?.length > 0 ? null : 0 }} id='error'>{contactsError}</p>
                        <ul className='detailItem-ul'>
                        {contacts?.map((c, index) => (
                            <li key={index}>
                                <CustomInputDiv isError={contactsError?.length > 0 && !isValidContactURL(c)} errorText={'رابط غير صالح'} value={c.val?.length > 0 ? c.val : null} placholderValue={getInputPlaceHolder(c.platform)}
                                deletable handleDelete={() => {
                                    let arr = [];
                                    for (let i = 0; i < contacts.length; i++) {
                                        if(i !== index){
                                            arr.push(contacts[i]);
                                        }
                                    }
                                    setContacts(arr);
                                }}
                                listener={(e) => {
                                    let arr = [...contacts];
                                    arr[index] = { platform: arr[index].platform, val: e.target.value, isPlatforms: arr[index].isPlatforms };
                                    setContacts(arr);
                                }}/>
                                <div className='choose-platform' id={contactsError?.length > 0 && !isValidContactURL(c) && !c.platform?.length > 0 ? 'choose-platform-error' : ''}>
                                    <button className={c.isPlatforms ? 'editDiv rotate-edit-div' : 'editDiv'} onClick={() => {
                                        let arr = [...contacts];
                                        arr[index] = { platform: arr[index].platform, val: arr[index].val, isPlatforms: !arr[index].isPlatforms };
                                        for (let i = 0; i < contacts.length; i++) {
                                            if(i !== index){
                                                arr[i] =  { platform: arr[i].platform, val: arr[i].val, isPlatforms: false };
                                            }
                                        }
                                        setContacts(arr);
                                    }}>
                                        {c?.platform?.length > 0 ? c.platform : 'اختر منصة'} <Svgs name={'dropdown arrow'}/>
                                    </button>
                                    <ul style={{ display: c.isPlatforms ? null : 'none' }}>
                                        {contactsPlatforms.map((p) => (
                                            <li onClick={() => {
                                                let arr = [...contacts];
                                                arr[index] = { platform: p, val: arr[index].val, isPlatforms: false };
                                                setContacts(arr);
                                            }}>{p} {p === c.platform && <RightIconSpan />}</li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ))}
                        </ul>
                        <button className='btnbackscndclr' onClick={() => setContacts([...contacts, { platform: '', val: '', isPlatforms: false }])}>أضف المزيد</button>
                    </div>






*/}


