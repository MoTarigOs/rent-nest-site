'use client';

import '@styles/components_styles/Filter.css';
import { JordanCities, ProperitiesCatagories, VehicleCatagories, maximumPrice, minimumPrice } from '@utils/Data';
import Svgs from '@utils/Svgs';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import MapImage from '@assets/icons/google-map.png';
import Link from 'next/link';
import { Context } from '@utils/Context';
import { getNameByLang } from '@utils/Logic';

const Filter = ({ 
    isEnglish, type, isFilter, setIsFilter, triggerFetch, setTriggerFetch 
}) => {

    const minPriceRef = useRef();
    const maxPriceRef = useRef();
    const minSpanRef = useRef();
    const maxSpanRef = useRef();
    const priceStep = 5;
    const [trackLeft, setTrackLeft] = useState('0%');
    const [sliderWidth, setSliderWidth] = useState('0%');

    const { 
        currentMinPrice, setCurrentMinPrice, currentMaxPrice, setCurrentMaxPrice,
        ratingScore, setRatingScore, city, setCity, setCatagory, catagory,
        searchText, setSearchText
    } = useContext(Context);

    function validateRange() {
        let minPrice = parseInt(minPriceRef.current.value);
        let maxPrice = parseInt(maxPriceRef.current.value);
      
        if (minPrice > maxPrice) {
          let tempValue = maxPrice;
          maxPrice = minPrice;
          minPrice = tempValue;
        }
      
        const minPercentage = ((minPrice - priceStep) / (maximumPrice - priceStep)) * 100;
        const maxPercentage = ((maxPrice - priceStep) / (maximumPrice - priceStep)) * 100;

        setSliderWidth(maxPercentage - minPercentage + '%');
        setTrackLeft(minPercentage + '%');
        setCurrentMinPrice(minPrice);
        setCurrentMaxPrice(maxPrice);
    };

    const getTrackLeftPlusWidth = () => {
        const num1 = parseInt(trackLeft.replace('%', ''));
        const num2 = parseInt(sliderWidth.replace('%', ''));
        return num1 + num2 + '%';
    }

    const getCatagories = () => {
        if(type === 'prop'){
            return ProperitiesCatagories;
        } else {
            return VehicleCatagories;
        }
    }

    useEffect(() => {
        validateRange();
    }, [minPriceRef.current, maxPriceRef.current]);

  return (
    <div className="filterULDiv" style={{ display: isFilter ? null : 'none' }}>
        
        <div id='bgDiv' onClick={() => setIsFilter(false)} style={{ display: !isFilter && 'none'}}></div>

        <div className='wrapper'>

            <div className='filterSearchDiv'>
                <Svgs name={'cross'} on_click={() => setIsFilter(false)}/>
                <div style={{ width: '100%' }}>
                    <input style={{ width: '100%' }} placeholder={searchText.length <= 0 ? `${getNameByLang('ابحث عن', isEnglish)} ${type === 'prop' ? getNameByLang('عقارات', isEnglish) : getNameByLang('سيارات', isEnglish)}` : searchText} onChange={(e) => setSearchText(e.target.value)}/>
                    <Link href={isEnglish ? '/en/search' : '/search'}><Image src={MapImage}/></Link>
                </div>
                <button onClick={() => { 
                    setTriggerFetch(!triggerFetch); setIsFilter(false);
                }}>{getNameByLang('ابحث', isEnglish)}</button>
            </div>

            <hr />

            <div className="price">
                <h2>{getNameByLang('السعر', isEnglish)}</h2>
                <div className="range-slider">
                    <div className="range-fill" style={{ left: trackLeft, width: sliderWidth }}></div>
                    <input onChange={(e) => {
                        setCurrentMinPrice(e.target.value); setTimeout(() => validateRange(), [100]);
                    }} type='number' className='priceSpanInput' ref={minSpanRef} style={{ left: trackLeft}} value={currentMinPrice}/>
                    <input onChange={(e) => { 
                        setCurrentMaxPrice(e.target.value); setTimeout(() => validateRange(), [100]);
                    }} type='number' className='priceSpanInput' ref={maxSpanRef} style={{ left: getTrackLeftPlusWidth() }} value={currentMaxPrice}/>
                    <input
                    type="range"
                    className="min-price"
                    min={minimumPrice}
                    max={maximumPrice}
                    step={priceStep}
                    value={currentMinPrice}
                    ref={minPriceRef}
                    style={{ width: '100%' }}
                    onChange={validateRange}
                    />
                    <input
                    type="range"
                    className="max-price"
                    min={minimumPrice}
                    max={maximumPrice}
                    step={priceStep}
                    ref={maxPriceRef}
                    value={currentMaxPrice}
                    style={{ width: '100%' }}
                    onChange={validateRange}
                    />
                </div>
            </div> 

            <div className="city">

                <select defaultValue="" style={{ width: '100%' }} onChange={(e) => {
                    console.log('city value: ', e.target.value);
                    const myCity = JordanCities.find(i => i.city_id === Number(e.target.value));
                    setCity(myCity ? myCity : '');
                }}>
                    <option value="" disabled hidden>{getNameByLang('اختر المدينة', isEnglish)}</option>
                    <option value={-3}>{getNameByLang('كل المدن', isEnglish)}</option>
                    {JordanCities.map((city) => (
                        <option key={city.city_id} value={city.city_id}>{isEnglish ? city.value : city.arabicName}</option>
                    ))}
                </select>
            </div>

            <div className="catagory">
                <ul>
                    <li onClick={() => setCatagory('')}
                        className={catagory === '' ? 'selectedCatagory' : undefined}
                    >
                        {getNameByLang('كل التصنيفات', isEnglish)}
                    </li>
                    {getCatagories().map((ctg, index) => (
                        <li key={index} onClick={() => setCatagory(ctg.value)}
                            className={catagory === ctg.value ? 'selectedCatagory' : undefined}
                        >
                            {isEnglish ? ctg.value : ctg.arabicName}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="rating">
                <h2>{getNameByLang('التقييم', isEnglish)} <span>( {getNameByLang('تقييم', isEnglish)} {ratingScore} {getNameByLang('أو أكثر', isEnglish)} )</span></h2>
                <Svgs name={'star'} styling={ratingScore > 0 ? true : false} on_click={() => {if(ratingScore === 0){ setRatingScore(1) } else { setRatingScore(0) }}}/>
                <Svgs name={'star'} styling={ratingScore > 1 ? true : false} on_click={() => setRatingScore(2)}/>
                <Svgs name={'star'} styling={ratingScore > 2 ? true : false} on_click={() => setRatingScore(3)}/>
                <Svgs name={'star'} styling={ratingScore > 3 ? true : false} on_click={() => setRatingScore(4)}/>
                <Svgs name={'star'} styling={ratingScore > 4 ? true : false} on_click={() => setRatingScore(5)}/>
            </div>

            <button style={{ width: '100%', marginTop: 32, borderRadius: 8 }} onClick={() => {
                setTriggerFetch(!triggerFetch); setIsFilter(false);
            }}>{getNameByLang('ابحث', isEnglish)}</button>

        </div>
        
    </div>
  )
};

export default Filter;
