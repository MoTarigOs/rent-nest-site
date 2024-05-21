'use client';

import '@styles//components_styles/PropertiesArray.css';
import { useContext, useEffect, useState } from "react";
import Card from "./Card";
import MySkeleton from "./MySkeleton";
import NotFound from "./NotFound";
import { Context } from "@utils/Context";
import { getLocation, getProperties } from "@utils/api";
import PagesHandler from "./PagesHandler";

const PropertiesArray = ({ type, catagoryParam, isEnglish, cardsPerPage }) => {

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

        if(fetching) return;

        try {

            setFetching(true);

            let addressLong, addressLat;

            if(arrangeValue === 'address'){
                const loc = await getLocation();
                addressLong = loc.long;
                addressLat = loc.lat;
            };
            
            const res = type === 'vehicles' ? 
                await getProperties(
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
                )
                : await getProperties(
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

            if(res.success !== true || !res.dt?.length > 0) {
                setProperitiesArray([]);
                setFoundItems(0);
                setFetching(false);
                return;
            };

            let arr = [];

            if(isCalendarValue && calendarDoubleValue){
                for (let i = 0; i < res?.dt?.length; i++) {
                    if(isOkayBookDays(calendarDoubleValue, res.dt?.at(i)?.booked_days))
                        arr.push(res.dt[i]);
                }
            };

            setProperitiesArray(((isCalendarValue && calendarDoubleValue) ? arr : res?.dt));

            setFoundItems(res?.count);

            setFetching(false);

        } catch (err) {
            console.log(err);
            setFetching(false);
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

  return (
    <>
        {(!fetching && properitiesArray?.length > 0) ? <ul className="resultUL">
            {properitiesArray.map((item) => (
                <Card isEnglish={isEnglish} key={item._id} item={item}/>
            ))}
        </ul> : fetching ? <MySkeleton loadingType={'cards'}/> : <NotFound isEnglish={isEnglish}/>}
        <PagesHandler triggerPropsArrayFetch={settingPropertiesArray} isEnglish={isEnglish} 
        indexSlide={indexSlide} city={city} 
        setIndexSlide={setIndexSlide} properitiesArray={properitiesArray} 
        cardsPerPage={cardsPerPage} foundItems={foundItems}/>
    </>
  )
};

export default PropertiesArray;
