'use client';

import CustomInputDiv from '@components/CustomInputDiv';
import '@styles/components_styles/MobileFilter.css';
import { Context } from '@utils/Context';
import { useContext, useEffect, useState } from 'react';
import HeaderPopup from './HeaderPopup';
import CatagoryCard from '@components/CatagoryCard';
import VehicleImage from '@assets/images/sedan-car.png';
import PropertyImage from '@assets/images/property.png';
import PropertyWhiteImage from '@assets/images/property-white.png';
import { ProperitiesCatagories, VehicleCatagories } from '@utils/Data';
import { getNameByLang, getReadableDate } from '@utils/Logic';
import Calendar from 'react-calendar';
import MyCalendar from '@components/MyCalendar';
import Link from 'next/link';

const MobileFilter = ({ isEnglish }) => {

    const { 
      isMobileHomeFilter, setIsMobileHomeFilter, city,
      catagory, setCatagory, calendarDoubleValue,
      setCalendarDoubleValue, setCity
    } = useContext(Context);

    const [isCityDiv, setIsCityDiv] = useState(false);
    const [selectedCatagories, setSelectedCatagories] = useState('1');
    const [isCalendar, setIsCalendar] = useState(false);
    
    const getCatagoryArray = () => {
        if(selectedCatagories === '0'){
            return VehicleCatagories;
        } else {
            return ProperitiesCatagories;
        }
    };

    const getNavLink = () => {

      if(selectedCatagories === '0'){
        return '/vehicles';
      } else {
        return `/properties?catagory=${catagory}`;
      };

    };

    useEffect(() => {
      if(isMobileHomeFilter){
        if(ProperitiesCatagories.find(i => i.value === catagory)){
          setSelectedCatagories('1');
        } else if(VehicleCatagories.find(i => i.value === catagory)) {
          setSelectedCatagories('0');
        }
      }
    }, [isMobileHomeFilter, catagory]);

  return (
    <div className='mobileFilter' style={{ display: !isMobileHomeFilter ? 'none' : null }}>
      
        <div id='close-span' onClick={() => {
          if(isCityDiv || isCalendar){
            setIsCityDiv(false);
            setIsCalendar(false);
          } else {
            setIsMobileHomeFilter(false);
          }
        }} />

        <div className='filter-content'>

          <div id='mobile-filter-header'/>

          <div id='close-popups' style={{
            display: (isCalendar || isCityDiv) ? null : 'none',
            width: '100%',
            height: '100%'
          }} onClick={() => {
            setIsCalendar(false);
            setIsCityDiv(false);
          }}/>

          <div className='city-div-filter' onClick={() => {
            setIsCityDiv(!isCityDiv);
          }}>
            <CustomInputDiv title={getNameByLang('المدينة', isEnglish)} isCity value={city.arabicName === '' ? getNameByLang('كل المدن', isEnglish) : isEnglish ? city.value : city.arabicName} listener={() => setIsCityDiv(true)}/>
            {isCityDiv && <HeaderPopup type={'city'} isEnglish={isEnglish}/>}
          </div>

          <hr />

          <div className='book-date'>

            <div className='calendar-div' style={{ display: !isCalendar ? 'none' : null }}>
              <MyCalendar type={'mobile-filter'}  setCalender={setCalendarDoubleValue}/>
            </div>

            <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
              {getNameByLang('تاريخ الحجز', isEnglish)}
              <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(0), true, isEnglish)}</h3>
            </div>

            <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
              {getNameByLang('تاريخ انتهاء الحجز', isEnglish)}
              <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(1), true, isEnglish)}</h3>
            </div>

          </div>

          <hr />

          <h2>{getNameByLang('التصنيف', isEnglish)}</h2>

          <div className="catagory">
              <ul>
                  <li onClick={() => setCatagory('')}
                      className={catagory === '' && 'selectedCatagory'}
                  >
                      {getNameByLang('كل التصنيفات', isEnglish)}
                  </li>
                  {getCatagoryArray().map((ctg) => (
                      <li onClick={() => setCatagory(ctg.value)}
                          className={catagory === ctg.value && 'selectedCatagory'}
                      >
                          {getNameByLang(ctg.arabicName, isEnglish)}
                      </li>
                  ))}
              </ul>
          </div>

          <hr />

          <div className='mobile-filter-buttons'>
              <Link style={{ width: '100%' }} onClick={() => setIsMobileHomeFilter(false)} href={getNavLink()}>{getNameByLang('الذهاب', isEnglish)}</Link>
              <Link style={{ width: '100%' }} onClick={() => {
                setCatagory('');
                setCity('');
                setCalendarDoubleValue(null);
                setIsMobileHomeFilter(false);
              }} href={'/search'} id='skip-filter'>{getNameByLang('تخطي', isEnglish)}</Link>
          </div>

        </div>

    </div>
  )
};

export default MobileFilter;
