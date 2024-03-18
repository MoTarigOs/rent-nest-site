'use client';

import { createContext, useState } from "react";
import { maximumPrice, minimumPrice } from "./Data";
export const Context = createContext(null);

function DataContext({ children }) {

    const [isSearchPage, setIsSearchPage] = useState(false);
    const [userId, setUserId] = useState('');
    const [userUsername, setUserUsername] = useState('');
    const [userRole, setUserRole] = useState('');
    const [city, setCity] = useState({});
    const [catagory, setCatagory] = useState('');    
    const [currentMinPrice, setCurrentMinPrice] = useState(minimumPrice);
    const [currentMaxPrice, setCurrentMaxPrice] = useState(maximumPrice);
    const [ratingScore, setRatingScore] = useState(0);
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [arrangeValue, setArrangeValue] = useState('default');

    return (
        <Context.Provider value={{ 
            isSearchPage, setIsSearchPage,
            userId, setUserId,
            userUsername, setUserUsername,
            userRole, setUserRole,
            city, setCity,
            catagory, setCatagory,
            currentMinPrice, setCurrentMinPrice,
            currentMaxPrice, setCurrentMaxPrice,
            ratingScore, setRatingScore,
            triggerFetch, setTriggerFetch,
            searchText, setSearchText,
            arrangeValue, setArrangeValue
        }}>
            {children}
        </Context.Provider>
    );
};

export default DataContext;