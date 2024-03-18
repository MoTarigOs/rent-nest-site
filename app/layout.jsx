import Footer from "@sections/Footer";
import Header from "@sections/Header";
import DataContext from "@utils/Context";
import '@styles/Main.css';

const Layout = ({ children }) => {

    return (

        <html lang="ar" dir="rtl">
            
            <head>

                <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />

                <title>سيارات و عقارات للايجار Rent Nest</title>

            </head>

            <body>

                <DataContext>

                    <div className="main">
                                    
                        <Header />

                        <main className='app'>
                            {children}
                        </main>

                        <Footer />

                    </div>

                </DataContext>

            </body>

        </html>
    )
};

export default Layout;