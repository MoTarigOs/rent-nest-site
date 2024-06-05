'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import '../../add/Add.css';
import CatagoryCard from '@components/CatagoryCard';
import Image from 'next/image';
import GoogleMapImage from '@assets/images/google-map-image.jpg';
import VehicleImage from '@assets/images/sedan-car.png';
import PropertyImage from '@assets/images/property.png';
import PropertyWhiteImage from '@assets/images/property-white.png';
import { CustomerTypesArray, JordanCities, ProperitiesCatagories, VehicleCatagories, VehiclesTypes, cancellationsArray, contactsPlatforms, currencyCode, getContactPlaceHolder, isInsideJordan, reservationType } from '@utils/Data';
import CustomInputDiv from '@components/CustomInputDiv';
import { createProperty, uploadFiles } from '@utils/api';
import HeaderPopup from '@components/popups/HeaderPopup';
import { getOptimizedAttachedFiles, isValidContactURL, isValidNumber, isValidText } from '@utils/Logic';
import { Context } from '@utils/Context';
import NotFound from '@components/NotFound';
import MySkeleton from '@components/MySkeleton';
import Svgs from '@utils/Svgs';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { bathroomFacilities, customersTypesArray, facilities, kitchenFacilities, poolType } from '@utils/Facilities';
import InfoDiv from '@components/InfoDiv';
import CustomInputDivWithEN from '@components/CustomInputDivWithEN';
import LoadingGif from '@components/LoadingCircle';
import LoadingCircle from '@components/LoadingCircle';
import { getUserLocation } from '@utils/ServerComponents';

