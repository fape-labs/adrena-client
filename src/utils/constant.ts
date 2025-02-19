import { Keypair, PublicKey } from '@solana/web3.js';

import { ResolutionString } from '../public/charting_library/charting_library';
import { AdrenaEvent, AdxLockPeriod, AlpLockPeriod, SupportedCluster } from '../types/types';

export const RATE_DECIMALS = 9;
export const PRICE_DECIMALS = 10;
export const USD_DECIMALS = 6;
export const LP_DECIMALS = 6;
export const SOL_DECIMALS = 9;

// In ms
export const MINIMUM_POSITION_OPEN_TIME = 10_000;

export const BPS = 10_000;

export const GENESIS_REWARD_ADX_PER_USDC = 5;

// FL4KKyvANrRFsm8kRRCoUW9QJY5LixttpdFxEBEm7ufW
export const devnetFaucetBankWallet = Keypair.fromSecretKey(
  Uint8Array.from([
    118, 180, 111, 61, 83, 103, 53, 249, 88, 225, 182, 193, 49, 141, 195, 60,
    151, 170, 18, 132, 150, 11, 207, 9, 30, 62, 137, 148, 34, 131, 227, 185,
    212, 229, 102, 216, 113, 142, 121, 185, 142, 246, 249, 201, 195, 31, 76,
    204, 63, 230, 217, 230, 172, 238, 66, 175, 83, 59, 93, 7, 120, 229, 42, 217,
  ]),
);

export const DEFAULT_PERPS_USER = Keypair.fromSecretKey(
  Uint8Array.from([
    130, 82, 70, 109, 220, 141, 128, 34, 238, 5, 80, 156, 116, 150, 24, 45, 33,
    132, 119, 244, 40, 40, 201, 182, 195, 179, 90, 172, 51, 27, 110, 208, 61,
    23, 43, 217, 131, 209, 127, 113, 93, 139, 35, 156, 34, 16, 94, 236, 175,
    232, 174, 79, 209, 223, 86, 131, 148, 188, 126, 217, 19, 248, 236, 107,
  ]),
);

export const ALP_STAKE_MULTIPLIERS: {
  [K in AlpLockPeriod]: { usdc: number; adx: number };
} = {
  0: {
    usdc: 0,
    adx: 0,
  },
  90: {
    usdc: 0.75,
    adx: 1.0,
  },
  180: {
    usdc: 1.5,
    adx: 1.75,
  },
  360: {
    usdc: 2.25,
    adx: 2.5,
  },
  540: {
    usdc: 3.0,
    adx: 3.25,
  },
} as const;

export const ALP_LOCK_PERIODS: AlpLockPeriod[] = [90, 180, 360, 540];

export const ADX_STAKE_MULTIPLIERS: {
  [K in AdxLockPeriod]: { usdc: number; adx: number; votes: number };
} = {
  0: {
    usdc: 1,
    adx: 0,
    votes: 1,
  },
  90: {
    usdc: 1.75,
    adx: 1.0,
    votes: 1.75,
  },
  180: {
    usdc: 2.5,
    adx: 1.75,
    votes: 2.5,
  },
  360: {
    usdc: 3.25,
    adx: 2.5,
    votes: 3.25,
  },
  540: {
    usdc: 4.0,
    adx: 3.25,
    votes: 4.0,
  },
} as const;

export const ADX_LOCK_PERIODS: AdxLockPeriod[] = [0, 90, 180, 360, 540];

export const ROUND_MIN_DURATION_SECONDS = 3_600 * 6;

export const SUPPORTED_RESOLUTIONS = [
  '1',
  '3',
  '5',
  '15',
  '30',
  '60',
  '120',
  '240',
  '1D',
] as ResolutionString[];

export const VEST_BUCKETS = [
  'Core Contributor',
  'Foundation',
  'Ecosystem',
] as const;

// if you add a new explorer, make sure to add the icon in settings component
export const SOLANA_EXPLORERS_OPTIONS = {
  'Solana Beach': {
    url: 'https://solanabeach.io',
    // TODO: support devnet
    getWalletAddressUrl: (address: PublicKey, cluster: SupportedCluster) =>
      cluster === 'devnet'
        ? `https://explorer.solana.com/address/${address}?cluster=devnet` // redirection vers Solana Explorer pour devnet
        : `https://solanabeach.io/address/${address}`,
    getTxUrl: (tx: string, cluster: SupportedCluster) =>
      `https://solanabeach.io/transaction/${tx}${cluster === 'devnet' ? '?cluster=devnet' : ''
      }`,
  },
  Solscan: {
    url: 'https://solscan.io',
    getWalletAddressUrl: (address: PublicKey, cluster: SupportedCluster) =>
      `https://solscan.io/account/${address}${cluster === 'devnet' ? '?cluster=devnet' : ''
      }`,
    getTxUrl: (tx: string, cluster: SupportedCluster) =>
      `https://solscan.io/tx/${tx}${cluster === 'devnet' ? '?cluster=devnet' : ''
      }`,
  },
  'Solana Explorer': {
    url: 'https://explorer.solana.com',
    getWalletAddressUrl: (address: PublicKey, cluster: SupportedCluster) =>
      `https://explorer.solana.com/address/${address}${cluster === 'devnet' ? '?cluster=devnet' : ''
      }`,
    getTxUrl: (tx: string, cluster: SupportedCluster) =>
      `https://explorer.solana.com/tx/${tx}${cluster === 'devnet' ? '?cluster=devnet' : ''
      }`,
  },
  'Solana FM': {
    url: 'https://solana.fm',
    getWalletAddressUrl: (address: PublicKey, cluster: SupportedCluster) =>
      `https://solana.fm/address/${address}${cluster === 'devnet' ? '?cluster=devnet-solana' : ''
      }`,
    getTxUrl: (tx: string, cluster: SupportedCluster) =>
      `https://solana.fm/tx/${tx}${cluster === 'devnet' ? '?cluster=devnet-solana' : ''
      }`,
  },
} as const;

