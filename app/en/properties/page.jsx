'use client'

import '../../properties/Properties.css';
import { Suspense, useContext, useEffect, useState } from "react";
import { Context } from "@utils/Context";
import { ProperitiesCatagories, maximumPrice, minimumPrice } from "@utils/Data";
import { getNameByLang, getReadableDate } from "@utils/Logic";
import { useSearchParams } from "next/navigation";
import MyCalendar from "@components/MyCalendar";
import HeaderPopup from "@components/popups/HeaderPopup";
import Image from "next/image";
import Link from "next/link";
import MapGif from '@assets/icons/map.gif';
import PropertiesArray from "@components/PropertiesArray";

const Page = () => {

    const catagoryParam = useSearchParams().get('catagory');
    const [isCalendar, setIsCalendar] = useState(false);
    const [isFilterHeader, setIsFilterHeader] = useState(false);
    const [isCityDiv, setIsCityDiv] = useState(false);
    const [isCategoryDiv, setIsCategoryDiv] = useState(false);
    const cardsPerPage = 16;

    const { 
        city, setCity, catagory, categoryArray,
        setCatagory, calendarDoubleValue,
        setCalendarDoubleValue, setIsSearchMap,
        triggerFetch, setTriggerFetch
    } = useContext(Context);

    const getSelectedCategories = (array) => {
        let str = '';
        array.forEach((element, index) => {
          str += element.value + (index >= array.length - 1 ? '' : ', ');
        });
        return str?.length > 0 ? str : ('الكل');
    };

    useEffect(() => {
        if(ProperitiesCatagories.find(i => i.value === catagoryParam)){
            setCatagory(catagoryParam);
        }
    }, [catagoryParam]);

  return (
    <div className="properitiesPage" dir="ltr">

        <span id="close-popups" style={{ display: (isCalendar || isCityDiv || isCategoryDiv) ? null : 'none'}}
          onClick={() => {
            setIsCalendar(false); setIsCityDiv(false); setIsCategoryDiv(false);
          }}/>

        <div className='page-header-filter' style={{ padding: !isFilterHeader ? '8px 16px' : undefined }}>

            <div className='calendar-div' style={{ display: !isCalendar ? 'none' : null }}>
                <MyCalendar  type={'mobile-filter'} setCalender={setCalendarDoubleValue}/>
            </div>

            {isFilterHeader ? <><div className='bookingDate city-header-div'
                onClick={() => setIsCityDiv(true)}>
                    City
                    <h3>{city?.value || 'Undefined'}</h3>
                    {isCityDiv && <HeaderPopup isEnglish type={'add-city'} itemCity={city} setItemCity={setCity}/>}
                </div>

                <div className='bookingDate city-header-div' onClick={() => setIsCategoryDiv(!isCategoryDiv)}>
                    Property Type
                    <h3>{categoryArray?.length > 0 ? getSelectedCategories(categoryArray) : catagory || 'All'}</h3>
                    {isCategoryDiv && <HeaderPopup type={'catagory'} isEnglish/>}
                </div>

                <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
                {getNameByLang('تاريخ الحجز', true)}
                <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(0), true, true)}</h3>
                </div>

                <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
                {getNameByLang('تاريخ انتهاء الحجز', true)}
                <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(1), true, true)}</h3>
                </div>
                
                <div className='bookingDate' onClick={() => { setIsFilterHeader(false); setTriggerFetch(!triggerFetch); }}>Search</div>

                <div className='bookingDate' onClick={() => setIsFilterHeader(false)}>Cancel</div>

                </> : <div className='expand-div disable-text-copy'>
                <div onClick={() => setIsFilterHeader(true)}>
                    {city?.value || 'City Undefined'} 
                    <h3 suppressHydrationWarning>Reservation {getReadableDate(calendarDoubleValue?.at(0), true, true)} - {getReadableDate(calendarDoubleValue?.at(1), true, true)}</h3>
                </div>
                <Link href={'/en/search'}><Image onClick={() => setIsSearchMap(true)} src={MapGif} /></Link>
            </div>}

        </div>

        <PropertiesArray isEnglish type={'properties'} cardsPerPage={cardsPerPage} catagoryParam={catagoryParam}/>

    </div>
  )
}

const SuspenseWrapper = () => (
	<Suspense>
		<Page />
	</Suspense>
);

export default SuspenseWrapper;
