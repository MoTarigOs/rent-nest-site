'use client'

import './Properties.css';
import { Suspense, useContext, useEffect, useState } from "react";
import { Context } from "@utils/Context";
import { ProperitiesCatagories, maximumPrice, minimumPrice } from "@utils/Data";
import { getArabicNameCatagory, getNameByLang, getReadableDate } from "@utils/Logic";
import { useSearchParams } from "next/navigation";
import MyCalendar from "@components/MyCalendar";
import HeaderPopup from "@components/popups/HeaderPopup";
import MapGif from '@assets/icons/map.gif';
import Link from "next/link";
import Image from "next/image";
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
        setCalendarDoubleValue, setIsSearchMap
    } = useContext(Context);

    const getSelectedCategories = (array) => {
        let str = '';
        array.forEach((element, index) => {
          str += element.arabicName + (index >= array.length - 1 ? '' : ', ');
        });
        return str?.length > 0 ? str : ('الكل');
    };

    useEffect(() => {
        if(ProperitiesCatagories.find(i => i.value === catagoryParam)){
            setCatagory(catagoryParam);
        }
    }, [catagoryParam]);

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
                    نوع العفار
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
                
                <div className='bookingDate' style={{  }} onClick={() => { setIsFilterHeader(false); settingPropertiesArray(); }}>بحث</div>

                <div className='bookingDate' onClick={() => setIsFilterHeader(false)}>الغاء</div>

                </> : <div className='expand-div disable-text-copy'>
                <div onClick={() => setIsFilterHeader(true)}>
                    {city?.arabicName || 'المدينة غير محددة'} 
                    <h3 suppressHydrationWarning>الحجز {getReadableDate(calendarDoubleValue?.at(0), true, false)} - {getReadableDate(calendarDoubleValue?.at(1), true, false)}</h3>
                </div>
                <Link href={'/search'}><Image onClick={() => setIsSearchMap(true)} src={MapGif} /></Link>
            </div>}

        </div>

        <PropertiesArray type={'properties'} cardsPerPage={cardsPerPage} catagoryParam={catagoryParam}/>

    </div>
  )
}

const SuspenseWrapper = () => (
	<Suspense>
		<Page />
	</Suspense>
);

export default SuspenseWrapper;
