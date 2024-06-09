'use client';

import '@styles/components_styles/Arrange.scss';
import { useEffect } from 'react';

const Arrange = ({ isEnglish, isArrange, setIsArrange, setTriggerFetch, triggerFetch, arrangeValue, setArrangeValue }) => {

    const arranges = [
        { _id: '0', name: 'default', arabicName: 'افتراضي' },
        { _id: '1', name: 'address', arabicName: 'الأقرب الى موقعي' },
        { _id: '2', name: 'ratings', arabicName: 'الأعلى تقييما' },
        { _id: '3', name: 'low-price', arabicName: 'الأقل سعرا' },
        { _id: '4', name: 'high-price', arabicName: 'الأعلى سعرا' }
    ];

    const RightIconSpan = () => {
        return <div id='righticonspan'><span /></div>
    }

    useEffect(() => {
        setTriggerFetch(!triggerFetch);
    }, [arrangeValue]);

  return (
    <div className='arrangeWrapper' style={{ display: !isArrange ? 'none' : undefined }}>

        <div id='bgDiv' onClick={() => setIsArrange(false)}></div>

        <div className='arrange'>

            <div className='arrangeHeader'>
                {isEnglish ? 'Sort Results' : 'ترتيب النتائج'}
            </div>

            <ul>
                {arranges.map((arng, index) => (
                    <li key={index} onClick={() => {
                        setArrangeValue(arng.name === 'default' ? '' : arng.name);
                        setIsArrange(false);
                    }} className={(arrangeValue === arng.name || (arng?._id === '0' && arrangeValue === '')) ? 'selectedCatagory' : undefined}>
                        {isEnglish ? arng.name.replace('-', ' ') : arng.arabicName} 
                        <RightIconSpan />
                    </li>
                ))}
            </ul>

            </div>

    </div>
  )
};

export default Arrange;
