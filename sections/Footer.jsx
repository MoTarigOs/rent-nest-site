'use client'

import '@styles/Footer.css';
import Image from 'next/image';
import LogoImage from '@assets/icons/rentnext-logo.png';
import FacebookImage from '@assets/icons/facebook-icon.svg';
import Link from 'next/link';
import { sendTest } from '@utils/api';
import { useContext } from 'react';
import { Context } from '@utils/Context';

const Footer = () => {

  const { storageKey, userEmail } = useContext(Context);
  
  return (
    <div className="footer">

      <div className="topOfFooter">

        <div className='logo'>
          <Image src={LogoImage} loading='eager' alt='Rent Next logo'/>
        </div>

        <ul>
          <li><Link href={'/properties?catagory=apartments'}>شقق و منازل</Link></li>
          <li><Link href={'/vehicles'}>سيارات</Link></li>
          <li><Link href={'/properties?catagory=apartments'}>شاليهات و منتجعات و استراحات</Link></li>
          <li><Link href={'/properties?catagory=apartments'}>مزارع و مخيمات</Link></li>
          <li>تواصل معنا</li>
        </ul>

      </div>
      
      <hr />

      <div className="bottomOfFooter">

        <h4>Rent Nest 2024</h4>
        
        <ul>
          <li onClick={() => sendTest(storageKey, userEmail)}><Image src={FacebookImage} loading='eager' alt='facebook icon'/></li>
          <li><Link href={'/'}><Image src={FacebookImage} loading='eager' alt='facebook icon'/></Link></li>
          <li><Link href={'/'}><Image src={FacebookImage} loading='eager' alt='facebook icon'/></Link></li>
          <li><Link href={'/'}><Image src={FacebookImage} loading='eager' alt='facebook icon'/></Link></li>
          <li><Link href={'/'}><Image src={FacebookImage} loading='eager' alt='facebook icon'/></Link></li>
        </ul>

      </div>
        
    </div>
  )
}

export default Footer
