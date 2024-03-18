'use client';

import '@styles/components_styles/Filter.css';
import { JordanCities, ProperitiesCatagories, VehicleCatagories, maximumPrice, minimumPrice } from '@utils/Data';
import Svgs from '@utils/Svgs';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import MapImage from '@assets/icons/google-map.png';
import Link from 'next/link';
import { Context } from '@utils/Context';

const Filter = ({ 
    type, isFilter, setIsFilter, triggerFetch, setTriggerFetch 
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
                <div>
                    <input placeholder={searchText.length <= 0 ? `ابحث عن ${type === 'prop' ? 'عقارات' : 'سيارات'}` : searchText} onChange={(e) => setSearchText(e.target.value)}/>
                    <Link href={'/search/map'}><Image src={MapImage}/></Link>
                </div>
                <button onClick={() => setTriggerFetch(!triggerFetch)}>ابحث</button>
            </div>

            <hr />

            <div className="price">
                <h2>السعر</h2>
                <div class="range-slider">
                    <div class="range-fill" style={{ right: trackLeft, width: sliderWidth }}></div>
                    <span ref={minSpanRef} style={{ right: trackLeft}}>${currentMinPrice}</span>
                    <span ref={maxSpanRef} style={{ right: getTrackLeftPlusWidth() }}>${currentMaxPrice}</span>
                    <input
                    type="range"
                    class="min-price"
                    min={minimumPrice}
                    max={maximumPrice}
                    step={priceStep}
                    defaultValue="0"
                    ref={minPriceRef}
                    onChange={validateRange}
                    />
                    <input
                    type="range"
                    class="max-price"
                    min={minimumPrice}
                    max={maximumPrice}
                    step={priceStep}
                    ref={maxPriceRef}
                    defaultValue={maximumPrice}
                    onChange={validateRange}
                    />
                </div>
            </div> 

            <div className="city">

                <select onChange={(e) => {
                    const myCity = JordanCities.find(i => i.city_id === e.target.value);
                    setCity(myCity ? myCity : {});
                }} value={city?.city_id ? city.city_id : {}}>
                    <option value="" disabled selected hidden>اختر المدينة</option>
                    <option value={{}}>كل المدن</option>
                    {JordanCities.map((city) => (
                        <option value={city.city_id}>{city.arabicName}</option>
                    ))}
                </select>
            </div>

            <div className="catagory">
                <ul>
                    <li onClick={() => setCatagory('')}
                        className={catagory === '' && 'selectedCatagory'}
                    >
                        كل التصنيفات
                    </li>
                    {getCatagories().map((ctg) => (
                        <li onClick={() => setCatagory(ctg.value)}
                            className={catagory === ctg.value && 'selectedCatagory'}
                        >
                            {ctg.arabicName}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="rating">
                <h2>التقييم <span>( تقييم {ratingScore} أو أكثر )</span></h2>
                <Svgs name={'star'} styling={ratingScore > 0 ? true : false} on_click={() => {if(ratingScore === 0){ setRatingScore(1) } else { setRatingScore(0) }}}/>
                <Svgs name={'star'} styling={ratingScore > 1 ? true : false} on_click={() => setRatingScore(2)}/>
                <Svgs name={'star'} styling={ratingScore > 2 ? true : false} on_click={() => setRatingScore(3)}/>
                <Svgs name={'star'} styling={ratingScore > 3 ? true : false} on_click={() => setRatingScore(4)}/>
                <Svgs name={'star'} styling={ratingScore > 4 ? true : false} on_click={() => setRatingScore(5)}/>
            </div>

            <button style={{ width: '100%', marginTop: 32, borderRadius: 8 }} onClick={() => setTriggerFetch(!triggerFetch)}>ابحث</button>

        </div>
        
    </div>
  )
}

export default Filter
