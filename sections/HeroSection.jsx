'use client';

import '@styles/sections_styles/HeroSection.css';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import { JordanCities, homePageCatagories, testImage } from '@utils/Data';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import Svgs from '@utils/Svgs';
import CityImage from '@assets/images/jordan-city.jpg';
import LandImage1 from '@assets/images/test.jpg';
import LandImage2 from '@assets/images/landing1.webp';
import LandImage3 from '@assets/images/landing2.webp';
import LandImage4 from '@assets/images/vehcile-for-rent.jpg';
import { Context } from '@utils/Context';

const HeroSection = () => {

    const cities = [
        { _id: 0, name: 'عمان', cityRef: useRef() },
        { _id: 1, name: 'الزرقاء', cityRef: useRef() },
        { _id: 2, name: 'اربد', cityRef: useRef() },
        { _id: 5, name: 'الرمثا', cityRef: useRef() },
        { _id: 22, name: 'الكرك', cityRef: useRef() },
        { _id: 28, name: 'المؤتة', cityRef: useRef() },
        { _id: 34, name: 'كريمة', cityRef: useRef() }
    ];

    const swiperRef = useRef();
    const [selectedCity, setSelectedCity] = useState(cities[3]);
    const [swiper, setSwiper] = useState(null);
    const [swiperVertical, setSwiperVertical] = useState(null);

    const { setIsMobileHomeFilter, setCity } = useContext(Context);
        
    const handleChange = () => {

        console.log('state changes');
        
        for (let i = 0; i < cities.length; i++) {

            const x = cities[i]?.cityRef?.current?.getBoundingClientRect()?.x;

            console.log(i, ' x bound: ', x, ' innerWidth: ', window.innerWidth);

            if(x <= window.innerWidth / 2 && x >= (window.innerWidth / 2) - 240){
                setSelectedCity(cities[i]);
            }

        }
    };

    useEffect(() => {
    
        setSwiper(new Swiper(".swiper", {
            // Optional parameters
            direction: "horizontal",
            loop: false,
            slidesPerView: 'auto',
            
            // Navigation arrows
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            on: {
                sliderMove: () => {
                        setTimeout(() => {handleChange()}, [500])
                },
                slideChange: () => {
                    setTimeout(() => {handleChange()}, [500])
                }
            }
        }));

        setSwiperVertical(new Swiper(".vertical-swiper", {
            // Optional parameters
            direction: "vertical",
            loop: false,
            slidesPerView: 'auto',
        }));

    }, []);

    useEffect(() => {
        swiper?.slideTo(3);
        setTimeout(() => {
            swiper?.update();
        }, [1000]);
    }, [swiper]);

    const VerticalList = ({ list }) => {
        return(
            <ul>
                {list.map((item) => (
                    <li>
                        <Image src={item.image} loading='eager' alt='hero images'/>
                    </li>
                ))}
            </ul>
        )
    }

    return (

        <div className="hero">
            
            <div className='ourDeals'>

                <h1>استفد من عروضنا الحصرية لإِيجار السيارات و العقارات في كل أنحاء الاردن</h1>
                
                <p>توجد لدينا عروض بمختلف أصناف العقارات و السيارات من شقق و منازل الى مزارع و مخيمات و سيارات أينما كنت في الاردن ستجد ما يناسبك</p>

                <div className='citiesDiv'>

                    <div class="swiper swiperDiv" ref={swiperRef}>

                        <div class="swiper-wrapper wrapperDiv" onChange={() => console.log('changed')}>
                            {cities.map((c) => (
                                <div onClick={() => {
                                    console.log('c: ', c, ' city: ', JordanCities.find(i => i.city_id === c._id));
                                    setIsMobileHomeFilter(true); 
                                    setCity(JordanCities.find(i => i.city_id === c._id));
                                }} className={`swiper-slide cityItem ${c._id === selectedCity._id && 'selectedCity'}`} ref={c.cityRef}>
                                    <div>
                                        <Image src={CityImage} loading='eager' alt={`${c.name} صورة`}/>
                                        <h3>{c.name}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div class="swiper-button-next"><span /><Svgs name={'dropdown arrow'}/></div>
                        <div class="swiper-button-prev"><span /><Svgs name={'dropdown arrow'}/></div>

                    </div>

                </div>

            </div>

            <div className='allOffersCatagories'>
                <ul>
                    {homePageCatagories.map((ctg) => (
                        <li><h3>{ctg}</h3></li>
                    ))}
                </ul>
            </div>

            <div className='ourOffers'>

                <VerticalList list={[{image: LandImage1}, {image: LandImage1}, {image: LandImage1}]}/>
                <VerticalList list={[{image: LandImage2}, {image: LandImage2}, {image: LandImage2}]}/>


                <div className='text'>
                    <h2>عروضنا المميزة</h2>
                    <p>هل تبحث عن سيارة للإيجار أو شقة للإقامة؟ نحن هنا لمساعدتك في العثور على أفضل الخيارات, اختر من بين مجموعة متنوعة من السيارات، بدءًا من الاقتصادية إلى الفاخرة, بحث عن شقق مفروشة أو غير مفروشة، وفلل، وشقق مشتركة.</p>
                    <button onClick={() => setIsMobileHomeFilter(true)}>استكشف</button>
                </div>

                <VerticalList list={[{image: LandImage3}, {image: LandImage3}, {image: LandImage3}]}/>
                <VerticalList list={[{image: LandImage4}, {image: LandImage4}, {image: LandImage4}]}/>

            </div>
        
        </div>

    )
};

export default HeroSection;
