'use client';

import CustomInputDiv from '@components/CustomInputDiv';
import './SignUp.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { isValidEmail, isValidPassword, isValidText, isValidUsername } from '@utils/Logic';
import Link from 'next/link';
import { checkUsername, register } from '@utils/api';
import NotFound from '@components/NotFound';
import { Context } from '@utils/Context';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import LoadingCircle from '@components/LoadingCircle';

const page = () => {

  const { userId } = useContext(Context);

  const [loading, setLoading] = useState(false);
  const [successRegister, setSuccessRegister] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isOkayUsername, setIsOkayUsername] = useState(false);
  const [userStopsWriting, setUserStopsWriting] = useState(true);
  const usernameInputRef = useRef();
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [userType, setUserType] = useState('guest');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
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
      setError('الرجاء الموافقة على الشروط و الأحكام.');
      return;
    } else {
      setError('');
    }

    let errorEncountered = false;

    if(firstName === '-1' || !isValidText(firstName) || firstName?.length > 20) {
      setSuccessRegister(false);
      setFirstName('-1');
      setFirstNameError('اسم اول غير صالح');
      errorEncountered = true;
    };

    if(lastName === '-1' || !isValidText(lastName) || lastName?.length > 20) {
      setSuccessRegister(false);
      setLastName('-1');
      setLastNameError('اسم عائلة غير صالح');
      errorEncountered = true;
    };

    if(username === '-1' || !isOkayUsername || !isValidText(username) || username?.length > 32) {
      setSuccessRegister(false);
      setUsername('-1');
      setUsernameError('معرف مستخدم غير صالح');
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

    if(phone?.length > 0 && (phone === '-1' || !isValidText(phone) || phone?.length > 20)) {
      setSuccessRegister(false);
      setUsername('-1');
      setUsernameError('رقم هاتف غير صالح');
      errorEncountered = true;
    };

    if(address?.length > 0 && (address === '-1' || !isValidText(address) || address?.length > 20)) {
      setSuccessRegister(false);
      setUsername('-1');
      setUsernameError('عنوان جغرافي غير صالح');
      errorEncountered = true;
    };

    if(errorEncountered === true) {
      setError('الرجاء ملء الحقول ببيانات صالحة.');
      return;
    }

    setLoading(true);

    try {

      const token = await getRecaptchaToken();

      const res = await register(username, email, password, false, token, firstName, lastName, userType, phone, address);

      if(!res || res.success !== true){
        setError(res.dt?.message);
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

  };

  const handleChange = (e, type) => {

    switch(type){

      case 'first name':
        if(e.target.value?.length > 0 && !isValidText(e.target.value)) {
          setFirstName('-1');
          setFirstNameError(`اسم أول غير صالح.`);
        } else {
          setFirstName(e.target.value || '');
          setFirstNameError('');
        };
        return;

      case 'last name':
        if(e.target.value?.length > 0 && !isValidText(e.target.value)) {
          setLastName('-1');
          setLastNameError(`اسم عائلة غير صالح.`);
        } else {
          setLastName(e.target.value || '');
          setLastNameError('');
        };
        return;

      case 'username':
        const isItValidUsername = isValidUsername(e.target.value);
        if(!isItValidUsername.ok) {
          setUsername('-1');
          setUsernameError(`هذه الحروف غير صالحة, ${isItValidUsername.dt.toString()}, يرجى استعمال الحروف بين A-Z, a-z, 0-9 و _`);
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
        
      case 'phone':
        if(e.target.value?.length > 0 && !isValidText(e.target.value)) {
          setPhone('-1');
          setPhoneError(`رقم هاتف غير صالح.`);
        } else {
          setPhone(e.target.value || '');
          setPhoneError('');
        };
        return;

      case 'address':
        if(e.target.value?.length > 0 && !isValidText(e.target.value)) {
          setAddress('-1');
          setAddressError(`عنوان جغرافي غير صالح.`);
        } else {
          setAddress(e.target.value || '');
          setAddressError('');
        };
        return;
      
    };

  };

  const checkValidUsername = async(thisName) => {
    
    try {

      if(!userStopsWriting) return;
      let start = Date.now();
      setCheckingUsername(true);
      const res = await checkUsername(thisName);
      const end = Date.now();

      const m = (resObj) => {
        if(!resObj || resObj.success !== true){
          setIsOkayUsername(false);
          setUsername('-1');
          setUsernameError('هذا الاسم مستخدم مسبقا, الرجاء جعله فريدا باضافة ارقام أو _ أو حروف A-Z, a-z & 0-9.');
          setCheckingUsername(false);
          return;
        }
        setIsOkayUsername(true);
        setCheckingUsername(false);
      };

      if(end - start < 1500){
        setTimeout(() => m(res), 1500 - (end - start));
      } else {
        m(res);
      }

    } catch (err) {
      console.log(err);
      setIsOkayUsername(false);setUsername('-1');
      setUsernameError('هذا الاسم مستخدم مسبقا, الرجاء جعله فريدا باضافة ارقام أو _ أو حروف A-Z, a-z & 0-9.');
      setCheckingUsername(false);
    }

  };

  let timeoutid;
  const delay = 1000;

  useEffect(() => {
    usernameInputRef?.current?.addEventListener('keyup', () => {
      clearTimeout(timeoutid);
      console.log('key up');
      timeoutid = setTimeout(() => setUserStopsWriting(true), delay);
    });
    usernameInputRef?.current?.addEventListener('keydown', () => {
      setUserStopsWriting(false);
      console.log('key down');
      clearTimeout(timeoutid);
    });

    return () => {
      usernameInputRef?.current?.removeEventListener('keyup', () => {
        timeoutid = setTimeout(() => setUserStopsWriting(true), delay)
      });
      usernameInputRef?.current?.removeEventListener('keydown', () => {
        setUserStopsWriting(false);
        clearTimeout(timeoutid);
      });
    }
  }, []);

  useEffect(() => {
    if(userStopsWriting && username?.length > 0
       && !isOkayUsername && isValidUsername(username)?.ok) 
      checkValidUsername(username);
  }, [userStopsWriting]);

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

        <h1>أنشئ حساب</h1>

        <form onSubmit={handleSubmit}>

          <CustomInputDiv isError={firstName === '-1' && true} errorText={firstNameError} title={'الاسم الأول'} listener={(e) => handleChange(e, 'first name')}/>
          
          <CustomInputDiv isError={lastName === '-1' && true} errorText={lastNameError} title={'اسم العائلة'} listener={(e) => handleChange(e, 'last name')}/>
          
          <CustomInputDiv myRef={usernameInputRef} isError={username === '-1' && true} errorText={usernameError} placholderValue={'مثال: jon_smith123'} title={'اكتب معرف مستخدم فريد'} listener={(e) => {
            handleChange(e, 'username');
            setIsOkayUsername(false);
          }} loadingIcon={checkingUsername} okayIcon={isOkayUsername}/>

          <CustomInputDiv isError={email === '-1' && true} errorText={emailError} type={'email'} title={'ادخل بريدك الالكتروني'} listener={(e) => handleChange(e, 'email')}/>

          <CustomInputDiv isError={password === '-1' && true} errorText={passwordError} type={'password'} title={'ادخل كلمة مرور'} listener={(e) => handleChange(e, 'password')}/>
          
          <CustomInputDiv isError={confirmPassword === '-1' && true} errorText={confirmPasswordError} type={'password'} title={'أكد كلمة المرور'} listener={(e) => handleChange(e, 'confirm password')} myStyle={{ marginBottom: 32 }}/>
          
          <div className='selectKind'>
              <h3>نوع الحساب</h3>
              <select onChange={(e) => {
                  setUserType(e.target.value);
              }}>
                  <option value={'guest'} selected>حساب نزيل</option>
                  <option value={'host'}>حساب معلن</option>
              </select>
          </div>
            
          <CustomInputDiv isError={phone === '-1' && true} errorText={phoneError} title={'رقم الهاتف (اختياري)'} listener={(e) => handleChange(e, 'phone')}/>

          <CustomInputDiv isError={address === '-1' && true} errorText={addressError} title={'موقعك الجغرافي (اختياري)'} listener={(e) => handleChange(e, 'address')} myStyle={{ marginBottom: 32 }}/>

          <div className='policies'>
            <input type='checkbox' ref={agreeToTermsRef}/>
            <p>أوافق على</p>
            <Link href={'/about#conditions'}>شروط الاستخدام</Link>
            و
            <Link href={'/about#conditions'}>الأحكام</Link>
          </div>

          <label id='error' style={{ padding: error.length <= 0 && 0, margin: error.length <= 0 && 0 }}>{error}</label>
          
          <label id='success' style={{ padding: !successRegister && 0, margin: !successRegister && 0 }}>{successRegister && 'تم انشاء الحساب بنجاح'} <Link href={'/sign-in'} style={{ display: !successRegister && 'none' }}>الذهاب الى تسجيل الدخول</Link></label>

          <button type='submit'>{loading ? <LoadingCircle /> : 'إِنشاء الحساب'}</button>

        </form>

        <strong>أو</strong>

        <Link id='navigate-to-sign' href={'/sign-in'}>تسجيل الدخول</Link>
        
      </div>

    </div>

  )
}

export default page
