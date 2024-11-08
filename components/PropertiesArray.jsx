'use client';

import '@styles/components_styles/PropertiesArray.scss';
import { useContext, useEffect, useRef, useState } from "react";
import Card from "./Card";
import MySkeleton from "./MySkeleton";
import NotFound from "./NotFound";
import { Context } from "@utils/Context";
import { getAdminProps, getBooks, getFavourites, getLocation, getOwnerProperties, getProperties, getReports } from "@utils/api";
import PagesHandler from "./PagesHandler";
import { isOkayBookDays } from '@utils/Logic';
import { JordanCities } from '@utils/Data';

const PropertiesArray = ({ 
    type, isEdit, isHide, isSearchMap, title, userId, 
    catagoryParam, isEnglish, cardsPerPage, longitude,
    latitude, propsArr, setPropsArr, fetchingProp, setFetchingProp,
    dontFetchWithHide, adminSectionType
}) => {

    const [runOnce, setRunOnce] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [properitiesArray, setProperitiesArray] = useState([]);
    const [foundItems, setFoundItems] = useState(0);
    const [indexSlide, setIndexSlide] = useState(0);

    const { 
        rangeValue, city, catagory, categoryArray,
        ratingScore, triggerFetch, searchText, vehicleType,
        arrangeValue, calendarDoubleValue, setCalendarDoubleValue,
        isCalendarValue, booksIds,
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
        resType
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
                            null, null, vehicleType, cardsPerPage, null,
                            resType?.value
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
                            categoryArray, null, cardsPerPage, isSearchMap,
                            resType?.value
                        );
                    case 'admin-properties':
                        return getAdminProps(adminSectionType?.split(' ')?.at(1), skipCount, cardsPerPage);
                    case 'deals':
                        return getProperties(
                            city.value, false, catagory || catagoryParam, rangeValue,
                            ratingScore, searchText, arrangeValue, addressLong, addressLat, skipCount,
                            [{"idName":"discounts","enName":"Best offers & discounts","arabicName":"العروض و الخصومات"}],
                            neighbourSearchText,
                            unitCode,
                            bedroomFilter,
                            capacityFilter,
                            poolFilter,
                            customersTypesFilter,
                            companiansFilter,
                            bathroomsFilterNum,
                            bathroomsCompaniansFilter,
                            kitchenFilter, categoryArray, null, cardsPerPage,
                            null, resType?.value
                        );
                    default:
                        return getProperties(
                            city.value, false, catagory || catagoryParam, rangeValue,
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
                            kitchenFilter, categoryArray, null, cardsPerPage,
                            null, resType?.value
                        );
                }
            };
            
            const res = await getRes();

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
    }, [catagory, catagoryParam]);

    useEffect(() => {
        if(!isHide && !dontFetchWithHide) settingPropertiesArray();
    }, [isHide]);

    useEffect(() => {
        if(type === 'admin-properties' 
        && adminSectionType?.split(' ')?.at(0) === 'properties')
            settingPropertiesArray();
    }, [adminSectionType]);

    const getPropsArray = () => {
        return setPropsArr ? propsArr : properitiesArray;
    };

  return (
    <div className='props-array' style={{ display: isHide ? 'none' : undefined }}>
        {title && <h3 id='title-h'>{title}</h3>}
        {(!fetching && getPropsArray()?.length > 0) ? <ul className="resultUL">
            {getPropsArray().map((item) => (
                <><Card useHooks={!type?.includes('admin')} isAdmin={type?.includes('admin')} type={isEdit ? 'myProp' : (type === 'books' ? 'booked' : null)} setCalenderDoubleValue={setCalendarDoubleValue} isEnglish={isEnglish} key={item._id} item={item}
                    bookDatesValues={[
                        new Date(booksIds?.find(i=>i.property_id === item._id)?.date_of_book_start),
                        new Date(booksIds?.find(i=>i.property_id === item._id)?.date_of_book_end)
                    ]} isReported={type === 'report props'}/>
            </>))}
        </ul> : fetching ? <MySkeleton loadingType={'cards'}/> : <NotFound isEnglish={isEnglish}/>}
        <PagesHandler centerTheDiv={type === 'search'} isHide={isHide} 
        triggerPropsArrayFetch={settingPropertiesArray} isEnglish={isEnglish} 
        indexSlide={indexSlide} city={city}
        setIndexSlide={setIndexSlide} properitiesArray={getPropsArray()} 
        cardsPerPage={cardsPerPage} foundItems={foundItems}/>
    </div>
  )
};

export default PropertiesArray;
