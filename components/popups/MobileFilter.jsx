'use client';

import '@styles/components_styles/MobileFilter.css';
import { Context } from '@utils/Context';
import { Suspense, useContext, useState } from 'react';
import { ProperitiesCatagories, VehicleCatagories } from '@utils/Data';
import { getNameByLang, getReadableDate } from '@utils/Logic';
import dynamic from 'next/dynamic';
const MyCalendar = dynamic(() => import('@components/MyCalendar'));
const HeaderPopup = dynamic(() => import('./HeaderPopup'));
import Link from 'next/link';
import Svgs from '@utils/Svgs';
import Image from 'next/image';
import ImageAsLogo from '@assets/images/image_as_logo.webp';
import { motion } from 'framer-motion';

const Component = ({ isEnglish, isMobile960 }) => {

    const { 
      isMobileHomeFilter, setIsMobileHomeFilter, city,
      catagory, setCatagory, calendarDoubleValue,
      setCalendarDoubleValue, setCity,
      setCategoryArray, categoryArray,
      section, setSection, isMobile
    } = useContext(Context);

    const [selectedCatagories, setSelectedCatagories] = useState(categoryArray);

    const getNavLink = () => {

      if(isEnglish){
        return '/en/search';
      } else {
        return '/search';
      };

    };

    const getSelectedCategories = (isEnglish) => {
      let str = '';
      selectedCatagories.forEach((element, index) => {
        if(isEnglish) {
          str += element.value + (index >= selectedCatagories.length - 1 ? '' : ', ');
        } else {
          str += element.arabicName + (index >= selectedCatagories.length - 1 ? '' : ', ');
        }
      });
      return str?.length > 0 ? str : (isEnglish ? 'All' : 'الكل');
    };

    const deleteAndClose = () => {
      setCity('');
      setCatagory('');
      setCategoryArray([]);
      setCalendarDoubleValue(null);
      setIsMobileHomeFilter(false);
    };

    const RightIconSpan = () => {
      return <span id='righticonspan'/>
    }

  return (
    <div className='mobileFilter' style={{ display: !isMobileHomeFilter ? 'none' : null }}
      dir={isEnglish ? 'ltr' : ''}>
      
        <div id='close-span' onClick={() => {
            setSection('city'); setIsMobileHomeFilter(false);
        }} />

        <motion.div className='filter-content'
          initial={isMobile960 ? { y: '100%' } : { scale: 0.8, opacity: 0 }} 
          animate={isMobile960 ? { y: isMobileHomeFilter ? 0 : '100%' } : { scale: isMobileHomeFilter ? 1 : 0, opacity: isMobileHomeFilter ? 1 : 0 }}
          transition={{ type: 'tween', ease: 'easeIn', duration: isMobile960 ? 0.4 : 0.2 }}
        >

          <div id='mobile-filter-header'/>

          {section.includes('city') && <div className='city-div-filter' style={{ height: '100%' }}>
            <div className='city-div-header'>
              <div id='city-back' style={{ transform: isEnglish ? 'rotate(180deg)' : undefined }} onClick={deleteAndClose}><Svgs name={'dropdown arrow'}/></div>
              <h3>{isEnglish ? 'Choose City' : 'أختر مدينة'}</h3> 
              <h4>{isEnglish ? city.value : city.arabicName}</h4> 
            </div>
            <HeaderPopup type={'city mobile-filter'} isEnglish={isEnglish} triggerHomeFilterSection={() => {
              setSection(section.includes('skip-category') ? 'calender' : 'category');
            }}/>
          </div>}

          {section === 'category' && <div className="catagory" style={{ flex: isMobile ? 1 : undefined, height: '100%' }}>

              <div className='city-div-header'>
                <div id='city-back' style={{ transform: isEnglish ? 'rotate(180deg)' : undefined }} onClick={() => setSection('city')}><Svgs name={'dropdown arrow'}/></div>
                <h3>{isEnglish ? 'What do you want to rent?' : 'ما الذي تريد ايجاره؟'}</h3> 
                <h4 style={{ fontSize: '0.75rem' }}>{getSelectedCategories(isEnglish)}</h4> 
              </div>

              <ul>
                  <li style={{ width: '100%' }} onClick={() => { setSelectedCatagories([]); setCatagory(''); }}>
                      <Image src={ImageAsLogo}/>
                      {getNameByLang('كل التصنيفات', isEnglish)}
                      {selectedCatagories?.length === 0 && <RightIconSpan />}
                  </li>
                  {[...ProperitiesCatagories, VehicleCatagories[0]].map((ctg, index) => (
                      <li style={{ width: '100%' }} key={index} onClick={() => {
                        if(selectedCatagories.includes(ctg)) {
                          setSelectedCatagories(selectedCatagories.filter(
                            i => i !== ctg
                          ));
                        } else {
                          setSelectedCatagories([...selectedCatagories, ctg]);
                        }
                      }}>
                          <Image src={ImageAsLogo}/>
                          {getNameByLang(ctg.arabicName, isEnglish)}
                          {selectedCatagories.includes(ctg) && <RightIconSpan />}
                      </li>
                  ))}
              </ul>

              <button onClick={() => {
                console.log(selectedCatagories);
                if(selectedCatagories?.length > 1){
                  setCategoryArray(selectedCatagories);
                  setCatagory('multiple');
                } else if(selectedCatagories?.length === 1) {
                  setCatagory(selectedCatagories[0]?.value);
                  setCategoryArray([]);
                } else {
                  setCategoryArray([]);
                }
                setSection('calender');
              }}>{isEnglish ? 'Continue' : 'متابعة'}</button>

          </div>}

          {section === 'calender' && <div className='book-date' style={{ flex: 1, height: isMobile ? '100%' : undefined }}>

            <div className='city-div-header' style={{ borderBottom: '2px solid var(--darkWhite);', paddingBottom: 24 }}>
              <div id='city-back' style={{ transform: isEnglish ? 'rotate(180deg)' : undefined }} onClick={() => setSection('category')}><Svgs name={'dropdown arrow'}/></div>
              <h3>{isEnglish ? 'Choose reservation date' : 'اختر تاريخ للحجز'}</h3> 
              <h4 style={{ fontSize: '0.75rem' }}>{isEnglish ? city.value || 'City undefined' : city.arabicName || 'المدينة غير محددة'} / {getSelectedCategories(isEnglish) || 'كل التصنيفات'}</h4> 
              <h4 suppressHydrationWarning style={{ marginTop: -8, fontSize: '0.75rem' }}>{isEnglish ? 'Book from' : 'حجز من'} {getReadableDate(calendarDoubleValue?.at(0), true, isEnglish)} {isEnglish ? 'To' : 'الى'} {getReadableDate(calendarDoubleValue?.at(1), true, isEnglish)}</h4> 
            </div>

            <div className='calendar-div' style={{ width: '100%' }}>
              <MyCalendar type={'mobile-filter'} setCalender={setCalendarDoubleValue}/>
            </div>

            <div className='mobile-filter-buttons'>
              <Link style={{ 
                width: '100%', background: !calendarDoubleValue ? 'rgb(180, 180, 180)' : undefined,
                color: !calendarDoubleValue ? 'white' : undefined,
                boxShadow: !calendarDoubleValue ? 'none' : undefined,
                pointerEvents: !calendarDoubleValue ? 'none' : undefined 
              }} area-aria-disabled={!calendarDoubleValue} 
              href={getNavLink()} ><Svgs name={'search'}/>{isEnglish ? 'Search' : 'بحث'}</Link>
              <button id='skip-filter' style={{ width: '100%' }} onClick={() => {
                setCalendarDoubleValue(null);
              }} href={`${isEnglish ? '/en' : ''}/search`}>{isEnglish ? 'Delete' : 'مسح'}</button>
            </div>

          </div>}

        </motion.div>

    </div>
  )
};

const MobileFilter = ({ isEnglish, isMobile960 }) => (
	<Suspense>
		<Component isEnglish={isEnglish} isMobile960={isMobile960}/>
	</Suspense>
);

export default MobileFilter;