export const greenColor = '#07956be6';
export const redColor = '#F23645';
export const greyColor = '#78828e';
export const whiteColor = '#ffffff';
export const orangeColor = '#f77f00';
export const blueColor = '#3a86ff';
export const purpleColor = '#9333ea';

export const normalize = (
  value: number,
  minRange: number,
  maxRange: number,
  minValue: number,
  maxValue: number,
) => {
  if (maxValue === minValue) {
    return maxRange;
  }
  if (value < minValue || value > maxValue) {
    return 0;
  }
  return (
    minRange +
    ((value - minValue) / (maxValue - minValue)) * (maxRange - minRange)
  );
};

export const ADRENA_EVENTS: AdrenaEvent[] = [
  {
    label: '',
    time: '9/17',
    color: '#ffffff40',
    labelPosition: 'insideTopRight',
    description: `Genesis phase: liquidity pool raises 10m to bootstrap trading.`,
    type: 'Global',
  },
  {
    label: '',
    time: '9/25',
    color: '#ffffff40',
    labelPosition: 'insideTopRight',
    description: `Trading goes live.`,
    type: 'Global',
  },
  {
    label: '',
    time: '10/15',
    color: '#ffffff40',
    labelPosition: 'insideTopRight',
    description: `Increase WBTC and JitoSOL max position size to $500k.`,
    type: 'Trading',
  },
  {
    label: '',
    time: '10/30',
    color: '#ffffff40',
    labelPosition: 'insideTopRight',
    description: `Increase WBTC and JitoSOL max position size to $750k.`,
    type: 'Trading',
  },
  {
    label: '',
    time: '11/2',
    color: '#ffffff40',
    labelPosition: 'insideTopRight',
    description: `Update pool target ratios to [15% USDC, 7% BONK, 54% jitoSOL, 24% WBTC].`,
    type: 'Global',
  },
  {
    label: '',
    time: '11/2',
    color: '#ffffff40',
    labelPosition: 'insideTopLeft',
    description: 'BONK borrow rate increased from 0.008%/h to 0.016%/h.',
    type: 'Trading',
  },
  {
    label: '',
    time: '11/11',
    color: '#ffffff40',
    labelPosition: 'insideTopRight',
    description: `"Pre-season: AWAKENING" trading competition starts.`,
    type: 'Trading',
  },
  {
    label: '',
    time: '11/13',
    color: '#ffffff40',
    labelPosition: 'insideTopRight',
    description: `Increase WBTC and jitoSOL max position size to $1m.`,
    type: 'Trading',
  },
  {
    label: '',
    time: '11/20',
    color: '#ffffff40',
    labelPosition: 'insideTopLeft',
    description: 'BONK borrow rate increased from 0.016%/h to 0.032%/h.',
    type: 'Trading',
  },
  {
    label: '',
    time: '11/23',
    color: '#ffffff40',
    labelPosition: 'insideTopRight',
    description: `Increase WBTC and jitoSOL max position size to $2m.`,
    type: 'Trading',
  },
  {
    label: '',
    time: '12/8',
    color: '#ffffff40',
    labelPosition: 'insideTopRight',
    description: `Increase WBTC and jitoSOL max position size to $4m.`,
    type: 'Trading',
  },
  {
    label: '',
    time: '12/10',
    color: '#ffffff40',
    labelPosition: 'insideTopRight',
    description: `Increase liquidity pool soft cap to $30m.`,
    type: 'Global',
  },
  {
    label: '',
    time: '12/23',
    color: '#ffffff40',
    labelPosition: 'insideTopRight',
    description: `"Pre-season: AWAKENING" trading competition ends. 876 participants fought for 2.27M ADX and 25k JTO rewards.`,
    type: 'Global',
  },
  {
    label: '',
    time: '01/05',
    color: '#ffffff40',
    labelPosition: 'insideTopRight',
    description: `Adrena is now supported by Solana AgentKit from SendAI.`,
    type: 'Trading',
  },
];
