import { IdlAccounts, Program, Wallet } from '@coral-xyz/anchor';
import {
  AllInstructionsMap,
  IdlTypes,
} from '@coral-xyz/anchor/dist/cjs/program/namespace/types';
import { Adapter } from '@solana/wallet-adapter-base';
import { Connection, PublicKey } from '@solana/web3.js';
import Image from 'next/image';

import { Adrena } from '../types/adrena';

import { AdrenaClient } from './AdrenaClient';
import IConfiguration, { TokenInfo } from './config/IConfiguration';
import type { WalletAdapterName } from './hooks/useWalletAdapters';

// Force users to provide images loaded with import so it's known from nextjs at ssr time
export type ImageRef = string;

export type SupportedCluster = 'devnet' | 'mainnet';

export type GeoBlockingData = {
  country?: string;
  allowed: boolean;
};

export type SolanaExplorerOptions =
  | 'Solana Explorer'
  | 'Solscan'
  | 'Solana Beach'
  | 'Solana FM';

export type Settings = {
  // priorityFee: PriorityFeeOption;
  solanaExplorer: SolanaExplorerOptions;
};

export type AdrenaGlobal = {
  config: IConfiguration;
  client: AdrenaClient;
  mainConnection: Connection;
  pythConnection: Connection;
  cluster: SupportedCluster;
  settings: Settings;
};

// Rive doesn't expose the type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RiveImage = any;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Jupiter: any;
    riveImageCaching: Record<string, RiveImage>;
    adrena: AdrenaGlobal;
  }
}

export type WalletAdapterExtended = Adapter & {
  color: string;
  beta: boolean;
  walletName: WalletAdapterName;
  recommended: boolean;
  iconOverride?: ImageRef;
};

export type PageProps = {
  mainPool: PoolExtended | null;
  userProfile: UserProfileExtended | null | false;
  triggerUserProfileReload: () => void;
  custodies: CustodyExtended[] | null;
  wallet: Wallet | null;
  connected: boolean;
  activeRpc: {
    name: string;
    connection: Connection;
  };
  adapters: WalletAdapterExtended[];
};

export type CustodyExtended = {
  // Formatted data
  tokenInfo: TokenInfo;
  tradeTokenInfo: TokenInfo;
  pubkey: PublicKey;
  mint: PublicKey;
  tradeMint: PublicKey;
  isStable: boolean;
  decimals: number;
  maxLeverage: number;
  minInitialLeverage: number;
  maxInitialLeverage: number;
  targetRatio: number;
  maxRatio: number;
  minRatio: number;
  owned: number;
  totalFeeCollected: number;
  // Expressed in tokens
  // Do liquidity * tokenPrice to get liquidityUsd
  liquidity: number;
  borrowFee: number;
  // The maximum size of the position you can open, for that market and side.
  maxPositionLockedUsd: number;
  // The available liquidity for the short side for that custody (restricted by the custody configuration)
  maxCumulativeShortPositionSizeUsd: number;
  // TradeStats
  oiShortUsd: number;

  // Onchain data
  nativeObject: Custody;
};

export type VestExtended = {
  pubkey: PublicKey;
} & Vest;

export type UserStakingExtended = {
  pubkey: PublicKey;
} & UserStaking;

export type PositionExtended = {
  // Formatted data
  custody: PublicKey;
  collateralCustody: PublicKey;
  owner: PublicKey;
  pubkey: PublicKey;
  initialLeverage: number;
  currentLeverage: number | null;
  token: Token;
  collateralToken: Token;
  side: 'long' | 'short';
  openDate: Date;
  updatedDate: Date;
  // Including fees
  pnl?: number | null;
  pnlMinusFees?: number | null;
  profitUsd?: number | null;
  lossUsd?: number | null;
  borrowFeeUsd?: number | null;
  liquidationPrice?: number | null;
  sizeUsd: number;
  size: number; // The size in tokens
  collateralUsd: number;
  collateralAmount: number;
  price: number;
  breakEvenPrice: number | null;
  exitFeeUsd: number;
  liquidationFeeUsd: number;
  stopLossClosePositionPrice?: number | null;
  stopLossLimitPrice?: number | null;
  stopLossIsSet: boolean;
  takeProfitLimitPrice?: number | null;
  takeProfitIsSet: boolean;
  unrealizedInterestUsd: number;

  // Onchain data
  nativeObject: Position;
};

