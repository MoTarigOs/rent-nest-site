import '@styles/components_styles/Card.css';
import Image from 'next/image';
import RatingStar from '@assets/icons/rating.png';
import ImagesShow from './ImagesShow';
import Link from 'next/link';
import { JordanCities, testImage } from '@utils/Data';

const Card = ({ images, item }) => {

    const handleWishList = () => {};

    const LandingImagesArray = [
      { _id: '0', title: 'عيش التجربة الأفضل', desc: 'استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية', btnTitle: 'تصفح قائمة البيوت', image: testImage() },
      { _id: '1', title: 'عيش التجربة الأفضل', desc: 'استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية', btnTitle: 'تصفح قائمة البيوت', image: testImage() },
      { _id: '2', title: 'عيش التجربة الأفضل', desc: 'استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية', btnTitle: 'تصفح قائمة البيوت', image: testImage() },
      { _id: '3', title: 'عيش التجربة الأفضل', desc: 'استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية', btnTitle: 'تصفح قائمة البيوت', image: testImage() },
    ]

  return (

    <div className='card'>

        <ImagesShow images={item.images} handleWishList={handleWishList}/>

        <div className='rateanddiscount'>

          <strong><Image src={RatingStar} alt='rating star image'/>{item?.ratings?.val} ({item?.ratings?.no})</strong> 

          <h4>خصم {item?.discount?.percentage}%</h4>

        </div>

        <h2>{item.title}</h2>

        <h3>{JordanCities.find(i => i.value === item.city)?.arabicName}, {item.neighbourhood}</h3>

        <h4><span>${item.price}</span>/اليوم</h4>

        <Link href={`/view/${item.title.replaceAll(' ', '-')}?id=${item._id}`}>شاهد تفاصيل</Link>
      
    </div>
  )
}

export default Card
