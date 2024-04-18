'use client';

import '@styles/sections_styles/HeroSection.css';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import { JordanCities, homePageCatagories, testImage } from '@utils/Data';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import Svgs from '@utils/Svgs';
import { Context } from '@utils/Context';
import { getNameByLang } from '@utils/Logic';
import { getCityImage } from '@utils/Cities';

const HeroSection = ({ isEnglish }) => {

    let cities = [];

    for (let i = 0; i < JordanCities.length; i++) {
        cities.push({
            _id: JordanCities[i].city_id,
            value: JordanCities[i].value,
            arabicName: JordanCities[i].arabicName,
            cityRef: useRef()
        });
    };

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
                        setTimeout(() => {handleChange()}, [250])
                },
                slideChange: () => {
                    setTimeout(() => {handleChange()}, [250])
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
            
            <div className='ourDeals' dir='rtl'>

                <h1>{getNameByLang('استفد من عروضنا الحصرية لإِيجار السيارات و العقارات في كل أنحاء الاردن', isEnglish)}</h1>
                
                <p>{getNameByLang('توجد لدينا عروض بمختلف أصناف العقارات و السيارات من شقق و منازل الى مزارع و مخيمات و سيارات أينما كنت في الاردن ستجد ما يناسبك', isEnglish)}</p>

                <div className='citiesDiv'>

                    <div class="swiper swiperDiv" ref={swiperRef}>

                        <div class="swiper-wrapper wrapperDiv" onChange={() => console.log('changed')}>
                            {cities.map((c) => (
                                <div dir={isEnglish ? 'ltr' : null} onClick={() => {
                                    console.log('c: ', c, ' city: ', JordanCities.find(i => i.city_id === c._id));
                                    setIsMobileHomeFilter(true); 
                                    setCity(JordanCities.find(i => i.city_id === c._id));
                                }} className={`swiper-slide cityItem ${c._id === selectedCity._id && 'selectedCity'}`} ref={c.cityRef}>
                                    <div>
                                        <Image src={getCityImage(c?.value)} loading='eager' alt={`${c.name} صورة`}/>
                                        <h3>{isEnglish ? c.value : c.arabicName}</h3>
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
                    {homePageCatagories(isEnglish).map((ctg) => (
                        <li><h3>{ctg}</h3></li>
                    ))}
                </ul>
            </div>

            <div className='ourOffers'>

                <VerticalList list={[{image: getCityImage('Ajloun')}, {image: getCityImage('Zarqa')}, {image: getCityImage('Wadi Rum and Petra')}]}/>
                <VerticalList list={[{image: getCityImage('Tafilah')}, {image: getCityImage('As-Salt')}, {image: getCityImage('Amman')}]}/>


                <div className='text'>
                    <h2>{getNameByLang('عروضنا المميزة', isEnglish)}</h2>
                    <p>{getNameByLang('هل تبحث عن سيارة للإيجار أو شقة للإقامة؟ نحن هنا لمساعدتك في العثور على أفضل الخيارات, اختر من بين مجموعة متنوعة من السيارات، بدءًا من الاقتصادية إلى الفاخرة, بحث عن شقق مفروشة أو غير مفروشة، وفلل، وشقق مشتركة.', isEnglish)}</p>
                    <button onClick={() => setIsMobileHomeFilter(true)}>{getNameByLang('استكشف', isEnglish)}</button>
                </div>

                <VerticalList list={[{image: getCityImage('Irbid')}, {image: getCityImage('Karak')}, {image: getCityImage('Aqaba')}]}/>
                <VerticalList list={[{image: getCityImage('Mafraq')}, {image: getCityImage('Jerash')}, {image: getCityImage('Main')}]}/>

            </div>
        
        </div>

    )
};

export default HeroSection;
