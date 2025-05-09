'use client';

import '@styles/components_styles/ImagesShow.scss';
import dynamic from 'next/dynamic';
import Image from 'next/image';
const Svgs = dynamic(() => import('@utils/Svgs'));
import { useEffect, useRef, useState } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import EmbeddedVideo from './EmbeddedVideo';

const ImagesShow = ({ 
    isEnglish, images, videos, isAdmin, setFilesToDeleteAdmin, 
    filesToDeleteAdmin,
    handleWishList, isFaved,
    type, type_is_video, 
    setImageFullScreen, useHooks
}) => {

    let [intervalId, setIntervalId] = useState(null);
    let swiper = null;
    const scrollDivRef = useRef(null);
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);
    const prevButtonVideoRef = useRef(null);
    const nextButtonVideoRef = useRef(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [triggerScroll, setTriggerScroll] = useState(false);

    if(!isAdmin && useHooks){
        
        useEffect(() => {
            swiper = type === 'card' ? null : new Swiper('.swiper-images-show', {
                // Optional parameters
                direction: "horizontal",
                loop: false,
                slidesPerView: 1,
                
                // Navigation arrows
                navigation: {
                    nextEl: !isEnglish ? ".leftArrow" : ".rightArrow",
                    prevEl: !isEnglish ? ".rightArrow" : ".leftArrow",
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
            const tick = () => {
                if(swiper){
                    if(swiper?.activeIndex >= images.length - 1){
                        swiper?.slideTo(0);
                        setSelectedImageIndex(0);
                    } else {
                        swiper?.slideTo(swiper.activeIndex + 1);
                    }
                }
            }
            if(type === 'landing') {
                const id = setInterval(tick, 3000);
                setIntervalId(id);
                return () => clearInterval(id);
            }
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

        useEffect(() => {
            if(type === 'card'){
                scrollDivRef.current.scrollTo({
                    top: 0,
                    left: cardImages[selectedImageIndex]?.ref?.current?.offsetLeft,
                    behavior: 'smooth'
                })
            }
        }, [triggerScroll]);

        useEffect(() => {
            if(type === 'card') 
                scrollDivRef?.current.addEventListener('scroll', setIndexFromDefaultScroll);
        }, [scrollDivRef?.current]);
    }

    let cardImages = [];

    if(type === 'card' && !isAdmin && useHooks){
        images.forEach((_, i) => {
            cardImages.push({ ref: useRef(null), url: images[i] });
        });
    }

    const getImagesArray = () => {
        if(type === 'card' && !isAdmin && useHooks){
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

    const setIndexFromDefaultScroll = () => {
        const scrollOffset = scrollDivRef.current.scrollLeft;
        const offsetWidth = scrollDivRef.current.offsetWidth;
        let ppo = Math.round(scrollOffset / offsetWidth);
        setSelectedImageIndex(ppo * -1);
        console.log('scroll: ', scrollOffset, ' \t\t offsetWidth: ', offsetWidth, ' \t\t ppo: ', ppo);
    };

    const stopAutoScroll = () => { clearInterval(intervalId); setIntervalId(null); };

  return (
    <div className='imagesDiv' dir={isEnglish ? 'ltr' : null} style={{ borderRadius: type === 'landing' ? 0 : undefined }}>

        <div className='swiper-images-show'>

            <div className={`swiper-wrapper ${type === 'card' ? 'cards-images-container' : undefined}`} ref={scrollDivRef}>
            {!type_is_video ? <> {getImagesArray()?.length > 0 ? <>{getImagesArray().map((img, index) => (
                    <motion.div key={index} className={`swiper-slide ${type === 'landing' && index === selectedImageIndex ? 'animate-show-landing-page' : 'animate-hide-landing-page'}`} 
                        ref={img.ref}
                        initial={type === 'landing' ? {
                            scale: 0.96, filter: 'blur(16px)'
                        } : undefined}
                        animate={type === 'landing' ? {
                            scale: index === selectedImageIndex ? 1 : 0.96,
                            filter: index === selectedImageIndex ? 'blur(0px)' : 'blur(16px)',
                        } : undefined}
                        transition={{
                            type: 'tween', duration: 0.4
                        }}
                    >
                        <Image placeholder={type === 'landing' ? 'blur' : 'empty'} style={{ zIndex: type === 'view' ? 1 : null }} loading={type === 'landing' ? 'eager' : 'lazy'}
                        src={type === 'landing' ? img.image : `${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${(type === 'card' && !isAdmin && useHooks) ? img.url : img}`} 
                        fill={type === 'landing' ? false : true} alt={isEnglish ? 'Image about the offer' : 'صورة عن العرض'}
                        onLoad={() => { if(type === 'landing') img.setState(true) }}/>
                        <div className='images-show-text' style={{ display: type !== 'landing' ? 'none' : undefined , width: '100%' }}>
                            <div className='content-div' style={{ width: '100%' }}>
                                <motion.h2 initial={{ x: '100%' }} animate={{ x: index === selectedImageIndex ? 0 : '100%' }} transition={{ delay: 0.1, type: 'spring', damping: 12 }}>{img.title}</motion.h2>
                                <motion.p initial={{ opacity: 0, x: 0 }} animate={{ opacity: index === selectedImageIndex ? 1 : 0 }} transition={{ delay: 0.3 }}>{img.desc}</motion.p>
                                <motion.div initial={{ opacity: 0, x: 0 }} animate={{ opacity: index === selectedImageIndex ? 1 : 0 }} transition={{ delay: 0.3 }}><Link href={img.btnLink ? img.btnLink + '?city=' + img.btnCity?.value : ''}>{img.btnTitle}</Link></motion.div>
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
                            <EmbeddedVideo isControl isContain url={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${vd}`}/>
                        </div>
                    ))}</> : <>
                        <div className='not-exist'>
                           {isEnglish ? 'No videos found' : 'لا توجد فيديوهات'}
                        </div>
                    </>}
                </>}
            </div>

            {(type === 'landing' && intervalId) && <span id='auto-scroll' onClick={stopAutoScroll}><Svgs name={'pause'}/></span>}

            {(!type_is_video && !isAdmin) ? <>{images?.length > 0 && <>
                <div className={`arrow ${isEnglish ? 'rightArrow' : 'leftArrow'}`} ref={nextButtonRef} onClick={() => {
                    if(type === 'card' && selectedImageIndex < images.length - 1){
                        setSelectedImageIndex(selectedImageIndex + 1);
                        setTriggerScroll(!triggerScroll);
                    }
                }}><Svgs name={'dropdown arrow'}/></div>
                <div className={`arrow ${isEnglish ? 'leftArrow' : 'rightArrow'}`} ref={prevButtonRef} onClick={() => {
                    if(type === 'card' && selectedImageIndex > 0){
                        setSelectedImageIndex(selectedImageIndex - 1);
                        setTriggerScroll(!triggerScroll);
                    }
                }}><Svgs name={'dropdown arrow'}/></div>
            </>}</> : <>{videos?.length > 0 && <>
                <div className='arrow leftArrow' ref={nextButtonVideoRef}><Svgs name={'dropdown arrow'}/></div>
                <div className='arrow rightArrow' ref={prevButtonVideoRef}><Svgs name={'dropdown arrow'}/></div>
            </>}</>}

            {(type === 'view' && !type_is_video) && <div style={{ zIndex: 1000, cursor: 'pointer' }} className='full-screen-svg-div'>
                <Svgs name={'full screen up'} on_click={() => setImageFullScreen(images[selectedImageIndex])}/>
            </div>} 

        </div>

        {/* <div id='wishlistDiv' style={{ zIndex: 10000, cursor: 'pointer' }}>
            <Svgs name={isFaved ? 'wishlist' : 'wishlist'} on_click={handleWishList}/>
            <Svgs name={'share'} on_click={handleWishList}/>
        </div>         */}

        {(!type_is_video && !isAdmin) ? <ul style={{ display: (type !== 'landing' && type !== 'view' && type !== 'card') ? 'none' : undefined }} className={type === 'landing' ? 'dots landingDots' : 'dots'}>
            {images?.map((obj, index) => (
                <li key={index} onClick={() => {
                    if(selectedImageIndex - index > 0){
                        if(type === 'card') {
                            setSelectedImageIndex(selectedImageIndex - (Math.abs(selectedImageIndex - index) * (isEnglish ? -1 : 1)));
                            setTriggerScroll(!triggerScroll);   
                            return;
                        };
                        for (let i = selectedImageIndex; i > index; i--) {
                            prevButtonRef?.current?.click();
                        }
                    } else if(selectedImageIndex - index < 0){
                        if(type === 'card') {
                            setSelectedImageIndex(selectedImageIndex + (Math.abs(selectedImageIndex - index) * (isEnglish ? -1 : 1)) );
                            setTriggerScroll(!triggerScroll);   
                            return;
                        };
                        for (let i = selectedImageIndex; i < index; i++) {
                            nextButtonRef?.current?.click();
                        }
                    }
                    if(type === 'landing') stopAutoScroll();
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
                    if(type === 'landing') stopAutoScroll();
                }} id={selectedImageIndex === index ? 'selectedDot' : undefined}></li>
            ))}
        </ul>}

    </div>
  )
}

export default ImagesShow;
