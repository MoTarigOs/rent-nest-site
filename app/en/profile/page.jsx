'use client';

import '../../profile/Profile.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '@utils/Context';
import Card from '@components/Card';
import { askToBeHost, changeMyPass, checkUsername, deleteMyAccount, editUser, getBooks, getFavourites, getGuests, getOwnerProperties, removeGuest, sendCode, signOut, verifyGuest, verifyMyEmail } from '@utils/api';
import InfoDiv from '@components/InfoDiv';
import CustomInputDiv from '@components/CustomInputDiv';
import Svgs from '@utils/Svgs';
import { getRoleArabicName, isValidEmail, isValidPassword, isValidUsername, isValidVerificationCode } from '@utils/Logic';
import MySkeleton from '@components/MySkeleton';
import NotFound from '@components/NotFound';
import CustomInputDivWithEN from '@components/CustomInputDivWithEN';
import LoadingCircle from '@components/LoadingCircle';
import Image from 'next/image';
import PropertiesArray from '@components/PropertiesArray';
import Notif from '@components/popups/Notif';

const page = () => {

  const { 
    userId, setUserId, setUserUsername, userUsername, userEmail, isVerified,
    userAddress, userPhone, userRole, loadingUserInfo, storageKey,
    selectedTab, setSelectedTab, userUsernameEN, userAddressEN,
    setUserAddress, setUserAddressEN, setUserPhone, userFirstName, userLastName,
    userAccountType, userFirstNameEN, userLastNameEN, setUserFirstName, setUserLastName,
    setUserFirstNameEN, setUserLastNameEN
  } = useContext(Context);

    const [isProfileDetails, setIsProfileDetails] = useState(true);
    const [isItems, setIsItems] = useState(false);
    const [isBooks, setIsBooks] = useState(false);
    const [isFavourites, setIsFavourites] = useState(false);
    const [isSignOut, setIsSignOut] = useState(false);

    const [fetchingUserInfo, setFetchingUserInfo] = useState(true);

    const [loadingItems, setLoadingItems] = useState(false);
    const [loadingGuests, setLoadingGuests] = useState(false);
    const [confirmingGuest, setConfirmingGuest] = useState(-1);
    const [deletingGuest, setDeletingGuets] = useState(-1);
    const [guestsArray, setGuestsArray] = useState([]);

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
      editUsername: userUsername, 
      editFirstName: userFirstName,
      editLastName: userLastName,
      editFirstNameEN: userFirstNameEN,
      editLastNameEN: userLastNameEN,
      editAddress: userAddress, 
      editAddressEN: userAddressEN,
      editPhone: userPhone
    });
    const [editInfoError, setEditInfoError] = useState('');
    const [editInfoSuccess, setEditInfoSuccess] = useState('');
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [isOkayUsername, setIsOkayUsername] = useState(false);
    const [userStopsWriting, setUserStopsWriting] = useState(true);
    const [usernameError, setUsernameError] = useState('');
    const usernameInputRef = useRef();

    const [isDeleteAccountDiv, setIsDeleteAccountDiv] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [deleteAccountSuccess, setDeleteAccountSuccess] = useState('');
    const [deleteAccountError, setDeleteAccountError] = useState('');

    const [isConvertDiv, setIsConvertDiv] = useState(false);
    const [convertingToHost, setConvertingToHost] = useState(false);
    const [convertError, setConvertError] = useState('');
    const [convertSuccess, setConvertSuccess] = useState('');

    const [signOutInfo, setSignOutInfo] = useState('');
    const [signingOut, setSigningOut] = useState(false);

    const cardsPerPage = 12;

    const settingGuests = async() => {

      setLoadingGuests(true);

      try {
        
        const res = await getGuests();

        if(res.success !== true){
          setLoadingGuests(false);
          return;
        };

        setGuestsArray(res.dt);
        setLoadingGuests(false);

      } catch (err) {
        console.log(err);
        setLoadingGuests(false);
      }

    };

    const confirmGuest = async(guestId, propertyId, index) => {
      try {
        if(confirmingGuest !== -1) return;
        setConfirmingGuest(index);
        const res = await verifyGuest(guestId, propertyId);
        if(!res || res.ok !== true) return setConfirmingGuest(-1);
        setGuestsArray(res.dt);        
        setConfirmingGuest(-1);
      } catch (err) {
        console.log(err);
        setConfirmingGuest(-1);
      }
    };

    const deleteGuest = async(guestId, propertyId, index) => {
      try {
        if(deletingGuest !== -1) return;
        setDeletingGuets(index);
        const res = await removeGuest(guestId, propertyId);
        if(!res || res.ok !== true) return setDeletingGuets(-1);
        setGuestsArray(res.dt);        
        setDeletingGuets(-1);
      } catch (err) {
        console.log(err);
        setDeletingGuets(-1);
      }
    };

    const sendCodeToEmail = async(x, notVerify) => {

      try {

        if(!notVerify && isVerified) return;

        if(!userEmail || !isValidEmail(userEmail)) return;

        setSendingCode(true);

        const res = await sendCode(null, true);

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
        setSendCodeSuccess('A code has been sent to your email');
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
          setSendCodeError(''); setSendCodeErrorPass('Something went wrong'); 
        } else {
          setSendCodeError('Something went wrong'); setSendCodeErrorPass('');
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

        if(!userId) return;

        if(!isSentCodeEmail) return setVerifyError('Please send the code to your email first');

        setIsVerifyFetching(true);

        const res = await verifyMyEmail(code, null, true);

        if(res.success !== true) {
          setVerifyError(res.dt);
          setIsVerifyFetching(false);
          return;
        }

        setVerifyError('');
        setVerifySuccess('Verification has been completed successfully, please reload the page');
        setIsVerifyFetching(false);
        
      } catch (err) {
        console.log(err.message);
        setVerifyError('Something went wrong');
        setVerifySuccess('');
        setIsVerifyFetching(false);
      }

    };

    const changePassword = async() => {

      try {

        if(!userId) return;

        if(!isSentCodePass) return changePasswordError('Please send the code to your email first');
        
        if(!isValidVerificationCode(code)){
          setChangePasswordError('invalid code');
          return;
        }

        if(!isValidPassword(newPass)){
          setChangePasswordError('invalid password');
          return;
        }

        setChangingPass(true);

        const res = await changeMyPass(code, newPass, userEmail, true);

        if(res.success !== true) {
          setChangePasswordError(res.dt);
          setChangingPass(false);
          return;
        }

        setChangePasswordError('');
        setChangePasswordSuccess('The password has been changed successfully');
        setChangingPass(true);

      } catch (err) {
        console.log(err.message);
        setChangePasswordError('Something went wrong');
        setChangePasswordSuccess('');
        setChangingPass(false);
      }

    };

    const editUserInfo = async() => {

      try {

        if(!userId) return;

        const editObj = {};

        if(editInfo.editFirstName && editInfo.editFirstName !== userFirstName) editObj.updateFirstName = editInfo.editFirstName;
        if(editInfo.editFirstNameEN && editInfo.editFirstNameEN !== userFirstNameEN) editObj.updateFirstNameEN = editInfo.editFirstNameEN;
        if(editInfo.editLastName && editInfo.editLastName !== userLastName) editObj.updateLastName = editInfo.editLastName;
        if(editInfo.editLastNameEN && editInfo.editLastNameEN !== userLastNameEN) editObj.updateLastNameEN = editInfo.editLastNameEN;
        if(editInfo.editUsername && editInfo.editUsername !== userUsername) editObj.updateUsername = editInfo.editUsername;
        if(editInfo.editAddressEN !== userAddressEN) editObj.updateAddressEN = editInfo.editAddressEN;
        if(editInfo.editAddress !== userAddress) editObj.updateAddress = editInfo.editAddress;
        if(editInfo.editPhone !== userPhone) editObj.updatePhone = editInfo.editPhone;

        console.log('editInfo object: ', editObj);

        if(!Object.keys(editObj)?.length > 0){
          setEditInfoError('No changes detected');
          setEditInfoSuccess('');
          return;
        };

        setEditingInfo(true);

        const res = await editUser(editObj);

        if(res.success !== true){
          setEditInfoError(res.dt);
          setEditInfoSuccess('');
          setEditingInfo(false);
          return;
        }

        setEditInfoError('');
        setEditInfoSuccess('The data has been modified successfully.');
        setUserFirstName(res.dt?.first_name);
        setUserFirstNameEN(res.dt?.first_name_en);
        setUserLastName(res.dt?.last_name);
        setUserLastNameEN(res.dt?.last_name_en);
        setUserUsername(res.dt?.username);
        setUserAddress(res.dt?.address);
        setUserAddressEN(res.dt?.addressEN);
        setUserPhone(res.dt.phone);
        setEditingInfo(false);
        
      } catch (err) {
        console.log(err.message);
        setEditInfoError('Something went wrong');
        setEditInfoSuccess('');
        setEditingInfo(false);
      }

    };

    const deleteAccount = async() => {

      try {

        if(deletingAccount || !userId) return;

        if(!isSentCodeEmail || !code || code.length !== 6){
          setDeleteAccountError('Please enter a valid code.');
          setDeleteAccountSuccess('');
          return;
        }

        setDeletingAccount(true);

        const res = await deleteMyAccount(code, storageKey, userEmail, true);

        if(res.success !== true) {
          setDeleteAccountError(res.dt);
          setDeleteAccountSuccess('');
          setDeletingAccount(false);
          return;
        }

        setDeleteAccountError('');
        setDeleteAccountSuccess('The account has been deleted');
        setDeletingAccount(false);

      } catch (err) {
        console.log(err.message);
        setDeleteAccountError('Something went wrong');
        setDeleteAccountSuccess('');
        setDeletingAccount(false);
      }

    };

    const handleSignOut = async() => {

      try {

        setSigningOut(true);

        const res = await signOut(true);

        if(res.success !== true){
          setSignOutInfo(res.dt);
          setSigningOut(false);
          return;
        }
        
        setSignOutInfo('You have successfully logged out');
        setUserUsername('');
        setUserId('');

        setTimeout(() => {
          window.location = '/en';
        }, 1000);
        
        setSigningOut(false);
        
      } catch (err) {
          console.log(err.message);
          setSigningOut(false);
      }

    };

    const convertToHost = async() => {
      try {
          if(convertSuccess?.length > 0) return;
          if(!userPhone) return setConvertError('You must add your own phone number before transferring to an advertiser, where you will be contacted to prove your ownership of the number.');
          if(!userAddress) return setConvertError('Please specify your own geographical address before converting to an advertiser on the platform.');
          setConvertingToHost(true);
          const res = await askToBeHost();
          if(!res || res.ok !== true) {
            setConvertError('Something went wrong during the operation.');
            setConvertSuccess('');
            setConvertingToHost(false);
            return;
          }
          setConvertError('');
          setConvertSuccess('Your request has been submitted successfully. We will contact you as soon as possible.');
          setConvertingToHost(false);
      } catch(err) {
          console.log(err);
          setConvertingToHost(false);
      }
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
            setUsernameError('This name is already in use, please make it unique by adding numbers, _ or letters A-Z, a-z & 0-9.');
            setCheckingUsername(false);
            return;
          }
          setIsOkayUsername(true);
          setUsernameError('');
          setCheckingUsername(false);
        };
  
        if(end - start < 1500){
          setTimeout(() => m(res), 1500 - (end - start));
        } else {
          m(res);
        }
  
      } catch (err) {
        console.log(err);
        setIsOkayUsername(false);
        setUsernameError('This name is already in use, please make it unique by adding numbers, _ or letters');
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
        console.log('key down');
        setUserStopsWriting(false);
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
    }, [usernameInputRef?.current]);
  
    useEffect(() => {
      if(userStopsWriting && editInfo?.editUsername?.length > 0
         && !isOkayUsername && isValidUsername(editInfo?.editUsername)?.ok
         && editInfo.editUsername !== userUsername){ 
          checkValidUsername(editInfo?.editUsername);
      } else if(editInfo.editUsername === userUsername) {
          setUsernameError('');
          setIsOkayUsername(true);
      } else {
          setUsernameError('');
      }
    }, [userStopsWriting]);

    useEffect(() => {
      setEditInfo({
        editUsername: userUsername, 
        editFirstName: userFirstName,
        editFirstNameEN: userFirstNameEN,
        editLastName: userLastName,
        editLastNameEN: userLastNameEN,
        editAddress: userAddress, 
        editAddressEN: userAddressEN,
        editPhone: userPhone
      });
    }, [userAddress, userUsername, userPhone, userUsernameEN, userAddressEN, isProfileEdit]);

    useEffect(() => {
      let timeout;
      if(loadingUserInfo === false) 
        timeout = setTimeout(() => setFetchingUserInfo(false), [1500]);
      return () => clearTimeout(timeout);   
    }, [loadingUserInfo]);

    useEffect(() => {
      if(isProfileDetails) setSelectedTab('profileDetails');
      if(isItems) { setSelectedTab('items'); settingGuests(); };
      if(isBooks) setSelectedTab('books');
      if(isFavourites) setSelectedTab('favs');
      if(isSignOut) setSelectedTab('signout');
    }, [isProfileDetails, isItems, isBooks, isFavourites, isSignOut]);

    useEffect(() => {
      if(fetchingUserInfo){
        if(selectedTab === 'profileDetails') { setIsProfileDetails(true); return; }
        if(selectedTab === 'items') { setIsItems(true); setIsProfileDetails(false); return; }
        if(selectedTab === 'books') { setIsBooks(true); setIsProfileDetails(false); return; }
        if(selectedTab === 'favs') { setIsFavourites(true); setIsProfileDetails(false); return; }
        if(selectedTab === 'signout') { setIsSignOut(true); setIsProfileDetails(false); return; }
      }
    }, [selectedTab]);

    if(!userId || userId.length <= 10 || !isVerified){
      return (
        fetchingUserInfo ? <MySkeleton isMobileHeader/> : <NotFound navToVerify={!isVerified} type={!isVerified ? 'not allowed' : undefined} isEnglish />
      )
    };

    return (
      <div className='profile' dir='ltr'>

          {userAccountType !== 'host' && <div className='convert-to-host-div disable-text-copy' style={{ display: !isConvertDiv ? 'none' : undefined }}>
            <span id='close-span' onClick={() => setIsConvertDiv(false)}/>
            <div className='convertDiv'>
              <h3>Request converting from Guest Account to Host Acccount {'(Where you can add a property to the platform)'}</h3>
              <div className='btns'>
                <button className='btnbackscndclr' onClick={convertToHost} style={convertSuccess?.length > 0 ? { background: 'var(--darkWhite)', color: '#767676' } : null}>{convertingToHost ? <LoadingCircle /> : (convertSuccess?.length > 0 ? 'Request sent' : 'Request')}</button>
                <button className='btnbackscndclr' onClick={() => setIsConvertDiv(false)} style={{ background: 'var(--darkWhite)', color: '#767676' }}>Cancel</button>
              </div>
              <p style={{ display: convertingToHost ? 'none' : undefined }} id={convertError?.length > 0 ? 'p-info-error' : 'p-info'}>{convertError?.length > 0 ? convertError : convertSuccess}</p>
            </div>
          </div>}

          <Notif isEnglish/>

          <div className="details">
            
            <label id='username'>{userFirstNameEN || userLastNameEN || userUsername || userFirstName || userLastName}</label>

            <p id='underusername'>Your profile</p>

            <ul className='tabButtons'>
              <li className={isProfileDetails ? 'selectedTab' : undefined} onClick={() => {setIsProfileDetails(true); setIsItems(false); setIsFavourites(false); setIsBooks(false); setIsSignOut(false)}}>Profile data</li>
              <li className={isItems ? 'selectedTab' : undefined} onClick={() => {setIsProfileDetails(false); setIsItems(true); setIsFavourites(false); setIsBooks(false); setIsSignOut(false)}}>Offers</li>
              <li className={isBooks ? 'selectedTab' : undefined} onClick={() => {setIsProfileDetails(false); setIsItems(false); setIsFavourites(false); setIsBooks(true); setIsSignOut(false)}}>Reservations</li>
              <li className={isFavourites ? 'selectedTab' : undefined} onClick={() => {setIsProfileDetails(false); setIsItems(false); setIsFavourites(true); setIsBooks(false); setIsSignOut(false)}}>Favourites</li>
              <li className={isSignOut ? 'selectedTab' : undefined} onClick={() => {setIsProfileDetails(false); setIsItems(false); setIsFavourites(false); setIsBooks(false); setIsSignOut(true)}}>Logout</li>
            </ul>

            <div className='profileDetails' style={{ display: !isProfileDetails ? 'none' : undefined }}>

                <InfoDiv isEnglish title={'Email'} value={userEmail} 
                isInfo={!isVerified && true} info={'This account is not verified'}
                btnState={isVerifing}
                handleClick={() => setIsVerifing(!isVerifing)} type={'email'}
                btnAfterClck={'Verify Later'} btnTitle={'Verify Email'}/>

                <div className='verifyEmailDiv' style={{ display: !isVerifing && 'none' }}>
                  <button className='btnbackscndclr' onClick={() => sendCodeToEmail(null)}>{!sendingCode ? `Send code to ${userEmail}` : <LoadingCircle myStyle={{ height: 'fit-content' }}/>}</button>
                  <p style={{ color: sendCodeError.length > 0 && 'var(--softRed)' }}>{sendCodeError.length > 0 ? sendCodeError : (verifySuccess.length > 0 ? verifySuccess : sendCodeSuccess)}</p>
                  <div>
                    <CustomInputDiv title={'Enter code'} isError={verifyError.length > 0 && true} errorText={verifyError} listener={(e) => setCode(e.target.value)}/>
                    <button className='btnbackscndclr' onClick={verifyEmail}>{isVerifyFetching ? <LoadingCircle myStyle={{ height: 'fit-content' }}/> : 'Verify'}</button>
                  </div>
                </div>

                <hr />

                <InfoDiv title={'Role'} value={userRole}/>

                <hr />

                <InfoDiv title={'Account Type'} value={userAccountType === 'host' ? 'Host Account' : 'Guest Account'}/>

                {userAccountType !== 'host' && <button style={{ marginTop: 32 }} className='editDiv' 
                    onClick={() => setIsConvertDiv(true)}>
                    Convert to Host Account
                </button>}

                <hr />

                <div className='changePass'>
                  <button className={isChangePasswordDiv ? 'editDiv chngpassbtn' : 'editDiv'} 
                    onClick={() => {
                      setIsDeleteAccountDiv(false);
                      setIsChangePasswordDiv(!isChangePasswordDiv);
                    }}>
                    Change password<Svgs name={'dropdown arrow'}/>
                  </button>
                  <div className='verifyEmailDiv' style={{ display: !isChangePasswordDiv && 'none' }}>
                    <button className='btnbackscndclr first-btn' onClick={() => sendCodeToEmail(true, true)}>{!sendingCode ? `Send code to ${userEmail}` : <LoadingCircle myStyle={{ height: 'fit-content' }}/>}</button>
                    <p style={{ color: sendCodeErrorPass.length > 0 && 'var(--softRed)' }}>
                      {sendCodeErrorPass.length > 0 ? sendCodeErrorPass : (changePasswordSuccess ? changePasswordSuccess : sendCodeSuccess)}</p>
                    <CustomInputDiv title={'Enter new password'} 
                    isError={changePasswordError.length > 0 && true}
                    errorText={changePasswordError} 
                    listener={(e) => setNewPass(e.target.value)}/>
                    <div>
                      <CustomInputDiv title={'Enter code'} 
                      isError={sendCodeErrorPass.length > 0 && true} 
                      errorText={sendCodeErrorPass.length > 0 ? sendCodeErrorPass : changePasswordError}
                      listener={(e) => setCode(e.target.value)}/>
                      <button className='btnbackscndclr' onClick={changePassword}>{changingPass ? <LoadingCircle myStyle={{ height: 'fit-content' }}/> :'Change'}</button>
                    </div>
                  </div>
                </div>

                <hr />

                <div className='edit-profile-details'>

                  <div className='edit-profile-header'>
                    
                    <h2>Account details</h2>
                  
                    <div className='editDiv' onClick={() => setIsProfileEdit(!isProfileEdit)}>
                      Edit details
                      <Svgs name={'edit'}/>
                    </div>
                    
                  </div>

                  {!isProfileEdit ? <>
                    <InfoDiv title={'First name'} value={userFirstNameEN || userFirstName}/>
                    <InfoDiv title={'Last name'} value={userLastNameEN || userLastName}/>
                    <InfoDiv title={'Username'} value={userUsername}/>
                    <InfoDiv title={'Location Address'} value={userAddressEN || userAddress}/>
                    <InfoDiv title={'Phone number'} value={userPhone} isInfo={true} info={'Not visible to public'}/>
                  </> : <>

                    <CustomInputDivWithEN title={'Edit First name'} placholderValue={'Enter name in Arabic'} enPlacholderValue={'Enter name in English'} 
                      value={editInfo.editFirstName} enValue={editInfo.editFirstNameEN} isEnglish isProfileDetails listener={(e) => {
                        setEditInfo({
                          editUsername: editInfo.editUsername, 
                          editFirstName: e.target.value,
                          editLastName: editInfo.editLastName,
                          editFirstNameEN: editInfo.editFirstNameEN,
                          editLastNameEN: editInfo.editLastNameEN,
                          editAddress: editInfo.editAddress, 
                          editAddressEN: editInfo.editAddressEN,
                          editPhone: editInfo.editPhone
                        });
                      }} enListener={(e) => {
                        setEditInfo({
                          editUsername: editInfo.editUsername, 
                          editFirstName: editInfo.editFirstName,
                          editLastName: editInfo.editLastName,
                          editFirstNameEN: e.target.value,
                          editLastNameEN: editInfo.editLastNameEN,
                          editAddress: editInfo.editAddress, 
                          editAddressEN: editInfo.editAddressEN,
                          editPhone: editInfo.editPhone
                        });
                    }}/>

                    <CustomInputDivWithEN title={'Edit Last name'} placholderValue={'Enter name in Arabic'} enPlacholderValue={'Enter name in English'} 
                    value={editInfo.editLastName} enValue={editInfo.editLastNameEN} isEnglish isProfileDetails listener={(e) => {
                      setEditInfo({
                        editUsername: editInfo.editUsername, 
                        editFirstName: editInfo.editFirstName,
                        editLastName: e.target.value,
                        editFirstNameEN: editInfo.editFirstNameEN,
                        editLastNameEN: editInfo.editLastNameEN,
                        editAddress: editInfo.editAddress, 
                        editAddressEN: editInfo.editAddressEN,
                        editPhone: editInfo.editPhone
                      });
                    }} enListener={(e) => {
                      setEditInfo({
                        editUsername: editInfo.editUsername, 
                        editFirstName: editInfo.editFirstName,
                        editLastName: editInfo.editLastName,
                        editFirstNameEN: editInfo.editFirstNameEN,
                        editLastNameEN: e.target.value,
                        editAddress: editInfo.editAddress, 
                        editAddressEN: editInfo.editAddressEN,
                        editPhone: editInfo.editPhone
                      });
                    }}/>

                    {/* <CustomInputDiv title={'Edit username'} value={editInfo.editUsername} listener={(e) => { 
                      setEditInfo({
                        editUsername: e.target.value, 
                        editFirstName: editInfo.editFirstName,
                        editLastName: editInfo.editLastName,
                        editFirstNameEN: editInfo.editFirstNameEN,
                        editLastNameEN: editInfo.editLastNameEN,
                        editAddress: editInfo.editAddress, 
                        editAddressEN: editInfo.editAddressEN,
                        editPhone: editInfo.editPhone
                      });
                    }} myStyle={{ marginBottom: 44 }}/> */}

                    <CustomInputDiv myRef={usernameInputRef} value={editInfo.editUsername} isError={usernameError?.length > 0 && true} errorText={usernameError} placholderValue={'This field cannot be empty'} 
                    title={'Edit username'} listener={(e) => {
                      setIsOkayUsername(false);
                      setEditInfo({
                        editUsername: e.target.value, 
                        editFirstName: editInfo.editFirstName,
                        editLastName: editInfo.editLastName,
                        editFirstNameEN: editInfo.editFirstNameEN,
                        editLastNameEN: editInfo.editLastNameEN,
                        editAddress: editInfo.editAddress, 
                        editAddressEN: editInfo.editAddressEN,
                        editPhone: editInfo.editPhone
                      });
                    }} loadingIcon={checkingUsername} okayIcon={isOkayUsername} myStyle={{ marginBottom: 44 }}/>

                    <CustomInputDivWithEN title={'Edit Location'} isEnglish placholderValue={'Enter location in Arabic'} enPlacholderValue={'Enter location in English'} value={editInfo.editAddress} enValue={editInfo.editAddressEN} isProfileDetails 
                    listener={(e) => {
                      setEditInfo({
                        editUsername: editInfo.editUsername, 
                        editUsernameEN: editInfo.editUsernameEN, 
                        editAddress: e.target.value, 
                        editAddressEN: editInfo.editAddressEN,
                        editPhone: editInfo.editPhone
                      });
                    }} enListener={(e) => {
                      setEditInfo({
                        editUsername: editInfo.editUsername, 
                        editUsernameEN: editInfo.editUsernameEN, 
                        editAddress: editInfo.editAddress, 
                        editAddressEN: e.target.value,
                        editPhone: editInfo.editPhone
                      });
                    }}/>

                    <CustomInputDiv title={'Edit phone number'} value={editInfo.editPhone} 
                    listener={(e) => setEditInfo({
                      editUsername: editInfo.editUsername, 
                      editUsernameEN: editInfo.editUsernameEN, 
                      editAddress: editInfo.editAddress, 
                      editAddressEN: editInfo.editAddressEN,
                      editPhone: e.target.value
                    })}/>

                    <button className='btnbackscndclr' onClick={editUserInfo}>{editingInfo ? <LoadingCircle /> : 'Edit details'}</button>
                    {(editInfoError.length > 0 || editInfoSuccess.length > 0) && <p id={editInfoError.length > 0 ? 'p-info-error' : 'p-info'}>
                      {editInfoError.length > 0 ? editInfoError : editInfoSuccess}
                    </p>}
                    
                  </>}

                </div>

                <hr />

                <div className='deleteAccountDiv'>
                  <button className={isDeleteAccountDiv ? 'editDiv chngpassbtn' : 'editDiv'} 
                    onClick={() => {
                      setIsVerifing(false);
                      setIsDeleteAccountDiv(!isDeleteAccountDiv);
                    }}>
                    Delete account<Svgs name={'dropdown arrow'}/>
                  </button>
                  <div className='verifyEmailDiv' style={{ display: !isDeleteAccountDiv ? 'none' : null }}>
                    <button className='btnbackscndclr' onClick={() => sendCodeToEmail(null, true)}>{!sendingCode ? `Send code to ${userEmail}` : <LoadingCircle myStyle={{ height: 'fit-content' }}/>}</button>
                    <p style={{ marginBottom: 16 }} id={sendCodeError?.length > 0 ? 'p-info-error' : 'p-info'}>{sendCodeError.length > 0 ? sendCodeError : (deleteAccountSuccess.length > 0 ? deleteAccountSuccess : sendCodeSuccess)}</p>
                    <CustomInputDiv title={'Enter code'} isError={sendCodeError.length > 0} listener={(e) => setCode(e.target.value)}/>
                    <p style={{ margin: '-16px 0 12px 0'}}><Svgs name={'info'}/>Warning: The account and everything related to it will be permanently deleted!</p>
                    <button style={{ marginTop: 16 }} className='btnbackscndclr' onClick={deleteAccount}>{deletingAccount ? <LoadingCircle myStyle={{ height: 'fit-content' }}/> :'Permanently delete the account'}</button>
                    <p id={deleteAccountError?.length > 0 ? 'p-info-error' : 'p-info'}>
                      {deleteAccountError.length > 0 ? deleteAccountError : deleteAccountSuccess}
                    </p>
                  </div>
                </div>
                
            </div>

            {(isItems && guestsArray?.length > 0) && <div className='guests'>
              <h3>Guests List</h3>
              <p><Svgs name={'info'}/> Confirm the customer who completed the reservation process, and you can also delete any of the customers. For your information, the customer will be able to write a review and evaluation of the offer.</p>
              <ul>
                {guestsArray.map((guest, index) => (
                  <li key={guest.guest_id}>
                    <h4 style={{ fontWeight: 500 }}>{guest.guest_name}</h4>
                    <label>User ID {guest.guest_id}</label>
                    <Image src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${guest.booked_property_image}`} width={600} height={600}/>
                    <h4>{guest.booked_property_titleEN || guest.booked_property_title} {`(${guest.booked_property_unit})`}</h4>
                    <div className='guest-btns'>
                      <button onClick={() => confirmGuest(guest.guest_id, guest.booked_property_id, index)} id='confirm-btn-guest'>{confirmingGuest === index ? <LoadingCircle /> : 'Confirm'}</button>
                      <button onClick={() => deleteGuest(guest.guest_id, guest.booked_property_id, index)} id='delete-btn-guest'>{deletingGuest === index ? <LoadingCircle isLightBg/> : 'Delete'}</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>}

            <PropertiesArray title={'My Units'} isEdit isHide={!isItems} userId={userId} cardsPerPage={cardsPerPage} type={'owner'} isEnglish/>

            <PropertiesArray title={'My Favourites'} isHide={!isFavourites} userId={userId} cardsPerPage={cardsPerPage} type={'favourites'} isEnglish/>
            
            <PropertiesArray title={'My Reservations'} isHide={!isBooks} userId={userId} cardsPerPage={cardsPerPage} type={'books'} isEnglish/>

            <div className='profileDetails signOut' style={{ display: !isSignOut && 'none' }}>
                <p style={{ display: signOutInfo.length <= 0 && 'none' }}><Svgs name={'info'}/>{signOutInfo}</p>
                <button onClick={handleSignOut} className='editDiv'>
                  {signingOut ? <LoadingCircle /> : 'Logout'}
                </button>
            </div>

          </div>

      </div>
    )
}

export default page
