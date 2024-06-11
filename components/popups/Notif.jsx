'use client';

import Card from '@components/Card';
import LoadingCircle from '@components/LoadingCircle';
import '@styles/components_styles/Notif.scss';
import { Context } from '@utils/Context';
import Svgs from '@utils/Svgs';
import { deleteNotifications, getPropsFromIds } from '@utils/api';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

const Notif = ({ isEnglish, setIsShow }) => {

    const { userId, notifications, setNotifications, setIsModalOpened } = useContext(Context);
    const [runOnce, setRunOnce] = useState(false);  
    const [isNotif, setIsNotif] = useState(false);  
    const [isCloseNotif, setIsCloseNotif] = useState(false);  
    const [deleting, setDeleting] = useState(false);  
    const [notifsArray, setNotifArray] = useState([]);  

    const notifTypes = [
        'book',
        'accept-prop',
        'reject-prop',
        'delete-prop',
        'create-prop',
        'update-review',
        'new-review',
        'edit-prop',
        'email-verified',
        'password-change',
        'converted-to-host',
        '',
        '',
        '',
    ];

    const setNotifs = async() => {

        try {

            let propRelatedNofsIds = [];
            let notifs = [];
            for (let i = 0; i < notifications.length; i++) {
                if([
                    'book',
                    'accept-prop',
                    'reject-prop',
                    'create-prop',
                    'edit-prop',
                    'new-review',
                    'update-review'
                ].includes(notifications[i]?.typeOfNotif))
                    if(!propRelatedNofsIds.includes(notifications[i]?.targettedId)) propRelatedNofsIds.push(notifications[i]?.targettedId);
                    notifs.push({ id: notifications[i]?._id, typeOfNotif: notifications[i]?.typeOfNotif, targettedId: notifications[i]?.targettedId });
            }

            const res = await getPropsFromIds(propRelatedNofsIds);

            if(!res?.ok) return;

            for (let i = 0; i < notifs.length; i++) {
                if(notifs[i])
                    notifs[i].prop = res?.dt?.find(j=>j._id === notifs[i]?.targettedId);
            }

            console.log('final props: ', notifs);

            setNotifArray(notifs?.reverse());

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

    const PropRelated = ({ text, item }) => {
        return(
            <div className='prop-related'>
                <p>{text}</p>
                {item && <Card item={item} isEnglish={isEnglish} type={'myProp'} />}
            </div>
        )
    };

    const getText = (type, name) => {
        switch(type){
            case 'book':
                return isEnglish ? `Someone called ${name} Has added this unit to his reservations list. Check the customer from the Offers section in the profile.` : `شخص يسمى "${name}" قام باضافة هذه الوحدة الى قائمة الحجوزات, تفقد العميل من قسم المعروضات في الملف الشخصي.`;
            case 'accept-prop':
                return isEnglish ? 'Congratulations ✨, your unit has been accepted on the platform.' : 'تهانينا ✨ , تم قبول وحدتك على المنصة.';
            case 'reject-prop':
                return isEnglish ? 'Unfortunately, your unit was rejected by one of the officials. Please review the unit page from the button below to find out the reasons for rejection.' : 'للأسف تم رفض وحدتك هذه من قبل أحد المسؤولين, الرجاء مراجعة صفحة الوحدة من الزر تحت لمعرفة أسباب الرفض.';
            case 'create-prop':
                return isEnglish ? 'Your unit has been uploaded to the platform. We ask you to be patient until it is reviewed and accepted.' : 'لقد تم تحميل وحدتك على المنصة, نرجو منك الصبر لغاية يتم مراجعتها و قبولها.';
            case 'new-review':
                return isEnglish ? `A User ${name?.length > 0 ? 'called ' + name : ''} added a review about your unit.` : `أحد المستخدمين ${name?.length > 0 ? 'يدعى ' + name : ''} قام باضافة مراجعة عن وحدة لك.`;
            case 'update-review':
                return isEnglish ? `A User ${name?.length > 0 ? 'called ' + name : ''} updated a review he wrote about your unit.` : `أحد المستخدمين ${name?.length > 0 ? 'يدعى ' + name : ''} قام بتعديل مراجعة كتبها مسبقا عن وحدة لك.`;
            case 'edit-prop':
                return isEnglish ? 'New edit of your unit has been uploaded to the platform. We ask you to be patient until it is reviewed and accepted.' : 'لقد تم تحميل التعديل الجديد على الوحدة الى المنصة, نرجو منك الصبر لغاية يتم مراجعتها و قبولها.';
            case 'delete-prop':
                return isEnglish ? `A Unit ${name?.length > 0 ? 'with Title: "' + name + '"' : ''} had been deleted.` : `لقد تم حذف وحدة ${name?.length > 0 ? 'بعنوان "' + name + '"' : ''} من المنصة.`;
            case 'email-verified':
                return isEnglish ? 'We are pleased to inform you that your email has been verified ✨' : 'سعدنا اخبارك بأنه قد تم توثيق بريدك الالكتروني ✨';
            case 'password-change':
                return isEnglish ? 'Your password had been changed.' : 'لقد تم تغيير كلمة السر الخاصة بحسابك.';
            default:
                return '';
        }
    };

    const GetComponent = ({ type, name, prop }) => {
        switch(type){
            case 'converted-to-host':
                return <HostRequestAccept />;
            case 'book':
                return <PropRelated type={type} text={getText(type, name)} item={prop}/>
            case 'accept-prop':
                return <PropRelated type={type} text={getText(type, name)} item={prop}/>
            case 'reject-prop':
                return <PropRelated type={type} text={getText(type, name)} item={prop}/>
            case 'create-prop':
                return <PropRelated type={type} text={getText(type, name)} item={prop}/>
            case 'new-review':
                return <PropRelated type={type} text={getText(type, name)} item={prop}/>
            case 'update-review':
                return <PropRelated type={type} text={getText(type, name)} item={prop}/>
            case 'edit-prop':
                return <PropRelated type={type} text={getText(type, name)} item={prop}/>
            case 'delete-prop':
                return <PropRelated type={type} text={getText(type, name)} item={prop}/>
            case 'email-verified':
            case 'password-change':
            default:
                return <></>
        }
    };

    const closeNotif = async() => {
        try {
            setDeleting(true);
            const res = await deleteNotifications(notifsArray?.map(o=>o.id), isEnglish);
            if(res?.success === true) {
                setNotifications([]);
                setNotifArray([]);
                setIsCloseNotif(false);
                setIsNotif(false);
                setIsShow(false);
            }
            setDeleting(false);
        } catch (err) {
            console.log(err);
            setDeleting(false);
        }
    };

    useEffect(() => {
        setRunOnce(true);
    }, []);

    useEffect(() => {
        if(runOnce) setNotifs();
    }, [runOnce]);

    useEffect(() => {
        if(isNotif) return setIsModalOpened(true);
        setIsModalOpened(false);
    }, [isNotif]);

    if(!notifications?.length > 0 || !notifsArray?.length > 0)
        return <></>

  return (
    <div className='notif-container'>

        <span id='close-span' onClick={() => {
            if(isCloseNotif) return setIsCloseNotif(false); 
            setIsNotif(false)
        }}
            style={{ 
                display: isNotif ? undefined : 'none', 
                zIndex: isCloseNotif ? 26 : undefined 
            }}/>

        <div className='notif-show'>

            <h3>{isEnglish ? 'Notifications' : 'الاشعارات'}</h3>

            <ul className='notif-ul'>
                {notifsArray.slice(0, 2).map((item) => (
                    <GetComponent key={item._id} type={item.typeOfNotif} name={item.name} prop={item.prop}/>
                ))}
            </ul>

            <div className='btns'>
                {notifsArray?.length > 2 && <button className='editDiv' onClick={() => setIsNotif(true)}>{isEnglish ? 'Show All Notifications' : 'تحميل كل الاشعارات'}</button>}
                <button className='editDiv' onClick={() => setIsShow(false)}>{isEnglish ? 'Hide' : 'اخفاء'}</button>
            </div>

        </div>

        {isNotif && <div className='notif-main'>

            <div className='notif-header'>
                <h3>{isEnglish ? 'Notifications' : 'الاشعارات'}</h3>
                <button className='editDiv' onClick={() => setIsCloseNotif(true)}>{isEnglish ? 'Delete Notifications' : 'حذف الاشعارات'}</button>
                <Svgs name={'cross'} on_click={() => setIsNotif(false)}/>
            </div>

            <ul className='notif-ul'>
                {notifsArray.map((item) => (
                    <GetComponent key={item._id} type={item.typeOfNotif} name={item.name} prop={item.prop}/>
                ))}
            </ul>

        </div>}

        {isCloseNotif && <div className='close-notifs'>
            <div>
                <p>{isEnglish ? 'Are you sure to delete? All notifications will be deleted' : 'هل أنت متأكد من الحذف, سيتم حذف جميع الاشعارات!'}</p>
                <button className='btnbackscndclr' onClick={closeNotif}>{deleting ? <LoadingCircle /> : (isEnglish ? 'Yes' : 'نعم')}</button>
                <button className='btnbackscndclr last-btn' onClick={() => setIsCloseNotif(false)}>{isEnglish ? 'No' : 'لا'}</button>
            </div>
        </div>}

    </div>
  )
};

export default Notif;
