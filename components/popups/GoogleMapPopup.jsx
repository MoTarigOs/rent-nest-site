'use client';

import '@styles/components_styles/GoogleMapPopup.css';
import { Autocomplete, Circle, GoogleMap, Marker, OverlayView, OverlayViewF, StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import { memo, useEffect, useState } from 'react';
import { JordanCities, getCategoryImage, isInsideJordan } from '@utils/Data';
import Image from 'next/image';
import MarkerVehicleImage from '@assets/icons/car-inbound.svg';
import MarkerPropImage from '@assets/icons/house.svg';
import Svgs from '@utils/Svgs';
import { getArabicNameCatagory } from '@utils/Logic';

const GoogleMapPopup = ({ 
  isShow, setIsShow, mapType, latitude, 
  longitude, setLatitude, setLongitude,
  props, setSelectedProp, style, searchHere,
  selectedProp
}) => {

    const [triggerSearch, setTriggerSearch] = useState(null);
    const [searching, setSearching] = useState(null);

    const AMMAN_LAT = JordanCities[0].lat;
    const AMMAN_LONG = JordanCities[0].long;

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

    const search = async() => {
      try {
        if(searching) return;
          setSearching(true);
          await searchHere();
          setSearching(false);
      } catch (err) {
          setSearching(false);
      } 
    };

    useEffect(() => {
      search();
    }, [triggerSearch]);

  return (
    <div className={mapType === 'search' ? "google-map-popup-wrapper search-map" : "google-map-popup-wrapper" }
      style={mapType !== 'search' ? { left: isShow ? null : '-200vw' } : style}>

        <span onClick={() => setIsShow(false)}/>

        <div id='cross-close-map' onClick={() => setIsShow(false)}><Svgs name={'cross'}/></div>

        {mapType === 'search' && <button id='more-btn' onClick={() => {
          setLatitude(map?.center?.lat());
          setLongitude(map?.center?.lng());
          setTriggerSearch(!triggerSearch);
        }}>{searching ? 'جاري البحث...' : 'البحث في هذه المنطقة'}</button>}

        <div className='google-map-popup' style={mapType === 'search' ? style : undefined}>

            {isLoaded && <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
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
                  <div onClick={() => {
                    setSelectedProp(item);
                  }} className={'custom-marker'} style={{ 
                    display: !item ? 'none' : null, 
                    background: selectedProp === item ? 'var(--secondColor)' : undefined,
                    color: selectedProp === item ? 'white' : undefined,
                    zIndex: selectedProp === item ? 10 : undefined
                  }}>
                    {item.price} دولار / الليلة
                  </div>
                </OverlayViewF>))}

            </GoogleMap>}

        </div>
      
    </div>
  )
};

export default memo(GoogleMapPopup);
