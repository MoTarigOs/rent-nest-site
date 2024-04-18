'use client';

import CustomInputDiv from '@components/CustomInputDiv';
import './SignUp.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { isValidEmail, isValidPassword, isValidUsername } from '@utils/Logic';
import Link from 'next/link';
import { register } from '@utils/api';
import NotFound from '@components/NotFound';
import { Context } from '@utils/Context';

const page = () => {

  const { userId } = useContext(Context);

  const [loading, setLoading] = useState(false);
  const [successRegister, setSuccessRegister] = useState(false);
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const agreeToTermsRef = useRef(null);

  const handleSubmit = async(e) => {

    e.preventDefault();

    if(userId) return;

    if(!agreeToTermsRef?.current?.checked) {
      setError('الرجاء الموافقة على الشروط و الأحكام.');
      return;
    } else {
      setError('');
    }

    let errorEncountered = false;

    if(username === '-1' || username.length <= 0 || typeof username !== 'string' || username.length > 45) {
      setSuccessRegister(false);
      setUsername('-1');
      setUsernameError('اسم غير صالح');
      errorEncountered = true;
    };

    const isItValidEmail = isValidEmail(email);
    if(!isItValidEmail.ok) {
      setEmail('-1');
      setEmailError('بريد الكتروني غير صالح');
      setSuccessRegister(false);
      errorEncountered = true;
    };

    const isItValidPassword = isValidPassword(password);
    if(!isItValidPassword.ok) {
      setPassword('-1');
      setPasswordError('كلمة مرور غير صالحة');
      setSuccessRegister(false);
      errorEncountered = true;
    };

    if(confirmPassword === '-1' || confirmPassword !== password || typeof confirmPassword !== 'string' || confirmPassword.length < 8 || confirmPassword.length > 100) {
      setSuccessRegister(false);
      setConfirmPassword('-1');
      setConfirmPasswordError('قم بتأكيد كلمة المرور');
      errorEncountered = true;
    };

    if(errorEncountered === true) {
      setError('هنالك خطأ في أحد الحقول.');
      return;
    }

    setLoading(true);

    try {
      const res = await register(username, email, password);
      if(!res || res.success !== true){
        setError(res.dt);
        setLoading(false);
        setSuccessRegister(false);
        return;
      }
      setError('');
      setSuccessRegister(true);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setSuccessRegister(false);
    }

  }

  const handleChange = (e, type) => {

    switch(type){

      case 'username':
        const isItValidUsername = isValidUsername(e.target.value);
        if(!isItValidUsername.ok) {
          setUsername('-1');
          setUsernameError(`هذه الحروف غير صالحة ${isItValidUsername.dt.toString()}`);
        } else {
          setUsername(e.target.value);
          setUsernameError('');
        };
        return;

      case 'email':
        setEmail(e.target.value);
        setEmailError('');
        return;

      case 'password':
          setPassword(e.target.value);
          setPasswordError('');
          return;

      case 'confirm password':
        const confirmPasswordText = e.target.value;
        for (let i = 0; i < confirmPasswordText.length; i++) {
          if(confirmPasswordText[i] !== password[i]){
            setConfirmPassword('-1');
            setConfirmPasswordError('لا يوجد تطابق');
            return;
          }
        }
        setConfirmPassword(confirmPasswordText);
        setConfirmPasswordError('');
        return;
        
    }
  }

  useEffect(() => {
    if(usernameError.length > 0 
      || emailError.length > 0 
      || passwordError.length > 0 
      || confirmPasswordError.length > 0){
        setError('هنالك خطأ في احد الحقول');
      } else {
        setError('');
      }
  }, [usernameError, emailError, passwordError, confirmPasswordError]);

  if(userId?.length > 10){
    return <NotFound type={'user id exist'}/>
  }

  return (

    <div className='SignUp'>
      
      <div className='formDiv'>

        <h1>أنشئ حساب </h1>

        <form onSubmit={handleSubmit}>

          <CustomInputDiv isError={username === '-1' && true} errorText={usernameError} title={'الاسم الكامل'} listener={(e) => handleChange(e, 'username')}/>

          <CustomInputDiv isError={email === '-1' && true} errorText={emailError} type={'email'} title={'ادخل بريدك الالكتروني'} listener={(e) => handleChange(e, 'email')}/>

          <CustomInputDiv isError={password === '-1' && true} errorText={passwordError} type={'password'} title={'ادخل كلمة مرور'} listener={(e) => handleChange(e, 'password')}/>
          
          <CustomInputDiv isError={confirmPassword === '-1' && true} errorText={confirmPasswordError} type={'password'} title={'أكد كلمة المرور'} listener={(e) => handleChange(e, 'confirm password')}/>
          
          <div className='policies'>
            <input type='checkbox' ref={agreeToTermsRef}/>
            <p>أوافق على</p>
            <Link href={'/about#conditions'}>شروط الاستخدام</Link>
            و
            <Link href={'/about#conditions'}>الأحكام</Link>
          </div>

          <label id='error' style={{ padding: error.length <= 0 && 0, margin: error.length <= 0 && 0 }}>{error}</label>
          
          <label id='success' style={{ padding: !successRegister && 0, margin: !successRegister && 0 }}>{successRegister && 'تم انشاء الحساب بنجاح'} <Link href={'/sign-in'} style={{ display: !successRegister && 'none' }}>الذهاب الى تسجيل الدخول</Link></label>

          <button type='submit'>{loading ? 'جاري انشاء الحساب ...' : 'إِنشاء الحساب'}</button>

        </form>

        <strong>أو</strong>

        <Link id='navigate-to-sign' href={'/sign-in'}>تسجيل الدخول</Link>
        
      </div>

    </div>

  )
}

export default page
