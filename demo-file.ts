import { Injectable } from '@nestjs/common';
import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js';
import { TokenService } from '../token/token.service';
import { WalletService } from '../wallet/wallet.service';
import { AdrenaClient } from 'adrena-client';
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { IDL, Adrena } from 'src/idls/adrena';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { DEFAULT_PERPS_USER } from 'adrena-client/dist/utils/constant';

const bonkLogo = 'https://app.adrena.xyz/images/bonk.png';
const btcLogo = 'https://app.adrena.xyz/images/btc.svg';
const jitosolLogo = 'https://app.adrena.xyz/images/jitosol.png';
const solLogo = 'https://app.adrena.xyz/images/sol.svg';
const usdcLogo = 'https://app.adrena.xyz/images/usdc.svg';
const wbtcLogo = 'https://app.adrena.xyz/images/wbtc.png';

import { uiLeverageToNative, uiToNative } from 'adrena-client/dist/utils/utils';
import axios from 'axios';
import { NATIVE_MINT } from '@solana/spl-token';

export const JUP_API = 'https://quote-api.jup.ag/v6';
export const JUP_REFERRAL_ADDRESS =
  'REFER4ZgmyYx9c6He5XfaTMiGfdLwRnkV4RPp9t9iF3';

interface TokenPriceCache {
  price: string;
  timestamp: number;
}

@Injectable()
export class AdrenaService {
  private readonly CACHE_DURATION = 60 * 1000; // 1 dakika (milisaniye cinsinden)
  private tokenPriceCache: Map<string, TokenPriceCache> = new Map();
  private readonly ACCEPTED_TOKENS = ['usdc', 'jitosol', 'bonk', 'btc', 'wbtc'];
  private readonly connection: Connection;
  private readonly PROGRAM_ID = new PublicKey(
    '13gDzEXCdocbj8iAiqrScGo47NiSuYENGsRqi3SEAwet',
  );
  private readonly MAIN_POOL = new PublicKey(
    '4bQRutgDJs6vuh6ZcWaPVXiQaBzbHketjbCDjL4oRN34',
  );

