'use client';

import '../../../view/view-style/View.scss';
import ImagesShow from "@components/ImagesShow";
import { JordanCities, VehiclesTypes, cancellationsArray, currencyCode, getNames, myConditions, ratingsSections, reservationType, roomTypesArray } from "@utils/Data";
import GoogleMapImage from '@assets/images/google-map-image.jpg';
import Image from "next/image";
import LocationGif from '@assets/icons/location.gif';
import Svgs from '@utils/Svgs';
import { useContext, useEffect, useState } from 'react';
import ReviewCard from '@components/ReviewCard';
import HeaderPopup from '@components/popups/HeaderPopup';
import { useSearchParams } from 'next/navigation';
import { deletePropFilesAdmin, deleteReportOnProp, deleteReviewsAdmin, deleteSpecificPropFilesAdmin, fetchPropertyDetails, getHost, getPropIdByUnitCode, handleBooksAddRemove, handleFavourite, handlePropAdmin, makeReport, sendReview } from '@utils/api';
import CustomInputDiv from '@components/CustomInputDiv';
import { Context } from '@utils/Context';
import { getNameByLang, getNumOfBookDays, getReadableDate, isOkayBookDays, isValidArrayOfStrings, isValidContactURL, isValidNumber } from '@utils/Logic';
import MySkeleton from '@components/MySkeleton';
import NotFound from '@components/NotFound';
import Link from 'next/link';
import { bathroomFacilities, facilities, kitchenFacilities, nearPlacesNames, poolType } from '@utils/Facilities';
import LoadingCircle from '@components/LoadingCircle';

