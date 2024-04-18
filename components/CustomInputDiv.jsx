'use client';

import Svgs from "@utils/Svgs";
import '@styles/components_styles/CustomInputDiv.css';
import { useState } from "react";


const CustomInputDiv = ({ 
  isTextArea, type, settingFocused, isCity, 
  listener, value, isError, errorText, title, 
  deletable, handleDelete, placholderValue,
  max, min, myStyle
}) => {
  
  const [passwordTypeShow, setPasswordTypeShow] = useState(false);
  
  return (
    <div className='inputDiv' style={myStyle}>
      {!isTextArea ? 
        <input onFocus={settingFocused} readOnly={isCity ? true : false}
        value={value} placeholder={placholderValue} max={max} min={min}
        type={type ? (type === 'password' ? (passwordTypeShow ? 'text' : 'password') : type) : 'text'} 
        onChange={listener} style={{ borderColor: isError && 'var(--softRed)'}}/>
        : <textarea onChange={listener} style={{ borderColor: isError && 'var(--softRed)' }}/>}
      <span id="title-input-div-span" style={{ color: isError && 'var(--softRed)' }}>{title}</span>
      {deletable && <Svgs name={'delete'} on_click={handleDelete}/>}
      {type === 'password' && <div id="show-password">
        <Svgs name={'show password'} on_click={() => setPasswordTypeShow(!passwordTypeShow)}/>
        <span style={{ display: !passwordTypeShow && 'none' }}/>
      </div>}
      {isError && <label>{errorText}</label>}
    </div>
  )
}

export default CustomInputDiv
