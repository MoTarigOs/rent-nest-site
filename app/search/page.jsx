'use client';

import './Search.scss';
import { useContext, useEffect, useState } from 'react';
import { JordanCities } from '@utils/Data';
import { Context } from '@utils/Context';
import PropertiesArray from '@components/PropertiesArray';
import MapPopup from '@components/popups/MapPopup';
import { getUserLocation } from '@utils/ServerComponents';
import PageFilterHeader from '@components/PageFilterHeader';

const page = () => {

  const [runOnce, setRunOnce] = useState(false);
  const cardsPerPage = 12;

  const { 
      city, catagory, setLatitude, 
      setLongitude, longitude, latitude,
      isSearchMap
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

        <PageFilterHeader isSearch/>

        <MapPopup />

        <PropertiesArray isHide={isSearchMap} cardsPerPage={cardsPerPage} 
        type={'search'} isSearchMap={isSearchMap}
         longitude={longitude} latitude={latitude} dontFetchWithHide />

    </div>
  )
}

export default page;
