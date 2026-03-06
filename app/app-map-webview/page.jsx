'use client';

import '@styles/components_styles/MapPopup.scss';
import Svgs from '@utils/Svgs';
import Card from '@components/Card';
import { Suspense, useContext, useEffect, useState } from 'react';
import { Context } from '@utils/Context';
import PropertiesArray from '@components/PropertiesArray';
import { getNameByLang } from '@utils/Logic';
import GoogleMapPopup from '@components/popups/GoogleMapPopup';
import { useSearchParams } from 'next/navigation';


const Page = () => {

    const searchParams = useSearchParams();

    // Get the value (returns a string: "false")
    const isEnglishParam = searchParams.get('isEnglish');

    // Convert to actual boolean
    const isEnglish = isEnglishParam !== 'false';
    
    const [properitiesArray, setProperitiesArray] = useState([]);
    const [selectedProp, setSelectedProp] = useState(null);
    const [searchHereType, setSearchHereType] = useState(false);
    const [isResultDiv, setIsResultDiv] = useState(false);
    
    const [fetching, setFetching] = useState(false);
    const cardsPerPage = 120;

    const { 
        rangeValue, city, setCity, catagory, 
        ratingScore, triggerFetch, searchText, 
        arrangeValue, calendarDoubleValue, setTriggerFetch,
        isCalendarValue, setCalendarDoubleValue, categoryArray,
        setIsModalOpened, setLatitude, setLongitude, longitude, latitude,
        isSearchMap, setIsSearchMap, isMobile, setIsFilter, setIsArrange,
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

    const settingPreventScroll = () => {
        if(isSearchMap || isResultDiv) 
          return setIsModalOpened(true);
        setIsModalOpened(false);
    };

    useEffect(() => {
        settingPreventScroll();
    }, [isSearchMap, isResultDiv]);

    useEffect(() => {
        if(searchHereType) {
            setTriggerFetch(!triggerFetch);
            console.log('search here: ', searchHereType);
            setSearchHereType(false);
        }
    }, [searchHereType]);

    useEffect(() => {
      setSearchHereType(false);
      setFetching(false);
    }, [properitiesArray]);

  return (

    <div className='map-div' dir='rtl' style={{ display: !isSearchMap ? 'none' : undefined, height: isMobile ? 'calc(100dvh + 10px)' : undefined }}>


        <GoogleMapPopup isEnglish={isEnglish} fetching={null} setSearchHere={setSearchHereType} setLatitude={setLatitude} setLongitude={setLongitude} 
            isShow={isSearchMap} setIsShow={setIsSearchMap} longitude={longitude || getPropCoordinates().longitude} 
            latitude={latitude || getPropCoordinates().latitude} style={{ height: '100%', maxHeight: '100%' }}
            mapType={'search'} props={properitiesArray} setSelectedProp={setSelectedProp} selectedProp={selectedProp}/>
        
    </div>

  )
};

const SuspenseWrapper = () => (
	<Suspense>
		<Page />
	</Suspense>
);

export default SuspenseWrapper;