export type PoolExtended = {
  pubkey: PublicKey;

  // Formatted data
  whitelistedSwapper: PublicKey;
  aumSoftCapUsd: number;
  totalFeeCollected: number;
  profitsUsd: number;
  lossUsd: number;
  longPositions: number;
  shortPositions: number;
  aumUsd: number;
  totalSwapVolume: number;
  totalAddRemoveLiquidityVolume: number;
  totalTradingVolume: number; // total open volume
  totalLiquidationVolume: number;
  oiLongUsd: number;
  oiShortUsd: number;
  nbOpenLongPositions: number;
  nbOpenShortPositions: number;
  custodies: PublicKey[];

  // Onchain data
  nativeObject: Pool;
};

export type VestExtended = Vest & {
  pubkey: PublicKey;
};

// Alias to improve readability
export type TokenName = string;
export type TokenSymbol = string;

export interface Token {
  mint: PublicKey;
  symbol: TokenSymbol;
  color: string;
  name: TokenName;
  decimals: number;
  displayAmountDecimalsPrecision: number;
  displayPriceDecimalsPrecision: number;
  isStable: boolean;
  image: ImageRef;
  custody?: PublicKey;
  coingeckoId?: string;
  pythPriceUpdateV2?: PublicKey;
}

export type UserProfileExtended = {
  pubkey: PublicKey;
  nickname: string;
  createdAt: number;
  owner: PublicKey;
  swapCount: number;
  swapVolumeUsd: number;
  swapFeePaidUsd: number;
  // Aggregates
  totalPnlUsd: number;
  // Only accounts for opens
  totalTradeVolumeUsd: number;
  totalFeesPaidUsd: number;
  openingAverageLeverage: number;
  //
  shortStats: {
    openedPositionCount: number;
    liquidatedPositionCount: number;
    openingAverageLeverage: number;
    openingSizeUsd: number;
    profitsUsd: number;
    lossesUsd: number;
    feePaidUsd: number;
  };
  longStats: {
    openedPositionCount: number;
    liquidatedPositionCount: number;
    openingAverageLeverage: number;
    openingSizeUsd: number;
    profitsUsd: number;
    lossesUsd: number;
    feePaidUsd: number;
  };
  nativeObject: UserProfile;
};

//
// Accounts
//
type Accounts = IdlAccounts<Adrena>;

export type Cortex = Accounts['cortex'];
export type VestRegistry = Accounts['vestRegistry'];
export type Custody = Accounts['custody'];
export type Multisig = Accounts['multisig'];
export type Perpetuals = Accounts['perpetuals'];
export type Pool = Accounts['pool'];
export type Position = Accounts['position'];
export type UserStaking = Accounts['userStaking'];
export type Staking = Accounts['staking'];
export type Vest = Accounts['vest'];
export type GenesisLock = Accounts['genesisLock'];
export type UserProfile = Accounts['userProfile'];

export type LockedStake = UserStaking['lockedStakes'][0];

export type LockedStakeExtended = UserStaking['lockedStakes'][0] & {
  index: number;
  tokenSymbol: 'ADX' | 'ALP';
};

export type GreaterThanOrEqual = 'gte';
export type LessThanOrEqual = 'lte';

export type Equality = {
  GreaterThanOrEqual;
  LessThanOrEqual;
};

// The UI options for priority fees - Stored in cookies
export type PriorityFeeOption = 'medium' | 'high' | 'ultra';

//
// Params Types
//

type Params = IdlTypes<Adrena>;

export type U128Split = Params['U128Split'];
export type LimitedString = Params['LimitedString'];
export type AddCollateralParams = Params['AddCollateralParams'];
export type AddCustodyParams = Params['AddCustodyParams'];
export type AddLiquidityParams = Params['AddLiquidityParams'];
export type AddPoolParams = Params['AddPoolParams'];
export type ClosePositionParams = Params['ClosePositionParams'];
export type RemoveCollateralParams = Params['RemoveCollateralParams'];
export type RemoveLiquidityParams = Params['RemoveLiquidityParams'];
export type Fees = Params['Fees'];
export type FeesStats = Params['FeesStats'];
export type VolumeStats = Params['VolumeStats'];
export type TradeStats = Params['TradeStats'];
export type Assets = Params['Assets'];
export type OracleParams = Params['OracleParams'];
export type PricingParams = Params['PricingParams'];
export type BorrowRateParams = Params['BorrowRateParams'];
export type BorrowRateState = Params['BorrowRateState'];
export type PositionStats = Params['PositionStats'];
export type OraclePrice = Params['OraclePrice'];
export type ExitPriceAndFee = Params['ExitPriceAndFee'];
export type NewPositionPricesAndFee = Params['NewPositionPricesAndFee'];
export type OpenPositionWithSwapAmountAndFees =
  Params['OpenPositionWithSwapAmountAndFees'];
