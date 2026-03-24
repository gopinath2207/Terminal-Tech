import { Helmet } from 'react-helmet-async';

const SEOHead = ({ title, description, image, url }) => {
    const siteTitle = 'TechAffiliate — Best Tech Reviews & Deals';
    const fullTitle = title ? `${title} | TechAffiliate` : siteTitle;
    const defaultDesc =
        'Expert tech reviews, comparisons, and the best affiliate deals curated for you.';

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDesc} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDesc} />
            <meta property="og:type" content="article" />
            {url && <meta property="og:url" content={url} />}
            {image && <meta property="og:image" content={image} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDesc} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
};

export default SEOHead;
