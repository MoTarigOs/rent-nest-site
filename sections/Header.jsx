'use client';

import '@styles/Header.css';
import Image from 'next/image';
import LogoImage from '@assets/icons/rentnext-logo.png';
import Svgs from '@utils/Svgs';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import InvertedIcon from '@assets/icons/inverted-corner.png';
import HeaderPopup from '@components/popups/HeaderPopup';
import Filter from '@components/Filter';
import Arrange from '@components/popups/Arrange';
import { Context } from '@utils/Context';
import { getUserInfo } from '@utils/api';
import { getArabicNameCatagory, getReadableDate } from '@utils/Logic';
import GoogleMapPopup from '@components/popups/GoogleMapPopup';
import MobileFilter from '@components/popups/MobileFilter';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const Header = () => {

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [runOnce, setRunOnce] = useState(false);
    const [isMenu, setIsMenu] = useState(false);
    const [isCityFilter, setIsCityFilter] = useState(false);
    const [isCatagoryFilter, setIsCatagoryFilter] = useState(false);
    const [isCalendarFilter, setIsCalendarFilter] = useState(false);
    
    const [isFilter, setIsFilter] = useState(false);
    const [isArrange, setIsArrange] = useState(false);
    const [notif, setNotification] = useState('');
    const pathname = usePathname();

    const { executeRecaptcha } = useGoogleReCaptcha();

    const { 
      userId, userUsername, userRole, setUserId, 
      setUserUsername, setUserRole, city, setCity,
      catagory, setCatagory, triggerFetch, setTriggerFetch,
      arrangeValue, setArrangeValue, setUserEmail, setIsVerified,
      setUserPhone, setUserAddress, setBooksIds, booksIds, 
      setFavouritesIds, mapType, mapArray, isMap, setIsMap, 
      latitude, setLatitude, longitude, setLongitude,
      calendarDoubleValue, setCalendarDoubleValue, setIsMobileHomeFilter,
      isCalendarValue, setIsCalendarValue, setLoadingUserInfo,
      isMobileHomeFilter, setStorageKey
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

    const getRecaptchaToken = async() => {
      if (!executeRecaptcha) {
        console.log("Execute recaptcha not available yet");
        setNotification("not set");
        return;
      }
      const gReCaptchaToken = await executeRecaptcha('enquiryFormSubmit');

      console.log('recaptcha token: ', gReCaptchaToken);
    
    }

    useEffect(() => {

      setRunOnce(true);

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
      if(runOnce === true){
        setLoadingUserInfo(true);
        getUserInfo(
          setUserId, setUserUsername, setUserRole, 
          setUserEmail, setIsVerified, setUserAddress,
          setUserPhone, setBooksIds, setFavouritesIds, 
          setLoadingUserInfo, setStorageKey
        );
      }
    }, [runOnce]);

    useEffect(() => {
      if(longitude) setLongitude(null);
      if(latitude) setLatitude(null);
      setIsMobileHomeFilter(false);
    }, [pathname]);

    useEffect(() => {
      setTriggerFetch(!triggerFetch);
      setIsCalendarValue(true);
    }, [calendarDoubleValue]);

    useEffect(() => {
      if(isCalendarFilter)
        setIsCalendarValue(false);
    }, [isCalendarFilter]);

  return (

    <div className='header' style={{ 
      position: 'fixed', zIndex: (isArrange || isFilter || isMenu || isMap 
          || isCatagoryFilter || isCityFilter || isCalendarFilter
          || isMobileHomeFilter) && 11
    }} suppressHydrationWarning={true}>
      
        <div className='desktopWrapper'>
            
            <Link href={'/'} className='logo'>
                <Image src={LogoImage} alt='rentnext website logo image'/>
            </Link>

            <Link href={'/properties?catagory=resort'} className='navBtn'>
                شاليهات, منتجعات, استراحات
            </Link>

            <Link href={'/properties?catagory=apartment'} className={'navBtn'}>
                شقق و بيوت
            </Link>

            <Link href={'/properties?catagory=farm'} className={'navBtn'}>
                مزارع و مخيمات
            </Link>

            <Link href={'/vehicles'} style={{ marginLeft: 'auto' }} className={'navBtn'}>
                سيارات
            </Link>

            <Link href={'/add'} style={{ display: !userId?.length > 0 ? 'none' : null }} className='addItemHeaderDiv'>أضف عقارك</Link>

            <div className='user'>
              <Link href={userId?.length > 0 ? `/profile?id=${userId}` : '/sign-up'}>
                <div className='profileSvg'><Svgs name={'profile'}/></div>
                <p>{userId?.length > 0 ? userUsername : 'الدخول أو انشاء حساب'}</p>
                <div className='arrowSvg'><Svgs name={'dropdown arrow'}/></div>
              </Link>
            </div>

            <div className='user admin-header-button' style={{ 
              display: (userRole === 'admin' || userRole === 'owner') ? null : 'none' 
            }}>
              <Link href={(userRole === 'admin' || userRole === 'owner') 
              ? `/admin` : ''}>
                <Svgs name={'management'}/>
                <p>صفحة الادارة</p>
              </Link>
            </div>
            
            <div className='lang'>
                <h5>Browse in</h5>
                <a>English</a>
            </div>
        
        </div>

        {(pathname === '/' || pathname === '/search') ? <motion.div className={`headerSearchDiv ${(isScrolled && isMobile) && 'scrolledSearhDiv'}`}
          initial={{ y: 0 }}
          animate={{ y: (isScrolled && isMobile) ? -78 : 0, transition: { damping: 50 } }}
        >
          <div className='searchDiv'>
            <ul>
                <li className='desktopSearchDivLI' onClick={() => {setIsCityFilter(true); setIsCatagoryFilter(false); setIsCalendarFilter(false);}}>{isCityFilter && <HeaderPopup type={'city'} city={city} setCity={setCity}/>}<h4>اختر المدينة</h4><h3>{!city?.value ? 'كل المدن' : city.arabicName}</h3></li>
                <li className='desktopSearchDivLI' onClick={() => {setIsCityFilter(false); setIsCatagoryFilter(true); setIsCalendarFilter(false);}}>{isCatagoryFilter && <HeaderPopup type={'catagory'} pathname={pathname} handleChoose={() => setIsCatagoryFilter(false)} catagory={catagory} setCatagory={setCatagory}/>}<h4>التصنيف</h4><h3>{catagory === '' ? 'كل التصنيفات' : getArabicNameCatagory(catagory)}</h3></li>
                <li className='desktopSearchDivLI' onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4>تاريخ الحجز</h4><h3 suppressHydrationWarning={true}>{getReadableDate(calendarDoubleValue?.at(0), true)}</h3>{isCalendarFilter && <HeaderPopup type={'calendar'} calendar={calendarDoubleValue?.toString()} setCalendarDoubleValue={setCalendarDoubleValue}/>}</li>
                <li className='desktopSearchDivLI' onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4>تاريخ انتهاءالحجز</h4><h3 suppressHydrationWarning={true}>{getReadableDate(calendarDoubleValue?.at(1), true)}</h3></li>
                <li className='header-search-btn'>
                  <Link href={'/search'}><Svgs name={'search'}/></Link>
                </li>
                <li className='mobileSearchDiv mobileSearchDivLI'>
                  <div onClick={() => setIsMobileHomeFilter(true)}>
                    <Svgs name={'search'}/>
                    <p>ابحث عن سيارة أو عقار</p>
                  </div>
                </li>
            </ul>
            <div id='invertedIconDivLeft'><Image src={InvertedIcon}/></div>
            <div id='invertedIconDivRight'><Image src={InvertedIcon}/></div>
          </div>
          <span id='rightSpanHeaderSearch'/>
          <span id='leftSpanHeaderSearch'/>
        </motion.div> : (pathname === '/vehicles' || pathname === '/properties') && <div className='headerSearchOtherDiv'>
          <ul className='headerNavUL'>
            <li className='headerNavLi' id='searchLiHeaderOther'><Svgs name={'search'}/></li>
            <li className='headerNavLi' onClick={() => {setIsCityFilter(true); setIsCatagoryFilter(false); setIsCalendarFilter(false);}}><h4>{!city.value ? 'كل المدن' : city.arabicName}</h4>{isCityFilter && <HeaderPopup type={'city'} city={city} setCity={setCity}/>}</li>
            <li className='headerNavLi' onClick={() => {setIsCatagoryFilter(true); setIsCityFilter(false); setIsCalendarFilter(false)}}><h4>{catagory === '' ? 'كل التصنيفات' : getArabicNameCatagory(catagory)}</h4>{isCatagoryFilter && <HeaderPopup pathname={pathname} type={'catagory'} handleChoose={() => setIsCatagoryFilter(false)} catagory={catagory} setCatagory={setCatagory}/>}</li>
            <li className='headerNavLi' onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4 suppressHydrationWarning={true}>{getReadableDate(calendarDoubleValue?.at(0), true)}</h4>{isCalendarFilter && <HeaderPopup type={'calendar'} setCalendarDoubleValue={setCalendarDoubleValue}/>}</li>
            <li className='headerNavLi' style={{ border: 'none' }} onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4 suppressHydrationWarning={true}>{getReadableDate(calendarDoubleValue?.at(1), true)}</h4></li>
          </ul>
          <Link className='showMap' href={'/search'}>
            <Svgs name={'search'}/>
            عرض الخريطة
          </Link>
        </div>}

        <div className="mobileHeader" style={{ zIndex: isMenu && 11 }}>

          <div className='user'>
              <Link href={userId?.length > 0 ? `/profile?id=${userId}` : '/sign-up'}>
                <div className='profileSvg'><Svgs name={'profile'}/></div>
                <p>{userId?.length > 0 ? userUsername : 'الدخول أو انشاء حساب'}</p>
                <div className='arrowSvg'><Svgs name={'dropdown arrow'}/></div>
              </Link>
          </div>

          <Link href={'/'} style={{ display: isScrolled && pathname === '/' && 'none' }} className='logo'>
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
            style={{ left: 'unset', right: 0 }}
            initial={{ x: '110%' }}
            animate={{ x: isMenu ? 0 : '110%', transition: { type: "tween", duration: 0.15 } }}
          >

            <ul>

              <Link onClick={() => setIsMenu(false)} href={'/properties?catagory=resort'} className='navBtn'>
                  <Svgs name={'layer'}/>
                  شاليهات, منتجعات, استراحات
              </Link>

              <Link onClick={() => setIsMenu(false)} href={'/properties?catagory=apartment'} className={'navBtn'}>
                  <Svgs name={'layer'}/>
                  شقق و بيوت
              </Link>

              <Link onClick={() => setIsMenu(false)} href={'/properties?catagory=farm'} className={'navBtn'}>
                  <Svgs name={'layer'}/>
                  مزارع و مخيمات
              </Link>

              <Link onClick={() => setIsMenu(false)} href={'/vehicles'} style={{ marginBottom: 'auto' }} 
                className={'navBtn'}>
                <Svgs name={'layer'}/>
                  سيارات
              </Link>
              
              {(userRole === 'admin' || userRole === 'owner') && <Link 
                onClick={() => setIsMenu(false)} href={'/admin'}  
                className={'navBtn'}  style={{ display: userId ? null : 'none' }}>
                <Svgs name={'management'}/>
                  صفحة الادارة
              </Link>}

              <Link onClick={() => setIsMenu(false)} style={{ display: !userId?.length > 0 ? 'none' : null }} 
                href={'/add'} className='addItemHeaderDiv'>أضف عقارك</Link>

              <div className='lang' style={{ marginTop: 'auto' }}>
                  <h5>Browse in</h5>
                  <a>English</a>
              </div>

            </ul>

          </motion.div>

        </div>

        {(isCityFilter || isCatagoryFilter || isCalendarFilter) && <span id='closeFilterPopupSpan' onClick={() => {
          setIsCityFilter(false); setIsCatagoryFilter(false); setIsCalendarFilter(false);
        }}/>}

        {(pathname === '/properties' || pathname === '/vehicles') && <div className='filterHeaderDiv'>
          <button onClick={() => setIsFilter(true)}><Svgs name={'filter'}/>تصفية</button>
          <span />
          <button id='secondFilterHeaderDivBtn' onClick={() => setIsArrange(true)}><Svgs name={'filter'}/>ترتيب</button>
        </div>}

        <Filter type={'prop'} isFilter={isFilter} setIsFilter={setIsFilter} triggerFetch={triggerFetch} setTriggerFetch={setTriggerFetch}/>

        <Arrange isArrange={isArrange} setIsArrange={setIsArrange} setTriggerFetch={setTriggerFetch} triggerFetch={triggerFetch} arrangeValue={arrangeValue} setArrangeValue={setArrangeValue}/>

        <GoogleMapPopup isShow={isMap} setIsShow={setIsMap} mapType={mapType} 
        mapArray={mapArray} longitude={longitude} setLongitude={setLongitude} 
        latitude={latitude} setLatitude={setLatitude}/>

        {isMobile && (pathname === '/' || pathname === '/search') && <MobileFilter />}

    </div>
  )
};

export default Header;
