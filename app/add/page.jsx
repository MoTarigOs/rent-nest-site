'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import './Add.css';
import CatagoryCard from '@components/CatagoryCard';
import Image from 'next/image';
import GoogleMapImage from '@assets/images/google-map-image.jpg';
import VehicleImage from '@assets/images/sedan-car.png';
import PropertyImage from '@assets/images/property.png';
import PropertyWhiteImage from '@assets/images/property-white.png';
import { CustomerTypesArray, JordanCities, ProperitiesCatagories, VehicleCatagories, VehiclesTypes, cancellationsArray, contactsPlatforms, getContactPlaceHolder, isInsideJordan } from '@utils/Data';
import CustomInputDiv from '@components/CustomInputDiv';
import { createProperty, uploadFiles } from '@utils/api';
import HeaderPopup from '@components/popups/HeaderPopup';
import { getOptimizedAttachedFiles, isValidContactURL, isValidNumber, isValidText } from '@utils/Logic';
import { Context } from '@utils/Context';
import NotFound from '@components/NotFound';
import MySkeleton from '@components/MySkeleton';
import Svgs from '@utils/Svgs';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Facilities, bathroomFacilities, customersTypesArray, facilities, kitchenFacilities, poolType } from '@utils/Facilities';
import InfoDiv from '@components/InfoDiv';
import CustomInputDivWithEN from '@components/CustomInputDivWithEN';
import LoadingCircle from '@components/LoadingCircle';

