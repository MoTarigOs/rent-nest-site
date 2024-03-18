'use client';

import MyCalendar from '@components/MyCalendar';
import '@styles/components_styles/HeaderPopup.css';
import { motion } from 'framer-motion';
import { JordanCities, ProperitiesCatagories, VehicleCatagories } from '@utils/Data';
import Svgs from '@utils/Svgs';
import { useContext } from 'react';
import { Context } from '@utils/Context';

const HeaderPopup = ({ type, pathname, catagory, setCatagory, setCalender, itemCity, setItemCity }) => {

    type = type.toLowerCase();

    const { city, setCity, triggerFetch, setTriggerFetch } = useContext(Context);

    const getCatagories = () => {
        if(pathname === '/vehicles'){
            return VehicleCatagories;
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
            
            {/* <div className='cityPopupSearchDiv'>
                <Svgs name={'search'}/>
                <input placeholder='اختر مدينة'/>
            </div> */}
            
            <ul>
                <li onClick={() => {
                    if(city !== {}){
                        setCity({});
                        setTriggerFetch(!triggerFetch);
                    }
                }}>كل المدن{!city?.city_id && <RightIconSpan />}</li>
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
                    <Svgs name={'all-catagories'}/> 
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
                        <Svgs name={ctg.value}/> 
                        <h3>{ctg.arabicName}</h3> 
                        {catagory === ctg.value && <RightIconSpan />}
                    </li>
                ))}
            </ul>
            <button>اختيار</button>
        </motion.div>}

        {type === 'calendar' && <motion.div className='calenderPopup'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
        >
                <MyCalendar setCalender={setCalender}/>
        </motion.div>}
    </>
  )
}

export default HeaderPopup