const page = () => {

  const { 
    favouritesIds, setFavouritesIds, booksIds, 
    setBooksIds, userId, userRole, setIsMap, 
    setMapType, setLatitude, setLongitude,
    calendarDoubleValue, setCalendarDoubleValue,
    storageKey, userEmail, isMobile, isVerified,
    setIsModalOpened, userUsername
  } = useContext(Context);
  
  const id = useSearchParams().get('id');
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

  const [adminSending, setAdminSending] = useState(false);
  const [adminType, setAdminType] = useState('pass-property');
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  const [rejectReasons, setRejectReasons] = useState(['']);
  const [rejectError, setRejectError] = useState('');
  
  const [filesToDeleteAdmin, setFilesToDeleteAdmin] = useState([]);
  const [deletingFiles, setDeletingFiles] = useState(false);
  const [isDeleteFiles, setIsDeleteFiles] = useState(false);
  const [deleteFilesError, setDeleteFilesError] = useState('');
  const [deleteFilesSuccess, setDeleteFilesSuccess] = useState('');

  const [revsToDeleteAdmin, setRevsToDeleteAdmin] = useState([]);
  const [deletingRevs, setDeletingRevs] = useState(false);
  const [isDeleteRevs, setIsDeleteRevs] = useState(false);
  const [deleteRevsError, setDeleteRevsError] = useState('');
  const [deleteRevsSuccess, setDeleteRevsSuccess] = useState('');

  const [reviewsNumber, setReviewsNumber] = useState(6);
  const [isCalendar, setIsCalendar] = useState(false);
  const [bookDate, setBookDate] = useState(calendarDoubleValue);
  const [isSpecifics, setIsSpecifics] = useState(true);
  const [isReviews, setIsReviews] = useState(false);
  const [isMap, setIsMapDiv] = useState(false);
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

  const [addingToFavs, setAddingToFavs] = useState(false);
  const [addingToBooks, setAddingToBooks] = useState(false);

  const [deletingReport, setDeletingReport] = useState(false);
  const [isDeleteReport, setIsDeleteReport] = useState(false);

  const [isGuestRooms, setIsGuestRooms] = useState(false);
  const [isKitchen, setIsKitchen] = useState(false);
  const [isRooms, setIsRooms] = useState(false);
  const [isBathrooms, setIsBathrooms] = useState(false);
  const [isPlaces, setIsPlaces] = useState(false);
  const [isFacilities, setIsFacilities] = useState(false);
  const [isPool, setIsPool] = useState(false);
  const [isVehicleSpecs, setIsVehicleSpecs] = useState(false);
  const [isVehicleAddons, setIsVehicleAddons] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);

  const [isReservationType, setIsReservationType] = useState(false);
  const [resType, setResType] = useState(reservationType()[0]);
  const [resTypeNum, setResTypeNum] = useState(1);

  const whatsappBaseUrl = 'https://wa.me/';

  async function fetchItemDetails () {

    try {

      if(!id || id.length < 10 || loading) return;

      setLoading(true);

      const res = await fetchPropertyDetails(id);

      if(res.success !== true) {
        setLoading(false);
        return;
      }

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
      if(!res?.ok === true) return setLoading(false);
      location.href = `/en/view/item?id=${res.dt.id}`;
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
        setSendReviewError('Please select a rating to view');
        setSendReviewSuccess('');
        return;
      }

      if(!reviewText){
        setSendReviewError('Write an explanation of why you chose this assessment');
        setSendReviewSuccess('');
        return;
      }

      setSendingReview(true);

      const res = await sendReview(scoreRate, reviewText, id, true);

      if(res.success !== true) {
        setSendReviewError(res.dt);
        setSendReviewSuccess('');
        setSendingReview(false);
        return;
      };

      setSendReviewError('');
      setSendReviewSuccess('The review has been added successfully');
      if(res.dt) setItem(res.dt);
      setSendingReview(false);
      
    } catch (err) {
      console.log(err.message);
      setSendReviewError('unknown error');
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

      setReporting(false);
      
    } catch (err) {
      console.log(err.message);
    }

  };

  const handleFav = async() => {

    try {

      if(!userId || userId.length <= 10) return;

      setAddingToFavs(true);

      const res = await handleFavourite(id, favouritesIds.includes(id));

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
      ? `${(notLogined || !userId?.length > 0) ? '** Warning: This user is not registered on the platform ** \n\n• ' : ''}I am the account holder: "${userUsername || 'Name not exist!'}" User ID: "${userId || 'ID not exist!'}" \n\n• I want to book this show\n\n• Title: "${item.en_data?.titleEN || item.title}" \n\n• Unit Code (unit id): "${item.unit_code}"\n\n• Reservation type: ${resType?.value} \n\n• Starting from date: "${getReadableDate(calendarDoubleValue?.at(0), true, true)}" \n\n• To date: "${getReadableDate(calendarDoubleValue?.at(1), true, true)}"\n\n• Duration: ${resTypeNum} ${reservationType(true, resTypeNum, true).find(i=>i.id === resType?.id)?.oneEn + 's'}\n\n• The price shown to me: ${(((resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue)) * getPrice()) - (item.discount?.percentage ? ((resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue)) * getPrice() * item.discount.percentage / 100) : 0)).toFixed(2)} ${currencyCode(true, false)}\n\n• ** بالعربية **\n\n${(notLogined || !userId?.length > 0) ? '** تحذير: هذا المستخدم ليس مسجل بالمنصة ** \n\n• ' : ''}أنا صاحب الحساب "${userUsername || 'لا يوجد اسم'}" معرف: "${userId || 'لا يوجد معرف'}" \n\n• أريد أن احجز هذا العرض\n\n• عنوان العرض: "${item.title}" \n\n• كود الوحدة (معرف العرض): "${item.unit_code}"\n\n• نوع الحجز: ${resType?.arabicName} \n\n• بدءا من التاريخ: "${getReadableDate(calendarDoubleValue?.at(0), true)}" \n\n• وحتى التاريخ: "${getReadableDate(calendarDoubleValue?.at(1), true)}"\n\n• مدة الحجز: ${resTypeNum} ${reservationType(false, resTypeNum, true).find(i=>i.id === resType?.id)?.multipleAr}\n\n• السعر الظاهر لي: ${(((resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue)) * getPrice()) - (item.discount?.percentage ? ((resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue)) * getPrice() * item.discount.percentage / 100) : 0)).toFixed(2)} ${currencyCode(false, false)}`
      : `${(notLogined || !userId?.length > 0) ? '** Warning: This user is not registered on the platform ** \n\n• ' : ''}I am the account holder: "${userUsername || 'name not exist!'}" User ID: "${userId || 'Id not exist!'}" \n\n• I would like to contact you about this unit \n\n• Title: "${item.title}" \n\n• Unit Code (unit id): "${item.unit_code}\n\n• ** بالعربية **\n\n${(notLogined || !userId?.length > 0) ? '** تحذير: هذا المستخدم ليس مسجل بالمنصة ** \n\n• ' : ''}أنا صاحب الحساب "${userUsername || 'لا يوجد اسم'}" معرف: "${userId || 'لا يوجد معرف'}" \n\n• أريد أن أتواصل معك بخصوص هذا العرض\n\n• عنوان العرض: "${item.title}" \n\n• كود الوحدة (معرف العرض): "${item.unit_code}`;
    console.log('url: ', encodeURIComponent(text));
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
            whatsapp = whatsapp.val?.replace('00', '+');
          return window.open(`${whatsappBaseUrl}/${whatsapp.val}?text=${generateWhatsappText(true)}`, '_blank');
        }
        if(whatsapp && isValidContactURL(whatsapp))
          return window.open(`${whatsapp.val}?text=${generateWhatsappText(true)}`, '_blank');
        setBookSuccess('Contact the service provider from the Terms and Communication section');
        return;
      }

      const isAlreadyBooked = booksIds.find(i => i.property_id === id);

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

      setAddingToBooks(false);

      const navigateToContact = () => {
        let whatsapp = item?.contacts?.find(i => i.platform === 'whatsapp');

        if(whatsapp && !isNaN(Number(whatsapp.val))) {
          if(whatsapp.val?.at(0) === '0' && whatsapp.val?.at(1) === '0') 
            whatsapp = whatsapp.val?.replace('00', '+');
          return window.open(`${whatsappBaseUrl}/${whatsapp.val}?text=${generateWhatsappText()}`, '_blank');
        }
  
        if(whatsapp && isValidContactURL(whatsapp))
          return window.open(`${whatsapp.val}?text=${generateWhatsappText()}`, '_blank');
  
        let telegram = item?.contacts?.find(i => i.platform === 'telegram');
  
        if(telegram && isValidContactURL(telegram))
          return window.open(telegram.val, '_blank');
      };

      if(!isAlreadyBooked) navigateToContact();

      if(res.success === true && !booksIds.find(i => i.property_id === id)){
        setIsSpecifics(false); 
        setIsReviews(false); 
        setIsMapDiv(false); 
        setIsTerms(true);  
        setBookSuccess('The addition has been completed successfully. Contact the service provider from the Terms and Communication section');
      } else {
        setBookSuccess('');
      }

    } catch (err) {
      console.log(err.message);
      setAddingToBooks(false);
    }

    
  };

  const getShareUrl = () => {
    return window.location.origin.toString() + 
    (item.unit_code ? '/en/view/item?unit=' + item.unit_code : '/en/view/item?id=' + id);
  };

  const sendAdmin = async() => {

    try {

      if(adminSending) return;

      if(adminType === 'show-property' && item.visible) return;
      if(adminType === 'hide-property' && !item.visible) return;
      if(adminType === 'pass-property' && item.checked) return;
      if(adminType === 'reject-property' && (item.isRejected || !isValidArrayOfStrings(rejectReasons))) {
        setRejectError('Please write reasons for rejecting the offer');
        return;
      }
      setRejectError('');
      if(adminType === 'delete-property' && !item) return;

      setAdminSending(true);

      if(adminType === 'delete-property'){
        const deleteFilesRes = await deletePropFilesAdmin(id, storageKey, userEmail, true);
        if (deleteFilesRes.success !== true) {
          setAdminError(deleteFilesRes.dt);
          setAdminSuccess('');
          setAdminSending(false);
          return;
        }
      } else {
        setAdminError('');
        setAdminSuccess('');
      };
      
      const res = await handlePropAdmin(id, adminType, rejectReasons, true);

      if(res.success !== true) {
        setAdminError(res.dt);
        setAdminSuccess('');
        setAdminSending(false);
        return;
      }

      setAdminError('');
      setAdminSuccess('Updated successfully');

      if(adminType === 'pass-property') setItem(res.dt);

      if(adminType === 'reject-property') {
        setItem(res.dt);
        setAdminType('pass-property');
      };

      if(adminType === 'hide-property') {
        setItem(res.dt);
        setAdminType('show-property');
      };

      if(adminType === 'show-property') {
        setItem(res.dt);
        setAdminType('hide-property');
      };

      if(adminType === 'delete-property') setTimeout(() => { setItem(null) }, [2000]);
      setAdminSending(false);
      
    } catch (err) {
      console.log(err.message);
      setAdminError('Something went wrong');
      setAdminSuccess('');
      setAdminSending(false);
    }

  };

  const handleDeleteFilesAdmin = async() => {

    try {

      if(deletingFiles) return;

      setDeletingFiles(true);

      const res = await deleteSpecificPropFilesAdmin(
        id, filesToDeleteAdmin, storageKey, userEmail, true
      );

      if(res.success !== true) {
        setDeleteFilesError(res.dt);
        setDeleteFilesSuccess('');
        setDeletingFiles(false);
        return;
      }

      setDeleteFilesError('');
      setDeleteFilesSuccess('Deleted Successfully');
      setDeletingFiles(false);
      
    } catch (err) {
      console.log(err.message);
      setDeleteFilesError('Something went wrong');
      setDeleteFilesSuccess('');
      setDeletingFiles(false);
    }

  };

  const handleDeleteRevsAdmin = async() => {

    try {

      if(deletingRevs) return;

      setDeletingRevs(true);

      const res = await deleteReviewsAdmin(id, revsToDeleteAdmin, true);

      if(res.success !== true) {
        setDeleteRevsError(res.dt);
        setDeleteRevsSuccess('');
        setDeletingRevs(false);
        return;
      }

      setDeleteRevsError('');
      setDeleteRevsSuccess('Deleted Successfully');
      setItem(res.dt);
      setDeletingRevs(false);
      
    } catch (err) {
      console.log(err.message);
      setDeleteRevsError('Something went wrong');
      setDeleteRevsSuccess('');
      setDeletingRevs(false);
    }

  };

  const isAdmin = () => {
    if(userRole === 'admin' || userRole === 'owner'){
      return true;
    } else {
      return false;
    }
  };

  const showMap = () => {

    setIsMap(true);  
    
    const obj = JordanCities.find(i => i.city_id === item?.city_id);

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

    setMapType('view');

  };

  const isAbleToBook = () => {
    if(!item?.is_able_to_book) return false;
    if(!isOkayBookDays(calendarDoubleValue, item.booked_days)) return false;
    if(!userId?.length > 10) return false;
    if(userId?.length > 10 && !isVerified) return false;
    return true;
  };

  const deleteReport = async() => {

    if(deletingReport) return;

    try {

      setDeletingReport(true);

      const res = await deleteReportOnProp(id);

      if(!res.success !== true){
        setDeletingReport(false);
        return;
      }

      setItem(res.dt);
      setDeletingReport(false);
      
    } catch (err) {
      console.log(err);
      setDeletingReport(false);
    }
  };

  const copyUrl = async() => {
    setCopied(false);
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
    } catch (err) {}
  };

  const getDesiredContact = (returnObj, isPhone) => {
    if(!item.contacts || item.contacts.length <= 0) return null;
    for (let i = 0; i < item.contacts.length; i++) {
      if(item.contacts?.at(i)?.platform === 'whatsapp'){
        if(returnObj) return item.contacts[i];
        if(!isValidContactURL(item.contacts[i])) return null;
        if(isValidNumber(item.contacts[i]?.val)) 
          return `${whatsappBaseUrl}/${item.contacts[i].val}`;
        return item.contacts[i]?.val;
      }
    }
    if(isValidContactURL(item.contacts[0]) && !isPhone)
      return item.contacts[0];
    return null;    
  };

  const openContactURL = (myContact) => {
    console.log(myContact, isValidContactURL(myContact));
    if(!myContact?.platform) return '';
    if(myContact.platform === 'whatsapp'){
      if(myContact && isValidNumber(myContact.val)) {
        if(myContact.val?.at(0) === '0' && myContact.val?.at(1) === '0') 
          myContact = myContact.val?.replace('00', '+');
        return window.open(`${whatsappBaseUrl}/${whatsapp.val}?text=${generateWhatsappText(null, true)}`, '_blank');
      }
      if(myContact && isValidContactURL(myContact))
        return window.open(`${myContact.val}?text=${generateWhatsappText(null, true)}`, '_blank');
      return;
    }
    if(isValidContactURL(myContact)) return window.open(myContact.val, '_blank');
  };

  const getReasonForNotBook = () => {
    if(!item?.is_able_to_book) return 'Reservations are currently closed';
    if(!isOkayBookDays(calendarDoubleValue, item.booked_days)) return 'Days not available for booking';
    if(!userId?.length > 10) return 'Login or Join';
    if(userId?.length > 10 && !isVerified) return 'Verify account ownership';
    if(!booksIds.find(i => i.property_id === id) 
    && (!calendarDoubleValue?.at(0) || !calendarDoubleValue?.at(1))) return 'Specify book days';
  };

  const getPriceReservationType = () => {
    if(item?.prices?.daily) return setResType(reservationType()?.find(i=>i.value?.toLowerCase() === 'daily'));
    if(item?.prices?.weekly) return setResType(reservationType()?.find(i=>i.value?.toLowerCase() === 'weekly'));
    if(item?.prices?.monthly) return setResType(reservationType()?.find(i=>i.value?.toLowerCase() === 'monthly'));
    if(item?.prices?.seasonly) return setResType(reservationType()?.find(i=>i.value?.toLowerCase() === 'seasonly'));
    if(item?.prices?.yearly) return setResType(reservationType()?.find(i=>i.value?.toLowerCase() === 'yearly'));
    return null;
  };

  const getPrice = () => {
    if(resType?.value?.toLowerCase() === 'daily') return item.prices?.daily || '';
    else if(resType?.value?.toLowerCase() === 'weekly') return item.prices?.weekly || 'Undefined price';
    else if(resType?.value?.toLowerCase() === 'monthly') return item.prices?.monthly || 'Undefined price';
    else if(resType?.value?.toLowerCase() === 'seasonly') return item.prices?.seasonly || 'Undefined price';
    else if(resType?.value?.toLowerCase() === 'yearly') return item.prices?.yearly || 'Undefined price';
    return 'Undefined price';
  };

  const getDetailText = (obj, objType, index) => {

    const str = `
      ${getNames('one', false, true, objType) + ' ' + ((index + 1) || '')}
      ${obj?.room_type ? (roomTypesArray(true).includes(obj?.room_type) ? obj?.room_type : roomTypesArray(true)[roomTypesArray().indexOf(obj?.room_type)]) : ''} 
      ${obj?.capacity ? 'with capacity of ' + obj?.capacity + ' people' : ''} 
      ${obj?.dim ? ' its dimension is width ' + obj?.dim?.y + 'm & length ' + obj?.dim?.x + 'm ' : ''} 
      ${obj?.single_beds ? ', ' + obj?.single_beds + ' single beds ' : ''} 
      ${obj?.double_beds ? ', ' + obj?.double_beds + ' master beds ' : ''} 
      ${obj?.depth ? ', & depth of ' + obj?.depth + ' meter ' : ''}
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
    if(x === 5) return 'Glad to know that you liked the ' + (item.type_is_vehicle ? 'Vehicle' : 'Property') + ', please write a simple description of your experience.';
    if(x === 4) return 'Good to know that you liked the ' + (item.type_is_vehicle ? 'Vehicle' : 'Property') + ', please write about your experince and what can be improved.';
    if(x === 3) return 'What problems did you encounter or areas that you suggest improving?';
    if(x === 2) return "We are sorry to hear that, why don't you like the " + (item.type_is_vehicle ? 'Vehicle' : 'Property') + ' ?';
    if(x === 1) return 'We are very sorry for the bad experience you had. Please write about the problems you encountered that made your experience bad.';
  };

  const getRatingText = () => {
    const x = Math.round(scoreRate);
    const obj = ratingsSections.find(i=>i.value === x);
    return obj?.enName + ' ' + obj?.emoji;
  };

  const getCompanians = (array, comType) => {
    let arr = [];
    switch(comType){
      case 'kitchen':
        array.forEach(element => {
            arr.push(kitchenFacilities(true)?.find(i=>i === element)
              || kitchenFacilities(true)[kitchenFacilities().indexOf(element)])
        });
        return arr.toString()?.replaceAll(',', ', ');
      case 'bathrooms':
        array.forEach(element => {
            arr.push(bathroomFacilities(true)?.find(i=>i === element)
              || bathroomFacilities(true)[bathroomFacilities().indexOf(element)])
        });
        return arr.toString()?.replaceAll(',', ', ');
      case 'pool':
        array.forEach(element => {
            arr.push(poolType(true)?.find(i=>i === element)
              || poolType(true)[poolType().indexOf(element)])
        });
        return arr.toString()?.replaceAll(',', ', ');
      default:
        return '';
    }
  };

  useEffect(() => {
    setRunOnce(true);
    setAdminSending(false);
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

  useEffect(() => {
    setCanBook(isAbleToBook());
  }, [calendarDoubleValue]);

  useEffect(() => {
    if(!loading && item) setFetching(false);
  }, [loading, item]);

  useEffect(() => {
    if(isCheckout) return setIsModalOpened(true);
    setIsModalOpened(false);
  }, [isCheckout]);

  const RightIconSpan = () => {
    return <div id='righticonspan'><span /></div>
  };

  if(!item){
    return (
        (fetching || loading) ? <MySkeleton isMobileHeader={true}/> : <NotFound />
    )
  };

  return (
    <div className="view" style={{ overflow: 'hidden' }} dir='ltr'>

      {reportDiv && <div className='reportDiv'>

        {!userId?.length > 0 
        ? <h2 id='register-first'>Register first to report offers & reviews</h2>
        : <>
          <h2>Report {writerId?.length > 0 ? 'This review' : 'This Review'} <Svgs name={'cross'} on_click={() => { setReportDiv(false); setWriterId(''); }}/></h2>

          <CustomInputDiv title={'Report reason'} isError={reportText === '-1' && true} errorText={'Please provide a reason for reporting'} value={reportText === '-1' ? '' : reportText} listener={(e) => setReportText(e.target.value)}/>

          <button onClick={() => {
            if(writerId?.length > 0) {
              report(writerId);
            } else {
              report(null);
            }
          }}>{reporting ? 'Reporting...' : 'Report'}</button>
        </>}

      </div>}

      {shareDiv && <div className='reportDiv shareDiv'>
        <h2>Use this link to refer to this offer
          <Svgs name={'cross'} on_click={() => setShareDiv(false)}/>
        </h2>  
        <p>{getShareUrl()}</p>
        <button className='editDiv' onClick={copyUrl}
          id={copied ? 'share-url-copied' : ''}>
          {copied ? 'Copied' : 'Copy'} 
          {copied ? <RightIconSpan /> : <Svgs name={'copy'}/>}
        </button>
      </div>}

      {isAdmin() && <div className='view-admin-section'>

        <h2>Admin section to control the Offer</h2>
        
        <div className='status'>Offer status <span>{item.visible ? 'Visible' : 'Hidden'}</span> <span>{item.checked ? 'Approved' : item.isRejected ? 'Rejected' : 'Under revision'}</span></div>

        <h3>What do you want to do with this offer?</h3>

        <ul>
          <li id={item.checked ? 'unactive-btn' : null} className={adminType === 'pass-property' ? 'selected-admin-type' : ''} onClick={() => setAdminType('pass-property')}>Approve offer</li>
          <li id={(item.isRejected || item.checked) ? 'unactive-btn' : null} className={adminType === 'reject-property' ? 'selected-admin-type' : ''} onClick={() => setAdminType('reject-property')}>Reject offer</li>
          <li className={adminType === 'delete-property' ? 'selected-admin-type' : ''} onClick={() => setAdminType('delete-property')}>Delete offer</li>
          <li className={(adminType === 'hide-property' || adminType === 'show-property') ? 'selected-admin-type' : ''} onClick={() => setAdminType(item.visible ? 'hide-property' : 'show-property')}>{item.visible ? 'Hide offer' : 'Show offer'}</li>
        </ul>

        <div className='reject-reasons' style={{ display: adminType === 'reject-property' ? null : 'none' }}>
          <h2>Add reasons for rejecting the offer</h2>
          {rejectReasons.map((reason, index) => (
          <div key={index}><CustomInputDiv placholderValue={!reason?.length > 0 ? 'Add a reason for rejection' : reason} value={reason} deletable handleDelete={() => {
            let arr = [];
            for (let i = 0; i < rejectReasons.length; i++) {
                if(i !== index){
                    arr.push(rejectReasons[i]);
                }
            }
            setRejectReasons(arr);
          }} 
          listener={(e) => {
            let arr = [...rejectReasons];
            arr[index] = e.target.value;
            setRejectReasons(arr);
          }}/></div>
          ))}
          <button className='btnbackscndclr' onClick={() => setRejectReasons([...rejectReasons, ''])}>Add</button>
          <p id={rejectError?.length > 0 ? 'p-info-error' : ''}>{rejectError}</p>
        </div>

        <button className='btnbackscndclr' onClick={sendAdmin}>{adminSending ? 'Updating offer status...' : 'Confirm'}</button>
        
        <p style={{ color: adminError?.length > 0 ? 'var(--softRed)' : null }}>{adminError?.length > 0 ? adminError : adminSuccess}</p>

        <hr />

        <button className={`editDiv ${isDeleteFiles ? 'rotate-svg' : ''}`} onClick={() => setIsDeleteFiles(!isDeleteFiles)}>Delete photos and files <Svgs name={'dropdown arrow'}/></button>

        <div className='files-to-delete' style={{ display: !isDeleteFiles ? 'none' : null }}>

          {filesToDeleteAdmin?.length > 0 
          ? <><span id='info-span'>
            <Svgs name={'info'}/>
            These files will be deleted from the display. The display will not be completely affected. Click on the file to delete it
          </span>
          <ul>
            {filesToDeleteAdmin.map((file, index) => (
              <li onClick={() => {console.log('file: ', file); setFilesToDeleteAdmin(
                filesToDeleteAdmin.filter(i => i !== file)
              )}} 
              key={index}>
                {(file?.split('.')?.at(1) === 'png' || file?.split('.')?.at(1) === 'jpg')
                ? <Image width={120} height={120} src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${file}`} alt='صور العرض'/>
                : ((file?.split('.')?.at(1) === 'mp4' || file?.split('.')?.at(1) === 'avi') && <video src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${file}`}/>)}
              </li>
            ))}
          </ul>
          <button className='btnbackscndclr' onClick={handleDeleteFilesAdmin}>{deletingFiles? 'Deleting...' : 'Delete'}</button>
          <p style={{ color: deleteFilesError?.length > 0 ? 'var(--softRed)' : null }}>{deleteFilesError?.length > 0 ? deleteFilesError : deleteFilesSuccess}</p>
          </>
          : <span id='choose-files-span'>Select files from view to delete</span>}

        </div>

        <hr />

        <button className={`editDiv ${isDeleteRevs ? 'rotate-svg' : ''}`} onClick={() => setIsDeleteRevs(!isDeleteRevs)}>Remove reviews <Svgs name={'dropdown arrow'}/></button>

        <div className='files-to-delete revs-to-delete' style={{ display: !isDeleteRevs ? 'none' : null }}>

          {revsToDeleteAdmin?.length > 0 
          ? <><span id='info-span'>
            <Svgs name={'info'}/>
            These reviews will be deleted. To deselect, click on the review
          </span>
          <ul>
            {revsToDeleteAdmin.map((rv, index) => (
                <ReviewCard key={index} isEnglish isAdmin={isAdmin()} item={rv} 
                  on_click={() => setRevsToDeleteAdmin(
                    revsToDeleteAdmin.filter(i => i.writer_id !== rv?.writer_id)
                  )}/>
            ))}
          </ul>
          <button className='btnbackscndclr' onClick={handleDeleteRevsAdmin}>{deletingRevs ? 'Deleting...' : 'Delete'}</button>
          <p style={{ color: deleteRevsError?.length > 0 ? 'var(--softRed)' : null }}>{deleteRevsError.length > 0 ? deleteRevsError : deleteRevsSuccess}</p>
          </>
          : <span id='choose-files-span'>Select reviews to delete </span>}

        </div>

        {isReportParam && <>
        <hr />
        <button className={`editDiv ${isDeleteReport ? 'rotate-svg' : ''}`} onClick={() => setIsDeleteReport(!isDeleteReport)}>Delete Report this offer <Svgs name={'dropdown arrow'}/></button>
        <span style={{ display: isDeleteReport ? 'block' : 'none', marginBottom: 16 }} id='info-span'>Reporting this offer or any reporting review of this offer will be deleted</span>
        <button className='btnbackscndclr' style={{ display: isDeleteReport ? null : 'none' }} 
          onClick={deleteReport}>
            {deletingReport ? 'Delete...' : 'Delete'}
        </button></>}

      </div>}

      {imageFullScreen !== '-1' && <div className='full-screen'>
        <Svgs name={'full screen down'} on_click={() => setImageFullScreen('-1')}/>
        <Image src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${imageFullScreen}`} fill={true} alt='Image in full screen mode for display' />
      </div>}

      {item.isRejected && <div className='rejection-div'>
        <div className='status'>Offer <span>is Rejected</span></div>
        <h2>Reasons for rejecting the offer</h2>
        <ul>
          {item?.reject_reasons?.map((reason, index) => (
            <li key={index}>{reason}</li>
          ))}
        </ul>
        <p><Svgs name={'info'}/> Edit the offer and send it again from <Link href={`/edit-prop?id=${id}`}>Here</Link></p>
      </div>}

      <div className='intro'>

        <div className='itemIntro'>

          <h1>{item.en_data?.titleEN || item.title}<span id='mobile-unit-span'>{'(' + item.unit_code + ')'}</span><h4 onClick={() => { setReportDiv(true); setWriterId(''); }}>Report <Svgs name={'report'}/></h4><span id='desktop-unit-span'>Unit ID {'(' + item.unit_code + ')'}</span></h1>

          <ul>
            <li><Svgs name={'star'}/> {Number(item.ratings?.val).toFixed(2)} ({item.ratings?.no} evaluation)</li>
            <li><Svgs name={item.type_is_vehicle ? 'loc vehicle' : 'location'}/> {JordanCities.find(i => i.value === item.city)?.value}, {item.en_data?.neighbourEN || item.neighbourhood}</li>
            {!(item.type_is_vehicle && item.area > 0) && <li><Svgs name={'area'}/> Area {item.area} square meters</li>}
            {getDesiredContact(null, true) && <li><Svgs name={getDesiredContact(true, true)?.platform}/> <Link href={getDesiredContact(null, true)}>{getDesiredContact(true, true)?.val}</Link></li>}
            <li id='giveThisMarginRight' onClick={handleFav}><Svgs name={`wishlist${favouritesIds.includes(id) ? ' filled' : ''}`}/> {addingToFavs ? 'Adding...' : (favouritesIds.includes(id) ? 'Remove from favorites' : 'Add to favourites')}</li>
            <li onClick={() => setShareDiv(!shareDiv)}><Svgs name={'share'}/> Share</li>
          </ul>

        </div>

        <div className='iamgesViewDiv'>
          <div className='btns'>
            <button onClick={() => setIsVideosFiles(false)} className={!isVideosFiles && 'selectedFileType'}>Photos</button>
            <button onClick={() => setIsVideosFiles(true)} className={isVideosFiles && 'selectedFileType'}>Videos</button>
          </div>
          <ImagesShow images={item.images} type={'view'} isAdmin={isAdmin()} 
          setImageFullScreen={setImageFullScreen} videos={item.videos} 
          type_is_video={isVideosFiles} filesToDeleteAdmin={filesToDeleteAdmin}
          setFilesToDeleteAdmin={setFilesToDeleteAdmin} isEnglish/>
        </div>

      </div>

      <div className="aboutItem">

        <div className="details">
          
          <label>Description</label>

          <p>{item.en_data?.descEN || item.description}</p>

          {host && <Link href={`/en/host?id=${item.owner_id}`} className='the-host'>
            <h3 className='header-host'>Advertisor <span className='disable-text-copy'>About him <Svgs name={'dropdown arrow'}/></span></h3>
            <span id='image-span' className='disable-text-copy'>{host?.firstNameEN?.at(0) || host?.lastNameEN?.at(0) || host?.username?.at(0) || host?.firstName?.at(0)}</span>
            <div>
              <h3>{host?.firstNameEN || host?.lastNameEN || host?.username || host?.firstName}</h3>
              <h4><Svgs name={'star'}/> Evaluation {host?.rating || 0} {`(${host?.reviewsNum || 0} reviews)`}</h4>
            </div>
            <p>{host?.units || 0} Units</p>
          </Link>}

          <ul className='tabButtons'>
            <li className={isSpecifics && 'selectedTab'} onClick={() => {setIsSpecifics(true); setIsReviews(false); setIsMapDiv(false); setIsTerms(false)}}>Specifications</li>
            <li className={isReviews && 'selectedTab'} onClick={() => {setIsSpecifics(false); setIsReviews(true); setIsMapDiv(false); setIsTerms(false)}}>Reviews</li>
            <li className={isMap && 'selectedTab'} onClick={() => {setIsSpecifics(false); setIsReviews(false); setIsMapDiv(true); setIsTerms(false)}}>Map</li>
            <li className={isTerms && 'selectedTab'} onClick={() => {setIsSpecifics(false); setIsReviews(false); setIsMapDiv(false); setIsTerms(true)}}>Terms & Communication</li>
          </ul>

          <h2>{isSpecifics ? 'Specifications' : isReviews ? 'Reviews' : isMap ? 'Map' : isTerms ? 'Terms and Communication' : ''}</h2>

          <ul className='specificationsUL disable-text-copy' style={{ display: !isSpecifics && 'none' }}>
            
            {item?.details?.insurance && <li><Svgs name={'insurance'}/><h3>{item.details.insurance === true ? 'A deposit is required before booking' : 'No insurance required'}</h3></li>}
            {(item.cancellation >= 0 && item.cancellation < cancellationsArray().length) && <li><Svgs name={'cancellation'}/><h3>{cancellationsArray(true)?.at(item.cancellation)}</h3></li>}

            {!item.type_is_vehicle ? <>

              {item.customer_type && <li><Svgs name={'customers'}/><h3>Guests category {item?.en_data?.customerTypeEN}</h3></li>}
              {item.capacity > 0 && <li><Svgs name={'guests'}/><h3>{`Maximum number of guests ${item.capacity} guests`}</h3></li>}
              {(item.specific_catagory === 'apartment' && item.floor?.length > 0) && <li><Svgs name={'steps'}/><h3>{`Floor ${item.floor}`}</h3></li>}
              {item.area > 0 && <li><Svgs name={'area'}/><h3>{`Property Area ${item.area} square meters`}</h3></li>}
              {(item.specific_catagory === 'farm' && item.landArea?.length > 0) && <li><Svgs name={'area'}/><h3>{`Land area ${item.landArea}`}</h3></li>}
              
              {item.details?.guest_rooms?.length > 0 && <li onClick={() => setIsGuestRooms(!isGuestRooms)}>
                <Svgs name={'guest room'}/>
                <h3>Living rooms</h3>
                <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isGuestRooms ? '-' : '+'}</span>
                <ul style={{ display: (isGuestRooms || !isMobile) ? undefined : 'none' }}>
                  {item.details?.guest_rooms?.map((i, index) => (<li>{getDetailText(i, 'rooms', index)}</li>))}
                </ul>
              </li>}
              
              {(item.details?.kitchen?.array?.length > 0 || item.details?.kitchen?.companians?.length > 0) && <li onClick={() => setIsKitchen(!isKitchen)}>
                <Svgs name={'kitchen'}/>
                <h3>Kitchens</h3>
                <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isKitchen ? '-' : '+'}</span>
                <ul style={{ display: (isKitchen || !isMobile) ? undefined : 'none' }}>
                  {item.details?.kitchen?.array?.map((i, index) => (<li>{getDetailText(i, 'kitchen', index)}</li>))}
                </ul>
                <h3 style={{ display: (isKitchen || !isMobile) ? undefined : 'none' }} className='accompany-h3'>Kitchen facilities</h3>
                <p style={{ display: (isKitchen || !isMobile) ? undefined : 'none' }} className='accompany-p'>{getCompanians(item.details?.kitchen?.companians, 'kitchen')}</p>
              </li>}

              {item?.details?.rooms?.length > 0 && <li onClick={() => setIsRooms(!isRooms)}>
                <Svgs name={'rooms'}/>
                <h3>Bedrooms</h3>
                <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isRooms ? '-' : '+'}</span>
                <ul style={{ display: (!isRooms && isMobile) ? 'none' : undefined }}>
                  {item.details?.rooms?.map((i, index) => (
                    <li>{getDetailText(i, 'rooms', index)}</li>
                  ))}
                </ul>
              </li>}

              {(item.details?.bathrooms?.array?.length > 0 || item.details?.bathrooms?.companians?.length > 0) && <li onClick={() => setIsBathrooms(!isBathrooms)}>
                <Svgs name={'bathrooms'}/>
                <h3>Bathrooms</h3>
                <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isBathrooms ? '-' : '+'}</span>
                <ul style={{ display: (!isBathrooms && isMobile) ? 'none' : undefined }}>
                  {item.details?.bathrooms?.array?.map((i, index) => (<li>{getDetailText(i, 'bathrooms', index)}</li>))}
                </ul>
                <h3 style={{ display: (!isBathrooms && isMobile) ? 'none' : undefined }} className='accompany-h3'>Bathrooms facilities</h3>
                <p style={{ display: (!isBathrooms && isMobile) ? 'none' : undefined }} className='accompany-p'>{getCompanians(item.details?.bathrooms?.companians, 'bathrooms')}</p>
              </li>}

              {(item.details?.pool?.companians?.length > 0 || item.details?.pool?.array?.length > 0) && <li onClick={() => setIsPool(!isPool)}>
                <Svgs name={'pool'}/>
                <h3>Swimming pools</h3>
                <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isPool ? '-' : '+'}</span>
                <ul style={{ display: (!isPool && isMobile) ? 'none' : undefined }}>
                  {item.details?.pool?.array?.map((i, index) => (<li>{getDetailText(i, 'pool', index)}</li>))}
                </ul>
                <h3 style={{ display: (!isPool && isMobile) ? 'none' : undefined }} className='accompany-h3'>Swimming pools facilities</h3>
                <p style={{ display: (!isPool && isMobile) ? 'none' : undefined }} className='accompany-p'>{getCompanians(item.details?.pool?.companians, 'pool')}</p>
              </li>}
              
              {item.details?.facilities?.length > 0 && <li onClick={() => setIsFacilities(!isFacilities)}>
                <Svgs name={'facilities'}/>
                <h3>Facilities</h3>
                <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isFacilities ? '-' : '+'}</span>
                <ul style={{ display: (!isFacilities && isMobile) ? 'none' : undefined }}>
                  {item.details?.facilities?.map((i) => (<li>{
                      facilities(true, item.specific_catagory === 'students')?.find(ob=>ob === i)
                      || facilities(true, item.specific_catagory === 'students')[facilities(false, item.specific_catagory === 'students').indexOf(i)]
                    }</li>))}
                </ul>
              </li>}

            </> : <>

              <li><Svgs name={'vehicle'}/><h3>{'Vehicle category ' + VehiclesTypes?.find(i=>i.id === item.vehicle_type)?.value}</h3></li>
              {typeof item?.details?.vehicle_specifications?.driver === 'boolean' && <li><Svgs name={'driver'}/><h3>{item?.details?.vehicle_specifications?.driver ? 'The car comes with a driver' : 'The car comes without a driver'}</h3></li>}
              {item?.details?.vehicle_specifications?.rent_type?.length > 0 && <li><Svgs name={'car rentType'}/><h3>{'Rent type ' + item?.details?.vehicle_specifications?.rent_type}</h3></li>}
              {item?.details?.vehicle_specifications?.company?.length > 0 && <li><Svgs name={'vehicle'}/><h3>{'Vehicle manufacturer  ' + item?.details?.vehicle_specifications?.company}</h3></li>}
              {item?.details?.vehicle_specifications?.model?.length > 0 && <li><Svgs name={'vehicle'}/><h3>{'Vehicle model ' + item?.details?.vehicle_specifications?.model}</h3></li>}
              {item?.details?.vehicle_specifications?.color?.length > 0 && <li><Svgs name={'vehicle'}/><h3>{'Vehicle color ' + item?.details?.vehicle_specifications?.color}</h3></li>}
              {item?.details?.vehicle_specifications?.year?.length > 0 && <li><Svgs name={'vehicle'}/><h3>{'Year of made ' + item?.details?.vehicle_specifications?.year}</h3></li>}
              {item?.details?.vehicle_specifications?.gearbox?.length > 0 && <li><Svgs name={'gearbox'}/><h3>{'Transmission type' + item?.details?.vehicle_specifications?.gearbox}</h3></li>}
              {item?.details?.vehicle_specifications?.fuel_type?.length > 0 && <li><Svgs name={'fueltype'}/><h3>{'Fuel type ' + item?.details?.vehicle_specifications?.fuel_type}</h3></li>}

            </>}

            {item.details?.near_places?.length > 0 && <li onClick={() => setIsPlaces(!isPlaces)}>
              <Svgs name={'places'}/>
              <h3>Near places</h3>
              <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isPlaces ? '-' : '+'}</span>
              <ul style={{ display: (!isPlaces && isMobile) ? 'none' : undefined }}>
                {item.details?.near_places?.map((i) => (<li>{
                  nearPlacesNames(true)?.find(ob=>ob === i)
                  || nearPlacesNames(true)[nearPlacesNames(false).indexOf(i)]
                }</li>))}
            </ul></li>}

            {item.details?.features?.length > 0 && <li onClick={() => setIsFeatures(!isFeatures)}>
              <Svgs name={'places'}/>
              <h3>Features</h3>
              <span style={{ display: !isMobile ? 'none' : undefined}} id="show-li-span">{isFeatures ? '-' : '+'}</span>
              <ul style={{ display: (!isFeatures && isMobile) ? 'none' : undefined }}>
                {item.details?.features?.map((i) => (<li>{
                  item.en_data?.english_details?.find(i=>i.arName === i)?.enName
                  || i  
                }</li>))}
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
                <p>{item.ratings?.no} reviews</p>
              </div>

              <div className='charts'>
                <div>5.0 <p>{'('}{item?.num_of_reviews_percentage?.five || 0} reviews{')'}</p><div><span style={{ width: `${reviewsNum?.five || 0}%` }} /></div></div>
                <div>4.0 <p>{'('}{item?.num_of_reviews_percentage?.four || 0} reviews{')'}</p><div><span style={{ width: `${reviewsNum?.four || 0}%` }} /></div></div>
                <div>3.0 <p>{'('}{item?.num_of_reviews_percentage?.three || 0} reviews{')'}</p><div><span style={{ width: `${reviewsNum?.three || 0}%` }} /></div></div>
                <div>2.0 <p>{'('}{item?.num_of_reviews_percentage?.two || 0} reviews{')'}</p><div><span style={{ width: `${reviewsNum?.two || 0}%` }} /></div></div>
                <div>1.0 <p>{'('}{item?.num_of_reviews_percentage?.one || 0} reviews{')'}</p><div><span style={{ width: `${reviewsNum?.one || 0}%` }} /></div></div>
              </div>

            </div>

            {(booksIds.find(i => i.property_id === id) && item.owner_id !== userId && isVerified) 
            && <div className='write-review'>
              
              <h3>Rate and describe your experience with this {item.type_is_vehicle ? 'Vehicle' : 'Property'}</h3>

              {scoreRate !== null && <h4>{getRatingText()}</h4>}
              
              <div className="rating">
                <Svgs name={'star'} styling={Math.round(scoreRate) > 0 ? true : false} on_click={() => {if(Math.round(scoreRate) === 0){ setScoreRate(1) } else { setScoreRate(0) }}}/>
                <Svgs name={'star'} styling={Math.round(scoreRate) > 1 ? true : false} on_click={() => setScoreRate(2)}/>
                <Svgs name={'star'} styling={Math.round(scoreRate) > 2 ? true : false} on_click={() => setScoreRate(3)}/>
                <Svgs name={'star'} styling={Math.round(scoreRate) > 3 ? true : false} on_click={() => setScoreRate(4)}/>
                <Svgs name={'star'} styling={Math.round(scoreRate) > 4 ? true : false} on_click={() => setScoreRate(5)}/>
              </div>

              <textarea onChange={(e) => setReviewText(e.target.value)} placeholder={getReviewTextHolder()}/>
              <button onClick={writeReview}>{sendingReview ? <LoadingCircle /> : 'Publish'}</button>
              <p style={{ color: sendReviewError.length > 0 && 'var(--softRed)' }}>
                {sendReviewError.length > 0 ? sendReviewError : sendReviewSuccess}
              </p>

            </div>}
            <div className='write-review'>
              
              <h3>Rate and describe your experience with this {item.type_is_vehicle ? 'Vehicle' : 'Property'}</h3>

              {scoreRate !== null && <h4>{getRatingText()}</h4>}
              
              <div className="rating">
                <Svgs name={'star'} styling={Math.round(scoreRate) > 0 ? true : false} on_click={() => setScoreRate(1)}/>
                <Svgs name={'star'} styling={Math.round(scoreRate) > 1 ? true : false} on_click={() => setScoreRate(2)}/>
                <Svgs name={'star'} styling={Math.round(scoreRate) > 2 ? true : false} on_click={() => setScoreRate(3)}/>
                <Svgs name={'star'} styling={Math.round(scoreRate) > 3 ? true : false} on_click={() => setScoreRate(4)}/>
                <Svgs name={'star'} styling={Math.round(scoreRate) > 4 ? true : false} on_click={() => setScoreRate(5)}/>
              </div>

              <textarea onChange={(e) => setReviewText(e.target.value)} placeholder={getReviewTextHolder()}/>
              <button onClick={writeReview}>{sendingReview ? <LoadingCircle /> : 'Publish'}</button>
              <p style={{ color: sendReviewError.length > 0 && 'var(--softRed)' }}>
                {sendReviewError.length > 0 ? sendReviewError : sendReviewSuccess}
              </p>

            </div>
            <ul>
              {item.reviews.slice(0, reviewsNumber).map((rv) => (
                <ReviewCard isEnglish item={rv} setReportDiv={setReportDiv} setWriterId={setWriterId}
                  isAdmin={isAdmin()} revsToDeleteAdmin={revsToDeleteAdmin} setRevsToDeleteAdmin={setRevsToDeleteAdmin}/>
              ))}
            </ul>

            <button style={{ display: item.reviews?.length <= 0 ? 'none' : undefined }} onClick={() => setReviewsNumber(reviewsNumber + 10)}>More Reviews</button>

          </div>

          <div className='mapDiv' style={{ display: !isMap && 'none' }}>

            <div className='addressMapDiv'><Image src={LocationGif}/><h3>{JordanCities.find(i => i.value === item.city)?.value}, {item.en_data?.neighbourEN || item.neighbourhood}</h3></div>
          
            <h5 className='moreDetailsAfterPay'><Svgs name={'info'}/>The host will send you exact location details after confirming your reservation</h5>

            <div className='googleMapDiv' onClick={showMap}>
                <span>See the location on the map</span>
                <Image src={GoogleMapImage}/>
            </div>
          
          </div>

          <ul className='termsUL' style={{ display: !isTerms && 'none' }}>
            <li id='hostLiTermsUL'><Svgs name={'host'}/><h3>Terms of service provider (The Host)</h3>
              <ul>
                {item.terms_and_conditions.map((tc) => (
                  <li key={tc}>{tc}</li>
                ))}
              </ul>
            </li>
            <li id='hostLiTermsUL'><Svgs name={'terms'}/><h3>Platform Terms of use and Conditions</h3>
                <ul>
                  {myConditions(true).map((term) => (
                    <li>{term}</li>
                  ))}
                </ul>
            </li>
            <li id='hostLiTermsUL'><Svgs name={'communicate'}/><h3>Ways to communicate with the Host</h3>
                <ul>
                  {item.contacts?.map((contact, index) => (
                    isValidContactURL(contact) && <li style={{ cursor: 'pointer' }} key={index} onClick={() => openContactURL(contact)}>{contact.platform}</li>
                  ))}
                </ul>
            </li>
          </ul>

        </div>

        <h2 id='checkoutDetailsH2'>Booking details</h2>

        <div className='checkout'>

          {(isCalendar && !isCheckout) && <HeaderPopup type={'calendar'} isViewPage days={item.booked_days} setCalendarDoubleValue={setCalendarDoubleValue} isEnglish/>}

          <div className='nightsDiv' onClick={() => setIsReservationType(!isReservationType)}>
            <h3 id='res-type'>Select Type of reservation {'(daily, weekly, yearly ...etc)'}</h3>
            <h3 style={{ color: 'var(--secondColorDark)' }}>{getPrice()}<span style={{ marginLeft: 8 }}> {currencyCode(true, true)} / {reservationType()?.find(i => i.id === resType?.id)?.oneEn}</span></h3>
            <h3 style={{ color: '#777' }}><span style={{ marginRight: 8 }}>Number of {reservationType()?.find(i => i.id === resType?.id)?.oneEn + 's'}</span> {resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue)}</h3>
            {isReservationType && !isCheckout && <HeaderPopup type={'custom'} isCustom={isReservationType} selectedCustom={resType}
            setSelectedCustom={setResType} setIsCustom={setIsReservationType}
            customArray={reservationType(true)} isEnglish myStyle={{ maxWidth: 360 }} />}
          </div>

          <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
          {getNameByLang('تاريخ الحجز', true)}
            <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(0), true, true)}</h3>
          </div>

          <div style={{ display: resType?.id > 0 ? 'none' : undefined }} className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
            {getNameByLang('تاريخ انتهاء الحجز', true)}
            <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(1), true, true)}</h3>
          </div>

          {resType?.id > 0 && <CustomInputDiv title={'Enter number of ' + reservationType()?.find(i => i.id === resType?.id)?.oneEn + 's'}
          type={'number'} value={resTypeNum} listener={(e) => {
            setResTypeNum(Number(e.target.value));
          }} myStyle={{ marginBottom: 32 }}/>}

          <div className='cost' style={{ marginTop: 'auto' }}>
            <h3 style={{ display: (getNumOfBookDays(calendarDoubleValue) >= item.discount?.num_of_days_for_discount && item.discount?.percentage > 0)
              ? null : 'none' }}>Discount {item.discount?.percentage}% <span>- {(resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue) * getPrice() * item.discount?.percentage / 100).toFixed(2)} {currencyCode(false, true)}</span></h3>
            <h3>Total Cost of {resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue)} {reservationType(null, resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue), true)?.find(i => i.id === resType?.id)?.oneEn + 's'} <span>{(((resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue)) * getPrice()) - (item.discount?.percentage ? ((resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue)) * getPrice() * item.discount.percentage / 100) : 0)).toFixed(2)} {currencyCode(true, true)}</span></h3>
          </div> 

          <button className='btnbackscndclr' id={(item.owner_id === userId || !canBook || (!booksIds.find(i => i.property_id === id) && (!calendarDoubleValue?.at(0) || !calendarDoubleValue?.at(1)))) ? 'disable-button' : ''} 
            onClick={handleBook}>
              {(item.owner_id !== userId) 
                ? (canBook ? (addingToBooks 
                    ? <LoadingCircle isLightBg/>
                    : (booksIds.find(i => i.property_id === id) ? 'Remove from my Books' : 'Book')) : ((!isOkayBookDays(calendarDoubleValue, item.booked_days) && item.is_able_to_book) ? 'Reservations are not possible on these days' 
                  : getReasonForNotBook()))
              : 'This is your own offer'}
          </button>

          <p id='info-p' style={{ marginTop: bookSuccess?.length > 0 ? 8 : 0 }}>{bookSuccess}</p>

        </div>

      </div>

      {isMobile && <div className='mobileBookBtn'>
        <button onClick={() => setIsCheckout(true)} className='btnbackscndclr'>Book now</button>
        <div>
          <span id={item.discount?.percentage > 0 ? 'old-price' : 'original-price'}>{getPrice()} {currencyCode(true, true)}</span>
          {item.discount?.percentage > 0 && <span id='discounted-price'>{getPrice() - (getPrice() * (item.discount?.percentage)) / 100} {currencyCode(true, true)}</span>}
          / {reservationType()?.find(i => i.id === resType?.id)?.oneEn}
        </div>
      </div>}

      {(isMobile) && <div className={`checkout ${isCheckout ? 'mobile-checkout-popup' : 'mobile-checkout-popup-hidden'}`}>

        {(isCalendar) && <span onClick={() => {
          setIsCalendar(false);
        }} id='spanForClosingPopups'/>}

        <h2 id='checkoutDetailsH2'>Book Details </h2>

        <div id='close-checkout' onClick={() => setIsCheckout(false)}><Svgs name={'cross'}/></div>

        {(isCalendar && isCheckout) && <HeaderPopup type={'calendar'} isViewPage days={item.booked_days} setCalendarDoubleValue={setCalendarDoubleValue}/>}

        <div className='nightsDiv' onClick={() => setIsReservationType(!isReservationType)}>
        <h3 id='res-type'>Select Type of reservation {'(daily, weekly, yearly ...etc)'}</h3>
          <h3 style={{ color: 'var(--secondColorDark)' }}>{getPrice()}<span> {currencyCode(true, true)} / {reservationType()?.find(i => i.id === resType?.id)?.oneEn}</span></h3>
          <h3 style={{ color: '#777' }}><span>Number of {reservationType()?.find(i => i.id === resType?.id)?.oneEn + 's'}</span> {resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue)}</h3>
          {isReservationType && isCheckout && <HeaderPopup type={'custom'} isCustom={isReservationType} selectedCustom={resType}
          setSelectedCustom={setResType} setIsCustom={setIsReservationType}
          customArray={reservationType()} isEnglish/>}
        </div>

        <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
          Book Start Date
          <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(0), true, true)}</h3>
        </div>

        <div className='bookingDate' style={{ display: resType?.id > 0 ? 'none' : undefined }} onClick={() => setIsCalendar(!isCalendar)}>
          Book End Date
          <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(1), true, true)}</h3>
        </div>

        {resType?.id > 0 && <CustomInputDiv title={'Enter number of ' + reservationType()?.find(i => i.id === resType?.id)?.oneEn + 's'}
        type={'number'} value={resTypeNum} listener={(e) => {
          setResTypeNum(Number(e.target.value));
        }} myStyle={{ marginBottom: 32 }}/>}

        <div className='cost' style={{ marginTop: 'auto' }}>
          <h3 style={{ display: (getNumOfBookDays(calendarDoubleValue) >= item.discount?.num_of_days_for_discount && item.discount?.percentage > 0)
            ? null : 'none' }}>Discount {item.discount?.percentage}% <span>- {(resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue) * getPrice() * item.discount?.percentage / 100).toFixed(2)} {currencyCode(false, true)}</span></h3>
          <h3>Total Cost {resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue)} {reservationType(null, resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue), true)?.find(i => i.id === resType?.id)?.oneEn + 's'} <span>{(((resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue)) * getPrice()) - (item.discount?.percentage ? ((resType?.id > 0 ? resTypeNum : getNumOfBookDays(calendarDoubleValue)) * getPrice() * item.discount.percentage / 100) : 0)).toFixed(2)} {currencyCode(true, true)}</span></h3>
        </div> 

        <button className='btnbackscndclr' id={(item.owner_id === userId || !canBook || (!booksIds.find(i => i.property_id === id) && (!calendarDoubleValue?.at(0) || !calendarDoubleValue?.at(1)))) ? 'disable-button' : ''} 
          onClick={handleBook}>
            {(item.owner_id !== userId) 
              ? (canBook 
                ? (addingToBooks 
                  ? <LoadingCircle />
                  : (booksIds.find(i => i.property_id === id) ? 'Remove from book list' : 'Book')) 
                : getReasonForNotBook())
            : 'This is your own offer'}
        </button>

        <p id='info-p' style={{ marginTop: bookSuccess?.length > 0 ? 8 : 0 }}>{bookSuccess}</p>

      </div>}

      {(isCalendar || shareDiv || reportDiv || isReservationType) && <span onClick={() => {
        setIsCalendar(false); setShareDiv(false); setReportDiv(false); setIsReservationType(false);
      }} id='spanForClosingPopups'/>}

    </div>
  )
}

export default page
