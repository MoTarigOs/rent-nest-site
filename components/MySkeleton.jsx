import '@styles/components_styles/Skeleton.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const MySkeleton = ({ loadingType }) => {

  const arr = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className='skeleton'>

        {loadingType === 'cards' ? <div className='container'>
          {arr.map((item) => (
            <div>
              <Skeleton count={1} width='100%' height={380}/>
            </div>
          ))}
        </div> : <><div className='div1'>
          <div style={{ width: '30%' }}>
            <Skeleton count={1} width='100%' height={240}/>
          </div>
          <div style={{ width: '25%' }}>
            <Skeleton count={1} width='100%' height={240}/>
          </div>
          <div style={{ width: '50%' }}>
            <Skeleton count={1} width='100%' height={240}/>
          </div>
        </div>

        <div className='div2'>
          <div style={{ width: '65%' }}>
            <Skeleton count={1} width='100%' height={240}/>
          </div>
          <div style={{ width: '35%' }}>
            <Skeleton count={1} width='100%' height={240}/>
          </div>
        </div>

        <div className='div3'>
          <div style={{ width: '50%' }}>
            <Skeleton count={1} width='100%' height={240}/>
          </div>
          <div style={{ width: '50%' }}>
            <Skeleton count={1} width='100%' height={240}/>
          </div>
        </div></>}

    </div>
  )
};

export default MySkeleton;
