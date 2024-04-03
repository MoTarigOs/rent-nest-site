'use client';

import '@styles/components_styles/GoogleMapPopup.css';
import { Autocomplete, Circle, GoogleMap, Marker, OverlayView, OverlayViewF, StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import { memo } from 'react';
import { isInsideJordan } from '@utils/Data';
import Image from 'next/image';
import MarkerVehicleImage from '@assets/icons/car-inbound.svg';
import MarkerPropImage from '@assets/icons/house.svg';

const GoogleMapPopup = ({ 
  isShow, setIsShow, mapType, latitude, 
  longitude, setLatitude, setLongitude,
  props, setSelectedProp
}) => {

    const AMMAN_LAT = 31.94816692309648;
    const AMMAN_LONG = 35.91396596063626;

    console.log('key: ', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

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

    // const [map, setMap] = useState(null)

    // const onLoad = (map) => {
    //   const bounds = new window.google.maps.LatLngBounds(center);
    //   //map.fitBounds(bounds);
    //   setMap(map)
    // };
  
    const onUnmount = (map) => {
      //setMap(null);
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
      style={{ left: isShow ? null : '-200vw' }}>

        <span onClick={() => setIsShow(false)}/>

        <div className='google-map-popup'>

            {isLoaded && <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ 
                  lat: latitude ? latitude : AMMAN_LAT, 
                  lng: longitude ? longitude : AMMAN_LONG 
                }}
                zoom={16}
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
                  <div onClick={() => setSelectedProp(item)} className='custom-marker' style={{ display: !item ? 'none' : null }}>
                    <Image src={item.type_is_vehicle === true ? MarkerVehicleImage : MarkerPropImage} alt='google map image' width={120} height={120}/>
                  </div>
                </OverlayViewF>))}

            </GoogleMap>}

        </div>
      
    </div>
  )
};

export default memo(GoogleMapPopup);
