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
import { getArabicNameCatagory } from '@utils/Logic';

const Header = () => {


    const [isScrolled, setIsScrolled] = useState(false);
    const [runOnce, setRunOnce] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isMenu, setIsMenu] = useState(false);
    const [isCityFilter, setIsCityFilter] = useState(false);
    const [isCatagoryFilter, setIsCatagoryFilter] = useState(false);
    const [isCalendarFilter, setIsCalendarFilter] = useState(false);


    const [calender, setCalender] = useState([new Date, new Date]);
    const [isFilter, setIsFilter] = useState(false);
    const [selectedCatagories, setSelectedCatagories] = useState([]);
    const [isArrange, setIsArrange] = useState(false);
    const pathname = usePathname();

    const { 
      userId, userUsername, userRole, setUserId, 
      setUserUsername, setUserRole, city, setCity,
      catagory, setCatagory, triggerFetch, setTriggerFetch,
      arrangeValue, setArrangeValue
    } = useContext(Context);


    useEffect(() => {
      setRunOnce(true);
      window.addEventListener('scroll', () => {
        if(window.scrollY > 96){
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      });

      return () => window.removeEventListener('scroll', () => {
        if(window.scrollY > 96){
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      });
    }, []);

    useEffect(() => {
      if(runOnce === true && (userId.length <= 0 || !userId))
        getUserInfo(setUserId, setUserUsername, setUserRole);
    }, [runOnce]);

  return (

    <div className='header' style={{ 
      position: 'fixed', zIndex: (isArrange || isFilter || isMenu) && 11
    }} suppressHydrationWarning={true}>
      
        <div className='desktopWrapper'>
            
            <Link href={'/'} className='logo'>
                <Image src={LogoImage} alt='rentnext website logo image'/>
            </Link>

            <Link href={'/properties?catagory=resort'} className='navBtn'>
                شاليهات, منتجعات, استراحات
            </Link>

            <Link href={'/properties?catagory=apartments'} className={'navBtn'}>
                شقق و بيوت
            </Link>

            <Link href={'/properties?catagory=farms'} className={'navBtn'}>
                مزارع و مخيمات
            </Link>

            <Link href={'/vehicles'}  className={'navBtn'}>
                سيارات
            </Link>

            <Link href={'/add'} className='addItemHeaderDiv'>أضف عقارك</Link>

            <div className='user'>
              <Link href={userId?.length > 0 ? `/profile?id=${userId}` : '/sign-up'}>
                <div className='profileSvg'><Svgs name={'profile'}/></div>
                <p>{userId?.length > 0 ? userUsername : 'الدخول أو انشاء حساب'}</p>
                <div className='arrowSvg'><Svgs name={'dropdown arrow'}/></div>
              </Link>
            </div>
            
            <div className='lang'>
                <h5>Browse in</h5>
                <a>English</a>
            </div>
        
        </div>

        {pathname === '/' ? <motion.div className={`headerSearchDiv ${isScrolled && 'scrolledSearhDiv'}`}
          initial={{ y: 0 }}
          animate={{ y: isScrolled ? -78 : 0, transition: { damping: 50 } }}
        >
          <div className='searchDiv'>
            <ul>
                <li className='desktopSearchDivLI' onClick={() => {setIsCityFilter(true); setIsCatagoryFilter(false); setIsCalendarFilter(false);}}>{isCityFilter && <HeaderPopup type={'city'} city={city} setCity={setCity}/>}<h4>اختر المدينة</h4><h3>{!city.value ? 'كل المدن' : city.arabicName}</h3></li>
                <li className='desktopSearchDivLI' onClick={() => {setIsCityFilter(false); setIsCatagoryFilter(true); setIsCalendarFilter(false);}}>{isCatagoryFilter && <HeaderPopup type={'catagory'} catagory={catagory} setCatagory={setCatagory}/>}<h4>التصنيف</h4><h3>{catagory === '' ? 'كل التصنيفات' : getArabicNameCatagory(catagory)}</h3></li>
                <li className='desktopSearchDivLI' onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4>تاريخ الحجز</h4><h3 suppressHydrationWarning={true}>{calender[0].getDay()}</h3>{isCalendarFilter && <HeaderPopup type={'calendar'} calendar={calender.toString()} setCalender={setCalender}/>}</li>
                <li className='desktopSearchDivLI' onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4>تاريخ انتهاءالحجز</h4><h3 suppressHydrationWarning={true}>{calender[0].getDay()}</h3></li>
                <li className='mobileSearchDiv mobileSearchDivLI'>
                  <Link href={'/properties'}>
                    <Svgs name={'search'}/>
                    <p>ابحث عن سيارة أو عقار</p>
                  </Link>
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
            <li className='headerNavLi' onClick={() => {setIsCatagoryFilter(true); setIsCityFilter(false); setIsCalendarFilter(false)}}><h4>{catagory === '' ? 'كل التصنيفات' : getArabicNameCatagory(catagory)}</h4>{isCatagoryFilter && <HeaderPopup type={'catagory'} catagory={catagory} setCatagory={setCatagory}/>}</li>
            <li className='headerNavLi' onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4 suppressHydrationWarning={true}>{calender[0].getDay()}</h4>{isCalendarFilter && <HeaderPopup type={'calendar'} calendar={calender.toString()} setCalender={setCalender}/>}</li>
            <li className='headerNavLi' style={{ border: 'none' }} onClick={() => {setIsCalendarFilter(true); setIsCityFilter(false); setIsCatagoryFilter(false)}}><h4 suppressHydrationWarning={true}>{calender[1].getDay()}</h4></li>
          </ul>
          <div className='showMap'>
            <Svgs name={'search'}/>
            عرض الخريطة
          </div>
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
                  <Svgs name={'star'}/>
                  شاليهات, منتجعات, استراحات
              </Link>

              <Link onClick={() => setIsMenu(false)} href={'/properties?catagory=apartments'} className={'navBtn'}>
                  <Svgs name={'star'}/>
                  شقق و بيوت
              </Link>

              <Link onClick={() => setIsMenu(false)} href={'/properties?catagory=farms'} className={'navBtn'}>
                  <Svgs name={'star'}/>
                  مزارع و مخيمات
              </Link>

              <Link onClick={() => setIsMenu(false)} href={'/vehicles'}  className={'navBtn'}>
                <Svgs name={'star'}/>
                  سيارات
              </Link>

              <Link onClick={() => setIsMenu(false)} href={'/add'} className='addItemHeaderDiv'>أضف عقارك</Link>

              <div className='lang'>
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

        <Arrange isArrange={isArrange} setIsArrange={setIsArrange} arrangeValue={arrangeValue} setArrangeValue={setArrangeValue}/>

    </div>
  )
};

export default Header;
