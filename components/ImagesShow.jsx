'use client';

import '@styles/components_styles/ImagesShow.css';
import dynamic from 'next/dynamic';
import Image from 'next/image';
const Svgs = dynamic(() => import('@utils/Svgs'));
import { useEffect, useRef, useState } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useInterval from '@hooks/useInterval';

const ImagesShow = ({ 
    isEnglish, images, videos, isAdmin, setFilesToDeleteAdmin, 
    filesToDeleteAdmin,
    handleWishList, type, type_is_video, 
    setImageFullScreen
}) => {

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    let isAutoScroll = true;
    let swiper = null;
    const scrollDivRef = useRef(null);
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);
    const prevButtonVideoRef = useRef(null);
    const nextButtonVideoRef = useRef(null);
    let cardImages = [];

    if(type === 'card'){
        images.forEach((_, i) => {
            cardImages.push({ ref: useRef(null), url: images[i] });
        });
    }

    const getImagesArray = () => {
        if(type === 'card'){
            return cardImages;
        } else {
            return images;
        }
    }

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
        swiper = type === 'card' ? null : new Swiper('.swiper-images-show', {
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
        if(type === 'landing'){
            const tick = () => {
                if(isAutoScroll && swiper){
                    console.log('index: ', selectedImageIndex, ' activeIndex: ', swiper?.activeIndex, ' length: ', images.length);
                    if(swiper?.activeIndex >= images.length - 1){
                        swiper?.slideTo(0);
                        setSelectedImageIndex(0);
                    } else {
                        nextButtonRef?.current?.click();
                    }
                }
            }
            const id = setInterval(tick, 3000);
            return () => clearInterval(id);
        }
    }, []);

    const settingIsAutoScroll = (isAuto) => {
        isAutoScroll = isAuto; console.log('down: ', isAuto);
    }

    useEffect(() => {

    }, [isAutoScroll, swiper]);

    // useEffect(() => {
    //     if(!scrollDivRef) return;
    //     scrollDivRef?.current?.addEventListener('mousedown', settingIsAutoScroll(false));
    //     scrollDivRef?.current?.addEventListener('mouseup', settingIsAutoScroll(true));
    //     return () => {
    //         scrollDivRef?.current?.removeEventListener('mousedown', settingIsAutoScroll(false));
    //         scrollDivRef?.current?.removeEventListener('mouseup', settingIsAutoScroll(true));
    //     }
    // }, [scrollDivRef]);
    
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

    useEffect(() => {
        if(type === 'card'){
            scrollDivRef.current.scrollTo({
                top: 0,
                left: cardImages[selectedImageIndex]?.ref?.current?.offsetLeft,
                behavior: 'smooth'
            })
        }
    }, [selectedImageIndex]);

  return (
    <div className='imagesDiv' dir={isEnglish ? 'ltr' : null} style={{ height: type === 'view' ? 420 : undefined, borderRadius: type === 'landing' ? 0 : undefined }}>

        <div className='swiper-images-show'>
        {/* onMouseDown={() => { if(isAutoScroll) setIsAutoScroll(false) }} onMouseUp={() => { if(!isAutoScroll) setIsAutoScroll(true) }} */}
            <div onMouseEnter={() => settingIsAutoScroll(false)} onMouseLeave={() => settingIsAutoScroll(true)} className={`swiper-wrapper ${type === 'card' ? 'cards-images-container' : undefined}`} ref={scrollDivRef}>
            {!type_is_video ? <> {getImagesArray()?.length ? <>{getImagesArray().map((img, index) => (
                    <motion.div key={index} className={`swiper-slide ${type === 'landing' && index === selectedImageIndex ? 'animate-show-landing-page' : 'animate-hide-landing-page'}`} 
                        ref={img.ref}
                        initial={type === 'landing' ? {
                            scale: 0.96, filter: 'blur(16px)'
                        } : undefined}
                        animate={{
                            scale: type === 'landing' && index === selectedImageIndex ? 1 : 0.96,
                            filter: type === 'landing' && index === selectedImageIndex ? 'blur(0px)' : 'blur(16px)',
                        }}
                        transition={{
                            type: 'tween', duration: 0.4
                        }}
                    >
                        <Image placeholder={type === 'landing' ? 'blur' : 'empty'} style={{ zIndex: type === 'view' ? 1 : null }} loading={type === 'landing' ? 'eager' : 'lazy'}
                        src={type === 'landing' ? img.image : `${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${type === 'card' ? img.url : img}`} 
                        fill={type === 'landing' ? false : true} alt={isEnglish ? 'Image about the offer' : 'صورة عن العرض'}
                        onLoad={() => { if(type === 'landing') img.setState(true) }}/>
                        <div className='images-show-text' style={{ display: type !== 'landing' ? 'none' : undefined , width: '100%' }}>
                            <div className='content-div' style={{ width: '100%' }}>
                                <motion.h2 initial={{ x: '100%' }} animate={{ x: index === selectedImageIndex ? 0 : '100%' }} transition={{ delay: 0.1, type: 'spring', damping: 12 }}>{img.title}</motion.h2>
                                <motion.p initial={{ opacity: 0, x: 0 }} animate={{ opacity: index === selectedImageIndex ? 1 : 0 }} transition={{ delay: 0.3 }}>{img.desc}</motion.p>
                                <motion.div initial={{ opacity: 0, x: 0 }} animate={{ opacity: index === selectedImageIndex ? 1 : 0 }} transition={{ delay: 0.3 }}><Link href={img.btnLink ? img.btnLink : ''}>{img.btnTitle}</Link></motion.div>
                            </div>
                        </div>
                        {(type === 'landing' && img.state) && <span id='landing-item-span'/>}
                    </motion.div>
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
                <div className='arrow leftArrow' ref={nextButtonRef} onClick={() => {
                    if(type === 'card' && selectedImageIndex < images.length - 1){
                        setSelectedImageIndex(selectedImageIndex + 1);
                    }
                }}><Svgs name={'dropdown arrow'}/></div>
                <div className='arrow rightArrow' ref={prevButtonRef} onClick={() => {
                    if(type === 'card' && selectedImageIndex > 0){
                        setSelectedImageIndex(selectedImageIndex - 1);
                    }
                }}><Svgs name={'dropdown arrow'}/></div>
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

        <div id='wishlistDiv' style={{ display: type === 'view' ? 'none' : undefined }}><Svgs name={'wishlist'} on_click={handleWishList ? handleWishList() : null}/></div>

        {!type_is_video ? <ul style={{ display: (type !== 'landing' && type !== 'view' && type !== 'card') && 'none' }} className={type === 'landing' ? 'dots landingDots' : 'dots'}>
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
