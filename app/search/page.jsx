'use client';

import './Search.scss';
import { Suspense, useContext, useEffect, useState } from 'react';
import { JordanCities, homePageCatagories } from '@utils/Data';
import { Context } from '@utils/Context';
import PropertiesArray from '@components/PropertiesArray';
import MapPopup from '@components/popups/MapPopup';
import { getUserLocation } from '@utils/ServerComponents';
import PageFilterHeader from '@components/PageFilterHeader';
import { useSearchParams } from 'next/navigation';

const Page = () => {

  const queryCity = useSearchParams().get('city');
  const hmctg_id = useSearchParams().get('hmctg_id');
  const [runOnce, setRunOnce] = useState(false);
  const cardsPerPage = 12;

  const { 
      city, catagory, setLatitude, 
      setLongitude, longitude, latitude,
      isSearchMap, setCity
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

  useEffect(() => {
    const cc = JordanCities.find(c=>c.value === queryCity);
    if(cc) setCity(cc);
  }, [queryCity]);

  return (
    <div className='search'>

        <PageFilterHeader isSearch/>

        <MapPopup />

        {hmctg_id?.length > 0 && !isSearchMap && <div className='homectg'>
          <h2>{homePageCatagories()?.find(c=>c.id === Number(hmctg_id))?.txt} - مدينة {homePageCatagories()?.find(c=>c.id === Number(hmctg_id))?.city?.arabicName}</h2>
        </div>}

        <PropertiesArray isHide={isSearchMap} cardsPerPage={cardsPerPage} 
        type={'search'} isSearchMap={isSearchMap}
        longitude={longitude} latitude={latitude} dontFetchWithHide />

    </div>
  )
}

const SuspenseWrapper = () => (
	<Suspense>
		<Page />
	</Suspense>
);

export default SuspenseWrapper;