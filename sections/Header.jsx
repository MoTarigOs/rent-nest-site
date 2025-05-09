'use client';

import '@styles/Header.scss';
import Image from 'next/image';
import LogoImage from '@assets/icons/rent-nest-logo-header.png';
import Svgs from '@utils/Svgs';
import Link from 'next/link';
import { Suspense, useContext, useEffect, useRef, useState } from 'react';
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
import { getArabicNameCatagory, getNameByLang, getReadableDate, handleDays } from '@utils/Logic';
import { isLoginedCookie, isPreviouslyLogined } from '@utils/ServerComponents';
import { VehiclesTypes, contactInfo } from '@utils/Data';

const HeaderComponent = ({ englishFontClassname, arabicFontClassname, pathname }) => {

    const [isScrolled, setIsScrolled] = useState(false);
    const [runOnce, setRunOnce] = useState(false);
    const [isMenu, setIsMenu] = useState(false);
    const [isCityFilter, setIsCityFilter] = useState(false);
    const [isCatagoryFilter, setIsCatagoryFilter] = useState(false);
    const [isCalendarFilter, setIsCalendarFilter] = useState(false);
    const [isLogined, setIsLogined] = useState(false);
    
    const [isPrevLogined, setIsPrevLogined] = useState(false);

    const mobileSearchDivRef = useRef();

    const id = useSearchParams().get('id');
    const viewUnit = useSearchParams().get('unit');

    const { 
      userId, userUsername, userRole, setUserId, 
      setUserUsername, setUserRole, city,
      catagory, setCatagory, triggerFetch, setTriggerFetch,
      arrangeValue, setArrangeValue, setUserEmail, setIsVerified,
      setUserPhone, setUserAddress, setBooksIds, 
      isMobile960, setIsMobile960,
      setFavouritesIds, mapType, mapArray, isMap, setIsMap, 
      latitude, setLatitude, longitude, setLongitude,
      calendarDoubleValue, setIsMobileHomeFilter, notifications,
      setIsCalendarValue, setLoadingUserInfo, setNotifications,
      isMobileHomeFilter, setStorageKey, isMobile, setIsMobile,
      setIsEnglish, isVerified, setIsModalOpened, isModalOpened,
      setIsSearchMap, isSearchMap, vehicleType, setUserAddressEN, 
      isFilter, setIsFilter, setUserAccountType,
      isArrange, setIsArrange, setUserLastName, setUserFirstName,
      setUserLastNameEN, setUserFirstNameEN, userFirstName,
      userLastName, userFirstNameEN, triggerUserInfo, storageKey,
      setWaitingToBeHost, setIsNotifEnabled, resType, setResType,
      resTypeNum, setResTypeNum
    } = useContext(Context);

    const settingMobile = () => {
      if(window.innerWidth < 1160){
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
      if(window.innerWidth <= 960){
        setIsMobile960(true);
      } else {
        setIsMobile960(false);
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
          if(!isVerified) return pathname.includes('/en') ? '/en/verify-account' : '/verify-account';
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
            if(id || viewUnit){
              return pathname === '/en' ? '/' : pathname.replace('/en', '') + `${id ? ('?id=' + id) : ('?unit=' + viewUnit)}`;
            }
            return pathname === '/en' ? '/' : pathname.replace('/en', '');
          } else {
            if(id || viewUnit){
              return '/en' + pathname + `${id ? ('?id=' + id) : ('?unit=' + viewUnit)}`;
            }
            return '/en' + pathname;
          }
        case 'add':
          if(!isVerified) return pathname.includes('/en') ? '/en/verify-account' : '/verify-account';
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
        setLoadingUserInfo, setStorageKey, setUserAddressEN, 
        null, setNotifications, setUserLastName, 
        setUserFirstName, setUserAccountType, setUserFirstNameEN,
        setUserLastNameEN, setWaitingToBeHost, setIsNotifEnabled
      );

      if(!infoRes?.success || infoRes.success !== true) return;

      if(infoRes.dt.tokenExp > 15 * 24 * 60 * 60 * 1000) return;

      const res = await refresh(pathname.includes('/en'));

      if(res?.success === true) {
        setLoadingUserInfo(true);
        await getUserInfo(
          setUserId, setUserUsername, setUserRole, 
          setUserEmail, setIsVerified, setUserAddress,
          setUserPhone, setBooksIds, setFavouritesIds, 
          setLoadingUserInfo, setStorageKey, setUserAddressEN, 
          null, setNotifications, setUserLastName, 
          setUserFirstName, setUserAccountType, setUserFirstNameEN,
          setUserLastNameEN, setWaitingToBeHost, setIsNotifEnabled
        );
      };

    };

    useEffect(() => {
      
      settingMobile();

      settingScroll();

      settingLogined();

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
      setRunOnce(true);
    }, [isLogined]);

    useEffect(() => {
      if(runOnce === true){
        handleGetUserInfo();
      }
    }, [runOnce]);

    useEffect(() => {
      setIsModalOpened(false);
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
      handleDays(calendarDoubleValue, setResType, setResTypeNum);
    }, [calendarDoubleValue]);

    useEffect(() => {
      console.log('header storage key: ', storageKey);
      localStorage.setItem('storage-key', storageKey);
    }, [storageKey]);

    useEffect(() => {
      if(isCalendarFilter) setIsCalendarValue(false);
    }, [isCalendarFilter]);

    useEffect(() => {
      if(isMobileHomeFilter || isFilter || (isSearchMap && pathname.includes('/search')) || isArrange || isMenu || isCityFilter || isCatagoryFilter || isCalendarFilter) 
        return setIsModalOpened(true);
      setIsModalOpened(false);
    }, [isMobileHomeFilter, isFilter, isArrange, isMenu, isCityFilter, isCatagoryFilter, isCalendarFilter, isSearchMap]);

    useEffect(() => {
      handleGetUserInfo();
    }, [triggerUserInfo]);

    if(!pathname){
      return (<></>)
    };

  return (

    <div suppressContentEditableWarning className={(pathname.includes('/en') ? 'header englishHeader' : 'header')} style={{ 
      position: 'fixed', boxShadow: (pathname.includes('/search') && isModalOpened) ? 'unset' : undefined, 
      zIndex: (isArrange || isFilter || isMenu || isMap 
          || isCatagoryFilter || isCityFilter || isCalendarFilter
          || isMobileHomeFilter) ? 11 : undefined,
          padding: (isSearchMap && pathname.includes('/search')) ? 0 : undefined,
    }} suppressHydrationWarning={true} dir={pathname.includes('/en') ? 'ltr' : null}>

        <div className='desktopWrapper'>
            
            <Link href={getHref('home')} className='logo disable-text-copy'>
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

            <Link href={getHref('add')} style={{ display: !userId?.length > 0 ? 'none' : null }} className='addItemHeaderDiv disable-text-copy'>{getNameByLang('أضف عقارك', pathname.includes('/en'))}</Link>

            <div className='user disable-text-copy' style={{ maxWidth: !userId?.length > 0 ? 'unset' : null }}>
              <span id='notif-span' style={{ display: !notifications?.length > 0 ? 'none' : undefined }}>{userId?.length > 10 && notifications.length}</span>
              <Link href={userId?.length > 0 ? getHref('profile', userId) : getHref('sign-in')}>
                <div className='profileSvg'><Svgs name={'profile'}/></div>
                <p>{userId?.length > 0 ? (pathname.includes('/en') ? userFirstNameEN || userUsername || userFirstName : userFirstName || userUsername || userLastName) : getNameByLang('الدخول أو انشاء حساب', pathname.includes('/en'))}</p>
                <div className='arrowSvg'><Svgs name={'dropdown arrow'}/></div>
              </Link>
            </div>

            <div className='user admin-header-button disable-text-copy' style={{ 
              display: (userRole === 'admin' || userRole === 'owner') ? null : 'none' 
            }}>
              <Link href={(userRole === 'admin' || userRole === 'owner') 
              ? getHref('admin') : ''}>
                <Svgs name={'management'}/>
                <p>{getNameByLang('صفحة الادارة', pathname.includes('/en'))}</p>
              </Link>
            </div>
            
            <Link className={`lang ${pathname.includes('/en') ? arabicFontClassname : englishFontClassname} disable-text-copy`} href={getHref('lang')}>
                <h5>{!pathname.includes('/en') ? 'Browse in' : 'التصفح في'}</h5>
                <p>{!pathname.includes('/en') ? 'English' : 'العربية'}</p>
            </Link>
        
        </div>

        {(pathname === '/' || pathname === '/en') ? <motion.div className={`headerSearchDiv ${(isScrolled && isMobile) ? 'scrolledSearhDiv' : undefined}`}
          initial={{ y: 0 }}
          animate={{ y: (isScrolled && isMobile) ? -76 : 0, transition: { damping: 50 } }}
          style={{ 
            display: (isMobile && pathname.includes('search')) ? 'none' : undefined,
            zIndex: (isMenu && isScrolled) ? 21 : undefined
          }}>
          <div className={`searchDiv disable-text-copy ${isScrolled ? 'search-div-scrolled' : undefined}`}
            onClick={() => {
              if(!isMobile) return;
              setIsMobileHomeFilter(true);
            }}
          >
            <ul>
                <li className='desktopSearchDivLI' onClick={() => {setIsCityFilter(true); setIsCatagoryFilter(false); setIsCalendarFilter(false);}}>{isCityFilter && <HeaderPopup pathname={pathname} type={'city'}/>}<h4>{getNameByLang('اختر المدينة', pathname.includes('/en'))}</h4><h3>{!city?.value ? getNameByLang('كل المدن', pathname.includes('/en')) : pathname.includes('/en') ? city.value : city.arabicName}</h3></li>
                <li className='desktopSearchDivLI' onClick={() => {setIsCityFilter(false); setIsCatagoryFilter(true); setIsCalendarFilter(false);}}>{isCatagoryFilter && <HeaderPopup type={'catagory'} pathname={pathname} handleChoose={() => setIsCatagoryFilter(false)} />}<h4>{getNameByLang('التصنيف', pathname.includes('/en'))}</h4><h3>{catagory === '' ? getNameByLang('كل التصنيفات', pathname.includes('/en')) : getNameByLang(getArabicNameCatagory(catagory), pathname.includes('/en'))}</h3></li>
                <li className='desktopSearchDivLI' onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4>{getNameByLang('تاريخ الحجز', pathname.includes('/en'))}</h4><h3 suppressHydrationWarning={true}>{getReadableDate(calendarDoubleValue?.at(0), true, pathname.includes('/en'))}</h3>{isCalendarFilter && <HeaderPopup type={'calendar'}/>}</li>
                <li className='desktopSearchDivLI' onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4>{getNameByLang('تاريخ انتهاء الحجز', pathname.includes('/en'))}</h4><h3 suppressHydrationWarning={true}>{getReadableDate(calendarDoubleValue?.at(1), true, pathname.includes('/en'))}</h3></li>
                <li className='header-search-btn'>
                  <Link href={getHref('search')}><Svgs name={'search'}/></Link>
                </li>

                <li ref={mobileSearchDivRef} className={`mobileSearchDiv mobileSearchDivLI ${isScrolled ? 'mobile-searcj-div-scrolled' : undefined} disable-text-copy`}>
                  <div>
                    <Svgs name={'search'}/>
                    <p>{pathname.includes('/en') ? 'Search for a property' : 'ابحث عن عقار'}</p>
                  </div>
                </li>
            </ul>
            <div id='invertedIconDivLeft'><Image src={InvertedIcon} alt='background first image'/></div>
            <div id='invertedIconDivRight'><Image src={InvertedIcon} alt='background second image'/></div>
          </div>
          <span id='rightSpanHeaderSearch'/>
          <span id='leftSpanHeaderSearch'/>
        </motion.div> : (pathname === '/vehicles' || pathname.includes('search') || pathname === '/properties' || pathname === '/en/vehicles' || pathname === '/en/properties' || pathname.includes('deals')) && <div className='headerSearchOtherDiv'>
          <ul className='headerNavUL disable-text-copy'>
            <li className='headerNavLi ' id='searchLiHeaderOther'><Svgs name={'search'}/></li>
            <li className='headerNavLi' onClick={() => {setIsCityFilter(true); setIsCatagoryFilter(false); setIsCalendarFilter(false);}}><h4>{!city.value ? getNameByLang('كل المدن', pathname.includes('/en')) : pathname.includes('/en') ? city.value : city.arabicName}</h4>{isCityFilter && <HeaderPopup pathname={pathname} type={'city'}/>}</li>
            <li className='headerNavLi' onClick={() => {setIsCatagoryFilter(true); setIsCityFilter(false); setIsCalendarFilter(false)}}><h4>{pathname.includes('/vehicles') ? (pathname.includes('/en') ? VehiclesTypes.find(i => i.id === vehicleType)?.value || 'All' : VehiclesTypes.find(i => i.id === vehicleType)?.arabicName || 'الكل') : (catagory === '' ? getNameByLang('كل التصنيفات', pathname.includes('/en')) : pathname.includes('/en') ? catagory : getArabicNameCatagory(catagory))}</h4>{isCatagoryFilter && <HeaderPopup isEnglish={pathname.includes('/en')}  pathname={pathname} type={'catagory'} handleChoose={() => setIsCatagoryFilter(false)}/>}</li>
            <li className='headerNavLi' onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4 suppressHydrationWarning={true}>{getReadableDate(calendarDoubleValue?.at(0), true, pathname.includes('/en'))}</h4>{isCalendarFilter && <HeaderPopup type={'calendar'}/>}</li>
            <li className='headerNavLi' style={{ border: 'none' }} onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4 suppressHydrationWarning={true}>{getReadableDate(calendarDoubleValue?.at(1), true, pathname.includes('/en'))}</h4></li>
          </ul>
          <Link href={getHref('search')} className='showMap' onClick={() => setIsSearchMap(true)}>
            <Svgs name={'search'}/>
            {getNameByLang('عرض الخريطة', pathname.includes('/en'))}
          </Link>
        </div>}

        <div className="mobileHeader" style={{ zIndex: isMenu ? 20 : null, display: (isMobile && !(isSearchMap && pathname.includes('/search'))) ? undefined : 'none' }}>

          <span id='menu-active-background' style={{ display: !isMenu ? 'none' : undefined }}/>
          
          <div className='user disable-text-copy' onClick={() => setIsMenu(false)}>
            <span id='notif-span' style={{ display: !notifications?.length > 0 ? 'none' : undefined }}>{userId?.length > 10 && notifications.length}</span>
            <Link href={userId?.length > 0 ? getHref('profile', userId) : getHref('sign-in')}>
              <div className='profileSvg'><Svgs name={'profile'}/></div>
              <p>{userId?.length > 0 ? userUsername : getNameByLang('الدخول أو انشاء حساب', pathname.includes('/en'))}</p>
              <div className='arrowSvg'><Svgs name={'dropdown arrow'}/></div>
            </Link>
          </div>

          <Link onClick={() => setIsMenu(false)} style={{ 
            display: (isScrolled && (pathname === '/' || pathname === '/en')) ? 'none' : null,
            zIndex: isMenu ? 15 : undefined
          }} 
            href={getHref('home')} className='logo disable-text-copy'>
              <Image src={LogoImage} alt='rentnext website logo image'/>
          </Link>

          {/* <Link href={
            `https://wa.me/+963991012169?text=`
          }>Test</Link> */}

          <div className={`menuIconDiv disable-text-copy ${isMenu ? 'activeMenu' : undefined}`} onClick={() => setIsMenu(!isMenu)}
          style={{ zIndex: isMenu ? 15 : undefined }}>

            <span id={isMenu ? 'span1Active' : 'span1NotActive'}/>

            <span id={!isMenu ? 'span2Active' : 'span2NotActive'}/>

            <span id={isMenu ? 'span3Active' : 'span3NotActive'}/>

          </div>

          <div
            className="mobileSideNav"
            id={isMenu ? 'sideNavActive' : 'sideNavNotActive'}
            >

            <ul className='sideNavUL disable-text-copy'>

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

              <Link onClick={() => setIsMenu(false)} href={getHref('vehicles')} className={'navBtn'}>
                <Svgs name={'vehciles'}/>
                {getNameByLang('وسائل نقل', pathname.includes('/en'))}
              </Link>

              <div className='user admin-header-button disable-text-copy' style={{ 
                display: (userRole === 'admin' || userRole === 'owner') ? null : 'none' 
              }}>
                <Link onClick={() => setIsMenu(false)} href={(userRole === 'admin' || userRole === 'owner') 
                ? getHref('admin') : ''}>
                  <Svgs name={'management'}/>
                  {getNameByLang('صفحة الادارة', pathname.includes('/en'))}
                </Link>
              </div>

              <Link href={getHref('add')} onClick={() => setIsMenu(false)}
                style={{ display: !userId?.length > 0 ? 'none' : null }} className='addItemHeaderDiv disable-text-copy'>
                {getNameByLang('أضف عقارك', pathname.includes('/en'))}
              </Link>

              <hr />

              <div className='nav-bottom'>
                <Link onClick={() => setIsMenu(false)} className='lang disable-text-copy' href={getHref('lang')}>
                  <h5>{!pathname.includes('/en') ? 'Browse in' : 'التصفح في'}</h5>
                  <p>{!pathname.includes('/en') ? 'English' : 'العربية'}</p>
                </Link>
                <ul>
                  {contactInfo.map((contact, index) => (
                    <li key={index}><Link className={contact.name === 'instagram' || contact.name === 'facebook' ? 'adjust-svg' : undefined} target='_blank' href={contact.val}><Svgs name={contact.name}/></Link></li>
                  ))}
                </ul>
              </div>

            </ul>

          </div>

        </div>

        {(isCityFilter || isCatagoryFilter || isCalendarFilter || isMenu) && <span id='closeFilterPopupSpan' onClick={() => {
          setIsCityFilter(false); setIsCatagoryFilter(false); setIsCalendarFilter(false); setIsMenu(false);
        }} style={{ background: (isMenu && isMobile) ? 'rgba(0, 0, 0, 0.24)' : undefined }}/>}

        {!(isSearchMap && pathname.includes('/search')) && (pathname === '/properties' || pathname === '/vehicles' || pathname === '/en/properties' || pathname === '/en/vehicles' || pathname.includes('search') || pathname.includes('deals')) 
        && <div className='filterHeaderDiv'>
          <button onClick={() => setIsFilter(true)}><Svgs name={'filter'}/>{getNameByLang('تصفية', pathname.includes('/en'))}</button>
          <span />
          <button id='secondFilterHeaderDivBtn' onClick={() => setIsArrange(true)}><Svgs name={'filter'}/>{getNameByLang('ترتيب', pathname.includes('/en'))}</button>
        </div>}

        {(pathname !== '/' || pathname !== '/en') && <Filter isEnglish={pathname.includes('/en')} type={'prop'} 
        isFilter={isFilter} setIsFilter={setIsFilter} triggerFetch={triggerFetch} 
        setTriggerFetch={setTriggerFetch} isVehicles={pathname.includes('/vehicles')}/>}

        <Arrange isEnglish={pathname.includes('/en')} isArrange={isArrange} setIsArrange={setIsArrange} setTriggerFetch={setTriggerFetch} triggerFetch={triggerFetch} arrangeValue={arrangeValue} setArrangeValue={setArrangeValue}/>

        {isMap && <GoogleMapPopup isShow={isMap} setIsShow={setIsMap} mapType={mapType} 
        mapArray={mapArray} longitude={longitude} setLongitude={setLongitude} 
        latitude={latitude} setLatitude={setLatitude} arFont={arabicFontClassname} enFont={englishFontClassname}/>}

        {((pathname === '/' || pathname === '/search' || pathname === '/en') && isMobileHomeFilter) 
          && <MobileFilter isMobile960={isMobile960} isEnglish={pathname.includes('/en')}/>}

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
