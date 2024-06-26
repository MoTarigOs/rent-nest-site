import '@styles/components_styles/Card.scss';
import Image from 'next/image';
import RatingStar from '@assets/icons/rating.png';
import Link from 'next/link';
import { JordanCities, currencyCode } from '@utils/Data';
import dynamic from 'next/dynamic';
const ImagesShow = dynamic(() => import('./ImagesShow'), { ssr: false });

const Card = ({ item, type, isVertical, isEnglish, handleWishList }) => {

    const getUrl = () => {
      switch(type){
        case 'myProp':
          return `${isEnglish ? '/en' : ''}/edit-prop?id=${item._id}`;
        case 'reports':
          return `${isEnglish ? '/en' : ''}/view/${item?.title?.replaceAll(' ', '-')}?id=${item._id}&isReport=true`;
        case 'reviews':
          return `${isEnglish ? '/en' : ''}/view/${item?.title?.replaceAll(' ', '-')}?id=${item._id}&isReport=true`;
        default:
          return `${isEnglish ? '/en' : ''}/view/${item?.title?.replaceAll(' ', '-')}?id=${item._id}`;
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
      if(item?.prices?.daily) return isEnglish ? 'Day' : 'اليوم';
      if(item?.prices?.weekly) return isEnglish ? 'Week' : 'الاسبوع';
      if(item?.prices?.monthly) return isEnglish ? 'Month' : 'الشهر';
      if(item?.prices?.seasonly) return isEnglish ? 'Season' : 'الموسم';
      if(item?.prices?.yearly) return isEnglish ? 'Year' : 'السنة';
      return '';
    };

    const getPrice = () => {
      return item?.prices?.daily || item?.prices?.weekly 
        || item?.prices?.monthly
        || item?.prices?.seasonly || item?.prices?.yearly;
    };

    if(!item){
      return (<div></div>)
    };

  return (

    <div dir={isEnglish ? 'ltr' : undefined} className={`card ${isVertical ? 'vertical-view' : undefined}`} style={{ width: '100%' }}>

        {!isVertical 
          ? <ImagesShow type={'card'} isEnglish={isEnglish} images={item.images} itemId={item._id} handleWishList={handleWishList} isVertical={isVertical}/>
          : <div className='vertical-img' style={{ padding: 0 }}><Image src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${item?.images[0]}`} width={200} height={162}/></div>}

        <div className='card-content' style={{ margin: 0 }}>

          <div className='rateanddiscount'>

              <strong><Image src={RatingStar} alt='rating star image'/>{Number(item?.ratings?.val).toFixed(2)} ({item?.ratings?.no})</strong> 

              <h4 style={{ display: item?.discount?.percentage > 0 ? null : 'none' }}>
                {isEnglish ? 'discount' : 'خصم'} {item?.discount?.percentage}%
              </h4>

          </div>

          <h2>{isEnglish ? item.en_data?.titleEN || item.title : item.title}</h2>

          <h3>{isEnglish 
          ? JordanCities.find(i => i.value === item.city)?.value
          : JordanCities.find(i => i.value === item.city)?.arabicName}, {' '}
          {isEnglish ? (item.en_data?.neighbourEN || item.neighbourhood) : item.neighbourhood}</h3>

          <h4><span style={isEnglish ? { marginRight: 2 } : { marginLeft: 2 }}>
            {getPrice()} {currencyCode(isEnglish)} {' / '}</span> {getPriceReservationType()}</h4>
          
        </div>

        {type == 'myProp' && <>
        <span id='visible-span' className={item.visible ? 'visible-span selected-card-span' : 'visible-span'}>{item.visible ? isEnglish ? 'Visible' : 'مرئي' : isEnglish ? 'Hidden' : 'مخفي'}</span>
        <span id='checked-span' className={item.checked ? 'checked-span selected-card-span' : item.isRejected ? 'checked-span selected-reject-card-span' : 'checked-span'}>{item.checked ? isEnglish ? 'Accepted' : 'تم قبوله' : item.isRejected ? isEnglish ? 'Rejected' : 'مرفوض' : isEnglish ? 'Under revision' : 'تحت المراجعة'}</span>
        </>}

        <Link className='card-btn-desktop' target={'_blank'} href={getUrl()} style={!isVertical ? undefined : {
          position: 'absolute', width: '100%', height: '100%',
          background: 'transparent', color: 'transparent',
        }}>{getBtnName()}</Link>

        <Link className='card-btn-mobile' href={getUrl()} style={!isVertical ? undefined : {
          position: 'absolute', width: '100%', height: '100%',
          background: 'transparent', color: 'transparent',
        }}>{getBtnName()}</Link>
      
    </div>
  )
}

export default Card