export type SwapAmountAndFees = Params['SwapAmountAndFees'];
export type ProfitAndLoss = Params['ProfitAndLoss'];
export type Permissions = Params['Permissions'];
export type PoolToken = Params['PoolToken'];
export type FeesMode = Params['FeesMode'];
export type OracleType = Params['OracleType'];
export type Side = Params['Side'];
export type GetEntryPriceAndFeeParams = Params['GetEntryPriceAndFeeParams'];
export type AmountAndFee = Params['AmountAndFee'];

//
// Accounts types
//

type Instructions = AllInstructionsMap<Adrena>;

type Nullable<T, U extends keyof T> = {
  [P in U]: T[P] | null;
};

type ExtractAccounts<T> = {
  [key in Instructions[T]['accounts'][number]['name']]: PublicKey;
};

// Force some accounts to be optional (null)
type OptionalAccounts<T, U> = Nullable<Pick<T, U>> & Omit<T, U>;

// Use accounts types to force TS typing computation. TS will then throw an error if account is missing
export type InitUserProfile = OptionalAccounts<
  ExtractAccounts<'initUserProfile'>,
  'sponsor'
>;

export type EditUserProfile = ExtractAccounts<'editUserProfile'>;
export type DeleteUserProfile = ExtractAccounts<'deleteUserProfile'>;
export type AddCollateralAccounts = ExtractAccounts<'addCollateral'>;
export type OpenPositionAccounts = OptionalAccounts<
  ExtractAccounts<'openPosition'>,
  'userProfile'
>;

export type OpenPositionWithSwapAccounts = OptionalAccounts<
  ExtractAccounts<'openPositionWithSwap'>,
  'userProfile'
>;
export type SwapAccounts = OptionalAccounts<
  ExtractAccounts<'swap'>,
  'userProfile'
>;
export type ClosePositionAccounts = OptionalAccounts<
  ExtractAccounts<'closePosition'>,
  'userProfile'
>;
export type RemoveCollateralAccounts = ExtractAccounts<'removeCollateral'>;
export type AddLiquidStakeAccounts = ExtractAccounts<'addLiquidStake'>;
export type AddLockedStakeAccounts = ExtractAccounts<'addLockedStake'>;
export type RemoveLiquidStakeAccounts = ExtractAccounts<'removeLiquidStake'>;
export type RemoveLockedStakeAccounts = ExtractAccounts<'removeLockedStake'>;
export type FinalizeLockedStakeAccounts =
  ExtractAccounts<'finalizeLockedStake'>;
export type InitUserStakingAccounts = ExtractAccounts<'initUserStaking'>;
export type AddLiquidityAccounts = ExtractAccounts<'addLiquidity'>;
export type RemoveLiquidityAccounts = ExtractAccounts<'removeLiquidity'>;
export type ClaimStakesAccounts = ExtractAccounts<'claimStakes'>;

//
// Program
//
export type AdrenaProgram = Program<Adrena>;

//
// Constants
//

export type AdxLockPeriod = 0 | 90 | 180 | 360 | 540;
export type AlpLockPeriod = 0 | 90 | 180 | 360 | 540;

export type PositionHistoryExtended = {
  position_id: number;
  user_id: number;
  custody_id: number;
  side: 'long' | 'short';
  status: 'open' | 'close' | 'liquidate';
  pubkey: PublicKey;
  entry_price: number | null;
  exit_price: number | null;
  pnl: number;
  entry_leverage: number;
  entry_collateral_amount: number;
  size: number;
  exit_size: number;
  entry_date: Date;
  exit_date: Date | null;
  fees: number;
  borrow_fees: number;
  exit_fees: number;
  created_at: Date;
  updated_at: Date | null;
  profile: string;
  symbol: string;
  token_account_mint: string;
  token: Token;
  last_tx: string; // the close or liquidate tx
  final_collateral_amount: number; // Final collateral amount before close
};

