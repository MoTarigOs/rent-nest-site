import '@styles/components_styles/Card.css';
import Image from 'next/image';
import RatingStar from '@assets/icons/rating.png';
import ImagesShow from './ImagesShow';
import Link from 'next/link';
import { JordanCities, testImage } from '@utils/Data';
import { getNameByLang } from '@utils/Logic';

const Card = ({ item, type, isReport, isEnglish }) => {

    const handleWishList = () => {};

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
    }

    const getBtnName = () => {
      switch(type){
        case 'myProp':
          return isEnglish ? 'Edit offer' : 'تعديل العرض';
        default:
          return isEnglish ? 'View details' : 'شاهد التفاصيل';
      }
    };

    if(!item){
      return (<div></div>)
    }

  return (

    <div className='card' style={{ width: '100%' }}>

        <ImagesShow isEnglish={isEnglish} images={item.images} itemId={item._id} handleWishList={handleWishList}/>

        <div className='rateanddiscount'>

          <strong><Image src={RatingStar} alt='rating star image'/>{Number(item?.ratings?.val).toFixed(2)} ({item?.ratings?.no})</strong> 

          <h4 style={{ display: item?.discount?.percentage > 0 ? null : 'none' }}>
            {isEnglish ? 'discount' : 'خصم'} {item?.discount?.percentage}%
          </h4>

        </div>

        <h2>{item.title}</h2>

        <h3>{isEnglish 
          ? JordanCities.find(i => i.value === item.city)?.value
          : JordanCities.find(i => i.value === item.city)?.arabicName}, 
          {item.neighbourhood}</h3>

        <h4><span>${item.price}</span>/{isEnglish ? 'Night' : 'اليوم'}</h4>

        {type == 'myProp' && <>
        <span id='visible-span' className={item.visible ? 'visible-span selected-card-span' : 'visible-span'}>{item.visible ? isEnglish ? 'Visible' : 'مرئي' : isEnglish ? 'Hidden' : 'مخفي'}</span>
        <span id='checked-span' className={item.checked ? 'checked-span selected-card-span' : item.isRejected ? 'checked-span selected-reject-card-span' : 'checked-span'}>{item.checked ? isEnglish ? 'Accepted' : 'تم قبوله' : item.isRejected ? isEnglish ? 'Rejected' : 'مرفوض' : isEnglish ? 'Under revision' : 'تحت المراجعة'}</span>
        </>}

        <Link href={getUrl()}>{getBtnName()}</Link>
      
    </div>
  )
}

export default Card
