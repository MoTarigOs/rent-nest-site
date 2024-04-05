'use client';

import './Profile.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '@utils/Context';
import Card from '@components/Card';
import { deleteMyAccount, editUser, getBooks, getFavourites, getOwnerProperties, sendCode, signOut, verifyMyEmail } from '@utils/api';
import InfoDiv from '@components/InfoDiv';
import CustomInputDiv from '@components/CustomInputDiv';
import Svgs from '@utils/Svgs';
import { getRoleArabicName, isValidEmail, isValidPassword, isValidVerificationCode } from '@utils/Logic';
import ReCAPTCHA from 'react-google-recaptcha';
import MySkeleton from '@components/MySkeleton';
import NotFound from '@components/NotFound';

const page = () => {

    const { 
      userId, setUserId, setUserUsername, userUsername, userEmail, isVerified,
      userAddress, userPhone, userRole, loadingUserInfo, storageKey
    } = useContext(Context);

    const [isProfileDetails, setIsProfileDetails] = useState(true);
    const [isItems, setIsItems] = useState(false);
    const [isBooks, setIsBooks] = useState(false);
    const [isFavourites, setIsFavourites] = useState(false);
    const [isSignOut, setIsSignOut] = useState(false);

    const [fetchingUserInfo, setFetchingUserInfo] = useState(true);

    const [loadingItems, setLoadingItems] = useState(false);

    const [code, setCode] = useState('');
    const [sendingCode, setSendingCode] = useState(false);
    const [sendCodeError, setSendCodeError] = useState('');
    const [sendCodeErrorPass, setSendCodeErrorPass] = useState('');
    const [sendCodeSuccess, setSendCodeSuccess] = useState('');
    const [isSentCodeEmail, setIsSentCodeEmail] = useState(false);
    const [isSentCodePass, setIsSentCodePass] = useState(false);
    const [newPass, setNewPass] = useState('');

    const [isProfileEdit, setIsProfileEdit] = useState(false);
    const [verifyError, setVerifyError] = useState('');
    const [verifySuccess, setVerifySuccess] = useState('');
    const [isVerifing, setIsVerifing] = useState(false);
    const [isVerifyFetching, setIsVerifyFetching] = useState(false);

    const [isChangePasswordDiv, setIsChangePasswordDiv] = useState(false);
    const [changePasswordError, setChangePasswordError] = useState(false);
    const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
    const [changingPass, setChangingPass] = useState(false);

    const [editingInfo, setEditingInfo] = useState(false);
    const [editInfo, setEditInfo] = useState({
      editUsername: userUsername, editAddress: userAddress, editPhone: userPhone
    });
    const [editInfoError, setEditInfoError] = useState('');
    const [editInfoSuccess, setEditInfoSuccess] = useState('');

    const [isDeleteAccountDiv, setIsDeleteAccountDiv] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [deleteAccountSuccess, setDeleteAccountSuccess] = useState('');
    const [deleteAccountError, setDeleteAccountError] = useState('');
    const reCaptchaRef = useRef();

    const [itemsArray, setItemsArray] = useState([]);
    const [favArray, setFavArray] = useState([]);
    const [booksArray, setBooksArray] = useState([]);

    const [signOutInfo, setSignOutInfo] = useState('');
    const [signingOut, setSigningOut] = useState(false);

    const settingItems = async() => {

      setLoadingItems(true);

      try {
        
        const res = await getOwnerProperties(userId);

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
    
    const settingFavs = async() => {

      setLoadingItems(true);

      try {
        
        const res = await getFavourites();

        if(res.success !== true){
          setLoadingItems(false);
          return;
        };

        setFavArray(res.dt);
        setLoadingItems(false);

      } catch (err) {
        console.log(err);
        setLoadingItems(false);
      }

    };
    
    const settingBooks = async() => {

      setLoadingItems(true);

      try {
        
        const res = await getBooks();

        if(res.success !== true){
          setLoadingItems(false);
          return;
        };

        setBooksArray(res.dt);
        setLoadingItems(false);

      } catch (err) {
        console.log(err);
        setLoadingItems(false);
      }

    };

    const sendCodeToEmail = async(x, notVerify) => {

      try {

        if(!notVerify && isVerified) return;

        if(!userEmail || !isValidEmail(userEmail)) return;

        setSendingCode(true);

        const res = await sendCode();

        if(res.success !== true) {
          setVerifySuccess('');
          if(x) { 
            setSendCodeError(''); setSendCodeErrorPass(res.dt); 
          } else {
            setSendCodeError(res.dt); setSendCodeErrorPass('');
          }
          setSendingCode(false);
          setSendCodeSuccess('');
          setChangePasswordSuccess('');
          setIsSentCodeEmail(false);
          setIsSentCodePass(false);
          return;
        };

        setVerifySuccess('');
        setSendCodeError('');
        setSendCodeErrorPass('');
        setSendCodeSuccess('تم ارسال رمز الى بريدك الالكتروني');
        setChangePasswordSuccess('');

        if(x) 
          setIsSentCodePass(true);
        else 
          setIsSentCodeEmail(true);

        setSendingCode(false);
        
      } catch (err) {
        console.log(err.message);
        setVerifySuccess('');          
        if(x) { 
          setSendCodeError(''); setSendCodeErrorPass(err.message); 
        } else {
          setSendCodeError(err.message); setSendCodeErrorPass('');
        }
        setSendCodeSuccess('');
        setChangePasswordSuccess('');
        setIsSentCodeEmail(false);
        setIsSentCodePass(false);
        setSendingCode(false);
      }

    };

    const verifyEmail = async() => {

      try {

        if(!isSentCodeEmail) return setVerifyError('الرجاء ارسال رمز الى بريدك الالكتروني اولا');

        setIsVerifyFetching(true);

        const res = await verifyMyEmail(code);

        if(res.success !== true) {
          setVerifyError(res.dt);
          setIsVerifyFetching(false);
          return;
        }

        setVerifyError('');
        setVerifySuccess('تم التوثيق بنجاح, الرجاء اعادة تحميل الصفحة');
        setIsVerifyFetching(false);
        
      } catch (err) {
        console.log(err.message);
        setVerifyError(err.message);
        setVerifySuccess('');
        setIsVerifyFetching(false);
      }

    };

    const changePassword = async() => {

      try {

        if(!isSentCodePass) return changePasswordError('الرجاء ارسال رمز الى بريدك الالكتروني اولا');
        
        if(!isValidVerificationCode(code)){
          setChangePasswordError('رمز غير صالح');
          return;
        }

        if(!isValidPassword(newPass)){
          setChangePasswordError('كلمة سر غير صالحة');
          return;
        }

        setChangingPass(true);

        const res = await changeMyPass(code, newPass, userEmail);

        if(res.success !== true) {
          setChangePasswordError(res.dt);
          setChangingPass(false);
          return;
        }

        setChangePasswordError('');
        setChangePasswordSuccess('تم تغيير كلمة السر بنجاح');
        setChangingPass(true);

      } catch (err) {
        console.log(err.message);
        setChangePasswordError(err.message);
        setChangePasswordSuccess('');
        setChangingPass(false);
      }

    };

    const editUserInfo = async() => {

      try {

        console.log(editInfo);

        if(editInfo.editUsername.length <= 0 && editInfo.editAddress.length <= 0 && editInfo.editPhone.length <= 0){
          setEditInfoError('لا يوجد تغيير في البيانات');
          setEditInfoSuccess('');
          return;
        }

        setEditingInfo(true);

        const res = await editUser(editInfo);

        if(res.success !== true){
          setEditInfoError(res.dt);
          setEditInfoSuccess('');
          setEditingInfo(false);
          return;
        }

        setEditInfoError('');
        setEditInfoSuccess('');
        setEditingInfo(false);
        
      } catch (err) {
        console.log(err.message);
        setEditInfoError(err.message);
        setEditInfoSuccess('');
        setEditingInfo(false);
      }

    };

    const deleteAccount = async() => {

      try {

        if(deletingAccount) return;

        if(!isSentCodeEmail || !code || code.length !== 6){
          setDeleteAccountError('الرجاء ادخال رمز غير صالح.');
          setDeleteAccountSuccess('');
          return;
        }

        const reCaptchaToken = reCaptchaRef?.current?.getValue() ? reCaptchaRef.current.getValue() : null;
        reCaptchaRef.current.reset();
  
        // if(!reCaptchaToken) {
        //   setDeleteAccountError('من فضلك أثبت انك لست روبوت');
        //   setDeleteAccountSuccess('');
        //   return;
        // }

        setDeletingAccount(true);

        const res = await deleteMyAccount(code, storageKey, userEmail);

        if(res.success !== true) {
          setDeleteAccountError(res.dt);
          setDeleteAccountSuccess('');
          setDeletingAccount(false);
          return;
        }

        setDeleteAccountError('');
        setDeleteAccountSuccess('تم حذف الحساب');
        setDeletingAccount(false);

      } catch (err) {
        console.log(err.message);
        setDeleteAccountError(err.message);
        setDeleteAccountSuccess('');
        setDeletingAccount(false);
      }

    };

    const handleSignOut = async() => {

      try {

        setSigningOut(true);

        const res = await signOut();

        if(res.success !== true){
          setSignOutInfo(res.dt);
          setSigningOut(false);
          return;
        }
        
        setSignOutInfo('تم تسجيل الخروج بنجاح');
        setUserUsername('');

        setTimeout(() => {
          setUserId('');
          window.location = '/';
        }, 10000);
        
        setSigningOut(false);
        
      } catch (err) {
          console.log(err.message);
          setSigningOut(false);
      }

    };
    
    useEffect(() => {
      if(isItems === true) settingItems();
      if(isFavourites === true) settingFavs();
      if(isBooks === true) settingBooks();
    }, [isItems, isBooks, isFavourites]);

    useEffect(() => {
      setEditInfo({
        editUsername: userUsername, editAddress: userAddress, editPhone: userPhone
      });
    }, [userAddress, userUsername, userPhone, isProfileEdit]);

    useEffect(() => {
      let timeout;
      if(loadingUserInfo === false) 
        timeout = setTimeout(() => setFetchingUserInfo(false), [1500]);
      return () => clearTimeout(timeout);   
    }, [loadingUserInfo]);

    if(!userId || userId.length <= 10){
      return (
        fetchingUserInfo ? <MySkeleton /> : <NotFound />
      )
    };

    return (
      <div className='profile'>

          <div className="details">
            
            <label id='username'>{userUsername}</label>

            <p id='underusername'>{'الملف الشخصي الخاص بك'}</p>

            <ul className='tabButtons'>
              <li className={isProfileDetails && 'selectedTab'} onClick={() => {setIsProfileDetails(true); setIsItems(false); setIsFavourites(false); setIsBooks(false); setIsSignOut(false)}}>بيانات الملف الشخصي</li>
              <li className={isItems && 'selectedTab'} onClick={() => {setIsProfileDetails(false); setIsItems(true); setIsFavourites(false); setIsBooks(false); setIsSignOut(false)}}>المعروضات</li>
              <li className={isBooks && 'selectedTab'} onClick={() => {setIsProfileDetails(false); setIsItems(false); setIsFavourites(false); setIsBooks(true); setIsSignOut(false)}}>حجوزاتي</li>
              <li className={isFavourites && 'selectedTab'} onClick={() => {setIsProfileDetails(false); setIsItems(false); setIsFavourites(true); setIsBooks(false); setIsSignOut(false)}}>المفضلة</li>
              <li className={isSignOut && 'selectedTab'} onClick={() => {setIsProfileDetails(false); setIsItems(false); setIsFavourites(false); setIsBooks(false); setIsSignOut(true)}}>تسجيل الخروج</li>
            </ul>

            <div className='profileDetails' style={{ display: !isProfileDetails && 'none' }}>

                <InfoDiv title={'البريد الالكتروني'} value={userEmail} 
                isInfo={!isVerified && true} info={'هذا الحساب غير موثق'}
                btnState={isVerifing}
                handleClick={() => setIsVerifing(!isVerifing)} type={'email'}
                btnAfterClck={'التوثيق لاحقا'} btnTitle={'توثيق الحساب'}/>

                <hr />

                <InfoDiv title={'الرتبة'} value={getRoleArabicName(userRole)}/>

                <div className='verifyEmailDiv' style={{ display: !isVerifing && 'none' }}>
                  <button className='btnbackscndclr' onClick={() => sendCodeToEmail(null)}>{!sendingCode ? `ارسال رمز الى ${userEmail}` : 'جاري الارسال...'}</button>
                  <p style={{ color: sendCodeError.length > 0 && 'var(--softRed)' }}>{sendCodeError.length > 0 ? sendCodeError : (verifySuccess.length > 0 ? verifySuccess : sendCodeSuccess)}</p>
                  <div>
                    <CustomInputDiv title={'ادخل الرمز'} isError={verifyError.length > 0 && true} errorText={verifyError} listener={(e) => setCode(e.target.value)}/>
                    <button className='btnbackscndclr' onClick={verifyEmail}>{isVerifyFetching ? 'جاري التوثيق...' : 'التوثيق'}</button>
                  </div>
                </div>

                <hr />

                <div className='changePass'>
                  <button className={isChangePasswordDiv ? 'editDiv chngpassbtn' : 'editDiv'} 
                    onClick={() => {
                      setIsDeleteAccountDiv(false);
                      setIsChangePasswordDiv(!isChangePasswordDiv);
                    }}>
                    تغيير كلمة السر<Svgs name={'dropdown arrow'}/>
                  </button>
                  <div className='verifyEmailDiv' style={{ display: !isChangePasswordDiv && 'none' }}>
                    <button className='btnbackscndclr first-btn' onClick={() => sendCodeToEmail(true, true)}>ارسال رمز الى البريد الالكتروني</button>
                    <p style={{ color: sendCodeErrorPass.length > 0 && 'var(--softRed)' }}>
                      {sendCodeErrorPass.length > 0 ? sendCodeErrorPass : (changePasswordSuccess ? changePasswordSuccess : sendCodeErrorPass)}</p>
                    <CustomInputDiv title={'ادخل كلمة السر الجديدة'} 
                    isError={changePasswordError.length > 0 && true}
                    errorText={changePasswordError} 
                    listener={(e) => setNewPass(e.target.value)}/>
                    <div>
                      <CustomInputDiv title={'ادخل الرمز'} 
                      isError={sendCodeErrorPass.length > 0 && true} 
                      errorText={sendCodeErrorPass.length > 0 ? sendCodeErrorPass : changePasswordError}
                      listener={(e) => setCode(e.target.value)}/>
                      <button className='btnbackscndclr' onClick={changePassword}>{changingPass ? 'جاري المعالجة...' :'تغيير'}</button>
                    </div>
                  </div>
                </div>

                <hr />

                <div className='edit-profile-details'>

                  <div className='edit-profile-header'>
                    
                    <h2>تفاصيل الحساب</h2>
                  
                    <div className='editDiv' onClick={() => setIsProfileEdit(!isProfileEdit)}>
                      تعديل البيانات
                      <Svgs name={'edit'}/>
                    </div>
                    
                  </div>

                  {!isProfileEdit ? <>
                    <InfoDiv title={'اسم الملف الشخصي'} value={userUsername}/>
                    <InfoDiv title={'الموقع'} value={userAddress}/>
                    <InfoDiv title={'رقم الهاتف'} value={userPhone} isInfo={true} info={'لا يظهر للعامة'}/>
                  </> : <>
                    <CustomInputDiv title={'ادخل اسما جديدا'} value={editInfo.editUsername} listener={(e) => setEditInfo({ editUsername: e.target.value, editAddress: editInfo.editAddress, editPhone: editInfo.editPhone })}/>
                    <CustomInputDiv title={'ادخل عنوان جديد'} value={editInfo.editAddress} listener={(e) => setEditInfo({ editUsername: editInfo.editUsername, editAddress: e.target.value, editPhone: editInfo.editPhone })}/>
                    <CustomInputDiv title={'عدل رقم الهاتف'} value={editInfo.editPhone} listener={(e) => setEditInfo({ editUsername: editInfo.editUsername, editAddress: editInfo.editAddress, editPhone: e.target.value })}/>
                    <button className='btnbackscndclr' onClick={editUserInfo}>{editingInfo ? 'جاري التعديل...' : 'تعديل البيانات'}</button>
                    <p id='edit-info-p' className={editInfoError.length > 0 && 'edit-info-p-error'}>
                      <Svgs name={'info'}/>
                      {editInfoError.length > 0 ? editInfoError : editInfoSuccess}
                    </p>
                  </>}

                </div>

                <hr />

                <div className='deleteAccountDiv'>
                  <button className={isDeleteAccountDiv ? 'editDiv chngpassbtn' : 'editDiv'} 
                    onClick={() => {
                      setIsVerifing(false);
                      setIsDeleteAccountDiv(!isDeleteAccountDiv);
                    }}>
                    حذف الحساب<Svgs name={'dropdown arrow'}/>
                  </button>
                  <div className='verifyEmailDiv' style={{ display: !isDeleteAccountDiv ? 'none' : null }}>
                    <button className='btnbackscndclr' onClick={() => sendCodeToEmail(null, true)}>{!sendingCode ? `ارسال رمز الى ${userEmail}` : 'جاري الارسال...'}</button>
                    <p style={{ marginBottom: 12 }} id={sendCodeError?.length > 0 ? 'p-info-error' : 'p-info'}>{sendCodeError.length > 0 ? sendCodeError : (deleteAccountSuccess.length > 0 ? deleteAccountSuccess : sendCodeSuccess)}</p>
                    <CustomInputDiv title={'ادخل الرمز'} isError={sendCodeError.length > 0} listener={(e) => setCode(e.target.value)}/>
                    <p style={{ margin: '-16px 0 12px 0'}}><Svgs name={'info'}/>تحذير: سيتم حذف الحساب و كل ما يتعلق به نهائيا!</p>
                    <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} ref={reCaptchaRef}/>
                    <button style={{ marginTop: 48 }} className='btnbackscndclr' onClick={deleteAccount}>{deletingAccount ? 'جاري حذف الجساب' :'حذف الحساب نهائيا'}</button>
                    <p id={deleteAccountError?.length > 0 ? 'p-info-error' : 'p-info'}>
                      {deleteAccountError.length > 0 ? deleteAccountError : deleteAccountSuccess}
                    </p>
                  </div>
                </div>
                
            </div>

            <ul className='items' style={{ display: !isItems && 'none' }}>
              {itemsArray.map((item) => (
                  <li key={item._id}><Card item={item} type={'myProp'}/></li>
              ))}
            </ul>

            <ul className='items' style={{ display: !isFavourites && 'none' }}>
              {favArray.map((item) => (
                  <li key={item._id}><Card item={item}/></li>
              ))}
            </ul>

            <ul className='items' style={{ display: !isBooks && 'none' }}>
              {booksArray.map((item) => (
                  <li key={item._id}><Card item={item}/></li>
              ))}
            </ul>

            <div className='profileDetails signOut' style={{ display: !isSignOut && 'none' }}>
                <p style={{ display: signOutInfo.length <= 0 && 'none' }}><Svgs name={'info'}/>{signOutInfo}</p>
                <button onClick={handleSignOut} className='editDiv'>
                  {signingOut ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
                </button>
            </div>

          </div>

      </div>
    )
}

export default page
