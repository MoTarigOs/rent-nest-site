'use client';

import { createContext, useState } from "react";
import { JordanCities, maximumPrice, minimumPrice } from "./Data";
export const Context = createContext(null);

function DataContext({ children }) {

    const [isSearchPage, setIsSearchPage] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isEnglish, setIsEnglish] = useState(false);
    const [userId, setUserId] = useState('');
    const [userUsername, setUserUsername] = useState('');
    const [userFirstName, setUserFirstName] = useState('');
    const [userFirstNameEN, setUserFirstNameEN] = useState('');
    const [userLastName, setUserLastName] = useState('');
    const [userLastNameEN, setUserLastNameEN] = useState('');
    const [userAccountType, setUserAccountType] = useState('');
    const [userUsernameEN, setUserUsernameEN] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [userAddressEN, setUserAddressEN] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [triggerUserInfo, setTriggerUserInfo] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [loadingUserInfo, setLoadingUserInfo] = useState(false);
    const [isVerified, setIsVerified] = useState('');
    const [userRole, setUserRole] = useState('');
    const [storageKey, setStorageKey] = useState('');
    const [selectedTab, setSelectedTab] = useState('');
    const [booksIds, setBooksIds] = useState([]);
    const [favouritesIds, setFavouritesIds] = useState([]);
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [arabicFont, setArabicFont] = useState('');
    const [englishFont, setEnglishFont] = useState('');
    const [city, setCity] = useState({});
    const [catagory, setCatagory] = useState('');    
    const [vehicleType, setVehicleType] = useState(-1);    
    const [categoryArray, setCategoryArray] = useState([]);    
    const [section, setSection] = useState('city');
    const [calendarDoubleValue, setCalendarDoubleValue] = useState(null);
    const [isCalendarValue, setIsCalendarValue] = useState(false);
    const [currentMinPrice, setCurrentMinPrice] = useState(minimumPrice);
    const [currentMaxPrice, setCurrentMaxPrice] = useState(maximumPrice);
    const [ratingScore, setRatingScore] = useState(0);
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [isMobileHomeFilter, setIsMobileHomeFilter] = useState(false);
    const [isSearchMap, setIsSearchMap] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [arrangeValue, setArrangeValue] = useState('default');
    const [isMap, setIsMap] = useState(false);
    const [isFilter, setIsFilter] = useState(false);    
    const [isArrange, setIsArrange] = useState(false);
    const [mapType, setMapType] = useState('');
    const [waitingToBeHost, setWaitingToBeHost] = useState(null);
    const [mapArray, setMapArray] = useState([]);
    const [longitude, setLongitude] = useState(JordanCities[0].long);
    const [latitude, setLatitude] = useState(JordanCities[1].lat);


    // Advance filter
    const [quickFilter, setQuickFilter] = useState([]);
    const [neighbourSearchText, setnNeighbourSearchText] = useState('');
    const [unitCode, setUnitCode] = useState('');
    const [rangeValue, setRangeValue] = useState([0, maximumPrice]);
    const [bedroomFilter, setBedroomFilter] = useState({ num: 0, single_beds: 0, double_beds: 0 });
    const [capacityFilter, setCapcityFilter] = useState(null);
    const [poolFilter, setPoolFilter] = useState([]);
    const [customersTypesFilter, setCustomersTypesFilter] = useState([]);
    const [companiansFilter, setCompaniansFilter] = useState([]);
    const [bathroomsFilterNum, setBathroomsNumFilter] = useState(null);
    const [bathroomsCompaniansFilter, setBathroomsCompaniansFilter] = useState([]);
    const [kitchenFilter, setKitchenFilter] = useState([]);

    return (
        <Context.Provider value={{ 
            isSearchPage, setIsSearchPage,
            isMobile, setIsMobile,
            isEnglish, setIsEnglish,
            userId, setUserId,
            userUsername, setUserUsername,
            userFirstName, setUserFirstName,
            userFirstNameEN, setUserFirstNameEN,
            userLastName, setUserLastName,
            userLastNameEN, setUserLastNameEN,
            userAccountType, setUserAccountType,
            userUsernameEN, setUserUsernameEN,
            userEmail, setUserEmail,
            userAddress, setUserAddress,
            userAddressEN, setUserAddressEN,
            userPhone, setUserPhone,
            triggerUserInfo, setTriggerUserInfo,
            notifications, setNotifications,
            loadingUserInfo, setLoadingUserInfo,
            isVerified, setIsVerified,
            userRole, setUserRole,
            storageKey, setStorageKey,
            selectedTab, setSelectedTab,
            booksIds, setBooksIds,
            favouritesIds, setFavouritesIds,
            isModalOpened, setIsModalOpened,
            arabicFont, setArabicFont,
            englishFont, setEnglishFont,
            city, setCity,
            catagory, setCatagory,
            vehicleType, setVehicleType,
            categoryArray, setCategoryArray,
            section, setSection,
            calendarDoubleValue, setCalendarDoubleValue,
            isCalendarValue, setIsCalendarValue,
            currentMinPrice, setCurrentMinPrice,
            currentMaxPrice, setCurrentMaxPrice,
            ratingScore, setRatingScore,
            triggerFetch, setTriggerFetch,
            isMobileHomeFilter, setIsMobileHomeFilter,
            isSearchMap, setIsSearchMap,
            searchText, setSearchText,
            arrangeValue, setArrangeValue,
            mapType, setMapType,
            mapArray, setMapArray,
            isMap, setIsMap,
            waitingToBeHost, setWaitingToBeHost,
            isFilter, setIsFilter,
            isArrange, setIsArrange,
            longitude, setLongitude,
            latitude, setLatitude,
            
            
            // Advacne filter
            rangeValue, setRangeValue,
            quickFilter, setQuickFilter,
            neighbourSearchText, setnNeighbourSearchText,
            unitCode, setUnitCode,
            bedroomFilter, setBedroomFilter,
            capacityFilter, setCapcityFilter,
            poolFilter, setPoolFilter,
            customersTypesFilter, setCustomersTypesFilter,
            companiansFilter, setCompaniansFilter,
            bathroomsFilterNum, setBathroomsNumFilter,
            bathroomsCompaniansFilter, setBathroomsCompaniansFilter,
            kitchenFilter, setKitchenFilter
        }}>
            {children}
        </Context.Provider>
    );
};

export default DataContext;