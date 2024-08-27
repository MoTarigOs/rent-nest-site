'use client';

import '@styles/sections_styles/HeroSection.scss';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import { JordanCities, homePageCatagories } from '@utils/Data';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import Svgs from '@utils/Svgs';
import { Context } from '@utils/Context';
import { getNameByLang } from '@utils/Logic';
import { getCityImage } from '@utils/Cities';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

    const { setIsMobileHomeFilter, setCity, setSection, setSearchText } = useContext(Context);
        
    const handleChange = () => {
        
        for (let i = 0; i < cities.length; i++) {

            const x = cities[i]?.cityRef?.current?.getBoundingClientRect()?.x;

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
                    handleChange();
                    setTimeout(() => {handleChange()}, [1]);
                    setTimeout(() => {handleChange()}, [2]);
                    setTimeout(() => {handleChange()}, [4]);
                    setTimeout(() => {handleChange()}, [6]);
                    setTimeout(() => {handleChange()}, [10]);
                    setTimeout(() => {handleChange()}, [30]);
                    setTimeout(() => {handleChange()}, [60]);
                    setTimeout(() => {handleChange()}, [100]);
                    setTimeout(() => {handleChange()}, [200]);
                    setTimeout(() => {handleChange()}, [300]);
                    setTimeout(() => {handleChange()}, [400]);
                    setTimeout(() => {handleChange()}, [500]);
                },
                slideChange: () => {
                    handleChange();
                    setTimeout(() => {handleChange()}, [1]);
                    setTimeout(() => {handleChange()}, [2]);
                    setTimeout(() => {handleChange()}, [4]);
                    setTimeout(() => {handleChange()}, [6]);
                    setTimeout(() => {handleChange()}, [10]);
                    setTimeout(() => {handleChange()}, [30]);
                    setTimeout(() => {handleChange()}, [60]);
                    setTimeout(() => {handleChange()}, [100]);
                    setTimeout(() => {handleChange()}, [200]);
                    setTimeout(() => {handleChange()}, [300]);
                    setTimeout(() => {handleChange()}, [400]);
                    setTimeout(() => {handleChange()}, [500]);
                }
            }
        }));

        handleChange();
        setTimeout(() => {handleChange()}, [10]);
        setTimeout(() => {handleChange()}, [30]);
        setTimeout(() => {handleChange()}, [60]);
        setTimeout(() => {handleChange()}, [100]);
        setTimeout(() => {handleChange()}, [200]);
        setTimeout(() => {handleChange()}, [300]);
        setTimeout(() => {handleChange()}, [400]);
        setTimeout(() => {handleChange()}, [500]);

        return () => clearTimeout();

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
                {list.map((item, index) => (
                    <li key={index}>
                        <Image loading='eager' placeholder='blur' src={item.image} alt='hero images'/>
                    </li>
                ))}
            </ul>
        )
    };

    return (

        <div className="hero">
            
            <div className='ourDeals' dir='rtl'>

                <h1>{getNameByLang('استفد من عروضنا الحصرية لإِيجار السيارات و العقارات في كل أنحاء الاردن', isEnglish)}</h1>
                
                <p>{getNameByLang('توجد لدينا عروض بمختلف أصناف العقارات و السيارات من شقق و منازل الى مزارع و مخيمات و سيارات أينما كنت في الاردن ستجد ما يناسبك', isEnglish)}</p>

                <div className='citiesDiv'>

                    <div className="swiper swiperDiv" ref={swiperRef}>

                        <div className="swiper-wrapper wrapperDiv" onChange={() => console.log('changed')}>
                            {cities.map((c) => (
                                <div
                                key={c._id} dir={isEnglish ? 'ltr' : null} onClick={() => {
                                    console.log('c: ', c, ' city: ', JordanCities.find(i => i.city_id === c._id));
                                    setIsMobileHomeFilter(true); 
                                    setSection('category');
                                    setCity(JordanCities.find(i => i.city_id === c._id));
                                }} className={`swiper-slide cityItem`} ref={c.cityRef}>
                                    <motion.div
                                    initial={{ scale: 1, boxShadow: 'unset' }}
                                    animate={{ 
                                        scale: c._id === selectedCity._id ? 1.15 : 1,
                                        boxShadow: c._id === selectedCity._id ? '1px 1px 36px var(--secondColorLight)' : 'unset'
                                    }} transition={{ type: 'spring', duration: 0.01 }}
                                    style={{ border: c._id === selectedCity._id ? 'none' : undefined}}>
                                        <Image placeholder='blur' loading='eager' src={getCityImage(c?.value)} alt={`${c.name} صورة`}/>
                                        <h3>{isEnglish ? c.value : c.arabicName}</h3>
                                    </motion.div>
                                </div>
                            ))}
                        </div>

                        <div className="swiper-button-next"><span /><Svgs name={'dropdown arrow'}/></div>
                        <div className="swiper-button-prev"><span /><Svgs name={'dropdown arrow'}/></div>

                    </div>

                </div>

            </div>

            <div className='allOffersCatagories'>
                <ul>
                    {homePageCatagories(isEnglish).map((ctg, index) => (
                        <li key={index}><Link href={(isEnglish ? '/en/search' : '/search') + '?hmctg_id=' + ctg.id} onClick={() => {
                            setCity(ctg.city);
                            setSearchText(ctg?.searchTxt);
                        }}><h3>{ctg.txt}</h3></Link></li>
                    ))}
                </ul>
            </div>

            <div className='ourOffers'>

                <VerticalList list={[{image: getCityImage('Ajloun')}, {image: getCityImage('Zarqa')}, {image: getCityImage('Wadi Rum and Petra')}]}/>
                <VerticalList list={[{image: getCityImage('Tafilah')}, {image: getCityImage('As-Salt')}, {image: getCityImage('Amman')}]}/>

                <div className='text'>
                    <h2>{getNameByLang('عروضنا المميزة', isEnglish)}</h2>
                    <p>{getNameByLang('هل تبحث عن سيارة للإيجار أو شقة للإقامة؟ نحن هنا لمساعدتك في العثور على أفضل الخيارات, اختر من بين مجموعة متنوعة من السيارات، بدءًا من الاقتصادية إلى الفاخرة, بحث عن شقق مفروشة أو غير مفروشة، وفلل، وشقق مشتركة.', isEnglish)}</p>
                    <button onClick={() => {
                        setIsMobileHomeFilter(true); setSection('city');
                    }}>{getNameByLang('استكشف', isEnglish)}</button>
                </div>

                <VerticalList list={[{image: getCityImage('Irbid')}, {image: getCityImage('Karak')}, {image: getCityImage('Aqaba')}]}/>
                <VerticalList list={[{image: getCityImage('Mafraq')}, {image: getCityImage('Jerash')}, {image: getCityImage('Main')}]}/>

            </div>
        
        </div>

    )
};

export default HeroSection;