const page = () => {

    const { 
        userId, setIsMap, setMapType,
        latitude, setLatitude, storageKey,
        longitude, setLongitude, userEmail,
        loadingUserInfo, isVerified
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
    const [requireInsurance, setRequireInsurance] = useState(false);
    const [attachedFilesUrls, setAttachedFilesUrls] = useState([]);
    const [itemLong, setItemLong] = useState(null);
    const [itemLat, setItemLat] = useState(null);

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
        {idName: 'guest_rooms', name: 'غرف الضيوف و المجالس', isWithEN: true, detailsEN: guestRoomsDetailArrayEN, setDetailsEN: setGuestRoomsDetailArrayEN, array: guestRoomsDetailArray, setArray: setGuestRoomsDetailArray},
        {idName: 'bathrooms', name: 'دورات المياه', isNum: true, isSelections: true, isShow: bathroomsShow, setIsShow: setBathroomsShow, selectArray: bathroomFacilities(), array: bathroomsDetailArray, setArray: setBathroomsDetailArray},
        {idName: 'kitchen', name: 'المطبخ', isDimension: true, isSelections: true, selectArray: kitchenFacilities(), isShow: kitchenShow, setIsShow: setKitchenShow, array: kitchenDetailArray, setArray: setKitchenDetailArray},
        {idName: 'rooms', name: 'غرف النوم و الأسرّة', isNum: true, isSelections: true, isShow: bedroomsShow, setIsShow: setBedroomsShow, selectArray: roomsSelections, array: roomsDetailArray, setArray: setRoomsDetailArray},
        {idName: '', name: 'الأماكن القريبة', isWithEN: true, detailsEN: nearPlacesEN, setDetailsEN: setNearPlacesEN, array: nearPlaces, setArray: setNearPlaces},
        {idName: 'pool', name: 'المسبح', isNum: true, isDimension: true, isSelections: true, isShow: poolsShow, setIsShow: setPoolsShow, selectArray: poolType(), array: poolsDetailArray, setArray: setPoolsDetailArray},
        {idName: '', name: 'المرافق', isSelections: true, isShow: companiansShow, setIsShow: setCompaniansShow, selectArray: facilities(), array: companionsDetailArray, setArray: setCompanionsDetailArray},
        {idName: '', name: 'شروط و أحكام الحجز', isWithEN: true, detailsEN: conditionsAndTermsEN, setDetailsEN: setConditionsAndTermsEN, array: conditionsAndTerms, setArray: setConditionsAndTerms},
    ];

    const vehiclesDetails = [
        {name: 'مواصفات السيارة', isWithEN: true, detailsEN: vehicleSpecificationsEN, setDetailsEN: setVehicleSpecificationsEN, array: vehicleSpecifications, setArray: setVehicleSpecifications},
        {name: 'المزايا الاضافية', isWithEN: true, detailsEN: vehicleFeaturesEN, setDetailsEN: setVehicleFeaturesEN, array: vehicleFeatures, setArray: setVehicleFeatures},
        {name: 'الأماكن القريبة', isWithEN: true, detailsEN: nearPlacesEN, setDetailsEN: setNearPlacesEN, array: nearPlaces, setArray: setNearPlaces},
        {name: 'شروط و أحكام الحجز', isWithEN: true, detailsEN: conditionsAndTermsEN, setDetailsEN: setConditionsAndTermsEN,  array: conditionsAndTerms, setArray: setConditionsAndTerms},
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

        if(!isValidText(itemTitle, null) || !isValidText(itemTitleEN)){
            setItemTitle('-1');
            errorEncountered = true;
        }

        if(!isValidText(itemDesc) || !isValidText(itemDescEN)){
            setItemDesc('-1');
            errorEncountered = true;
        }

        if(area === -1 || (area > 0 && (typeof area !== 'number' || area < 0 || area > 1000000))){
            setArea(-1);
            errorEncountered = true;
        }

        if(!contacts || !contacts?.length > 0){
            setContactsError('الرجاء كتابة طريقة تواصل واحدة على الأقل.');
            errorEncountered = true;
        } else {
            for (let i = 0; i < contacts.length; i++) {
                if(!isValidContactURL(contacts[i])) {
                    setContactsError('هنالك رابط غير صالح, الرجاء اختيار منصة و ادخال رابط صالح.');
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
        
        if(!itemPrice || typeof itemPrice !== 'number' || itemPrice <= 0 || itemPrice > 10000000000000){
            setItemPrice(-1);
            errorEncountered = true;
        }

        if(itemLong || itemLat){
            if(!isInsideJordan(itemLong, itemLat)){
                setError('خطأ في بيانات الموقع, الرجاء تحديد موقع صالح على الخريطة');
                errorEncountered = true;
            }
        }

        if(capacity > 0 && !isValidNumber(capacity)){
            setCapacity(-1);
            errorEncountered = true;
        }

        if(customerType?.length > 0 && !customersTypesArray().includes(customerType)){
            setCustomerType('-1');
            errorEncountered = true;
        }

        if(cancellation?.length > 0 && !cancellationsArray().includes(cancellation)){
            setCancellation('-1');
            errorEncountered = true;
        }

        if(errorEncountered === true){
            window.scrollTo({
                top: contactsError?.length > 0 
                ? window.scrollY + attachImagesDivRef.current.getBoundingClientRect().top 
                : 320, behavior: 'smooth'
            });
            setError('أكمل الحقول الفارغة.');
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

            if(attahcedFilesError === true) setError('أضف صور و فيديوهات تعبر عن المعروض.');

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

            const xDetails = selectedCatagories === '0' ? {
                vehicle_specifications: vehicleSpecifications,
                vehicle_addons: vehicleFeatures,
                near_places: nearPlaces
            } : {
                insurance:  requireInsurance, 
                guest_rooms: guestRoomsDetailArray, 
                facilities: companionsDetailArray, 
                bathrooms: { num: numOf.find(i => i.name === 'bathrooms')?.value, companians: bathroomsDetailArray}, 
                kitchen: { dim: { x: dimensionOf.find(i => i.name === 'kitchen')?.x, y: dimensionOf.find(i => i.name === 'kitchen')?.y }, companians: kitchenDetailArray }, 
                rooms: { num: numOf.find(i => i.name === 'rooms')?.value, single_beds: numOf.find(i => i.name === 'single beds')?.value, double_beds: numOf.find(i => i.name === 'double beds')?.value },
                near_places: nearPlaces,
                pool: { num: numOf.find(i => i.name === 'pool')?.value, dim: { x: dimensionOf.find(i => i.name === 'pool')?.x, y: dimensionOf.find(i => i.name === 'pool')?.y }, companians: poolsDetailArray }
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
            if(customersTypesArray().includes(customerType)){
                let cst = '';
                customersTypesArray().forEach((element, index) => {
                    if(customerType === element){
                        cst = customersTypesArray(true)[index];
                    }
                });
                if(cst?.length > 0) enObj.customerTypeEN = cst;
            }

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
                tempContacts?.length > 0 ? tempContacts : null, null, token, 
                capacity, customerType, enObj, cancellationsArray().indexOf(cancellation),
                VehiclesTypes.find(i => i.value === vehicleType)?.id);

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

    const showMap = () => {
        setIsMap(true);            
        if(mapUsed === false || !itemLong || !itemLat || !JordanCities || JordanCities.length <= 0){
            const obj = JordanCities.find(i => i.city_id === itemCity?.city_id);
            setLatitude(obj?.lat ? obj.lat : null);
            setLongitude(obj?.long ? obj.long : null);
        }
        setMapUsed(true);
        setMapType('select-point');
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

    if(!userId?.length > 0 || !isVerified){
        return (
            fetching ? <MySkeleton isMobileHeader={true}/> : <NotFound type={'not allowed'}/>
        )
    }

  return (
    <div className='add'>

        <span id='closePopups' onClick={() => {
            setCityPopup(false); setIsCustomerType(false); setCompaniansShow(false); setBathroomsShow(false); setKitchenShow(false);
            setPoolsShow(false); setIsCancellation(false);
        }} style={{ display: (!cityPopup && !isCustomerType && !companiansShow && !bathroomsShow && !isCancellation
            && !kitchenShow && !poolsShow) ? 'none' : undefined }}/>

        <div className='wrapper'>

            <h2>ما الذي تريد عرضه للإِيجار</h2>

            <div className='selectCatagory' style={{ width: '100%' }}>

                <CatagoryCard type={'add'} image={VehicleImage} title={'سيارة'} catagoryId={'0'} selectedCatagories={selectedCatagories} setSelectedCatagories={setSelectedCatagories}/>
                
                <CatagoryCard type={'add'} image={selectedCatagories !== '1' ? PropertyImage : PropertyWhiteImage} title={'عقار'} catagoryId={'1'} selectedCatagories={selectedCatagories} setSelectedCatagories={setSelectedCatagories}/>

            </div>

            <div className='selectKind'>
                <select value={selectedCatagories === '0' ? vehicleType : specificCatagory} onChange={(e) => {
                    setSpecificCatagory(selectedCatagories === '0' ? 'transports' : e.target.value)
                    if(selectedCatagories === '0') setVehicleType(e.target.value);
                }}>
                    <option value={'-1'} hidden selected>{selectedCatagories === '0' ? 'اختر تصنيف السيارة' : 'اختر تصنيف العقار'}</option>
                    {getCatagoryArray().map((item) => (
                        <option key={item.id} value={item.value}>{item.arabicName}</option>
                    ))}
                </select>
                <label id='error'>{specificCatagory === '-2' && 'الرجاء تحديد تصنيف'}</label>
            </div>

            <CustomInputDivWithEN isError={itemTitle === '-1' && true} errorText={'الرجاء كتابة عنوان من خمس حروف أو أكثر.'} title={'العنوان بالعربية و الانجليزية'} placholderValue={'اكتب العنوان باللغة العربية هنا'} enPlacholderValue={'اكتب العنوان باللغة الانجليزية هنا'} listener={(e) => setItemTitle(e.target.value)} enListener={(e) => setItemTitleEN(e.target.value)}/>

            <CustomInputDivWithEN isError={itemDesc === '-1' && true} errorText={'الرجاء كتابة وصف واضح عن ما تريد عرضه, بما لا يقل عن 10 كلمات.'} title={'ادخل الوصف بالعربية و الانجليزية'} isTextArea={true} placholderValue={'اكتب الوصف باللغة العربية هنا'} enPlacholderValue={'اكتب الوصف باللغة الانجليزية هنا'} listener={(e) => setItemDesc(e.target.value)} enListener={(e) => setItemDescEN(e.target.value)} type={'text'}/>

            <div className='address'>
                <div className='popup-wrapper'>
                    <CustomInputDivWithEN settingFocused={() => setCityPopup(true)} isCity={true} isError={itemCity?.value === '-1' && true} errorText={'حدد المدينة التي متاح فيها الإِيجار'} title={'المدينة'} value={itemCity?.arabicName} type={'text'} enValue={itemCity?.value === '-1' ? '' : itemCity?.value} placholderValue={'اختر مدينة'}/>
                    {cityPopup && <HeaderPopup type={'add-city'} itemCity={itemCity} setItemCity={setItemCity}/>}
                </div>
                <CustomInputDivWithEN title={'الحي'} listener={(e) => setItemNeighbour(e.target.value)} placholderValue={'اكتب اسم الحي بالعربية'} enPlacholderValue={'اكتب اسم الحي بالانجليزية'} enListener={(e) => setItemNeighbourEN(e.target.value)} type={'text'}/>
            </div>

            <div className='googleMapDiv' onClick={showMap}>
                <span>تحديد الموقع باستخدام الخريطة</span>
                <Image src={GoogleMapImage}/>
            </div>

            <div className='priceDiv'>
                <CustomInputDiv isError={itemPrice === -1 && true} errorText={'حدد سعر لليلة'} title={'السعر بالدولار'} listener={(e) => setItemPrice(Number(e.target.value))} type={'number'}/>
                <strong>/</strong>
                <h4>الليلة</h4>
            </div>

            <div className='attachFiles' ref={attachImagesDivRef}>

                <button onClick={() => inputFilesRef.current.click()}>اختيار ملف</button>

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
                    >{attachedFilesUrls.length > 0 ? 'أضف المزيد' : `اختر صور وفيدوهات لل${selectedCatagories === '0' ? 'سيارة' : 'عقار'}`}<p>(يجب أن يكون نوع الملف PNG أو JPG أو MP4 أو AVI)</p></li>
                </ul>

                <input ref={inputFilesRef} accept='.png, .jpg, .mp4, .avi' type='file' onChange={(e) => {
                    const file = e.target.files[0];
                    console.log(file);
                    if(file && allowedMimeTypes.includes(file.type)){
                        setAttachedFilesUrls([...attachedFilesUrls, file])
                    }
                }}/>

            </div>

            <div className='detailsAboutItem'>

                <h2>أضف تفاصيل عن ال{selectedCatagories === '0' ? 'سيارة' : 'عقار'}</h2>

                <div className='insuranceDetail'>
                    <h3>هل الايجار يتطلب تأمين؟</h3>
                    <input type='radio' name='insurance_group' onChange={() => setRequireInsurance(true)}/><label>نعم</label>
                    <input checked={requireInsurance ? false : true} type='radio' name='insurance_group' onChange={() => setRequireInsurance(false)}/><label>لا</label>
                </div>

                <div className='detailItem area-div' style={{ display: selectedCatagories === '0' ? 'none' : null}}>
                    <h3>حدد امكانية الغاء الحجز</h3>
                    <InfoDiv title={'الغاء الحجز'} divClick={() => setIsCancellation(!isCancellation)} value={cancellation === '' ? 'غير محدد' : cancellation}/>
                    <HeaderPopup type={'customers'} customArray={cancellationsArray()} selectedCustom={cancellation}
                    setSelectedCustom={setCancellation} isCustom={isCancellation} setIsCustom={setIsCancellation}/>
                </div>

                <div className='detailItem area-div' style={{ display: selectedCatagories === '0' ? 'none' : null}}>
                    <h3>اكتب مساحة العقار بالأمتار</h3>
                    <CustomInputDiv title={area > 0 ? `${area} متر مربع` : ''} max={1000000} min={0} myStyle={{ marginBottom: 0 }} placholderValue={'غير محدد'} type={'number'} isError={area === -1} errorText={'الرجاء ادخال مساحة صالحة'} listener={(e) => {
                        if(Number(e.target.value)) {
                            setArea(Number(e.target.value))
                        } else {
                            setArea(0);
                        };
                    }}/>
                </div>

                <div className='detailItem area-div' style={{ display: selectedCatagories === '0' ? 'none' : null}}>
                    <h3>اكتب أقصى سعة أو عدد نزلاء متاح بالعقار</h3>
                    <CustomInputDiv title={capacity > 0 ? `${capacity} نزيل` : ''} max={150000} min={-1} myStyle={{ marginBottom: 0 }} placholderValue={'كم نزيل مسموح بالعقار؟'} type={'number'} isError={capacity === -1} errorText={'الرجاء ادخال عدد من صفر الى 150000'} listener={(e) => {
                        if(Number(e.target.value)) {
                            setCapacity(Number(e.target.value))
                        } else {
                            setCapacity(0);
                        };
                    }}/>
                </div>

                <div className='detailItem area-div' style={{ display: selectedCatagories === '0' ? 'none' : null}}>
                    <h3>حدد فئة النزلاء المسموحة (اختياري)</h3>
                    <InfoDiv title={'الفئة المسموحة'} divClick={() => setIsCustomerType(!isCustomerType)} value={customerType === '' ? 'غير محدد' : customerType}/>
                    <HeaderPopup type={'customers'} customArray={customersTypesArray()} selectedCustom={customerType}
                    setSelectedCustom={setCustomerType} isCustom={isCustomerType} setIsCustom={setIsCustomerType}/>
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
                                    }}/> : <CustomInputDivWithEN placholderValue={'أضف تفصيلة بالعربي'} enPlacholderValue={'أضف ترجمة التفصيلة بالانجليزي'}  deletable 
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
                        }>{'أضف تفصيلة'}</button>
                    </div> : <div className='detailItem area-div'>

                        <h3>{item.name}</h3>

                        {item.isNum && <><div className='priceDiv'>
                            <CustomInputDiv title={'عدد ' + (item.idName === 'rooms' ? 'غرف النوم' : item.name) + ' الكلي'} listener={(e) => {
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
                            <CustomInputDiv title={'عدد ' + 'الأسرة المفردة' + ' الكلي'} listener={(e) => {
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
                            <CustomInputDiv title={'عدد ' + 'الأسرة المزدوجة' + ' الكلي'} listener={(e) => {
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
                            <CustomInputDiv title={'طول ' + (item.idName === 'pool' ? 'المسبح' : item.name)} listener={(e) => {
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
                            <strong> في </strong>
                            <CustomInputDiv title={'عرض ' + (item.idName === 'pool' ? 'المسبح' : item.name)} listener={(e) => {
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

                        {item.idName !== 'rooms' && <InfoDiv title={'أضف مرافق'} divClick={() => item.setIsShow(!item.isShow)} value={item.array?.length <= 0 ? 'لم تتم اضافة أي مرفق' : item.array?.toString()?.replaceAll(',', ', ')}/>}
                        <HeaderPopup type={'selections'} customArray={item.selectArray} selectedCustom={item.array}
                        setSelectedCustom={item.setArray} isCustom={item.isShow} setIsCustom={item.setIsShow}/>
                        
                    </div>
                ))}

            </div>

            <div className='addTermsAndConditions'></div>
            
            <div className='submitItem'>

                <h2>نصائح قبل الارسال</h2>

                <h4>- كن دقيقا في العنوان و الوصف</h4>
                
                <h4>- قم بإِضافة صور واضحة و معبرة</h4>

                <h4>- أضف أكبر قدر من المعلومات في خانة التفاصيل</h4>

                <label id='error2' style={{ padding: error.length <= 0 && 0, margin: error.length <= 0 && 0 }}>{error}</label>
                
                <label id='success' style={{ padding: !success && 0, margin: !success && 0 }}>{success && 'تم الارسال بنجاح'}</label>
                
                <button onClick={handleSubmit}>{loading ? <LoadingCircle /> : 'ارسال'}</button>
                
            </div>

        </div>

    </div>
  )
}

export default page
