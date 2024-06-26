'use client';

import { useSearchParams } from 'next/navigation';
import '../profile/Profile.scss';
import Svgs from '@utils/Svgs';
import { Suspense, useContext, useEffect, useState } from 'react';
import Card from '@components/Card';
import InfoDiv from '@components/InfoDiv';
import { blockDurationsArray, getDurationReadable, getReadableDate, getRoleArabicName } from '@utils/Logic';
import HeaderPopup from '@components/popups/HeaderPopup';
import { Context } from '@utils/Context';
import CustomInputDiv from '@components/CustomInputDiv';
import { blockUser, convertToBeHost, deleteAccountAdmin, deleteUserAccountFilesAdmin, getOwnerProperties, getUserByEmailAdmin, getUserByIdAdmin, handlePromotion, sendCode, unBlockUser } from '@utils/api';
import MySkeleton from '@components/MySkeleton';
import NotFound from '@components/NotFound';
import Skeleton from 'react-loading-skeleton';
import LoadingCircle from '@components/LoadingCircle';

const Page = () => {

    const id = useSearchParams().get('id');
    const username = useSearchParams().get('username');
    const email = useSearchParams().get('email');

    const { userEmail, userRole, storageKey, isVerified } = useContext(Context);

    const [user, setUser] = useState(null);

    const [runOnce, setRunOnce] = useState(false);
    const [fetchingUserInfo, setFetchingUserInfo] = useState(true);
    const [isHisProps, setIsHisProps] = useState(false);
    const [fetchingProps, setFetchingProps] = useState(false);
    const [props, setProps] = useState([]);

    const [isBlock, setIsBlock] = useState(false);
    const [blocking, setBlocking] = useState(false);
    const [blockError, setBlockError] = useState('');
    const [blockSuccess, setBlockSuccess] = useState('');
    const [blockReason, setBlockReason] = useState('');
    const [isBlockDuration, setIsBlockDuration] = useState(false);
    const [blockDurationObj, setBlockDurationObj] = useState(blockDurationsArray[0]);

    const [code, setCode] = useState('');
    const [sendingCode, setSendingCode] = useState(false);
    const [sendCodeError, setSendCodeError] = useState('');
    const [sendCodeSuccess, setSendCodeSuccess] = useState('');
    const [isSentCodeEmail, setIsSentCodeEmail] = useState(false);

    const [isPromoteDiv, setIsPromoteDiv] = useState(false);
    const [promoting, setPromoting] = useState(false);
    const [promoteError, setPromoteError] = useState('');
    const [promoteSuccess, setPromoteSuccess] = useState('');

    const [isDeleteAccountDiv, setIsDeleteAccountDiv] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [deleteAccountError, setDeleteAccountError] = useState('');
    const [deleteAccountSuccess, setDeleteAccountSuccess] = useState('');
    
    const [isConvertDiv, setIsConvertDiv] = useState(false);
    const [convertingToHost, setConvertingToHost] = useState(false);
    const [convertError, setConvertError] = useState('');
    const [convertSuccess, setConvertSuccess] = useState('');

    const fetchUserDetails = async() => {

      try {
        const res = id 
          ? await getUserByIdAdmin(id)
          : await getUserByEmailAdmin(email);
          
        if(res.success === true) {
          setUser(res.dt);
          setFetchingUserInfo(false);
          return;
        }
        setFetchingUserInfo(false);
      } catch (err) {
        console.log(err.message);
        setFetchingUserInfo(false);
      }

    };

    const fetchProps = async() => {

      try {
        
        setFetchingProps(true);

        const res = await getOwnerProperties(id);

        if(res.success !== true){
          setFetchingProps(false);
          return;
        }

        setProps(res.dt);
        setFetchingProps(false);

      } catch (err) {
        console.log(err.message);
        setFetchingProps(false);
      }

    };

    const sendCodeToEmail = async() => {

        try {
  
          setSendingCode(true);
  
          const res = await sendCode();
  
          if(res.success !== true) {
            setSendCodeError(res.dt);
            setSendingCode(false);
            setSendCodeSuccess('');
            setIsSentCodeEmail(false);
            return;
          };
  
          setSendCodeError('');
          setSendCodeSuccess('تم ارسال رمز الى بريدك الالكتروني');
          setIsSentCodeEmail(true);
          setSendingCode(false);
          
        } catch (err) {
          console.log(err.message);
          setSendCodeError('حدث خطأ غير معروف');
          setSendCodeSuccess('');
          setIsSentCodeEmail(false);
          setSendingCode(false);
        }
  
    };

    const handleBlockUser = async() => {

        try {

            if(blocking) return;

            if(!user.isBlocked && (!blockDurationObj?.value
              || blockDurationObj.value <= 0)){
              setBlockError('الرجاء تحديد مدة و سبب للحظر.');
              setBlockSuccess('');
              return;
            };

            if(!user.isBlocked && (!blockReason?.length 
              || blockReason.length <= 0 || blockReason === '-1')){
              setBlockError('');
              setBlockReason('-1');
              setBlockSuccess('');
              return;
            };

            setBlocking(true);

            let res = null;

            if(user.isBlocked){
                res = await unBlockUser(id);
            } else {
                res = await blockUser(id, blockDurationObj, blockReason);
            }

            if(res.success !== true){
                setBlockError(res.dt);
                setBlockSuccess('');
                setBlocking(false);
                return;
            }

            setBlockError('');
            setBlockSuccess(user.isBlocked ? 'تم فك الحظر بنجاح' : 'تم الحظر بنجاح')
            setUser(res.dt);
            setBlocking(false);
            
        } catch (err) {
            console.log(err.message);
            setBlockError('حدث خطأ ما');
            setBlockSuccess('');
            setBlocking(false);
        }

    };

    const promoteAdmin = async() => {

      try {

        if(promoting || !isNormalUser()) return;

        if(!isSentCodeEmail || !code || code.length !== 6){
          setPromoteError('الرجاء كتابة الرمز المرسل الى بريدك الالكتروني.');
          setPromoteSuccess('');
          return;
        }

        if(!user.email_verified){
          setPromoteError('هذا المستخدم لم يقم بتوثيق حسابه.');
          setPromoteSuccess('');
          return;
        }

        if(user.isBlocked){
          setPromoteError('هذا المستخدم محظور.');
          setPromoteSuccess('');
          return;
        }

        setPromoting(true);

        const res = await handlePromotion('promote-to-admin', id, code);

        if(res.success !== true){
          setPromoteError(res.dt);
          setPromoteSuccess('');
          setPromoting(false);
          return;
        }

        setPromoteError('');
        setPromoteSuccess('تم الترقية بنجاح.');
        setUser(res.dt);
        setPromoting(false);
        
      } catch (err) {
        console.log(err.message);
        setPromoteError('حدث خطأ ما');
        setPromoteSuccess('');
        setPromoting(false);
      }

    };

    const demoteAdmin = async() => {

      try {

        if(promoting || isNormalUser()) return;

        if(!isSentCodeEmail || !code || code.length !== 6){
          setPromoteError('الرجاء كتابة الرمز المرسل الى بريدك الالكتروني.');
          setPromoteSuccess('');
          return;
        }

        setPromoting(true);

        const res = await handlePromotion('demote-from-admin', id, code);

        if(res.success !== true){
          setPromoteError(res.dt);
          setPromoteSuccess('');
          setPromoting(false);
          return;
        }

        setPromoteError('');
        setPromoteSuccess('تم الترقية بنجاح.');
        setUser(res.dt);
        setPromoting(false);
        
      } catch (err) {
        console.log(err.message);
        setPromoteError('حدث خطأ ما');
        setPromoteSuccess('');
        setPromoting(false);
      }

    };

    const deleteAccount = async() => {

      // if this user is admin, demote him to user then delete

      if(deletingAccount) return;

      if(user.role === 'admin'){
        setDeleteAccountError('هذا الحساب لمسؤول, لحذف حسابه يرجى تخفيض رتبته الى مستخدم.');
        setDeleteAccountSuccess('');
        return;
      }

      if(!isSentCodeEmail){
        setDeleteAccountError('الرجاء ارسال رمز الى بريدك الالكتروني أولا.');
        setDeleteAccountSuccess('');
        return;
      }

      if(!isSentCodeEmail || !code || code.length !== 6){
        setDeleteAccountError('الرجاء ادخال الرمز المرسل الى بريدك الالكتروني.');
        setDeleteAccountSuccess('');
        return;
      }

      setDeletingAccount(true);

      try {

        const deleteFilesRes = await deleteUserAccountFilesAdmin(
          id, code, storageKey, userEmail
        );

        if(deleteFilesRes.success !== true){
          setDeleteAccountError(deleteFilesRes.dt);
          setDeleteAccountSuccess('');
          setDeletingAccount(false);
          return;
        }

        const res = await deleteAccountAdmin(id, code, email);

        if(res.success !== true){
          setDeleteAccountError(res.dt);
          setDeleteAccountSuccess('');
          setDeletingAccount(false);
          return;
        };

        setDeleteAccountError('');
        setDeleteAccountSuccess('تم حذف حساب المستخدم بنجاح');
        
      } catch (err) {
        console.log(err.message);
        setDeleteAccountError('حدث خطأ');
        setDeleteAccountSuccess('');
        setDeletingAccount(false);
      }

    };

    const convertUserToHost = async() => {

      try {
          setConvertingToHost(true);
          const res = await convertToBeHost(user._id);
          if(!res || res.ok !== true) {
            setConvertError('حدث خطأ ما أثناء العملية.');
            setConvertSuccess('');
            setConvertingToHost(false);
            return;
          }
          setConvertError('');
          setConvertSuccess('تم تحويل المستخدم الى معلن.');
          setConvertingToHost(false);
      } catch (err) {
          console.log(err);
          setConvertingToHost(false);
      }

    };

    const isNormalUser = () => {
      if(user.role === 'admin') return false;
      if(user.role === 'owner') return false;
      return true;
    };

    useEffect(() => {
      setRunOnce(true);
    }, []);

    useEffect(() => {
      if(runOnce === true) fetchUserDetails();
    }, [runOnce]);

    useEffect(() => {
      if(isHisProps) fetchProps();
    }, [isHisProps]);

    if(!user || !isVerified){
      return (
        fetchingUserInfo ? <MySkeleton isMobileHeader/> : <NotFound type={!isVerified ? 'not allowed' : undefined}/>
      )
    };

  return (
    <div className='profile user-profile'>

        {user.ask_convert_to_host && user.account_type !== 'host' && <div className='convert-to-host-div disable-text-copy' style={{ display: !isConvertDiv ? 'none' : undefined }}>
          <span id='close-span' onClick={() => setIsConvertDiv(false)}/>
          <div className='convertDiv'>
            <h3>هل أنت متأكد من تحويل حساب هذا المستخدم الى معلن على المنصة ؟</h3>
            <div className='btns'>
              <button className='btnbackscndclr' onClick={convertUserToHost} style={convertSuccess?.length > 0 ? { background: 'var(--darkWhite)', color: '#767676' } : null}>{convertingToHost ? <LoadingCircle /> : (convertSuccess?.length > 0 ? 'تم التحويل' : 'التحويل')}</button>
              <button className='btnbackscndclr' onClick={() => setIsConvertDiv(false)} style={{ background: 'var(--darkWhite)', color: '#767676' }}>الغاء</button>
            </div>
            <p style={{ display: convertingToHost ? 'none' : undefined }} id={convertError?.length > 0 ? 'p-info-error' : 'p-info'}>{convertError?.length > 0 ? convertError : convertSuccess }</p>
          </div>
        </div>}

        <div className='profileDetails'>
            
            <h2>{!isNormalUser() ? (user.role === 'admin' ? 'المسؤول' : 'المالك'): 'المستخدم'} <span>{user.first_name || username}</span></h2>

            {user.ask_convert_to_host && user.account_type !== 'host' 
              && <div className='askForHost'>
              <h3>طلب هذا المستخدم تحويله الى معلن على المنصة {'(قم بالتواصل معه من خلال الرقم أو البريد الالكتروني لمعرفة تفاصيل أكثر عنه, من ثم قم بتحويله الى معلن عن طريق زر "تحويل")'}</h3>
              <button className='btnbackscndclr' onClick={() => setIsConvertDiv(true)}>تحويل</button>  
            </div>}

            <InfoDiv title={'معرف المستخدم'} value={user.username || username}/>

            <InfoDiv title={'نوع الحساب'} value={user.account_type === 'host' ? 'حساب معلن' : 'حساب نزيل'}/>
            
            <InfoDiv title={'الرتبة'} value={getRoleArabicName(user.role)}/>

            <InfoDiv title={'البريد الالكتروني'} isInfo={user?.email_verified ? false : true} 
                info={'هذا المستخدم لم يقم بتوثيق حسابه'} value={email} type={'email'}/>

            <InfoDiv title={'رقم الهاتف'} value={user?.phone ? user.phone : ''}/>
            
            <InfoDiv title={'عنوان المستخدم'} value={user?.address ? user.address : ''}/>
            
            <hr />

            <button className={isHisProps ? 'editDiv chngpassbtn' : 'editDiv'} onClick={() => setIsHisProps(!isHisProps)}>عروض هذا المستخدم <Svgs name={'dropdown arrow'}/></button>

            <div className='items'> 
              <ul style={{ display: !isHisProps ? 'none' : null }}>
                {(!props.length > 0) ? <li className="empty-holder">
                      {fetchingProps ? <div><Skeleton width={'100%'} height={'100%'}/></div> : <NotFound />}
                </li> : props.map((item, index) => (
                      <li key={index}><Card item={item}/></li>
                  ))}
              </ul>
            </div>

            <hr />

            <button onClick={() => setIsBlock(!isBlock)} className={isBlock ? 'editDiv chngpassbtn' : 'editDiv'}>حالة الحظر <Svgs name={'dropdown arrow'}/></button>

            {(isNormalUser() || (!isNormalUser() && userRole === 'owner')) && <div className='block-user' style={{ display: !isBlock ? 'none' : null }}>

                {!user.isBlocked ? <>

                    <div id='select-duration' onClick={() => setIsBlockDuration(!isBlockDuration)}>مدة الحظر <span>{blockDurationObj.arabicName}</span></div>

                    <HeaderPopup type={'custom'} customArray={blockDurationsArray} 
                    selectedCustom={blockDurationObj} setSelectedCustom={setBlockDurationObj} isCustom={isBlockDuration} setIsCustom={setIsBlockDuration}/>

                    <CustomInputDiv title={'سبب الحظر'} isError={blockReason === '-1'} errorText={'الرجاء كتابة سبب لحظر هذا الحساب.'} value={blockReason === '-1' ? '' : blockReason} listener={(e) => setBlockReason(e.target.value)}/>

                    <button className='btnbackscndclr' onClick={handleBlockUser}>
                        {blocking ? 'جاري الحظر...' : 'حظر المستخدم'}</button>
                    
                    </> : <>
                    
                    <InfoDiv value={getReadableDate(new Date(user.blocked.date_of_block))} title={'تاريخ الحظر'}/>

                    <InfoDiv title={'مدة الحظر'} value={getDurationReadable(user.blocked.block_duration - (Date.now() - user.blocked.date_of_block))}/>

                    <InfoDiv title={'سبب الحظر'} value={user.blocked.reason}/>

                    <button className='btnbackscndclr' onClick={handleBlockUser}>
                        {blocking ? 'جاري فك الحظر...' : 'فك الحظر من المستخدم'}</button>

                </>}

                <p style={{ 
                    color: blockError?.length > 0 ? 'var(--softRed)' : null, 
                    display: (!blockError?.length > 0 && !blockSuccess?.length > 0) 
                        ? 'block' : null 
                    }}>
                    {blockError?.length > 0 ? blockError : blockSuccess}
                </p>

            </div>}

            <hr />

            <div className='deleteAccountDiv' style={{ display: userRole === 'owner' ? null : 'none' }}>

              <button className={'editDiv'} 
              onClick={() => {
                setIsDeleteAccountDiv(false);
                setIsPromoteDiv(!isPromoteDiv);
              }}>
                {isNormalUser() ? 'ترقية الى مسؤول' : 'تخفيض الرتبة'}<Svgs name={'dropdown arrow'}/>
              </button>

              <div className='verifyEmailDiv' style={{ display: !isPromoteDiv && 'none' }}>
                <p style={{ color: 'rgb(80, 80, 80)' }}>قبل حذف هذا الحساب, يرجى ارسال رمز الى بريدك الالكتروني.</p>
                <button style={{ marginTop: 8 }} className='btnbackscndclr' onClick={() => sendCodeToEmail(null)}>{!sendingCode ? `ارسال رمز الى ${userEmail}` : 'جاري الارسال...'}</button>
                <p id={sendCodeError?.length > 0 ? 'p-info-error' : 'p-info'}>{sendCodeError.length > 0 ? sendCodeError : sendCodeSuccess}</p>
                <CustomInputDiv title={'ادخل الرمز'} listener={(e) => setCode(e.target.value)}/>
              </div>

              <div className='verifyEmailDiv' style={{ margin: -16, display: !isPromoteDiv && 'none' }}>

                  <p><Svgs name={'info'}/>تحذير: سيتم ترقية هذا المستخدم الى رتبة مسؤول, و سيكون لديه وصول أكبر الى حسابات المستخدمين الآخرين!</p>
     
                  <button style={{ marginTop: 12 }} className='btnbackscndclr' onClick={isNormalUser() ? promoteAdmin : demoteAdmin}>
                    {promoting ? (isNormalUser() ? 'جاري الترقية...' : 'جاري تخفيض الرتبة...') 
                    : (isNormalUser() ? 'ترقية الى مسؤول' : 'تخفيض الرتبة الى مستخدم')}
                  </button>
                  
                  <p id={promoteError?.length > 0 ? 'p-info-error' : 'p-info'}>
                      {promoteError.length > 0 ? promoteError : promoteSuccess}
                  </p>

              </div>
            </div>

            <hr />

            <div className='deleteAccountDiv'>

                <button className={isDeleteAccountDiv ? 'editDiv chngpassbtn' : 'editDiv'} 
                onClick={() => {
                  setIsPromoteDiv(false);
                  setIsDeleteAccountDiv(!isDeleteAccountDiv);
                }}>
                حذف حساب المستخدم<Svgs name={'dropdown arrow'}/>
                </button>

                <div className='verifyEmailDiv' style={{ display: !isDeleteAccountDiv && 'none' }}>
                  <p style={{ color: 'rgb(80, 80, 80)', marginBottom: 12 }}>قبل حذف هذا الحساب, يرجى ارسال رمز الى بريدك الالكتروني.</p>
                  <button style={{ marginTop: 8 }} className='btnbackscndclr' onClick={() => sendCodeToEmail(null)}>{!sendingCode ? `ارسال رمز الى ${userEmail}` : 'جاري الارسال...'}</button>
                  <p id={sendCodeError?.length > 0 ? 'p-info-error' : 'p-info'} style={{ color: sendCodeError.length > 0 && 'var(--softRed)', marginBottom: 24 }}>{sendCodeError.length > 0 ? sendCodeError : sendCodeSuccess}</p>
                  <CustomInputDiv title={'ادخل الرمز'} isError={deleteAccountError.length > 0} listener={(e) => setCode(e.target.value)}/>
                </div>

                <div className='verifyEmailDiv' style={{ display: !isDeleteAccountDiv && 'none', marginTop: -16 }}>
                
                    <p><Svgs name={'info'}/>تحذير: سيتم حذف حساب المستخدم و كل ما يتعلق به نهائيا!</p>
                    
                    <button style={{ marginTop: 12 }} className='btnbackscndclr' onClick={deleteAccount}>{deletingAccount ? 'جاري حذف الحساب...' :'حذف الحساب نهائيا'}</button>
                    
                    <p id={deleteAccountError?.length > 0 ? 'p-info-error' : 'p-info'}>
                        {deleteAccountError.length > 0 ? deleteAccountError : deleteAccountSuccess}
                    </p>

                </div>
            </div>

        </div>

        <span style={{ display: !isBlockDuration ? 'none' : null }} onClick={() => {
            setIsBlockDuration(false);
        }} id='closePopubs'/>

    </div>
  )
}

const SuspenseWrapper = () => (
	<Suspense>
		<Page />
	</Suspense>
);

export default SuspenseWrapper;