export type Trader = {
  user_id: number;
  user_pubkey: string;
  pnl_minus_fees: number;
  pnl: number;
  volume: number;
  fees: number;
  borrow_fees: number;
  exit_fees: number;
  number_positions: number;
  number_transactions: number;
  average_trade_time: number;
  volume_weighted_pnl: number;
  volume_weighted_pnl_percentage: number;
  win_rate_percentage: number;
  avg_win_pnl: number;
  avg_loss_pnl: number;
  liquidation_count: number;
  shortest_trade_time: number;
  pnl_volatility: number;
};

export type PositionHistoryApi = {
  position_id: number;
  user_id: number;
  side: 'long' | 'short';
  status: 'open' | 'close' | 'liquidate';
  pubkey: string;
  entry_price: number | null;
  exit_price: number | null;
  pnl: number;
  entry_leverage: number;
  entry_collateral_amount: number;
  size: number;
  exit_size: number;
  entry_date: string; // ISO date string
  exit_date: string | null; // ISO date string
  fees: number;
  borrow_fees: number;
  exit_fees: number;
  created_at: string; // ISO date string
  updated_at: string | null; // ISO date string
  profile: string;
  symbol: string;
  token_account_mint: string;
  last_ix: string;
  collateral_amount: number;
};

export type RechartsData = {
  [key: string]: number | string | boolean;
};

export type AdrenaEventType = 'Global' | 'Trading' | 'Staking' | 'Other';

export type AdrenaEvent = {
  label: string;
  description: string;
  time: string;
  color: string;
  labelPosition?: LabelPosition;
  type: AdrenaEventType;
};

export type ClaimApi = {
  claim_id: number;
  rewards_adx: number;
  rewards_adx_genesis: number;
  rewards_usdc: number;
  signature: string;
  transaction_date: string; // ISO date-time string
  created_at: string; // ISO date-time string
  mint: string;
  source: 'manual' | 'auto';
};

export type ClaimHistoryApi = {
  start_date: string; // ISO date-time string
  end_date: string; // ISO date-time string
  limit: number;
  claims: ClaimApi[];
};

export type ClaimHistoryExtended = {
  claim_id: number;
  created_at: Date;
  stake_mint: string;
  rewards_adx: number;
  rewards_adx_genesis: number;
  rewards_usdc: number;
  signature: string;
  source: 'manual' | 'auto';
  symbol: string;
  transaction_date: Date;
};

type AchievementsBase = {
  weekStarts: string;
  weekEnds: string;
};

export type TradingCompetitionAchievementsAPI = {
  biggestLiquidation: AchievementsBase & {
    addresses: string | null;
    liquidationAmounts: number | null;
    reward: number | null;
    rewardToken: string | null;
  };
  feesTickets: AchievementsBase & {
    addresses: (string | null)[];
    ticketsCount: (number | null)[];
    totalTickets: number | null;
    reward: number | null;
    rewardToken: string | null;
  };
  topDegen: AchievementsBase & {
    pnlAmounts: number | null;
    addresses: string | null;
    usernames: (string | null)[];
    liquidationAmounts: (number | null)[];
    reward: number | null;
    rewardToken: string | null;
  };
  jitosolTickets: AchievementsBase & {
    addresses: (string | null)[];
    ticketsCount: (number | null)[];
    totalTickets: number | null;
    usernames: (string | null)[];
    reward: number | null;
    rewardToken: string | null;
  };
};

export type TradingCompetitionLeaderboardAPI = {
  [key: string]: {
    rank: number;
    username: string;
    connected?: boolean;
    volume: number | null;
    pnl: number | null;
    adxRewards: number;
    jtoRewards: number;
    badge: 'Diamond' | 'Gold' | 'Silver' | 'Bronze' | 'Iron';
  }[];
};

export type TraderDivisionRawAPI = {
  division: string;
  traders: {
    address: string;
    total_volume: number;
    total_pnl: number;
    rank_in_division: number;
    adx_reward: number;
    jto_reward: number;
    badge: 'Diamond' | 'Gold' | 'Silver' | 'Bronze' | 'Iron';
  }[];
};

export type ConnectedWalletTickets = {
  fees: number | null;
  jito: number | null;
} | null;

export type LeaderboardReturnTypeAPI<
  T extends {
    showGlobalStats?: boolean;
    showAchievements?: boolean;
    showTraderDivisions?: boolean;
    showEligibleJitosolWallets?: boolean;
  },
