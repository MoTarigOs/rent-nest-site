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
import { getReadableDate } from '@utils/Logic';
import Calendar from 'react-calendar';
import MyCalendar from '@components/MyCalendar';
import Link from 'next/link';

const MobileFilter = () => {

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
            display: (isCalendar || isCityDiv) ? null : 'none'
          }} onClick={() => {
            setIsCalendar(false);
            setIsCityDiv(false);
          }}/>

          <div className='city-div-filter' onClick={() => {
            setIsCityDiv(!isCityDiv);
          }}>
            <CustomInputDiv title={'اختر مدينة'} isCity value={city.arabicName === '' ? 'كل المدن' : city.arabicName} listener={() => setIsCityDiv(true)}/>
            {isCityDiv && <HeaderPopup type={'city'} />}
          </div>

          <hr />

          <div className='book-date'>

            <div className='calendar-div' style={{ display: !isCalendar ? 'none' : null }}>
              <MyCalendar type={'mobile-filter'}  setCalender={setCalendarDoubleValue}/>
            </div>

            <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
              تاريخ الحجز
              <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(0), true)}</h3>
            </div>

            <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
              تاريخ انتهاء الحجز
              <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(1), true)}</h3>
            </div>

          </div>

          <hr />

          <h2>ما الذي تريد إِيجاره</h2>

          <ul className='selectCatagory'>

              <CatagoryCard type={'add'} image={VehicleImage} title={'سيارة'} catagoryId={'0'} selectedCatagories={selectedCatagories} setSelectedCatagories={setSelectedCatagories}/>
              
              <CatagoryCard type={'add'} image={selectedCatagories !== '1' ? PropertyImage : PropertyWhiteImage} title={'عقار'} catagoryId={'1'} selectedCatagories={selectedCatagories} setSelectedCatagories={setSelectedCatagories}/>

          </ul>

          <hr />

          <h2>حدد التصنيف</h2>

          <div className="catagory">
              <ul>
                  <li onClick={() => setCatagory('')}
                      className={catagory === '' && 'selectedCatagory'}
                  >
                      كل التصنيفات
                  </li>
                  {getCatagoryArray().map((ctg) => (
                      <li onClick={() => setCatagory(ctg.value)}
                          className={catagory === ctg.value && 'selectedCatagory'}
                      >
                          {ctg.arabicName}
                      </li>
                  ))}
              </ul>
          </div>

          <hr />

          <div className='mobile-filter-buttons'>
              <Link onClick={() => setIsMobileHomeFilter(false)} href={getNavLink()}>الذهاب</Link>
              <Link onClick={() => {
                setCatagory('');
                setCity('');
                setCalendarDoubleValue(null);
                setIsMobileHomeFilter(false);
              }} href={'/search'} id='skip-filter'>تخطي</Link>
          </div>

        </div>

    </div>
  )
};

export default MobileFilter;
