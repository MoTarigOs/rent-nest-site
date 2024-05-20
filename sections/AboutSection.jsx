'use client';

import '@styles/sections_styles/AboutSection.css';
import Image from 'next/image';
import AboutBackgroundImage from '@assets/images/image_as_logo2.webp';
import Svgs from '@utils/Svgs';
import { ProperitiesCatagories, VehicleCatagories, getCategoryImage } from '@utils/Data';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import { useContext, useEffect } from 'react';
import { Context } from '@utils/Context';
import { getNameByLang } from '@utils/Logic';

const AboutSection = ({ isEnglish }) => {

  const whatWeOfferArray = !isEnglish ? [
    { _id: '0', iconName: 'rent', title: 'أفضل عروض الايجار', slogan: 'نقدم أفضل عروض ايجار العقارات' },
    { _id: '1', iconName: 'prices', title: 'أسعار تناسب الجميع', slogan: 'ستجد ما يناسبك من حيث الاسعار و المواصفات' },
    { _id: '2', iconName: 'advertise', title: 'اعلن لدينا', slogan: 'اعرض سيارة أو عقار للإِيجار' },
    { _id: '3', iconName: 'seller', title: 'مرونة للمعلن و المشتري', slogan: 'ستجد مرونة كبيرة في تعديل العرض و مرنوة في اختيار تاريخ الحجز' }
  ] : [
    { _id: '0', iconName: 'rent', title: 'Best Rent offers', slogan: 'We offer the best real estate rental offers' },
    { _id: '1', iconName: 'prices', title: 'Prices to suit everyone', slogan: 'You will find what suits you in terms of prices and specifications' },
    { _id: '2', iconName: 'advertise', title: 'Advertise with us', slogan: 'Offer a car or property for rent' },
    { _id: '3', iconName: 'seller', title: 'Flexibility for advertiser and buyer', slogan: 'You will find great flexibility in amending the offer and flexibility in choosing the booking date' }
  ];

  const { setIsMobileHomeFilter, setCatagory, setSection } = useContext(Context);

  let swiper = null;

  useEffect(() => {
    swiper = new Swiper('.about-swiper', {
      // Optional parameters
      direction: "horizontal",
      loop: false,
      slidesPerView: 'auto',
      
      // Navigation arrows
      navigation: {
          nextEl: ".about-arrow-slide-next",
          prevEl: ".about-arrow-slide-prev",
      },
  })
  }, []);

  return (
    <div className='aboutSection' dir={isEnglish ? 'ltr' : null}>

        <div className='perfectRent'>

            <div className='textDiv' style={isEnglish ? { marginLeft: 0, paddingLeft: 0, marginRight: 0, paddingRight: 64 } : null}>
              
              <h2>{getNameByLang('ايجارك المثالي', isEnglish)}</h2>

              <p>{getNameByLang('تمتع بمرونة كبيرة في الأسعار و الخيارات.', isEnglish)}</p>
          
              <h4>{getNameByLang('تفقد آخر العروض الحصرية', isEnglish)}</h4>

              <div dir='rtl' style={{ transform: isEnglish ? 'rotate(180deg)' : undefined }} className='about-arrows'>
                <div className='about-arrow-slide-prev'><Svgs name={'dropdown arrow'}/></div>
                <div className='about-arrow-slide-next'><Svgs name={'dropdown arrow'}/></div>
              </div>

              <span id='background-wall-span' style={isEnglish ? { left: 'calc((100vw - 100%) / 2 * -1 - 48px)', right: 'unset' } : null}/>

            </div>

            <div className='swiperAboutContainer'>

              <div className='about-swiper swiperAboutDiv'>
                <div className='swiper-wrapper wrapperDiv'>
                  {[...ProperitiesCatagories, VehicleCatagories[0]].map((item, index) => (
                    <div key={index} className='swiper-slide aboutListItem' onClick={() => {
                      setCatagory(item.value); setIsMobileHomeFilter(true); setSection('city skip-category');
                    }}>
                      <Image loading='eager' src={getCategoryImage(item.value)} alt={item.value}/>
                      <h3>{isEnglish ? getNameByLang(item.arabicName, isEnglish) : item.arabicName}</h3>
                    </div>
                  ))}
                </div>
              </div>

            </div>

        </div>

        <div className={isEnglish ? 'whatWeOffer english-whatweoffer' : 'whatWeOffer'}>

            <div className='whatweoffercontent'>

              <h2>{getNameByLang('ماذا نقدم لك؟', isEnglish)}</h2>

              <p>{getNameByLang('سنساعد في إِيجاد إِيجارك المثالي', isEnglish)}</p>
          
              <ul>
                {whatWeOfferArray.map((offer) => (
                  <li key={offer._id}>
                    <Svgs name={offer.iconName}/>
                    <div>
                      <h4>{offer.title}</h4>
                      <h5>{offer.slogan}</h5>
                    </div>
                  </li>
                ))}
              </ul>

            </div>
            
            <div className='whatWeOfferImageDiv'>
              <Image placeholder='blur' loading='eager' src={AboutBackgroundImage} alt={isEnglish ? 'rent nest renting services' : 'عن منصة rent nest للايجارات'}/>
            </div>

        </div>
        
    </div>
  )
}

export default AboutSection
