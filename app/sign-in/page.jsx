'use client';

import CustomInputDiv from '@components/CustomInputDiv';
import '../sign-up/SignUp.css';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { isValidEmail, isValidPassword } from '@utils/Logic';
import { getUserInfo, login } from '@utils/api';
import { Context } from '@utils/Context';

const page = () => {

  
  const [loading, setLoading] = useState(false);
  const [successLogin, setSuccessLogin] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const { userId, setUserId, setUserUsername, setUserRole } = useContext(Context);

  const handleChange = (e, type) => {
    switch(type){
      
      case 'email':
        setEmail(e.target.value);
        setEmailError('');
        return;

      case 'password':
        setPassword(e.target.value);
        setPasswordError('');
        return;

    }
  };

  const handleSubmit = async(e) => {

    e.preventDefault();

    let errorEncountered = false;

    const isItValidEmail = isValidEmail(email);
    if(!isItValidEmail.ok) {
      setEmail('-1');
      setEmailError('بريد الكتروني غير صالح');
      setSuccessLogin(false);
      errorEncountered = true;
    };

    const isItValidPassword = isValidPassword(password);
    if(!isItValidPassword.ok) {
      setPassword('-1');
      setPasswordError('كلمة مرور غير صالحة');
      setSuccessLogin(false);
      errorEncountered = true;
    };

    if(errorEncountered === true) return;

    setLoading(true);

    try {
      const res = await login(email, password);
      if(!res || res.success !== true){
        setError(res.dt);
        setLoading(false);
        setSuccessLogin(false);
        return;
      }
      setError('');
      setSuccessLogin(true);
      setLoading(false);
      getUserInfo(setUserId, setUserUsername, setUserRole);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setSuccessLogin(false);
    }

  };

  useEffect(() => {
    if(emailError.length > 0 || passwordError.length > 0){
        setError('ادخل بيانات صالحة');
      } else {
        setError('');
      }
  }, [emailError, passwordError])

  return (

    <div className='SignUp'>
      
      <div className='formDiv'>

        <h1>تسجيل الدخول</h1>

        <form onSubmit={handleSubmit}>

          <CustomInputDiv isError={email === '-1' && true} errorText={emailError} type={'email'} title={'ادخل بريدك الالكتروني'} listener={(e) => handleChange(e, 'email')}/>

          <CustomInputDiv isError={password === '-1' && true} errorText={passwordError} type={'password'} title={'ادخل كلمة مرور'} listener={(e) => handleChange(e, 'password')}/>

          <label id='error' style={{ padding: error.length <= 0 && 0, margin: error.length <= 0 && 0 }}>{error}</label>

          <label id='success' style={{ padding: !successLogin && 0, margin: !successLogin && 0 }}>{successLogin && 'تم تسجيل الدخول بنجاح'} <Link href={`/profile?id=${userId}`} style={{ display: !successLogin && 'none' }}>الذهاب الى الملف الشخصي</Link></label>

          <button>{loading ? 'جاري تسجيل الدخول ...' : 'تسجيل الدخول'}</button>

        </form>

        <strong>أو</strong>

        <Link href={'/sign-up'}>إِنشاء حساب</Link>

      </div>

    </div>

  )
}

export default page
