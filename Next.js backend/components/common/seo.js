import Head from "next/head";

const Seo = ({ pageTitle, font }) => {
  const title = pageTitle ? `${pageTitle} | SGSRO | Buy Water Purifiers & Filters at Best Price Online in India` : "SGSRO | Buy Best Water Purifier";

  return (
    <Head>
      <>
        <title>{title}</title>
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="keywords" content="advanced custom search, agency, agent, business, clean, corporate, directory, google maps, homes, idx agent, listing properties, membership packages, property, real broker, real estate, real estate agent, real estate agency, realtor" />
        <meta name="description" content="SGSRO -  Water Purifier" />
        <meta name="ibthemes" content="ATFN" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/css/bootstrap.min.css" integrity="sha384-+0X0Ihsl5+1Ckqz3uYDvnu4JwvqQyzAwb0m81LXQBvPrW4eRjuAoKBR8gi5OyDiG" crossOrigin="anonymous" />

        {font && <link href={font} rel="stylesheet" />}
        <link rel="icon" href="favicon.ico" />
      </>
    </Head>
  );
};

export default Seo;
