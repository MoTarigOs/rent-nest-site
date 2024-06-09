import '@styles/Footer.scss';
import Image from 'next/image';
import LogoImage from '@assets/icons/rentnext-logo.png';
import Link from 'next/link';
import { contactInfo } from '@utils/Data';
import Svgs from '@utils/Svgs';
import { getNameByLang } from '@utils/Logic';
import dynamic from 'next/dynamic';
const DynamicNotFound = dynamic(() => import('@components/NotFound'));

const Footer = ({ pathname }) => {

  if(!pathname){
    return (<DynamicNotFound />)
  }
  
  return (
    <div className="footer" style={{
      zIndex: pathname.includes('search') ? 0 : undefined
    }} dir={pathname.includes('/en') ? 'ltr' : null}>

      <div className="topOfFooter">

        <Link href={pathname.includes('/en') ? '/en' : '/'} className='logo'>
          <Image src={LogoImage} loading='lazy' alt='Rent Next logo'/>
        </Link>

        <ul>
          <li><Link href={'/properties?catagory=apartment'}>{getNameByLang('مزارع و شاليهات', pathname.includes('/en'))}</Link></li>
          <li><Link href={'/properties?catagory=resort'}>{getNameByLang('شقق و استوديوهات', pathname.includes('/en'))}</Link></li>
          <li><Link href={'/properties?catagory=farm'}>{getNameByLang('مخيمات و منتجعات', pathname.includes('/en'))}</Link></li>
          <li><Link href={'/properties?catagory=students'}>{getNameByLang('سكن طلاب', pathname.includes('/en'))}</Link></li>
          <li><Link href={'/vehicles'}>{getNameByLang('وسائل نقل و سيارات', pathname.includes('/en'))}</Link></li>
          <li><Link href={'/about'}>{getNameByLang('تواصل معنا', pathname.includes('/en'))}</Link></li>
        </ul>

      </div>
      
      <hr />

      <div className="bottomOfFooter">

        <h4>Rent Nest 2024</h4>
        
        <ul>
          {contactInfo.map((contact, index) => (
            <li key={index}><Link target='_blank' href={contact.val}><Svgs name={contact.name}/></Link></li>
          ))}
        </ul>

      </div>

      <div className='attribute'>
        <h4>{pathname.includes('/en') ? 'Icons from ' : 'الأيقونات من موقع'} <Link href='https://www.svgrepo.com/' target='_blank'>SVGRepo</Link></h4>
      </div>
    </div>
  )
};

export default Footer;
