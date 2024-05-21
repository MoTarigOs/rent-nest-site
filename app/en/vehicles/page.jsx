'use client'

import '../../properties/Properties.css';
import { useContext, useEffect, useState } from "react";
import { Context } from "@utils/Context";
import { VehiclesTypes } from "@utils/Data";
import { getNameByLang, getReadableDate } from "@utils/Logic";
import MyCalendar from "@components/MyCalendar";
import HeaderPopup from '@components/popups/HeaderPopup';
import PropertiesArray from '@components/PropertiesArray';

const page = () => {

    const [isCalendar, setIsCalendar] = useState(false);
    const [isFilterHeader, setIsFilterHeader] = useState(false);
    const [isCityDiv, setIsCityDiv] = useState(false);
    const [isCategoryDiv, setIsCategoryDiv] = useState(false);
    const cardsPerPage = 16;

    const { 
        city, setCity, calendarDoubleValue, 
        setIsModalOpened,
        setCalendarDoubleValue,
        vehicleType
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
    <div className="properitiesPage" dir='ltr'>

        <span id="close-popups" style={{ display: (isCalendar || isCityDiv || isCategoryDiv) ? null : 'none'}}
        onClick={() => {
            setIsCalendar(false); setIsCityDiv(false); setIsCategoryDiv(false);
        }}/>

        <div className='page-header-filter' dir='ltr' style={{ padding: !isFilterHeader ? '8px 16px' : undefined }}>

            <div className='calendar-div' style={{ display: !isCalendar ? 'none' : null }}>
                <MyCalendar type={'mobile-filter'} setCalender={setCalendarDoubleValue}/>
            </div>

            {isFilterHeader ? <><div className='bookingDate city-header-div'
                onClick={() => setIsCityDiv(true)}>
                    City
                <h3>{city?.arabicName || 'Undefined'}</h3>
                {isCityDiv && <HeaderPopup type={'add-city'} isEnglish={true} itemCity={city} setItemCity={setCity}/>}
            </div>

            <div className='bookingDate city-header-div' onClick={() => setIsCategoryDiv(!isCategoryDiv)}>
                Vehicle type
                <h3>{VehiclesTypes.find(i => i.id === vehicleType)?.value || 'All'}</h3>
                    {isCategoryDiv && <HeaderPopup type={'vehcile types'} isEnglish={true}/>}
            </div>

            <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
            {getNameByLang('تاريخ الحجز', true)}
            <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(0), true, true)}</h3>
            </div>

            <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
            {getNameByLang('تاريخ انتهاء الحجز', true)}
            <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(1), true, true)}</h3>
            </div>
            
            <div className='bookingDate' style={{  }} onClick={() => { setIsFilterHeader(false); settingPropertiesArray(); }}>Search</div>

            <div className='bookingDate' onClick={() => setIsFilterHeader(false)}>Cancel</div>

            </> : <div className='expand-div disable-text-copy'>
                <div onClick={() => setIsFilterHeader(true)}>
                    {city.value || 'Undefined city'} 
                    <h3 suppressHydrationWarning>Reservation date {getReadableDate(calendarDoubleValue?.at(0), true, true)} - {getReadableDate(calendarDoubleValue?.at(1), true, true)}</h3>
                </div>
            </div>}

        </div>

        <PropertiesArray isEnglish type={'vehicles'} cardsPerPage={cardsPerPage}/>

    </div>
  )
}

export default page
