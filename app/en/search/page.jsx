'use client';

import '../../search/Search.scss';
import { useContext, useEffect, useState } from 'react';
import { getUserLocation } from '@utils/ServerComponents';
import { JordanCities } from '@utils/Data';
import { Context } from '@utils/Context';
import PropertiesArray from '@components/PropertiesArray';
import MapPopup from '@components/popups/MapPopup';
import PageFilterHeader from '@components/PageFilterHeader';

const page = () => {

  const [runOnce, setRunOnce] = useState(false);
  const cardsPerPage = 12;

  const { 
      rangeValue, city, setCity, catagory, 
      ratingScore, triggerFetch, searchText, setTriggerFetch,
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
    const loc = await getUserLocation();
    setLongitude(city?.long || loc.long || JordanCities[0].long);
    setLatitude(city?.lat || loc.lat || JordanCities[0].lat);
  };

  useEffect(() => {
      setRunOnce(true);
  }, []);

  useEffect(() => {
    if(runOnce) getMyLoc();
  }, [runOnce]);

  useEffect(() => {
    if(!runOnce && catagory === ''){
      setRunOnce(true);
    }
  }, [catagory]);


  return (
    <div className='search'>

        <PageFilterHeader isSearch isEnglish/>

        <MapPopup isEnglish/>

        <PropertiesArray isHide={isSearchMap} cardsPerPage={cardsPerPage} 
        type={'search'} isSearchMap={isSearchMap} isEnglish
         longitude={longitude} latitude={latitude} dontFetchWithHide />

    </div>
  )
}

export default page;
