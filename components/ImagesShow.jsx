'use client';

import '@styles/components_styles/ImagesShow.css';
import dynamic from 'next/dynamic';
import Image from 'next/image';
const Svgs = dynamic(() => import('@utils/Svgs'));
import { useEffect, useRef, useState } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import Link from 'next/link';

const ImagesShow = ({ 
    isEnglish, images, videos, isAdmin, setFilesToDeleteAdmin, 
    filesToDeleteAdmin,
    handleWishList, type, type_is_video, 
    setImageFullScreen
}) => {

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    let swiper = null;
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);
    const prevButtonVideoRef = useRef(null);
    const nextButtonVideoRef = useRef(null);

    if(type === 'landing'){
        for (let i = 0; i < images.length; i++) {
            [images[i].state, images[i].setState] = useState(false); 
        }
    }

    const handleChange = (p) => {
        
        const index = p?.activeIndex;

        setSelectedImageIndex(index);

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
                if(prevButtonRef.current){
                    for (let i = 0; i <= images.length; i++) {
                        prevButtonRef?.current?.click();
                    }
                }
            } else {
                if(prevButtonVideoRef.current){
                    for (let i = 0; i <= selectedImageIndex; i++) {
                        prevButtonVideoRef?.current?.click();
                    }
                }
            }

    }, [type_is_video]);

  return (
    <div className='imagesDiv' dir={isEnglish ? 'ltr' : null} style={{ height: type === 'view' && 420 }}>

        <div className='swiper-images-show'>
            <div className='swiper-wrapper'>
            {!type_is_video ? <> {images?.length ? <>{images.map((img, index) => (
                    <div key={index} className='swiper-slide'>
                        <Image placeholder={type === 'landing' ? 'blur' : 'empty'} style={{ zIndex: type === 'view' ? 1 : null }} 
                        src={type === 'landing' ? img.image : `${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${img}`} 
                        fill={type === 'landing' ? false : true} 
                        loading='eager' alt={isEnglish ? 'Image about the offer' : 'صورة عن العرض'}
                        onLoad={() => { if(type === 'landing') img.setState(true) }}/>
                        <div className='images-show-text' style={{ display: type !== 'landing' && 'none', width: '100%' }}>
                            <div style={{ width: '100%' }}>
                                <h2>{img.title}</h2>
                                <p>{img.desc}</p>
                                <Link href={img.btnLink ? img.btnLink : ''}>{img.btnTitle}</Link>
                            </div>
                        </div>
                        {(type === 'landing' && img.state) && <span id='landing-item-span'/>}
                    </div>
                ))}</> : <>
                    <div className='not-exist'>
                        {isEnglish ? 'No images found' : 'لا توجد صور'}
                    </div>
                </>}</> : <>
                    {videos?.length > 0 ? <>{videos.map((vd, index) => (
                        <div key={index} className='swiper-slide'>
                            <video controls src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${vd}`}/>
                        </div>
                    ))}</> : <>
                        <div className='not-exist'>
                           {isEnglish ? 'No videos found' : 'لا توجد فيديوهات'}
                        </div>
                    </>}
                </>}
            </div>

            {!type_is_video ? <>{images?.length > 0 && <>
                <div className='arrow leftArrow' ref={nextButtonRef}><Svgs name={'dropdown arrow'}/></div>
                <div className='arrow rightArrow' ref={prevButtonRef}><Svgs name={'dropdown arrow'}/></div>
            </>}</> : <>{videos?.length > 0 && <>
                <div className='arrow leftArrow' ref={nextButtonVideoRef}><Svgs name={'dropdown arrow'}/></div>
                <div className='arrow rightArrow' ref={prevButtonVideoRef}><Svgs name={'dropdown arrow'}/></div>
            </>}</>}

            {(type === 'view' && !type_is_video) && <div style={{ zIndex: 1 }} className='full-screen-svg-div'>
                <Svgs name={'full screen up'} on_click={() => setImageFullScreen(images[selectedImageIndex])}/>
            </div>}

            {(isAdmin && ((type_is_video && videos?.length > 0) || (!type_is_video && images?.length > 0))) && <div className='delete-file' style={{ 
                display: filesToDeleteAdmin.includes(type_is_video ? videos[selectedImageIndex] : images[selectedImageIndex]) 
                    ? 'none' 
                    : null
            }} onClick={() => setFilesToDeleteAdmin([
                ...filesToDeleteAdmin, type_is_video ? videos[selectedImageIndex] : images[selectedImageIndex]
            ])}>
                {isEnglish ? 'Add to Bin' : 'اضافة الى السلة'}
                <Svgs name={'delete'}/>
            </div>}

        </div>

        <div id='wishlistDiv' style={{ display: type === 'view' && 'none' }}><Svgs name={'wishlist'} on_click={handleWishList ? handleWishList() : null}/></div>

        {!type_is_video ? <ul style={{ display: (type !== 'landing' && type !== 'view') && 'none' }} className={type === 'landing' ? 'dots landingDots' : 'dots'}>
            {images?.map((obj, index) => (
                <li key={index} onClick={() => {
                    if(selectedImageIndex - index > 0){
                        for (let i = selectedImageIndex; i > index; i--) {
                            prevButtonRef?.current?.click();
                        }
                    } else if(selectedImageIndex - index < 0){
                        for (let i = selectedImageIndex; i < index; i++) {
                            nextButtonRef?.current?.click();
                        }
                    }
                }} id={selectedImageIndex === index ? 'selectedDot' : ''}></li>
            ))}
        </ul> : <ul style={{ display: (type !== 'landing' && type !== 'view') ? 'none' : undefined }} className={type === 'landing' ? 'dots landingDots' : 'dots'}>
            {videos?.map((obj, index) => (
                <li key={index} onClick={() => {
                    if(selectedImageIndex - index > 0){
                        for (let i = selectedImageIndex; i > index; i--) {
                            prevButtonVideoRef?.current?.click();
                        }
                    } else if(selectedImageIndex - index < 0){
                        for (let i = selectedImageIndex; i < index; i++) {
                            nextButtonVideoRef?.current?.click();
                        }
                    }
                }} id={selectedImageIndex === index ? 'selectedDot' : undefined}></li>
            ))}
        </ul>}

    </div>
  )
}

export default ImagesShow;
