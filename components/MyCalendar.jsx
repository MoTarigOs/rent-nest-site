'use client';

import '@styles/components_styles/Calendar.scss';
import { Context } from '@utils/Context';
import { maxBookDateYears } from '@utils/Data';
import { getBookDateFormat } from '@utils/Logic';
import Svgs from '@utils/Svgs';
import { useContext } from 'react';
import Calendar from 'react-calendar';

const MyCalendar = ({ setCalender, type, days, isNotDeleteBtn }) => {

  const { isMobile } = useContext(Context);

  return (
    <div className='mycalender-div' style={{ width: type === 'mobile-filter' ? '100%' : undefined }} suppressHydrationWarning>
      {!isNotDeleteBtn && <span id='clear-calendar' onClick={() => setCalender(null)}><Svgs name={'delete'}/></span>}
      <Calendar 
          onChange={setCalender}
          calendarType='gregory'
          minDate={new Date()} 
          maxDate={new Date((new Date).getFullYear() + maxBookDateYears, (new Date).getMonth(), (new Date).getDay())}
          selectRange={type === 'edit-prop' ? false : true}
          showDoubleView={(type === 'edit-prop' || type === 'mobile-filter' || isMobile) ? false : true}
          goToRangeStartOnSelect={type === 'edit-prop' ? false : true} 
          tileClassName={({ date }) => {
            if(type === 'edit-prop' && days && days.find(i => i === getBookDateFormat(date))) {
              return 'react-calendar__tile--active ';
            };
          }}
          tileDisabled={({ date }) => {
            if(days && type === 'view' && days.find(i => i === getBookDateFormat(date))) {
              return true;
            };
          }}
        />
    </div>
  )
}

export default MyCalendar
