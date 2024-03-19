'use client';

import '@styles/components_styles/ImagesShow.css';
import Image from 'next/image';
import Svgs from '@utils/Svgs';
import { useEffect, useRef, useState } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';


const ImagesShow = ({ images, videos, handleWishList, type, type_is_video }) => {

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
    let swiper = null;
    const prevButtonRef = useRef(null);
    const prevButtonVideoRef = useRef(null);

    const handleChange = (p) => {
        
        const index = p?.activeIndex;

        console.log(index);

        if(!type_is_video){
            setSelectedImageIndex(index);
        } else {
            setSelectedVideoIndex(index);
        }

    };

    useEffect(() => {
        swiper = new Swiper('.swiper-images-show', {
            // Optional parameters
            direction: "horizontal",
            loop: false,
            slidesPerView: 1,
            
            // Navigation arrows
            navigation: {
                nextEl: ".leftArrow",
                prevEl: ".rightArrow",
            },
            
            on: {
                sliderMove: (pointermove) => {
                    setTimeout(() => handleChange(pointermove), 100);
                },
                slideChange: (pointermove) => {
                    setTimeout(() => handleChange(pointermove), 100);
                },
            }
        });
    }, []);
    
    useEffect(() => {

            if(!type_is_video){
                if(prevButtonRef.current)
                    for (let i = 0; i <= images.length; i++) {
                        prevButtonRef.current.click();
                    }
            } else {
                if(prevButtonVideoRef)
                    for (let i = 0; i <= selectedImageIndex; i++) {
                        prevButtonVideoRef.current.click();
                    }
            }

    }, [type_is_video]);

  return (
    <div className='imagesDiv' style={{ height: type === 'view' && 300 }}>

        <div className='swiper-images-show'>
            <div className='swiper-wrapper'>
            {!type_is_video ? <> {images?.length ? <>{images.map((img) => (
                    <div className='swiper-slide'>
                        <Image src={type === 'landing' ? img.image : `${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${img}`} fill={true} alt='sdsd'/>
                        <div className='images-show-text' style={{ display: type !== 'landing' && 'none' }}>
                            <div>
                                <h2>{img.title}</h2>
                                <p>{img.desc}</p>
                                <button>{img.btnTitle}</button>
                            </div>
                        </div>
                    </div>
                ))}</> : <>
                    <div className='not-exist'>
                        لا توجد صور
                    </div>
                </>}</> : <>
                    {videos?.length > 0 ? <>{videos.map((vd) => (
                        <div className='swiper-slide'>
                            <video controls src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${vd}`}/>
                        </div>
                    ))}</> : <>
                        <div className='not-exist'>
                            لا توجد فيديوهات
                        </div>
                    </>}
                </>}
            </div>

            {!type_is_video ? <>{images?.length > 0 && <>
                <div className='arrow leftArrow'><Svgs name={'dropdown arrow'}/></div>
                <div className='arrow rightArrow' ref={prevButtonRef}><Svgs name={'dropdown arrow'}/></div>
            </>}</> : <>{videos?.length > 0 && <>
                <div className='arrow leftArrow'><Svgs name={'dropdown arrow'}/></div>
                <div className='arrow rightArrow' ref={prevButtonVideoRef}><Svgs name={'dropdown arrow'}/></div>
            </>}</>}

        </div>

        <div id='wishlistDiv'><Svgs name={'wishlist'} on_click={handleWishList ? handleWishList() : null}/></div>

        {!type_is_video ? <ul className={type === 'landing' ? 'dots landingDots' : 'dots'}>
            {images?.map((obj, index) => (
                <li id={selectedImageIndex === index && 'selectedDot'}></li>
            ))}
        </ul> : <ul className={type === 'landing' ? 'dots landingDots' : 'dots'}>
            {videos?.map((obj, index) => (
                <li id={selectedVideoIndex === index && 'selectedDot'}></li>
            ))}
        </ul>}

    </div>
  )
}

export default ImagesShow;
