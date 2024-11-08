'use client';

import '@styles/components_styles/PageFilterHeader.scss';
import { Context } from '@utils/Context';
import { useContext, useEffect, useState } from 'react';
import HeaderPopup from './popups/HeaderPopup';
import { getArabicNameCatagory, getNameByLang, getReadableDate } from '@utils/Logic';
import Link from 'next/link';
import Image from 'next/image';
import MapGif from '@assets/icons/map.gif';
import MyCalendar from './MyCalendar';
import { VehiclesTypes } from '@utils/Data';

const PageFilterHeader = ({ 
    isEnglish, isVehicles, isSearch
}) => {

    const [isFilterHeader, setIsFilterHeader] = useState(false);
    const [isCityDiv, setIsCityDiv] = useState(false);
    const [isCategoryDiv, setIsCategoryDiv] = useState(false);
    const [isCalendar, setIsCalendar] = useState(false);

    const { 
        city, catagory, categoryArray, calendarDoubleValue,
        setTriggerFetch, triggerFetch, setIsSearchMap,
        setCity, setCalendarDoubleValue, setIsModalOpened,
        vehicleType
    } = useContext(Context);

    const getSelectedCategories = (array) => {
        let str = '';
        array.forEach((element, index) => {
          str += (isEnglish ? element?.value : element.arabicName) + (index >= array.length - 1 ? '' : ', ');
        });
        return str?.length > 0 ? str : (isEnglish ? 'All' : 'الكل');
    };

    useEffect(() => {
        if(isCityDiv || isCategoryDiv || isCalendar) return setIsModalOpened(true);
        else setIsModalOpened(false);
    }, [isCityDiv, isCategoryDiv, isCalendar]);

  return (
        
    <div className='filter-header' dir={isEnglish ? 'ltr' : undefined}
        style={{ padding: !isFilterHeader ? '8px 16px' : undefined }}>
        
        <span id="close-popups" style={{ display: (isCityDiv || isCategoryDiv || isCalendar) ? null : 'none'}}
          onClick={() => {
            setIsCityDiv(false); setIsCategoryDiv(false);
            setIsCalendar(false);
          }}/>

        <div className='calendar-div' style={{ display: !isCalendar ? 'none' : null }}>
            <MyCalendar type={'mobile-filter'} setCalender={setCalendarDoubleValue}/>
        </div>

        {isFilterHeader ? <><div className='bookingDate city-header-div'
         onClick={() => setIsCityDiv(true)}>
                {isEnglish ? 'City' : 'المدينة'}
                <h3>{isEnglish ? (city?.value || 'Undefined') : (city?.arabicName || 'لم تحدد')}</h3>
                {isCityDiv && <HeaderPopup type={'city'} itemCity={city} setItemCity={setCity} isEnglish={isEnglish}/>}
            </div>

            {!isVehicles && <div className='bookingDate city-header-div' onClick={() => setIsCategoryDiv(!isCategoryDiv)}>
                {isEnglish ? (isSearch ? 'Category' : 'Property Category') : (isSearch ? 'التصنيف' : 'نوع العقار')}
                <h3>{categoryArray?.length > 0 ? getSelectedCategories(categoryArray) : (isEnglish ? catagory : getArabicNameCatagory(catagory)) || (isEnglish ? 'All' : 'الكل')}</h3>
                {isCategoryDiv && <HeaderPopup type={'catagory'} isSearch={isSearch} isEnglish={isEnglish}/>}
            </div>} 
            
            {isVehicles && <div className='bookingDate city-header-div' onClick={() => setIsCategoryDiv(!isCategoryDiv)}>
                {isEnglish ? 'Vehicle Type' : 'نوع السيارة'}
                <h3>{(isEnglish ? VehiclesTypes.find(i => i.id === vehicleType)?.value : VehiclesTypes.find(i => i.id === vehicleType)?.arabicName) || (isEnglish ? 'All Types' : 'الكل')}</h3>
                {isCategoryDiv && <HeaderPopup type={'vehcile types'} isEnglish={isEnglish}/>}
            </div>}

            <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
            {getNameByLang('تاريخ الحجز', isEnglish)}
            <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(0), true, isEnglish)}</h3>
            </div>

            <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
            {getNameByLang('تاريخ انتهاء الحجز', isEnglish)}
            <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(1), true, isEnglish)}</h3>
            </div>
            
            <div className='bookingDate' onClick={() => { setIsFilterHeader(false); setTriggerFetch(!triggerFetch) }}>{isEnglish ? 'Search' : 'بحث'}</div>

            <div className='bookingDate' onClick={() => setIsFilterHeader(false)}>{isEnglish ? 'Cancel' : 'الغاء'}</div>

            </> : <div className='expand-div disable-text-copy'>
            <div onClick={() => setIsFilterHeader(true)}>
                {isEnglish ? (city?.value || 'Undefined') : (city?.arabicName || 'المدينة غير محددة')} 
                <h3 suppressHydrationWarning>{isEnglish ? 'Booking' : 'الحجز'} {getReadableDate(calendarDoubleValue?.at(0), true, isEnglish)} - {getReadableDate(calendarDoubleValue?.at(1), true, isEnglish)}</h3>
            </div>
            <Link href={isEnglish ? '/en/search' : '/search'}><Image onClick={() => setIsSearchMap(true)} src={MapGif} /></Link>
        </div>}
    </div>
  )
};

export default PageFilterHeader;
