export const config = {
  nodeEnv: process.env.NODE_ENV,
  devUrl: process.env.NEXT_PUBLIC_DEV_URL,
  // for-> deployed url and salt
  clientSiteUrl: process.env.NEXT_PUBLIC_CLIENT_SITE_URL,
  salt: process.env.NEXT_PUBLIC_SALT,
  // for-> pinata
  pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  pinataSecretApiKey: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
  // for-> networks
  ethNetworkId: Number(process.env.NEXT_PUBLIC_ETHEREUM_NETWORK_ID),
  polygonNetworkID: Number(process.env.NEXT_PUBLIC_POLYGON_NETWORK_ID),
  bsvNetwork: process.env.NEXT_PUBLIC_BSV_NETWORK,
  bsvAccountLink: process.env.NEXT_PUBLIC_BSV_ACCOUNT_LINK,
  ethAccountLink: process.env.NEXT_PUBLIC_ETHEREUM_ACCOUNT_LINK,
  // for-> usd price
  coingeckoBaseUrl: process.env.NEXT_PUBLIC_COINGECKO_BASE_URL,
};
