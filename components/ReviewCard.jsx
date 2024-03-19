'use client';

import '@styles/components_styles/ReviewCard.css';
import Svgs from '@utils/Svgs';
import Image from 'next/image';

const ReviewCard = ({ item }) => {
  return (
    <li className='reviewCard'>
      
      <div>
        <Image src={item.pic}/>
        <h3>{item.username}</h3>
        <Svgs name={'star'} styling={item.rating > 0 ? true : false}/>
        <Svgs name={'star'} styling={item.rating > 1 ? true : false}/>
        <Svgs name={'star'} styling={item.rating > 2 ? true : false}/>
        <Svgs name={'star'} styling={item.rating > 3 ? true : false}/>
        <Svgs name={'star'} styling={item.rating > 4 ? true : false}/>
      </div>

      <p>{item.text}</p>
      
    </li>
  )
};

export default ReviewCard;
