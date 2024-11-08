'use client';

import '@styles/components_styles/GoogleMapPopup.scss';
import { Autocomplete, Circle, GoogleMap, Marker, OverlayView, OverlayViewF, useJsApiLoader } from "@react-google-maps/api";
import { memo, useContext, useState } from 'react';
import { JordanCities, currencyCode, isInsideJordan } from '@utils/Data';
import Svgs from '@utils/Svgs';
import LoadingCircle from '@components/LoadingCircle';
import { Context } from '@utils/Context';
import { getDetailedResTypeNum, getNumOfBookDays } from '@utils/Logic';

const GoogleMapPopup = ({ 
  isShow, setIsShow, mapType, 
  // latitude, 
  // longitude, setLatitude, setLongitude,
  props, setSelectedProp, style,
  selectedProp, isEnglish, fetching,
  setSearchHere
}) => {

    const AMMAN_LAT = JordanCities[0].lat;
    const AMMAN_LONG = JordanCities[0].long;

    const { 
      latitude, longitude, setLatitude, setLongitude,
      resType, resTypeNum, calendarDoubleValue,
      arabicFont
    } = useContext(Context);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        language: 'ar',
        libraries: ["drawing", "places"]
    });

    const containerStyle = {
        width: '100%',
        height: '100%'
    };
      
    const center = {
        lat: latitude ? latitude : AMMAN_LONG,
        lng: longitude ? longitude : AMMAN_LAT
    };

    const [map, setMap] = useState(null)

    const onLoad = (map) => {
      setMap(map);
    };
  
    const onUnmount = (map) => {
      setMap(null);
    };

    const handleMapClick = (e) => {
      if(mapType !== 'select-point') return;
      const { latLng } = e;
      const eLat = latLng.lat();
      const eLong = latLng.lng();
      if(!isInsideJordan(eLong, eLat)) return;
      setLongitude(eLong);
      setLatitude(eLat);
    };

    const getResType = () => {
      return (!isEnglish ? 'ال' : '') + getDetailedResTypeNum(true, resType, resTypeNum, isEnglish, true)?.split(' ')?.at(1);
    };

    const getPrice = (priceType, item) => {

      const getHoildays = (isExist, item) => {
        let isThursday = false;
        let isFriday = false;
        let isSaturday = false;
        console.log('calenderDoubleValue: ', calendarDoubleValue);
        for (let i = calendarDoubleValue?.at(0)?.getTime() + 86400000; i <= calendarDoubleValue?.at(1)?.getTime(); i += 86400000) {
            const dayNum = (new Date(i)).getDay();
            if(dayNum === 4 && item?.prices?.thursdayPrice > 0) isThursday = true;
            if(dayNum === 5 && item?.prices?.fridayPrice > 0) isFriday = true;
            if(dayNum === 6 && item?.prices?.saturdayPrice > 0) isSaturday = true;
        }
        if(isExist) return isThursday || isFriday || isSaturday || false;
        if(!item?.prices?.daily) return 'سعر غير محدد';
        let pp = resTypeNum * item?.prices?.daily;
        if(isThursday) pp = pp - item?.prices?.daily + item?.prices?.thursdayPrice;
        if(isFriday) pp = pp - item?.prices?.daily + item?.prices?.fridayPrice;
        if(isSaturday) pp = pp - item?.prices?.daily + item?.prices?.saturdayPrice;
        return pp;
      };

      switch(priceType){
  
        case 'main price':
          if(resType?.value?.toLowerCase() === 'daily') return item.prices?.daily || 'سعر غير محدد';
          else if(resType?.value?.toLowerCase() === 'weekly') return item.prices?.weekly || 7 * item.prices?.daily || 'سعر غير محدد';
          else if(resType?.value?.toLowerCase() === 'monthly') return item.prices?.monthly || Math.round(4.285714285 * item.prices?.weekly) || 30 * item.prices?.daily || 'سعر غير محدد';
          else if(resType?.value?.toLowerCase() === 'seasonly') return item.prices?.seasonly || 'سعر غير محدد';
          else if(resType?.value?.toLowerCase() === 'yearly') return item.prices?.yearly || Math.round(12.16666666 * item.prices?.monthly) || Math.round(52.1428571 * item.prices?.weekly) || 365 * item.prices?.daily || 'سعر غير محدد';
          else if(resType?.value?.toLowerCase() === 'events') return item.prices?.eventsPrice || 'سعر غير محدد';
          else return 'سعر غير محدد';
  
        case 'cost price':
          if(resType?.value?.toLowerCase() === 'daily') return getHoildays(false, item);
          else if(resType?.value?.toLowerCase() === 'weekly') return resTypeNum * item.prices?.weekly || resTypeNum * 7 * item.prices?.daily || 'سعر غير محدد';
          else if(resType?.value?.toLowerCase() === 'monthly') return resTypeNum * item.prices?.monthly || resTypeNum * Math.round(4.285714285 * item.prices?.weekly) || resTypeNum * 30 * item.prices?.daily || 'سعر غير محدد';
          else if(resType?.value?.toLowerCase() === 'seasonly') return resTypeNum * item.prices?.seasonly || 'سعر غير محدد';
          else if(resType?.value?.toLowerCase() === 'yearly') return resTypeNum * item.prices?.yearly || resTypeNum * Math.round(12.16666666 * item.prices?.monthly) || resTypeNum * Math.round(52.1428571 * item.prices?.weekly) || resTypeNum * 365 * item.prices?.daily || 'سعر غير محدد';
          else if(resType?.value?.toLowerCase() === 'events') return resTypeNum * item.prices?.eventsPrice || 'سعر غير محدد';
          else return 'سعر غير محدد';
  
        case 'test res type existence':
          if(resType?.value?.toLowerCase() === 'daily' && item.prices?.daily > 0) return true;
          else if(resType?.value?.toLowerCase() === 'weekly' && item.prices?.weekly > 0) return true;
          else if(resType?.value?.toLowerCase() === 'monthly' && item.prices?.monthly > 0) return true;
          else if(resType?.value?.toLowerCase() === 'seasonly' && item.prices?.seasonly > 0) return true;
          else if(resType?.value?.toLowerCase() === 'yearly' && item.prices?.yearly > 0) return true;
          else if(resType?.value?.toLowerCase() === 'events' && item.prices?.eventsPrice > 0) return true;
          else return false;
  
      }
  
    };

    const getRealPrice = (item) => {
      const pr = (getPrice('main price', item) - (item?.discount?.percentage 
            ? ((resType?.id > 0 
                ? resTypeNum : getNumOfBookDays(calendarDoubleValue)) * getPrice('main price', item) * item?.discount.percentage / 100) 
                : 0)).toFixed(2);
       return isNaN(pr) ? '-' : pr;
    };

  return (
    <div className={mapType === 'search' ? "google-map-popup-wrapper search-map" : "google-map-popup-wrapper" }
      style={{...mapType !== 'search' ? { left: isShow ? null : '-200vw' } : style, fontFamily: arabicFont}}
      dir={isEnglish ? 'ltr' : undefined}>

        <span onClick={() => setIsShow(false)}/>

        <div id='cross-close-map' onClick={() => setIsShow(false)}><Svgs name={'cross'}/></div>

        {mapType === 'search' && <button id='more-btn' style={{ background: fetching ? 'var(--darkWhite)' : undefined }} onClick={() => {
          if(isInsideJordan(map?.center?.lng(), map?.center?.lat())) {
            setLatitude(map?.center?.lat());
            setLongitude(map?.center?.lng());
            setSearchHere(true);
          }
        }}>{fetching ? <LoadingCircle isLightBg/> : (isEnglish ? 'Search on this area' : 'البحث في هذه المنطقة')}</button>}

        <div className='google-map-popup' style={mapType === 'search' ? style : undefined}>

            {isLoaded && <GoogleMap
                mapContainerStyle={containerStyle}
                center={{
                  lat: latitude ? (isInsideJordan(longitude, latitude) ? latitude : AMMAN_LAT) : AMMAN_LAT,
                  lng: longitude ? (isInsideJordan(longitude, latitude) ? longitude : AMMAN_LONG) : AMMAN_LONG
                }}
                onLoad={onLoad}
                zoom={12}
                onUnmount={onUnmount}
                onClick={handleMapClick}
                clickableIcons={(mapType === 'search' || mapType === 'select-point') ? false : true}
            >

                <Autocomplete
                  onLoad={(autocomplete) => {
                    autocomplete.addListener('place_changed', () => {
                      const selectedPlace = autocomplete.getPlace();
                      handlePlaceSelect(selectedPlace);
                    });
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search for an address"
                    style={{
                      boxSizing: 'border-box',
                      border: '1px solid transparent',
                      width: '240px',
                      height: '32px',
                      padding: '0 12px',
                      borderRadius: '3px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                      fontSize: '14px',
                      outline: 'none',
                      textOverflow: 'ellipses',
                    }}/>
                </Autocomplete>

                <Marker visible={mapType === 'select-point' ? true : false}
                  position={{ 
                    lat: latitude ? latitude : AMMAN_LAT, 
                    lng: longitude ? longitude : AMMAN_LONG 
                  }}/>
                
                <Circle center={{ 
                  lat: latitude ? latitude : AMMAN_LAT,
                  lng: longitude ? longitude : AMMAN_LONG
                }} radius={500} options={{
                  strokeColor: '#00000000', // Red outline
                  fillColor: '#ff0000', // Red fill
                  fillOpacity: 0.3, // Opacity (0 to 1)
                }} visible={mapType === 'view' ? true : false}/>

                                                  
                <Circle center={{ 
                    lat: 32.03442699083755120,
                    lng: 35.713704416849
                  }} radius={200} options={{
                    strokeColor: '#000000', // Red outline
                    fillColor: '#ff0000', // Red fill
                    fillOpacity: 0.3, // Opacity (0 to 1)
                  }} visible={true}/>

                {props?.length > 0 && props.map((item) => (<OverlayViewF
                  position={{
                    lat: item?.map_coordinates?.at(1), lng: item?.map_coordinates?.at(0)
                  }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <div dir={isEnglish ? 'ltr' : undefined} onClick={() => {
                    setLatitude(item?.map_coordinates?.at(1));
                    setLongitude(item?.map_coordinates?.at(0));
                    setSelectedProp(item);
                  }} className={'custom-marker'} style={{ 
                    borderRadius: 24,
                    display: !item ? 'none' : null, 
                    background: selectedProp === item ? 'var(--secondColor)' : undefined,
                    color: selectedProp === item ? 'white' : undefined,
                    zIndex: selectedProp === item ? 10 : undefined
                  }}>
                    {isEnglish ? `${getRealPrice(item)} ${currencyCode(true)} / ${getResType()}` : `${getRealPrice(item)} ${currencyCode(false)} / ${getResType()}`}
                    {item?.discount?.percentage > 0 && <div id='discount-div'>{isEnglish ? 'Discount' : 'تخفيض'}</div>}
                  </div>
                </OverlayViewF>))}

            </GoogleMap>}

        </div>
      
    </div>
  )
};

export default memo(GoogleMapPopup);