const page = () => {

    const { 
        userId, setIsMap, setMapType,
        latitude, setLatitude, storageKey,
        longitude, setLongitude, userEmail,
        loadingUserInfo, isVerified,
        userAccountType
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

    const [expandPrices, setExpandPrices] = useState(false);
    const [pricesError, setPricesError] = useState([]);

    const [customerType, setCustomerType] = useState('');
    const [isCustomerType, setIsCustomerType] = useState(false);
    const [capacity, setCapacity] = useState(0);

    const [specificCatagory, setSpecificCatagory] = useState('-1');
    const [vehicleType, setVehicleType] = useState('');
    const [itemTitle, setItemTitle] = useState('');
    const [itemTitleEN, setItemTitleEN] = useState('');
    const [itemDesc, setItemDesc] = useState('');
    const [itemDescEN, setItemDescEN] = useState('');
    const [itemCity, setItemCity] = useState({});
    const [area, setArea] = useState(0);
    const [itemNeighbour, setItemNeighbour] = useState('');
    const [itemNeighbourEN, setItemNeighbourEN] = useState('');
    const [itemPrice, setItemPrice] = useState(0);
    const [itemPrices, setItemPrices] = useState(null);
    const [requireInsurance, setRequireInsurance] = useState(false);
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
    const [isCancellation, setIsCancellation] = useState('');

    const [conditionsAndTerms, setConditionsAndTerms] = useState([]);
    const [conditionsAndTermsEN, setConditionsAndTermsEN] = useState([]);
    const [vehicleSpecifications, setVehicleSpecifications] = useState([]);

    const [guestRoomsDetailArrayEN, setGuestRoomsDetailArrayEN] = useState([]);
    const [nearPlacesEN, setNearPlacesEN] = useState([]);
    const [vehicleSpecificationsEN, setVehicleSpecificationsEN] = useState([]);
    const [vehicleFeaturesEN, setVehicleFeaturesEN] = useState([]);

    const [vehicleFeatures, setVehicleFeatures] = useState([]);

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
    const [bedroomsShow, setBedroomsShow] = useState(false);
    const [poolsShow, setPoolsShow] = useState(false);
    const [numOf, setNumOf] = useState([]);
    const [dimensionOf, setDimensionOf] = useState([]);
   
    const details = [
        {idName: 'guest_rooms', name: 'Living Rooms', isWithEN: true, detailsEN: guestRoomsDetailArrayEN, setDetailsEN: setGuestRoomsDetailArrayEN, array: guestRoomsDetailArray, setArray: setGuestRoomsDetailArray},
        {idName: 'bathrooms', name: 'Bathrooms', isNum: true, isSelections: true, isShow: bathroomsShow, setIsShow: setBathroomsShow, selectArray: bathroomFacilities(true), array: bathroomsDetailArray, setArray: setBathroomsDetailArray},
        {idName: 'kitchen', name: 'Kitchen', isDimension: true, isSelections: true, selectArray: kitchenFacilities(true), isShow: kitchenShow, setIsShow: setKitchenShow, array: kitchenDetailArray, setArray: setKitchenDetailArray},
        {idName: 'rooms', name: 'Bedrooms and beds', isNum: true, isSelections: true, isShow: bedroomsShow, setIsShow: setBedroomsShow, selectArray: roomsSelections, array: roomsDetailArray, setArray: setRoomsDetailArray},
        {idName: '', name: 'Near Places', isWithEN: true, detailsEN: nearPlacesEN, setDetailsEN: setNearPlacesEN, array: nearPlaces, setArray: setNearPlaces},
        {idName: 'pool', name: 'Swimming Pool', isNum: true, isDimension: true, isSelections: true, isShow: poolsShow, setIsShow: setPoolsShow, selectArray: poolType(true), array: poolsDetailArray, setArray: setPoolsDetailArray},
        {idName: '', name: 'Facilities', isSelections: true, isShow: companiansShow, setIsShow: setCompaniansShow, selectArray: facilities(true), array: companionsDetailArray, setArray: setCompanionsDetailArray},
        {idName: '', name: 'Booking terms and conditions', isWithEN: true, detailsEN: conditionsAndTermsEN, setDetailsEN: setConditionsAndTermsEN, array: conditionsAndTerms, setArray: setConditionsAndTerms},
    ];

    const vehiclesDetails = [
        {name: 'Vehicle Specifications', isWithEN: true, detailsEN: vehicleSpecificationsEN, setDetailsEN: setVehicleSpecificationsEN, array: vehicleSpecifications, setArray: setVehicleSpecifications},
        {name: 'Vehicle Addons', isWithEN: true, detailsEN: vehicleFeaturesEN, setDetailsEN: setVehicleFeaturesEN, array: vehicleFeatures, setArray: setVehicleFeatures},
        {name: 'Near Places', isWithEN: true, detailsEN: nearPlacesEN, setDetailsEN: setNearPlacesEN, array: nearPlaces, setArray: setNearPlaces},
        {name: 'Booking terms and conditions', isWithEN: true, detailsEN: conditionsAndTermsEN, setDetailsEN: setConditionsAndTermsEN,  array: conditionsAndTerms, setArray: setConditionsAndTerms},
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

        if(selectedCatagories !== '0' && selectedCatagories !== '1') return;

        let attahcedFilesError = false;
        let errorEncountered = false;

        if(selectedCatagories === '1' && !ProperitiesCatagories.find(i => i.value === specificCatagory)){
            setSpecificCatagory('-2');
            errorEncountered = true;
        } else if(selectedCatagories === '0' && (!VehiclesTypes.find(i => i.value === vehicleType) || specificCatagory !== 'transports')){
            setSpecificCatagory('-2');
            setVehicleType('');
            errorEncountered = true;
        }

        if(!isValidText(itemTitle) || (itemTitleEN && !isValidText(itemTitleEN))){
            setItemTitle('-1');
            errorEncountered = true;
        }

        if(!isValidText(itemDesc) || (itemDescEN && !isValidText(itemDescEN))){
            setItemDesc('-1');
            errorEncountered = true;
        }

        if(area === -1 || (area > 0 && (typeof area !== 'number' || area < 0 || area > 1000000))){
            setArea(-1);
            errorEncountered = true;
        }

        if(!contacts || !contacts?.length > 0){
            setContactsError('Please write at least one contact method.');
            errorEncountered = true;
        } else {
            for (let i = 0; i < contacts.length; i++) {
                if(!isValidContactURL(contacts[i])) {
                    setContactsError('There is an invalid link. Please choose a platform and enter a valid link.');
                    errorEncountered = true;
                }
            }
        }

        if(!itemCity || itemCity === {} || typeof itemCity.value !== 'string' || itemCity.value.length <= 0){
            const obj = itemCity;
            obj.value = '-1';
            setItemCity(obj);
            errorEncountered = true;
        }

        if(!isValidText(itemNeighbour) || !isValidText(itemNeighbourEN)){
            setItemNeighbour('');
            setItemNeighbourEN('');
        }
        
        if(!isValidPrices()) errorEncountered = true;
        
        if(itemLong || itemLat){
            if(!isInsideJordan(itemLong, itemLat)){
                setError('Error in location data, please specify a valid location on the map');
                errorEncountered = true;
            }
        }

        if(capacity > 0 && !isValidNumber(capacity)){
            setCapacity(-1);
            errorEncountered = true;
        }

        if(customerType?.length > 0 && !customersTypesArray(true).includes(customerType)){
            setCustomerType('-1');
            errorEncountered = true;
        }

        if(cancellation?.length > 0 && !cancellationsArray(true).includes(cancellation)){
            setCancellation('-1');
            errorEncountered = true;
        }

        if(errorEncountered === true){
            window.scrollTo({
                top: contactsError?.length > 0 
                ? window.scrollY + attachImagesDivRef.current.getBoundingClientRect().top 
                : 320, behavior: 'smooth'
            });
            setError('Complete the empty fields.');
            setSuccess(false);
            return;
        }

        setContactsError('');

        try {

            setLoading(true);

            const optimizedFiles = await getOptimizedAttachedFiles(attachedFilesUrls);

            setAttachedFilesUrls(optimizedFiles.optArr);

            //attached file, atleast one
            if(optimizedFiles.optArr.length <= 0){
                attahcedFilesError = true;
                errorEncountered = true;
            }

            if(attahcedFilesError === true) setError('Add pictures and videos that for the property.');

            if(errorEncountered === true) {
                if(attachImagesDivRef.current){
                    window.scrollTo({
                        top: window.scrollY + attachImagesDivRef.current.getBoundingClientRect().top, behavior: 'smooth'
                    });
                }
                setSuccess(false);
                setLoading(false);
                return;
            };

            /*  create property or vehicle instance then 
                upload images with the id of the created instance  */

                const getFacilitesMethod = (type, element) => {
                    switch(type){
                        case 'facilities':
                            return facilities()[facilities(true).indexOf(element)];
                        case 'bathrooms':
                            return bathroomFacilities()[bathroomFacilities(true).indexOf(element)];
                        case 'kitchen':
                            return kitchenFacilities()[kitchenFacilities(true).indexOf(element)];
                        case 'pool':
                            return poolType()[poolType(true).indexOf(element)];
                    }
                };

                const getArabicFacilities = (type, arrayOfENFacilities) => {
                    let arr = [];
                    arrayOfENFacilities.forEach(element => {
                        arr.push(getFacilitesMethod(type, element));
                    });
                    return arr;
                };

            const xDetails = selectedCatagories === '0' ? {
                vehicle_specifications: vehicleSpecifications,
                vehicle_addons: vehicleFeatures,
                near_places: nearPlaces
            } : {
                insurance:  requireInsurance, 
                guest_rooms: guestRoomsDetailArray, 
                facilities: getArabicFacilities('facilities', companionsDetailArray), 
                bathrooms: { num: numOf.find(i => i.name === 'bathrooms')?.value, companians: getArabicFacilities('bathrooms', bathroomsDetailArray)}, 
                kitchen: { dim: { x: dimensionOf.find(i => i.name === 'kitchen')?.x, y: dimensionOf.find(i => i.name === 'kitchen')?.y }, companians: getArabicFacilities('kitchen', kitchenDetailArray) }, 
                rooms: { num: numOf.find(i => i.name === 'rooms')?.value, single_beds: numOf.find(i => i.name === 'single beds')?.value, double_beds: numOf.find(i => i.name === 'double beds')?.value },
                near_places: nearPlaces,
                pool: { num: numOf.find(i => i.name === 'pool')?.value, dim: { x: dimensionOf.find(i => i.name === 'pool')?.x, y: dimensionOf.find(i => i.name === 'pool')?.y }, companians: getArabicFacilities('pool', poolsDetailArray) }
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

            if(itemTitleEN) enObj.titleEN = itemTitleEN;
            if(itemDescEN) enObj.descEN = itemDescEN;
            if(itemNeighbourEN) enObj.neighbourEN = itemNeighbourEN;
            if(customersTypesArray(true).includes(customerType)) enObj.customerTypeEN = customerType;

            let tempContacts = [];

            contacts.forEach((item) => {
                tempContacts.push({
                    platform: item.platform, val: item.val
                });
            });

            const token = await getRecaptchaToken();
            
            const res = await createProperty(
                selectedCatagories === '0' ? true : false, 
                specificCatagory, itemTitle, itemDesc, 
                itemCity.value, itemNeighbour, [itemLong, itemLat], itemPrice, 
                xDetails, conditionsAndTerms, area > 0 ? area : null,
                tempContacts?.length > 0 ? tempContacts : null, true, token, 
                capacity, customersTypesArray()[customersTypesArray(true)?.indexOf(customerType)], enObj, cancellationsArray(true).indexOf(cancellation), 
                VehiclesTypes.find(i => i.value === vehicleType)?.id,
                itemPrices);

            if(res.success !== true){
                setError(res.dt);
                setLoading(false);
                setSuccess(false);
                return;
            }

            const uploadFilesRes = await uploadFiles(
                optimizedFiles.optArr, res.dt.id, storageKey, userEmail, true
            );

            console.log('upload res: ', uploadFilesRes);

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

    const showMap = () => {      
        setMapUsed(true);
        setMapType('select-point');
        setIsMap(true);
    };

    const setAutomaticLocation = async() => {

        try {

            setIsManualLocSet(false);
            setFetchingLocation(true);
            setIsUserLoc('');

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
        if(!loadingUserInfo && userId?.length > 0) setFetching(false);
    }, [userId]);

    const RightIconSpan = () => {
        return <span id='righticonspan'/>
    }

    if(!userId?.length > 0 || !isVerified || userAccountType !== 'host'){
        return (
            fetching ? <MySkeleton isMobileHeader={true}/> : <NotFound navToVerify={!isVerified} type={'not allowed'} isEnglish/>
        )
    }

  return (
    <div className='add' dir='ltr'>

        <span id='closePopups' onClick={() => {
            setCityPopup(false); setIsCustomerType(false); setCompaniansShow(false); setBathroomsShow(false); setKitchenShow(false);
            setPoolsShow(false); setIsCancellation(false);
        }} style={{ display: (!cityPopup && !isCustomerType && !companiansShow && !bathroomsShow && !isCancellation
            && !kitchenShow && !poolsShow) ? 'none' : undefined }}/>

        <div className='wrapper'>

            <h2>What do you want to offer for rent?</h2>

            <div className='selectCatagory' style={{ width: '100%', flexDirection: 'row-reverse' }}>

                <CatagoryCard type={'add'} image={VehicleImage} title={'Vehicle'} catagoryId={'0'} selectedCatagories={selectedCatagories} setSelectedCatagories={setSelectedCatagories}/>
                
                <CatagoryCard type={'add'} image={selectedCatagories !== '1' ? PropertyImage : PropertyWhiteImage} title={'Real Estate'} catagoryId={'1'} selectedCatagories={selectedCatagories} setSelectedCatagories={setSelectedCatagories}/>

            </div>

            <div className='selectKind'>
                <select value={selectedCatagories === '0' ? vehicleType : specificCatagory} onChange={(e) => {
                    setSpecificCatagory(selectedCatagories === '0' ? 'transports' : e.target.value)
                    if(selectedCatagories === '0') setVehicleType(e.target.value);
                }}>
                    <option value={'-1'} hidden selected>{selectedCatagories === '0' ? 'Select the vehicle classification' : 'Choose the property classification'}</option>
                    {getCatagoryArray().map((item) => (
                        <option key={item.id} value={item.value}>{item.value}</option>
                    ))}
                </select>
                <label id='error'>{specificCatagory === '-2' && 'الرجاء تحديد تصنيف'}</label>
            </div>

            <p id='important-p'><Svgs name={'info'}/> Important! You must fill fields with English & Arabic Texts</p>

            <CustomInputDivWithEN isError={itemTitle === '-1' && true} errorText={'Please write a title of five or more characters.'} title={'Title in English and Arabic'} placholderValue={'Write the title in Arabic here'} enPlacholderValue={'Write the title in English here'} listener={(e) => setItemTitle(e.target.value)} enListener={(e) => setItemTitleEN(e.target.value)} isEnglish/>

            <CustomInputDivWithEN isError={itemDesc === '-1' && true} errorText={'Please write a clear description of what you want to display, in no less than 10 words.'} title={'Enter the description in Arabic and English'} isTextArea={true} placholderValue={'Write the description in Arabic here'} enPlacholderValue={'Write the description in English here'} listener={(e) => setItemDesc(e.target.value)} enListener={(e) => setItemDescEN(e.target.value)} isEnglish type={'text'}/>

            <div className='address'>
                <div className='popup-wrapper'>
                    <CustomInputDivWithEN settingFocused={() => setCityPopup(true)} isCity={true} isError={itemCity?.value === '-1' && true} errorText={'Select the city where the rental is available'} title={'City'} value={itemCity?.value} type={'text'} enValue={itemCity?.arabicName === '-1' ? '' : itemCity?.arabicName} placholderValue={'Choose City'}/>
                    {cityPopup && <HeaderPopup type={'add-city'} itemCity={itemCity} setItemCity={setItemCity} isEnglish/>}
                </div>
                <CustomInputDivWithEN title={'Neighborhood'} listener={(e) => setItemNeighbour(e.target.value)} placholderValue={'Neighborhood in Arabic'} enPlacholderValue={'Neighborhood in English'} enListener={(e) => setItemNeighbourEN(e.target.value)} type={'text'} isEnglish/>
            </div>

            <div className='location-div disable-text-copy'>
                
                <h3>Determine the geographical location of the property</h3>
                
                <button className='editDiv' onClick={setAutomaticLocation}>{fetchingLocation ? <LoadingCircle isLightBg/> : 'Automatic Location'}</button>

                {locObj && <div className='automatic-location'>
                    {locObj?.city && 
                    <><h4>Is the location of the property in {locObj?.city}, {locObj?.principalSubdivision}, {locObj?.locality} city?</h4>
                    <button style={isUserLoc?.length > 0 ? {
                        background: 'white', color: 'black', fontWeight: 400,
                        cursor: 'default'
                    } : undefined} className='btnbackscndclr' onClick={() => { 
                        setLatitude(locObj?.lat);
                        setLongitude(locObj?.long);
                        setIsUserLoc('true'); 
                        setIsManualLocSet(true); 
                    }}>Yes</button>
                    <button style={isUserLoc?.length > 0 ? {
                        background: 'white', color: 'black', fontWeight: 400,
                        cursor: 'default'
                    } : undefined} className='btnbackscndclr' onClick={() => { 
                        if(isUserLoc?.length > 0) return;
                        setIsUserLoc('false');
                        setIsManualLocSet(true);
                        setLatitude(itemCity?.lat || JordanCities[0]?.lat);
                        setLongitude(itemCity?.long || JordanCities[0]?.long);
                    }}>No</button></>}
                    <p style={isUserLoc === '' ? { display: 'none', margin: 0 } : undefined}>{isUserLoc === 'false' ? 'Please stop the VPN if you are using it and try again, or specify the location manually.' : (isUserLoc === 'true' ? 'Verify the location using the map' : '')}</p>
                </div>}

                <button style={{ margin: '24px 0' }} onClick={() => {
                    if(isUserLoc !== 'true'){
                        setLatitude(itemCity?.lat || JordanCities[0]?.lat);
                        setLongitude(itemCity?.long || JordanCities[0]?.long);
                    };             
                    setIsManualLocSet(true); 
                    setIsUserLoc(''); 
                    setLocObj(null);
                }} className='editDiv'>Manual Location</button>

                {isManualLocSet && <div className='googleMapDiv' onClick={showMap}>
                    <span>{isUserLoc === 'true' ? 'Check the site and modify it.' : 'Locate using map'}</span>
                    <Image src={GoogleMapImage}/>
                </div>}

            </div>

            <div className='prices'>
                
                <h3>Price </h3>

                <p>Set a price for each booking period {'(Daily, weekly, monthly, seasonly and yearly)'}</p>

                {(expandPrices ? reservationType() : [reservationType()[0]]).map((item) => (
                    <div className='priceDiv' style={{ marginBottom: 16 }}>
                        <CustomInputDiv isError={pricesError.includes(item.enName?.toLowerCase())} 
                        errorText={'Set a price for the ' + item.oneEn} 
                        title={`Price in ${currencyCode(true, true)}`} 
                        listener={(e) => handlePriceChange(e, item.enName)} 
                        min={0} value={getPriceValue(item.enName)}
                        type={'number'} myStyle={{ marginBottom: 16 }}/>
                        <strong>/</strong>
                        <h4>{item.oneEn}</h4>
                    </div>
                ))}

                <button className='editDiv' onClick={() => setExpandPrices(!expandPrices)}>{expandPrices ? 'Less' : 'Expand'}</button>

            </div>

            <div className='attachFiles' ref={attachImagesDivRef}>

                <button onClick={() => inputFilesRef.current.click()}>Choose a File</button>

                <ul style={{ gridTemplateColumns: attachedFilesUrls.length <= 0 && '1fr' }}>
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
                    >{attachedFilesUrls.length > 0 ? 'Add More' : `Choose photos and videos for ${selectedCatagories === '0' ? 'The Vehicle' : 'The Property'}`}<p>(File type must be PNG, JPG, MP4, or AVI)</p></li>
                </ul>

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

            </div>

            <div className='detailsAboutItem'>

                <h2>Add details about the {selectedCatagories === '0' ? 'Vehicle' : 'Property'}</h2>

                <div className='insuranceDetail'>
                    <h3>Does rent require insurance?</h3>
                    <input type='radio' name='insurance_group' onChange={() => setRequireInsurance(true)}/><label>Yes</label>
                    <input checked={requireInsurance ? false : true} type='radio' name='insurance_group' onChange={() => setRequireInsurance(false)}/><label>No</label>
                </div>

                <div className='detailItem area-div' style={{ display: selectedCatagories === '0' ? 'none' : null}}>
                    <h3>Select the possibility of canceling your reservation</h3>
                    <InfoDiv title={'Reservation Cancel'} divClick={() => setIsCancellation(!isCancellation)} value={cancellation === '' ? 'Undefined' : cancellation}/>
                    <HeaderPopup type={'customers'} customArray={cancellationsArray(true)} selectedCustom={cancellation}
                    setSelectedCustom={setCancellation} isCustom={isCancellation} setIsCustom={setIsCancellation} isEnglish/>
                </div>

                <div className='detailItem area-div' style={{ display: selectedCatagories === '0' ? 'none' : null}}>
                    <h3>Write the area of ​​the property in meters</h3>
                    <CustomInputDiv title={area > 0 ? `${area} Square Meters` : ''} max={1000000} min={0} myStyle={{ marginBottom: 0 }} placholderValue={'Undefined'} type={'number'} isError={area === -1} errorText={'Please enter a valid area'} listener={(e) => {
                        if(Number(e.target.value)) {
                            setArea(Number(e.target.value))
                        } else {
                            setArea(0);
                        };
                    }}/>
                </div>

                <div className='detailItem area-div' style={{ display: selectedCatagories === '0' ? 'none' : null}}>
                    <h3>Type the maximum capacity or number of guests available to be in the property</h3>
                    <CustomInputDiv title={capacity > 0 ? `${capacity} Guests` : ''} max={150000} min={-1} myStyle={{ marginBottom: 0 }} placholderValue={'How many guests are allowed in the property?'} type={'number'} isError={capacity === -1} errorText={'Please enter a number from zero to 150,000'} listener={(e) => {
                        if(Number(e.target.value)) {
                            setCapacity(Number(e.target.value))
                        } else {
                            setCapacity(0);
                        };
                    }}/>
                </div>

                <div className='detailItem area-div' style={{ display: selectedCatagories === '0' ? 'none' : null}}>
                    <h3>Select the allowed guest category (optional)</h3>
                    <InfoDiv title={'Allowed category'} divClick={() => setIsCustomerType(!isCustomerType)} value={customerType === '' ? 'Undefined' : customerType}/>
                    <HeaderPopup type={'customers'} customArray={customersTypesArray(true)} selectedCustom={customerType}
                    setSelectedCustom={setCustomerType} isCustom={isCustomerType} setIsCustom={setIsCustomerType} isEnglish/>
                </div>

                <div className='detailItem contacts-div'>
                    <h3>Add communication methods</h3>
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
                                    {c?.platform?.length > 0 ? c.platform : 'Choose Platform'} <Svgs name={'dropdown arrow'}/>
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
                    <button className='btnbackscndclr' onClick={() => setContacts([...contacts, { platform: '', val: '', isPlatforms: false }])}>Add More</button>
                </div>
                
                {getDetails().map((item) => (
                    !item.isSelections ? <div className='detailItem'>
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
                                    }}/> : <CustomInputDivWithEN placholderValue={'Add a detail in Arabic'} enPlacholderValue={'Add a detail in English'}  deletable isEnglish
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
                                    }}/>}
                                </li>
                            ))}
                        </ul>
                        <button style={{ marginTop: item.array.length <= 0 && 'unset' }} onClick={
                            () => {
                                item.setArray([...item.array, '']);
                                if(item.isWithEN) item.setDetailsEN([...item.detailsEN, { enName: '', arName: '' }]);
                            }
                        }>{'Add a detail'}</button>
                    </div> : <div className='detailItem area-div'>

                        <h3>{item.name}</h3>

                        {item.isNum && <><div className='priceDiv'>
                            <CustomInputDiv myStyle={{ marginBottom: item.idName === 'pool' ? 16 : undefined }} title={'Number of Total ' + (item.idName === 'rooms' ? 'Rooms' : item.name)} listener={(e) => {
                                if(numOf.find(i => i.name === item.idName)) {
                                    let arr = numOf;
                                    arr[arr.indexOf(arr.find(i => i.name === item.idName))] = { 
                                        name: item.idName, value: Number(e.target.value) 
                                    };
                                    setNumOf(arr);
                                } else {
                                    setNumOf([...numOf, { name: item.idName, value: Number(e.target.value) }]);
                                }
                            }} type={'number'} min={0} max={100000}/>
                        </div>

                        {item.idName === 'rooms' && <div style={{ marginTop: 16 }} className='priceDiv'>
                            <CustomInputDiv title={'Number of total Single Beds'} listener={(e) => {
                                if(numOf.find(i => i.name === 'single beds')) {
                                    let arr = numOf;
                                    arr[arr.indexOf(arr.find(i => i.name === 'single beds'))] = { 
                                        name: 'single beds', value: Number(e.target.value) 
                                    };
                                    setNumOf(arr);
                                } else {
                                    setNumOf([...numOf, { name: 'single beds', value: Number(e.target.value) }]);
                                }
                            }} type={'number'} min={0} max={100000}/>
                        </div>}

                        {item.idName === 'rooms' && <div style={{ marginTop: 16 }} className='priceDiv'>
                            <CustomInputDiv title={'Number of total Doubled Beds'} listener={(e) => {
                                if(numOf.find(i => i.name === 'double beds')) {
                                    let arr = numOf;
                                    arr[arr.indexOf(arr.find(i => i.name === 'double beds'))] = { 
                                        name: 'double beds', value: Number(e.target.value) 
                                    };
                                    setNumOf(arr);
                                } else {
                                    setNumOf([...numOf, { name: 'double beds', value: Number(e.target.value) }]);
                                }
                            }} type={'number'} min={0} max={100000}/>
                        </div>}</>}

                        {item.isDimension && <div className='priceDiv'>
                            <CustomInputDiv title={'Length of ' + (item.idName === 'pool' ? 'pool' : item.name)} listener={(e) => {
                                if(dimensionOf.find(i => i.name === item.idName)) {
                                    let arr = dimensionOf;
                                    arr[arr.indexOf(arr.find(i => i.name === item.idName))] = { 
                                        name: item.idName, x: Number(e.target.value), y: arr.find(i => i.name === item.idName)?.y || 0
                                    };
                                    setDimensionOf(arr);
                                } else {
                                    setDimensionOf([...dimensionOf, { name: item.idName, x: Number(e.target.value), y: 0 }]);
                                }
                            }} type={'number'} min={0} max={100000}/>
                            <strong> X </strong>
                            <CustomInputDiv title={'Width of ' + (item.idName === 'pool' ? 'Pool' : item.name)} listener={(e) => {
                                if(dimensionOf.find(i => i.name === item.idName)) {
                                    let arr = dimensionOf;
                                    arr[arr.indexOf(arr.find(i => i.name === item.idName))] = { 
                                        name: item.idName, y: Number(e.target.value), x: arr.find(i => i.name === item.idName)?.x || 0
                                    };
                                    setDimensionOf(arr);
                                } else {
                                    setDimensionOf([...dimensionOf, { name: item.idName, x: 0, y: Number(e.target.value) }]);
                                }
                            }} type={'number'} min={0} max={100000}/>
                        </div>}

                        {item.idName !== 'rooms' && <InfoDiv title={'Add facilities'} divClick={() => item.setIsShow(!item.isShow)} value={item.array?.length <= 0 ? 'No attachment added' : item.array?.toString()?.replaceAll(',', ', ')}/>}
                        <HeaderPopup type={'selections'} customArray={item.selectArray} selectedCustom={item.array}
                        setSelectedCustom={item.setArray} isCustom={item.isShow} setIsCustom={item.setIsShow} isEnglish/>
                        
                    </div>
                ))}

            </div>

            <div className='addTermsAndConditions'></div>
            
            <div className='submitItem'>

                <h2>Tips before sending</h2>

                <h4>- Be precise in your title and description</h4>

                <h4>- Add clear and expressive images</h4>

                <h4>- Add as much information as possible in the details field</h4>

                <label id='error2' style={{ padding: error.length <= 0 && 0, margin: error.length <= 0 && 0 }}>{error}</label>
                
                <label id='success' style={{ padding: !success && 0, margin: !success && 0 }}>{success && 'Send Successfully'}</label>
                
                <button onClick={handleSubmit}>{loading ? <LoadingGif /> : 'Submit'}</button>
                
            </div>

        </div>

    </div>
  )
};

export default page;
