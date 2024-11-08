'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import './Add.scss';
import CatagoryCard from '@components/CatagoryCard';
import Image from 'next/image';
import GoogleMapImage from '@assets/images/google-map-image.jpg';
import VehicleImage from '@assets/images/sedan-car.png';
import PropertyImage from '@assets/images/property.png';
import PropertyWhiteImage from '@assets/images/property-white.png';
import { CustomerTypesArray, JordanCities, ProperitiesCatagories, VehicleCatagories, VehiclesTypes, cancellationsArray, carFuelTypesArray, carGearboxes, contactsPlatforms, currencyCode, getContactPlaceHolder, getNames, isInsideJordan, reservationType, vehicleRentTypesArray } from '@utils/Data';
import CustomInputDiv from '@components/CustomInputDiv';
import { createProperty, uploadFiles } from '@utils/api';
import HeaderPopup from '@components/popups/HeaderPopup';
import { getOptimizedAttachedFiles, isValidContactURL, isValidNumber, isValidText } from '@utils/Logic';
import { Context } from '@utils/Context';
import NotFound from '@components/NotFound';
import MySkeleton from '@components/MySkeleton';
import Svgs from '@utils/Svgs';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Facilities, bathroomFacilities, customersTypesArray, facilities, kitchenFacilities, nearPlacesNames, poolType, studentsTypesArray } from '@utils/Facilities';
import InfoDiv from '@components/InfoDiv';
import CustomInputDivWithEN from '@components/CustomInputDivWithEN';
import LoadingCircle from '@components/LoadingCircle';
import { getUserLocation } from '@utils/ServerComponents';
import AddDetailsPopup from '@components/popups/AddDetailsPopup';
import axios from 'axios';

