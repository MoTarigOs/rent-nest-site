'use client';

import '@styles/components_styles/Notif.css';
import { Context } from '@utils/Context';
import Link from 'next/link';
import { useContext, useState } from 'react';

const Notif = ({ isEnglish }) => {

    const { userId, notifications } = useContext(Context);
    const [notifsArray, setNotifArray] = useState([]);  
    const [settingNotifs, setSettingNotifs] = useState(false);  

    if(!notifications?.length > 0)
        return <></>
        
    const setNotifs = async() => {

        try {
            // setSettingNotifs(true);
            notifsArray.push(notifications);
        } catch (err) {
            console.log(err);
        }

    };

    const HostRequestAccept = () => {
        return(
            <div className='host-request'>
                <p>{isEnglish ? 'Your account has been converted into an advertised account on the platform' : 'تم تحويل حسابك الى حساب معلن على المنصة'}</p>
                <Link href='/add'>{isEnglish ? 'Add Property' : 'اضافة عقار'}</Link>
            </div>
        )
    };

    const GetComponent = ({ type }) => {
        switch(type){
            case 'converted-to-host':
                return <HostRequestAccept />;
            default:
                return <></>
        }
    };

  return (
    <div className='notif-container'>
      {notifications.map((item) => (
        <GetComponent type={item.typeOfNotif}/>
      ))}
    </div>
  )
};

export default Notif;
