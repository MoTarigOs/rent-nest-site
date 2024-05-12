'use client';

import Svgs from '@utils/Svgs';
import '../../search/Search.css';
import Image from 'next/image';
import MapGif from '@assets/icons/map.gif';
import Card from '@components/Card';
import GoogleMapPopup from '@components/popups/GoogleMapPopup';
import { useContext, useEffect, useState } from 'react';
import { getLocation, getProperties } from '@utils/api';
import { JordanCities, maximumPrice, minimumPrice } from '@utils/Data';
import { arrangeArray, getArabicNameCatagory, getNameByLang, getReadableDate, isOkayBookDays } from '@utils/Logic';
import { Context } from '@utils/Context';
import MySkeleton from '@components/MySkeleton';
import NotFound from '@components/NotFound';
import MyCalendar from '@components/MyCalendar';
import HeaderPopup from '@components/popups/HeaderPopup';

const page = () => {

  const [properitiesArray, setProperitiesArray] = useState([]);
  const [selectedProp, setSelectedProp] = useState(null);
  const [runOnce, setRunOnce] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [indexSlide, setIndexSlide] = useState(0);
  const [pagesNumber, setPagesNumber] = useState(1);
  const [skipable, setSkipable] = useState(false);
  const [skip, setSkip] = useState(0);
  const [isFilterHeader, setIsFilterHeader] = useState(false);
  const [isCityDiv, setIsCityDiv] = useState(false);
  const [isCalendar, setIsCalendar] = useState(false);
  const [isCategoryDiv, setIsCategoryDiv] = useState(false);
  const [isResultDiv, setIsResultDiv] = useState(false);
  const cardsPerPage = 12;

  const { 
      rangeValue, city, setCity, catagory, 
      ratingScore, triggerFetch, searchText, 
      arrangeValue, setCatagory, calendarDoubleValue, 
      isCalendarValue, setCalendarDoubleValue, categoryArray,
      setIsModalOpened, setLatitude, setLongitude, longitude, latitude,
      isSearchMap, setIsSearchMap, isMobile,
      quickFilter,
      neighbourSearchText,
      unitCode,
      bedroomFilter,
      capacityFilter,
      poolFilter,
      customersTypesFilter,
      companiansFilter,
      bathroomsFilterNum,
      bathroomsCompaniansFilter,
      kitchenFilter
  } = useContext(Context);

  const getMyLoc = async() => {
    const loc = await getLocation();
    setLongitude(city?.long || loc.long || JordanCities[0].long);
    setLatitude(city?.lat || loc.lat || JordanCities[0].lat);
  };

  const settingPropertiesArray = async() => {

    if(fetching) return;

    try {

        setFetching(true);

        const res = await getProperties(
            city.value, null, catagory, rangeValue,
            ratingScore, searchText, isSearchMap ? 'address' : arrangeValue, longitude || JordanCities[0].long, latitude || JordanCities[0].lat, skip,
            quickFilter,
            neighbourSearchText,
            unitCode,
            bedroomFilter,
            capacityFilter,
            poolFilter,
            customersTypesFilter,
            companiansFilter,
            bathroomsFilterNum,
            bathroomsCompaniansFilter,
            kitchenFilter,
            categoryArray
        );

        if(res.success !== true) {
            setProperitiesArray([]);
            setSkipable(false);
            setFetching(false);
            console.log(res.dt);
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

  const getSelectedCategories = (array) => {
    let str = '';
    array.forEach((element, index) => {
      str += element.value + (index >= array.length - 1 ? '' : ', ');
    });
    return str?.length > 0 ? str : ('الكل');
  };

  const settingPreventScroll = () => {
    if(isCityDiv || isCategoryDiv || isCalendar || isSearchMap || isResultDiv) 
      return setIsModalOpened(true);
    setIsModalOpened(false);
  };

  const handleWishList = async() => {
  };

  useEffect(() => {
      setRunOnce(true);
  }, []);

  useEffect(() => {
    if(runOnce) {
      settingPreventScroll();
      getMyLoc();
      settingPropertiesArray();
    }
  }, [runOnce]);

  useEffect(() => {
    if(currentPage > pagesNumber) setCurrentPage(pagesNumber);
    if(currentPage < 1) setCurrentPage(1);
    setIndexSlide((currentPage - 1) * cardsPerPage);
    window.scrollTo({
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

  useEffect(() => {
      if(runOnce) settingPropertiesArray();
  }, [triggerFetch]);

  useEffect(() => {
    settingPropertiesArray();
  }, [calendarDoubleValue]);

  useEffect(() => {
    if(!runOnce && catagory === ''){
      setRunOnce(true);
    }
  }, [catagory]);

  useEffect(() => {
    settingPreventScroll();
  }, [isCityDiv, isCategoryDiv, isCalendar, isSearchMap, isResultDiv]);

  useEffect(() => {
      if(runOnce) settingPropertiesArray();
  }, [skip]);

  return (
    <div className='search'>

        <span id="close-popups" style={{ display: (isCalendar || isCityDiv || isCategoryDiv) ? null : 'none'}}
          onClick={() => {
            setIsCalendar(false); setIsCityDiv(false); setIsCategoryDiv(false);
          }}/>

        <div className='page-header-filter' dir='ltr' style={{ padding: !isFilterHeader ? '8px 16px' : undefined }}>

            <div className='calendar-div' style={{ display: !isCalendar ? 'none' : null }}>
                <MyCalendar type={'mobile-filter'} setCalender={setCalendarDoubleValue}/>
            </div>

            {isFilterHeader ? <><div className='bookingDate city-header-div'
              onClick={() => setIsCityDiv(true)}>
                City
                <h3>{city?.arabicName || 'Undefined'}</h3>
                {isCityDiv && <HeaderPopup type={'add-city'} isEnglish={true} itemCity={city} setItemCity={setCity}/>}
              </div>

              <div className='bookingDate city-header-div' onClick={() => setIsCategoryDiv(!isCategoryDiv)}>
                Property type
                <h3>{categoryArray?.length > 0 ? getSelectedCategories(categoryArray) : getArabicNameCatagory(catagory, true) || 'All'}</h3>
                {isCategoryDiv && <HeaderPopup type={'catagory'} isEnglish={true}/>}
              </div>

              <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
              {getNameByLang('تاريخ الحجز', true)}
              <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(0), true, true)}</h3>
              </div>

              <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
              {getNameByLang('تاريخ انتهاء الحجز', true)}
              <h3 suppressHydrationWarning>{getReadableDate(calendarDoubleValue?.at(1), true, true)}</h3>
              </div>
              
              <div className='bookingDate' style={{ maxWidth: 40 }} onClick={() => { setIsFilterHeader(false); settingPropertiesArray(); }}>Search</div>

              <div className='bookingDate' onClick={() => setIsFilterHeader(false)}>Cancel</div>
            
            </> : <div className='expand-div disable-text-copy'>
              <div onClick={() => setIsFilterHeader(true)}>
                {city.value || 'Undefined city'} 
                <h3 suppressHydrationWarning>Reservation date {getReadableDate(calendarDoubleValue?.at(0), true, true)} - {getReadableDate(calendarDoubleValue?.at(1), true, true)}</h3>
              </div>
              <Image onClick={() => setIsSearchMap(true)} src={MapGif} />
            </div>}

        </div>

        <div className='map-div' style={{ display: !isSearchMap ? 'none' : undefined, height: isMobile ? '100vh' : undefined }}>

          <button id='list-btn' onClick={() => { setIsResultDiv(true); setSelectedProp(null); }}><Svgs name={'list'}/> List</button>

          <GoogleMapPopup isEnglish searchHere={settingPropertiesArray} setLatitude={setLatitude} setLongitude={setLongitude} 
              isShow={isSearchMap} setIsShow={setIsSearchMap} longitude={longitude || getPropCoordinates().longitude} 
              latitude={latitude || getPropCoordinates().latitude} style={{ height: '100%', maxHeight: '100%' }}
              mapType={'search'} props={properitiesArray} setSelectedProp={setSelectedProp} selectedProp={selectedProp}/>

          {(!isMobile || isResultDiv) && <div className='units-div' dir='ltr'>
            {selectedProp && <div className='selected-prop'>
              <span className='units-div-header'>
                <h3>Unit Details</h3>
                <Svgs name={'cross'} on_click={() => setSelectedProp(null)}/>
              </span>
              <Card isVertical isEnglish item={selectedProp}/>
            </div>}
            <span className='units-div-header'>
              <h3>List of units on the map</h3>
              {isMobile && <Svgs name={'cross'} on_click={() => setIsResultDiv(false)}/>}
            </span>
            {properitiesArray?.length > 0 ? <ul className="resultUL">
            {properitiesArray.slice(indexSlide, indexSlide + cardsPerPage).map((item) => (
                <Card handleWishList={handleWishList} isEnglish={true} isVertical={!isMobile} key={item._id} item={item}/>
            ))}
          </ul> : fetching ? <MySkeleton loadingType={'cards'} styleObj={{ margin: 0, paddingTop: 0 }}/> : <NotFound isEnglish/>}</div>}
        
          {selectedProp && isMobile && <div dir='ltr' className='units-div selected-prop'>
            <span className='units-div-header'>
              <h3>Unit Details</h3>
              <Svgs name={'cross'} on_click={() => setSelectedProp(null)}/>
            </span>
            <Card isVertical isEnglish item={selectedProp}/>
          </div>}
          
        </div>

        {!isSearchMap && ((properitiesArray?.length > 0 && !fetching) ? <ul dir='ltr' className="resultUL">
            {properitiesArray.slice(indexSlide, indexSlide + cardsPerPage).map((item) => (
                <Card key={item._id} item={item} isEnglish={true}/>
            ))}
        </ul> : fetching ? <MySkeleton loadingType={'cards'} styleObj={{ margin: 0, paddingTop: 0 }}/> : <NotFound isEnglish/>)}

        <div className="pagesHandler" dir='ltr'>

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

            <div onClick={() => handleArrowPagesNav(false)}><Svgs name={'dropdown arrow'}/></div>

        </div>

        <button id="moreResult" style={{
             display: (currentPage === pagesNumber && skipable) ? 'block' : 'none'
        }} onClick={() => setSkip(skip + 1)}>Load More</button>

    </div>
  )
}

export default page;
