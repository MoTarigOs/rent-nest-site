import '@styles/components_styles/Skeleton.scss';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const MySkeleton = ({ loadingType, isMobileHeader, styleObj }) => {

  const arr = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className='skeleton' style={ isMobileHeader ? { marginTop: 'var(--headerHeightMobile)', paddingTop: 32 } : styleObj }>

        {loadingType === 'cards' ? <div className='container'>
          {arr.map((item, index) => (
            <div className='skeleton-item' key={index}>
              <div style={{ marginBottom: 12 }}><Skeleton count={1} width='100%' borderRadius={16} height={190}/></div>
              <div style={{ marginBottom: 4 }}><Skeleton count={1} width='45%' height={16} borderRadius={4}/></div>
              <div style={{ marginBottom: 4 }}><Skeleton count={1} width='35%' height={12} borderRadius={4}/></div>
              <div style={{ marginBottom: 4 }}><Skeleton count={1} width='50%' height={12} borderRadius={4}/></div>
              <div style={{ marginBottom: 4 }}><Skeleton count={1} width='48%' height={20} borderRadius={4}/></div>
            </div>
          ))}
        </div> : <div className='container'>
          {arr.slice(0, 3).map((item, index) => (
            <div className='skeleton-item-big' key={index}>
              <div style={{ marginBottom: 12 }}><Skeleton count={1} width='100%' height={120}/></div>
              <div style={{ marginBottom: 8 }}><Skeleton count={1} width='45%' height={16}/></div>
              <div style={{ marginBottom: 8 }}><Skeleton count={1} width='35%' height={16}/></div>
              <div style={{ marginBottom: 8 }}><Skeleton count={1} width='50%' height={16}/></div>
              <div><Skeleton count={1} width='48%' height={16}/></div>
            </div>
          ))}
        </div>}

    </div>
  )
};

export default MySkeleton;
