import '@styles/components_styles/MapPopup.css';
import GoogleMapPopup from './GoogleMapPopup';
import Svgs from '@utils/Svgs';
import Card from '@components/Card';
import { useContext, useEffect, useState } from 'react';
import { Context } from '@utils/Context';
import PropertiesArray from '@components/PropertiesArray';
import { getNameByLang } from '@utils/Logic';

const MapPopup = ({ isEnglish }) => {

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

        <button id='list-btn' onClick={() => { setIsResultDiv(true); setSelectedProp(null); }}><Svgs name={'list'}/> {isEnglish ? 'Units List' : 'القائمة'}</button>

        <GoogleMapPopup isEnglish={isEnglish} fetching={fetching} setSearchHere={setSearchHereType} setLatitude={setLatitude} setLongitude={setLongitude} 
            isShow={isSearchMap} setIsShow={setIsSearchMap} longitude={longitude || getPropCoordinates().longitude} 
            latitude={latitude || getPropCoordinates().latitude} style={{ height: '100%', maxHeight: '100%' }}
            mapType={'search'} props={properitiesArray} setSelectedProp={setSelectedProp} selectedProp={selectedProp}/>

        <div className='units-div' style={{ display: (!isMobile || isResultDiv) ? undefined : 'none' }}>
        
            {selectedProp && <div className='selected-prop' dir={isEnglish ? 'ltr' : undefined} style={{ marginBottom: !isMobile ? 24 : 0 }}>
                <span className='units-div-header'>
                <h3>{isEnglish ? 'Units details' : 'تفاصيل الوحدة'}</h3>
                <Svgs name={'cross'} on_click={() => setSelectedProp(null)}/>
                </span>
                <Card isEnglish={isEnglish} isVertical item={selectedProp}/>
            </div>}

            <span className='units-div-header' dir={isEnglish ? 'ltr' : undefined}>
                <h3>{isEnglish ? 'Units list on the map' : 'قائمة الوحدات على الخريطة'}</h3>
                {isMobile && <Svgs name={'cross'} on_click={() => setIsResultDiv(false)}/>}
            </span>

            <PropertiesArray isEnglish={isEnglish}
            setFetchingProp={setFetching} fetchingProp={fetching} 
            setPropsArr={setProperitiesArray} cardsPerPage={cardsPerPage}
            propsArr={properitiesArray} latitude={latitude} longitude={longitude}
            type={'search'} isSearchMap/>

        </div>
    
        {selectedProp && isMobile && <div className='units-div selected-prop'
        style={{ margin: 0 }} dir={isEnglish ? 'ltr' : undefined}
        >
          <span className='units-div-header'>
              <h3>{isEnglish ? 'Units details' : 'تفاصيل الوحدة'}</h3>
              <Svgs name={'cross'} on_click={() => setSelectedProp(null)}/>
          </span>
          <Card isEnglish={isEnglish} isVertical item={selectedProp}/>
        </div>}

        {!(isMobile && (selectedProp || isResultDiv)) && <div className='filterHeaderDiv' style={{ zIndex: 400 }}>
          <button onClick={() => setIsFilter(true)}><Svgs name={'filter'}/>{getNameByLang('تصفية', isEnglish)}</button>
          <span />
          <button id='secondFilterHeaderDivBtn' onClick={() => setIsArrange(true)}><Svgs name={'filter'}/>{getNameByLang('ترتيب', isEnglish)}</button>
        </div>}
        
    </div>

  )
};

export default MapPopup;
