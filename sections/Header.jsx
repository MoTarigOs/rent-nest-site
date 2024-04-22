'use client';

import '@styles/Header.css';
import Image from 'next/image';
import LogoImage from '@assets/icons/rentnext-logo.png';
import Svgs from '@utils/Svgs';
import Link from 'next/link';
import { Suspense, useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import InvertedIcon from '@assets/icons/inverted-corner.png';
const HeaderPopup = dynamic(() => import('@components/popups/HeaderPopup'));
const Filter = dynamic(() => import('@components/Filter'));
const Arrange = dynamic(() => import('@components/popups/Arrange'));
const GoogleMapPopup = dynamic(() => import('@components/popups/GoogleMapPopup'));
const MobileFilter = dynamic(() => import('@components/popups/MobileFilter'));
import { Context } from '@utils/Context';
import { getUserInfo, refresh } from '@utils/api';
import { getArabicNameCatagory, getNameByLang, getReadableDate } from '@utils/Logic';
import { isLoginedCookie, isPreviouslyLogined } from '@utils/ServerComponents';

const HeaderComponent = ({ englishFontClassname, arabicFontClassname, pathname }) => {

    const [isScrolled, setIsScrolled] = useState(false);
    const [runOnce, setRunOnce] = useState(false);
    const [isMenu, setIsMenu] = useState(false);
    const [isCityFilter, setIsCityFilter] = useState(false);
    const [isCatagoryFilter, setIsCatagoryFilter] = useState(false);
    const [isCalendarFilter, setIsCalendarFilter] = useState(false);
    const [isLogined, setIsLogined] = useState(false);
    
    const [isFilter, setIsFilter] = useState(false);
    const [isArrange, setIsArrange] = useState(false);
    const [isPrevLogined, setIsPrevLogined] = useState(false);

    const id = useSearchParams().get('id');

    const { 
      userId, userUsername, userRole, setUserId, 
      setUserUsername, setUserRole, city, setCity,
      catagory, setCatagory, triggerFetch, setTriggerFetch,
      arrangeValue, setArrangeValue, setUserEmail, setIsVerified,
      setUserPhone, setUserAddress, setBooksIds, 
      setFavouritesIds, mapType, mapArray, isMap, setIsMap, 
      latitude, setLatitude, longitude, setLongitude,
      calendarDoubleValue, setCalendarDoubleValue, setIsMobileHomeFilter, 
      setIsCalendarValue, setLoadingUserInfo,
      isMobileHomeFilter, setStorageKey, isMobile, setIsMobile,
      setIsEnglish
    } = useContext(Context);

    const settingMobile = () => {
      if(window.innerWidth < 1160){
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    const settingScroll = () => {
      if(window.scrollY > 96){
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const getHref = (type, helperString) => {
      type = type.toLowerCase();
      if(type === 'sign-up' && isPrevLogined) type = 'sign-in';
      switch(type){
        case 'home':
          if(!pathname.includes('/en')){
            return '/';
          } else {
            return '/en';
          }
        case 'search':
          if(!pathname.includes('/en')){
            return '/search';
          } else {
            return '/en/search';
          }
        case 'profile':
          if(!pathname.includes('/en')){
            return `/profile?id=${helperString}`;
          } else {
            return `/en/profile?id=${helperString}`;
          }
        case 'sign-up':
          if(!pathname.includes('/en')){
            return '/sign-up';
          } else {
            return '/en/sign-up';
          }
        case 'sign-in':
          if(!pathname.includes('/en')){
            return '/sign-in';
          } else {
            return '/en/sign-in';
          }
        case 'lang':
          if(pathname.includes('/en')){
            console.log('id: ', id);
            if(id){
              return pathname === '/en' ? '/' : pathname.replace('/en', '') + `?id=${id}`;
            }
            return pathname === '/en' ? '/' : pathname.replace('/en', '');
          } else {
            if(id){
              return '/en' + pathname + `?id=${id}`;
            }
            return '/en' + pathname;
          }
        case 'add':
          if(!pathname.includes('/en')){
            return '/add';
          } else {
            return '/en/add';
          }
        case 'admin':
          if(!pathname.includes('/en')){
            return '/admin';
          } else {
            return '/en/admin';
          }
        case 'vehicles':
          if(!pathname.includes('/en')){
            return '/vehicles';
          } else {
            return '/en/vehicles';
          }
        case 'properties':
          if(!pathname.includes('/en')){
            return `/properties?catagory=${helperString}`;
          } else {
            return `/en/properties?catagory=${helperString}`;
          }
      }
    };

    const settingLogined = async() => {
      setIsLogined(await isLoginedCookie());
      setIsPrevLogined(await isPreviouslyLogined());
    };

    const handleGetUserInfo = async() => {

      setLoadingUserInfo(true);

      const infoRes = await getUserInfo(
        setUserId, setUserUsername, setUserRole, 
        setUserEmail, setIsVerified, setUserAddress,
        setUserPhone, setBooksIds, setFavouritesIds, 
        setLoadingUserInfo, setStorageKey
      );

      if(!infoRes?.success || infoRes.success !== true) return;

      if(infoRes.dt.tokenExp > 15 * 24 * 60 * 60 * 1000) return;

      const res = await refresh(pathname.includes('/en'));

      if(res?.success === true) {
        setLoadingUserInfo(true);
        getUserInfo(
          setUserId, setUserUsername, setUserRole, 
          setUserEmail, setIsVerified, setUserAddress,
          setUserPhone, setBooksIds, setFavouritesIds, 
          setLoadingUserInfo, setStorageKey
        );
      };

    };

    useEffect(() => {

      settingLogined();

      settingMobile();

      settingScroll();

      window.addEventListener('scroll', () => {
        settingScroll();
      });

      window.addEventListener('resize', () => {
        settingMobile();
      });

      return () => {
        
        window.removeEventListener('scroll', () => {
          settingMobile();
        });

        window.removeEventListener('resize', () => {
          settingMobile();
        });

      }
    }, []);

    useEffect(() => {
      if(isLogined) setRunOnce(true);
    }, [isLogined]);

    useEffect(() => {
      if(runOnce === true){
        handleGetUserInfo();
      }
    }, [runOnce]);

    useEffect(() => {
      if(longitude) setLongitude(null);
      if(latitude) setLatitude(null);
      if(pathname.includes('/en')) {
        setIsEnglish(true);
      } else {
        setIsEnglish(false);
      }
      if(pathname.includes('/vehicles')) setCatagory('');
      setIsMobileHomeFilter(false);
    }, [pathname]);

    useEffect(() => {
      setTriggerFetch(!triggerFetch);
      setIsCalendarValue(true);
    }, [calendarDoubleValue]);

    useEffect(() => {
      if(isCalendarFilter) setIsCalendarValue(false);
    }, [isCalendarFilter]);

    if(!pathname){
      return (<></>)
    };

  return (

    <div suppressContentEditableWarning className={pathname.includes('/en') ? 'header englishHeader' : 'header'} style={{ 
      position: 'fixed', zIndex: (isArrange || isFilter || isMenu || isMap 
          || isCatagoryFilter || isCityFilter || isCalendarFilter
          || isMobileHomeFilter) && 11
    }} suppressHydrationWarning={true} dir={pathname.includes('/en') ? 'ltr' : null}>
      
        <div className='desktopWrapper'>
            
            <Link href={getHref('home')} className='logo'>
                <Image src={LogoImage} alt='rentnext website logo image'/>
            </Link>

            <Link href={getHref('properties', 'farm')} className='navBtn'>
                {getNameByLang('مزارع و شاليهات', pathname.includes('/en'))}
            </Link>

            <Link href={getHref('properties', 'apartment')} className={'navBtn'}>
              {getNameByLang('شقق و استوديوهات', pathname.includes('/en'))}
            </Link>

            <Link href={getHref('properties', 'resort')} className={'navBtn'}>
              {getNameByLang('مخيمات و منتجعات', pathname.includes('/en'))}
            </Link>

            <Link href={getHref('vehicles')} style={!pathname.includes('/en') ? { marginLeft: 'auto' } : { marginRight: 'auto' }} className={'navBtn'}>
              {getNameByLang('وسائل نقل', pathname.includes('/en'))}
            </Link>

            <Link href={getHref('add')} style={{ display: !userId?.length > 0 ? 'none' : null }} className='addItemHeaderDiv'>{getNameByLang('أضف عقارك', pathname.includes('/en'))}</Link>

            <div className='user' style={{ maxWidth: !userId?.length > 0 ? 'unset' : null }}>
              <Link href={userId?.length > 0 ? getHref('profile', userId) : getHref('sign-up')}>
                <div className='profileSvg'><Svgs name={'profile'}/></div>
                <p>{userId?.length > 0 ? userUsername : getNameByLang('الدخول أو انشاء حساب', pathname.includes('/en'))}</p>
                <div className='arrowSvg'><Svgs name={'dropdown arrow'}/></div>
              </Link>
            </div>

            <div className='user admin-header-button' style={{ 
              display: (userRole === 'admin' || userRole === 'owner') ? null : 'none' 
            }}>
              <Link href={(userRole === 'admin' || userRole === 'owner') 
              ? getHref('admin') : ''}>
                <Svgs name={'management'}/>
                <p>{getNameByLang('صفحة الادارة', pathname.includes('/en'))}</p>
              </Link>
            </div>
            
            <Link className={`lang ${pathname.includes('/en') ? arabicFontClassname : englishFontClassname}`} href={getHref('lang')}>
                <h5>{!pathname.includes('/en') ? 'Browse in' : 'التصفح في'}</h5>
                <p>{!pathname.includes('/en') ? 'English' : 'العربية'}</p>
            </Link>
        
        </div>

        {(pathname === '/' || pathname === '/search' || pathname === '/en') ? <motion.div className={`headerSearchDiv ${(isScrolled && isMobile) && 'scrolledSearhDiv'}`}
          initial={{ y: 0 }}
          animate={{ y: (isScrolled && isMobile) ? -81 : -1, transition: { damping: 50 } }}
        >
          <div className='searchDiv'>
            <ul>
                <li className='desktopSearchDivLI' onClick={() => {setIsCityFilter(true); setIsCatagoryFilter(false); setIsCalendarFilter(false);}}>{isCityFilter && <HeaderPopup pathname={pathname} type={'city'}/>}<h4>{getNameByLang('اختر المدينة', pathname.includes('/en'))}</h4><h3>{!city?.value ? getNameByLang('كل المدن', pathname.includes('/en')) : pathname.includes('/en') ? city.value : city.arabicName}</h3></li>
                <li className='desktopSearchDivLI' onClick={() => {setIsCityFilter(false); setIsCatagoryFilter(true); setIsCalendarFilter(false);}}>{isCatagoryFilter && <HeaderPopup type={'catagory'} pathname={pathname} handleChoose={() => setIsCatagoryFilter(false)} />}<h4>{getNameByLang('التصنيف', pathname.includes('/en'))}</h4><h3>{catagory === '' ? getNameByLang('كل التصنيفات', pathname.includes('/en')) : getNameByLang(getArabicNameCatagory(catagory), pathname.includes('/en'))}</h3></li>
                <li className='desktopSearchDivLI' onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4>{getNameByLang('تاريخ الحجز', pathname.includes('/en'))}</h4><h3 suppressHydrationWarning={true}>{getReadableDate(calendarDoubleValue?.at(0), true, pathname.includes('/en'))}</h3>{isCalendarFilter && <HeaderPopup type={'calendar'}/>}</li>
                <li className='desktopSearchDivLI' onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4>{getNameByLang('تاريخ انتهاء الحجز', pathname.includes('/en'))}</h4><h3 suppressHydrationWarning={true}>{getReadableDate(calendarDoubleValue?.at(1), true, pathname.includes('/en'))}</h3></li>
                <li className='header-search-btn'>
                  <Link href={getHref('search')}><Svgs name={'search'}/></Link>
                </li>
                <li className='mobileSearchDiv mobileSearchDivLI'>
                  <div onClick={() => setIsMobileHomeFilter(true)}>
                    <Svgs name={'search'}/>
                    <p>{pathname.includes('/en') ? 'Search for a property' : 'ابحث عن عقار'}</p>
                  </div>
                </li>
            </ul>
            <div id='invertedIconDivLeft'><Image src={InvertedIcon}/></div>
            <div id='invertedIconDivRight'><Image src={InvertedIcon}/></div>
          </div>
          <span id='rightSpanHeaderSearch'/>
          <span id='leftSpanHeaderSearch'/>
        </motion.div> : (pathname === '/vehicles' || pathname === '/properties' || pathname === '/en/vehicles' || pathname === '/en/properties') && <div className='headerSearchOtherDiv'>
          <ul className='headerNavUL'>
            <li className='headerNavLi' id='searchLiHeaderOther'><Svgs name={'search'}/></li>
            <li className='headerNavLi' onClick={() => {setIsCityFilter(true); setIsCatagoryFilter(false); setIsCalendarFilter(false);}}><h4>{!city.value ? getNameByLang('كل المدن', pathname.includes('/en')) : pathname.includes('/en') ? city.value : city.arabicName}</h4>{isCityFilter && <HeaderPopup pathname={pathname} type={'city'}/>}</li>
            <li className='headerNavLi' onClick={() => {setIsCatagoryFilter(true); setIsCityFilter(false); setIsCalendarFilter(false)}}><h4>{catagory === '' ? getNameByLang('كل التصنيفات', pathname.includes('/en')) : pathname.includes('/en') ? catagory : getArabicNameCatagory(catagory)}</h4>{isCatagoryFilter && <HeaderPopup isEnglish={pathname.includes('/en')}  pathname={pathname} type={'catagory'} handleChoose={() => setIsCatagoryFilter(false)}/>}</li>
            <li className='headerNavLi' onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4 suppressHydrationWarning={true}>{getReadableDate(calendarDoubleValue?.at(0), true, pathname.includes('/en'))}</h4>{isCalendarFilter && <HeaderPopup type={'calendar'}/>}</li>
            <li className='headerNavLi' style={{ border: 'none' }} onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4 suppressHydrationWarning={true}>{getReadableDate(calendarDoubleValue?.at(1), true, pathname.includes('/en'))}</h4></li>
          </ul>
          <Link className='showMap' href={getHref('search')}>
            <Svgs name={'search'}/>
            {getNameByLang('عرض الخريطة', pathname.includes('/en'))}
          </Link>
        </div>}

        {isMobile && <div className="mobileHeader" style={{ zIndex: isMenu ? 20 : null }}>

          <div className='user'>
            <Link href={userId?.length > 0 ? getHref('profile', userId) : getHref('sign-up')}>
              <div className='profileSvg'><Svgs name={'profile'}/></div>
              <p>{userId?.length > 0 ? userUsername : getNameByLang('الدخول أو انشاء حساب', pathname.includes('/en'))}</p>
              <div className='arrowSvg'><Svgs name={'dropdown arrow'}/></div>
            </Link>
          </div>

          <Link style={{ display: (isScrolled && (pathname === '/' || pathname === '/en')) ? 'none' : null }} 
            href={getHref('home')} className='logo'>
              <Image src={LogoImage} alt='rentnext website logo image'/>
          </Link>

          <div className="menuIconDiv" onClick={() => setIsMenu(!isMenu)}>

            <motion.span 
            initial={{ rotateZ: 0, y: 0 }} animate={{ 
              rotateZ: isMenu ? '-45deg' : 0,
              y: isMenu ? 8 : 0
            }}/>

            <motion.span 
            initial={{ opacity: 1 }} 
            animate={{ opacity: isMenu ? 0 : 1 }}/>

            <motion.span 
            initial={{ rotateZ: 0, y: 0 }} animate={{ 
              rotateZ: isMenu ? '45deg' : 0,
              y: isMenu ? -8 : 0
            }}/>

          </div>

          <motion.div
            className="mobileSideNav"
            style={{ left: pathname.includes('/en') ? 0 : 'unset', right: pathname.includes('/en') ? 'unset' : 0 }}
            initial={{ x:  pathname.includes('/en') ? '-110%' : '110%' }}
            animate={{ x: isMenu ? 0 : pathname.includes('/en') ? '-110%' : '110%', transition: { type: "tween", duration: 0.15 } }}
          >

            <ul>

              <Link onClick={() => setIsMenu(false)} href={getHref('properties', 'farm')} className='navBtn'>
                  <Svgs name={'farm'}/>
                  {getNameByLang('مزارع و شاليهات', pathname.includes('/en'))}
              </Link>

              <Link onClick={() => setIsMenu(false)} href={getHref('properties', 'apartment')} className={'navBtn'}>
                <Svgs name={'apartment'}/>
                {getNameByLang('شقق و استوديوهات', pathname.includes('/en'))}
              </Link>

              <Link onClick={() => setIsMenu(false)} href={getHref('properties', 'resort')} className={'navBtn'}>
                <Svgs name={'resort'}/>
                {getNameByLang('مخيمات و منتجعات', pathname.includes('/en'))}
              </Link>

              <Link onClick={() => setIsMenu(false)} href={getHref('properties', 'students')} className={'navBtn'}>
                <Svgs name={'students'}/>
                {getNameByLang('سكن طلاب', pathname.includes('/en'))}
              </Link>

              <Link onClick={() => setIsMenu(false)} href={getHref('vehicles')} style={!pathname.includes('/en') ? { marginLeft: 'auto' } : { marginRight: 'auto' }} className={'navBtn'}>
                <Svgs name={'vehciles'}/>
                {getNameByLang('وسائل نقل', pathname.includes('/en'))}
              </Link>

              <div className='user admin-header-button' style={{ 
                display: (userRole === 'admin' || userRole === 'owner') ? null : 'none' 
              }}>
                <Link onClick={() => setIsMenu(false)} href={(userRole === 'admin' || userRole === 'owner') 
                ? getHref('admin') : ''}>
                  <Svgs name={'management'}/>
                  {getNameByLang('صفحة الادارة', pathname.includes('/en'))}
                </Link>
              </div>

              <Link href={getHref('add')} onClick={() => setIsMenu(false)}
                style={{ display: !userId?.length > 0 ? 'none' : null }} className='addItemHeaderDiv'>
                {getNameByLang('أضف عقارك', pathname.includes('/en'))}
              </Link>

              <Link onClick={() => setIsMenu(false)} className='lang' href={getHref('lang')}>
                <h5>{!pathname.includes('/en') ? 'Browse in' : 'التصفح في'}</h5>
                <p>{!pathname.includes('/en') ? 'English' : 'العربية'}</p>
              </Link>

            </ul>

          </motion.div>

        </div>}

        {(isCityFilter || isCatagoryFilter || isCalendarFilter || isMenu) && <span id='closeFilterPopupSpan' onClick={() => {
          setIsCityFilter(false); setIsCatagoryFilter(false); setIsCalendarFilter(false); setIsMenu(false);
        }} />}

        {(pathname === '/properties' || pathname === '/vehicles' || pathname === '/en/properties' || pathname === '/en/vehicles') && <div className='filterHeaderDiv'>
          <button onClick={() => setIsFilter(true)}><Svgs name={'filter'}/>{getNameByLang('تصفية', pathname.includes('/en'))}</button>
          <span />
          <button id='secondFilterHeaderDivBtn' onClick={() => setIsArrange(true)}><Svgs name={'filter'}/>{getNameByLang('ترتيب', pathname.includes('/en'))}</button>
        </div>}

        {isFilter && <Filter isEnglish={pathname.includes('/en')} type={'prop'} isFilter={isFilter} setIsFilter={setIsFilter} triggerFetch={triggerFetch} setTriggerFetch={setTriggerFetch}/>}

        {isArrange && <Arrange isEnglish={pathname.includes('/en')} isArrange={isArrange} setIsArrange={setIsArrange} setTriggerFetch={setTriggerFetch} triggerFetch={triggerFetch} arrangeValue={arrangeValue} setArrangeValue={setArrangeValue}/>}

        {isMap && <GoogleMapPopup isShow={isMap} setIsShow={setIsMap} mapType={mapType} 
        mapArray={mapArray} longitude={longitude} setLongitude={setLongitude} 
        latitude={latitude} setLatitude={setLatitude}/>}

        {(pathname === '/' || pathname === '/search' || pathname === '/en') 
          && <MobileFilter isEnglish={pathname.includes('/en')}/>}

    </div>
  )
};

const Header = ({ englishFontClassname, arabicFontClassname, pathname }) => (
	<Suspense>
		<HeaderComponent arabicFontClassname={arabicFontClassname} pathname={pathname}
      englishFontClassname={englishFontClassname}/>
	</Suspense>
);

export default Header;
