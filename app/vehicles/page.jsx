'use client'

import '../properties/Properties.css';
import { useContext, useEffect, useState } from "react";
import { Context } from "@utils/Context";
import { getNameByLang, getReadableDate } from "@utils/Logic";
import MyCalendar from "@components/MyCalendar";
import HeaderPopup from '@components/popups/HeaderPopup';
import { VehiclesTypes } from '@utils/Data';
import PropertiesArray from '@components/PropertiesArray';

const page = () => {

    const [isCalendar, setIsCalendar] = useState(false);
    const [isFilterHeader, setIsFilterHeader] = useState(false);
    const [isCityDiv, setIsCityDiv] = useState(false);
    const [isCategoryDiv, setIsCategoryDiv] = useState(false);
    const cardsPerPage = 16;

    const { 
        city, setCity, vehicleType,
        setIsModalOpened,
        calendarDoubleValue, setCalendarDoubleValue,
        triggerFetch, setTriggerFetch
    } = useContext(Context);

    const settingPreventScroll = () => {
        if(isCityDiv || isCategoryDiv || isCalendar) 
          return setIsModalOpened(true);
        setIsModalOpened(false);
    };

    useEffect(() => {
        settingPreventScroll();
    }, [isCityDiv, isCategoryDiv, isCalendar]);
    
    
  return (
    <div className="properitiesPage">

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
                    نوع السيارة
                    <h3>{VehiclesTypes.find(i => i.id === vehicleType)?.arabicName || 'الكل'}</h3>
                    {isCategoryDiv && <HeaderPopup type={'vehcile types'} isEnglish={false}/>}
                </div>

                <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
                {getNameByLang('تاريخ الحجز', false)}
                <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(0), true, false)}</h3>
                </div>

                <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
                {getNameByLang('تاريخ انتهاء الحجز', false)}
                <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(1), true, false)}</h3>
                </div>
                
                <div className='bookingDate' style={{  }} onClick={() => { setIsFilterHeader(false); setTriggerFetch(!triggerFetch) }}>بحث</div>

                <div className='bookingDate' onClick={() => setIsFilterHeader(false)}>الغاء</div>

                </> : <div className='expand-div disable-text-copy'>
                <div onClick={() => setIsFilterHeader(true)}>
                    {city.arabicName || 'المدينة غير محددة'} 
                    <h3 suppressHydrationWarning>الحجز {getReadableDate(calendarDoubleValue?.at(0), true, false)} - {getReadableDate(calendarDoubleValue?.at(1), true, false)}</h3>
                </div>
            </div>}

        </div>

        <PropertiesArray type={'vehicles'} cardsPerPage={cardsPerPage}/>

    </div>
  )
}

export default page
