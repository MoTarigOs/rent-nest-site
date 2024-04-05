import '@styles/Main.css';
import MainWrapper from './MainWrapper';
import DataContext from '@utils/Context';

const Layout = ({ children }) => {

    return (

        <html lang="ar" dir="rtl">
            
            <head>

                <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />

                <title>سيارات و عقارات للايجار Rent Nest</title>

            </head>

            <body>
                <DataContext>
                    <MainWrapper children={children}/>    
                </DataContext>
            </body>

        </html>
    )
};

export default Layout;