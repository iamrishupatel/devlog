import Head from "next/head";

export default function Metatags({
  title = "Devlog",
  description = "DevLog is blogging platform for developers. This app is built with Next.js and Firebase and is loosely inspired by Dev.to",
  image = "/featured.png",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@iamrishupatel" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}
