'use client';

import Svgs from "@utils/Svgs";
import '@styles/components_styles/CustomInputDiv.scss';
import { useState } from "react";
import LoadingCircle from "./LoadingCircle";


const CustomInputDiv = ({ 
  isTextArea, type, settingFocused, isCity, 
  listener, value, isError, errorText, title, 
  deletable, handleDelete, placholderValue,
  max, min, myStyle, myRef, loadingIcon,
  okayIcon, uniqueClassName, defaultValue
}) => {
  
  const [passwordTypeShow, setPasswordTypeShow] = useState(false);

  return (
    <div className={`inputDiv ${uniqueClassName}`} style={myStyle}>
      {!isTextArea ? 
        <input defaultValue={defaultValue} ref={myRef} onFocus={settingFocused} readOnly={isCity ? true : false}
        value={value} placeholder={placholderValue} max={max} min={min}
        type={type ? (type === 'password' ? (passwordTypeShow ? 'text' : 'password') : type) : 'text'} 
        onChange={listener} style={{ borderColor: isError ? 'var(--softRed)' : undefined }}/>
        : <textarea defaultValue={defaultValue} onChange={listener} style={{ borderColor: isError && 'var(--softRed)' }}/>}
      <span id="title-input-div-span" style={{ color: isError ? 'var(--softRed)' : undefined }}>{title}</span>
      {deletable && <Svgs name={'delete'} on_click={handleDelete}/>}
      {type === 'password' && <div id="show-password">
        <Svgs name={'show password'} on_click={() => setPasswordTypeShow(!passwordTypeShow)}/>
        <span style={{ display: !passwordTypeShow && 'none' }}/>
      </div>}
      {isError && <label>{errorText}</label>}
      {okayIcon && <div id="okay-icon-div"><div id='righticonspan'/></div>}
      {loadingIcon && <div id="loading-div"><LoadingCircle bgColor={'var(--secondColor)'} isLightBg/></div>}
    </div>
  )
}

export default CustomInputDiv
