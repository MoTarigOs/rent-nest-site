import '@styles/components_styles/Calendar.css';
import { maxBookDateYears } from '@utils/Data';
import Calendar from 'react-calendar';

const MyCalendar = ({ setCalender }) => {
  return (
    <Calendar 
    onChange={setCalender}
    calendarType='US'
    minDate={new Date()} 
    maxDate={new Date((new Date).getFullYear() + maxBookDateYears, (new Date).getMonth(), (new Date).getDay())}
    selectRange
    showDoubleView
    goToRangeStartOnSelect/>
  )
}

export default MyCalendar
