'use client';

import '@styles/components_styles/Card.scss';
import Image from 'next/image';
import RatingStar from '@assets/icons/rating.png';
import Link from 'next/link';
import { JordanCities, currencyCode } from '@utils/Data';
import dynamic from 'next/dynamic';
import { useContext } from 'react';
import { Context } from '@utils/Context';
import Badge from './Badge';
const ImagesShow = dynamic(() => import('./ImagesShow'), { ssr: false });

const Card = ({ 
  item, type, isVertical, isEnglish, 
  handleWishList, setCalenderDoubleValue,
  bookDatesValues, isAdmin, isReported,
  useHooks
}) => {

    const { resType, calendarDoubleValue } = useContext(Context);

    const getUrl = () => {
      switch(type){
        case 'myProp':
          return `${isEnglish ? '/en' : ''}/${isAdmin ? 'admin-' : ''}edit-prop?id=${item._id}${isReported ? '&isReport=true' : ''}&calender=${calendarDoubleValue?.at(0)?.getTime()},${calendarDoubleValue?.at(1)?.getTime()}`;
        default:
          return `${isEnglish ? '/en' : ''}/view/${item?.title?.replaceAll(' ', '-')}?id=${item._id}&calender=${calendarDoubleValue?.at(0)?.getTime()},${calendarDoubleValue?.at(1)?.getTime()}`;
      }
    };

    const getBtnName = () => {
      switch(type){
        case 'myProp':
          return isEnglish ? 'Edit offer' : 'تعديل العرض';
        default:
          return isEnglish ? 'View details' : 'شاهد التفاصيل';
      }
    };

    const getPriceReservationType = () => {
      if(resType?.value?.toLowerCase() === 'weekly') return isEnglish ? 'Week' : 'الاسبوع';
      if(resType?.value?.toLowerCase() === 'monthly') return isEnglish ? 'Month' : 'الشهر';
      if(resType?.value?.toLowerCase() === 'seasonly') return isEnglish ? 'Season' : 'الموسم';
      if(resType?.value?.toLowerCase() === 'yearly') return isEnglish ? 'Year' : 'السنة';
      return isEnglish ? 'Day' : 'اليوم';
    };

    const getPrice = () => {

      const dayPrice = item?.prices?.daily;
      const weekPrice = item?.prices?.weekly || dayPrice * 7;
      const monthPrice = item?.prices?.monthly || weekPrice * 4.2857143;
      const seasonPrice = item?.prices?.seasonly || dayPrice + (isEnglish ? ' per Day ' : ' باليوم ');
      const yearPrice = item?.prices?.yearly || monthPrice * 12.166666667;

      if(resType?.value?.toLowerCase() === 'daily' ) return dayPrice;
      if(resType?.value?.toLowerCase() === 'weekly' ) return weekPrice;
      if(resType?.value?.toLowerCase() === 'monthly') return monthPrice;
      if(resType?.value?.toLowerCase() === 'seasonly') return seasonPrice;
      if(resType?.value?.toLowerCase() === 'yearly') return yearPrice;
      return dayPrice;

    };

    const handleBookedProp = () => {
      if(type === 'booked' && setCalenderDoubleValue) return setCalenderDoubleValue(bookDatesValues);
    };

    if(!item){
      return (<div></div>)
    };

  return (

    <div dir={isEnglish ? 'ltr' : undefined} className={`card disable-text-copy ${isVertical ? 'vertical-view' : undefined}`} style={{ width: '100%' }}>

        {!isVertical 
          ? <ImagesShow useHooks={useHooks} type={'card'} isEnglish={isEnglish} images={item.images} itemId={item._id} handleWishList={handleWishList} isVertical={isVertical} isAdmin={isAdmin}/>
          : <div className='vertical-img' style={{ padding: 0 }}><Image src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${item?.images?.at(0)}`} width={200} height={162}/></div>}

        <div className='card-content' style={{ margin: 0 }}>

          <div className='rateanddiscount'>

              <strong><Image src={RatingStar} alt='rating star image'/>{Number(item?.ratings?.val).toFixed(2)} ({item?.ratings?.no})</strong> 

              <h4 style={{ display: (item?.discount?.percentage > 0 || item.isDeal) ? null : 'none' }}>
                {!item.isDeal ? (isEnglish ? 'discount' : 'خصم') : (isEnglish ? 'Special Deal' : 'عرض خاص')} {!item.isDeal ? `${item?.discount?.percentage}%` : ''}</h4>

          </div>

          <h2>{isEnglish ? item.en_data?.titleEN || item.title : item.title}</h2>

          <h3 style={{ color: 'black' }}>{isEnglish 
          ? JordanCities.find(i => i.value === item.city)?.value
          : JordanCities.find(i => i.value === item.city)?.arabicName}, {' '}
          {isEnglish ? (item.en_data?.neighbourEN || item.neighbourhood) : item.neighbourhood}</h3>

          <h4><span style={isEnglish ? { marginRight: 2 } : { marginLeft: 2 }}>
            {getPrice()?.toFixed(2)} {currencyCode(isEnglish)} {' / '}</span> {getPriceReservationType()}</h4>
          
        </div>

        {type == 'myProp' && <>
        <span id='visible-span' className={item.visible ? 'visible-span selected-card-span' : 'visible-span'}>{item.visible ? isEnglish ? 'Visible' : 'مرئي' : isEnglish ? 'Hidden' : 'مخفي'}</span>
        <span id='checked-span' className={item.checked ? 'checked-span selected-card-span' : item.isRejected ? 'checked-span selected-reject-card-span' : 'checked-span'}>{item.checked ? isEnglish ? 'Accepted' : 'تم قبوله' : item.isRejected ? isEnglish ? 'Rejected' : 'مرفوض' : isEnglish ? 'Under revision' : 'تحت المراجعة'}</span>
        </>}

        <Link className='card-btn-desktop' target={'_blank'} href={getUrl()} style={!isVertical ? undefined : {
          position: 'absolute', width: '100%', height: '100%',
          background: 'transparent', color: 'transparent',
        }} onClick={handleBookedProp}>{getBtnName()}</Link>

        <Link className='card-btn-mobile' href={getUrl()} style={!isVertical ? undefined : {
          position: 'absolute', width: '100%', height: '100%',
          background: 'transparent', color: 'transparent',
        }} onClick={handleBookedProp}>{getBtnName()}</Link>

    </div>
  )
}

export default Card
