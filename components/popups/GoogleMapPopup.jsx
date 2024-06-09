'use client';

import '@styles/components_styles/GoogleMapPopup.scss';
import { Autocomplete, Circle, GoogleMap, Marker, OverlayView, OverlayViewF, useJsApiLoader } from "@react-google-maps/api";
import { memo, useContext, useState } from 'react';
import { JordanCities, isInsideJordan } from '@utils/Data';
import Svgs from '@utils/Svgs';
import LoadingCircle from '@components/LoadingCircle';
import { Context } from '@utils/Context';

const GoogleMapPopup = ({ 
  isShow, setIsShow, mapType, 
  // latitude, 
  // longitude, setLatitude, setLongitude,
  props, setSelectedProp, style,
  selectedProp, isEnglish, fetching,
  setSearchHere
}) => {

    const AMMAN_LAT = JordanCities[5].lat;
    const AMMAN_LONG = JordanCities[5].long;

    const { 
      latitude, longitude, setLatitude, setLongitude 
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

  return (
    <div className={mapType === 'search' ? "google-map-popup-wrapper search-map" : "google-map-popup-wrapper" }
      style={mapType !== 'search' ? { left: isShow ? null : '-200vw' } : style}
      dir={isEnglish ? 'ltr' : undefined}>

        <span onClick={() => setIsShow(false)}/>

        <div id='cross-close-map' onClick={() => setIsShow(false)}><Svgs name={'cross'}/></div>

        {mapType === 'search' && <button id='more-btn' style={{ background: fetching ? 'var(--darkWhite)' : undefined }} onClick={() => {
          setLatitude(map?.center?.lat());
          setLongitude(map?.center?.lng());
          setSearchHere(true);
        }}>{fetching ? <LoadingCircle isLightBg/> : (isEnglish ? 'Search on this area' : 'البحث في هذه المنطقة')}</button>}

        <div className='google-map-popup' style={mapType === 'search' ? style : undefined}>

            {isLoaded && <GoogleMap
                mapContainerStyle={containerStyle}
                center={{
                  lat: latitude || AMMAN_LONG,
                  lng: longitude || AMMAN_LAT
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
                    {isEnglish ? `$${item.price} per Night` : `${item.price} دولار / الليلة`}
                  </div>
                </OverlayViewF>))}

            </GoogleMap>}

        </div>
      
    </div>
  )
};

export default memo(GoogleMapPopup);
