'use client';

import './Search.css';
import Image from 'next/image';
import MapGif from '@assets/icons/map.gif';
import { useContext, useEffect, useState } from 'react';
import { JordanCities } from '@utils/Data';
import { getArabicNameCatagory, getNameByLang, getReadableDate } from '@utils/Logic';
import { Context } from '@utils/Context';
import MyCalendar from '@components/MyCalendar';
import HeaderPopup from '@components/popups/HeaderPopup';
import PropertiesArray from '@components/PropertiesArray';
import MapPopup from '@components/popups/MapPopup';
import { getUserLocation } from '@utils/ServerComponents';

const page = () => {

  const [runOnce, setRunOnce] = useState(false);
  const [isFilterHeader, setIsFilterHeader] = useState(false);
  const [isCityDiv, setIsCityDiv] = useState(false);
  const [isCalendar, setIsCalendar] = useState(false);
  const [isCategoryDiv, setIsCategoryDiv] = useState(false);
  const cardsPerPage = 12;

  const { 
      rangeValue, city, setCity, catagory, 
      ratingScore, triggerFetch, searchText, 
      arrangeValue, calendarDoubleValue, setTriggerFetch,
      isCalendarValue, setCalendarDoubleValue, categoryArray,
      setIsModalOpened, setLatitude, setLongitude, longitude, latitude,
      isSearchMap, setIsSearchMap, isMobile,
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
      kitchenFilter
  } = useContext(Context);

  const getMyLoc = async() => {
    const loc = await getUserLocation();
    setLongitude(city?.long || loc.long || JordanCities[0].long);
    setLatitude(city?.lat || loc.lat || JordanCities[0].lat);
  };

  const getSelectedCategories = (array) => {
    let str = '';
    array.forEach((element, index) => {
      str += element.arabicName + (index >= array.length - 1 ? '' : ', ');
    });
    return str?.length > 0 ? str : ('الكل');
  };

  const settingPreventScroll = () => {
    if(isCityDiv || isCategoryDiv || isCalendar) 
      return setIsModalOpened(true);
    setIsModalOpened(false);
  };

  useEffect(() => {
      setRunOnce(true);
  }, []);

  useEffect(() => {
    if(runOnce) {
      settingPreventScroll();
      getMyLoc();
    }
  }, [runOnce]);

  useEffect(() => {
    if(!runOnce && catagory === ''){
      setRunOnce(true);
    }
  }, [catagory]);

  useEffect(() => {
    settingPreventScroll();
  }, [isCityDiv, isCategoryDiv, isCalendar]);

  return (
    <div className='search'>

        <span id="close-popups" style={{ display: (isCalendar || isCityDiv || isCategoryDiv) ? null : 'none'}}
          onClick={() => {
            setIsCalendar(false); setIsCityDiv(false); setIsCategoryDiv(false);
          }}/>

        <div className='page-header-filter' style={{ padding: !isFilterHeader ? '8px 16px' : undefined }}>

            <div className='calendar-div' style={{ display: !isCalendar ? 'none' : null }}>
                <MyCalendar type={'mobile-filter'} setCalender={setCalendarDoubleValue}/>
            </div>

            {isFilterHeader ? <><div className='bookingDate city-header-div'
              onClick={() => setIsCityDiv(true)}>
                المدينة
                <h3>{city?.arabicName || 'لم تحدد'}</h3>
                {isCityDiv && <HeaderPopup type={'add-city'} itemCity={city} setItemCity={setCity}/>}
              </div>

              <div className='bookingDate city-header-div' onClick={() => setIsCategoryDiv(!isCategoryDiv)}>
                نوع العقار
                <h3>{categoryArray?.length > 0 ? getSelectedCategories(categoryArray) : getArabicNameCatagory(catagory) || 'الكل'}</h3>
                {isCategoryDiv && <HeaderPopup type={'catagory'} isEnglish={false}/>}
              </div>

              <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
              {getNameByLang('تاريخ الحجز', false)}
              <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(0), true, false)}</h3>
              </div>

              <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
              {getNameByLang('تاريخ انتهاء الحجز', false)}
              <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(1), true, false)}</h3>
              </div>
              
              <div className='bookingDate' onClick={() => { setIsFilterHeader(false); setTriggerFetch(!triggerFetch) }}>بحث</div>

              <div className='bookingDate' onClick={() => setIsFilterHeader(false)}>الغاء</div>
            
            </> : <div className='expand-div disable-text-copy'>
              <div onClick={() => setIsFilterHeader(true)}>
                {city.arabicName || 'المدينة غير محددة'} 
                <h3 suppressHydrationWarning>الحجز {getReadableDate(calendarDoubleValue?.at(0), true, false)} - {getReadableDate(calendarDoubleValue?.at(1), true, false)}</h3>
              </div>
              <Image onClick={() => setIsSearchMap(true)} src={MapGif} />
            </div>}

        </div>

        <MapPopup />

        <PropertiesArray isHide={isSearchMap} cardsPerPage={cardsPerPage} 
        type={'search'} isSearchMap={isSearchMap}
         longitude={longitude} latitude={latitude} dontFetchWithHide />

    </div>
  )
}

export default page;
