import { PublicKey } from '@solana/web3.js';
import { ImageRef } from '@/types/types';
import { IMAGES } from '@/constants/images';
import IConfiguration, { RpcOption } from './IConfiguration';

export class DevnetConfiguration implements IConfiguration {
  public readonly cluster = 'devnet';

  // If devMode is true, means that the app is running in localhost or in a vercel preview
  constructor(public readonly devMode: boolean) { }

  public readonly tokensInfo: {
    [tokenPubkey: string]: {
      name: string;
      color: string;
      symbol: string;
      image: ImageRef;
      coingeckoId: string;
      decimals: number;
      displayAmountDecimalsPrecision: number;
      displayPriceDecimalsPrecision: number;
      pythPriceUpdateV2: PublicKey;
    };
  } = {
      '3jdYcGYZaQVvcvMQGqVpt37JegEoDDnX7k4gSGAeGRqG': {
        name: 'USD Coin',
        color: '#2775ca',
        symbol: 'USDC',
        image: IMAGES.USDC,
        coingeckoId: 'usd-coin',
        decimals: 6,
        displayAmountDecimalsPrecision: 2,
        displayPriceDecimalsPrecision: 4,
        pythPriceUpdateV2: new PublicKey(
          'Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX',
        ),
      },
      '2eU7sUxhpQuBaUrjd6oPTzoFZNPEaawrAka4zqowMzbJ': {
        name: 'BONK',
        color: '#FFA500',
        symbol: 'BONK',
        image: IMAGES.BONK,
        coingeckoId: 'bonk',
        decimals: 5,
        displayAmountDecimalsPrecision: 0,
        displayPriceDecimalsPrecision: 8,
        pythPriceUpdateV2: new PublicKey(
          'DBE3N8uNjhKPRHfANdwGvCZghWXyLPdqdSbEW2XFwBiX',
        ),
      },
      '7MoYkgWVCEDtNR6i2WUH9LTUSFXkQCsD9tBHriHQvuP5': {
        name: 'Bitcoin',
        color: '#f7931a',
        symbol: 'BTC',
        image: IMAGES.BTC,
        coingeckoId: 'bitcoin',
        decimals: 6,
        displayAmountDecimalsPrecision: 6,
        displayPriceDecimalsPrecision: 2,
        pythPriceUpdateV2: new PublicKey(
          '4cSM2e6rvbGQUFiJbqytoVMi5GgghSMr8LwVrT9VPSPo',
        ),
      },
      DmfSVHxadyJU4HJXT4pvXMzVfBHDiyS32NRKSAdxkzEy: {
        name: 'Jito Staked SOL',
        color: '#84CC90',
        symbol: 'JITOSOL',
        image: IMAGES.JITOSOL,
        coingeckoId: 'solana',
        decimals: 9,
        displayAmountDecimalsPrecision: 4,
        displayPriceDecimalsPrecision: 2,
        pythPriceUpdateV2: new PublicKey(
          'AxaxyeDT8JnWERSaTKvFXvPKkEdxnamKSqpWbsSjYg1g',
        ),
      },
    };

  public readonly governanceProgram: PublicKey = new PublicKey(
    'GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw',
  );

  public readonly stakesClaimPayer: PublicKey = new PublicKey(
    'Sab1ierPayer1111111111111111111111111111111',
  );

  public readonly pythProgram: PublicKey = new PublicKey(
    'rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ',
  );

  public readonly governanceRealmName = 'AdrenaDaoTestingA';

  public readonly rpcOptions: RpcOption[] = this.devMode
    ? [
      {
        name: 'Triton Dev RPC',
        url: (() => {
          const apiKey = process.env.DEV_TRITON_RPC_API_KEY;

          if (!apiKey)
            throw new Error(
              'Missing environment variable DEV_TRITON_RPC_API_KEY',
            );

          return `https://adrena-solanad-ac2e.devnet.rpcpool.com/${apiKey}`;
        })(),
      },
    ]
    : [
      {
        name: 'Triton RPC',
        url: 'https://adrena-solanad-ac2e.devnet.rpcpool.com',
      },
      {
        name: 'Helius RPC',
        url: 'https://devnet.helius-rpc.com/?api-key=1e567222-acdb-43ee-80dc-926f9c06d89d',
      },
      {
        name: 'Solana RPC',
        url: 'https://api.devnet.solana.com',
      },
    ];

  public readonly pythnetRpc: RpcOption = {
    name: 'Triton Pythnet Devnet',
    url: (() => {
      const url = 'https://adrena-pythnet-99a9.mainnet.pythnet.rpcpool.com';

      if (!this.devMode) return url;

      const apiKey = process.env.DEV_PYTHNET_TRITON_RPC_API_KEY;

      if (!apiKey)
        throw new Error(
          'Missing environment variable DEV_PYTHNET_TRITON_RPC_API_KEY',
        );

      return `${url}/${apiKey}`;
    })(),
  };
}
