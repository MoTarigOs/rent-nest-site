'use client';

import Card from '@components/Card';
import LoadingCircle from '@components/LoadingCircle';
import MySkeleton from '@components/MySkeleton';
import NotFound from '@components/NotFound';
import UserDiv from '@components/UserDiv';
import '@styles/components_styles/Notif.scss';
import { Context } from '@utils/Context';
import Svgs from '@utils/Svgs';
import { deleteNotifications, getAdminNotif, getPropsFromIds } from '@utils/api';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

const Notif = ({ 
    isEnglish, setIsShow, isOpened, setIsOpened,
    isAdmin, adminSectionType
}) => {

    const { userId, notifications, setNotifications, setIsModalOpened } = useContext(Context);
    const [runOnce, setRunOnce] = useState(false);  
    const [fetching, setFetching] = useState(false);  
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

            if(!res?.ok) {
                setFetching(false);
                return
            };

            for (let i = 0; i < notifs.length; i++) {
                if(notifs[i])
                    notifs[i].prop = res?.dt?.find(j=>j._id === notifs[i]?.targettedId);
            }

            console.log('final props: ', notifs);

            setNotifArray(notifs?.reverse());
            setFetching(false);

        } catch (err) {
            console.log(err);
            setFetching(false);
        }

    };

    const setAdminNotifs = async() => {

        if(fetching) return;

        try {

            setFetching(true);
            
            const res = await getAdminNotif();

            if(!res || res.success !== true) {
                setFetching(false);
                return;
            };

            let propRelatedNofsIds = [];
            let notifs = [];
            for (let i = 0; i < res.dt?.length; i++) {
                if([
                    'book',
                    'accept-prop',
                    'reject-prop',
                    'create-prop',
                    'edit-prop',
                    'new-review',
                    'update-review'
                ].includes(res.dt?.at(i)?.typeOfNotif)){
                    if(!propRelatedNofsIds.includes(res.dt?.at(i)?.targettedId)) 
                        propRelatedNofsIds.push(res.dt?.at(i)?.targettedId);
                }
                notifs.push({ id: res.dt?.at(i)?._id, name: res?.dt?.at(i)?.name, typeOfNotif: res.dt?.at(i)?.typeOfNotif, targettedId: res.dt?.at(i)?.targettedId });
            }

            const res2 = await getPropsFromIds(propRelatedNofsIds);

            if(!res2?.ok) {
                setFetching(false);
                return;
            };

            for (let i = 0; i < notifs.length; i++) {
                if(notifs[i] 
                    && ['ask-for-host', 'new-user', 'new-host'].includes(notifs[i].typeOfNotif))
                    notifs[i].prop = {
                        _id: notifs[i]?.targettedId,
                        email: notifs[i]?.name
                    };
                else notifs[i].prop = res2?.dt?.find(j=>j._id === notifs[i]?.targettedId);
            }

            console.log('final props: ', notifs);

            setNotifArray(notifs?.reverse());
            setFetching(false);

        } catch (err) {
            console.log(err);
            setFetching(false);
        }

    };

    const HostRequestAccept = () => {
        return(
            <div className='host-request'>
                <p className='main-p'>{isEnglish ? 'Your account has been converted into an advertised account on the platform' : 'تم تحويل حسابك الى حساب معلن على المنصة'}</p>
                <Link href='/add'>{isEnglish ? 'Add Property' : 'اضافة عقار'}</Link>
            </div>
        )
    };

    const AskForHost = ({ text, item }) => {
        return(
            <div className='ask-for-host'>
                <p className='main-p'>{text}</p>
                <UserDiv item={item} isEnglish={isEnglish}/>
            </div>
        )
    };

    const PropRelated = ({ text, item }) => {
        return(
            <div className='prop-related'>
                <p className='main-p'>{text}</p>
                {item && <Card isAdmin={isAdmin} item={item} isEnglish={isEnglish} type={'myProp'} />}
            </div>
        )
    };

    const getText = (type, name) => {
        switch(type){
            case 'book':
                return isEnglish ? `A user with name ${name} Has added this unit to his reservations list. Check the customer from the Offers section in the profile.` : `مستخدم بالاسم "${name}" قام باضافة هذه الاعلان الى قائمة الحجوزات, تفقد العميل من قسم المعروضات في الملف الشخصي.`;
            case 'accept-prop':
                return isEnglish ? 'Congratulations ✨, your unit has been approved' : 'تهانينا ✨ , تم الموافقة على اعلانك.';
            case 'reject-prop':
                return isEnglish ? 'Unfortunately, your unit was rejected by one of the officials. Please review the unit page from the button below to find out the reasons for rejection' : 'للأسف تم رفض وحدتك هذه من قبل أحد المسؤولين, الرجاء مراجعة صفحة الاعلان من الزر تحت لمعرفة أسباب الرفض.';
            case 'create-prop':
                return isEnglish 
                ? `${isAdmin ? 'An' : 'Your'} Ad has been uploaded to the platform. ${isAdmin ? '' : 'Please wait until the ad is reviewed and approved'}` 
                : `تم تحميل اعلان${isAdmin ? '' : 'ك'} ${isAdmin ? '' : 'على المنصة نرجو الانتظار لحين مراجعة الاعلان و الموافقة عليه'}`;
            case 'new-review':
                return isEnglish ? `A User ${name?.length > 0 ? 'called ' + name : ''} added a review about your unit.` : `أحد المستخدمين ${name?.length > 0 ? 'يدعى ' + name : ''} قام باضافة مراجعة عن اعلان لك.`;
            case 'update-review':
                return isEnglish ? `A User ${name?.length > 0 ? 'called ' + name : ''} updated a review he wrote about your unit.` : `أحد المستخدمين ${name?.length > 0 ? 'يدعى ' + name : ''} قام بتعديل مراجعة كتبها مسبقا عن اعلان لك.`;
            case 'edit-prop':
                return isEnglish 
                ? (!isAdmin ? 'The new modification to the unit has been uploaded to the platform. Please wait until the modification is reviewed and approved' : 'Modification for a unit') 
                : (!isAdmin ? 'لقد تم تحميل التعديل الجديد على الاعلان الى المنصة, نرجو الانتظار لحين مراجعة التعديل و الموافقة عليه' : 'تعديل على اعلان');
            case 'delete-prop':
                return isEnglish ? `A Unit ${name?.length > 0 ? 'with Title: "' + name + '"' : ''} had been deleted.` : `لقد تم حذف اعلان ${name?.length > 0 ? 'بعنوان "' + name + '"' : ''} من المنصة.`;
            case 'email-verified':
                return isEnglish ? 'We are pleased to inform you that your email has been verified ✨' : 'سعدنا اخبارك بأنه قد تم توثيق بريدك الالكتروني ✨';
            case 'password-change':
                return isEnglish ? 'Your password had been changed.' : 'لقد تم تغيير كلمة السر الخاصة بحسابك.';
            case 'ask-for-host':
                return isEnglish 
                ? 'A User ask to convert him to a an advertiser'
                : 'مستخدم طلب تحويله الى معلن';
            case 'new-host':
                return isEnglish
                ? 'A User became an advertiser recently'
                : 'مستخدم أصبح معلن على المنصة موخرا';
            case 'new-user':
                return isEnglish
                ? 'A new User had registered on the platform'
                : 'مستخدم جديد أنشأ حسابا على المنصة';
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
                return 
            case 'email-verified':
            case 'password-change':
            case 'ask-for-host':
                return <AskForHost text={getText(type, name)} item={prop}/>
            case 'new-user':
                return <AskForHost text={getText(type, name)} item={prop}/>
            case 'new-host':
                return <AskForHost text={getText(type, name)} item={prop}/>
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
        if(runOnce && !isAdmin) setNotifs();
        if(runOnce && isAdmin) setAdminNotifs();
    }, [runOnce]);

    useEffect(() => {
        if(isNotif) return setIsModalOpened(true);
        setIsModalOpened(false);
    }, [isNotif]);

    useEffect(() => {
        if(isOpened) return setIsNotif(true);
        setIsNotif(false);
    }, [isOpened]);

    useEffect(() => {
        if(adminSectionType?.split(' ')?.at(0) === 'notif')
            setAdminNotifs();
    }, [adminSectionType]);

    if(!notifsArray?.length > 0 || fetching){
        return (
            fetching ? <MySkeleton /> : (isAdmin ? <NotFound /> : <></>)
        )
    };

  return (
    <div className='notif-container'>

        <span id='close-span' onClick={() => {
            if(isCloseNotif) return setIsCloseNotif(false); 
            if(setIsOpened) return setIsOpened(false); 
            setIsNotif(false)
        }}
            style={{ 
                display: (isNotif || (isAdmin && isCloseNotif)) ? undefined : 'none', 
                zIndex: isCloseNotif ? 26 : undefined 
            }}/>

        <div className='notif-show' style={{ display: isAdmin ? 'none' : undefined }}>

            <h3>{isEnglish ? 'Notifications' : 'الاشعارات'}</h3>

            <ul className='notif-ul'>
                {notifsArray.slice(0, 2).map((item) => (
                    <GetComponent key={item._id} type={item.typeOfNotif} name={item.name} prop={item.prop}/>
                ))}
            </ul>

            <div className='btns'>
                <button className='editDiv' onClick={() => setIsNotif(true)}>{isEnglish ? 'Show All Notifications' : 'تحميل كل الاشعارات'}</button>
                <button className='editDiv' onClick={() => setIsShow(false)}>{isEnglish ? 'Hide' : 'اخفاء'}</button>
            </div>

        </div>

        <div className='notif-main' style={{
            display: (!isNotif && !isAdmin) ? 'none' : undefined
        }}>

            <div className='notif-header'>
                <h3>{isEnglish ? 'Notifications' : 'الاشعارات'}</h3>
                <button className='editDiv' onClick={() => setIsCloseNotif(true)}>{isEnglish ? 'Delete Notifications' : 'حذف الاشعارات'}</button>
                <Svgs name={'cross'} on_click={() => { setIsNotif(false); setIsOpened(false); }}/>
            </div>

            <ul className='notif-ul'>
                {notifsArray.map((item) => (
                    <GetComponent key={item._id} type={item.typeOfNotif} name={item.name} prop={item.prop}/>
                ))}
            </ul>

        </div>

        <div className='close-notifs' style={{
            display: !isCloseNotif ? 'none' : undefined
        }}>
            <div>
                <p>{isEnglish ? 'Are you sure to delete? All notifications will be deleted' : 'هل أنت متأكد من الحذف, سيتم حذف جميع الاشعارات!'}</p>
                <button style={{ width: 'fit-content', padding: '12px 32px'}} className='btnbackscndclr' onClick={closeNotif}>{deleting ? <LoadingCircle /> : (isEnglish ? 'Yes' : 'نعم')}</button>
                <button style={{ width: 'fit-content', padding: '12px 32px'}} className='btnbackscndclr last-btn' onClick={() => setIsCloseNotif(false)}>{isEnglish ? 'No' : 'لا'}</button>
            </div>
        </div>

    </div>
  )
};

export default Notif;
