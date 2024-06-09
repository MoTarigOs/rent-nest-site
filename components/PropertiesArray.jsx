'use client';

import '@styles/components_styles/PropertiesArray.scss';
import { useContext, useEffect, useState } from "react";
import Card from "./Card";
import MySkeleton from "./MySkeleton";
import NotFound from "./NotFound";
import { Context } from "@utils/Context";
import { getBooks, getFavourites, getLocation, getOwnerProperties, getProperties } from "@utils/api";
import PagesHandler from "./PagesHandler";
import { isOkayBookDays } from '@utils/Logic';
import { JordanCities } from '@utils/Data';

const PropertiesArray = ({ 
    type, isEdit, isHide, isSearchMap, title, userId, 
    catagoryParam, isEnglish, cardsPerPage, longitude,
    latitude, propsArr, setPropsArr, fetchingProp, setFetchingProp,
    dontFetchWithHide
}) => {

    const [runOnce, setRunOnce] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [properitiesArray, setProperitiesArray] = useState([]);
    const [foundItems, setFoundItems] = useState(0);
    const [indexSlide, setIndexSlide] = useState(0);

    const { 
        rangeValue, city, catagory, categoryArray,
        ratingScore, triggerFetch, searchText, vehicleType,
        arrangeValue, calendarDoubleValue, 
        isCalendarValue,
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
    
    const settingPropertiesArray = async(skipCount) => {

        if(fetching || fetchingProp) return;

        try {

            (isSearchMap && setFetchingProp) ? setFetchingProp(true) : setFetching(true);

            let addressLong, addressLat;

            if(arrangeValue === 'address'){
                const loc = await getLocation();
                addressLong = loc.long;
                addressLat = loc.lat;
            };

            const getRes = () => {
                switch(type){
                    case 'vehicles':
                        return getProperties(
                            city.value, true, 'transports', rangeValue,
                            ratingScore, searchText, arrangeValue, addressLong, addressLat, skipCount,
                            quickFilter,
                            neighbourSearchText,
                            unitCode,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null, null, vehicleType, cardsPerPage
                        );
                    case 'owner':
                        return getOwnerProperties(userId, skipCount, cardsPerPage);  
                    case 'favourites':
                        return getFavourites(skipCount, cardsPerPage);
                    case 'books':
                        return getBooks(skipCount, cardsPerPage);
                    case 'search':
                        return getProperties(
                            city.value, null, catagory, rangeValue,
                            ratingScore, searchText, isSearchMap ? 'address' : arrangeValue, longitude || JordanCities[0].long, latitude || JordanCities[0].lat, skipCount,
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
                            categoryArray, null, cardsPerPage, isSearchMap
                        );
                    default:
                        return getProperties(
                            city.value, false, catagory, rangeValue,
                            ratingScore, searchText, arrangeValue, addressLong, addressLat, skipCount,
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
                            kitchenFilter, categoryArray, null, cardsPerPage
                        );
                }
            }
            
            const res = await getRes();

            console.log('res: ', res);

            if(res.success !== true || !res.dt?.length > 0) {
                if(setPropsArr) setPropsArr([]);
                setProperitiesArray([]);
                setFoundItems(0);
                (isSearchMap && setFetchingProp) ? setFetchingProp(false) : setFetching(false);
                return;
            };

            let arr = [];

            if(isCalendarValue && calendarDoubleValue){
                for (let i = 0; i < res?.dt?.length; i++) {
                    if(isOkayBookDays(calendarDoubleValue, res.dt?.at(i)?.booked_days))
                        arr.push(res.dt[i]);
                }
            };

            if(setPropsArr) setPropsArr(((isCalendarValue && calendarDoubleValue) ? arr : res?.dt));
            else setProperitiesArray(((isCalendarValue && calendarDoubleValue) ? arr : res?.dt));

            if(!res?.count <= 0) setFoundItems(res?.count);

            (isSearchMap && setFetchingProp) ? setFetchingProp(false) : setFetching(false);

        } catch (err) {
            console.log(err);
            (isSearchMap && setFetchingProp) ? setFetchingProp(false) : setFetching(false);
        }
    };

    useEffect(() => {
        setRunOnce(true);
    }, []);

    useEffect(() => {
        if(runOnce) settingPropertiesArray();
    }, [runOnce]);

    useEffect(() => {
        if(runOnce) settingPropertiesArray();
    }, [triggerFetch]);

    useEffect(() => {
        if(runOnce && catagory === catagoryParam)
            settingPropertiesArray(); 
    }, [catagory]);

    useEffect(() => {
        if(!isHide && !dontFetchWithHide) settingPropertiesArray();
    }, [isHide]);

    const getPropsArray = () => {
        return setPropsArr ? propsArr : properitiesArray;
    };

  return (
    <div className='props-array' style={{ display: isHide ? 'none' : undefined }}>
        {title && <h3 id='title-h'>{title}</h3>}
        {(!fetching && getPropsArray()?.length > 0) ? <ul className="resultUL">
            {getPropsArray().map((item) => (
                <Card type={isEdit ? 'myProp' : null} isEnglish={isEnglish} key={item._id} item={item}/>
            ))}
        </ul> : fetching ? <MySkeleton loadingType={'cards'}/> : <NotFound isEnglish={isEnglish}/>}
        <PagesHandler centerTheDiv={type === 'search'} isHide={isHide} triggerPropsArrayFetch={settingPropertiesArray} isEnglish={isEnglish} 
        indexSlide={indexSlide} city={city}
        setIndexSlide={setIndexSlide} properitiesArray={getPropsArray()} 
        cardsPerPage={cardsPerPage} foundItems={foundItems}/>
    </div>
  )
};

export default PropertiesArray;