  public readonly TOKEN_INFO: {
    [tokenPubkey: string]: {
      name: string;
      color: string;
      symbol: string;
      image: string;
      coingeckoId: string;
      decimals: number;
      pythPriceUpdateV2: PublicKey;
      displayAmountDecimalsPrecision: number;
      displayPriceDecimalsPrecision: number;
    };
  } = {
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
        // There is no token for BTC
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

  private readonly CLIENT_CONFIG = {
    cluster: 'mainnet',
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
    tokensInfo: this.TOKEN_INFO,
  };

  constructor(
    private readonly tokenService: TokenService,
    private readonly walletService: WalletService,
  ) {
    this.connection = new Connection(process.env.SOLANA_RPC_URL);
  }

  private createAdrenaProvider(wallet: Keypair | NodeWallet): AnchorProvider {
    const nodeWallet =
      wallet instanceof Keypair ? new NodeWallet(wallet) : wallet;

    return new AnchorProvider(this.connection, nodeWallet, {
      commitment: 'processed',
      skipPreflight: true,
    });
  }

  private createAdrenaProgram(provider: AnchorProvider): Program<Adrena> {
    return new Program<Adrena>(IDL, AdrenaClient.programId, provider);
  }

  private async createAdrenaClient(
    program: Program<Adrena>,
    extraConfig = {},
  ): Promise<AdrenaClient> {
    const client = await AdrenaClient.initialize(program, {
      ...this.CLIENT_CONFIG,
      ...extraConfig,
    });

    client.setAdrenaProgram(program);
    return client;
  }

  async checkAcceptedTokenBalance(
    walletAddress: string,
    targetToken?: string,
    sourceToken?: string,
    amount?: number,
  ): Promise<{
    hasAcceptedToken: boolean;
    availableTokens: { symbol: string; balance: string }[];
    isValidPositionSize?: boolean;
    minimumUsdRequired?: number;
    currentUsdValue?: number;
    hasEnoughBalance?: boolean;
    requiredAmount?: number;
    currentBalance?: number;
    sourceTokenSymbol?: string;
    targetTokenSymbol?: string;
  }> {
    // Eğer sourceToken belirtilmişse sadece o token'ın bakiyesini kontrol et
    const tokens = await this.walletService.getTokenBalances(
      walletAddress,
      sourceToken ? [sourceToken] : undefined,
    );

    const availableTokens = tokens
      .filter((token) => this.ACCEPTED_TOKENS.includes(token.symbol))
      .map((token) => ({
        symbol: token.symbol,
        balance: token.amount.toString(),
      }));

    let isValidPositionSize = true;
    const minimumUsdRequired = 10;
    let currentUsdValue = 0;
    let hasEnoughBalance = true;
    let requiredAmount = 0;
    let currentBalance = 0;
    let sourceTokenSymbol = '';
    let targetTokenSymbol = '';

    // Eğer kaynak token, hedef token ve miktar belirtilmişse kontrolleri yap
    if (sourceToken && targetToken && amount) {
      // Kaynak token bakiyesini kontrol et
      const sourceTokenBalance = tokens[0]; // Artık sadece bir token dönecek

      // Hedef token sembolünü bul
      const targetTokenInfo = await this.walletService.getTokenBalances(
        walletAddress,
        [targetToken],
      );

      if (targetTokenInfo && targetTokenInfo.length > 0) {
        targetTokenSymbol = targetTokenInfo[0].symbol;
      }

      if (sourceTokenBalance) {
        sourceTokenSymbol = sourceTokenBalance.symbol;
        currentBalance = parseFloat(sourceTokenBalance.amount.toString());
        hasEnoughBalance = currentBalance >= amount;
        requiredAmount = amount;

        // Kaynak token'ın USD değerini hesapla
        const sourceTokenPrice = await this.getTokenPrice(sourceToken);
        if (sourceTokenPrice) {
          currentUsdValue = amount * parseFloat(sourceTokenPrice);
          isValidPositionSize = currentUsdValue >= minimumUsdRequired;
        }
      } else {
        // Kaynak token cüzdanda hiç yok
        hasEnoughBalance = false;
        requiredAmount = amount;
        currentBalance = 0;
      }
    }

    return {
      hasAcceptedToken: availableTokens.length > 0,
      availableTokens,
      isValidPositionSize,
      minimumUsdRequired,
      currentUsdValue,
      hasEnoughBalance,
      requiredAmount,
      currentBalance,
      sourceTokenSymbol,
      targetTokenSymbol,
    };
  }

  public async openLongPosition({
    owner,
    collateralMint,
    mint,
    amount,
    leverage,
    notification,
    referrer,
  }: {
    owner: Keypair;
    collateralMint: PublicKey;
    mint: PublicKey;
    amount: number;
    leverage: number;
    notification: any;
    referrer: PublicKey;
  }) {
    const readOnlyProvider = this.createAdrenaProvider(owner);
    const program = this.createAdrenaProgram(readOnlyProvider);
    const client = await this.createAdrenaClient(program);

    const decimal = this.TOKEN_INFO[collateralMint.toBase58()].decimals;
    const collateralAmount = uiToNative(amount, decimal);

    const openPositionWithSwapAmountAndFees =
      await client.getOpenPositionWithSwapAmountAndFees({
        collateralMint: collateralMint,
        mint: mint,
        collateralAmount: collateralAmount,
        leverage: uiLeverageToNative(leverage),
        side: 'long',
      });

    try {
      const tx = await client.openOrIncreasePositionWithSwapLong({
        owner: owner.publicKey,
        collateralMint,
        mint,
        price: openPositionWithSwapAmountAndFees.entryPrice,
        collateralAmount,
        leverage: uiLeverageToNative(leverage),
        notification,
        referrer: null,
      });

      return tx;
    } catch (error) {
      console.error('Error opening long position:', error);
      throw error;
    }
  }

  public async openShortPosition({
    owner,
    collateralMint,
    mint,
    amount,
    leverage,
    notification,
    referrer,
  }: {
    owner: Keypair;
    collateralMint: PublicKey;
    mint: PublicKey;
    amount: number;
    leverage: number;
    notification: any;
    referrer: PublicKey;
  }) {
    const readOnlyProvider = this.createAdrenaProvider(owner);
    const program = this.createAdrenaProgram(readOnlyProvider);
    const client = await this.createAdrenaClient(program);

    const decimal = this.TOKEN_INFO[collateralMint.toBase58()].decimals;
    const collateralAmount = uiToNative(amount, decimal);

    const openPositionWithSwapAmountAndFees =
      await client.getOpenPositionWithSwapAmountAndFees({
        collateralMint: collateralMint,
        mint: mint,
        collateralAmount: collateralAmount,
        leverage: uiLeverageToNative(leverage),
        side: 'short',
      });

    try {
      const tx = await client.openOrIncreasePositionWithSwapShort({
        owner: owner.publicKey,
        collateralMint,
        mint,
        price: openPositionWithSwapAmountAndFees.entryPrice,
        collateralAmount,
        leverage: uiLeverageToNative(leverage),
        notification,
        referrer,
      });

      return tx;
    } catch (error) {
      console.error('Error opening short position:', error);
      throw error;
    }
  }

  private async formatPosition(position: any) {
    const positionType = position.side;
    const symbol = position.token.symbol;
    const leverage = position.initialLeverage.toFixed(2);
    const openDate = position.openDate;
    const icon = position.side === 'long' ? '🟢' : '🔴';

    const currentPrice = await this.getTokenPrice(position.token.mint);
    const tokenPrice = currentPrice ? parseFloat(currentPrice) : position.price;
    const liquidationPrice = position.price * (1 - 1 / leverage);

    const unrealizedPnl =
      position.side === 'long'
        ? (tokenPrice - position.price) * position.size
        : (position.price - tokenPrice) * position.size;

    const pnlPercentage = Number(
      ((unrealizedPnl / position.collateralUsd) * 100).toFixed(2),
    );

    return {
      pubkey: position.pubkey.toBase58(),
      side: position.side,
      openDate: openDate,
      positionType: positionType,
      pnlUsd: unrealizedPnl.toFixed(2),
      icon: icon,
      symbol: symbol,
      size: position.size,
      sizeUsd: position.sizeUsd,
      collateralUsd: position.collateralUsd,
      collateralAmount: position.collateralAmount,
      exitFeeUsd: position.exitFeeUsd,
      breakEvenPrice: position.breakEvenPrice,
      unrealizedInterestUsd: position.unrealizedInterestUsd,
      leverage: leverage,
      price: position.price,
      currentPrice: tokenPrice,
      pnlPercentage: pnlPercentage,
      pnl: unrealizedPnl,
      liquidationPrice: liquidationPrice,
    };
  }

  public createPNLImage(position: any) {
    const openDate = new Date(position.openDate);
    const localTime =
      openDate.getTime() - openDate.getTimezoneOffset() * 60 * 1000;

    const params = {
      opt: Math.floor(Math.random() * 5),
      pnl: position.pnlPercentage,
      pnlUsd: position.pnlUsd,
      isPnlUsd: false,
      side: position.side,
      symbol: position.symbol,
      collateral: position.collateralUsd,
      mark: position.currentPrice,
      exitPrice: position?.exitPrice ?? 0,
      price: position.price,
      size: position.sizeUsd,
      opened: localTime,
    };

    const urlParams = new URLSearchParams(params as any).toString();
    const shortenedUrl = `https://app.adrena.xyz/api/og?${urlParams}`;

    return shortenedUrl;
  }

  async getPositions(user: PublicKey, positionAddresses?: string[]) {
    try {
      const owner = DEFAULT_PERPS_USER;
      const provider = this.createAdrenaProvider(owner);
      const program = this.createAdrenaProgram(provider);
      const client = await this.createAdrenaClient(program, {
        rpcOptions: [
          {
            name: 'Triton RPC',
            url: 'https://adrena-solanam-6f0c.mainnet.rpcpool.com',
          },
          {
            name: 'Helius RPC',
            url: 'https://mainnet.helius-rpc.com/?api-key=1e567222-acdb-43ee-80dc-926f9c06d89d',
          },
        ],
      });

      const positions = await client.loadUserPositions(
        new PublicKey(user),
        // new PublicKey('4JXS1zGAMNEyUcUMxPPqFJnbZLSBhhvD2KpfceSTzAUi'),
        positionAddresses?.map((address) => new PublicKey(address)),
      );

      if (!positions || positions.length === 0) {
        return [];
      }

      // Promise.all kullanarak tüm pozisyonları paralel olarak formatla
      const formattedPositions = await Promise.all(
        positions.map((position) => this.formatPosition(position)),
      );

      return formattedPositions;
    } catch (error) {
      console.error('Error fetching positions:', error);
      throw error;
    }
  }

  async getTokenPrice(tokenMint: string): Promise<string | null> {
    try {
      const cachedPrice = this.tokenPriceCache.get(tokenMint);
      const now = Date.now();

      if (cachedPrice && now - cachedPrice.timestamp < this.CACHE_DURATION) {
        return cachedPrice.price;
      }
      const response = await axios.get(
        `https://api.jup.ag/price/v2?ids=${tokenMint}`,
      );

      if (response.data?.data?.[tokenMint]?.price) {
        const price = response.data.data[tokenMint].price;

        this.tokenPriceCache.set(tokenMint, {
          price,
          timestamp: now,
        });

        return price;
      }

      return null;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  async getMultipleTokenPrices(
    tokenMints: string[],
  ): Promise<Map<string, string | null>> {
    const prices = new Map<string, string | null>();

    await Promise.all(
      tokenMints.map(async (mint) => {
        const price = await this.getTokenPrice(mint);
        prices.set(mint, price);
      }),
    );

    return prices;
  }

  public async closePosition({
    owner,
    positionPubkey,
  }: {
    owner: Keypair;
    positionPubkey: PublicKey;
  }) {
    const provider = this.createAdrenaProvider(owner);
    const program = this.createAdrenaProgram(provider);
    const client = await this.createAdrenaClient(program);

    try {
      // Önce pozisyonu yükle
      const positions = await client.loadUserPositions(owner.publicKey, [
        positionPubkey,
      ]);

      if (!positions || positions.length === 0) {
        throw new Error('Position not found');
      }

      const position = positions[0];
      let tx: string;

      const priceAndFee = await client.getExitPriceAndFee({
        position,
      });

      const slippageInBps = 100;

      const priceWithSlippage =
        position.side === 'short'
          ? priceAndFee.price
            .mul(new BN(10_000))
            .div(new BN(10_000 - slippageInBps))
          : priceAndFee.price
            .mul(new BN(10_000 - slippageInBps))
            .div(new BN(10_000));

      // Pozisyon tipine göre ilgili kapatma metodunu çağır
      if (position.side === 'long') {
        tx = await client.closePositionLong({
          position,
          price: position.price,
          notification: {
            currentStepSucceeded: () => {
              console.log(
                '>>> notification success = ',
                owner.publicKey.toBase58(),
              );
            },
            currentStepErrored: () => {
              console.log(
                '>>> notification error = ',
                owner.publicKey.toBase58(),
              );
            },
            setTxHash: (txHash: string) => {
              console.log('>>> notification txHash = ', txHash);
            },
          },
        });
      } else {
        tx = await client.closePositionShort({
          position,
          price: priceWithSlippage,
          notification: {
            currentStepSucceeded: () => {
              console.log(
                '>>> notification success = ',
                owner.publicKey.toBase58(),
              );
            },
            currentStepErrored: () => {
              console.log(
                '>>> notification error = ',
                owner.publicKey.toBase58(),
              );
            },
            setTxHash: (txHash: string) => {
              console.log('>>> notification txHash = ', txHash);
            },
          },
        });
      }

      return tx;
    } catch (error) {
      console.error('Error closing position:', error);
      throw error;
    }
  }
}
