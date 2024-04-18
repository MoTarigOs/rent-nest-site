'use client'

import '@styles/Footer.css';
import Image from 'next/image';
import LogoImage from '@assets/icons/rentnext-logo.png';
import Link from 'next/link';
import { contactInfo } from '@utils/Data';
import Svgs from '@utils/Svgs';
import { usePathname } from 'next/navigation';
import { getNameByLang } from '@utils/Logic';

const Footer = () => {

  const pathname = usePathname();
  
  return (
    <div className="footer" dir={pathname.includes('/en') ? 'ltr' : null}>

      <div className="topOfFooter">

        <Link href={pathname.includes('/en') ? '/en' : '/'} className='logo'>
          <Image src={LogoImage} loading='eager' alt='Rent Next logo'/>
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
          {contactInfo.map((contact) => (
            <li><Link href={contact.val}><Svgs name={contact.name}/></Link></li>
          ))}
        </ul>

      </div>
        
    </div>
  )
}

export default Footer
