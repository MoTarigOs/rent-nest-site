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
import { getBookDateFormat, getOptimizedAttachedFiles, isValidArrayOfStrings, isValidContactURL } from '@utils/Logic';
import MyCalendar from '@components/MyCalendar';
import MySkeleton from '@components/MySkeleton';
import NotFound from '@components/NotFound';
import { contactsPlatforms } from '@utils/Data';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const Page = () => {

    const id = useSearchParams().get('id');

    const {
        userId, storageKey, userEmail, loadingUserInfo, isVerified
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
    const [itemDesc, setItemDesc] = useState('');
    const [itemPrice, setItemPrice] = useState(0);
    const [requireInsurance, setRequireInsurance] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [attachedFilesUrls, setAttachedFilesUrls] = useState([]);
    const [discountPer, setDiscountPer] = useState(0);
    const [discountNights, setDiscountNights] = useState(0);

    const [guestRoomsDetailArray, setGuestRoomsDetailArray] = useState([]);
    const [companionsDetailArray, setCompanionsDetailArray] = useState([]);
    const [bathroomsDetailArray, setBathroomsDetailArray] = useState([]);
    const [kitchenDetailArray, setKitchenDetailArray] = useState([]);
    const [roomsDetailArray, setRoomsDetailArray] = useState([]);
    const [conditionsAndTerms, setConditionsAndTerms] = useState([]);
    const [vehicleSpecifications, setVehicleSpecifications] = useState([]);
    const [vehicleFeatures, setVehicleFeatures] = useState([]);
    
    const [filesToDelete, setFilesToDelete] = useState([]);

    const { executeRecaptcha } = useGoogleReCaptcha();

    const getRecaptchaToken = async() => {
      if (!executeRecaptcha) return;
      const gReCaptchaToken = await executeRecaptcha('submit');
      return gReCaptchaToken;
    };

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
        if(item.type_is_vehicle){
            return vehiclesDetails;
        } else {
            return details;
        }
    };

    const handleSubmit = async() => {

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

        if(
            !item.type_is_vehicle 
            && itemTitle === item.title
            && itemDesc === item.description
            && itemPrice === item.price
            && requireInsurance === item.details.insurance
            && conditionsAndTerms === item.terms_and_conditions
            && guestRoomsDetailArray === item.details.guest_rooms
            && companionsDetailArray === item.details.facilities
            && bathroomsDetailArray === item.details.bathrooms
            && kitchenDetailArray === item.details.kitchen
            && roomsDetailArray === item.details.rooms
            && attachedFilesUrls.length <= 0
            && uploadedFiles.toString() === [...item.images, ...item.videos].toString()
            && filesToDelete.length <= 0
            && discountPer === item.discount?.percentage && discountNights === item.discount?.num_of_days_for_discount
            && JSON.stringify(tempContacts) === JSON.stringify(tempItemContacts) || (tempContacts.length <= 0 && (item.contacts === null || item.contacts === undefined))
        ){
            setError('لم يتم تعديل أي بيانات');
            setSuccess(false);
            return;
        } else if(
            item.type_is_vehicle
            && itemTitle === item.title
            && itemDesc === item.description
            && itemPrice === item.price
            && requireInsurance === item.details.insurance
            && conditionsAndTerms === item.terms_and_conditions
            && vehicleSpecifications === item.details.vehicle_specifications
            && vehicleFeatures === item.details.vehicle_addons
            && attachedFilesUrls.length <= 0
            && uploadedFiles.toString() === [...item.images, ...item.videos].toString()
            && filesToDelete.length <= 0
            && discountPer === item.discount?.percentage && discountNights === item.discount?.num_of_days_for_discount
            && JSON.stringify(tempContacts) === JSON.stringify(tempItemContacts) || (tempContacts.length <= 0 && (item.contacts === null || item.contacts === undefined))
        ) {
            setError('لم يتم تعديل أي بيانات');
            setSuccess(false);
            return;
        }

        let attahcedFilesError = false;
        let errorEncountered = false;
        let newItem = null;

        if(!itemTitle || typeof itemTitle !== 'string' || itemTitle.length < 5){
            setItemTitle('-1');
            errorEncountered = true;
        }

        if(!itemDesc || typeof itemDesc !== 'string' || itemDesc.length < 25){
            setItemDesc('-1');
            errorEncountered = true;
        }
        
        if(!itemPrice || typeof itemPrice !== 'number' || itemPrice <= 0 || itemPrice > 10000000000000){
            setItemPrice(-1);
            errorEncountered = true;
        }

        if(!tempContacts?.length > 0){
            setContactsError('الرجاء كتابة طريقة تواصل واحدة على الأقل.');
            errorEncountered = true;
        } else {
            for (let i = 0; i < tempContacts.length; i++) {
                if(!isValidContactURL(tempContacts[i])) {
                    setContactsError('هنالك رابط غير صالح, الرجاء اختيار منصة و ادخال رابط صالح.');
                    errorEncountered = true;
                }
            }
        }

        if(discountNights > 0 && (typeof discountNights !== 'number' || discountNights < 0 || discountNights > 2000)){
            setDiscountNights(-1);
            errorEncountered = true;
        }

        if(discountPer > 0 && (typeof discountPer !== 'number' || discountPer < 0 || discountPer > 100)){
            setDiscountPer(-1);
            errorEncountered = true;
        }

        if(errorEncountered === true){
            if(!contactsError?.length > 0)
                window.scrollTo({
                    top: 320, behavior: 'smooth'
                });
            setError('أكمل الحقول الفارغة.');
            setSuccess(false);
            return;
        }

        setContactsError('');

        const xDiscount = () => {
            if(discountPer <= 0) return null;
            return {
                num_of_days_for_discount: (!discountNights || discountNights < 0) ? 0 : discountNights,
                percentage: discountPer
            };
        };

        try {

            setLoading(true);

            const optimizedFiles = await getOptimizedAttachedFiles(attachedFilesUrls);

            setAttachedFilesUrls(optimizedFiles.optArr);

            //attached and uploaded files, atleast one exist
            if(optimizedFiles.optArr.length <= 0 && uploadedFiles.length <= 0){
                attahcedFilesError = true;
                errorEncountered = true;
            }

            //check for valid details
            if((!item.type_is_vehicle && (guestRoomsDetailArray.length + companionsDetailArray.length 
                + bathroomsDetailArray.length + kitchenDetailArray.length
                + roomsDetailArray.length + conditionsAndTerms.length) < 2)
                || (item.type_is_vehicle && (vehicleSpecifications.length + vehicleFeatures.length) < 2)
                ){
                setError(attahcedFilesError ? 'أضف صور و فيديوهات تعبر عن المعروض و أضف على الأقل تفيصلتان في خانة التفاصيل.' : 'أضف على الأقل تفيصلتان في خانة التفاصيل.');
                errorEncountered = true;
            } else {
                if(attahcedFilesError === true) setError('يجب أن يحتوي العرض على صورة واحدة على الأقل.');
            }

            if(errorEncountered === true) {
                setSuccess(false);
                setLoading(false);
                return;
            };

            const xDetails = item.type_is_vehicle ? {
                insurance:  requireInsurance,
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

            const token = await getRecaptchaToken();

            let res = null;

            if(
                !item.type_is_vehicle 
                && itemTitle === item.title
                && itemDesc === item.description
                && itemPrice === item.price
                && requireInsurance === item.details.insurance
                && conditionsAndTerms === item.terms_and_conditions
                && guestRoomsDetailArray === item.details.guest_rooms
                && companionsDetailArray === item.details.facilities
                && bathroomsDetailArray === item.details.bathrooms
                && kitchenDetailArray === item.details.kitchen
                && roomsDetailArray === item.details.rooms
                && discountPer === item.discount?.percentage && discountNights === item.discount?.num_of_days_for_discount
                && JSON.stringify(tempContacts) === JSON.stringify(tempItemContacts) || (tempContacts.length <= 0 && (item.contacts === null || item.contacts === undefined))
            ){
                res = { success: true, dt: { message: 'no details to add' } };
            } else if(
                item.type_is_vehicle
                && itemTitle === item.title
                && itemDesc === item.description
                && itemPrice === item.price
                && requireInsurance === item.details.insurance
                && conditionsAndTerms === item.terms_and_conditions
                && vehicleSpecifications === item.details.vehicle_specifications
                && vehicleFeatures === item.details.vehicle_addons
                && discountPer === item.discount?.percentage && discountNights === item.discount?.num_of_days_for_discount
                && JSON.stringify(tempContacts) === JSON.stringify(tempItemContacts) || (tempContacts.length <= 0 && (item.contacts === null || item.contacts === undefined))
            ) {
                res = { success: true, dt: { message: 'no details to add' } };
            } else {
                res = await editProperty(
                    id, itemTitle, itemDesc, itemPrice, xDetails, conditionsAndTerms, 
                    tempContacts?.length > 0 ? tempContacts : null, xDiscount(), null,
                    token
                );
            }

            console.log('res: ', res);    

            if(res.success !== true){
                setError(res.dt.toString());
                setSuccess(false);
                setLoading(false);
                return;
            } else if(res.success === true && res.dt.message !== 'no details to add') {
                newItem = res.dt;
            }

            //upload files to storage server

            let uploadFilesRes = { success: true, dt: 'no files to upload' };
            
            if(optimizedFiles.optArr.length > 0) 
                uploadFilesRes = await uploadFiles(
                    optimizedFiles.optArr, id, storageKey, userEmail
                );

            console.log('upload res: ', uploadFilesRes);

            if(uploadFilesRes.success !== true){
                setError(uploadFilesRes.dt.toString());
                setSuccess(false);
                if(newItem?._id) setItem(newItem);
                setLoading(false);
                return;
            } else if(uploadFilesRes.success === true && attachedFilesUrls.length > 0) {
                newItem = uploadFilesRes.dt;
            };


            //delete files from storage server

            if(filesToDelete.length <= 0){
                setError('');
                if(newItem?._id) setItem(newItem);
                setSuccess(true);
                setLoading(false);
                return;
            }

            console.log('files to delete: ', filesToDelete);

            const deleteFilesRes = await deleteFiles(
                id, filesToDelete, storageKey, userEmail
            );

            if(deleteFilesRes.success !== true){
                setError(res.dt.toString());
                setSuccess(false);
                if(newItem?._id) setItem(newItem);
                setLoading(false);
                return;
            } else {
                newItem = deleteFilesRes.dt;
            }

            console.log('new item: ', newItem);

            if(newItem && newItem._id) setItem(newItem);
            setSuccess(true);
            setError('');
            setLoading(false);
            
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
            setItemDesc(item.description);
            setItemPrice(item.price);
            setUploadedFiles([...item.images, ...item.videos]);
            setRequireInsurance(item.details.insurance);
            setSelectBookedDays(item.booked_days || []);
            if(item.contacts) setContacts(item.contacts);
            setDiscountNights(item.discount?.num_of_days_for_discount);
            setDiscountPer(item.discount?.percentage);

            if(item.type_is_vehicle){
                setVehicleSpecifications(item.details.vehicle_specifications);
                setVehicleFeatures(item.details.vehicle_addons);
            } else {
                setGuestRoomsDetailArray(item.details.guest_rooms);
                setCompanionsDetailArray(item.details.facilities);
                setBathroomsDetailArray(item.details.bathrooms);
                setKitchenDetailArray(item.details.kitchen);
                setRoomsDetailArray(item.details.rooms);
            }
            
            setConditionsAndTerms(item.terms_and_conditions);

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
        if(!loadingUserInfo && userId?.length > 0) setFetchingUserInfo(false);
    }, [fetchingUserInfo]);

    const RightIconSpan = () => {
        return <span id='righticonspan'/>
    }

    if(!item || !userId?.length > 0 || !isVerified){
        return (
            (fetchingOnce || fetchingUserInfo) ? <MySkeleton isMobileHeader/> : <NotFound type={!isVerified ? 'not allowed' : undefined}/>
        )
    }

  return (

    <div className='add'>

        <span id='closePopups' onClick={() => setCityPopup(false)} style={{ display: !cityPopup && 'none' }}/>

        <div className='wrapper editProp'>

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

            <h2>تعديل العرض</h2>

            <CustomInputDiv isError={itemTitle === '-1' && true} errorText={'الرجاء كتابة عنوان من خمس حروف أو أكثر.'} value={itemTitle} title={'العنوان'} placholderValue={itemTitle} listener={(e) => setItemTitle(e.target.value)}/>

            <CustomInputDiv isError={itemDesc === '-1' && true} errorText={'الرجاء كتابة وصف واضح عن ما تريد عرضه, بما لا يقل عن 10 كلمات.'} value={itemDesc} title={'الوصف'} isTextArea={true} listener={(e) => setItemDesc(e.target.value)} type={'text'}/>

            <div className='priceDiv'>
                <CustomInputDiv isError={itemPrice === -1 && true} errorText={'حدد سعر لليلة'} value={itemPrice} title={'السعر بالدولار'} listener={(e) => setItemPrice(Number(e.target.value))} type={'number'}/>
                <strong>/</strong>
                <h4>الليلة</h4>
            </div>

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
            </div>

            <hr />

            <div className='attachFiles' ref={attachImagesDivRef}>

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

                <input ref={inputFilesRef} accept='.png, .jpeg, .mp4, .avi' type='file' onChange={(e) => {
                    const file = e.target.files[0];
                    console.log(file);
                    if(file && allowedMimeTypes.includes(file.type)){
                        setAttachedFilesUrls([...attachedFilesUrls, file])
                    }
                }}/>

            </div>

            <div className='detailsAboutItem'>

                <h2>أضف تفاصيل عن ال{item.type_is_vehicle ? 'سيارة' : 'عقار'}</h2>

                <div className='insuranceDetail'>
                    <h3>هل الايجار يتطلب تأمين؟</h3>
                    <input type='radio' name='insurance_group' checked={item.details?.insurance} onChange={() => setRequireInsurance(true)}/><label>نعم</label>
                    <input checked={item.details?.insurance} type='radio' name='insurance_group' onChange={() => setRequireInsurance(false)}/><label>لا</label>
                </div>

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
                
                {getDetails().map((item) => (
                    <div className='detailItem'>
                        <h3>{item.name}</h3>
                        <ul className='detailItem-ul'>
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
            
            <div className='submitItem submit-edit'>

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

                <div className='edits-info'>
                    سيتم تعديل  
                    {itemTitle !== item.title && <h4 style={{ marginTop: 24}}> العنوان: {itemTitle}</h4>}
                    {itemDesc !== item.description && <h4> الوصف: {itemDesc}</h4>}
                    {itemPrice !== item.price && <h4>السعر: {itemPrice}</h4>}
                    {conditionsAndTerms !== item.terms_and_conditions && <h4>الشروط و الأحكام: {conditionsAndTerms.toString()}</h4>}
                    {contactsIsChanged() && <h4>طرق التواصل</h4>}
               
                </div>

                <label id='error2' style={{ padding: error.length <= 0 && 0, margin: error.length <= 0 && 0 }}>{error}</label>
                
                <label id='success' style={{ padding: !success && 0, margin: !success && 0 }}>{success && 'تم التعديل بنجاح'}</label>
                
                <button onClick={handleSubmit}>{loading ? 'جاري التعديل ...' : 'تعديل'}</button>
                
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
