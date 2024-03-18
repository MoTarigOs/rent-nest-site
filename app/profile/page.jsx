'use client';

import { useParams } from 'next/navigation';
import './Profile.css';
import { useContext, useEffect, useState } from 'react';
import { Context } from '@utils/Context';
import Card from '@components/Card';
import { getOwnerProperties } from '@utils/api';

const page = () => {

    const { id } = useParams();
    const { userId, userUsername } = useContext(Context);

    const [isProfileDetails, setIsProfileDetails] = useState(true);
    const [isItems, setIsItems] = useState(false);
    const [isFavourites, setIsFavourites] = useState(false);
    const [isSignOut, setIsSignOut] = useState(false);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [loadingItems, setLoadingItems] = useState(false);
    const [itemsArray, setItemsArray] = useState([]);

    const settingItems = async() => {

      setLoadingItems(true);

      try {
        
        const res = await getOwnerProperties();

        if(res.success !== true){
          setLoadingItems(false);
          return;
        };

        setItemsArray(res.dt);
        setLoadingItems(false);

      } catch (err) {
        console.log(err);
        setLoadingItems(false);
      }

    };
    
    useEffect(() => {
      if(isItems === true){
        console.log('idItems triggered');
        settingItems();
      }
    }, [isItems]);

  return (
    <div className='profile'>

        <div className="details">
          
          <label id='username'>{userUsername}</label>

          <p id='underusername'>{'الملف الشخصي الخاص بك'}</p>

          <ul className='tabButtons'>
            <li className={isProfileDetails && 'selectedTab'} onClick={() => {setIsProfileDetails(true); setIsItems(false); setIsFavourites(false); setIsSignOut(false)}}>بيانات الملف الشخصي</li>
            <li className={isItems && 'selectedTab'} onClick={() => {setIsProfileDetails(false); setIsItems(true); setIsFavourites(false); setIsSignOut(false)}}>المعروضات</li>
            <li className={isFavourites && 'selectedTab'} onClick={() => {setIsProfileDetails(false); setIsItems(false); setIsFavourites(true); setIsSignOut(false)}}>المفضلة</li>
            <li className={isSignOut && 'selectedTab'} onClick={() => {setIsProfileDetails(false); setIsItems(false); setIsFavourites(false); setIsSignOut(true)}}>تسجيل الخروج</li>
          </ul>

          <ul className='profileDetails' style={{ display: !isProfileDetails && 'none' }}>
            
          </ul>

          <ul className='itemsOffered' style={{ display: !isItems && 'none' }}>
            {itemsArray.map((item) => (
                <li key={item._id}><Card item={item}/></li>
            ))}
          </ul>

        </div>

    </div>
  )
}

export default page
