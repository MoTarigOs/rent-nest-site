'use client';

import CustomInputDiv from '@components/CustomInputDiv';
import '../../sign-up/SignUp.scss';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { isValidEmail, isValidPassword } from '@utils/Logic';
import { getUserInfo, login } from '@utils/api';
import { Context } from '@utils/Context';
import NotFound from '@components/NotFound';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import LoadingCircle from '@components/LoadingCircle';

const page = () => {

  
  const [loading, setLoading] = useState(false);
  const [successLogin, setSuccessLogin] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const { 
    userId, isVerified, triggerUserInfo, setTriggerUserInfo
  } = useContext(Context);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaToken = async() => {
    if (!executeRecaptcha) return;
    const gReCaptchaToken = await executeRecaptcha('submit');
    console.log('recaptcha token: ', gReCaptchaToken);
    return gReCaptchaToken;
  };

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

    if(userId) return;

    let errorEncountered = false;

    const isItValidEmail = isValidEmail(email);
    if(!isItValidEmail.ok) {
      setEmail('-1');
      setEmailError('invalid email');
      setSuccessLogin(false);
      errorEncountered = true;
    };

    const isItValidPassword = isValidPassword(password);
    if(!isItValidPassword.ok) {
      setPassword('-1');
      setPasswordError('invalid password');
      setSuccessLogin(false);
      errorEncountered = true;
    };

    if(errorEncountered === true) return;

    setLoading(true);

    try {

      const token = await getRecaptchaToken();

      const res = await login(email, password, true, token);

      if(!res || res.success !== true){
        setError(res.dt);
        setLoading(false);
        setSuccessLogin(false);
        return;
      }

      setTriggerUserInfo(!triggerUserInfo);
      setError('');
      setSuccessLogin(true);
      setLoading(false);        

    } catch (err) {
      setError('unknown error');
      setLoading(false);
      setSuccessLogin(false);
    }

  };

  useEffect(() => {
    if(successLogin) location.href = `/en/profile?id=${userId}`;
  }, [userId]);

  useEffect(() => {
    if(emailError.length > 0 || passwordError.length > 0){
        setError('Enter valid data');
      } else {
        setError('');
      }
  }, [emailError, passwordError])

  if(!successLogin && userId?.length > 10){
    return <NotFound type={'user id exist'} isEnglish />
  }

  return (

    <div className='SignUp' dir='ltr'>
      
      <div className='formDiv'>

        <h1>Login</h1>

        <form onSubmit={handleSubmit}>

          <CustomInputDiv isError={email === '-1' && true} errorText={emailError} type={'email'} title={'Enter Email'} listener={(e) => handleChange(e, 'email')}/>

          <CustomInputDiv isError={password === '-1' && true} errorText={passwordError} type={'password'} title={'Enter Password'} listener={(e) => handleChange(e, 'password')}/>

          <Link href={'/forget-password'} id='forget-password'>I forgot password</Link>

          <label id='error' style={{ padding: error.length <= 0 && 0, margin: error.length <= 0 && 0 }}>{error}</label>

          <label id='success' style={{ padding: !successLogin && 0, margin: !successLogin && 0 }}>{successLogin && 'You have been logged in successfully'} <Link href={isVerified ? `/en/profile?id=${userId}` : '/en/verify-account'} style={{ display: !successLogin && 'none' }}>Go to profile</Link></label>

          <button>{loading ? <LoadingCircle /> : 'Login'}</button>

        </form>

        <strong>Or</strong>

        <Link id='navigate-to-sign' href={'/en/sign-up'}>Register</Link>

      </div>

    </div>

  )
}

export default page
