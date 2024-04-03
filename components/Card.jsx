import '@styles/components_styles/Card.css';
import Image from 'next/image';
import RatingStar from '@assets/icons/rating.png';
import ImagesShow from './ImagesShow';
import Link from 'next/link';
import { JordanCities, testImage } from '@utils/Data';

const Card = ({ item, type }) => {

    const handleWishList = () => {};

    const getUrl = () => {
      switch(type){
        case 'myProp':
          return `/edit-prop?id=${item._id}`;
        default:
          return `/view/${item?.title?.replaceAll(' ', '-')}?id=${item._id}`;
      }
    }

    const getBtnName = () => {
      switch(type){
        case 'myProp':
          return 'تعديل العرض';
        default:
          return 'شاهد التفاصيل';
      }
    };

    if(!item){
      return (<div></div>)
    }

  return (

    <div className='card'>

        <ImagesShow images={item.images} itemId={item._id} handleWishList={handleWishList}/>

        <div className='rateanddiscount'>

          <strong><Image src={RatingStar} alt='rating star image'/>{Number(item?.ratings?.val).toFixed(2)} ({item?.ratings?.no})</strong> 

          <h4>خصم {item?.discount?.percentage}%</h4>

        </div>

        <h2>{item.title}</h2>

        <h3>{JordanCities.find(i => i.value === item.city)?.arabicName}, {item.neighbourhood}</h3>

        <h4><span>${item.price}</span>/اليوم</h4>

        {type == 'myProp' && <>
        <span id='visible-span' className={item.visible ? 'visible-span selected-card-span' : 'visible-span'}>{item.visible ? 'مرئي' : 'مخفي'}</span>
        <span id='checked-span' className={item.checked ? 'checked-span selected-card-span' : 'checked-span'}>{item.checked ? 'تم قبوله' : 'لم يقبل'}</span>
        </>}

        <Link href={getUrl()}>{getBtnName()}</Link>
      
    </div>
  )
}

export default Card
