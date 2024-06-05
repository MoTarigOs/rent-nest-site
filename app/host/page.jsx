'use client';

import Svgs from '@utils/Svgs';
import './Host.css';
import { useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import MySkeleton from '@components/MySkeleton';
import NotFound from '@components/NotFound';
import { getHost, getOwnerProperties } from '@utils/api';
import { useParams, useSearchParams } from 'next/navigation';
import Card from '@components/Card';
import ReviewCard from '@components/ReviewCard';
import { Context } from '@utils/Context';
import { Suspense } from 'react';
import { getReadableDate } from '@utils/Logic';
import Image from 'next/image';

const Page = () => {

    const id = useSearchParams().get('id');

    const [runOnce, setRunOnce] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);
    
    const [fetchingHostDetails, setFetchingHostDetails] = useState(false);
    const [hostObj, setHostObj] = useState(false);
    
    const [isReviews, setIsReviews] = useState(true);
    const [isOffers, setIsOffers] = useState(false);
    const [properitiesArray, setProperitiesArray] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [indexSlide, setIndexSlide] = useState(0);
    const [pagesNumber, setPagesNumber] = useState(1);
    const cardsPerPage = 16;

    const offersRef = useRef(null);
    
    const [isMobile, setIsMobile] = useState(false);

    const fetchHostDetails = async() => {
        
        if(fetchingHostDetails || !id?.length > 10) return;
        
        try {

            setFetchingHostDetails(true);

            const res = await getHost(id);

            if(res?.ok !== true) return setFetchingHostDetails(false);

            setHostObj(res.dt);
            setFetchingHostDetails(false);
            
        } catch (err) {
            console.log(err);
            setFetchingHostDetails(false);
        }
    };

    const settingPropertiesArray = async() => {

        if(fetching) return;

        try {

            setFetching(true);
            
            const res = await getOwnerProperties(id);

            if(res.success !== true || !res.dt?.length > 0) {
                setProperitiesArray([]);
                setSkipable(false);
                setFetching(false);
                return;
            };

            setProperitiesArray(res.dt);

            let reviewsArr = [];
            for (let i = 0; i < res.dt.length; i++) {
                const element = res.dt[i];
                if(element.reviews?.length > 0) {
                    console.log(element);
                    reviewsArr.push(...element.reviews);
                }
            };
            setReviews(reviewsArr);

            // if(res?.dt?.length > 300){
            //     setSkipable(true)
            // } else {
            //     setSkipable(false);
            // }

            // let arr = [];

            // if(isCalendarValue && calendarDoubleValue){
            //     for (let i = 0; i < res.dt.length; i++) {
            //         if(isOkayBookDays(calendarDoubleValue, res.dt?.at(i)?.booked_days))
            //             arr.push(res.dt[i]);
            //     }
            // };

            // if(skip > 0){
            //     setProperitiesArray([...properitiesArray, ...((isCalendarValue && calendarDoubleValue) ? arr : res.dt)]);
            // } else { 
            //     setProperitiesArray(((isCalendarValue && calendarDoubleValue) ? arr : res.dt));
            // }

            // console.log('arr: ', (isCalendarValue && calendarDoubleValue), arr);

            setFetching(false);

            // if(isCalendarValue && skip === 0 && res.dt.length === 300 && arr.length <= 50)
            //     setSkip(skip + 1);

        } catch (err) {
            console.log(err);
            setFetching(false);
        }
    };

    const handleArrowPagesNav = (isPrev) => {
        if(isPrev){
            if(currentPage > 1) setCurrentPage(currentPage - 1);
        } else {
            if(currentPage < pagesNumber) setCurrentPage(currentPage + 1);
        }
    };

    const settingMobile = () => {
        if(window.innerWidth < 960){
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    useEffect(() => {
        setRunOnce(true);
        window.addEventListener('resize', settingMobile);
        return () => window.removeEventListener('resize', settingMobile);
    }, []);

    useEffect(() => {
        if(runOnce) {
            setLoading(false);
            settingPropertiesArray();
            fetchHostDetails();
        }
    }, [runOnce]);

    useEffect(() => {
        if(currentPage > pagesNumber) setCurrentPage(pagesNumber);
        if(currentPage < 1) setCurrentPage(1);
        setIndexSlide((currentPage - 1) * cardsPerPage);
        offersRef?.current?.scrollTo({
            top: 0, behavior: 'smooth'
        });
    }, [currentPage]);

    useEffect(() => {
        if(properitiesArray.length > cardsPerPage){
            setPagesNumber(Math.ceil(properitiesArray.length / cardsPerPage));
            setCurrentPage(1);
            setIndexSlide(0);
        } else {
            setPagesNumber(1);
            setCurrentPage(1);
            setIndexSlide(0);
        };
    }, [properitiesArray]);

    if(!hostObj) return (fetching || loading) ? <MySkeleton isMobileHeader/> : <NotFound />  

  return (
    <div className='host'>
        
        <span id='background-host-image'><Image height={360} width={1200} src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${properitiesArray?.at(4)?.images?.at(0)}`}/></span>

        <div className='host-intro'>
            <div className='image-span'><span className='disable-text-copy'>{hostObj?.username?.at(0)}</span></div>
            <h1>{hostObj?.firstName || hostObj?.lastName || hostObj?.username}</h1>
            <div className='host-details'>
                <h4><Svgs name={'star'}/> تقييم {hostObj?.rating || 0} {`(من ${hostObj?.reviewsNum || 0} مراجعة)`}</h4>
                <h4><Svgs name={'host'}/> مضيف منذ {getReadableDate(new Date(hostObj?.joinDate), true)}</h4>
                <h4><Svgs name={'apartment'}/> عدد الوحدات {hostObj?.units || 0} وحدة</h4>
            </div>
        </div>

        <span id='hr'/>

        <ul className='tabButtons'>
            <li className={isReviews && 'selectedTab'} onClick={() => { setIsOffers(false); setIsReviews(true); }}>التقييمات</li>
            <li className={isOffers && 'selectedTab'} onClick={() => { setIsOffers(true); setIsReviews(false); }}>المعروضات</li>
        </ul>

        <div className='reviews' style={{ display: (isMobile && !isReviews) ? 'none' : undefined }}>
            <h3 id='advertiser'>تقييمات الزبائن</h3>
            <ul>
                {reviews.slice(0, 8).map((rv) => (
                    <ReviewCard isHost item={rv}/>
                ))}
            </ul>
        </div>

        <span id='hr'/>

        <div ref={offersRef} className='units' style={{ display: (isMobile && !isOffers) ? 'none' : undefined }}>

            <h3 id='advertiser'>المعروضات</h3>

            {properitiesArray?.length > 0 ? <ul className="resultUL">
                {properitiesArray.slice(indexSlide, indexSlide + cardsPerPage).map((item) => (
                    <Card key={item._id} item={item}/>
                ))}
            </ul> : fetching ? <MySkeleton loadingType={'cards'}/> : <NotFound />}

            <div className="pagesHandler">

                <h4>النتائج</h4>

                <div  onClick={() => handleArrowPagesNav(true)}><Svgs name={'dropdown arrow'}/></div>

                {currentPage < 5 ? <><span onClick={() => setCurrentPage(1)} className={`pageNum ${currentPage === 1 && 'selectedPage'}`}>1</span>
                
                {pagesNumber >= 2 && <span onClick={() => setCurrentPage(2)} className={`pageNum ${currentPage === 2 && 'selectedPage'}`}>2</span>}

                {pagesNumber >= 3 && <span onClick={() => setCurrentPage(3)} className={`pageNum ${currentPage === 3 && 'selectedPage'}`}>3</span>}

                {pagesNumber >= 4 && <span onClick={() => setCurrentPage(4)} className={`pageNum ${currentPage === 4 && 'selectedPage'}`}>4</span>}

                {pagesNumber >= 5 && <span onClick={() => setCurrentPage(5)} className={`pageNum ${currentPage === 5 && 'selectedPage'}`}>5</span>}

                {pagesNumber > 5 && <>
                    <span className="dotsBetweenPages">...</span>
                    <span onClick={() => setCurrentPage(pagesNumber)} className={`pageNum ${currentPage === pagesNumber && 'selectedPage'}`}>{pagesNumber}</span>
                </>}
                </>

                : (currentPage < pagesNumber - 2 ? <><span onClick={() => setCurrentPage(1)} className={`pageNum ${currentPage === 1 && 'selectedPage'}`}>1</span>
                
                    <span className="dotsBetweenPages">...</span>

                    <span onClick={() => setCurrentPage(currentPage - 1)} className="pageNum">{currentPage - 1}</span>

                    <span className="pageNum selectedPage">{currentPage}</span>

                    <span onClick={() => setCurrentPage(currentPage + 1)} className="pageNum">{currentPage + 1}</span>

                    <span className="dotsBetweenPages">...</span>

                    <span onClick={() => setCurrentPage(pagesNumber)} className={`pageNum ${currentPage === pagesNumber && 'selectedPage'}`}>{pagesNumber}</span></> 
                    
                    : <><span onClick={() => setCurrentPage(1)} className={`pageNum ${currentPage === 1 && 'selectedPage'}`}>1</span>
                    
                        <span className="dotsBetweenPages">...</span>

                        <span onClick={() => setCurrentPage(pagesNumber - 3)} className={`pageNum ${currentPage === pagesNumber - 3 && 'selectedPage'}`}>{pagesNumber - 3}</span>

                        <span onClick={() => setCurrentPage(pagesNumber - 2)} className={`pageNum ${currentPage === pagesNumber - 2 && 'selectedPage'}`}>{pagesNumber - 2}</span>

                        <span onClick={() => setCurrentPage(pagesNumber - 1)} className={`pageNum ${currentPage === pagesNumber - 1 && 'selectedPage'}`}>{pagesNumber - 1}</span>

                        <span onClick={() => setCurrentPage(pagesNumber)} className={`pageNum ${currentPage === pagesNumber && 'selectedPage'}`}>{pagesNumber}</span></>)
                        
                }

                <div onClick={() => handleArrowPagesNav(false)}><Svgs name={'dropdown arrow'}/></div>

            </div>

        </div>

    </div>
  )
};

const SuspenseWrapper = () => (
	<Suspense>
		<Page />
	</Suspense>
);

export default SuspenseWrapper;
