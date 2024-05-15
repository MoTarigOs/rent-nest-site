'use client';

import MyCalendar from '@components/MyCalendar';
import '@styles/components_styles/HeaderPopup.css';
import { motion } from 'framer-motion';
import { JordanCities, ProperitiesCatagories, VehicleCatagories, VehiclesTypes } from '@utils/Data';
import Svgs from '@utils/Svgs';
import { useContext, useEffect, useState } from 'react';
import { Context } from '@utils/Context';
import { getNameByLang } from '@utils/Logic';

const HeaderPopup = ({ 
    type, pathname, isEnglish, triggerHomeFilterSection,
    itemCity, setItemCity, isViewPage, days,
    isCustom, setIsCustom, customArray, selectedCustom, setSelectedCustom 
}) => {

    const [searched, setSearched] = useState(customArray ? customArray : JordanCities);

    type = type?.toLowerCase();

    if(pathname?.includes('/vehicles')) type = 'vehcile types';

    const { 
        city, setCity, triggerFetch, setTriggerFetch, 
        catagory, setCatagory, setCalendarDoubleValue, setLongitude, 
        setLatitude, vehicleType, setVehicleType
    } = useContext(Context);

    useEffect(() => {
        if(triggerHomeFilterSection) setSearched(JordanCities);
    }, []);

    const getCatagories = () => {
        if(pathname === '/vehicles' || type.includes('vehicle'))
            return VehiclesTypes;
        return ProperitiesCatagories;
    }

    const RightIconSpan = () => {
        return <span id='righticonspan'/>
    }

  return (
    <>
        {type?.includes('city') && <motion.div className='cityPopup'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ width: type?.includes('mobile-filter') ? '100%' : undefined }}
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
                <li onClick={() => {
                    if(city !== {}){
                        setCity({});
                        setTriggerFetch(!triggerFetch);
                        if(triggerHomeFilterSection) triggerHomeFilterSection();
                    }
                }}>{getNameByLang('كل المدن', pathname?.includes('/en') || isEnglish)}{!city.value && <RightIconSpan />}</li>
                {searched.map((cty) => (
                    <li onClick={() => {
                        if(city !== cty){
                            setCity(cty);
                            setTriggerFetch(!triggerFetch);
                            if(triggerHomeFilterSection) triggerHomeFilterSection();
                        }
                    }} key={cty.city_id}>
                        {pathname?.includes('/en') || isEnglish ? cty.value : cty.arabicName} 
                        {city.city_id === cty.city_id && <RightIconSpan />}
                    </li>
                ))}
            </ul>

        </motion.div>}

        {type?.includes('add-city') && <motion.div className='cityPopup'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
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
            <ul>
                {searched.map((cty) => (
                    <li onClick={() => { 
                        setItemCity(cty);
                        setLongitude(cty.long);
                        setLatitude(cty.lat);
                    }} 
                    key={cty.city_id}>
                        {isEnglish ? cty.value : cty.arabicName} 
                        {itemCity.city_id === cty.city_id && <RightIconSpan />}
                    </li>
                ))}
            </ul>

        </motion.div>}

        {type === 'catagory' && <motion.div className='catagoryPopup'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <ul>
                <li style={{ margin: 0 }} onClick={() => {
                    if(catagory !== ''){
                        setCatagory('');
                        setTriggerFetch(!triggerFetch);
                    }
                }} id="allCtgLi">
                    <Svgs name={'layer'}/>
                    <h3>{getNameByLang('كل التصنيفات', isEnglish ? true : pathname?.includes('/en') || isEnglish || false)}</h3> 
                    {catagory === '' && <RightIconSpan />}
                </li>

                {getCatagories().map((ctg) => (
                    <li key={ctg.id} onClick={() => {
                        if(catagory !== ctg.value){
                            setCatagory(ctg.value);
                            setTriggerFetch(!triggerFetch);
                        }
                    }}>
                        <Svgs name={ctg.value}/>
                        <h3>{pathname !== '/vehicles' 
                        ? getNameByLang(ctg.arabicName, isEnglish ? true : pathname?.includes('/en') || isEnglish || false)
                        : isEnglish ? ctg.value : ctg.arabicName}</h3> 
                        {catagory === ctg.value && <RightIconSpan />}
                    </li>
                ))}
            </ul>
        </motion.div>}

        {type === 'vehcile types' && <motion.div dir={isEnglish ? 'ltr' : ''} className='catagoryPopup'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <ul>
                <li style={{ margin: 0, width: isEnglish ? 'fit-content' : undefined }} onClick={() => {
                    if(vehicleType !== -1){
                        setVehicleType(-1);
                        setTriggerFetch(!triggerFetch);
                    }
                }} id="allCtgLi">
                    <Svgs name={'layer'}/>
                    <h3>{getNameByLang('كل السيارات', isEnglish ? true : pathname?.includes('/en') || isEnglish || false)}</h3> 
                    {vehicleType === -1 && <RightIconSpan />}
                </li>
                {VehiclesTypes.map((ctg) => (
                    <li style={{ width: isEnglish ? '100%' : undefined }} key={ctg.id} onClick={() => {
                        if(vehicleType !== ctg.id){
                            setVehicleType(ctg.id);
                            setTriggerFetch(!triggerFetch);
                        }
                    }}>
                        <h3>{isEnglish ? ctg.value : ctg.arabicName}</h3> 
                        {vehicleType === ctg.id && <RightIconSpan />}
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

        {type === 'custom' && <motion.div className='cityPopup'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: isCustom ? 1 : 0, scale: isCustom ? 1 : 0 }}
        >
            <ul>
                {customArray.map((cst) => (
                    <li onClick={() => {
                        setSelectedCustom(cst);
                        setIsCustom(false);
                    }} key={cst.value}>
                        {isEnglish ? cst.value?.replaceAll('-', ' ')?.replaceAll('_', ' ') : cst.arabicName} 
                        {selectedCustom.value === cst.value && <RightIconSpan />}
                    </li>
                ))}
            </ul>
        </motion.div>}

        {type === 'customers' && <motion.div className='cityPopup'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: isCustom ? 1 : 0, scale: isCustom ? 1 : 0 }}
        >
             <ul>
                <li onClick={() => { setSelectedCustom(''); setIsCustom(false)}}>{isEnglish ? 'Undefined' : 'غير محدد'} {selectedCustom === '' && <RightIconSpan />}</li>
                {customArray.map((cst) => (
                    <li onClick={() => {
                        setSelectedCustom(cst);
                        setIsCustom(false);
                    }} key={cst}>
                        {cst}
                        {selectedCustom === cst && <RightIconSpan />}
                    </li>
                ))}
            </ul>
        </motion.div>}

        {type === 'selections' && <motion.div className='cityPopup'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: isCustom ? 1 : 0, scale: isCustom ? 1 : 0 }}
        >
             <ul>
                <li id='searchBar'>
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
                    }}/>
                </li>
                {searched.map((cst) => (
                    <li onClick={() => {
                        if(selectedCustom?.includes(cst)){
                            setSelectedCustom(selectedCustom?.filter(
                                i => i !== cst
                            ))
                        } else { 
                            setSelectedCustom([...selectedCustom, cst]);
                        }
                    }} key={cst}>
                        {cst}
                        {selectedCustom?.includes(cst) && <RightIconSpan />}
                    </li>
                ))}
            </ul>
        </motion.div>}
    </>
  )
}

export default HeaderPopup
