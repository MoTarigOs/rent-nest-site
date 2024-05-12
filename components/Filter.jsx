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
import CustomInputDiv from './CustomInputDiv';
import RangeSlider from 'react-range-slider-input';
import "react-range-slider-input/dist/style.css";
import { bathroomFacilities, customersTypesArray, facilities, kitchenFacilities, poolType } from '@utils/Facilities';

const Filter = ({ 
    isEnglish, type, isFilter, setIsFilter, triggerFetch, setTriggerFetch 
}) => {

    //setRatingScore

    const { 
        setCurrentMinPrice, setCurrentMaxPrice,
        ratingScore, setRatingScore,
        searchText, setSearchText, setCategoryArray, categoryArray,
        isMobile,
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
        kitchenFilter, setKitchenFilter, rangeValue, setRangeValue
    } = useContext(Context);

    const [loaded, setLoaded] = useState(false);
    const [showQuick, setShowQuick] = useState(false);
    const [showRating, setShowRatings] = useState(false);
    const [showPropTypes, setShowPropType] = useState(false);
    const [showCapacity, setShowCapcity] = useState(false);
    const [showPool, setShowPool] = useState(false);
    const [showCategoriesArray, setShowCategoriesArray] = useState(false);
    const [showCompanians, setShowCompanians] = useState(false);
    const [showKitchen, setShowKitchen] = useState(false);
    const [showPrice, setShowPrice] = useState(false);
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [showBedrooms, setShowBedrooms] = useState(false);
    const [showBath, setShowBath] = useState(false);

    const deleteFilters = () => {
        setRangeValue([]);
        setQuickFilter([]);
        setnNeighbourSearchText();
        setnNeighbourSearchText('');
        setUnitCode('');
        setRangeValue([0, maximumPrice]);
        setBedroomFilter({ num: null, single_beds: 0, double_beds: 0 });
        setCapcityFilter(null);
        setPoolFilter([]);
        setCustomersTypesFilter([]);
        setCompaniansFilter([]);
        setBathroomsNumFilter(null);
        setBathroomsCompaniansFilter([]);
        setKitchenFilter([]);
        setCategoryArray([]);
        setRatingScore(0);
    };

    useEffect(() => {
        setCurrentMinPrice(rangeValue[0]);
        setCurrentMaxPrice(rangeValue[1]);
    }, [rangeValue]);

    useEffect(() => {
        setLoaded(true);
    }, []);

    const RightIconSpan = () => {
        return <div id='righticonspan'><span /></div>
    }

    const filters = [
        { idName: 'quick', isShow: showQuick, setIsShow: setShowQuick, enTitle: 'Quick filtering', arTitle: 'فلترة سريعة', baseArr: [
            { idName: 'discounts', enName: 'Best offers & discounts', arabicName: 'العروض و الخصومات' },
            { idName: 'free-cancel', enName: 'Free cancellation', arabicName: 'الغاء مجاني' }, 
            { idName: 'no-insurance', enName: 'Don not require insurance', arabicName: 'لا يطلب تأمين' }
        ], array: quickFilter, setArray: setQuickFilter },
        { idName: 'ratings', isShow: showRating, setIsShow: setShowRatings, enTitle: 'Ratings', arTitle: 'التقييم', baseArr: [
            { value: 4.5, enName: 'Excellent (4.5+)', arabicName: 'ممتاز (4.5 و أكثر)' },
            { value: 3.5, enName: 'Very Good (3.5+)', arabicName: 'جيد جدا (3.5 و أكثر)' },
            { value: 3, enName: 'Good (3+)', arabicName: 'جيد (3 و أكثر)' },
            { value: 2.5, enName: 'Acceptable (2.5+)', arabicName: 'مقبول (2.5 و أكثر)' }
        ], array: ratingScore, setArray: setRatingScore },
        { idName: 'prop-type', enTitle: 'Property type', arTitle: 'نوع العقار', baseArr: [...ProperitiesCatagories, VehicleCatagories[0]],
            array: categoryArray, setArray: setCategoryArray, isShow: showPropTypes, setIsShow: setShowPropType },
        { idName: 'capacity', enTitle: 'Capacity', arTitle: 'السعة', array: capacityFilter, setArray: setCapcityFilter, baseArr: [
            { id: 0, enName: 'All', arabicName: 'الكل' },
            { min: 0, max: 5, id: 1, enName: '0 - 5 persons', arabicName: '0 - 5 أشخاص' },
            { min: 5, max: 10, id: 2, enName: '5 - 10 persons', arabicName: '5 - 10 أشخاص' },
            { min: 10, max: 20, id: 3, enName: '10 - 20 persons', arabicName: '10 - 20 أشخاص' },
            { min: 20, max: 30, id: 4, enName: '20 - 30 persons', arabicName: '20 - 30 أشخاص' },
            { min: 30, max: null, id: 5, enName: '30+ persons', arabicName: '30+ أشخاص' }
        ], isShow: showCapacity, setIsShow: setShowCapcity },
        { idName: 'pool', enTitle: 'The Pool', arTitle: 'المسبح', array: poolFilter, setArray: setPoolFilter, 
            baseArr: poolType(isEnglish), isShow: showPool, setIsShow: setShowPool },
        { idName: 'pool categories', enTitle: 'Categories', arTitle: 'الفئات', baseArr: customersTypesArray(isEnglish), array: customersTypesFilter, 
        setArray: setCustomersTypesFilter, isShow: showCategoriesArray, setIsShow: setShowCategoriesArray },
        { idName: 'pool facilities', enTitle: 'Facilities', arTitle: 'المرافق', baseArr: facilities(isEnglish), array: companiansFilter, 
        setArray: setCompaniansFilter, isShow: showCompanians, setIsShow: setShowCompanians },
        { idName: 'pool kitchen', enTitle: 'The Kitchen', arTitle: 'المطبخ', baseArr: kitchenFacilities(isEnglish), array: kitchenFilter, 
        setArray: setKitchenFilter, isShow: showKitchen, setIsShow: setShowKitchen },
    ];

    const FilterSectionMultipleSelections = ({ item }) => {
        if(!item) return<></>
        return (
            <div className="catagory">
                <h2 className='disable-text-copy' onClick={() => item.setIsShow(!item.isShow)}>{isEnglish ? item.enTitle : item.arTitle}  <h3>{item.isShow ? '-' : '+'}</h3></h2>
                <ul style={{ display: !item.isShow ? 'none' : undefined}}>
                    {item.baseArr?.map((ctg, index) => (
                        <li key={index} onClick={() => {
                            if(item.idName.includes('pool') ? item.array.includes(ctg) : item.array.find(item.idName !== 'prop-type' ? i => i.idName === ctg.idName : i => i.id === ctg.id)){
                                item?.setArray(item.array.filter(item.idName !== 'prop-type' ? item.idName.includes('pool') ? i => i !== ctg : i => i.idName !== ctg.idName : i => i.id !== ctg.id));
                            } else {
                                item?.setArray([...item.array, ctg]);
                            }
                        }}
                            className={(item.idName !== 'prop-type' ? (item.idName.includes('pool') ? item.array?.includes(ctg) : item.array.find(i => i.idName === ctg.idName)) : item.array.find(i => i.id === ctg.id)) ? 'selectedCatagory' : undefined}
                        >
                            <RightIconSpan />
                            {item.idName.includes('pool') ? ctg : (isEnglish ? ctg.value || ctg.enName : ctg.arabicName)}
                        </li>
                    ))}
                </ul>
            </div>
        )
    };

    const FilterSectionSingleSelection = ({ item }) => {
        if(!item) return<></>
        return (
            <div className="catagory">
                <h2 className='disable-text-copy' onClick={() => item.setIsShow(!item.isShow)}>{isEnglish ? item.enTitle : item.arTitle} <h3>{item.isShow ? '-' : '+'}</h3></h2>
                <ul style={{ display: !item.isShow ? 'none' : undefined}}>
                    {item.baseArr?.map((ctg, index) => (
                        <li key={index} onClick={() => {
                            if((item.idName === 'capacity' ? item.array?.id === ctg?.id : item.array === ctg.value)) return item.setArray(null);
                            item.idName === 'capacity' ? item.setArray(ctg) : item.setArray(ctg.value)
                        }}
                            className={(item.idName === 'capacity' ? item.array?.id === ctg?.id : item.array === ctg.value)  ? 'selectedCatagory' : undefined}
                        >
                            <RightIconSpan />
                            {isEnglish ? ctg.enName : ctg.arabicName}
                        </li>
                    ))}
                </ul>
            </div>
        )
    };

    if(!loaded){
        return <></>
    }

  return (
    <div className="filterULDiv" style={{
        display: !isMobile ? (!isFilter ? 'none' : undefined) : undefined
    }} id={isMobile ? (isFilter ? 'animate-show-filter' : 'animate-hide-filter') : undefined}>
        
        <div id='bgDiv' onClick={() => setIsFilter(false)} style={{ display: !isFilter ? 'none' : undefined }}></div>

        <div className='wrapper'>

            <div className='filter-header disable-text-copy'>
                <Svgs name={'cross'} on_click={() => setIsFilter(false)}/>
                {isEnglish ? 'Filter' : 'فلتر'}
                <span onClick={deleteFilters}>{isEnglish ? 'Delete' : 'مسح'}</span>
            </div>

            <div className='filters-container'>

                <div className="price">
                    <h2 className='disable-text-copy' onClick={() => setShowPrice(!showPrice)}>{getNameByLang('السعر', isEnglish)} <h3>{showPrice ? '-' : '+'}</h3></h2>
                    {showPrice && <><RangeSlider
                        id="range-slider-gradient"
                        className="margin-lg"
                        onInput={setRangeValue}
                        min={0} max={maximumPrice}
                        defaultValue={rangeValue}
                        value={rangeValue}
                    />
                    <span>{isEnglish ? 'Min ' : 'السعر الأقل:'} {rangeValue[0]}$</span>
                    <span>{isEnglish ? 'Max ' : 'السعر الأقصى'} {rangeValue[1]}$</span></>}
                </div> 

                <FilterSectionMultipleSelections item={filters.find(i => i.idName === 'quick')}/>

                <FilterSectionSingleSelection item={filters.find(i => i.idName === 'ratings')}/>

                <div className='filterSearchDiv'>

                    <h2 className='disable-text-copy' onClick={() => setShowAdvanceSearch(!showAdvanceSearch)}>{isEnglish ? 'Advance Search' : 'البحث المتقدم'} <h3>{showAdvanceSearch ? '-' : '+'}</h3></h2>
                    
                    {showAdvanceSearch && <><CustomInputDiv title={isEnglish ? 'Write a name or description' : 'اكتب اسم أو وصف للعقار'} placholderValue={isEnglish ? 'Like: Amman resorts' : 'مثال: مخيمات عمان'}
                    listener={(e) => setSearchText(e.target.value)} value={searchText}/>
                    
                    <CustomInputDiv title={isEnglish ? 'Search by neighbouhood name' : 'اكتب اسم الحي'}
                    listener={(e) => setnNeighbourSearchText(e.target.value)} value={neighbourSearchText}/>
                    
                    <CustomInputDiv title={isEnglish ? 'Write unit code' : 'اكتب معرف الوحدة'} type={'number'}
                    listener={(e) => setUnitCode(e.target.value)} value={unitCode}/></>}

                </div>

                <FilterSectionMultipleSelections item={filters.find(i => i.idName === 'prop-type')}/>

                <div className='filterSearchDiv'>

                    <h2 className='disable-text-copy' onClick={() => setShowBedrooms(!showBedrooms)}>{isEnglish ? 'Bedrooms' : 'غرف النوم'} <h3>{showBedrooms ? '-' : '+'}</h3></h2>

                    {showBedrooms && <><CustomInputDiv title={isEnglish ? 'Desired Number of rooms' : 'عدد غرف النوم'} type={'number'} placholderValue={isEnglish ? 'Like: Amman resorts' : 'مثال: مخيمات عمان'}
                    listener={(e) => setBedroomFilter({ num: Number(e.target.value), single_beds: bedroomFilter?.single_beds, double_beds: bedroomFilter?.double_beds })} value={bedroomFilter.num}/>

                    <CustomInputDiv title={isEnglish ? 'Single beds number' : 'عدد الأسرّة المفردة'} type={'number'}
                    listener={(e) => setBedroomFilter({ num: bedroomFilter?.num, single_beds: Number(e.target.value), double_beds: bedroomFilter?.double_beds })} value={bedroomFilter.single_beds}/>

                    <CustomInputDiv title={isEnglish ? 'Double beds number' : 'عدد الأسرّة الكبيرة'} type={'number'}
                    listener={(e) => setBedroomFilter({ num: bedroomFilter?.num, single_beds: bedroomFilter?.single_beds, double_beds: Number(e.target.value) })} value={bedroomFilter.double_beds}/></>}

                </div>

                <FilterSectionSingleSelection item={filters.find(i => i.idName === 'capacity')}/>

                <FilterSectionMultipleSelections item={filters.find(i => i.idName === 'pool')}/>

                <FilterSectionMultipleSelections item={filters.find(i => i.idName === 'pool categories')}/>

                <FilterSectionMultipleSelections item={filters.find(i => i.idName === 'pool facilities')}/>

                <div className='catagory filterSearchDiv'>

                    <h2 className='disable-text-copy' onClick={() => setShowBath(!showBath)}>{isEnglish ? 'Bathrooms' : 'دورات المياه'} <h3>{showBath ? '-' : '+'}</h3></h2>

                    {showBath && <><CustomInputDiv title={isEnglish ? 'Number of bathrooms' : 'عدد دورات المياه'} type={'number'} 
                    listener={(e) => setBathroomsNumFilter(Number(e.target.value))} value={bathroomsFilterNum}/>

                    <ul>
                        {bathroomFacilities(isEnglish).map((ctg, index) => (
                            <li key={index} onClick={() => {
                                if(bathroomsCompaniansFilter.includes(ctg)){
                                    setBathroomsCompaniansFilter(bathroomsCompaniansFilter.filter(i => i !== ctg));
                                } else {
                                    setBathroomsCompaniansFilter([...bathroomsCompaniansFilter, ctg]);
                                }
                            }}
                                className={bathroomsCompaniansFilter.includes(ctg) ? 'selectedCatagory' : undefined}
                            >
                                <RightIconSpan />
                                {ctg}
                            </li>
                        ))}
                    </ul></>}

                </div>

                <FilterSectionMultipleSelections item={filters.find(i => i.idName === 'pool kitchen')}/>

            </div>

            <div className='btn-div'><button onClick={() => {
                setTriggerFetch(!triggerFetch); setIsFilter(false);
            }}>{getNameByLang('ابحث', isEnglish)}</button></div>

        </div>
        
    </div>
  )
};

export default Filter;
