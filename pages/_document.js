import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/bitcoin-sv-bsv-logo.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Bitcoin SV Minting App" />
        <link rel="apple-touch-icon" href="/logo192.png" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body className="main_body">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
