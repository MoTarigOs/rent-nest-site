'use client';

import MyCalendar from '@components/MyCalendar';
import '@styles/components_styles/HeaderPopup.css';
import { motion } from 'framer-motion';
import { JordanCities, ProperitiesCatagories, VehicleCatagories } from '@utils/Data';
import Svgs from '@utils/Svgs';
import { useContext } from 'react';
import { Context } from '@utils/Context';

const HeaderPopup = ({ 
    type, pathname, catagory, setCatagory, handleChoose,
    setCalendarDoubleValue, itemCity, setItemCity, isViewPage, days,
    isCustom, setIsCustom, customArray, selectedCustom, setSelectedCustom 
}) => {

    type = type.toLowerCase();

    const { city, setCity, triggerFetch, setTriggerFetch } = useContext(Context);

    const getCatagories = () => {
        if(pathname === '/vehicles'){
            return VehicleCatagories;
        } else if(pathname === '/search') {
            return [...VehicleCatagories, ...ProperitiesCatagories];
        } else {
            return ProperitiesCatagories;
        }
    }

    const RightIconSpan = () => {
        return <span id='righticonspan'/>
    }

  return (
    <>
        {type === 'city' && <motion.div className='cityPopup'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <ul>
                <li onClick={() => {
                    if(city !== {}){
                        setCity({});
                        setTriggerFetch(!triggerFetch);
                    }
                }}>كل المدن{!city.value && <RightIconSpan />}</li>
                {JordanCities.map((cty) => (
                    <li onClick={() => {
                        if(city !== cty){
                            setCity(cty);
                            setTriggerFetch(!triggerFetch);
                        }
                    }} key={cty.city_id}>
                        {cty.arabicName} 
                        {city.city_id === cty.city_id && <RightIconSpan />}
                    </li>
                ))}
            </ul>

        </motion.div>}

        {type === 'add-city' && <motion.div className='cityPopup'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            
            <ul>
                {JordanCities.map((cty) => (
                    <li onClick={() => { setItemCity(cty) }} 
                    key={cty.city_id}>
                        {cty.arabicName} 
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
                <li onClick={() => {
                    if(catagory !== ''){
                        setCatagory('');
                        setTriggerFetch(!triggerFetch);
                    }
                }} id="allCtgLi">
                    <h3>كل التصنيفات</h3> 
                    {catagory === '' && <RightIconSpan />}
                </li>

                {getCatagories().map((ctg) => (
                    <li key={ctg._id} onClick={() => {
                        if(catagory !== ctg.value){
                            setCatagory(ctg.value);
                            setTriggerFetch(!triggerFetch);
                        }
                    }}>
                        <h3>{ctg.arabicName}</h3> 
                        {catagory === ctg.value && <RightIconSpan />}
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
                        {cst.arabicName} 
                        {selectedCustom.value === cst.value && <RightIconSpan />}
                    </li>
                ))}
            </ul>

        </motion.div>}
    </>
  )
}

export default HeaderPopup
