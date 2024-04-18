export const metadata = {
    title: 'Rent Nest | A platform for renting real estate within Jordan',
    description: 'The Rent Nest platform provides services and real estate rentals within the State of Jordan, where there are offers for renting chalets, apartments, houses, student housing, and cars.',
    openGraph: {
        title: 'Rent Nest | A platform for renting real estate inside Jordan',
        description: 'The Rent Nest platform provides services and real estate rentals within the State of Jordan, where there are offers for renting chalets, apartments, houses, student housing, and cars.'
    },
    twitter: {
        card: "summary_large_image",
        title: "Rent Nest | A platform for renting real estate inside Jordan",
        description: "The Rent Nest platform provides services and real estate rentals within the State of Jordan, where there are offers for renting chalets, apartments, houses, student housing, and cars.",
    },
    keywords: ['rental', 'real estate', 'chalets', 'resorts', 'chalet', 'rent', 'rent nest' , 'farms', 'Jordan', 'Amman', 'Dead Sea', 'rent apartment'],
  };

const Layout = ({ children }) => {
    return (
        <main>{children}</main>
    )
};

export default Layout;