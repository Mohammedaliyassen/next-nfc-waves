import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  slug?: string;
  image?: string;
  type?: string;
}

const SEOHead = ({
  title,
  description,
  slug = "",
  image,
  type = "website",
}: SEOHeadProps) => {
  const language = "ar";
  const fullTitle = `${title} - Waves Profile`;

  return (
    <Helmet>
      <html lang={language} />
      <title>{fullTitle}</title>
      <link rel="icon" href="../imgs/logo.svg" type="image/svg+xml" />
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      {slug && (
        <link
          rel="canonical"
          href={`https://https://waves.pockethost.io/${slug}`}
        />
      )}

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: title,
          url: `https://waves.pockethost.io/${slug}`,
          image: image,
          jobTitle: "Frontend Developer",
          worksFor: {
            "@type": "Organization",
            name: "Waves",
          },
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
