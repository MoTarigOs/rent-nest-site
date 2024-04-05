'use client';

import Footer from "@sections/Footer";
import Header from "@sections/Header";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const MainWrapper = ({ children }) => {
  return (

    <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        scriptProps={{
            async: true,
            defer: false,
            appendTo: "body",
            nonce: undefined,
        }}>

        <div className="main">
                        
            <Header />

            <main className='app'>
                {children}
            </main>

            <Footer />
        
        </div>

    </GoogleReCaptchaProvider>

  )
};

export default MainWrapper;
