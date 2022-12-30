import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="This app is Bitcoin SV Minting App" />
        <meta name="theme-color" content="#000000" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/bitcoin-sv-bsv-logo.svg" />
        <link rel="apple-touch-icon" href="/logo192.png" />
      </Head>
      <body className="main_body">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
