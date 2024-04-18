'use client';

import '../../profile/Profile.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '@utils/Context';
import Card from '@components/Card';
import { changeMyPass, deleteMyAccount, editUser, getBooks, getFavourites, getOwnerProperties, sendCode, signOut, verifyMyEmail } from '@utils/api';
import InfoDiv from '@components/InfoDiv';
import CustomInputDiv from '@components/CustomInputDiv';
import Svgs from '@utils/Svgs';
import { getRoleArabicName, isValidEmail, isValidPassword, isValidVerificationCode } from '@utils/Logic';
import MySkeleton from '@components/MySkeleton';
import NotFound from '@components/NotFound';

const page = () => {

    const { 
      userId, setUserId, setUserUsername, userUsername, userEmail, isVerified,
      userAddress, userPhone, userRole, loadingUserInfo, storageKey,
      selectedTab, setSelectedTab
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

        const res = await verifyMyEmail(code, true);

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

        if(editInfo.editUsername.length <= 0 && editInfo.editAddress.length <= 0 && editInfo.editPhone.length <= 0){
          setEditInfoError('There is no change in data');
          setEditInfoSuccess('');
          return;
        }

        setEditingInfo(true);

        const res = await editUser(editInfo, true);

        if(res.success !== true){
          setEditInfoError(res.dt);
          setEditInfoSuccess('');
          setEditingInfo(false);
          return;
        }

        setEditInfoError('');
        setEditInfoSuccess('The data has been modified successfully.');
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

    useEffect(() => {
      if(isProfileDetails) setSelectedTab('profileDetails');
      if(isItems) setSelectedTab('items');
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

    if(!userId || userId.length <= 10){
      return (
        fetchingUserInfo ? <MySkeleton isMobileHeader/> : <NotFound />
      )
    };

    return (
      <div className='profile' dir='ltr'>

          <div className="details">
            
            <label id='username'>{userUsername}</label>

            <p id='underusername'>Your profile</p>

            <ul className='tabButtons'>
              <li className={isProfileDetails && 'selectedTab'} onClick={() => {setIsProfileDetails(true); setIsItems(false); setIsFavourites(false); setIsBooks(false); setIsSignOut(false)}}>Profile data</li>
              <li className={isItems && 'selectedTab'} onClick={() => {setIsProfileDetails(false); setIsItems(true); setIsFavourites(false); setIsBooks(false); setIsSignOut(false)}}>Offers</li>
              <li className={isBooks && 'selectedTab'} onClick={() => {setIsProfileDetails(false); setIsItems(false); setIsFavourites(false); setIsBooks(true); setIsSignOut(false)}}>Reservations</li>
              <li className={isFavourites && 'selectedTab'} onClick={() => {setIsProfileDetails(false); setIsItems(false); setIsFavourites(true); setIsBooks(false); setIsSignOut(false)}}>Favourites</li>
              <li className={isSignOut && 'selectedTab'} onClick={() => {setIsProfileDetails(false); setIsItems(false); setIsFavourites(false); setIsBooks(false); setIsSignOut(true)}}>Logout</li>
            </ul>

            <div className='profileDetails' style={{ display: !isProfileDetails && 'none' }}>

                <InfoDiv isEnglish title={'Email'} value={userEmail} 
                isInfo={!isVerified && true} info={'This account is not verified'}
                btnState={isVerifing}
                handleClick={() => setIsVerifing(!isVerifing)} type={'email'}
                btnAfterClck={'Verify Later'} btnTitle={'Verify Email'}/>

                <div className='verifyEmailDiv' style={{ display: !isVerifing && 'none' }}>
                  <button className='btnbackscndclr' onClick={() => sendCodeToEmail(null)}>{!sendingCode ? `Send code to ${userEmail}` : 'Sending...'}</button>
                  <p style={{ color: sendCodeError.length > 0 && 'var(--softRed)' }}>{sendCodeError.length > 0 ? sendCodeError : (verifySuccess.length > 0 ? verifySuccess : sendCodeSuccess)}</p>
                  <div>
                    <CustomInputDiv title={'Enter code'} isError={verifyError.length > 0 && true} errorText={verifyError} listener={(e) => setCode(e.target.value)}/>
                    <button className='btnbackscndclr' onClick={verifyEmail}>{isVerifyFetching ? 'Verifing...' : 'Verify'}</button>
                  </div>
                </div>

                <hr />

                <InfoDiv title={'Role'} value={userRole}/>

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
                    <button className='btnbackscndclr first-btn' onClick={() => sendCodeToEmail(true, true)}>{!sendingCode ? `Send code to ${userEmail}` : 'Sending...'}</button>
                    <p style={{ color: sendCodeErrorPass.length > 0 && 'var(--softRed)' }}>
                      {sendCodeErrorPass.length > 0 ? sendCodeErrorPass : (changePasswordSuccess ? changePasswordSuccess : sendCodeErrorPass)}</p>
                    <CustomInputDiv title={'Enter new password'} 
                    isError={changePasswordError.length > 0 && true}
                    errorText={changePasswordError} 
                    listener={(e) => setNewPass(e.target.value)}/>
                    <div>
                      <CustomInputDiv title={'Enter code'} 
                      isError={sendCodeErrorPass.length > 0 && true} 
                      errorText={sendCodeErrorPass.length > 0 ? sendCodeErrorPass : changePasswordError}
                      listener={(e) => setCode(e.target.value)}/>
                      <button className='btnbackscndclr' onClick={changePassword}>{changingPass ? 'Processing...' :'Change'}</button>
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
                    <InfoDiv title={'Profile name'} value={userUsername}/>
                    <InfoDiv title={'Location'} value={userAddress}/>
                    <InfoDiv title={'Phone number'} value={userPhone} isInfo={true} info={'Not visible to the public'}/>
                  </> : <>
                    <CustomInputDiv title={'Enter new name'} value={editInfo.editUsername} listener={(e) => setEditInfo({ editUsername: e.target.value, editAddress: editInfo.editAddress, editPhone: editInfo.editPhone })}/>
                    <CustomInputDiv title={'Enter new location'} value={editInfo.editAddress} listener={(e) => setEditInfo({ editUsername: editInfo.editUsername, editAddress: e.target.value, editPhone: editInfo.editPhone })}/>
                    <CustomInputDiv title={'Edit phone number'} value={editInfo.editPhone} listener={(e) => setEditInfo({ editUsername: editInfo.editUsername, editAddress: editInfo.editAddress, editPhone: e.target.value })}/>
                    <button className='btnbackscndclr' onClick={editUserInfo}>{editingInfo ? 'Editing...' : 'Edit details'}</button>
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
                    <button className='btnbackscndclr' onClick={() => sendCodeToEmail(null, true)}>{!sendingCode ? `Send code to ${userEmail}` : 'Sending...'}</button>
                    <p style={{ marginBottom: 16 }} id={sendCodeError?.length > 0 ? 'p-info-error' : 'p-info'}>{sendCodeError.length > 0 ? sendCodeError : (deleteAccountSuccess.length > 0 ? deleteAccountSuccess : sendCodeSuccess)}</p>
                    <CustomInputDiv title={'Enter code'} isError={sendCodeError.length > 0} listener={(e) => setCode(e.target.value)}/>
                    <p style={{ margin: '-16px 0 12px 0'}}><Svgs name={'info'}/>Warning: The account and everything related to it will be permanently deleted!</p>
                    <button style={{ marginTop: 16 }} className='btnbackscndclr' onClick={deleteAccount}>{deletingAccount ? 'Account is being deleted' :'Permanently delete the account'}</button>
                    <p id={deleteAccountError?.length > 0 ? 'p-info-error' : 'p-info'}>
                      {deleteAccountError.length > 0 ? deleteAccountError : deleteAccountSuccess}
                    </p>
                  </div>
                </div>
                
            </div>

            <ul className='items' style={{ display: !isItems && 'none' }}>
              {itemsArray.map((item) => (
                  <li key={item._id}><Card isEnglish item={item} type={'myProp'}/></li>
              ))}
            </ul>

            <ul className='items' style={{ display: !isFavourites && 'none' }}>
              {favArray.map((item) => (
                  <li key={item._id}><Card isEnglish item={item}/></li>
              ))}
            </ul>

            <ul className='items' style={{ display: !isBooks && 'none' }}>
              {booksArray.map((item) => (
                  <li key={item._id}><Card isEnglish item={item}/></li>
              ))}
            </ul>

            <div className='profileDetails signOut' style={{ display: !isSignOut && 'none' }}>
                <p style={{ display: signOutInfo.length <= 0 && 'none' }}><Svgs name={'info'}/>{signOutInfo}</p>
                <button onClick={handleSignOut} className='editDiv'>
                  {signingOut ? 'Loging out...' : 'Logout'}
                </button>
            </div>

          </div>

      </div>
    )
}

export default page
