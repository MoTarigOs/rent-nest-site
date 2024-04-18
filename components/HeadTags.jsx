import Head from 'next/head';

const HeadTags = () => {
  return (

    <Head>

        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />

        <title>Rent Nest | منصة إِيجار عقارات داخل الاردن</title>

        <meta name="description" content="Describe in 160-200 characters about 
            my awesome app" />

        <meta key="og:type" property="og:type" content={"website"} />
        <meta key="og:title" property="og:title" content={"Title of my page"} />
        <meta key="og:description" property="og:description" content={"Description of my page"}/>
        <meta key="og:url" property="og:url" content={"site url"}/>
        <meta key="og:image" property="og:image" content={"Link to cover image"} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content={"@twitter_handle"} />
        <meta property="twitter:title" content={"Title of the page"} />
        <meta property="twitter:description" content={"Description of the page"} />
        <meta property="twitter:image" content={"Link to image preview"} />

    </Head>
  )
};

export default HeadTags;
