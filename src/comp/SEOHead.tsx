import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  slug?: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
}

const SITE_NAME = "Waves NFC";
const SITE_URL = "https://waves.pockethost.io";
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

const buildAbsoluteUrl = (value = "") => {
  if (!value) return SITE_URL;
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `${SITE_URL}/${value.replace(/^\/+/, "")}`;
};

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const SEOHead = ({
  title,
  description,
  slug = "",
  image,
  type = "website",
  noIndex = false,
}: SEOHeadProps) => {
  const language = "ar";
  const cleanDescription =
    stripHtml(description) ||
    "بطاقة NFC ذكية لعرض بياناتك وأعمالك وروابطك بسهولة مع Waves NFC.";
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = slug ? buildAbsoluteUrl(slug) : SITE_URL;
  const imageUrl = image ? buildAbsoluteUrl(image) : DEFAULT_IMAGE;
  const robotsContent = noIndex ? "noindex, nofollow" : "index, follow";

  return (
    <Helmet>
      <html lang={language} />
      <title>{fullTitle}</title>
      <link rel="icon" href={DEFAULT_IMAGE} type="image/png" />
      <link rel="canonical" href={canonicalUrl} />

      <meta name="title" content={fullTitle} />
      <meta name="description" content={cleanDescription} />
      <meta name="robots" content={robotsContent} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={cleanDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ar_AR" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={cleanDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={fullTitle} />

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === "profile" ? "Person" : "WebSite",
          name: title || SITE_NAME,
          url: canonicalUrl,
          image: imageUrl,
          description: cleanDescription,
          inLanguage: language,
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
