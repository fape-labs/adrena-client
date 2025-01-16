import { PublicKey } from '@solana/web3.js';
import { NATIVE_MINT } from '@solana/spl-token';
import { SupportedCluster } from '../types/types';

const bonkLogo = 'https://app.adrena.xyz/images/bonk.png';
const btcLogo = 'https://app.adrena.xyz/images/btc.svg';
const jitosolLogo = 'https://app.adrena.xyz/images/jitosol.png';
const solLogo = 'https://app.adrena.xyz/images/sol.svg';
const usdcLogo = 'https://app.adrena.xyz/images/usdc.svg';
const wbtcLogo = 'https://app.adrena.xyz/images/wbtc.png';

export const TOKEN_INFO = {
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    name: 'USD Coin',
    color: '#2775ca',
    symbol: 'USDC',
    image: usdcLogo,
    coingeckoId: 'usd-coin',
    decimals: 6,
    displayAmountDecimalsPrecision: 2,
    displayPriceDecimalsPrecision: 4,
    pythPriceUpdateV2: new PublicKey(
      'Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX',
    ),
  },
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: {
    name: 'BONK',
    color: '#dfaf92',
    symbol: 'BONK',
    image: bonkLogo,
    coingeckoId: 'bonk',
    decimals: 5,
    displayAmountDecimalsPrecision: 0,
    displayPriceDecimalsPrecision: 8,
    pythPriceUpdateV2: new PublicKey(
      'DBE3N8uNjhKPRHfANdwGvCZghWXyLPdqdSbEW2XFwBiX',
    ),
  },
  '3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh': {
    name: 'Wrapped Bitcoin',
    color: '#f7931a',
    symbol: 'WBTC',
    image: wbtcLogo,
    coingeckoId: 'wrapped-btc-wormhole',
    decimals: 8,
    displayAmountDecimalsPrecision: 6,
    displayPriceDecimalsPrecision: 2,
    pythPriceUpdateV2: new PublicKey(
      '9gNX5vguzarZZPjTnE1hWze3s6UsZ7dsU3UnAmKPnMHG',
    ),
  },
  [PublicKey.default.toBase58()]: {
    name: 'Bitcoin',
    color: '#f7931a',
    symbol: 'BTC',
    image: btcLogo,
    coingeckoId: 'bitcoin',
    decimals: 8,
    displayAmountDecimalsPrecision: 6,
    displayPriceDecimalsPrecision: 2,
    pythPriceUpdateV2: new PublicKey(
      '4cSM2e6rvbGQUFiJbqytoVMi5GgghSMr8LwVrT9VPSPo',
    ),
  },
  J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn: {
    name: 'Jito Staked SOL',
    color: '#84CC90',
    symbol: 'JITOSOL',
    image: jitosolLogo,
    coingeckoId: 'solana',
    decimals: 9,
    displayAmountDecimalsPrecision: 4,
    displayPriceDecimalsPrecision: 2,
    pythPriceUpdateV2: new PublicKey(
      'AxaxyeDT8JnWERSaTKvFXvPKkEdxnamKSqpWbsSjYg1g',
    ),
  },
  [NATIVE_MINT.toBase58()]: {
    name: 'SOL',
    color: '#84CC90',
    symbol: 'SOL',
    image: solLogo,
    coingeckoId: 'solana',
    decimals: 9,
    displayAmountDecimalsPrecision: 4,
    displayPriceDecimalsPrecision: 2,
    pythPriceUpdateV2: new PublicKey(
      '7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE',
    ),
  },
};

export const DEFAULT_CLIENT_CONFIG = {
  cluster: 'mainnet' as SupportedCluster,
  devMode: false,
  governanceProgram: new PublicKey(
    'GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw',
  ),
  governanceRealmName: 'AdrenaDAO',
  pythnetRpc: {
    name: 'Triton Pythnet Devnet',
    url: 'https://adrena-pythnet-99a9.mainnet.pythnet.rpcpool.com',
  },
  pythProgram: new PublicKey('rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ'),
  rpcOptions: [],
  stakesClaimPayer: new PublicKey(
    'Sab1ierPayer1111111111111111111111111111111',
  ),
  tokensInfo: TOKEN_INFO,
}; 