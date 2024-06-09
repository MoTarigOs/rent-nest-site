import { myConditions } from '@utils/Data';
import '../../about/About.scss';

const page = () => {

  return (
    <div className='about' dir='ltr'>

        <div className='about-div'>
            <h1>Rent Nest platform for renting properties</h1>
            <p>Rent Nest is a comprehensive platform that caters to your rental needs exclusively within Jordan. Offering an array of properties including chalets, resorts, and houses, Rent Nest ensures a delightful stay for those seeking cozy mountain retreats, beachside havens, or tranquil countryside escapes. Whether you're planning a family vacation or gateaway, Rent Nest's diverse selection of accommodations promises comfort and convenience. Additionally, for travelers who need wheels to explore their chosen destination, Rent Nest conveniently provides a page for vehicle rentals. Discover the beauty of Jordan while enjoying top-notch hospitality through Rent Nest's curated listings.</p>
        </div>

        <div id='conditions'>
            <hr />
            <h2>Platform Terms & Conditions</h2>
            <ul>
                {myConditions(true).map((item) => (
                    <li>{item}</li>
                ))}
            </ul>
        </div>

    </div>
  )
};

export default page;
