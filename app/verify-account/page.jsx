'use client';

import CustomInputDiv from '@components/CustomInputDiv';
import '../sign-up/SignUp.scss';
import { useContext, useEffect, useState } from 'react';
import { sendCode, signOut, verifyMyEmail } from '@utils/api';
import { isValidEmail } from '@utils/Logic';
import Link from 'next/link';
import { Context } from '@utils/Context';
import NotFound from '@components/NotFound';
import MySkeleton from '@components/MySkeleton';

const page = () => {

    const { 
      userId, userEmail, isVerified, setIsVerified, 
      loadingUserInfo, setUserUsername, setUserId
    } = useContext(Context);

    const [verifyError, setVerifyError] = useState('');
    const [verifing, setVerifing] = useState(false);
    const [operationSuccess, setOperationSuccess] = useState(false);

    const [code, setCode] = useState('');
    const [sendingCode, setSendingCode] = useState(false);
    const [sendCodeError, setSendCodeError] = useState('');
    const [sendCodeSuccess, setSendCodeSuccess] = useState('');
    const [isSentCodeEmail, setIsSentCodeEmail] = useState(false);

    const [fetchingUserInfo, setFetchingUserInfo] = useState(true);

    const [signingOut, setSigningOut] = useState(false);

    const sendCodeToEmail = async() => {

        try {
  
          if(sendingCode) return;

          if(!isValidEmail(userEmail).ok){
            setSendCodeError('الرجاء انشاء حساب ببريد الكتروني صالح.');
            setSendingCode(false);
            return;
          }
  
          setSendingCode(true);
  
          const res = await sendCode(userEmail);
  
          if(res.success !== true) {
            setSendCodeError(res.dt); 
            setSendCodeSuccess('');
            setIsSentCodeEmail(false);
            setSendingCode(false);
            return;
          };
  
          setSendCodeError('');
          setSendCodeSuccess('تم ارسال رمز الى بريدك الالكتروني' + ' ' + userEmail);
          setIsSentCodeEmail(true);
          setSendingCode(false);
          
        } catch (err) {
            console.log(err.message);  
            setSendCodeError('حدث خطأ ما');
            setSendCodeSuccess('');
            setIsSentCodeEmail(false);
            setSendingCode(false);
        }
  
    };

    const verifyAccount = async(e) => {

      try {

        e.preventDefault();

        if(!userId || isVerified) return;

        if(!isSentCodeEmail) return setVerifyError('أرسل رمزا الى بريدك الالكتروني, للتأكد من ملكيتك للحساب.');

        if(!code || typeof code !== 'string' || code.length !== 6){
          setCode('-1');
          return;
        }

        setVerifing(true);

        const res = await verifyMyEmail(code);

        if(res.success !== true) {
          setVerifyError(res.dt);
          setVerifing(false);
          return;
        }

        setVerifyError('');
        setOperationSuccess(true);
        setIsVerified(true);
        setVerifing(false);
        
      } catch (err) {
        console.log(err.message);
        setVerifyError('حدث خطأ ما');
        setVerifySuccess('');
        setVerifing(false);
      }

    };

    const logout = async() => {

      try {

        setSigningOut(true);

        const res = await signOut();

        if(res.success !== true){
          setSigningOut(false);
          return;
        }
        
        setUserUsername('');
        setUserId('');

        setTimeout(() => {
          window.location = '/';
        }, 1000);
        
        setSigningOut(false);
        
      } catch (err) {
          console.log(err.message);
          setSigningOut(false);
      }

    }

    useEffect(() => {
      let timeout;
      if(loadingUserInfo === false) 
        timeout = setTimeout(() => setFetchingUserInfo(false), [1500]);
      return () => clearTimeout(timeout);   
    }, [loadingUserInfo]);

    if(userId.length <= 10){
        return fetchingUserInfo ? <MySkeleton isMobileHeader/> : <NotFound type={'user id exist'}/>
    }

  return (

    <div className='SignUp' style={{ minHeight: 'unset' }}>
      
      <div className='formDiv'>

        <form onSubmit={verifyAccount}>

            <h1>اثبات ملكية الحساب</h1>

            <button type='button' className='btnbackscndclr' style={{ margin: '-32px 0 24px 0' }} onClick={sendCodeToEmail}>{sendingCode ? 'جاري الارسال...' : 'ارسال رمز الى بريدك الالكتروني'}</button>
            <p id={sendCodeError.length > 0 ? 'p-info-error' : 'p-info'} style={{ marginTop: -20, marginBottom: 24 }}>{sendCodeError?.length > 0 ? sendCodeError : sendCodeSuccess}</p>

            <CustomInputDiv title={'ادخل الرمز'}  isError={code === '-1'} errorText={'الرجاء ادخال رمز صالح.'} listener={(e) => setCode(e.target.value)}/>

            <label id='success' style={!operationSuccess ? { marginTop: -44, padding: 0 } : { marginTop: -24 }}>{operationSuccess && 'تم اثبات الملكية بنجاح'} <Link href={`/profile?id=${userId}`} style={{ display: !operationSuccess && 'none' }}>الذهاب الى الملف الشخصي</Link></label>

            <button type='submit' className='btnbackscndclr' onClick={verifyAccount} style={{ marginTop: 0 }}>{verifing ? 'جاري اثبات الملكية...' : 'اثبات الملكية'}</button>

            <p id='p-info-error'>{verifyError?.length > 0 ? verifyError : ''}</p>
        
        </form>

        <strong>أو</strong>

        <p id='navigate-to-sign' onClick={logout}>{signingOut ? 'جاري تسجيل الخروج...' : 'تسجيل خروج'}</p>

      </div>

    </div>

  )
};

export default page;
