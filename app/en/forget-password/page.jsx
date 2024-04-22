'use client';

import CustomInputDiv from '@components/CustomInputDiv';
import '../../sign-up/SignUp.css';
import { useContext, useState } from 'react';
import { changePasswordSignPage, sendCode } from '@utils/api';
import { isValidEmail, isValidPassword } from '@utils/Logic';
import Link from 'next/link';
import { Context } from '@utils/Context';
import NotFound from '@components/NotFound';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const page = () => {

    const { userId } = useContext(Context);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [operationSuccess, setOperationSuccess] = useState(false);

    const [code, setCode] = useState('');
    const [sendingCode, setSendingCode] = useState(false);
    const [sendCodeError, setSendCodeError] = useState('');
    const [sendCodeSuccess, setSendCodeSuccess] = useState('');
    const [isSentCodeEmail, setIsSentCodeEmail] = useState(false);

    const [isChangingPass, setIsChangingPass] = useState(false);
    const [changePassError, setChangePassError] = useState(false);

    const { executeRecaptcha } = useGoogleReCaptcha();

    const getRecaptchaToken = async() => {
      if (!executeRecaptcha) return;
      const gReCaptchaToken = await executeRecaptcha('submit');
      console.log('recaptcha token: ', gReCaptchaToken);
      return gReCaptchaToken;
    };

    const sendCodeToEmail = async() => {

        try {
  
          if(sendingCode) return;

          if(!isValidEmail(email).ok){
            setEmail('-1');
            setSendCodeError('Please enter a valid email address.');
            return;
          }
  
          setSendingCode(true);
  
          const res = await sendCode(email, true);
  
          if(res.success !== true) {
            setSendCodeError(res.dt); 
            setSendCodeSuccess('');
            setIsSentCodeEmail(false);
            setSendingCode(false);
            return;
          };
  
          setSendCodeError('');
          setSendCodeSuccess('A code has been sent to your email');
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

    const changePassword = async(e) => {

        e.preventDefault();
        
        if(isChangingPass) return;

        setOperationSuccess(false);

        if(!isSentCodeEmail){
            setChangePassError('Send a code to your email to verify that you own the account.');
            return;
        }

        let errorEncountered = false;

        if(!isValidEmail(email)){
            setEmail('-1');
            errorEncountered = true;
        }

        if(code.length !== 6){
            setCode('-1');
            errorEncountered = true;
        }

        const validPass = isValidPassword(password);
        if(!validPass.ok){
            setPassword('-1');
            setPasswordError(validPass.dt);
            errorEncountered = true;
        }

        if(passwordConfirm !== password){
            setPasswordConfirm('-1');
            errorEncountered = true;
        }

        if(errorEncountered){
            setChangePassError('There is an error in one of the fields.');
            
            return;
        }

        setPasswordError('');

        setIsChangingPass(true);

        try {

            const token = await getRecaptchaToken();

            const res = await changePasswordSignPage(code, email, password, true, token);

            if(!res || res.success !== true){
                setChangePassError(res.dt);
                setIsChangingPass(false);
                return;
            }

            setChangePassError('');
            setOperationSuccess(true);
            setIsChangingPass(false);
            
        } catch (err) {
            console.log(err);
            setChangePassError('Something went wrong');
            setPasswordError('');
            setIsChangingPass(false);
        }

    };

    if(userId?.length > 10){
        return <NotFound type={'user id exist'} isEnglish/>
    }

  return (

    <div className='SignUp' dir='ltr'>
      
      <div className='formDiv'>

        <form onSubmit={changePassword}>

            <h1>New password</h1>

            <CustomInputDiv title={'Enter Your Email'} isError={email === '-1'} errorText={'Invalid email.'} listener={(e) => setEmail(e.target.value)}/>
            <button type='button' className='btnbackscndclr' style={{ margin: '-24px 0 0 0' }} onClick={sendCodeToEmail}>{sendingCode ? 'Sending...' : 'Send a code to your email'}</button>
            <p id={sendCodeError.length > 0 ? 'p-info-error' : 'p-info'}>{sendCodeError?.length > 0 ? sendCodeError : sendCodeSuccess}</p>

            <hr/>

            <CustomInputDiv title={'Enter code'}  isError={code === '-1'} errorText={'الرجاء ادخال رمز صالح.'} listener={(e) => setCode(e.target.value)}/>

            <CustomInputDiv title={'Enter new password'} isError={password === '-1'} errorText={passwordError} type={'password'} listener={(e) => setPassword(e.target.value)}/>

            <CustomInputDiv title={'Confirm password'} isError={passwordConfirm === '-1'} errorText={'No match'} type={'password'} listener={(e) => setPasswordConfirm(e.target.value)}/>

            <label id='success' style={!operationSuccess ? { margin: 0, padding: 0 } : {}}>{operationSuccess && 'The password has been changed successfully'} <Link href={'/sign-in'} style={{ display: !operationSuccess && 'none' }}>الذهاب الى تسجيل الدخول</Link></label>

            <button type='submit' className='btnbackscndclr' onClick={changePassword}>{isChangingPass ? 'Password is being changed...' : 'change Password'}</button>

            <p id='p-info-error'>{changePassError?.length > 0 ? changePassError : ''}</p>
        
        </form>

      </div>

    </div>

  )
};

export default page;
