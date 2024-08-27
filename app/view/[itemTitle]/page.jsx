'use client';

import '../view-style/View.scss';
import ImagesShow from "@components/ImagesShow";
import { JordanCities, VehiclesTypes, cancellationsArray, carFuelTypesArray, carGearboxes, currencyCode, getNames, myConditions, ratingsSections, reservationType, vehicleRentTypesArray } from "@utils/Data";
import GoogleMapImage from '@assets/images/google-map-image.jpg';
import Image from "next/image";
import LocationGif from '@assets/icons/location.gif';
import Svgs from '@utils/Svgs';
import { useContext, useEffect, useState } from 'react';
import ReviewCard from '@components/ReviewCard';
import HeaderPopup from '@components/popups/HeaderPopup';
import { useSearchParams } from 'next/navigation';
import { fetchPropertyDetails, getHost, getPropIdByUnitCode, handleBooksAddRemove, handleFavourite, makeReport, sendReview } from '@utils/api';
import CustomInputDiv from '@components/CustomInputDiv';
import { Context } from '@utils/Context';
import { getDetailedResTypeNum, getNumOfBookDays, getReadableDate, isOkayBookDays, isValidContactURL, isValidNumber } from '@utils/Logic';
import MySkeleton from '@components/MySkeleton';
import NotFound from '@components/NotFound';
import Link from 'next/link';
import LoadingCircle from '@components/LoadingCircle';
import ItemImagesLoader from '@components/ItemImagesLoader';

