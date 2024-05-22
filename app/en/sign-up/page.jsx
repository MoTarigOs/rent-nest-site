'use client';

import CustomInputDiv from '@components/CustomInputDiv';
import '../../sign-up/SignUp.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { isValidEmail, isValidPassword, isValidUsername } from '@utils/Logic';
import Link from 'next/link';
import { register } from '@utils/api';
import NotFound from '@components/NotFound';
import { Context } from '@utils/Context';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import LoadingCircle from '@components/LoadingCircle';

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

  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaToken = async() => {
    if (!executeRecaptcha) return;
    const gReCaptchaToken = await executeRecaptcha('submit');
    console.log('recaptcha token: ', gReCaptchaToken);
    return gReCaptchaToken;
  };

  const handleSubmit = async(e) => {

    e.preventDefault();

    if(userId) return;

    if(!agreeToTermsRef?.current?.checked) {
      setError('Please agree to the terms and conditions.');
      return;
    } else {
      setError('');
    }

    let errorEncountered = false;

    if(username === '-1' || username.length <= 0 || typeof username !== 'string' || username.length > 45) {
      setSuccessRegister(false);
      setUsername('-1');
      setUsernameError('invalid username');
      errorEncountered = true;
    };

    const isItValidEmail = isValidEmail(email);
    if(!isItValidEmail.ok) {
      setEmail('-1');
      setEmailError('invalid email');
      setSuccessRegister(false);
      errorEncountered = true;
    };

    const isItValidPassword = isValidPassword(password);
    if(!isItValidPassword.ok) {
      setPassword('-1');
      setPasswordError('invalid password');
      setSuccessRegister(false);
      errorEncountered = true;
    };

    if(confirmPassword === '-1' || confirmPassword !== password || typeof confirmPassword !== 'string' || confirmPassword.length < 8 || confirmPassword.length > 100) {
      setSuccessRegister(false);
      setConfirmPassword('-1');
      setConfirmPasswordError('confirm password');
      errorEncountered = true;
    };

    if(errorEncountered === true) {
      setError('There is an error in one of the fields.');
      return;
    }

    setLoading(true);

    try {

      const token = await getRecaptchaToken();

      const res = await register(username, email, password, true, token);

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
      setError('unknown error');
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
          setUsernameError(`These characters are invalid ${isItValidUsername.dt.toString()}`);
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
            setConfirmPasswordError('No match');
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

    <div className='SignUp' dir='ltr'>
      
      <div className='formDiv'>

        <h1>Register</h1>

        <form onSubmit={handleSubmit}>

          <CustomInputDiv isError={username === '-1' && true} errorText={usernameError} title={'Full Name'} listener={(e) => handleChange(e, 'username')}/>

          <CustomInputDiv isError={email === '-1' && true} errorText={emailError} type={'email'} title={'Enter Email'} listener={(e) => handleChange(e, 'email')}/>

          <CustomInputDiv isError={password === '-1' && true} errorText={passwordError} type={'password'} title={'Enter Password'} listener={(e) => handleChange(e, 'password')}/>
          
          <CustomInputDiv isError={confirmPassword === '-1' && true} errorText={confirmPasswordError} type={'password'} title={'Confirm Password'} listener={(e) => handleChange(e, 'confirm password')}/>
          
          <div className='policies'>
            <input type='checkbox' ref={agreeToTermsRef}/>
            <p>I agree to</p>
            <Link href={'/en/about#conditions'}>terms of use</Link>
            and
            <Link href={'/en/about#conditions'}>Conditions</Link>
          </div>

          <label id='error' style={{ padding: error.length <= 0 && 0, margin: error.length <= 0 && 0 }}>{error}</label>
          
          <label id='success' style={{ padding: !successRegister && 0, margin: !successRegister && 0 }}>{successRegister && 'Account successfully created'} <Link href={'/sign-in'} style={{ display: !successRegister && 'none' }}>الذهاب الى تسجيل الدخول</Link></label>

          <button type='submit'>{loading ? <LoadingCircle /> : 'Create Account'}</button>

        </form>

        <strong>Or</strong>

        <Link id='navigate-to-sign' href={'/en/sign-in'}>Login</Link>
        
      </div>

    </div>

  )
}

export default page
