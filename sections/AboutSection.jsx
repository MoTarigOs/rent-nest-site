'use client';

import '@styles/sections_styles/AboutSection.css';
import Image from 'next/image';
import AboutBackgroundImage from '@assets/images/about-section-background.png';
import Svgs from '@utils/Svgs';
import { ProperitiesCatagories, VehicleCatagories, testImage } from '@utils/Data';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import { useContext, useEffect } from 'react';
import FarmImage from '@assets/images/farm.jpg';
import HomeImage from '@assets/images/landing2.webp';
import CarImage from '@assets/images/cars.jpg';
import { Context } from '@utils/Context';

const AboutSection = () => {

  const whatWeOfferArray = [
    { _id: '0', iconName: 'rent', title: 'أفضل عروض الايجار', slogan: 'نقدم أفضل عروض ايجار السيارات و العقارات' },
    { _id: '1', iconName: 'prices', title: 'أسعار تناسب الجميع', slogan: 'ستجد ما يناسبك من حيث الاسعار و المواصفات' },
    { _id: '2', iconName: 'advertise', title: 'اعلن لدينا', slogan: 'اعرض سيارة أو عقار للإِيجار' },
    { _id: '3', iconName: 'seller', title: 'مرونة للمعلن و المشتري', slogan: 'ستجد مرونة كبيرة في تعديل العرض و مرنوة في اختيار تاريخ الحجز' }
  ];

  const { setIsMobileHomeFilter, setCatagory } = useContext(Context);

  let swiper = null;

  const getImage = (type) => {
    switch(type.value){
      case 'farm':
        return FarmImage;
      case 'apartment':
        return HomeImage;
      case 'resort':
        return HomeImage;
      case 'commercial':
        return HomeImage;
      default:
        return CarImage;
    }
  };

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
    <div className='aboutSection'>

        <div className='perfectRent'>

            <div className='textDiv'>
              
              <h2>ايجارك المثالي</h2>

              <p>تمتع بمرونة كبيرة في الأسعار و الخيارات.</p>
          
              <h4>تفقد آخر العروض الحصرية</h4>

              <div className='about-arrows'>
                <div className='about-arrow-slide-prev'><Svgs name={'dropdown arrow'}/></div>
                <div className='about-arrow-slide-next'><Svgs name={'dropdown arrow'}/></div>
              </div>

            </div>

            <div className='swiperAboutContainer'>

              <div className='about-swiper swiperAboutDiv'>
                <div className='swiper-wrapper wrapperDiv'>
                  {[...ProperitiesCatagories, ...VehicleCatagories].map((item) => (
                    <div className='swiper-slide aboutListItem' onClick={() => {
                      setCatagory(item.value); setIsMobileHomeFilter(true);
                    }}><Image src={getImage(item)} loading='eager' alt={item.arabicName}/><h3>{item.arabicName}</h3></div>
                  ))}
                </div>
              </div>

            </div>

        </div>

        <div className='whatWeOffer'>

            <div className='whatweoffercontent'>

              <h2>ماذا نقدم لك؟</h2>

              <p>سنساعد في إِيجاد إِيجارك المثالي</p>
          
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
              <Image src={AboutBackgroundImage} loading='eager' alt='عن منصة rent nest للايجارات'/>
            </div>

        </div>
        
    </div>
  )
}

export default AboutSection