> = {
  startDate: string;
  endDate: string;
  rankedRewards: RankedRewards[];
} & (T['showGlobalStats'] extends true
  ? {
      globalStats: {
        totalTraders: number;
        totalVolume: number | null;
        totalLiquidations: number;
        totalClosed: number;
        totalFees: number;
        totalPnl: number | null;
        totalTrades: number;
        weekStarts: string[];
        weekEnds: string[];
        weeklyTraders: (string | null)[];
        weeklyVolume: (string | null)[];
        weeklyLiquidations: (string | null)[];
        weeklyClosed: (string | null)[];
        weeklyFees: (string | null)[];
        weeklyPnl: (string | null)[];
        weeklyTrades: (string | null)[];
      };
    }
  : object) &
  (T['showAchievements'] extends true
    ? {
        achievements: {
          biggestLiquidation: {
            weekStarts: string[];
            weekEnds: string[];
            addresses: (string | null)[];
            liquidationAmounts: (string | null)[];
            reward: number | null;
            rewardToken: string | null;
          };
          feesTickets: {
            weekStarts: string[];
            weekEnds: string[];
            addresses: [string | null][];
            ticketsCount: [number][];
            totalTickets: number[];
            reward: number | null;
            rewardToken: string | null;
          };
          topDegen: {
            weekStarts: string[];
            weekEnds: string[];
            addresses: (string | null)[];
            pnlAmounts: (string | null)[];
            reward: number | null;
            rewardToken: string | null;
          };
          jitosolTickets: {
            weekStarts: string[];
            weekEnds: string[];
            addresses: [string | null][];
            ticketsCount: [number][];
            totalTickets: number[];
            reward: number | null;
            rewardToken: string | null;
          };
        };
      }
    : object) &
  (T['showTraderDivisions'] extends true
    ? {
        traderDivisions: {
          division: string;
          traders: {
            address: string;
            totalVolume: number | null;
            totalPnl: number | null;
            rankInDivision: number;
            adxReward: number;
            jtoReward: number;
            badge: 'Diamond' | 'Gold' | 'Silver' | 'Bronze' | 'Iron';
          }[];
        }[];
      }
    : object) &
  (T['showEligibleJitosolWallets'] extends true
    ? {
        eligibleJitosolWallets: string[];
      }
    : object);

export type RankedRewards = {
  division: string;
  adxRewards: number[];
  jtoRewards: number[];
};

export type UserStats = {
  username: string | null;
  division: keyof TradingCompetitionLeaderboardAPI;
  volume: number;
  pnl: number;
  rank: number;
  adxRewards: number;
  jtoRewards: number;
  badge: string;
};

export type TradingViewChartSavedDrawing = Record<
  TokenSymbol,
  {
    name: Exclude<
      SupportedLineTools,
      'cursor' | 'dot' | 'arrow_cursor' | 'eraser' | 'measure' | 'zoom'
    >;
    points: { time: number; price: number }[];
    options: CreateShapeOptions<object>;
  }[]
>;
export interface PositionActivityRawAPi {
  date_day: Date;
  total_entry_size: number;
  total_exit_size: number;
  entry_count: number;
  exit_count: number;
  total_entry_pnl: number;
  total_exit_pnl: number;
  total_volume: number;
  total_increase_size: number;
  increase_count: number;
  total_fees: number;
  total_exit_fees: number;
}

export type PositionStatsRawApi = {
  side: 'long' | 'short';
  symbol: string;
  count_positions: number;
  total_pnl: number;
  average_pnl: number;
  min_pnl: number;
  max_pnl: number;
  total_volume: number;
  average_volume: number;
  min_volume: number;
  max_volume: number;
};

export type GetPositionStatsReturnType<
  T extends { showPositionActivity?: boolean },
> = {
  startDate: string;
  endDate: string;
  positionStats: {
    side: string;
    symbol: string;
    countPositions: number;
    totalPnl: number;
    averagePnl: number;
    minPnl: number;
    maxPnl: number;
    totalVolume: number;
    averageVolume: number;
    minVolume: number;
    maxVolume: number;
  }[];
} & (T['showPositionActivity'] extends true
  ? {
      positionActivity: {
        dateDay: string;
        totalEntrySize: number;
        totalExitSize: number;
        entryCount: number;
        exitCount: number;
        totalEntryPnl: number;
        totalExitPnl: number;
        totalVolume: number;
        totalIncreaseSize: number;
        increaseCount: number;
        totalFees: number;
        totalExitFees: number;
      }[];
    }
  : object);
