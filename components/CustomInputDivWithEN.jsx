import Svgs from "@utils/Svgs";
import '@styles/components_styles/CustomInputDivWithEN.css';

const CustomInputDivWithEN = ({ 
  listener, value, isError, errorText, title, 
  deletable, handleDelete, placholderValue,
  max, min, myStyle, isTextArea, enPlacholderValue,
  enListener, settingFocused, isCity, enValue, 
  isEnglish, isProfileDetails
}) => {
  
  return (
    <div className='inputDivWithEN' style={{ ...myStyle, borderColor: isError ? 'var(--softRed)' : undefined, flexDirection: isEnglish ? 'column-reverse' : undefined }}>
      {!isTextArea ? 
        <><input dir={isEnglish ? 'rtl' : undefined} onFocus={settingFocused} 
        value={value} placeholder={placholderValue} max={max} min={min} 
        onChange={listener} readOnly={isCity ? true : false}/>
        <div id="hrSpanElement"/>
        <input onFocus={settingFocused} dir="ltr" value={enValue ? enValue : (isProfileDetails ? null : value)} placeholder={enPlacholderValue} max={max} min={min} 
        onChange={enListener} readOnly={isCity ? true : false}/></>
        : <><textarea value={value} dir={isEnglish ? 'rtl' : undefined} onChange={listener} placeholder={placholderValue} style={{ borderColor: isError && 'var(--softRed)' }}/>
        <div id="hrSpanElement"/>
        <textarea value={enValue} dir="ltr" placeholder={enPlacholderValue} onChange={enListener} style={{ borderColor: isError && 'var(--softRed)' }}/></>}
      <span id="title-input-div-span" style={{ color: isError && 'var(--softRed)' }}>{title}</span>
      {deletable && <Svgs name={'delete'} on_click={handleDelete}/>}
      {isError && <label>{errorText}</label>}
    </div>
  )
};

export default CustomInputDivWithEN;