const page = () => {

    const { 
        userId, setIsMap, setMapType,
        latitude, setLatitude, storageKey,
        longitude, setLongitude, userEmail,
        loadingUserInfo, isVerified, 
        userAccountType, setIsModalOpened,
        arabicFont, triggerUserInfo, setTriggerUserInfo
    } = useContext(Context);

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/avi'];
    const inputFilesRef = useRef();
    const attachImagesDivRef = useRef();
    const [fetching, setFetching] = useState(true);

    const [selectedCatagories, setSelectedCatagories] = useState('1');
    const [error, setError] = useState('');
    const [cityPopup, setCityPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [mapUsed, setMapUsed] = useState(false);
    const [triggerSectionError, setTriggerSectionError] = useState(false);

    const [section, setSection] = useState(0);
    const [sectionError, setSectionError] = useState('');
    const [freeSection, setFreeSection] = useState(false);

    const [expandPrices, setExpandPrices] = useState(false);
    const [pricesError, setPricesError] = useState([]);

    const [customerType, setCustomerType] = useState([]);
    const [isCustomerType, setIsCustomerType] = useState(false);
    const [capacity, setCapacity] = useState(0);

    const [specificCatagory, setSpecificCatagory] = useState('-1');
    const [vehicleType, setVehicleType] = useState('');
    const [itemTitle, setItemTitle] = useState('');
    const [itemTitleEN, setItemTitleEN] = useState('');
    const [itemDesc, setItemDesc] = useState('');
    const [itemDescEN, setItemDescEN] = useState('');
    const [itemCity, setItemCity] = useState(null);
    const [area, setArea] = useState(0);
    const [landArea, setLandArea] = useState(0);
    const [floor, setFloor] = useState('');
    const [itemNeighbour, setItemNeighbour] = useState('');
    const [itemNeighbourEN, setItemNeighbourEN] = useState('');
    const [itemPrice, setItemPrice] = useState(0);
    const [itemPrices, setItemPrices] = useState(null);
    const [requireInsurance, setRequireInsurance] = useState(false);
    const [withDriver, setWithDriver] = useState(false);
    const [attachedFilesUrls, setAttachedFilesUrls] = useState([]);
    const [itemLong, setItemLong] = useState(null);
    const [itemLat, setItemLat] = useState(null);
    
    const [locObj, setLocObj] = useState(null);
    const [fetchingLocation, setFetchingLocation] = useState(false);
    const [isUserLoc, setIsUserLoc] = useState('');
    const [isManualLocSet, setIsManualLocSet] = useState(false);

    const [contacts, setContacts] = useState([]);
    const [contactsError, setContactsError] = useState('');

    const [guestRoomsDetailArray, setGuestRoomsDetailArray] = useState([]);
    const [companionsDetailArray, setCompanionsDetailArray] = useState([]);
    const [bathroomsDetailArray, setBathroomsDetailArray] = useState([]);
    const [kitchenDetailArray, setKitchenDetailArray] = useState([]);
    const [roomsDetailArray, setRoomsDetailArray] = useState([]);
    const [poolsDetailArray, setPoolsDetailArray] = useState([]);
    const [nearPlaces, setNearPlaces] = useState([]);
    const [cancellation, setCancellation] = useState('');
    const [isCancellation, setIsCancellation] = useState(false);
    const [vehicleRentType, setVehicleRentType] = useState('');
    const [isVehicleRentType, setIsVehicleRentType] = useState(false);

    const [bathroomsAccompany, setBathroomsAccompany] = useState([]);
    const [kitchenAccompany, setKitchenAccompany] = useState([]);
    const [poolAccompany, setPoolAccompany] = useState([]);

    const [conditionsAndTerms, setConditionsAndTerms] = useState([]);
    const [conditionsAndTermsEN, setConditionsAndTermsEN] = useState([]);
    const [vehicleSpecifications, setVehicleSpecifications] = useState([]);

    const [guestRoomsDetailArrayEN, setGuestRoomsDetailArrayEN] = useState([]);
    const [vehicleSpecificationsEN, setVehicleSpecificationsEN] = useState([]);
    const [vehicleFeaturesEN, setVehicleFeaturesEN] = useState([]);

    const [vehicleFeatures, setVehicleFeatures] = useState([]);
    const [carCompany, setCarCompany] = useState('');
    const [carModel, setCarModel] = useState('');
    const [carYear, setCarYear] = useState('');
    const [carColor, setCarColor] = useState('');
    const [carGearbox, setCarGearBox] = useState('');
    const [carFuelType, setCarFuelType] = useState('');
    const [isCarGearboxShow, setIsCarGearboxShow] = useState(false);
    const [isCarFuelTypeShow, setIsCarFuelTypeShow] = useState('');

    const [isAddDetails, setIsAddDetails] = useState(false);

    const { executeRecaptcha } = useGoogleReCaptcha();

    const getRecaptchaToken = async() => {
      if (!executeRecaptcha) return;
      const gReCaptchaToken = await executeRecaptcha('submit');
      return gReCaptchaToken;
    };

    const roomsSelections = [];

    const [companiansShow, setCompaniansShow] = useState(false);
    const [bathroomsShow, setBathroomsShow] = useState(false);
    const [kitchenShow, setKitchenShow] = useState(false);
    const [guestRoomsShow, setGuestRoomsShow] = useState(false);
    const [bedroomsShow, setBedroomsShow] = useState(false);
    const [poolsShow, setPoolsShow] = useState(false);
    const [nearPlacesShow, setNearPlacesShow] = useState(false);
    const [detailsError, setDetailsError] = useState('');

    const [sectionTitle, setSectionTitle] = useState('');
   
    const sectionsArray = [
        { id: 0, name: 'عقار أم سيارة' },
        { id: 1, name: 'المعلومات الأساسية' },
        { id: 2, name: 'الموقع الجغرافي' },
        { id: 3, name: 'السعر' },
        { id: 4, name: 'اختيار صور و فيديوهات' },
        { id: 5, name: 'تفاصيل دقيقة' },
        { id: 6, name: 'الارسال' }
    ];

    const details = [
        {idName: 'guest_rooms', notAllowedCategories: ['students'], isNum: true, name: 'غرف الضيوف و المجالس',  isSelections: true, array: guestRoomsDetailArray, setArray: setGuestRoomsDetailArray, baseArr: [], isShow: guestRoomsShow, setIsShow: setGuestRoomsShow},
        {idName: 'bathrooms', notAllowedCategories: ['students'], name: 'دورات المياه', isNum: true, isDimension: true, isSelections: true, isShow: bathroomsShow, setIsShow: setBathroomsShow, selectArray: bathroomFacilities(), array: bathroomsDetailArray, setArray: setBathroomsDetailArray, accompany: bathroomsAccompany, setAccompany: setBathroomsAccompany },
        {idName: 'kitchen', notAllowedCategories: ['students'], name: 'المطبخ', isNum: true, isDimension: true, isSelections: true, selectArray: kitchenFacilities(), isShow: kitchenShow, setIsShow: setKitchenShow, array: kitchenDetailArray, setArray: setKitchenDetailArray, accompany: kitchenAccompany, setAccompany: setKitchenAccompany},
        {idName: 'rooms', name: 'غرف النوم و الأسرّة', isNum: true, isSelections: true, isShow: bedroomsShow, setIsShow: setBedroomsShow, selectArray: roomsSelections, array: roomsDetailArray, setArray: setRoomsDetailArray},
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
        if(selectedCatagories === '0'){
            return vehiclesDetails;
        } else {
            return details;
        }
    };

    const getCatagoryArray = () => {
        if(selectedCatagories === '0'){
            return VehiclesTypes;
        } else {
            return ProperitiesCatagories;
        }
    };

    const isValidPrices = () => {

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

        try {

            setLoading(true);

            const optimizedFiles = await getOptimizedAttachedFiles(attachedFilesUrls);

            setAttachedFilesUrls(optimizedFiles.optArr);

            //attached file, atleast one
            if(optimizedFiles.optArr.length <= 0){
                setError('أضف صور و فيديوهات تعبر عن المعروض.');
                setSuccess(false);
                setLoading(false);
                return;
            }

            /*  create property or vehicle instance then 
                upload images with the id of the created instance  */

            const xDetails = selectedCatagories === '0' ? {
                insurance:  requireInsurance, 
                vehicle_specifications: {
                    driver: withDriver, rent_type: vehicleRentTypesArray(true)[vehicleRentTypesArray().indexOf(vehicleRentType)],
                    company: carCompany, model: carModel, color: carColor,
                    year: carYear, gearbox: carGearboxes(true)[carGearboxes().indexOf(carGearbox)], fuel_type: carFuelTypesArray(true)[carFuelTypesArray().indexOf(carFuelType)]
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

            let enObj = {
                english_details: []
            };

            const getEnglishBaseArray = () => {
                if(selectedCatagories === '0'){
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
            let enCST = [];
            for (let i = 0; i < customerType?.length; i++) {
                if(customersTypesArray().includes(customerType[i])){
                    customersTypesArray().forEach((el, index) => {
                        if(el === customerType[i]){
                            enCST.push(customersTypesArray(true)[index]);
                        }
                    });
                }
            }
            if(enCST?.length > 0) enObj.customerTypeEN = enCST;

            let tempContacts = [];

            contacts.forEach((item) => {
                tempContacts.push({
                    platform: item.platform, val: item.val
                });
            });

            const token = await getRecaptchaToken();

            console.log('storage key before: ', storageKey);
            
            const res = await createProperty( 
                selectedCatagories === '0' ? true : false, 
                specificCatagory, itemTitle, itemDesc, 
                itemCity.value, itemNeighbour, [itemLong, itemLat], itemPrice, 
                xDetails, conditionsAndTerms, area > 0 ? area : null,
                tempContacts?.length > 0 ? tempContacts : null, null, token, 
                capacity, customerType, enObj, cancellationsArray().indexOf(cancellation),
                VehiclesTypes.find(i => i.value === vehicleType)?.id,
                itemPrices, landArea, floor);

            if(res.success !== true){
                setError(res.dt.toString());
                setLoading(false);
                setSuccess(false);
                return;
            }

            const uploadFilesRes = await uploadFiles(
                optimizedFiles.optArr, res.dt.id, storageKey, userEmail
            );

            console.log('upload res: ', uploadFilesRes);

            setTriggerUserInfo(!triggerUserInfo);

            console.log('storage key after: ', storageKey);

            if(uploadFilesRes.success !== true){
                setError(uploadFilesRes.dt.toString());
                setLoading(false);
                setSuccess(false);
                return;
            };

            setSuccess(true);
            setError('');
            setLoading(false);
            
        } catch (err) {
            setError(err.message);
            setLoading(false);
            setSuccess(false);
        }

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
            case 'eventsPrice':
              return itemPrices?.eventsPrice;
            case 'thursdayPrice':
              return itemPrices?.thursdayPrice;
            case 'fridayPrice':
              return itemPrices?.fridayPrice;
            case 'saturdayPrice':
              return itemPrices?.saturdayPrice;
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
                    eventsPrice: itemPrices?.eventsPrice,
                    thursdayPrice: itemPrices?.thursdayPrice,
                    fridayPrice: itemPrices?.fridayPrice,
                    saturdayPrice: itemPrices?.saturdayPrice
                });
            case 'Weekly':
                return setItemPrices({
                    daily: itemPrices?.daily,
                    weekly: Number(e.target.value),
                    monthly: itemPrices?.monthly,
                    seasonly: itemPrices?.seasonly,
                    yearly: itemPrices?.yearly,
                    eventsPrice: itemPrices?.eventsPrice,
                    thursdayPrice: itemPrices?.thursdayPrice,
                    fridayPrice: itemPrices?.fridayPrice,
                    saturdayPrice: itemPrices?.saturdayPrice
                });
            case 'Monthly':
                return setItemPrices({
                    daily: itemPrices?.daily,
                    weekly: itemPrices?.weekly,
                    monthly: Number(e.target.value),
                    seasonly: itemPrices?.seasonly,
                    yearly: itemPrices?.yearly,
                    eventsPrice: itemPrices?.eventsPrice,
                    thursdayPrice: itemPrices?.thursdayPrice,
                    fridayPrice: itemPrices?.fridayPrice,
                    saturdayPrice: itemPrices?.saturdayPrice
                });
            case 'Seasonly':
                return setItemPrices({
                    daily: itemPrices?.daily,
                    weekly: itemPrices?.weekly,
                    monthly: itemPrices?.monthly,
                    seasonly: Number(e.target.value),
                    yearly: itemPrices?.yearly,
                    eventsPrice: itemPrices?.eventsPrice,
                    thursdayPrice: itemPrices?.thursdayPrice,
                    fridayPrice: itemPrices?.fridayPrice,
                    saturdayPrice: itemPrices?.saturdayPrice
                });
            case 'Yearly':
                return setItemPrices({
                    daily: itemPrices?.daily,
                    weekly: itemPrices?.weekly,
                    monthly: itemPrices?.monthly,
                    seasonly: itemPrices?.seasonly,
                    yearly: Number(e.target.value),
                    eventsPrice: itemPrices?.eventsPrice,
                    thursdayPrice: itemPrices?.thursdayPrice,
                    fridayPrice: itemPrices?.fridayPrice,
                    saturdayPrice: itemPrices?.saturdayPrice
                });
            case 'eventsPrice':
                return setItemPrices({
                    daily: itemPrices?.daily,
                    weekly: itemPrices?.weekly,
                    monthly: itemPrices?.monthly,
                    seasonly: itemPrices?.seasonly,
                    yearly: itemPrices?.yearly,
                    eventsPrice: Number(e.target.value),
                    thursdayPrice: itemPrices?.thursdayPrice,
                    fridayPrice: itemPrices?.fridayPrice,
                    saturdayPrice: itemPrices?.saturdayPrice
                });
            case 'thursdayPrice':
                return setItemPrices({
                    daily: itemPrices?.daily,
                    weekly: itemPrices?.weekly,
                    monthly: itemPrices?.monthly,
                    seasonly: itemPrices?.seasonly,
                    yearly: itemPrices?.yearly,
                    eventsPrice: itemPrices?.eventsPrice,
                    thursdayPrice: Number(e.target.value),
                    fridayPrice: itemPrices?.fridayPrice,
                    saturdayPrice: itemPrices?.saturdayPrice
                });
            case 'fridayPrice':
                return setItemPrices({
                    daily: itemPrices?.daily,
                    weekly: itemPrices?.weekly,
                    monthly: itemPrices?.monthly,
                    seasonly: itemPrices?.seasonly,
                    yearly: itemPrices?.yearly,
                    eventsPrice: itemPrices?.eventsPrice,
                    thursdayPrice: itemPrices?.thursdayPrice,
                    fridayPrice: Number(e.target.value),
                    saturdayPrice: itemPrices?.saturdayPrice
                });
            case 'saturdayPrice':
                return setItemPrices({
                    daily: itemPrices?.daily,
                    weekly: itemPrices?.weekly,
                    monthly: itemPrices?.monthly,
                    seasonly: itemPrices?.seasonly,
                    yearly: itemPrices?.yearly,
                    eventsPrice: itemPrices?.eventsPrice,
                    thursdayPrice: itemPrices?.thursdayPrice,
                    fridayPrice: itemPrices?.fridayPrice,
                    saturdayPrice: Number(e.target.value)
                });
        };
    };

    const showMap = () => {      
        setMapUsed(true);
        setMapType('select-point');
        setIsMap(true);
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

    const isTestSection = (testAllUntilThis) => {

        setSectionError('');

        const testSec1 = () => {

            console.log('test1');

            let errorEncountered = false;

            if(selectedCatagories === '1' && !ProperitiesCatagories.find(i => i.value === specificCatagory)){
                setSpecificCatagory('-2');
                errorEncountered = true;
            } else if(selectedCatagories === '0' && (!VehiclesTypes.find(i => i.value === vehicleType) || specificCatagory !== 'transports')){
                setSpecificCatagory('-2');
                setVehicleType('');
                errorEncountered = true;
            }

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

            
            console.log('test2');

            if(latitude === itemCity?.lat && longitude === itemCity?.long) {
                setSectionError('لم تقم بتحديد موقع جغرافي للعقار, التقدم على أي حال ؟');
                return false;
            } else if(!isInsideJordan(itemLong, itemLat)){
                setSectionError('الموقع خارج الأردن, الرجاء تحديد موقع صالح على الخريطة');
                return false;
            };
            setSectionError('');
            return true;
        };

        const testSec3 = () => {
            
            console.log('test3');

            if(!isValidPrices()) {
                setSectionError('حدد اسعار للعقار');
                return false;
            } else {
                setSectionError('');
                return true;
            }
        };

        const testSec4 = () => {

            console.log('test4: ', attachedFilesUrls);

            const isNotSupported = () => {
                for (let i = 0; i < attachedFilesUrls.length; i++) {
                    const element = attachedFilesUrls[i];
                    const dotsArr = element?.name?.split('.');
                    const extension = dotsArr[dotsArr?.length - 1];
                    if(extension !== 'jpg' && extension !== 'png' && extension !== 'mp4' && extension !== 'avi')
                        return true;
                };
                return false;
            };

            if(attachedFilesUrls?.length <= 0){
                setSectionError('أضف صور و فيديوهات تعبر عن ' + (selectedCatagories === '0' ? 'السيارة' : 'العقار'));
                return false;
            } else if(isNotSupported()){
                setSectionError('اصدار الملف غير مدعوم');
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
                setCancellation('-1');
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

            if(customerType?.length > 0){
                for (let i = 0; i < customerType.length; i++) {
                    if(!(specificCatagory === 'students' ? studentsTypesArray() : customersTypesArray()).includes(customerType[i])) {
                        setCustomerType('-1');
                        detailsErrorMsg = detailsErrorMsg + ' customerType ';
                        errorEncountered = true;
                    }
                }
            }
    
            if(typeof withDriver !== 'boolean'){
                detailsErrorMsg = detailsErrorMsg + ' withDriver ';
                errorEncountered = true;
            }

            if(carCompany && !isValidText(carCompany)){ 
                detailsErrorMsg = detailsErrorMsg + ' carCompany '; 
                errorEncountered = true; 
            }

            if(carModel && !isValidText(carModel)){ 
                detailsErrorMsg = detailsErrorMsg + ' carModel '; 
                errorEncountered = true; 
            }

            if(carYear && !isValidNumber(carYear)){ 
                detailsErrorMsg = detailsErrorMsg + ' carYear '; 
                errorEncountered = true; 
            }

            if(carColor && !isValidText(carColor)){ 
                detailsErrorMsg = detailsErrorMsg + ' carColor '; 
                errorEncountered = true; 
            }

            if(vehicleRentType && (!isValidText(vehicleRentType) || !vehicleRentTypesArray().includes(vehicleRentType))) {
                detailsErrorMsg = detailsErrorMsg + ' rentType ';
                errorEncountered = true;
            }

            if(carGearbox && (!isValidText(carGearbox) || !carGearboxes().includes(carGearbox))) {
                detailsErrorMsg = detailsErrorMsg + ' carGearbox ';
                errorEncountered = true;
            }

            if(carFuelType && (!isValidText(carFuelType) || !carFuelTypesArray().includes(carFuelType))) {
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

        if(testAllUntilThis >= 0){
            if(testAllUntilThis <= section) return true;
            let errorEncounteredIndex = -1;
            for (let i = section; i < testAllUntilThis; i++) {
                console.log('i is: ', i);
                if(i === 1) 
                    if(!testSec1()) errorEncounteredIndex = i;
                // if(i === 2) 
                //     if(!testSec2()) errorEncounteredIndex = i;
                if(i === 3) 
                    if(!testSec3()) errorEncounteredIndex = i;
                if(i === 4) 
                    if(!testSec4()) errorEncounteredIndex = i;
                if(i === 5) 
                    if(!testSec5()) errorEncounteredIndex = i;
            }
            if(errorEncounteredIndex !== -1) setSectionError('لا يمكن التنقل عن طريق رقم القسم نسبة لوجود خطأ في قسم رقم ' + errorEncounteredIndex + ' "' + sectionsArray.find(i => i.id === errorEncounteredIndex)?.name + '"');
            return errorEncounteredIndex === -1;
        } else {
            if(section === 1) return testSec1();
            if(section === 2) return testSec2();
            if(section === 3) return testSec3();
            if(section === 4) return testSec4();
            if(section === 5) return testSec5();
        }

        return true;

    };

    useEffect(() => {

        window.addEventListener('beforeunload', function(e){
            e.preventDefault();
            event.returnValue = true;
            return true;
        });

        return window.removeEventListener('beforeunload', function(e){
            e.preventDefault();
            event.returnValue = true;
            return true;
        });

    }, []);

    useEffect(() => {
        setSpecificCatagory('-1');
    }, [selectedCatagories]);

    useEffect(() => {
        if(mapUsed === true){
            setItemLong(longitude);
            setItemLat(latitude);
        }
    }, [longitude, latitude]);

    useEffect(() => {
        setMapUsed(false);
    }, [itemCity]);

    useEffect(() => {
        setSectionError('');
    }, [
        itemTitleEN, itemDescEN, 
        triggerSectionError,
        itemPrices, attachedFilesUrls,
        locObj,
        vehicleFeatures,
        carCompany,
        carModel,
        carYear,
        carColor,
        carGearbox,
        carFuelType,
        contacts,
        guestRoomsDetailArray,
        companionsDetailArray,
        bathroomsDetailArray,
        kitchenDetailArray,
        roomsDetailArray,
        poolsDetailArray,
        nearPlaces,
        cancellation,
        vehicleRentType,
        bathroomsAccompany,
        kitchenAccompany,
        poolAccompany,
        conditionsAndTerms,
        conditionsAndTermsEN,
        vehicleSpecifications,
        guestRoomsDetailArrayEN,
        vehicleSpecificationsEN,
        vehicleFeaturesEN,
    ]);

    useEffect(() => {
        if(!loadingUserInfo && userId?.length > 0) setFetching(false);
    }, [userId]);

    useEffect(() => {
        setSuccess(false);
        setError('');
        setSectionTitle(sectionsArray.find(i => i.id === section)?.name);
        if(section === 6) setFreeSection(true);
    }, [section]);

    useEffect(() => {
        console.log('isCancellation: ', isCancellation);
        if(isAddDetails || cityPopup || isCancellation || isCustomerType || isCarGearboxShow || isCarFuelTypeShow) 
            return setIsModalOpened(true);
        setIsModalOpened(false);
    }, [isAddDetails, cityPopup, isCancellation, isCustomerType, isCarGearboxShow, isCarFuelTypeShow,]);

    const RightIconSpan = () => {
        return <span id='righticonspan'/>
    }

    // if(!userId?.length > 0 || !isVerified || userAccountType !== 'host'){
    //     return (
    //         fetching ? <MySkeleton isMobileHeader={true}/> : <NotFound navToVerify={!isVerified} type={'not allowed'}/>
    //     )
    // }

  return (
    <div className='add'>

        <span id='closePopups' onClick={() => {
            setCityPopup(false); setIsCustomerType(false); setCompaniansShow(false); setBathroomsShow(false); setKitchenShow(false);
            setPoolsShow(false); setIsCancellation(false); setIsCarGearboxShow(false); setIsCarFuelTypeShow(false);
        }} style={{ display: (!cityPopup && !isCustomerType && !companiansShow && !bathroomsShow && !isCancellation
            && !kitchenShow && !poolsShow && !isCarFuelTypeShow && !isCarGearboxShow) ? 'none' : undefined }}/>

        <div className='wrapper'>

            <div className='sections-show'>
                <ul>
                    {sectionsArray.map((sec) => (
                        <li className={section >= sec.id ? 'section-selected disable-text-copy' : undefined}>
                            <strong style={{ cursor: section >= sec.id ? undefined : (freeSection ? undefined : 'default') }} 
                            onClick={() => {
                                if(!freeSection) setSection(section > sec.id ? sec.id : section);
                                else if(isTestSection(sec.id)) setSection(sec.id);
                            }} className='disable-text-copy'>
                                {sec.id + 1}
                            </strong>
                            {sec.id < 6 && <span style={{ background: section > sec.id ? undefined : 'var(--darkWhite)' }}/>}
                        </li>
                    ))}
                </ul>
                <p>{sectionTitle}</p>
            </div>

            {section === 0 && <><h2 style={{ fontWeight: 400 }}>ما الذي تريد عرضه للإِيجار</h2>

            <div className='selectCatagory' style={{ width: '100%' }}>

                <CatagoryCard type={'add'} image={VehicleImage} title={'سيارة'} catagoryId={'0'} selectedCatagories={selectedCatagories} setSelectedCatagories={setSelectedCatagories}/>
                
                <CatagoryCard type={'add'} image={selectedCatagories !== '1' ? PropertyImage : PropertyWhiteImage} title={'عقار'} catagoryId={'1'} selectedCatagories={selectedCatagories} setSelectedCatagories={setSelectedCatagories}/>

            </div></>}

            {section === 1 && <>
            
                <div className='selectKind'>
                    <select className={arabicFont} value={selectedCatagories === '0' ? vehicleType : specificCatagory} onChange={(e) => {
                        setSpecificCatagory(selectedCatagories === '0' ? 'transports' : e.target.value);
                        if(selectedCatagories === '0') setVehicleType(e.target.value);
                        else setCustomerType('');
                    }}>
                        <option value={'-1'} hidden selected>{selectedCatagories === '0' ? 'اختر تصنيف السيارة' : 'اختر تصنيف العقار'}</option>
                        {getCatagoryArray().map((item) => (
                            <option key={item.id} value={item.value}>{item.arabicName}</option>
                        ))}
                    </select>
                    <label id='error'>{specificCatagory === '-2' && 'الرجاء تحديد تصنيف'}</label>
                </div>

                <CustomInputDivWithEN value={itemTitle === '-1' ? null : itemTitle} 
                isError={itemTitle === '-1'} 
                errorText={'الرجاء كتابة عنوان صالح, مع عدم استخدام حروف غير صالحة مثل <, &, " ...الخ'} 
                title={'العنوان بالعربية و الانجليزية'} placholderValue={'اكتب العنوان باللغة العربية هنا'} 
                enPlacholderValue={'اكتب العنوان باللغة الانجليزية هنا'} 
                listener={(e) => { setItemTitle(e.target.value); setTriggerSectionError(!triggerSectionError); }} 
                enValue={itemTitleEN}
                enListener={(e) => setItemTitleEN(e.target.value)} isProfileDetails/>

                <CustomInputDivWithEN isError={itemDesc === '-1'} 
                errorText={'الرجاء كتابة وصف واضح عن ما تريد عرضه, مع عدم استخدام حروف غير صالحة مثل <, &, " ...الخ.'} 
                title={'ادخل الوصف بالعربية و الانجليزية'} isTextArea={true} 
                placholderValue={'اكتب الوصف باللغة العربية هنا'}
                value={itemDesc === '-1' ? null : itemDesc} enValue={itemDescEN} 
                enPlacholderValue={'اكتب الوصف باللغة الانجليزية هنا'} 
                listener={(e) => { setItemDesc(e.target.value); setTriggerSectionError(!triggerSectionError); }} isProfileDetails
                enListener={(e) => setItemDescEN(e.target.value)} type={'text'}/>
                
                <div className='address' style={{ zIndex: cityPopup ? 11 : 0 }}>
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
                </div></>}

            {section === 2 && <div className='location-div disable-text-copy'>
                
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

            {section === 3 && <div className='prices'>
                
                <h3>تحديد السعر</h3>

                <p>قم بتحديد سعر لكل مدة حجز {'(يومي, اسبوعي, شهري, فصلي و سنوي)'}</p>

                {(expandPrices ? reservationType() : [reservationType()[0]]).map((item) => (
                        <div className='priceDiv'>
                        {item?.id !== 3 ? <><CustomInputDiv isError={pricesError.includes(item.enName?.toLowerCase())} 
                            errorText={'حدد سعر'} 
                            title={`السعر بال${currencyCode(false, true)}`} 
                            listener={(e) => handlePriceChange(e, item.enName)} min={0} value={getPriceValue(item.enName)}
                            type={'number'}/>
                        <strong>/</strong>
                        <h4>{item.oneAr}</h4></>
                        : specificCatagory === 'students' && <><CustomInputDiv isError={pricesError.includes(item.enName?.toLowerCase())} 
                            errorText={'حدد سعر'} 
                            title={`السعر بال${currencyCode(false, true)}`} 
                            listener={(e) => handlePriceChange(e, item.enName)} min={0} value={getPriceValue(item.enName)}
                            type={'number'}/>
                        <strong>/</strong>
                        <h4>{item.oneAr}</h4></>}
                    </div>
                ))}

                <button className={'editDiv ' + arabicFont} onClick={() => setExpandPrices(!expandPrices)}>{expandPrices ? 'أقل' : 'تمديد'}</button>

                <hr />
                
                <h3>تحديد سعر خاص بأيام العطل</h3>

                <p>قم بتحديد سعر خاص لكل يوم من أيام العطل {'(خميس, جمعة و سبت)'}</p>

                <div className='priceDiv'>
                    <CustomInputDiv isError={pricesError.includes('thursdayPrice')} 
                    errorText={'سعر يوم الخميس'} 
                    title={`السعر بال${currencyCode(false, true)}`} 
                    listener={(e) => handlePriceChange(e, 'thursdayPrice')} 
                    min={0} value={getPriceValue('thursdayPrice')}
                    type={'number'}/>
                    <strong>/</strong>
                    <h4>{'الخميس'}</h4>
                </div>

                <div className='priceDiv'>
                    <CustomInputDiv isError={pricesError.includes('fridayPrice')} 
                    errorText={'سعر يوم الجمعة'} 
                    title={`السعر بال${currencyCode(false, true)}`} 
                    listener={(e) => handlePriceChange(e, 'fridayPrice')} 
                    min={0} value={getPriceValue('fridayPrice')}
                    type={'number'}/>
                    <strong>/</strong>
                    <h4>{'الجمعة'}</h4>
                </div>

                <div className='priceDiv'>
                    <CustomInputDiv isError={pricesError.includes('saturdayPrice')} 
                    errorText={'سعر يوم السبت'} 
                    title={`السعر بال${currencyCode(false, true)}`} 
                    listener={(e) => handlePriceChange(e, 'saturdayPrice')} 
                    min={0} value={getPriceValue('saturdayPrice')}
                    type={'number'}/>
                    <strong>/</strong>
                    <h4>{'السبت'}</h4>
                </div>

                {specificCatagory === 'farm' && <><hr />
                
                    <h3>تحديد سعر مناسبات خاص</h3>

                    <p>قم بتحديد سعر للمناسبة الواحدة</p>

                    <div className='priceDiv'>
                        <CustomInputDiv isError={pricesError.includes('eventsPrice')} 
                        errorText={'حدد سعر'} 
                        title={`السعر بال${currencyCode(false, true)}`} 
                        listener={(e) => handlePriceChange(e, 'eventsPrice')} 
                        min={0} value={getPriceValue('eventsPrice')}
                        type={'number'}/>
                        <strong>/</strong>
                        <h4>{'المناسبة'}</h4>
                    </div>

                </>}

            </div>}

            {section === 4 && <div className='attachFiles' ref={attachImagesDivRef}>

                <button className={arabicFont} onClick={() => inputFilesRef.current.click()}>اختيار ملف</button>

                <ul style={{ gridTemplateColumns: attachedFilesUrls.length <= 0 && '1fr' }}>
                    {attachedFilesUrls.map((attachedFile) => (
                        <li onClick={() => {
                            setAttachedFilesUrls(attachedFilesUrls.filter(f => f?.name !== attachedFile?.name))
                        }}>
                            {attachedFile.type.split('/')[0] === 'image'
                            ? <Image src={URL.createObjectURL(attachedFile)} width={100} height={100}/>
                            : <video autoPlay loop src={URL.createObjectURL(attachedFile)}/>
                            }
                        </li>
                    ))}
                    <li id='chooseFileLastLi' className='disable-text-copy'
                        onClick={() => inputFilesRef.current.click()}
                    >{attachedFilesUrls.length > 0 ? 'أضف المزيد' : `اختر صور وفيدوهات لل${selectedCatagories === '0' ? 'سيارة' : 'عقار'}`}<p>(يجب أن يكون نوع الملف PNG أو JPG أو MP4 أو AVI)</p></li>
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

            {section === 5 && <div className='detailsAboutItem'>

                <h2>أضف تفاصيل عن ال{selectedCatagories === '0' ? 'سيارة' : 'عقار'}</h2>

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
                    type={'cancellation'} sections={'selections'} isSingleSelect 
                    setIsShow={setIsCancellation} baseArr={cancellationsArray()} isNotFacilities/>}
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
                
                {(selectedCatagories === '1' && specificCatagory !== 'students') && <div className='detailItem area-div' style={{ display: selectedCatagories === '0' ? 'none' : null}}>
                    <h3>اكتب أقصى سعة أو عدد نزلاء متاح بالعقار</h3>
                    <CustomInputDiv title={capacity > 0 ? `${capacity} نزيل` : ''} max={150000} min={-1} myStyle={{ marginBottom: 0 }} 
                    placholderValue={'كم نزيل مسموح بالعقار؟'} type={'number'} isError={detailsError?.includes('capacity')} errorText={'الرجاء ادخال عدد من صفر الى 150000'} listener={(e) => {
                        if(Number(e.target.value)) {
                            setCapacity(Number(e.target.value))
                        } else {
                            setCapacity(0);
                        };
                    }}/>
                </div>}

                {(selectedCatagories === '1' && specificCatagory !== 'students') && <div className='detailItem area-div' style={{ display: (selectedCatagories === '0') ? 'none' : null}}>
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

                {(selectedCatagories === '1' && specificCatagory === 'farm') && <div className='detailItem area-div'>
                    <h3>اكتب مساحة أرض المزرعة أو الشاليه</h3>
                    <CustomInputDiv title={landArea || 'مساحة الأرض'} 
                    max={1000000} min={0} myStyle={{ marginBottom: 0 }} 
                    placholderValue={'مثال: 2 فدان أو 500 متر'} 
                    isError={detailsError.includes('landArea')} 
                    errorText={'الرجاء ادخال مساحة صالحة'} 
                    listener={(e) => setLandArea(e.target.value)}
                    value={landArea}/>
                </div>}

                {(selectedCatagories === '1' && specificCatagory === 'apartment') && <div className='detailItem area-div' style={{ display: (selectedCatagories === '0') ? 'none' : null}}>
                    <h3>اكتب رقم الطابق</h3>
                    <CustomInputDiv title={'الطابق ' + floor} max={1000000} min={0} myStyle={{ marginBottom: 0 }} 
                    placholderValue={'مثل: 7 أو 8'}  isError={detailsError.includes('floor')} 
                    errorText={'الرجاء ادخال رقم طابق صالح'} 
                    listener={(e) => setFloor(e.target.value)} value={floor}/>
                </div>}

                {selectedCatagories === '1' && <div className='detailItem area-div disable-text-copy' onClick={() => {
                    if(!isCustomerType) setIsCustomerType(true);
                }}>
                    <h3>حدد فئة النزلاء المسموحة (اختياري)</h3>
                    <InfoDiv title={'الفئة المسموحة'} divClick={() => setIsCustomerType(!isCustomerType)} value={customerType?.length <= 0 ? 'غير محدد' : customerType?.toString()?.replaceAll(',', ', ')}/>
                    {isCustomerType && <AddDetailsPopup accompany={customerType} setAccompany={setCustomerType} type={'customerType'} sections={'selections'} isUndefinedElement
                    isNotFacilities setIsShow={setIsCustomerType} baseArr={specificCatagory === 'students' ? studentsTypesArray() : customersTypesArray(false)}/>}

                </div>}

                {selectedCatagories === '0' && <div className='insuranceDetail'>
                    <h3>هل الايجار مع سائق أو بدون؟</h3>
                    <input type='radio' checked={withDriver} name='driver_group' onChange={() => setWithDriver(true)}/><label onClick={() => setWithDriver(true)}>مع سائق</label>
                    <input checked={!withDriver} type='radio' name='driver_group' onChange={() => setWithDriver(false)}/><label onClick={() => setWithDriver(false)}>بدون سائق</label>
                    {detailsError.includes('withDriver') && <p className='error2'>ادخال غير صالح الرجاء الاختيار من نعم أو لا</p>}
                </div>}

                {selectedCatagories === '0' && <div className='detailItem area-div disable-text-copy' onClick={() => {
                    if(!isVehicleRentType) setIsVehicleRentType(true);
                }} style={{ cursor: isVehicleRentType ? 'default' : undefined}}>
                    <h3>حدد نوع الايجار أو طبيعة استعمال المركبة</h3>
                    <InfoDiv title={'نوع الايجار'} value={vehicleRentType === '' ? 'غير محدد' : vehicleRentType}/>
                    {isVehicleRentType && <AddDetailsPopup array={vehicleRentType} setArray={setVehicleRentType} type={'carRentType'} sections={'selections'} 
                    isNotFacilities isSingleSelect setIsShow={setIsVehicleRentType} baseArr={vehicleRentTypesArray()}/>}
                    {detailsError.includes('rentType') && <p className='error2'>ادخال غير صالح, الرجاء الاختيار من أحد الخيارات</p>}
                </div>}

                {selectedCatagories === '0' && <div className='detailItem vehicle-specs'>

                    <h2>حدد مواصفات السيارة</h2>

                    <CustomInputDiv title={'نوع السيارة ' + carCompany} 
                    myStyle={{ width: '49%', marginBottom: 24 }} placholderValue={'مثال: Toyota'} 
                    isError={detailsError.includes('carCompany')} errorText={'الرجاء ادخال نوع صالح'} 
                    listener={(e) => setCarCompany(e.target.value)} value={carCompany}/>

                    <CustomInputDiv title={'موديل السيارة ' + carModel}
                    myStyle={{ width: '49%', marginBottom: 24 }} placholderValue={'مثال: Camry'} 
                    isError={detailsError.includes('carModel')} errorText={'الرجاء ادخال موديل صالح'} 
                    listener={(e) => setCarModel(e.target.value)} value={carModel}/>

                    <CustomInputDiv title={'سنة الصنع ' + carYear} type={'number'} 
                    myStyle={{ marginBottom: 24 }} placholderValue={'مثال: 2024'} 
                    isError={detailsError.includes('carYear')} errorText={'الرجاء ادخال سنة صالحة'} 
                    listener={(e) => setCarYear(Number(e.target.value))} 
                    min={1901} max={2099} defaultValue={2016} value={carYear}/>

                    <CustomInputDiv title={'اللون الخارجي ' + carColor} 
                    myStyle={{ marginBottom: 32 }} placholderValue={'مثال: ابيض'} 
                    errorText={'الرجاء ادخال لون صالح'} isError={detailsError.includes('carColor')}
                    listener={(e) => setCarColor(e.target.value)} value={carColor}/>

                    <div className='selection-div disable-text-copy' onClick={() => {
                        if(!isCarGearboxShow) setIsCarGearboxShow(true);
                    }} style={{ cursor: isCarGearboxShow ? 'default' : undefined}}>
                        <h3>حدد نوع ناقل الحركة Transmission</h3>
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

                {getDetails().map((item) => (
                    !item.notAllowedCategories?.includes(specificCatagory) 
                    && <>{!item.isSelections ? 
                        <div className='detailItem'>
                            <h3>{item.name}</h3>
                            <ul className='detailItem-ul'>
                                {item.array.map((obj, myIndex) => (
                                    <li key={myIndex}>
                                        {!item.isWithEN ? <CustomInputDiv placholderValue={obj} value={obj} deletable handleDelete={() => {
                                            let arr = [];
                                            for (let i = 0; i < item.array.length; i++) {
                                                if(i !== myIndex){
                                                    arr.push(item.array[i]);
                                                }
                                            }
                                            item.setArray(arr);
                                        }} 
                                        listener={(e) => {
                                            let arr = [...item.array];
                                            arr[myIndex] = e.target.value;
                                            item.setArray(arr);
                                        }}/> : <CustomInputDivWithEN placholderValue={'أضف تفصيلة بالعربي'} 
                                        enPlacholderValue={'أضف ترجمة التفصيلة بالانجليزي'}  deletable 
                                        handleDelete={() => {
                                            let arr = [];
                                            for (let i = 0; i < item.array.length; i++) {
                                                if(i !== myIndex){
                                                    arr.push(item.array[i]);
                                                }
                                            }
                                            item.setArray(arr);

                                            let enArr = [];
                                            for (let i = 0; i < item.detailsEN.length; i++) {
                                                if(i !== myIndex){
                                                    enArr.push(item.detailsEN[i]);
                                                }
                                            }
                                            item.setDetailsEN(enArr);
                                        }} 
                                        listener={(e) => {

                                            let arr = [...item.array];
                                            arr[myIndex] = e.target.value;
                                            item.setArray(arr);
                                            
                                            let enArr = item.detailsEN;
                                            enArr[myIndex] = { enName: enArr[myIndex]?.enName, arName: e.target.value };
                                            item.setDetailsEN(enArr);

                                        }} enListener={(e) => {
                                            let arr = item.detailsEN;
                                            arr[myIndex] = { enName: e.target.value, arName: arr[myIndex]?.arName};
                                            item.setDetailsEN(arr);
                                        }} isError={detailsError.includes(`${item.idName}.${myIndex}`)}
                                        errorText={'الرجاء كتابة تفصيلة, مع عدم استخدتم حروف غير صالحة مثل >, &, " ...الخ'}
                                        value={obj} enValue={item.detailsEN?.find(i=>i.arName === obj)?.enName}
                                        isProfileDetails />}
                                    </li>
                                ))}
                            </ul>
                            <button style={{ marginTop: item.array.length <= 0 ? 'unset' : undefined }} onClick={
                                () => {
                                    item.setArray([...item.array, '']);
                                    if(item.isWithEN) item.setDetailsEN([...item.detailsEN, { enName: '', arName: '' }]);
                                }
                            } className={arabicFont}>{'أضف تفصيلة'}</button>
                        </div> : <div className='detailItem area-div dtl-sels-div disable-text-copy' onClick={() => {
                            if(!item.isShow) {
                                item.setIsShow(true);
                                setIsAddDetails(true);
                            };
                        }} style={{ cursor: item.isShow ? 'text' : 'pointer' }}>

                            {item.isShow && <AddDetailsPopup setIsShow={item.setIsShow} 
                            setArray={item.setArray} array={item.array}
                            accompany={item.accompany} setAccompany={item.setAccompany}
                            sections={getDtlItemSections(item.idName)} 
                            setIsAddDetails={setIsAddDetails} detailsError={detailsError}
                            type={item.idName} baseArr={item.selectArray || []} isVehicles={selectedCatagories === '0'}/>}

                            <h3>{item.name}</h3>

                            {item.isNum && (item.array?.length > 0 ? item.array?.map((obj) => (
                                <p className='dtl-array-p'>{getNames('one', false, false, item.idName)} {obj?.room_type} {obj?.capacity ? 'بسعة ' + obj?.capacity + ' شخص' : ''} {obj?.dim ? 'بعرض ' + obj?.dim?.y + ' متر و بطول ' + obj?.dim?.x + ' متر ' : ''} {obj?.single_beds ? ', ' + obj?.single_beds + ' سرير مفرد ' : ''} {obj?.double_beds ? ', ' + obj?.double_beds + ' سرير ماستر ' : ''} {obj?.depth ? ', و بعمق ' + obj?.depth + ' متر ' : ''}</p>
                            )) : <p className='dtl-array-p'>لم يتم اضافة {getNames('one', false, false, item.idName)} بعد</p>)}

                            {(item.idName !== 'rooms' && item.idName !== 'guest_rooms') && <InfoDiv 
                            title={`${item.idName === 'near_places' ? '' : 'مرافق'} ${getNames('one', true, false, item.idName)}`} myStyle={{ cursor: 'pointer' }}
                            divClick={() => item.setIsShow(!item.isShow)} 
                            value={item.accompany?.length <= 0 
                                ? 'لم تتم اضافة أي مرفق' 
                                : item.accompany?.toString()?.replaceAll(',', ', ')}/>}
                            
                            {detailsError.includes(` ${item.idName}`) && <p id='error'>يوجد خطأ بأحد البيانات , لا تستخدم حروف غير صالحة مثل &, {'>'}, " ...الخ</p>}
                        
                        </div>}</>
                ))}

            </div>}

            {section === 6 && <div className='submitItem'>

                <h2>نصائح قبل الارسال</h2>

                <h4>- راجع البيانات المدخلة عن طريق الضغط على رقم القسم من أعلى </h4>

                <h4>- كن دقيقا في العنوان و الوصف</h4>
                
                <h4>- قم بإِضافة صور واضحة و معبرة</h4>

                <h4>- أضف أكبر قدر من المعلومات في قسم التفاصيل</h4>

                <h4>- سيتم مراجعة الاعلان و الموافقة عليه خلال 24 ساعة من الارسال</h4>

                <label id='error2' style={{ padding: error.length <= 0 && 0, margin: error.length <= 0 && 0 }}>{error}</label>
                
                <label id='success' style={{ padding: !success && 0, margin: !success && 0 }}>{success && 'تم الارسال بنجاح'}</label>
                
                <button className={arabicFont} onClick={handleSubmit}>{loading ? <LoadingCircle /> : 'ارسال'}</button>
                
            </div>}

            <div className='section-div'>
                <p style={!sectionError?.length > 0 ? {
                    display: 'none', padding: 0, margin: 0
                } : undefined}>{sectionError} {(section === 2 && !sectionError.includes('خارج الأردن')) 
                    ? <button className={arabicFont} onClick={() => {
                        setSectionError('');
                        setSection(section >= 6 ? 6 : section + 1); 
                    }}>نعم</button>
                    : null}</p>
                <button style={{ display: section <= 0 ? 'none' : undefined }}
                className={'editDiv disable-text-copy ' + arabicFont} onClick={() => {
                    setSectionError('');
                    setSection(section > 0 ? section - 1 : 0);
                }}>رجوع</button>
                <button style={{ 
                    display: section >= 6 ? 'none' : undefined
                }} className={'btnbackscndclr disable-text-copy ' + arabicFont} onClick={() => {
                    if(isTestSection()) setSection(section >= 6 ? 6 : section + 1);
                }}>تقدم</button>
            </div>

        </div>

    </div>
  )
};

export default page;

// const reverseGeoCode = (lat, long) => {
//     var geocoder;
//     geocoder = new google.maps.Geocoder();
//     var latlng = new google.maps.LatLng(lat, long);

//     geocoder.geocode(
//         {'latLng': latlng}, 
//         function(results, status) {
//             if (status == google.maps.GeocoderStatus.OK) {
//                 if (results[0]) {
//                     var add= results[0].formatted_address ;
//                     var  value=add.split(",");

//                     const geocount=value.length;
//                     const geocountry=value[geocount-1];
//                     const geostate=value[geocount-2];
//                     const geocity=value[geocount-3];
//                     return { ok: true, city: geocity, principalSubdivision: geostate };
//                 }
//                 else  {
//                     return { ok: false };
//                 }
//             }
//             else {
                
//                 return { ok: false };
//                 x.innerHTML = "Geocoder failed due to: " + status;
//             }
//         }
//     );
// };

