import '@styles/components_styles/Calendar.css';
import { maxBookDateYears } from '@utils/Data';
import { getBookDateFormat } from '@utils/Logic';
import Calendar from 'react-calendar';

const MyCalendar = ({ setCalender, type, days }) => {
  return (
    <Calendar 
    onChange={setCalender}
    calendarType='US'
    minDate={new Date()} 
    maxDate={new Date((new Date).getFullYear() + maxBookDateYears, (new Date).getMonth(), (new Date).getDay())}
    selectRange={type === 'edit-prop' ? false : true}
    showDoubleView={(type === 'edit-prop' || type === 'mobile-filter') ? false : true}
    goToRangeStartOnSelect={type === 'edit-prop' ? false : true} 
    tileClassName={({ date }) => {
      if(type === 'edit-prop' && (!days || days.find(i => i === getBookDateFormat(date)))) {
        return 'react-calendar__tile--active ';
      };
    }}
    tileDisabled={({ date }) => {
      if(type === 'view' && (!days || days.find(i => i === getBookDateFormat(date)))) {
        return true;
      };
    }}
    />
  )
}

export default MyCalendar
