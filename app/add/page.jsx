'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import './Add.css';
import CatagoryCard from '@components/CatagoryCard';
import Image from 'next/image';
import GoogleMapImage from '@assets/images/google-map-image.jpg';
import VehicleImage from '@assets/images/sedan-car.png';
import PropertyImage from '@assets/images/property.png';
import PropertyWhiteImage from '@assets/images/property-white.png';
import { JordanCities, ProperitiesCatagories, VehicleCatagories, isInsideJordan } from '@utils/Data';
import CustomInputDiv from '@components/CustomInputDiv';
import { createProperty, uploadFiles } from '@utils/api';
import HeaderPopup from '@components/popups/HeaderPopup';
import { getOptimizedAttachedFiles } from '@utils/Logic';
import ReCAPTCHA from 'react-google-recaptcha';
import { Context } from '@utils/Context';
import NotFound from '@components/NotFound';

const page = () => {

    const { 
        userId, setIsMap, setMapType,
        latitude, setLatitude, storageKey,
        longitude, setLongitude, userEmail
    } = useContext(Context);

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/avi'];
    const inputFilesRef = useRef();
    const attachImagesDivRef = useRef();

    const [selectedCatagories, setSelectedCatagories] = useState('1');
    const [error, setError] = useState('');
    const [cityPopup, setCityPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [mapUsed, setMapUsed] = useState(false);

    const [specificCatagory, setSpecificCatagory] = useState('-1');
    const [itemTitle, setItemTitle] = useState('');
    const [itemDesc, setItemDesc] = useState('');
    const [itemCity, setItemCity] = useState({});
    const [itemNeighbour, setItemNeighbour] = useState('');
    const [itemPrice, setItemPrice] = useState(0);
    const [requireInsurance, setRequireInsurance] = useState(false);
    const [attachedFilesUrls, setAttachedFilesUrls] = useState([]);
    const [itemLong, setItemLong] = useState(null);
    const [itemLat, setItemLat] = useState(null);

    const [guestRoomsDetailArray, setGuestRoomsDetailArray] = useState([]);
    const [companionsDetailArray, setCompanionsDetailArray] = useState([]);
    const [bathroomsDetailArray, setBathroomsDetailArray] = useState([]);
    const [kitchenDetailArray, setKitchenDetailArray] = useState([]);
    const [roomsDetailArray, setRoomsDetailArray] = useState([]);
    const [conditionsAndTerms, setConditionsAndTerms] = useState([]);
    const [vehicleSpecifications, setVehicleSpecifications] = useState([]);
    const [vehicleFeatures, setVehicleFeatures] = useState([]);

    const details = [
        {name: 'غرف الضيوف', array: guestRoomsDetailArray, setArray: setGuestRoomsDetailArray},
        {name: 'المرافق', array: companionsDetailArray, setArray: setCompanionsDetailArray},
        {name: 'دورات المياه', array: bathroomsDetailArray, setArray: setBathroomsDetailArray},
        {name: 'المطبخ', array: kitchenDetailArray, setArray: setKitchenDetailArray},
        {name: 'الغرف', array: roomsDetailArray, setArray: setRoomsDetailArray},
        {name: 'شروط و أحكام الحجز', array: conditionsAndTerms, setArray: setConditionsAndTerms},
    ];

    const vehiclesDetails = [
        {name: 'مواصفات السيارة', array: vehicleSpecifications, setArray: setVehicleSpecifications},
        {name: 'المزايا الاضافية', array: vehicleFeatures, setArray: setVehicleFeatures}
    ];

    const getDetails = () => {
        if(selectedCatagories === '0'){
            return vehiclesDetails;
        } else {
            return details;
        }
    }

    const getCatagoryArray = () => {
        if(selectedCatagories === '0'){
            return VehicleCatagories;
        } else {
            return ProperitiesCatagories;
        }
    };

    const handleSubmit = async() => {

        let attahcedFilesError = false;
        let errorEncountered = false;

        if(selectedCatagories !== '0' && selectedCatagories !== '1') errorEncountered = true;

        if(!VehicleCatagories.find(i => i.value === specificCatagory) 
        && !ProperitiesCatagories.find(i => i.value === specificCatagory)){
            setSpecificCatagory('-2');
            errorEncountered = true;
        }

        if(!itemTitle || typeof itemTitle !== 'string' || itemTitle.length < 5){
            setItemTitle('-1');
            errorEncountered = true;
        }

        if(!itemDesc || typeof itemDesc !== 'string' || itemDesc.length < 25){
            setItemDesc('-1');
            errorEncountered = true;
        }

        if(!itemCity || itemCity === {} || typeof itemCity.value !== 'string' || itemCity.value.length <= 0){
            const obj = itemCity;
            obj.value = '-1';
            setItemCity(obj);
            errorEncountered = true;
        }

        if(!itemNeighbour || typeof itemNeighbour !== 'string' || itemNeighbour.length > 100){
            setItemNeighbour('');
        }
        
        if(!itemPrice || typeof itemPrice !== 'number' || itemPrice <= 0 || itemPrice > 10000000000000){
            setItemPrice(-1);
            errorEncountered = true;
        }

        if(itemLong || itemLat){
            if(!isInsideJordan(itemLong, itemLat)){
                setError('خطأ في بيانات الموقع, الرجاء تحديد موقع صالح عللا الخريطة');
                errorEncountered = true;
            }
        }

        if(errorEncountered === true){
            window.scrollTo({
                top: 320, behavior: 'smooth'
            });
            setError('أكمل الحقول الفارغة.');
            setSuccess(false);
            return;
        }

        try {

            setLoading(true);

            const optimizedFiles = await getOptimizedAttachedFiles(attachedFilesUrls);

            setAttachedFilesUrls(optimizedFiles.optArr);

            //attached file, atleast one
            if(optimizedFiles.optArr.length <= 0){
                attahcedFilesError = true;
                errorEncountered = true;
            }

            //check for valid details
            if((selectedCatagories === '1' && (guestRoomsDetailArray.length + companionsDetailArray.length 
                + bathroomsDetailArray.length + kitchenDetailArray.length
                + roomsDetailArray.length + conditionsAndTerms.length) < 2)
                || (selectedCatagories === '0' && (vehicleSpecifications.length + vehicleFeatures.length) < 2)
                ){
                setError(attahcedFilesError ? 'أضف صور و فيديوهات تعبر عن المعروض و أضف على الأقل تفيصلتان في خانة التفاصيل.' : 'أضف على الأقل تفيصلتان في خانة التفاصيل.');
                errorEncountered = true;
            } else {
                if(attahcedFilesError === true) setError('أضف صور و فيديوهات تعبر عن المعروض.');
            }

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
                vehicle_addons: vehicleFeatures
            } : {
                insurance:  requireInsurance, 
                guest_rooms: guestRoomsDetailArray, 
                facilities: companionsDetailArray, 
                bathrooms: bathroomsDetailArray, 
                kitchen: kitchenDetailArray, 
                rooms: roomsDetailArray 
            };
            
            const res = await createProperty(
                selectedCatagories === '0' ? true : false, 
                specificCatagory, itemTitle, itemDesc, 
                itemCity.value, itemNeighbour, [itemLong, itemLat], itemPrice, 
                xDetails, conditionsAndTerms);

            console.log('res: ', res);    

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
        console.log('city changed');
        setMapUsed(false);
    }, [itemCity]);

    useEffect(() => {
        console.log(guestRoomsDetailArray);
    }, [guestRoomsDetailArray]);

    if(!userId?.length > 0){
        return (
            <NotFound type={'not allowed'}/>
        )
    }

  return (
    <div className='add'>

        <span id='closePopups' onClick={() => setCityPopup(false)} style={{ display: !cityPopup && 'none' }}/>

        <div className='wrapper'>

            <h2>ما الذي تريد عرضه للإِيجار</h2>

            <div className='selectCatagory'>

                <CatagoryCard type={'add'} image={VehicleImage} title={'سيارة'} catagoryId={'0'} selectedCatagories={selectedCatagories} setSelectedCatagories={setSelectedCatagories}/>
                
                <CatagoryCard type={'add'} image={selectedCatagories !== '1' ? PropertyImage : PropertyWhiteImage} title={'عقار'} catagoryId={'1'} selectedCatagories={selectedCatagories} setSelectedCatagories={setSelectedCatagories}/>

            </div>

            <div className='selectKind'>
                <select value={specificCatagory} onChange={(e) => setSpecificCatagory(e.target.value)}>
                    <option value={'-1'} hidden selected>{selectedCatagories === '0' ? 'اختر تصنيف السيارة' : 'اختر تصنيف العقار'}</option>
                    {getCatagoryArray().map((item) => (
                        <option key={item._id} value={item.value}>{item.arabicName}</option>
                    ))}
                </select>
                <label id='error'>{specificCatagory === '-2' && 'الرجاء تحديد تصنيف'}</label>
            </div>

            <CustomInputDiv isError={itemTitle === '-1' && true} errorText={'الرجاء كتابة عنوان من خمس حروف أو أكثر.'} title={'العنوان'} placholderValue={itemTitle} listener={(e) => setItemTitle(e.target.value)}/>

            <CustomInputDiv isError={itemDesc === '-1' && true} errorText={'الرجاء كتابة وصف واضح عن ما تريد عرضه, بما لا يقل عن 10 كلمات.'} title={'الوصف'} isTextArea={true} listener={(e) => setItemDesc(e.target.value)} type={'text'}/>

            <div className='address'>
                <div className='popup-wrapper'>
                    <CustomInputDiv settingFocused={() => setCityPopup(true)} isCity={true} isError={itemCity?.value === '-1' && true} errorText={'حدد المدينة التي متاح فيها الإِيجار'} title={'المدينة'} value={itemCity?.arabicName} type={'text'}/>
                    {cityPopup && <HeaderPopup type={'add-city'} itemCity={itemCity} setItemCity={setItemCity}/>}
                </div>
                <CustomInputDiv title={'الحي'} listener={(e) => setItemNeighbour(e.target.value)} type={'text'}/>
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

                <input ref={inputFilesRef} accept='.png, .jpeg, .mp4, .avi' type='file' onChange={(e) => {
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
                
                {getDetails().map((item) => (
                    <div className='detailItem'>
                        <h3>{item.name}</h3>
                        <ul>
                            {item.array.map((obj, myIndex) => (
                                <li key={myIndex}>
                                    <CustomInputDiv placholderValue={obj} value={obj} deletable handleDelete={() => {
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
                                    }}/>
                                </li>
                            ))}
                        </ul>
                        <button style={{ marginTop: item.array.length <= 0 && 'unset' }} onClick={
                            () => item.setArray([...item.array, ''])
                        }>{'أضف تفصيلة'}</button>
                    </div>
                ))}

            </div>

            <div className='addTermsAndConditions'></div>
            
            <div className='submitItem'>

                <h2>نصائح قبل الارسال</h2>

                <h4>- كن دقيقا في العنوان و الوصف</h4>
                
                <h4>- قم بإِضافة صور واضحة و معبرة</h4>

                <h4>- أضف أكبر قدر من المعلومات في خانة التفاصيل</h4>

                <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}/>

                <label id='error2' style={{ padding: error.length <= 0 && 0, margin: error.length <= 0 && 0 }}>{error}</label>
                
                <label id='success' style={{ padding: !success && 0, margin: !success && 0 }}>{success && 'تم الارسال بنجاح'}</label>
                
                <button onClick={handleSubmit}>{loading ? 'جاري الارسال ...' : 'ارسال'}</button>
                
            </div>

        </div>

    </div>
  )
}

export default page
