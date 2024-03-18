'use client';

import '@styles/sections_styles/AboutSection.css';
import Image from 'next/image';
import AboutBackgroundImage from '@assets/images/about-section-background.png';
import Svgs from '@utils/Svgs';
import { testImage } from '@utils/Data';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import { useEffect, useState } from 'react';

const AboutSection = () => {

  const whatWeOfferArray = [
    { _id: '0', iconName: 'book', title: 'best offers you can get', slogan: 'what is more exciting' },
    { _id: '1', iconName: 'book', title: 'best offers you can get', slogan: 'what is more exciting' },
    { _id: '2', iconName: 'book', title: 'best offers you can get', slogan: 'what is more exciting' },
    { _id: '3', iconName: 'book', title: 'best offers you can get', slogan: 'what is more exciting' },
  ];

  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    setSwiper(new Swiper('.about-swiper', {
      // Optional parameters
      direction: "horizontal",
      loop: false,
      slidesPerView: 'auto',
      
      // Navigation arrows
      navigation: {
          nextEl: ".about-arrow-slide-next",
          prevEl: ".about-arrow-slide-prev",
      },
  }))
  }, []);

  return (
    <div className='aboutSection'>

        <div className='perfectRent'>

            <div className='textDiv'>
              
              <h2>ايجارك المثالي</h2>

              <p>illo dicta eveniet, error possimus tempora neque ut.</p>
          
              <h4>تفقد آخر العروض الحصرية</h4>

              <div className='about-arrows'>
                <div className='about-arrow-slide-prev'><Svgs name={'dropdown arrow'}/></div>
                <div className='about-arrow-slide-next'><Svgs name={'dropdown arrow'}/></div>
              </div>

            </div>

            <div className='swiperAboutContainer'>

              <div className='about-swiper swiperAboutDiv'>
                <div className='swiper-wrapper wrapperDiv'>
                  <div className='swiper-slide aboutListItem'><Image src={testImage()}/><h3>شقق و سيارات</h3></div>
                  <div className='swiper-slide aboutListItem'><Image src={testImage()}/><h3>شقق و سيارات</h3></div>
                  <div className='swiper-slide aboutListItem'><Image src={testImage()}/><h3>شقق و سيارات</h3></div>
                  <div className='swiper-slide aboutListItem'><Image src={testImage()}/><h3>شقق و سيارات</h3></div>
                  <div className='swiper-slide aboutListItem'><Image src={testImage()}/><h3>شقق و سيارات</h3></div>
                  <div className='swiper-slide aboutListItem'><Image src={testImage()}/><h3>شقق و سيارات</h3></div>
                  <div className='swiper-slide aboutListItem'><Image src={testImage()}/><h3>شقق و سيارات</h3></div>
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
                  <li>
                    <Svgs name={'search'}/>
                    <div>
                      <h4>{'افضل الخدمات'}</h4> {/* offer.iconName, title, slogan */}
                      <h5>{'نقدم افضل الخدمات بارخص الاسعار'}</h5>
                    </div>
                  </li>
                ))}
              </ul>

            </div>
            
            <div className='whatWeOfferImageDiv'>
              <Image src={AboutBackgroundImage}/>
            </div>

        </div>
        
    </div>
  )
}

export default AboutSection
