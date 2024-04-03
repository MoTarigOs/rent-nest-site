import '@styles/components_styles/InfoDiv.css';
import Svgs from '@utils/Svgs';

const InfoDiv = ({ 
    title, value, isInfo, info, handleClick, 
    btnState, btnTitle, btnAfterClck, type 
}) => {

    return (
      <div className='infodiv'>
        <label>{title}</label>
        <h3 suppressHydrationWarning>{value}</h3>
        <div style={{ display: !isInfo && 'none' }}>
          <p className={type === 'email' && 'redpinfodiv'}><Svgs name={'info'}/>{info}</p>
          <button style={{ display: !btnTitle && 'none' }} className={btnState && 'btnclckedinfodiv'} onClick={handleClick}>{btnState ? btnAfterClck : btnTitle}<Svgs name={'dropdown arrow'}/></button>
        </div>
      </div>
    )
  };

export default InfoDiv;
