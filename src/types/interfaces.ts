import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export interface Token {
  mint: PublicKey;
  name: string;
  symbol: string;
  decimals: number;
  displayAmountDecimalsPrecision: number;
  displayPriceDecimalsPrecision: number;
  isStable: boolean;
  imageUrl?: string;
  custody?: PublicKey;
}

export interface Pool {
  pubkey: PublicKey;
  custodies: PublicKey[];
  ratios: number[];
}

export interface Position {
  pubkey: PublicKey;
  custody: PublicKey;
  collateralCustody: PublicKey;
  owner: PublicKey;
  side: number;
  price: BN;
  sizeUsd: BN;
  collateralUsd: BN;
  lockedAmount: BN;
  collateralAmount: BN;
  exitFeeUsd: BN;
  liquidationFeeUsd: BN;
  unrealizedInterestUsd: BN;
  openTime: BN;
  updateTime: BN;
  stopLossIsSet: number;
  stopLossLimitPrice: BN;
  stopLossClosePositionPrice: BN;
  takeProfitIsSet: number;
  takeProfitLimitPrice: BN;
}

// Diğer arayüzler buraya eklenecek 