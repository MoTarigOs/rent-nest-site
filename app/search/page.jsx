'use client';

import Svgs from '@utils/Svgs';
import './Search.css';
import Image from 'next/image';
import MapGif from '@assets/icons/map.gif';
import Card from '@components/Card';
import GoogleMapPopup from '@components/popups/GoogleMapPopup';
import { useContext, useEffect, useState } from 'react';
import { getLocation, getProperties } from '@utils/api';
import { maximumPrice, minimumPrice } from '@utils/Data';
import { arrangeArray, getNameByLang, getReadableDate, isOkayBookDays } from '@utils/Logic';
import { Context } from '@utils/Context';
import MySkeleton from '@components/MySkeleton';
import NotFound from '@components/NotFound';
import MyCalendar from '@components/MyCalendar';

const page = () => {

  const [properitiesArray, setProperitiesArray] = useState([]);
  const [isCalendar, setIsCalendar] = useState(false);
  const [selectedProp, setSelectedProp] = useState(null);
  const [runOnce, setRunOnce] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [indexSlide, setIndexSlide] = useState(0);
  const [pagesNumber, setPagesNumber] = useState(1);
  const [skipable, setSkipable] = useState(false);
  const [skip, setSkip] = useState(0);
  const cardsPerPage = 16;

  const { 
      currentMinPrice, currentMaxPrice, city, catagory, 
      ratingScore, triggerFetch, searchText, 
      arrangeValue, setCatagory, calendarDoubleValue, 
      isCalendarValue, setCalendarDoubleValue
  } = useContext(Context);

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
              city.value, null, catagory, 
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
            setSkipable(true)
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

          console.log('arr: ', (isCalendarValue && calendarDoubleValue), arr);

          setFetching(false);

          if(isCalendarValue && skip === 0 && res.dt.length === 300 && arr.length <= 50)
              setSkip(skip + 1);

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

  const getPropCoordinates = () => {
    for (let i = 0; i < properitiesArray.length; i++) {
      const element = properitiesArray[i];
      if(element?.map_coordinates?.at(0) && element?.map_coordinates?.at(1)){
        return { 
          longitude: element?.map_coordinates?.at(0), 
          latitude: element?.map_coordinates?.at(1) 
        };
      }
    }
    return { longitude: null, latitude: null };
  };

  useEffect(() => {
    if(catagory === ''){
      setRunOnce(true);
    } else {
      setCatagory('');
    }
  }, []);

  useEffect(() => {
    if(runOnce) setCatagory('');
  }, [runOnce]);

  useEffect(() => {
    if(currentPage > pagesNumber) setCurrentPage(pagesNumber);
    if(currentPage < 1) setCurrentPage(1);
    setIndexSlide((currentPage - 1) * cardsPerPage);
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
      setProperitiesArray(arrangeArray(arrangeValue.toString(), properitiesArray));
  }, [arrangeValue]);

  useEffect(() => {
    settingPropertiesArray();
  }, [calendarDoubleValue]);

  useEffect(() => {
    if(!runOnce && catagory === ''){
      setRunOnce(true);
    }
  }, [catagory]);

  useEffect(() => {
      console.log(skip);
      if(runOnce) settingPropertiesArray();
  }, [skip]);

  return (
    <div className='search'>

        <div className='searchByMap'>

          <h2>البحث عن طريق الخريطة</h2>

          <Image src={MapGif} alt='search by map gif'/>

        </div>

        <span id="close-popups" style={{ display: isCalendar ? null : 'none'}}
            onClick={() => setIsCalendar(false)}/>

        <div className='book-date'>

            <div className='calendar-div' style={{ display: !isCalendar ? 'none' : null }}>
                <MyCalendar type={'mobile-filter'} setCalender={setCalendarDoubleValue}/>
            </div>

            <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
            {getNameByLang('تاريخ الحجز', false)}
            <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(0), true, false)}</h3>
            </div>

            <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
            {getNameByLang('تاريخ انتهاء الحجز', false)}
            <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(1), true, false)}</h3>
            </div>

        </div>

        <div className='map-div'>

          <Card item={selectedProp}/>

          <GoogleMapPopup isShow={true} longitude={getPropCoordinates().longitude} 
              latitude={getPropCoordinates().latitude}
              mapType={'search'} props={properitiesArray} setSelectedProp={setSelectedProp}/>

        </div>

        <h2 id='all-results'>كل النتائج</h2>

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

        <button id="moreResult" style={{
             display: (currentPage === pagesNumber && skipable) ? 'block' : 'none'
        }} onClick={() => setSkip(skip + 1)}>تحميل المزيد من المعروضات</button>

    </div>
  )
}

export default page;
