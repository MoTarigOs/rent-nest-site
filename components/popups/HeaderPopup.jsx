'use client';

import MyCalendar from '@components/MyCalendar';
import '@styles/components_styles/HeaderPopup.scss';
import { motion } from 'framer-motion';
import { JordanCities, ProperitiesCatagories, VehicleCatagories, VehiclesTypes } from '@utils/Data';
import Svgs from '@utils/Svgs';
import { useContext, useEffect, useState } from 'react';
import { Context } from '@utils/Context';
import { getNameByLang } from '@utils/Logic';

const HeaderPopup = ({ 
    type, pathname, isEnglish, triggerHomeFilterSection,
    itemCity, setItemCity, isViewPage, days,
    isCustom, setIsCustom, customArray, selectedCustom, 
    setSelectedCustom, initialValueIndex, isSingleSelection,
    isNotSearchBar, myStyle, searchBarPlaceHolder, isSearch,
    sections
}) => {

    const [searched, setSearched] = useState(customArray ? customArray : JordanCities);

    type = type?.toLowerCase();

    // if(pathname?.includes('/vehicles')) type = 'vehcile types';

    const { 
        city, setCity, triggerFetch, setTriggerFetch, 
        catagory, setCatagory, setCalendarDoubleValue, setLongitude, 
        setLatitude, vehicleType, setVehicleType, setCategoryArray
    } = useContext(Context);

    useEffect(() => {
        if(triggerHomeFilterSection) setSearched(JordanCities);
    }, []);

    useEffect(() => {
        if(initialValueIndex >= 0) setSelectedCustom(customArray[0]);
    }, [initialValueIndex]);

    const getCatagories = () => {
        if(pathname === '/vehicles' || type.includes('vehicle'))
            return VehiclesTypes;
        if(isSearch)
            return [...ProperitiesCatagories, VehicleCatagories[0]]
        return ProperitiesCatagories;
    }

    const RightIconSpan = () => {
        return <div id='righticonspan'><span /></div>
    }

  return (
    <>
        {type === 'city' && <motion.div className='cityPopup'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ width: sections?.includes('mobile-filter') ? '100%' : undefined }}
        >
            <div id='searchBar'>
                <Svgs name={'search'}/>
                <input onChange={(e) => {
                    if(e.target.value?.length <= 0) return setSearched(JordanCities);
                    let arr = [];
                    JordanCities.forEach(element => {
                        if(element.value.includes(e.target.value) || element.arabicName.includes(e.target.value)){
                            arr.push(element);
                        }
                    });
                    setSearched(arr);
                }} placeholder={(pathname?.includes('/en') || isEnglish) ? 'Search a city...' : 'ابحث عن مدينة...'}/>
            </div>
            <ul>
                <li className={(!city.value ? 'selectedCatagory' : undefined) + ' disable-text-copy'} onClick={() => {
                    if(city !== {}){
                        setCity({});
                        setTriggerFetch(!triggerFetch);
                        if(triggerHomeFilterSection) triggerHomeFilterSection();
                    }
                }}>{getNameByLang('كل المدن', pathname?.includes('/en') || isEnglish)}<RightIconSpan /></li>
                {searched.map((cty) => (
                    <li className={(city.city_id === cty.city_id ? 'selectedCatagory' : undefined) + ' disable-text-copy'} onClick={() => {
                        if(city !== cty){
                            setCity(cty);
                            setTriggerFetch(!triggerFetch);
                            if(triggerHomeFilterSection) triggerHomeFilterSection();
                        }
                    }} key={cty.city_id}>
                        {pathname?.includes('/en') || isEnglish ? cty.value : cty.arabicName} 
                        <RightIconSpan />
                    </li>
                ))}
            </ul>

        </motion.div>}

        {type === 'add-city' && <motion.div className='addCity disable-text-copy'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            style={myStyle}
        >
             <div id='searchBar'>
                <Svgs name={'search'}/>
                <input onChange={(e) => {
                    if(e.target.value?.length <= 0) return setSearched(JordanCities);
                    let arr = [];
                    JordanCities.forEach(element => {
                        if(element.value?.toLowerCase()?.includes(e.target.value?.toLowerCase()) || element.arabicName?.toLowerCase()?.includes(e.target.value?.toLowerCase())){
                            arr.push(element);
                        }
                    });
                    setSearched(arr);
                }} placeholder={(pathname?.includes('/en') || isEnglish) ? 'Search a city...' : 'ابحث عن مدينة...'}/>
            </div>
            <ul className='disable-text-copy'>
                {searched.map((cty) => (
                    <li className={(itemCity?.city_id === cty.city_id ? 'selectedCatagory' : undefined) + ' disable-text-copy'} onClick={() => { 
                        setItemCity(cty);
                        setLongitude(cty.long);
                        setLatitude(cty.lat);
                    }} 
                    key={cty.city_id}>
                        <RightIconSpan />
                        {isEnglish ? cty.value : cty.arabicName} 
                    </li>
                ))}
            </ul>

        </motion.div>}

        {type === 'catagory' && <motion.div className='catagoryPopup'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <ul>
                <li className={(catagory === '' ? 'selectedCatagory' : undefined) + ' disable-text-copy'} style={{ margin: 0 }} onClick={() => {
                    if(catagory !== ''){
                        setCatagory('');
                        setTriggerFetch(!triggerFetch);
                    }
                }} id="allCtgLi">
                    <Svgs name={'layer'}/>
                    <h3>{getNameByLang('كل التصنيفات', isEnglish ? true : pathname?.includes('/en') || isEnglish || false)}</h3> 
                    <RightIconSpan />
                </li>

                {getCatagories().map((ctg) => (
                    <li className={(catagory === ctg.value ? 'selectedCatagory' : undefined) + ' disable-text-copy'} key={ctg.id} onClick={() => {
                        if(catagory !== ctg.value){
                            setCatagory(ctg.value);
                            setCategoryArray([]);
                            setTriggerFetch(!triggerFetch);
                        }
                    }}>
                        <Svgs name={ctg.value} styling={{ scale: 1.4, transform: 'translateY(2px)'}}/>
                        <h3>{pathname !== '/vehicles' 
                        ? getNameByLang(ctg.arabicName, isEnglish ? true : pathname?.includes('/en') || isEnglish || false)
                        : isEnglish ? ctg.value : ctg.arabicName}</h3> 
                        <RightIconSpan />
                    </li>
                ))}
            </ul>
        </motion.div>}

        {type === 'vehcile types' && <motion.div dir={isEnglish ? 'ltr' : ''} className='catagoryPopup'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <ul>
                <li onClick={() => {
                    if(vehicleType !== -1){
                        setVehicleType(-1);
                        setTriggerFetch(!triggerFetch);
                    }
                }} id="allCtgLi" className={vehicleType === -1 ? 'selectedCatagory' : undefined}>
                    <Svgs name={'layer'}/>
                    <h3>{getNameByLang('كل السيارات', isEnglish ? true : pathname?.includes('/en') || isEnglish || false)}</h3> 
                    <RightIconSpan />
                </li>
                {VehiclesTypes.map((ctg) => (
                    <li style={{ width: isEnglish ? '100%' : undefined }} key={ctg.id} onClick={() => {
                        if(vehicleType !== ctg.id){
                            setVehicleType(ctg.id);
                            setTriggerFetch(!triggerFetch);
                        }
                    }} className={vehicleType === ctg.id ? 'selectedCatagory' : undefined}>
                        <h3>{isEnglish ? ctg.value : ctg.arabicName}</h3> 
                        <RightIconSpan />
                    </li>
                ))}
            </ul>
        </motion.div>}

        {type === 'calendar' && <motion.div className='calenderPopup'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
        >
                <MyCalendar setCalender={setCalendarDoubleValue} days={days} type={isViewPage ? 'view' : null}/>
        </motion.div>}

        {type === 'custom' && <motion.div className='addCity'
            initial={{ opacity: 0, scale: 0.7 }} style={myStyle}
            animate={{ opacity: isCustom ? 1 : 0, scale: isCustom ? 1 : 0 }}
        >
            <ul>
                {customArray.map((cst) => (
                    <li className={(selectedCustom.value === cst.value ? 'selectedCatagory' : undefined) + ' disable-text-copy'} 
                    onClick={() => {
                        setSelectedCustom(cst);
                        setIsCustom(false);
                    }} key={cst.value}>
                        <RightIconSpan />
                        {isEnglish ? cst.value?.replaceAll('-', ' ')?.replaceAll('_', ' ') : cst.arabicName} 
                    </li>
                ))}
            </ul>
        </motion.div>}

        {type === 'customers' && <motion.div className='addCity'
            initial={{ opacity: 0, scale: 0.7 }} style={myStyle}
            animate={{ opacity: isCustom ? 1 : 0, scale: isCustom ? 1 : 0 }}
        >
             <ul>
                {initialValueIndex === undefined && <li className={selectedCustom === '' ? 'selectedCatagory' : undefined} 
                onClick={() => { 
                    setSelectedCustom(''); setIsCustom(false)
                }}>
                    <RightIconSpan />
                    {isEnglish ? 'Undefined' : 'غير محدد'} 
                </li>}
                {customArray.map((cst) => (
                    <li className={selectedCustom === cst ? 'selectedCatagory' : undefined} onClick={() => {
                        setSelectedCustom(cst);
                        setIsCustom(false);
                    }} key={cst} style={{ width: 'fit-content' }}>
                        <RightIconSpan />
                        {cst}
                    </li>
                ))}
            </ul>
        </motion.div>}

        {type === 'selections' && <motion.div className='addCity'
            initial={{ opacity: 0, scale: 0.7 }} style={myStyle}
            animate={{ opacity: isCustom ? 1 : 0, scale: isCustom ? 1 : 0 }}
        >
             <ul>
                {!isNotSearchBar && <li id='searchBar'>
                    <Svgs name={'search'}/>
                    <input onChange={(e) => {
                        if(e.target.value?.length <= 0) return setSearched(customArray);
                        let arr = [];
                        customArray.forEach(element => {
                            if(element.includes(e.target.value)){
                                arr.push(element);
                            }
                        });
                        setSearched(arr);
                    }} placeholder={searchBarPlaceHolder} style={{ fontSize: '1rem' }}/>
                </li>}
                {searched.map((cst) => (
                    <li className={selectedCustom?.includes(cst) ? 'selectedCatagory' : undefined} 
                    onClick={() => {
                        if(isSingleSelection) return setSelectedCustom(cst);
                        if(selectedCustom?.includes(cst)){
                            setSelectedCustom(selectedCustom?.filter(
                                i => i !== cst
                            ))
                        } else { 
                            setSelectedCustom([...selectedCustom, cst]);
                        }
                    }} key={cst}>
                        <RightIconSpan />
                        {cst}
                    </li>
                ))}
            </ul>
        </motion.div>}
    </>
  )
}

export default HeaderPopup
