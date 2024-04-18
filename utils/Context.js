'use client';

import { createContext, useState } from "react";
import { maximumPrice, minimumPrice } from "./Data";
export const Context = createContext(null);

function DataContext({ children }) {

    const [isSearchPage, setIsSearchPage] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isEnglish, setIsEnglish] = useState(false);
    const [userId, setUserId] = useState('');
    const [userUsername, setUserUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [loadingUserInfo, setLoadingUserInfo] = useState(false);
    const [isVerified, setIsVerified] = useState('');
    const [userRole, setUserRole] = useState('');
    const [storageKey, setStorageKey] = useState('');
    const [selectedTab, setSelectedTab] = useState('');
    const [booksIds, setBooksIds] = useState([]);
    const [favouritesIds, setFavouritesIds] = useState([]);
    const [city, setCity] = useState({});
    const [catagory, setCatagory] = useState('');    
    const [calendarDoubleValue, setCalendarDoubleValue] = useState(null);
    const [isCalendarValue, setIsCalendarValue] = useState(false);
    const [currentMinPrice, setCurrentMinPrice] = useState(minimumPrice);
    const [currentMaxPrice, setCurrentMaxPrice] = useState(maximumPrice);
    const [ratingScore, setRatingScore] = useState(0);
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [isMobileHomeFilter, setIsMobileHomeFilter] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [arrangeValue, setArrangeValue] = useState('default');
    const [isMap, setIsMap] = useState(false);
    const [mapType, setMapType] = useState('');
    const [mapArray, setMapArray] = useState([]);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);

    return (
        <Context.Provider value={{ 
            isSearchPage, setIsSearchPage,
            isMobile, setIsMobile,
            isEnglish, setIsEnglish,
            userId, setUserId,
            userUsername, setUserUsername,
            userEmail, setUserEmail,
            userAddress, setUserAddress,
            userPhone, setUserPhone,
            loadingUserInfo, setLoadingUserInfo,
            isVerified, setIsVerified,
            userRole, setUserRole,
            storageKey, setStorageKey,
            selectedTab, setSelectedTab,
            booksIds, setBooksIds,
            favouritesIds, setFavouritesIds,
            city, setCity,
            catagory, setCatagory,
            calendarDoubleValue, setCalendarDoubleValue,
            isCalendarValue, setIsCalendarValue,
            currentMinPrice, setCurrentMinPrice,
            currentMaxPrice, setCurrentMaxPrice,
            ratingScore, setRatingScore,
            triggerFetch, setTriggerFetch,
            isMobileHomeFilter, setIsMobileHomeFilter,
            searchText, setSearchText,
            arrangeValue, setArrangeValue,
            mapType, setMapType,
            mapArray, setMapArray,
            isMap, setIsMap,
            longitude, setLongitude,
            latitude, setLatitude
        }}>
            {children}
        </Context.Provider>
    );
};

export default DataContext;