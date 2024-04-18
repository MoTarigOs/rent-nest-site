'use client'

import '../../properties/Properties.css';
import Card from "@components/Card";
import Svgs from "@utils/Svgs";
import { useContext, useEffect, useState } from "react";
import { Context } from "@utils/Context";
import { getLocation, getProperties } from "@utils/api";
import { maximumPrice, minimumPrice } from "@utils/Data";
import { arrangeArray, getNameByLang, getReadableDate } from "@utils/Logic";
import MySkeleton from "@components/MySkeleton";
import NotFound from "@components/NotFound";
import MyCalendar from "@components/MyCalendar";

const page = () => {

    const [runOnce, setRunOnce] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [isCalendar, setIsCalendar] = useState(false);
    const [properitiesArray, setProperitiesArray] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [indexSlide, setIndexSlide] = useState(0);
    const [pagesNumber, setPagesNumber] = useState(1);
    const [skipable, setSkipable] = useState(false);
    const [skip, setSkip] = useState(0);
    const cardsPerPage = 24;

    const { 
        currentMinPrice, currentMaxPrice, city, catagory, 
        ratingScore, triggerFetch, searchText, 
        arrangeValue, calendarDoubleValue, 
        isCalendarValue, setCalendarDoubleValue
    } = useContext(Context);

    const handleArrowPagesNav = (isPrev) => {
        if(isPrev){
            if(currentPage > 1) setCurrentPage(currentPage - 1);
        } else {
            if(currentPage < pagesNumber) setCurrentPage(currentPage + 1);
        }
    };

    const settingPropertiesArray = async() => {

        if(fetching) return;

        try {

            setFetching(true);

            let addressLong, addressLat;

            if(arrangeValue === 'address'){
                const loc = await getLocation();
                addressLong = loc.long;
                addressLat = loc.lat;
            };
            
            const res = await getProperties(
                city.value, true, catagory, 
                (currentMinPrice !== minimumPrice || currentMaxPrice !== maximumPrice) 
                    ? `${currentMinPrice},${currentMaxPrice}` : null,
                ratingScore, searchText, arrangeValue, addressLong, addressLat, skip    
            );

            if(res.success !== true) {
                setProperitiesArray([]);
                setSkipable(false);
                setFetching(false);
                return;
            };

            if(res?.dt?.length > 300){
                setSkipable(true);
            } else {
                setSkipable(false);
            }

            let arr = [];

            if(isCalendarValue && calendarDoubleValue){
                for (let i = 0; i < res.dt.length; i++) {
                    if(isOkayBookDays(calendarDoubleValue, res.dt?.at(i)?.booked_days))
                        arr.push(res.dt[i]);
                }
            };

            if(skip > 0){
                setProperitiesArray([...properitiesArray, ...((isCalendarValue && calendarDoubleValue) ? arr : res.dt)]);
            } else { 
                setProperitiesArray(((isCalendarValue && calendarDoubleValue) ? arr : res.dt));
            }

            setFetching(false);

            if(isCalendarValue && skip === 0 && res.dt.length === 300 && arr.length <= 50)
                setSkip(skip + 1);

        } catch (err) {
            console.log(err);
            setFetching(false);
        }
    };

    useEffect(() => {
        setRunOnce(true);
    }, []);

    useEffect(() => {
        if(runOnce) settingPropertiesArray();
    }, [runOnce]);

    useEffect(() => {
        if(currentPage > pagesNumber) setCurrentPage(pagesNumber);
        if(currentPage < 1) setCurrentPage(1);
        setIndexSlide((currentPage - 1) * cardsPerPage);
        window.scrollTo({
            top: 0, behavior: 'smooth'
        })
    }, [currentPage]);

    useEffect(() => {
        if(properitiesArray.length > cardsPerPage){
            setPagesNumber(Math.ceil(properitiesArray.length / cardsPerPage));
        };
    }, [properitiesArray]);

    useEffect(() => {
        if(runOnce) settingPropertiesArray();
    }, [triggerFetch]);

    useEffect(() => {
        if(runOnce) setProperitiesArray(arrangeArray(arrangeValue.toString(), properitiesArray));
    }, [arrangeValue]);

    useEffect(() => {
        console.log(skip);
        if(runOnce) settingPropertiesArray();
    }, [skip]);
    
  return (
    <div className="properitiesPage" dir='ltr'>

        <span id="close-popups" style={{ display: isCalendar ? null : 'none'}}
            onClick={() => setIsCalendar(false)}/>

        <div className='book-date'>

            <div className='calendar-div' style={{ display: !isCalendar ? 'none' : null }}>
                <MyCalendar type={'mobile-filter'} setCalender={setCalendarDoubleValue}/>
            </div>

            <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
            {getNameByLang('تاريخ الحجز', true)}
            <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(0), true, true)}</h3>
            </div>

            <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
            {getNameByLang('تاريخ انتهاء الحجز', true)}
            <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(1), true, true)}</h3>
            </div>

        </div>

        {properitiesArray?.length > 0 ? <ul className="resultUL">
            {properitiesArray.slice(indexSlide, indexSlide + cardsPerPage).map((item) => (
                <Card key={item._id} item={item} isEnglish/>
            ))}
        </ul> : fetching ? <MySkeleton loadingType={'cards'}/> : <NotFound isEnglish/>}

        <div className="pagesHandler">

          <h4>Results</h4>

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

          <div id="rotate-it-next" onClick={() => handleArrowPagesNav(false)}><Svgs name={'dropdown arrow'}/></div>

        </div>
        
        <button id="moreProperties" style={{
             display: (currentPage === pagesNumber && skipable) ? 'block' : 'none'
        }} onClick={() => setSkip(skip + 1)}>Load more</button>

    </div>
  )
}

export default page
