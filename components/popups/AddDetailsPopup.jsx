'use client';

import CustomInputDiv from '@components/CustomInputDiv';
import '@styles/components_styles/AddDetailsPopup.scss';
import Svgs from '@utils/Svgs';
import HeaderPopup from './HeaderPopup';
import { useContext, useEffect, useState } from 'react';
import { Context } from '@utils/Context';
import { getNames, roomTypesArray } from '@utils/Data';

const AddDetailsPopup = ({ 
    setIsShow, setArray, type, array, baseArr, 
    setIsAddDetails, sections, setAccompany,
    accompany, isEnglish, isVehicles, isSingleSelect,
    initialValueIndex, isNotFacilities, detailsError,
    isUndefinedElement
}) => {

    const [trigger, setTrigger] = useState(false);
    const [isArrayDiv, setIsArrayDiv] = useState(false);
    const [isAccompaynDiv, setIsAccompanyDiv] = useState(false);
    const { isMobile, englishFont, arabicFont } = useContext(Context);
    
    const editArray = (index, e, editSection) => {
        let myObj = array[index];
        if(editSection === 'capacity') myObj.capacity = Number(e.target.value);
        if(editSection === 'singleBeds') myObj.single_beds = Number(e.target.value);
        if(editSection === 'doubleBeds') myObj.double_beds = Number(e.target.value);
        if(editSection === 'roomType') myObj.room_type = e;
        if(editSection === 'depth') myObj.depth = Number(e.target.value);
        if(editSection === 'dimensionX') myObj.dim = { x: Number(e.target.value), y: array[index].dim?.y };
        if(editSection === 'dimensionY') myObj.dim = { y: Number(e.target.value), x: array[index].dim?.x };
        if(Object.keys(myObj)?.length > 0) setArray(array.map((ob,i) => i === index ? myObj : ob));
        setTrigger(!trigger);
    };

    const popFromArray = (index) => {
        setArray(array.filter((_, i) => i !== index));
    };

    const getPropType = () => {
        if(isVehicles) return isEnglish ? 'The Vehicle' : 'السيارة';
        else return isEnglish ? 'The Property' : 'العقار';
    };

    const isNeedArrayDiv = () => {
        if(type !== 'rooms' && !sections?.includes('num') && !sections?.includes('roomType'))
            return false;
        return true;
    };

    const getSearchInputPlaceholder = () => {
        return isEnglish ? 'Search for a facility' : 'ابحث عن مرفق';
    };

    const getSingleSelectHeaderPopupType = () => {
        switch(type){
            case 'add-city':
                return 'add-city';
            case 'cancellation':
                return 'customers';
            default:
                return 'customers';
        }
    };

    useEffect(() => {
        setIsArrayDiv(!sections?.includes('selections'));
        setIsAccompanyDiv(!isNeedArrayDiv());
    }, []);

  return (
    <div className='detailsPopupWrapper' dir={isEnglish ? 'ltr' : undefined}>

        <span id='close-dtl-span' onClick={() => {
            setIsShow(false); 
            if(setIsAddDetails) setIsAddDetails(false);
            console.log('clicked');
        }}/>

        <div className='detailsPopup'>

            <div className='dtl-header disable-text-copy'>
                <h2 style={isEnglish ? {
                    marginLeft: 'unset', marginRight: 'auto'
                } : undefined}>{isEnglish ? 'Add details about ' : 'اكتب تفاصيل عن'} {getPropType()}</h2>
                <Svgs name={'cross'} on_click={() => {
                    setIsShow(false); 
                    if(setIsAddDetails) setIsAddDetails(false);
                }}/>
            </div>
            
            {isNeedArrayDiv() && <div className='main-dtl-header disable-text-copy' style={{ marginBottom: isArrayDiv ? 24 : 0 }}
                onClick={() => setIsArrayDiv(!isArrayDiv)}>
                <h3 style={{ margin: 0, fontWeight: 600 }}>{getNames('mul', false, isEnglish, type)}
                <span>{isArrayDiv ? '-' : '+'}</span>
                </h3>
            </div>}

            {isNeedArrayDiv() && <div className='main-dtl-array' style={!isArrayDiv ? { display: 'none', padding: 0, margin: 0 } : undefined}>

                {array.map((item, index) => (
                    <div className='room-dtl'>
                        <h4 style={{ width: '100%' }}>{getNames('one', false, isEnglish, type)} {index + 1} <Svgs name={'delete'} on_click={() => popFromArray(index)}/></h4>
                        {sections?.includes('capacity') && <CustomInputDiv min={0} type={'number'} myStyle={{ marginBottom: 16 }} title={isEnglish ? 'Capacity (Number of people)' : 'السعة (عدد الأشخاص)'} placholderValue={isEnglish ? 'Capacity' : 'السعة أو عدد الأشخاص'} value={item?.capacity} listener={(e) => editArray(index, e, 'capacity')}/>}
                        {type === 'rooms' && <CustomInputDiv min={0} type={'number'} myStyle={{ marginBottom: 16 }} title={isEnglish ? 'Number of single beds' : 'عدد الأسرّة المفردة'} placholderValue={isEnglish ? 'Number of single beds' : 'عدد الأسرّة المفردة'} value={item?.single_beds} listener={(e) => editArray(index, e, 'singleBeds')}/>}
                        {type === 'rooms' && <CustomInputDiv min={0} type={'number'} myStyle={{ marginBottom: 16 }} title={isEnglish ? 'Number of double beds' : 'عدد الأسرّة الماستر'} placholderValue={isEnglish ? 'Number of double beds' : 'عدد الأسرّة الماستر'} value={item?.double_beds} listener={(e) => editArray(index, e, 'doubleBeds')}/>}
                        {sections?.includes('roomType') && <div className='room-type'>
                            <h4>{isEnglish ? 'Room Type' : 'نوع الغرفة'}</h4>
                            <HeaderPopup type={'selections'} isSingleSelection
                            customArray={roomTypesArray(isEnglish)} selectedCustom={item?.room_type} isEnglish={isEnglish}
                            isNotSearchBar setSelectedCustom={(choosen) => editArray(index, choosen, 'roomType')} isCustom/>
                        </div>}
                        {sections?.includes('dim') && <div className='dimensionDiv' style={{ width: '100%' }}>
                            <CustomInputDiv title={(isEnglish ? 'Length' : 'طول ') + getNames('one', true, isEnglish, type)} 
                            listener={(e) => editArray(index, e, 'dimensionX')} type={'number'} 
                            min={0} max={100000} value={item.dim?.x} placholderValue={isEnglish ? 'Select length' : 'حدد الطول'}
                            myStyle={{width: '49%', flex: 1, marginBottom: 0}}/>
                            <CustomInputDiv title={(isEnglish ? 'Width ' : 'عرض ') + getNames('one', true, isEnglish, type)} 
                            listener={(e) => editArray(index, e, 'dimensionY')} type={'number'} 
                            min={0} max={100000} value={item.dim?.y} placholderValue={isEnglish ? 'Select width' : 'حدد العرض'}
                            myStyle={{width: '49%', flex: 1, marginBottom: 0}}/>
                        </div>}
                        {sections?.includes('depth') && <CustomInputDiv myStyle={{ margin: '16px 0' }} 
                        title={(isEnglish ? 'depth ' : 'عمق ') + getNames('one', true, isEnglish, type)} placholderValue={(isEnglish ? 'Depth of ' : 'عمق ') + getNames('one', true, isEnglish, type)} 
                        value={item?.depth} type={'number'} min={0}
                        listener={(e) => editArray(index, e, 'depth')}/>}
                        {detailsError?.includes(` ${type}.${index} `) && <p id='error'>{isEnglish ? 'There is an error in one of the data, do not use invalid characters such as &,' : 'يوجد خطأ بأحد البيانات, لا تستخدم حروف غير صالحة مثل &,'} {'>'}, " {isEnglish ? '...etc' : '...الخ'}</p>}
                    </div>
                ))}
                        
                <button style={{ margin: 0, background: isMobile ? 'var(--secondColor)' : undefined, color: isMobile ? 'white' : undefined }} 
                className={isEnglish ? englishFont : arabicFont} onClick={() => {
                    setArray([...array, {}]);
                }}>{isEnglish ? 'Add' : 'اضافة'} {getNames('one', false, isEnglish, type)}</button>

            </div>}

            {sections?.includes('selections') && isNeedArrayDiv() && <span id='span-hr'/>}
            
            {sections?.includes('selections') && <div className='main-dtl-header disable-text-copy' style={{ marginBottom: isAccompaynDiv ? 24 : 0 }}
                onClick={() => setIsAccompanyDiv(!isAccompaynDiv)}>
                <h3 style={{ margin: 0, fontWeight: 600 }}>
                    {(type !== 'near_places' && type !== 'facilities' && type !== 'add-city' && !isNotFacilities) && <>{isEnglish ? '' : 'مرافق'} {getNames('one', true, isEnglish, type)} {isEnglish ? 'facilities' : ''}</>}
                    {type === 'near_places' && (isEnglish ? 'Near Places' : 'الأماكن القريبة')}
                    {type === 'facilities' && (isEnglish ? 'Facilities' : 'المرافق')} 
                    {type === 'add-city' && (isEnglish ? 'Choose City' : 'اختيار مدينة')}
                    {isNotFacilities && getNames('', null, isEnglish, type)}
                    <span>{isAccompaynDiv ? '-' : '+'}</span>
                </h3>
            </div>}

            {sections?.includes('selections') && <div className='selections-dtl' style={!isAccompaynDiv ? { display: 'none', padding: 0, margin: 0 } : undefined}>

                {detailsError?.includes(` ${type}.accompany `) && <p style={{ marginBottom: 16 }} id='error'>{isEnglish ? 'There is an error in the selected data, please select from below' : 'يوجد خطأ بالبيانات المختارة, الرجاء الاختيار من الأسفل'}</p>}

                <HeaderPopup type={isSingleSelect ? getSingleSelectHeaderPopupType() : 'selections'} 
                customArray={baseArr} selectedCustom={isSingleSelect ? array : accompany}
                setSelectedCustom={isSingleSelect ? setArray : setAccompany} initialValueIndex={initialValueIndex} isCustom
                setIsCustom={()=>{}} myStyle={{ maxHeight: 'unset', height: 'fit-content' }} 
                searchBarPlaceHolder={getSearchInputPlaceholder()} isUndefinedElement={isUndefinedElement}
                itemCity={array} setItemCity={setArray} isEnglish={isEnglish}/>

            </div>}

        </div>

    </div>
  )
};

export default AddDetailsPopup;
