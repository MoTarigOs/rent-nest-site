'use client';

import '@styles/sections_styles/HeroSection.css';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { homePageCatagories, testImage } from '@utils/Data';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import Svgs from '@utils/Svgs';

const HeroSection = () => {

    const cities = [
        { _id: '0', name: 'عمان', numOfOffers: 1000, cityRef: useRef() },
        { _id: '1', name: 'عمان', numOfOffers: 1000, cityRef: useRef() },
        { _id: '2', name: 'عمان', numOfOffers: 1000, cityRef: useRef() },
        { _id: '3', name: 'عمان', numOfOffers: 1000, cityRef: useRef() },
        { _id: '4', name: 'عمان', numOfOffers: 1000, cityRef: useRef() },
        { _id: '5', name: 'عمان', numOfOffers: 1000, cityRef: useRef() },
        { _id: '6', name: 'عمان', numOfOffers: 1000, cityRef: useRef() },
    ];

    const swiperRef = useRef();
    const slideRef = useRef();
    const [logText, setLogText] = useState('');
    const [index, setIndex] = useState('');
    const [selectedCity, setSelectedCity] = useState(cities[3]);
    const [swiper, setSwiper] = useState(null);
    const [swiperVertical, setSwiperVertical] = useState(null);


    const [vehiclesDeals, setVehiclesDeals] = useState([]);


        
    const handleChange = () => {

        console.log('state changes');
        
        for (let i = 0; i < cities.length; i++) {

            const x = cities[i].cityRef.current.getBoundingClientRect().x;

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
    }, [swiper]);

    const VerticalList = ({ list }) => {
        return(
            <ul>
                {list.map((item) => (
                    <li>
                        <Image src={item.image}/>
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
                                <div className={`swiper-slide cityItem ${c._id === selectedCity._id && 'selectedCity'}`} ref={c.cityRef}>
                                    <div>
                                        <Image src={testImage()}/>
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

                <button>أكثر...</button>
            </div>

            <div className='ourOffers'>

                <VerticalList list={[{image: testImage()}, {image: testImage()}, {image: testImage()}]}/>
                <VerticalList list={[{image: testImage()}, {image: testImage()}, {image: testImage()}]}/>


                <div className='text'>
                    <h2>عروضنا المميزة</h2>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi accusantium tempore sequi voluptatum exercitationem inventore modi voluptate. Corporis cupiditate itaque eius est, cumque perspiciatis maxime.</p>
                    <button>استكشف</button>
                </div>

                <VerticalList list={[{image: testImage()}, {image: testImage()}, {image: testImage()}]}/>
                <VerticalList list={[{image: testImage()}, {image: testImage()}, {image: testImage()}]}/>

            </div>

        
        </div>

    )
};

export default HeroSection;
