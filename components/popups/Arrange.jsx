'use client';

import '@styles/components_styles/Arrange.css';

const Arrange = ({ isArrange, setIsArrange, arrangeValue, setArrangeValue }) => {

    const arranges = [
        { _id: '0', name: 'default', arabicName: 'افتراضي' },
        { _id: '1', name: 'address', arabicName: 'الأقرب الى موقعي' },
        { _id: '2', name: 'ratings', arabicName: 'الأعلى تقييما' },
        { _id: '3', name: 'low-price', arabicName: 'الأقل سعرا' },
        { _id: '4', name: 'high-price', arabicName: 'الأعلى سعرا' }
    ]

    const RightIconSpan = () => {
        return <span id='righticonspan'/>
    }

  return (
    <div className='arrangeWrapper' style={{ display: !isArrange && 'none' }}>

        <div id='bgDiv' onClick={() => setIsArrange(false)}></div>

        <div className='arrange'>

            <div className='arrangeHeader'></div>

            <ul>
                {arranges.map((arng) => (
                    <li onClick={() => {
                        setArrangeValue(arng.name);
                        setIsArrange(false);
                    }}>{arng.arabicName} {arrangeValue === arng.name && <RightIconSpan />}</li>
                ))}
            </ul>

            </div>

    </div>
  )
}

export default Arrange