const page = () => {

  const { 
    favouritesIds, setFavouritesIds, booksIds, 
    setBooksIds, userId, setIsMap, 
    setMapType, setLatitude, setLongitude,
    calendarDoubleValue, setCalendarDoubleValue,
    isMobile, isMobile960, isVerified,
    setIsModalOpened, userUsername, resType, setResType,
    resTypeNum, setResTypeNum, isMap
  } = useContext(Context);
  
  let id = useSearchParams().get('id');
  const unitCode = useSearchParams().get('unit');
  const isReportParam = useSearchParams().get('isReport');

  const [bookSuccess, setBookSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [canBook, setCanBook] = useState(false);
  const [runOnce, setRunOnce] = useState(false);
  const [item, setItem] = useState(null);
  const [host, setHost] = useState(null);
  const [isVideosFiles, setIsVideosFiles] = useState(false);
  const [imageFullScreen, setImageFullScreen] = useState('-1');
  const [shareDiv, setShareDiv] = useState(false);
  const [copied, setCopied] = useState(false);

  const [reviewsNumber, setReviewsNumber] = useState(6);
  const [isCalendar, setIsCalendar] = useState(false);
  const [bookDate, setBookDate] = useState(calendarDoubleValue);
  const [isSpecifics, setIsSpecifics] = useState(true);
  const [isReviews, setIsReviews] = useState(false);
  const [isMapDiv, setIsMapDiv] = useState(false);
  const [isTerms, setIsTerms] = useState(false);

  const [sendingReview, setSendingReview] = useState(false);
  const [sendReviewError, setSendReviewError] = useState('');
  const [sendReviewSuccess, setSendReviewSuccess] = useState('');
  const [scoreRate, setScoreRate] = useState(null);
  const [reviewText, setReviewText] = useState('');

  const [reportDiv, setReportDiv] = useState(false);
  const [writerId, setWriterId] = useState('');
  const [reviewsNum, setReviewsNum] = useState(null);
  const [reportText, setReportText] = useState('');
  const [reporting, setReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState('');

  const [addingToFavs, setAddingToFavs] = useState(false);
  const [addingToBooks, setAddingToBooks] = useState(false);

  const [isGuestRooms, setIsGuestRooms] = useState(false);
  const [isKitchen, setIsKitchen] = useState(false);
  const [isRooms, setIsRooms] = useState(false);
  const [isBathrooms, setIsBathrooms] = useState(false);
  const [isPlaces, setIsPlaces] = useState(false);
  const [isFeatures, setIsFeatures] = useState(false);
  const [isFacilities, setIsFacilities] = useState(false);
  const [isPool, setIsPool] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);

  const [isImagesLoader, setIsImageLoader] = useState(false);

  const [isReservationType, setIsReservationType] = useState(false);
  const [popupResTypeChange, setPopupResTypeChange] = useState(false);

  const whatsappBaseUrl = 'https://wa.me/';

  async function fetchItemDetails (fetchedId) {

    try {

      if(!id) id = fetchedId;

      if(!id || id.length < 10 || loading) return;

      setLoading(true);

      const res = await fetchPropertyDetails(id);

      if(res.success !== true) {
        setLoading(false);
        return;
      }

      console.log(res.dt);

      setItem(res.dt);
      setLoading(false);

      fetchHostDetails(res.dt.owner_id);
      
    } catch (err) {
      setLoading(false);
    }

  };

  async function fetchItemDetailsByUnitCode() {
    try {
      setLoading(true);
      const res = await getPropIdByUnitCode(unitCode);
      console.log(res);
      if(!res?.ok === true) return setLoading(false);
      fetchItemDetails(res.dt.id);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  async function fetchHostDetails (ownerId) {
    try {
      const res = await getHost(ownerId);
      if(res.ok !== true) return;
      setHost(res.dt);
    } catch (err) {
      console.log(err);
    }
  };

  const writeReview = async() => {

    try {

      if(!id || id.length <= 10 || !userId || userId.length <= 10) return;

      if(!scoreRate || typeof scoreRate !== 'number') {
        setSendReviewError('من فضلك اختر تقييما للعرض');
        setSendReviewSuccess('');
        return;
      }

      if(!reviewText){
        setSendReviewError('اكتب شرحا عن لماذا اخترت هذا التقييم');
        setSendReviewSuccess('');
        return;
      }

      setSendingReview(true);

      const res = await sendReview(scoreRate, reviewText, id);

      if(res.success !== true) {
        setSendReviewError(res.dt);
        setSendReviewSuccess('');
        setSendingReview(false);
        return;
      };

      setSendReviewError('');
      setSendReviewSuccess('تم اضافة المراجعة بنجاح');
      if(res.dt) setItem(res.dt);
      setSendingReview(false);
      
    } catch (err) {
      console.log(err.message);
      setSendReviewError(err,message);
      setSendReviewSuccess('');
      setSendingReview(false);
    }

  };

  const report = async(writerId) => {

    try {

      if(!reportText || reportText.length <= 0) return setReportText('-1');

      setReporting(true);

      const res = await makeReport(
        reportText, id, writerId
      );

      if(res?.success === true) setReportSuccess('true');
      else setReportSuccess(res?.dt || 'خطأ بالابلاغ');

      setReporting(false);
      
    } catch (err) {
      console.log(err.message);
    }

  };

  const handleFav = async() => {

    try {

      if(!userId || userId.length <= 10) return;

      setAddingToFavs(true);

      const res = await handleFavourite(id, favouritesIds?.includes(id));

      console.log(res);

      if(res.success === true && res.dt){
        setFavouritesIds(res.dt);
      }

      setAddingToFavs(false);
      
    } catch (err) {
      console.log(err.message);
      setAddingToFavs(false);
    }

  };

  const generateWhatsappText = (notLogined, isSimple) => {
    const text = !isSimple
      ? `${(notLogined || !userId?.length > 0) ? '** تحذير: هذا المستخدم ليس مسجل بالمنصة ** \n\n• ' : ''}أنا صاحب الحساب "${userUsername || 'لا يوجد اسم'}" معرف: "${userId || 'لا يوجد معرف'}" \n\n• أريد أن احجز هذا العرض\n\n• عنوان العرض: "${item.title}" \n\n• كود الوحدة (معرف العرض): "${item.unit_code}"\n\n• نوع الحجز: ${resType?.arabicName} \n\n• بدءا من التاريخ: "${getReadableDate(calendarDoubleValue?.at(0), true)}" \n\n• وحتى التاريخ: "${getReadableDate(calendarDoubleValue?.at(1), true)}"\n\n• مدة الحجز: ${getDetailedResTypeNum(true, resType, resTypeNum)}\n\n• السعر الظاهر لي: ${(getPrice('cost price') - (item.discount?.percentage > 0 ? (getPrice('cost price') * item.discount.percentage / 100) : 0)).toFixed(2)} ${currencyCode(false, false)} ${getHoildays(true) ? '\n\n• ملاحظة: تم تطبيق أسعار خاصة بأيام العطل (الخميس و الجمعة و السبت)' : ''}`
      : `${(notLogined || !userId?.length > 0) ? '** تحذير: هذا المستخدم ليس مسجل بالمنصة ** \n\n• ' : ''}أنا صاحب الحساب "${userUsername || 'لا يوجد اسم'}" معرف: "${userId || 'لا يوجد معرف'}" \n\n• أريد أن أتواصل معك بخصوص هذا العرض\n\n• عنوان العرض: "${item.title}" \n\n• كود الوحدة (معرف العرض): "${item.unit_code}\n\n • نوع الحجز: ${resType?.arabicName} \n\n• بدءا من التاريخ: "${getReadableDate(calendarDoubleValue?.at(0), true)}" \n\n• وحتى التاريخ: "${getReadableDate(calendarDoubleValue?.at(1), true)}"\n\n• مدة الحجز: ${getDetailedResTypeNum(true, resType, resTypeNum)}\n\n• السعر الظاهر لي: ${(getPrice('cost price') - (item.discount?.percentage > 0 ? (getPrice('cost price') * item.discount.percentage / 100) : 0)).toFixed(2)} ${currencyCode(false, false)} ${getHoildays(true) ? '\n\n• ملاحظة: تم تطبيق أسعار خاصة بأيام العطل (الخميس و الجمعة و السبت)' : ''}`;
    return encodeURIComponent(text);
  };

  const handleBook = async() => {

    try {

      if(userId === item.owner_id || !canBook || addingToBooks) 
        return;
        
      if(!userId || userId.length <= 10){
        let whatsapp = item?.contacts?.find(i => i.platform === 'whatsapp');
        if(whatsapp && !isNaN(Number(whatsapp.val))) {
          if(whatsapp.val?.at(0) === '0' && whatsapp.val?.at(1) === '0') 
            whatsapp.val = whatsapp.val?.replace('00', '+');
          return window.open(`${whatsappBaseUrl}/${whatsapp.val}?text=${generateWhatsappText(true)}`, '_blank');
        } else if(whatsapp && isValidContactURL(whatsapp))
          return window.open(`${whatsapp.val}?text=${generateWhatsappText(true)}`, '_blank');
        setBookSuccess('تواصل مع المعلن من قسم الشروط و التواصل');
        return;
      }

      const isAlreadyBooked = booksIds.find(i => i.property_id === id);

      if(!isAlreadyBooked) {
        let whatsapp = item?.contacts?.find(i => i.platform === 'whatsapp');
        if(isValidContactURL(whatsapp))
          openContactURL(whatsapp);
      };

      if(!booksIds.find(i => i.property_id === id) 
      && (!calendarDoubleValue?.at(0) || !calendarDoubleValue?.at(1)))
        return;

      setAddingToBooks(true);

      const res = await handleBooksAddRemove(
        id, booksIds.find(i => i.property_id === id) ? true : false, 
        calendarDoubleValue?.at(0)?.getTime(), 
        calendarDoubleValue?.at(1)?.getTime()
      );

      if(res.success === true && res.dt){
        setBooksIds(res.dt);
      }

      if(res.success === true && !booksIds.find(i => i.property_id === id)){
        setIsSpecifics(false); 
        setIsReviews(false); 
        setIsMapDiv(false); 
        setIsTerms(true);  
        setBookSuccess('تم الاضافة بنجاح, تواصل مع مقدم الخدمة من قسم الشروط و التواصل');
      } else {
        setBookSuccess('');
      }
      
      setAddingToBooks(false);

    } catch (err) {
      console.log(err.message);
      setAddingToBooks(false);
    }

    
  };

  const getShareUrl = () => {
    return window.location.origin.toString() 
    + `/view/unit${item.unit_code}?unit=${item.unit_code}`;
  };

  const showMap = () => {
    
    const obj = JordanCities.find(i => i.value === item?.city);

    if(item?.map_coordinates?.at(1)){
      setLatitude(item.map_coordinates[1]);
    } else {
      setLatitude(obj?.lat ? obj.lat : null);
    }

    if(item?.map_coordinates?.at(0)){
      setLongitude(item.map_coordinates[0]);
    } else {
      setLongitude(obj?.long ? obj.long : null);
    }

    setIsMap(true);  

    setMapType('view');

  };

  const isAbleToBook = () => {
    if(!item?.is_able_to_book) return false;
    if(!isOkayBookDays(calendarDoubleValue, item.booked_days)) return false;
    if(!userId?.length > 10) return false;
    if(userId?.length > 10 && !isVerified) return false;
    if(isNaN(getPrice('cost price'))) return false;
    return true;
  };

  const copyUrl = async() => {
    setCopied(false);
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
    } catch (err) {}
  };

  const getDesiredContact = (returnObj, isPhone, navigate) => {
    if(!item.contacts || item.contacts.length <= 0) return null;
    for (let i = 0; i < item.contacts.length; i++) {
      if(item.contacts?.at(i)?.platform === 'whatsapp'){
        let whatsapp = item.contacts[i];
        if(returnObj) return whatsapp;
        else if(navigate && isValidNumber(Number(whatsapp?.val))) {
            if(whatsapp.val?.at(0) === '0' && whatsapp.val?.at(1) === '0') 
              whatsapp.val = whatsapp.val?.replace('00', '+');
            return window.open(`${whatsappBaseUrl}/${whatsapp.val}?text=${generateWhatsappText(!userId, true)}`, '_blamk');
        } else if(navigate && isValidContactURL(whatsapp)) { 
            return window.open(`${whatsapp?.val}?text=${generateWhatsappText(!userId, true)}`, '_blank');
        }
        return null;
      }
    }
    if(isValidContactURL(item.contacts[0]) && returnObj)
      return item.contacts[0];
    else if(isValidContactURL(item.contacts[0]) && navigate)
      return window.open(item.contacts[0]?.val, '_blank');

    return null;    
  };

  const openContactURL = (myContact) => {
    console.log('myContact: ', myContact, isValidContactURL(myContact));
    if(!myContact?.platform) return '';
    if(myContact.platform === 'whatsapp'){
      if(myContact && isValidNumber(Number(myContact.val))) {
        if(myContact.val?.at(0) === '0' && myContact.val?.at(1) === '0') 
          myContact.val = myContact.val?.replace('00', '+');
        return window.open(`${whatsappBaseUrl}/${myContact.val}?text=${generateWhatsappText(null, true)}`, '_blank');
      } else if(myContact){
          return window.open(`${myContact.val}?text=${generateWhatsappText(null, true)}`, '_blank');
      } else return;
    }
    return window.open(myContact.val, '_blank');
  };

  const getReasonForNotBook = () => {
    if(!item?.is_able_to_book) return 'لا يقبل حجوزات حاليا';
    if(!isOkayBookDays(calendarDoubleValue, item.booked_days)) return 'أيام غير متاحة للحجز';
    if(!userId?.length > 10) return 'سجل الدخول';
    if(userId?.length > 10 && !isVerified) return 'اثبت ملكية الحساب';
    if(!booksIds.find(i => i.property_id === id) 
    && (!calendarDoubleValue?.at(0) || !calendarDoubleValue?.at(1))) return 'حدد أيام الحجز';
    if(isNaN(getPrice('cost price'))) return 'طريقة حجز غير صالحة';
    return 'لا يمكن الحجز';
  };

  const getPriceReservationType = () => {
    if(item?.prices?.daily) return setResType(reservationType()?.find(i=>i.value?.toLowerCase() === 'daily'));
    if(item?.prices?.weekly) return setResType(reservationType()?.find(i=>i.value?.toLowerCase() === 'weekly'));
    if(item?.prices?.monthly) return setResType(reservationType()?.find(i=>i.value?.toLowerCase() === 'monthly'));
    if(item?.prices?.seasonly) return setResType(reservationType()?.find(i=>i.value?.toLowerCase() === 'seasonly'));
    if(item?.prices?.yearly) return setResType(reservationType()?.find(i=>i.value?.toLowerCase() === 'yearly'));
    if(item?.prices?.events) return setResType(reservationType(null, null, null, item.specific_catagory === 'farm')?.find(i=>i.value?.toLowerCase() === 'events'));
    return null;
  };

  const getPrice = (priceType) => {

    switch(priceType){

      case 'main price':
        if(resType?.value?.toLowerCase() === 'daily') return item.prices?.daily || 'سعر غير محدد';
        else if(resType?.value?.toLowerCase() === 'weekly') return item.prices?.weekly || 7 * item.prices?.daily || 'سعر غير محدد';
        else if(resType?.value?.toLowerCase() === 'monthly') return item.prices?.monthly || Math.round(4.285714285 * item.prices?.weekly) || 30 * item.prices?.daily || 'سعر غير محدد';
        else if(resType?.value?.toLowerCase() === 'seasonly') return item.prices?.seasonly || 'سعر غير محدد';
        else if(resType?.value?.toLowerCase() === 'yearly') return item.prices?.yearly || Math.round(12.16666666 * item.prices?.monthly) || Math.round(52.1428571 * item.prices?.weekly) || 365 * item.prices?.daily || 'سعر غير محدد';
        else if(resType?.value?.toLowerCase() === 'events') return item.prices?.eventsPrice || 'سعر غير محدد';
        else return 'سعر غير محدد';

      case 'cost price':
        if(resType?.value?.toLowerCase() === 'daily') return getHoildays();
        else if(resType?.value?.toLowerCase() === 'weekly') return resTypeNum * item.prices?.weekly || resTypeNum * 7 * item.prices?.daily || 'سعر غير محدد';
        else if(resType?.value?.toLowerCase() === 'monthly') return resTypeNum * item.prices?.monthly || resTypeNum * Math.round(4.285714285 * item.prices?.weekly) || resTypeNum * 30 * item.prices?.daily || 'سعر غير محدد';
        else if(resType?.value?.toLowerCase() === 'seasonly') return resTypeNum * item.prices?.seasonly || 'سعر غير محدد';
        else if(resType?.value?.toLowerCase() === 'yearly') return resTypeNum * item.prices?.yearly || resTypeNum * Math.round(12.16666666 * item.prices?.monthly) || resTypeNum * Math.round(52.1428571 * item.prices?.weekly) || resTypeNum * 365 * item.prices?.daily || 'سعر غير محدد';
        else if(resType?.value?.toLowerCase() === 'events') return resTypeNum * item.prices?.eventsPrice || 'سعر غير محدد';
        else return 'سعر غير محدد';

      case 'test res type existence':
        if(resType?.value?.toLowerCase() === 'daily' && item.prices?.daily > 0) return true;
        else if(resType?.value?.toLowerCase() === 'weekly' && item.prices?.weekly > 0) return true;
        else if(resType?.value?.toLowerCase() === 'monthly' && item.prices?.monthly > 0) return true;
        else if(resType?.value?.toLowerCase() === 'seasonly' && item.prices?.seasonly > 0) return true;
        else if(resType?.value?.toLowerCase() === 'yearly' && item.prices?.yearly > 0) return true;
        else if(resType?.value?.toLowerCase() === 'events' && item.prices?.eventsPrice > 0) return true;
        else return false;

    }

  };

  const getDetailText = (obj, objType, index) => {

    const str = `
      ${getNames('one', false, false, objType) + ' ' + ((index + 1) || '')}
      ${obj?.room_type ? (roomTypesArray().includes(obj?.room_type) ? obj?.room_type : roomTypesArray()[roomTypesArray(true).indexOf(obj?.room_type)]) : ''} 
      ${obj?.capacity ? 'بسعة ' + obj?.capacity + ' شخص' : ''} 
      ${obj?.dim ? 'بعرض ' + obj?.dim?.y + ' متر و بطول ' + obj?.dim?.x + ' متر ' : ''} 
      ${obj?.single_beds ? ', ' + obj?.single_beds + ' سرير مفرد ' : ''} 
      ${obj?.double_beds ? ', ' + obj?.double_beds + ' سرير ماستر ' : ''} 
      ${obj?.depth ? ', و بعمق ' + obj?.depth + ' متر ' : ''}
    `
    return str;

  };

  const settingReviewsNum = () => {
    const five = item?.num_of_reviews_percentage?.five;
    const four = item?.num_of_reviews_percentage?.four;
    const three = item?.num_of_reviews_percentage?.three;
    const two = item?.num_of_reviews_percentage?.two;
    const one = item?.num_of_reviews_percentage?.one;
    const total = five + four + three + two + one;
    if(total <= 0) return;
    setReviewsNum({
      five: five / total * 100,
      four: four / total * 100,
      three: three / total * 100,
      two: two / total * 100,
      one: one / total * 100,
    });
  };

  const getReviewTextHolder = () => {
    const x = Math.round(scoreRate);
    if(x === 5) return 'سعيدين لمعرفة أن' + (item.type_is_vehicle ? ' السيارة' : ' العقار') + ' نال على اعجابك, من فضلك اكتب وصفا بسيطا عن تجربتك.';
    if(x === 4) return 'من الجيد معرفة أن' + (item.type_is_vehicle ? ' السيارة' : ' العقار') + ' نال على استحسانك, من فضلك اكتب عن الجوانب التي يمكن تحسينها.';
    if(x === 3) return 'ما المشاكل التي قابلتك أو الجوانب التي تقترح تحسينها ؟';
    if(x === 2) return 'نتأسف لسماع ذلك, ما سبب عدم اعجابك ب' + (item.type_is_vehicle ? 'السيارة' : 'العقار') + '؟ ';
    if(x === 1) return 'نعتذر لك جدا عن التجربة السيئة التي خضتها, من فضلك اكتب عن المشاكل التي قابلتك و جعلت تجربتك سيئة.';
  };

  const getRatingText = () => {
    const x = Math.round(scoreRate);
    const obj = ratingsSections.find(i=>i.value === x);
    return obj?.arabicName + ' ' + obj?.emoji;
  };

  const getHoildays = (isExist) => {
    let isThursday = false;
    let isFriday = false;
    let isSaturday = false;
    console.log('calenderDoubleValue: ', calendarDoubleValue);
    for (let i = calendarDoubleValue?.at(0)?.getTime() + 86400000; i <= calendarDoubleValue?.at(1)?.getTime(); i += 86400000) {
        const dayNum = (new Date(i)).getDay();
        if(dayNum === 4 && item.prices?.thursdayPrice > 0) isThursday = true;
        if(dayNum === 5 && item.prices?.fridayPrice > 0) isFriday = true;
        if(dayNum === 6 && item.prices?.saturdayPrice > 0) isSaturday = true;
    }
    if(isExist) return isThursday || isFriday || isSaturday || false;
    if(!item.prices?.daily) return 'سعر غير محدد';
    let pp = resTypeNum * item.prices?.daily;
    if(isThursday) pp = pp - item.prices?.daily + item.prices?.thursdayPrice;
    if(isFriday) pp = pp - item.prices?.daily + item.prices?.fridayPrice;
    if(isSaturday) pp = pp - item.prices?.daily + item.prices?.saturdayPrice;
    return pp;
  };

  const showAllSpecs = () => {
    const xxx = !isAtleastOneSpecShowed();
    setIsGuestRooms(xxx);
    setIsKitchen(xxx);
    setIsRooms(xxx);
    setIsBathrooms(xxx);
    setIsPlaces(xxx);
    setIsFeatures(xxx);
    setIsFacilities(xxx);
    setIsPool(xxx);
  };

  const isAtleastOneSpecShowed = () => {
    if(isGuestRooms
      || isKitchen
      || isRooms
      || isBathrooms
      || isPlaces
      || isFeatures
      || isFacilities
      || isPool) return true;
    else return false;
  };

  useEffect(() => {
    setRunOnce(true);
    setCanBook(isAbleToBook());
  }, []);

  useEffect(() => {
    setCanBook(isAbleToBook());
    getPriceReservationType();
    settingReviewsNum();
  }, [item]);

  useEffect(() => {
    if(runOnce === true) {
      if(id) {
        fetchItemDetails();
      } else if(unitCode) {
        fetchItemDetailsByUnitCode();
      } else {
        setFetching(false);
      }
      const obj = booksIds.find(i => i.property_id === id);
      if(obj && obj.date_of_book_start > Date.now()){
        setBookDate([
          new Date(obj.date_of_book_start),
          new Date(obj.date_of_book_end)
        ]);
      }
    }
  }, [runOnce]);

  useEffect(() => {
    if(calendarDoubleValue?.at(1)?.getTime() - calendarDoubleValue?.at(0)?.getTime() < 80000000)
      setBookDate([new Date, new Date(Date.now() + 86400000)]);
    setCanBook(isAbleToBook());
  }, [bookDate]);

  const handleDays = (isPopupChange) => {

    const daysBooked = getNumOfBookDays(calendarDoubleValue);

    const setDayBook = () => {
      setResType(reservationType()?.find(i=>i.id===0));
      setResTypeNum(daysBooked);
    };

    const setWeekBook = () => {
      setResType(reservationType()?.find(i=>i.id===1));
      setResTypeNum(daysBooked / 7);
    };

    const setMonthBook = () => {
      setResType(reservationType()?.find(i=>i.id===2));
      setResTypeNum(daysBooked / 30);
    };

    const setYearBook = () => {
      setResType(reservationType()?.find(i=>i.id===4));
      setResTypeNum(daysBooked / 365);
    };

    const setResTypeFromDaysBooked = () => {
      if(daysBooked < 7) return setDayBook();
      if(daysBooked < 30) return setWeekBook();
      if(daysBooked < 365) return setMonthBook();
      return setYearBook();
      // if(daysBooked < 7) return setSesBook();
    }
    
    if(!isPopupChange) setResTypeFromDaysBooked();
    else if(resType?.id === 0) { 
      setCalendarDoubleValue([
        new Date(calendarDoubleValue?.at(0) || Date.now()), 
        new Date((calendarDoubleValue?.at(0) || Date.now()) + 86400000)
      ]); 
      setResTypeNum(1); 
    }
    else setResTypeNum(1);

    const setSeasonBook = () => {};

    setCanBook(isAbleToBook());

  };

  useEffect(() => {
    handleDays();
  }, [calendarDoubleValue]);

  useEffect(() => {
    if(!popupResTypeChange) return;
    if(popupResTypeChange) handleDays(true);
    setPopupResTypeChange(false);
  }, [popupResTypeChange]);

  useEffect(() => {
    if(!loading && item) setFetching(false);
  }, [loading, item]);

  useEffect(() => {
    if(isCheckout || isImagesLoader) return setIsModalOpened(true);
    setIsModalOpened(false);
  }, [isCheckout, isImagesLoader]);

  useEffect(() => {
    setIsImageLoader(false);
    setIsCheckout(false);
  }, [isMobile960]);

  const RightIconSpan = () => {
    return <span id='righticonspann'/>
  };

  const DiscountSticker = ({ disNum }) => {
    return <div className='dicount-sticker'>
        <span style={{ color: 'white' }}>عرض لفترة محدودة</span>
        <span style={{ color: 'white' }} id='main-num'>{disNum}%</span>
        <span style={{ fontSize: '0.9rem', color: 'white' }}>تخفيض</span>
    </div>
  };

  if(!item){
    return (
        (fetching || loading) ? <MySkeleton isMobileHeader={true}/> : <NotFound />
    )
  };

  return (
    <div className="view" style={{ 
      overflow: 'hidden', 
      zIndex: isMap ? 1 : undefined
    }}>

      {reportDiv && <div className='reportDiv'>

        {!userId?.length > 0 
        ? <h2>قم بالتسجيل أولاً للإبلاغ عن العروض والمراجعات</h2>
        : <>
          <h2>إِبلاغ عن {writerId?.length > 0 ? 'هذه المراجعة' : 'هذا العرض'} <Svgs name={'cross'} on_click={() => { setReportDiv(false); setWriterId(''); }}/></h2>

          <CustomInputDiv title={'سبب الإِبلاغ'} isError={reportText === '-1' && true} errorText={'الرجاء كتابة سبب للإِبلاغ'} value={reportText === '-1' ? '' : reportText} listener={(e) => setReportText(e.target.value)}/>

          <button onClick={() => {
            if(writerId?.length > 0) {
              report(writerId);
            } else {
              report(null);
            }
          }}>{reporting ? <LoadingCircle /> : 'إِبلاغ'}</button>

          {reportSuccess?.length > 0 && <p style={{ marginTop: 12 }} id={reportSuccess === 'true' ? 'success' : 'error'}>{reportSuccess === 'true' ? 'تم الابلاغ بنجاح' : reportSuccess}</p>}
        </>}

      </div>}

      {shareDiv && <div className='reportDiv shareDiv'>
        <h2>استعمل هذا الرابط للاشارة الى هذا العرض
          <Svgs name={'cross'} on_click={() => setShareDiv(false)}/>
        </h2>  
        <p>{getShareUrl()}</p>
        <button className='editDiv' onClick={copyUrl}
          id={copied ? 'share-url-copied' : ''}>
          {copied ? 'تم النسخ' : 'نسخ'} 
          {copied ? <RightIconSpan /> : <Svgs name={'copy'}/>}
        </button>
      </div>}

      {imageFullScreen !== '-1' && <div className='full-screen'>
        <Svgs name={'full screen down'} on_click={() => setImageFullScreen('-1')}/>
        <Image src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${imageFullScreen}`} fill={true} alt='صورة بوضع الشاشة الكامل عن العرض' />
      </div>}

      <div className='intro'>

        <div className='itemIntro desktopIntro'>

          <h1>{item.title} 
            <span id='mobile-unit-span'>{'(' + item.unit_code + ')'}</span>               
            {item.discount?.percentage > 0 && <DiscountSticker disNum={45}/>}
            <h4 onClick={() => { setReportDiv(true); setWriterId(''); }}>إِبلاغ <Svgs name={'report'}/></h4><span id='desktop-unit-span'>معرف الوحدة {'(' + item.unit_code + ')'}</span>
          </h1>
          
          <ul>
            <li><Svgs name={'star'}/> {Number(item.ratings?.val).toFixed(2)} ({item.ratings?.no} تقييم)</li>
            <li><Svgs name={item.type_is_vehicle ? 'loc vehicle' : 'location'}/> {JordanCities.find(i => i.value === item.city)?.arabicName}, {item.neighbourhood}</li>
            {(!item.type_is_vehicle && item.area > 0) && <li><Svgs name={'area'}/> المساحة {item.area} م²</li>}
            {getDesiredContact(true, true) && <li onClick={() => getDesiredContact(null, null, true)}><Svgs name={getDesiredContact(true, true)?.platform}/>{getDesiredContact(true, true)?.val}</li>}
            <li style={{ cursor: 'pointer' }} id='giveThisMarginRight' onClick={handleFav}><Svgs name={`wishlist${favouritesIds.includes(id) ? ' filled' : ''}`}/> {addingToFavs ? 'جاري الاضافة...' : (favouritesIds.includes(id) ? 'أزل من المفضلة' : 'اضف الى المفضلة')}</li>
            <li style={{ marginLeft: 0, cursor: 'pointer' }} onClick={() => setShareDiv(!shareDiv)}><Svgs name={'share'}/> مشاركة</li>
          </ul>

        </div>

        <div className='iamgesViewDiv'>
          <div className='btns'>
            <button onClick={() => setIsVideosFiles(false)} className={!isVideosFiles && 'selectedFileType'}>الصور</button>
            <button onClick={() => setIsVideosFiles(true)} className={isVideosFiles && 'selectedFileType'}>الفيديوهات</button>
          </div>
          <ImagesShow images={item.images} type={'view'} 
          setImageFullScreen={setImageFullScreen} videos={item.videos} 
          type_is_video={isVideosFiles}
          handleWishList={handleFav}/>   
        </div>

        <div id='wishlistDiv' style={{
          zIndex: isImagesLoader ? -1 : undefined
        }}>
          <span id='return-arrow' onClick={() => history.back()}><Svgs name={'dropdown arrow'}/></span>
          <Svgs name={favouritesIds?.includes(id) ? 'wishlist filled' : 'wishlist'} on_click={handleFav}/>
          <Svgs name={'share'} on_click={() => setShareDiv(!shareDiv)}/>
          <Svgs name={'report'} on_click={() => { setReportDiv(true); setWriterId(''); }}/>
        </div>    

        {isMobile960 && <span id='open-images-loader' onClick={() => {
          setIsImageLoader(true);
        }}/>}

      </div>

      <div className="aboutItem">

        <div className="details">
          
          <div className='desktopIntro'><label>الوصف</label>

          <p id='desc-p'>{item.description}</p>

          {host && <Link href={`/host?id=${item.owner_id}`} className='the-host'>
            <h3 className='header-host'>المعلن <span className='disable-text-copy'>تفاصيل عنه <Svgs name={'dropdown arrow'}/></span></h3>
            <span id='image-span' className='disable-text-copy'>{host?.firstName?.at(0) || host?.lastName?.at(0) || host?.username?.at(0)}</span>
            <div>
              <h3>{host?.firstName || host?.lastName || host?.username}</h3>
              <h4><Svgs name={'star'}/> تقييم {host?.rating || 0} {`(من ${host?.reviewsNum || 0} مراجعة)`}</h4>
            </div>
            <p>{host?.units || 0} وحدة على المنصة</p>
          </Link>}</div>

          <ul className='tabButtons'>
            <li className={isSpecifics && 'selectedTab'} onClick={() => {setIsSpecifics(true); setIsReviews(false); setIsMapDiv(false); setIsTerms(false)}}>المواصفات</li>
            <li className={isReviews && 'selectedTab'} onClick={() => {setIsSpecifics(false); setIsReviews(true); setIsMapDiv(false); setIsTerms(false)}}>التقييمات</li>
            <li className={isMapDiv && 'selectedTab'} onClick={() => {setIsSpecifics(false); setIsReviews(false); setIsMapDiv(true); setIsTerms(false)}}>الخريطة</li>
            <li className={isTerms && 'selectedTab'} onClick={() => {setIsSpecifics(false); setIsReviews(false); setIsMapDiv(false); setIsTerms(true)}}>{isMobile ? 'الشروط' : 'الشروط و التواصل'}</li>
          </ul>
          
          {isSpecifics && <div className='mobileIntro'><div className='itemIntro mobileIntro'>

              <h1>{item.title} <span id='mobile-unit-span'>{'(' + item.unit_code + ')'}</span><span id='desktop-unit-span'>معرف الوحدة {'(' + item.unit_code + ')'}</span></h1>

              <ul>
                <li><Svgs name={'star'} pathStyle={{ fill: 'var(--secondColor)', stroke: 'var(--secondColor)' }}/> {Number(item.ratings?.val).toFixed(2)} ({item.ratings?.no} تقييم)</li>
                <li><Svgs name={item.type_is_vehicle ? 'loc vehicle' : 'location'}/> {JordanCities.find(i => i.value === item.city)?.arabicName}, {item.neighbourhood}</li>
                {(!item.type_is_vehicle && item.area > 0) && <li><Svgs name={'area'}/> المساحة {item.area} م²</li>}
                {getDesiredContact(true, true) && <li onClick={() => getDesiredContact(null, null, true)}><Svgs name={getDesiredContact(true, true)?.platform}/>{getDesiredContact(true, true)?.val}</li>}
                {typeof item?.details?.insurance === 'boolean' && <li><Svgs name={'insurance'}/>{item.details.insurance === true ? 'يتطلب تأمين قبل الحجز' : 'لا يتطلب تأمين'}</li>}
                {item.customer_type?.toString()?.length > 0 && <li><Svgs name={'customers'}/>مخصص ل {item.customer_type?.toString()?.replaceAll(',', ', ')}</li>}
                {(item.specific_catagory === 'farm' && item.landArea?.length > 0 && Number(item.landArea) !== 0) && <li><Svgs name={'area'}/>{`مساحة الأرض ${item.landArea}`}</li>}
              </ul>

              {item.discount?.percentage > 0 && <DiscountSticker disNum={45}/>}

            </div>
            
            <label style={{ fontSize: '1rem', marginTop: 24 }}>الوصف</label>

            <p id='desc-p'>{item.description}</p>

            {host && <Link href={`/host?id=${item.owner_id}`} className='the-host'>
              <h3 className='header-host'>المعلن <span className='disable-text-copy'>تفاصيل عنه <Svgs name={'dropdown arrow'}/></span></h3>
              <span id='image-span' className='disable-text-copy'>{host?.firstName?.at(0) || host?.lastName?.at(0) || host?.username?.at(0)}</span>
              <div>
                <h3>{host?.firstName || host?.lastName || host?.username}</h3>
                <h4><Svgs name={'star'}/> تقييم {host?.rating || 0} {`(من ${host?.reviewsNum || 0} مراجعة)`}</h4>
              </div>
              <p>{host?.units || 0} وحدة على المنصة</p>
            </Link>}
          
          </div>}

          <h2>{isSpecifics ? <span>المواصفات {isMobile960 && <button onClick={showAllSpecs}>{!isAtleastOneSpecShowed() ? 'إِظهار الكل' : 'إِخفاء الكل'}</button>}</span> : isReviews ? 'التقييمات' : isMapDiv ? 'الخريطة' : isTerms ? 'الأحكام و الشروط' : ''}</h2>

          <ul className='specificationsUL disable-text-copy' style={{ display: !isSpecifics && 'none' }}>
            
            {!isMobile960 && item?.details?.insurance && <li><Svgs name={'insurance'}/><h3>{item.details.insurance === true ? 'يتطلب تأمين قبل الحجز' : 'لا يتطلب تأمين'}</h3></li>}
            {(!isMobile960 && item.cancellation >= 0 && item.cancellation < cancellationsArray().length) && <li><Svgs name={'cancellation'}/><h3>{cancellationsArray()?.at(item.cancellation)}</h3></li>}

            {!item.type_is_vehicle ? <>

              {item.customer_type && !isMobile960 && <li><Svgs name={'customers'}/><h3>الفئة المسموحة {item?.customer_type}</h3></li>}
              {item.capacity > 0 && <li><Svgs name={'guests'}/><h3>{`أقصى عدد للنزلاء ${item.capacity} نزيل`}</h3></li>}
              {(item.specific_catagory === 'apartment' && item.floor?.length > 0) && <li><Svgs name={'steps'}/><h3>{`الطابق ${item.floor}`}</h3></li>}
              {(item.specific_catagory === 'farm' && item.landArea?.length > 0 && !isMobile960) && <li><Svgs name={'area'}/><h3>{`مساحة الأرض ${item.landArea}`}</h3></li>}
              
              {item.details?.guest_rooms?.length > 0 && <li onClick={() => setIsGuestRooms(!isGuestRooms)}>
                <Svgs name={'guest room'}/>
                <h3>غرف الضيوف</h3>
                <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isGuestRooms ? '-' : '+'}</span>
                <ul style={{ display: (isGuestRooms || !isMobile) ? undefined : 'none' }}>
                  {item.details?.guest_rooms?.map((i, index) => (<li>{getDetailText(i, 'rooms', index)}</li>))}
                </ul>
              </li>}
              
              {(item.details?.kitchen?.array?.length > 0 || item.details?.kitchen?.companians?.length > 0) && <li onClick={() => setIsKitchen(!isKitchen)}>
                <Svgs name={'kitchen'}/>
                <h3>المطابخ</h3>
                <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isKitchen ? '-' : '+'}</span>
                <ul style={{ display: (isKitchen || !isMobile) ? undefined : 'none' }}>
                  {item.details?.kitchen?.array?.map((i, index) => (<li>{getDetailText(i, 'kitchen', index)}</li>))}
                </ul>
                <h3 style={{ display: (isKitchen || !isMobile) ? undefined : 'none' }} className='accompany-h3'>مرافق المطبخ</h3>
                <p style={{ display: (isKitchen || !isMobile) ? undefined : 'none' }} className='accompany-p'>{item.details?.kitchen?.companians?.toString()?.replaceAll(',', ', ')}</p>
              </li>}

              {item?.details?.rooms?.length > 0 && <li onClick={() => setIsRooms(!isRooms)}>
                <Svgs name={'rooms'}/>
                <h3>غرف النوم</h3>
                <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isRooms ? '-' : '+'}</span>
                <ul style={{ display: (!isRooms && isMobile) ? 'none' : undefined }}>
                  {item.details?.rooms?.map((i, index) => (
                    <li>{getDetailText(i, 'rooms', index)}</li>
                  ))}
                </ul>
              </li>}

              {(item.details?.bathrooms?.array?.length > 0 || item.details?.bathrooms?.companians?.length > 0) && <li onClick={() => setIsBathrooms(!isBathrooms)}>
                <Svgs name={'bathrooms'}/>
                <h3>دورات المياه</h3>
                <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isBathrooms ? '-' : '+'}</span>
                <ul style={{ display: (!isBathrooms && isMobile) ? 'none' : undefined }}>
                  {item.details?.bathrooms?.array?.map((i, index) => (<li>{getDetailText(i, 'bathrooms', index)}</li>))}
                </ul>
                <h3 style={{ display: (!isBathrooms && isMobile) ? 'none' : undefined }} className='accompany-h3'>مرافق دورات المياه</h3>
                <p style={{ display: (!isBathrooms && isMobile) ? 'none' : undefined }} className='accompany-p'>{item.details?.bathrooms?.companians?.toString()?.replaceAll(',', ', ')}</p>
              </li>}

              {(item.details?.pool?.companians?.length > 0 || item.details?.pool?.array?.length > 0) && <li onClick={() => setIsPool(!isPool)}>
                <Svgs name={'pool'}/>
                <h3>المسابح</h3>
                <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isPool ? '-' : '+'}</span>
                <ul style={{ display: (!isPool && isMobile) ? 'none' : undefined }}>
                  {item.details?.pool?.array?.map((i, index) => (<li>{getDetailText(i, 'pool', index)}</li>))}
                </ul>
                <h3 style={{ display: (!isPool && isMobile) ? 'none' : undefined }} className='accompany-h3'>مرافق المسبح</h3>
                <p style={{ display: (!isPool && isMobile) ? 'none' : undefined }} className='accompany-p'>{item.details?.pool?.companians?.toString()?.replaceAll(',', ', ')}</p>
              </li>}
              
              {item.details?.facilities?.length > 0 && <li onClick={() => setIsFacilities(!isFacilities)}>
                <Svgs name={'facilities'}/>
                <h3>المرافق</h3>
                <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isFacilities ? '-' : '+'}</span>
                <ul style={{ display: (!isFacilities && isMobile) ? 'none' : undefined }}>
                  {item.details?.facilities?.map((i) => (<li>{i}</li>))}
                </ul>
              </li>}

            </> : <>

              <li><Svgs name={'vehicle'}/><h3>{'فئة السيارة ' + VehiclesTypes?.find(i=>i.id === item.vehicle_type)?.arabicName}</h3></li>
              {typeof item?.details?.vehicle_specifications?.driver === 'boolean' && <li><Svgs name={'driver'}/><h3>{item?.details?.vehicle_specifications?.driver ? 'السيارة تأتي مع سائق' : 'السيارة تأتي بدون سائق'}</h3></li>}
              {item?.details?.vehicle_specifications?.rent_type?.length > 0 && <li><Svgs name={'car rentType'}/><h3>{'نوع الايجار ' + vehicleRentTypesArray()[vehicleRentTypesArray(true).indexOf(item?.details?.vehicle_specifications?.rent_type)]}</h3></li>}
              {item?.details?.vehicle_specifications?.company?.length > 0 && <li><Svgs name={'vehicle'}/><h3>{'نوع أو مصنّع السيارة ' + item?.details?.vehicle_specifications?.company}</h3></li>}
              {item?.details?.vehicle_specifications?.model?.length > 0 && <li><Svgs name={'vehicle'}/><h3>{'موديل السيارة ' + item?.details?.vehicle_specifications?.model}</h3></li>}
              {item?.details?.vehicle_specifications?.color?.length > 0 && <li><Svgs name={'vehicle'}/><h3>{'لون السيارة ' + item?.details?.vehicle_specifications?.color}</h3></li>}
              {item?.details?.vehicle_specifications?.year?.length > 0 && <li><Svgs name={'vehicle'}/><h3>{'سنة صنع السيارة ' + item?.details?.vehicle_specifications?.year}</h3></li>}
              {item?.details?.vehicle_specifications?.gearbox?.length > 0 && <li><Svgs name={'gearbox'}/><h3>{'ناقل الحركة ' + carGearboxes()[carGearboxes(true).indexOf(item?.details?.vehicle_specifications?.gearbox)]}</h3></li>}
              {item?.details?.vehicle_specifications?.fuel_type?.length > 0 && <li><Svgs name={'fueltype'}/><h3>{'نوع الوقود ' + carFuelTypesArray()[carFuelTypesArray(true).indexOf(item?.details?.vehicle_specifications?.fuel_type)]}</h3></li>}

            </>}

            {item.details?.near_places?.length > 0 && <li onClick={() => setIsPlaces(!isPlaces)}>
              <Svgs name={'places'}/>
              <h3>الأماكن القريبة</h3>
              <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isPlaces ? '-' : '+'}</span>
              <ul style={{ display: (!isPlaces && isMobile) ? 'none' : undefined }}>
                {item.details?.near_places?.map((i) => (<li>{i}</li>))}
            </ul></li>}

            {item.details?.features?.length > 0 && <li onClick={() => setIsFeatures(!isFeatures)}>
              <Svgs name={'places'}/>
              <h3>المميزات الخاصة</h3>
              <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isFeatures ? '-' : '+'}</span>
              <ul style={{ display: (!isFeatures && isMobile) ? 'none' : undefined }}>
                {item.details?.features?.map((i) => (<li>{i}</li>))}
            </ul></li>}

          </ul>

          <div className='reviews' style={{ display: !isReviews ? 'none' : null }}>

            <div className="reviews-layout">
            
              <div className='numbers'>
                  <h4>{item.ratings?.val}</h4>
                  <div className="rating">
                    <Svgs name={'star'} styling={Math.round(item.ratings?.val) > 0 ? true : false}/>
                    <Svgs name={'star'} styling={Math.round(item.ratings?.val) > 1 ? true : false} />
                    <Svgs name={'star'} styling={Math.round(item.ratings?.val) > 2 ? true : false} />
                    <Svgs name={'star'} styling={Math.round(item.ratings?.val) > 3 ? true : false} />
                    <Svgs name={'star'} styling={Math.round(item.ratings?.val) > 4 ? true : false} />
                </div>
                <p>{item.ratings?.no} تقييم</p>
              </div>

              <div className='charts'>
                <div>5.0 <p>{'('}{item?.num_of_reviews_percentage?.five || 0} مراجعة{')'}</p><div><span style={{ width: `${reviewsNum?.five || 0}%` }} /></div></div>
                <div>4.0 <p>{'('}{item?.num_of_reviews_percentage?.four || 0} مراجعة{')'}</p><div><span style={{ width: `${reviewsNum?.four || 0}%` }} /></div></div>
                <div>3.0 <p>{'('}{item?.num_of_reviews_percentage?.three || 0} مراجعة{')'}</p><div><span style={{ width: `${reviewsNum?.three || 0}%` }} /></div></div>
                <div>2.0 <p>{'('}{item?.num_of_reviews_percentage?.two || 0} مراجعة{')'}</p><div><span style={{ width: `${reviewsNum?.two || 0}%` }} /></div></div>
                <div>1.0 <p>{'('}{item?.num_of_reviews_percentage?.one || 0} مراجعة{')'}</p><div><span style={{ width: `${reviewsNum?.one || 0}%` }} /></div></div>
              </div>

            </div>

            {(booksIds.find(i => i.property_id === id)?.verified_book && item.owner_id !== userId && isVerified) 
            && <div className='write-review'>
                <h3>قيم و صف تجربتك لهذ{item.type_is_vehicle ? 'ه السيارة' : 'ا العقار'}</h3>

                {scoreRate !== null && <h4>{getRatingText()}</h4>}

                <div className="rating">
                  <Svgs name={'star'} styling={Math.round(scoreRate) > 0 ? true : false} on_click={() => setScoreRate(1)}/>
                  <Svgs name={'star'} styling={Math.round(scoreRate) > 1 ? true : false} on_click={() => setScoreRate(2)}/>
                  <Svgs name={'star'} styling={Math.round(scoreRate) > 2 ? true : false} on_click={() => setScoreRate(3)}/>
                  <Svgs name={'star'} styling={Math.round(scoreRate) > 3 ? true : false} on_click={() => setScoreRate(4)}/>
                  <Svgs name={'star'} styling={Math.round(scoreRate) > 4 ? true : false} on_click={() => setScoreRate(5)}/>
                </div>

                <textarea onChange={(e) => setReviewText(e.target.value)} placeholder={getReviewTextHolder()}/>
                <button onClick={writeReview}>{sendingReview ? <LoadingCircle /> : 'نشر'}</button>
                <p style={{ color: sendReviewError.length > 0 && 'var(--softRed)' }}>
                  {sendReviewError.length > 0 ? sendReviewError : sendReviewSuccess}
                </p>
            </div>}

            <ul>
              {item.reviews.slice(0, reviewsNumber).map((rv) => (
                <ReviewCard item={rv} setReportDiv={setReportDiv} setWriterId={setWriterId}
                  />
              ))}
            </ul>

            <button style={{ display: item.reviews?.length <= 0 ? 'none' : undefined }} onClick={() => setReviewsNumber(reviewsNumber + 10)}>المزيد من التقييمات</button>

          </div>

          <div className='mapDiv' style={{ display: !isMapDiv && 'none' }}>

            <div className='addressMapDiv'><Image src={LocationGif}/><h3>{JordanCities.find(i => i.value === item.city)?.arabicName}, {item.neighbourhood}</h3></div>
          
            <h5 className='moreDetailsAfterPay'><Svgs name={'info'}/>سيرسل لك المضيف تفاصيل دقيقة عن الموقع بعد تأكيد الحجز</h5>

            <div className='googleMapDiv' onClick={showMap}>
                <span>رؤية الموقع التقريبي على الخريطة</span>
                <Image src={GoogleMapImage}/>
            </div>
          
          </div>

          <ul className='termsUL' style={{ display: !isTerms && 'none' }}>
            {item.terms_and_conditions?.length > 0 && <li id='hostLiTermsUL'><Svgs name={'host'}/><h3>شروط مقدم الخدمة (المضيف)</h3>
              <ul>
                {item.terms_and_conditions.map((tc) => (
                  <li key={tc}>{tc}</li>
                ))}
              </ul>
            </li>}
            <li id='hostLiTermsUL'><Svgs name={'terms'}/><h3>شروط و أحكام المنصة</h3>
                <ul>
                  {myConditions().map((term) => (
                    <li>{term}</li>
                  ))}
                </ul>
            </li>
            {item.contacts?.length > 0 && <li id='hostLiTermsUL'><Svgs name={'communicate'}/><h3>طرق التواصل مع المضيف</h3>
                <ul>
                  {item.contacts?.map((contact, index) => (
                    isValidContactURL(contact) && <li style={{ cursor: 'pointer' }} key={index} onClick={() => openContactURL(contact)}>{contact.platform}</li>
                  ))}
                </ul>
            </li>}
          </ul>

        </div>

        <div className='checkout'>

          <h2 id='checkoutDetailsH2'>تفاصيل الحجز</h2>

          {(isCalendar && !isCheckout) && <HeaderPopup type={'calendar'} isViewPage days={item.booked_days} setCalendarDoubleValue={setCalendarDoubleValue}/>}

          <div className='nightsDiv' onClick={() => setIsReservationType(!isReservationType)}>
            <h3 id='res-type'>اختر طريقة الحجز {'(يومي, شهري, سنوي ...الخ)'}</h3>
            <h3 style={{ color: 'var(--secondColorDark)' }}>{getPrice('main price')}<span> {currencyCode()} / {reservationType(null, null, null, item.specific_catagory === 'farm')?.find(i => i.id === resType?.id)?.oneAr}</span></h3>
            <h3 style={{ width: '100%', color: '#777', display: 'flex', flexWrap: 'wrap' }}><span>عدد {reservationType(null, null, null, item.specific_catagory === 'farm')?.find(i => i.id === resType?.id)?.multipleAr}</span> {resType?.id > 0 ? getDetailedResTypeNum(false, resType, resTypeNum) : getNumOfBookDays(calendarDoubleValue)}</h3>
            {isReservationType && !isCheckout && <HeaderPopup type={'custom'} isCustom={isReservationType} selectedCustom={resType}
            setSelectedCustom={setResType} setIsCustom={setIsReservationType}
            customArray={
              item.specific_catagory === 'students' 
              ? reservationType() 
              : reservationType(null, null, null, item?.specific_catagory === 'farm')?.filter((x,i)=>i !== 3)} 
            setChanged={setPopupResTypeChange} rightIconStyle={{ transform: 'rotate(45deg)' }}/>}
            {!getPrice('test res type existence') && <p id='error'> لا يوجد حجز {reservationType(null, null, null, item.specific_catagory === 'farm')?.find(i => i.id === resType?.id)?.arName} {resType?.id !== 3 && 'سيتم حساب التكلفة بأقرب طريقة حجز متاحة (شهر أو أسبوع أو يوم)'}</p>}
          </div>

          <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
            تاريخ الحجز
            <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(0), true)}</h3>
          </div>

          <div style={{ display: resType?.id > 0 ? 'none' : undefined }} className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
            تاريخ انتهاء الحجز
            <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(1), true)}</h3>
          </div>

          {(item.prices?.thursdayPrice > 0 || item.prices?.fridayPrice > 0 || item.prices?.saturdayPrice > 0) 
            && resType?.id === 0 && getHoildays(true) && <div className='bookingDate' style={{ cursor: 'default' }}>
            سيتم تطبيق أسعار خاصة بأيام العطل
            {item.prices?.thursdayPrice > 0 && <h3>الخميس {item.prices?.thursdayPrice} {currencyCode()}</h3>}
            {item.prices?.fridayPrice > 0 && <h3>الجمعة {item.prices?.fridayPrice} {currencyCode()}</h3>}
            {item.prices?.saturdayPrice > 0 && <h3>السبت {item.prices?.saturdayPrice} {currencyCode()}</h3>}
          </div>}

          {resType?.id > 0 && <CustomInputDiv title={'ادخل عدد ' + reservationType(null, null, null, item.specific_catagory === 'farm')?.find(i => i.id === resType?.id)?.multipleAr}
           type={'number'} value={resTypeNum?.toFixed(2)} listener={(e) => {
            setResTypeNum(Number(e.target.value));
          }} myStyle={{ marginBottom: 32 }} />}

          <div className='cost' style={{ marginTop: 'auto' }}>
            <h3 style={{ display: (getNumOfBookDays(calendarDoubleValue) >= item.discount?.num_of_days_for_discount && item.discount?.percentage > 0)
              ? null : 'none' }}>تخفيض {item.discount?.percentage}% <span>- {!isNaN(getPrice()) ? (resType?.id > 0 ? resTypeNum : getPrice('cost price') * item.discount?.percentage / 100).toFixed(2) : 'سعر غير موجود'} {currencyCode(false, true)}</span></h3>
            <h3>اجمالي تكلفة {getDetailedResTypeNum(true, resType, resTypeNum)} <span>{!isNaN(getPrice('main price')) ? (getPrice('cost price') - (item.discount?.percentage ? (getPrice('cost price') * item.discount.percentage / 100) : 0)).toFixed(2) : 'سعر غير موجود'} {currencyCode(false, true)}</span></h3>
          </div>

          {isMobile && typeof item?.cancellation === 'number' && <div style={{ cursor: 'text' }} className='bookingDate cancellationDiv'>
            <Svgs name={'cancellation'}/>
            سياسة الالغاء و الاسترجاع
            <h3>{cancellationsArray()?.at(item?.cancellation)}</h3>
          </div>}

          {isMobile && item?.details?.terms_and_conditions?.length > 0 && <div style={{ cursor: 'text' }} className='bookingDate cancellationDiv'>
            <Svgs name={'host'}/>
            شروط الحجز {'(من قبل المعلن)'}
            {item?.details?.terms_and_conditions?.map((trm) => (
              <li>{trm}</li>
            ))}
          </div>}

          <button className='btnbackscndclr' id={(item.owner_id === userId || !canBook || (!booksIds.find(i => i.property_id === id) && (!calendarDoubleValue?.at(0) || !calendarDoubleValue?.at(1)))) ? 'disable-button' : ''} 
            onClick={handleBook}>
              {(item.owner_id !== userId) 
                ? (canBook 
                  ? (addingToBooks 
                    ? <LoadingCircle isLightBg/>
                    : (booksIds.find(i => i.property_id === id) ? 'أزل من الحجز' : 'احجز')) 
                  : getReasonForNotBook())
              : 'هذا عرضك الخاص'}
          </button>

          <p id='info-p' style={{ marginTop: bookSuccess?.length > 0 ? 8 : 0 }}>{bookSuccess}</p>

        </div>

      </div>

      {isMobile && <div className='mobileBookAndImages' style={isImagesLoader ? {
          height:'100dvh',
          top: 0,
          bottom: 'unset'
      } : undefined}>
        
        <ItemImagesLoader images={item?.images} videos={item?.videos}
          isShow={isImagesLoader} setIsShow={setIsImageLoader}
          setImageFullScreen={setImageFullScreen}/>
        
        <div className='mobileBookBtn'>
          <button onClick={() => setIsCheckout(true)} className='btnbackscndclr'>الحجز</button>
          <div>
            <span id={item.discount?.percentage > 0 ? 'old-price' : 'original-price'} className={item.discount?.percentage > 0 ? 'old-price' : undefined}>{getPrice('main price')} {currencyCode(false, true)}</span>
            {item.discount?.percentage > 0 && <span id='discounted-price'>{getPrice('main price') - (getPrice('main price') * (item.discount?.percentage)) / 100} {currencyCode(false, true)}</span>}
            / {reservationType(false, false, false,item.specific_catagory === 'farm')?.find(i => i.id === resType?.id)?.oneAr}
          </div>
        </div>

      </div>}

      {(isMobile) && <div className={`checkout ${isCheckout ? 'mobile-checkout-popup' : 'mobile-checkout-popup-hidden'}`}>

        {(isCalendar || isReservationType) && <span onClick={() => {
          setIsCalendar(false); setIsReservationType(false);
        }} id='spanForClosingPopups'/>}

        <h2 id='checkoutDetailsH2'>تفاصيل الحجز </h2>

        <div id='close-checkout' onClick={() => setIsCheckout(false)}><Svgs name={'cross'}/></div>

        {(isCalendar && isCheckout) && <HeaderPopup type={'calendar'} isViewPage days={item.booked_days} 
          setCalendarDoubleValue={setCalendarDoubleValue}/>}

        <div className='nightsDiv' onClick={() => setIsReservationType(!isReservationType)}>
          <h3 id='res-type'>اختر طريقة الحجز {'(يومي, شهري, سنوي ...الخ)'}</h3>
          <h3 style={{ color: 'var(--secondColorDark)' }}>{getPrice('main price')}<span> {currencyCode()} / {reservationType(null, null, null, item.specific_catagory === 'farm')?.find(i => i.id === resType?.id)?.oneAr}</span></h3>
          <h3 style={{ color: '#777' }}><span>عدد {reservationType(null, null, null, item.specific_catagory === 'farm')?.find(i => i.id === resType?.id)?.multipleAr}</span> {resType?.id > 0 ? getDetailedResTypeNum(false, resType, resTypeNum) : getNumOfBookDays(calendarDoubleValue)} </h3>
          {isReservationType && isCheckout && <HeaderPopup type={'custom'} isCustom={isReservationType} selectedCustom={resType} setChanged={setPopupResTypeChange}
          setSelectedCustom={setResType} setIsCustom={setIsReservationType}
          customArray={
            item.specific_catagory === 'students' 
            ? reservationType() 
            : reservationType(null, null, null, item.specific_catagory === 'farm')?.filter((x,i)=>i !== 3)}
          rightIconStyle={{ transform: 'rotate(45deg)' }}/>}
          {!getPrice('test res type existence') && <p id='error'> لا يوجد حجز {reservationType(null, null, null, item.specific_catagory === 'farm')?.find(i => i.id === resType?.id)?.arName} {resType?.id !== 3 && 'سيتم حساب التكلفة بأقرب طريقة حجز متاحة (شهر أو أسبوع أو يوم)'}</p>}
        </div>

        <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
          تاريخ الحجز
          <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(0), true)}</h3>
        </div>

        <div style={{ display: resType?.id > 0 ? 'none' : undefined }} className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
          تاريخ انتهاء الحجز
          <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(1), true)}</h3>
        </div>

        {(item.prices?.thursdayPrice > 0 || item.prices?.fridayPrice > 0 || item.prices?.saturdayPrice > 0) 
          && resType?.id === 0 && getHoildays(true) && <div className='bookingDate' style={{ cursor: 'default' }}>
          سيتم تطبيق أسعار خاصة بأيام العطل
          {item.prices?.thursdayPrice > 0 && <h3>الخميس {item.prices?.thursdayPrice} {currencyCode()}</h3>}
          {item.prices?.fridayPrice > 0 && <h3>الجمعة {item.prices?.fridayPrice} {currencyCode()}</h3>}
          {item.prices?.saturdayPrice > 0 && <h3>السبت {item.prices?.saturdayPrice} {currencyCode()}</h3>}
        </div>}

        {resType?.id > 0 && <CustomInputDiv title={'ادخل عدد ' + reservationType(null, null, null, item.specific_catagory === 'farm')?.find(i => i.id === resType?.id)?.multipleAr}
        type={'number'} value={resTypeNum?.toFixed(2)} listener={(e) => {
          setResTypeNum(Number(e.target.value));
        }} myStyle={{ marginBottom: 32 }}/>}

        <div className='cost' style={{ marginTop: 'auto' }}>
          <h3 style={{ display: (getNumOfBookDays(calendarDoubleValue) >= item.discount?.num_of_days_for_discount && item.discount?.percentage > 0)
            ? null : 'none' }}>تخفيض {item.discount?.percentage}% <span>- {!getPrice('cost price') ? (resType?.id > 0 ? resTypeNum : getPrice('cost price') * item.discount?.percentage / 100).toFixed(2) : 'سعر غير موجود'} {currencyCode(false, true)}</span></h3>
          <h3>اجمالي تكلفة {getDetailedResTypeNum(true, resType, resTypeNum)} <span>{!isNaN(getPrice('cost price')) ? (getPrice('cost price') - (item.discount?.percentage ? ((resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue)) * getPrice() * item.discount.percentage / 100) : 0)).toFixed(2) : 'سعر غير موجود'} {currencyCode(false, true)}</span></h3>
        </div> 

        {isMobile && typeof item?.cancellation === 'number' && <div style={{ cursor: 'text' }} className='bookingDate cancellationDiv'>
          <Svgs name={'cancellation'}/>
          سياسة الالغاء و الاسترجاع
          <h3>{cancellationsArray()?.at(item?.cancellation)}</h3>
        </div>}

        {isMobile && item?.details?.terms_and_conditions?.length > 0 && <div style={{ cursor: 'text' }} className='bookingDate cancellationDiv'>
          <Svgs name={'host'}/>
          شروط الحجز {'(من قبل المعلن)'}
          {item?.details?.terms_and_conditions?.map((trm) => (
            <li>{trm}</li>
          ))}
        </div>}

        <button className='btnbackscndclr' id={(item.owner_id === userId || !canBook || (!booksIds.find(i => i.property_id === id) && (!calendarDoubleValue?.at(0) || !calendarDoubleValue?.at(1)))) ? 'disable-button' : ''} 
          onClick={handleBook}>
            {(item.owner_id !== userId) 
              ? (canBook 
                ? (addingToBooks 
                  ? <LoadingCircle />
                  : (booksIds.find(i => i.property_id === id) ? 'أزل من الحجز' : 'احجز')) 
                : getReasonForNotBook())
            : 'هذا عرضك الخاص'}
        </button>

        <p id='info-p' style={{ marginTop: bookSuccess?.length > 0 ? 8 : 0 }}>{bookSuccess}</p>

      </div>}

      {(isCalendar || shareDiv || reportDiv || isReservationType || isImagesLoader) && <span onClick={() => {
        setIsCalendar(false); setShareDiv(false); setReportDiv(false); setIsReservationType(false); setIsImageLoader(false);
      }} id='spanForClosingPopups'>
        <Svgs name={'cross'}/>  
      </span>}

    </div>
  )
}

export default page
