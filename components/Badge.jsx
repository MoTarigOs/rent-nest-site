'use client';
import Svgs from "@utils/Svgs";
import Image from "next/image";
import LogoImage from '@assets/images/image_as_logo2.webp';
import '../styles/components_styles/Badge.scss';
import { useState } from "react";

const Badge = ({ isEnglish, myStyle, isDeal }) => {
    const [isExpand, setIsExpand] = useState(false);

    if(isDeal) return (
      <div className="DealBadge disable-text-copy" dir={isEnglish ? 'ltr' : 'rtl'} style={myStyle}>
        {isEnglish ? 'Special Deal' : 'عرض خاص'}
      </div>
    );

  return (
    <div className="Badge disable-text-copy" onClick={() => setIsExpand(!isExpand)}
        dir={isEnglish ? 'ltr' : 'rtl'} style={myStyle}>

        <div className="mainBadgeDiv">
            <Image src={LogoImage} width={24} height={24}/>
            <div className="badgeTexts">
                <strong>{isEnglish ? 'Rent Nest Warranty' : 'ضمان Rent Nest'}</strong>
                <p>{isEnglish ? 'We guarantee the accuracy of the information and the cleanliness of the place.' : 'نضمن لك صحة المعلومات ونظافة المكان'}</p>
            </div>
            <Svgs name={'dropdown arrow'}/>
        </div>
      
      <div className="expBadgeContainer" style={isExpand ? { display: 'flex' } : { margin: 0 }}>

        <div className="expandedBadgeTexts">
          <div className="isMobileBadgeDiv">
            <div className="badgeHeader">
              <Svgs name={'cross'} on_click={() => setIsExpand(false)}/>
              <p>{isEnglish ? 'Rent Nest Warranty' : 'ضمان Rent Nest'}</p>
            </div>
            <Image src={LogoImage}/>
            <strong>{isEnglish ? 'Dear Guest' : 'ضيفنا العزيز'}</strong>
          </div>
          <h3>{isEnglish ? 'We guarantee the accuracy of the information on this page and the cleanliness of the place. If the information does not match 80% or you find the place unclean, we will provide you with one of the options.' : 'نضمــن لـك صحة المعلومات فـي هذه الصفحـة ونضمـن لك نظافة المكان و فـي حال لـم تطابق المعلومــات 80% أو وجــدت المكــان غيــر نـظيــف نوفر لك أحد الخيارات'}</h3>
          <ul>
              <li>{isEnglish ? 'Book an alternative with the same or better specifications.' : 'حجز بديل بنفس المواصفات أو أفضل'}</li>
              <li>{isEnglish ? 'We cancel the reservation and refund the amount regardless of the cancellation and refund policy.' : 'نلغي الحجز و نسترجع المبلغ بغض النظر عن سياسة الإلغاء و الإسترجاع'}</li>
          </ul>
          <button onClick={() => setIsExpand(false)}>{isEnglish ? 'Ok' : 'موافق'}</button>
        </div>
      </div>
    </div>
  )
};

export default Badge;
