# Adrena Client

JavaScript/TypeScript client library for interacting with the Adrena Protocol.

## Installation

```bash
npm install adrena-client
# or
yarn add adrena-client
```

## Usage

### Initialization

To start using the Adrena client, you first need to initialize it:

```typescript
import { AdrenaClient } from 'adrena-client';

// Initialize the client
const client = await AdrenaClient.initialize(
  wallet, // Wallet instance
  process.env.SOLANA_RPC_URL // RPC URL
);
```

### Loading User Positions

To fetch user positions:

```typescript
const positions = await client.loadUserPositions(
  new PublicKey(userAddress),
  positionAddresses?.map((address) => new PublicKey(address))
);
```

### Trading Operations

#### Opening Long Position

To open a long position with swap:

```typescript
const result = await client.openOrIncreasePositionWithSwapLong({
  owner: publicKey, // Owner's public key
  collateralMint: collateralToken.mint, // Collateral token mint
  mint: targetToken.mint, // Target token mint
  price: new BN(entryPrice), // Entry price
  collateralAmount: new BN(collateralAmount), // Collateral amount
  leverage: leverageValue, // Leverage value
  notification: {}, // Notification config
  referrer: referrerAddress // Optional referrer address
});
```

#### Opening Short Position

To open a short position with swap:

```typescript
const result = await client.openOrIncreasePositionWithSwapShort({
  owner: publicKey,
  collateralMint: collateralToken.mint,
  mint: targetToken.mint,
  price: new BN(entryPrice),
  collateralAmount: new BN(collateralAmount),
  leverage: leverageValue,
  notification: {},
  referrer: referrerAddress
});
```

#### Closing Positions

To close a long position:

```typescript
const result = await client.closePositionLong({
  position: positionData,
  price: exitPrice,
  notification: {}
});
```

To close a short position:

```typescript
const result = await client.closePositionShort({
  position: positionData,
  price: exitPrice,
  notification: {}
});
```

### Position Management

#### Adding Collateral

To add collateral to an existing position:

```typescript
const result = await client.addCollateralToPosition({
  position: positionData,
  addedCollateral: new BN(collateralAmount),
  notification: {}
});
```

### User Profile Management

#### Initialize User Profile

```typescript
const result = await client.initUserProfile({
  nickname: "trader_name",
  notification: {}
});
```

#### Edit User Profile

```typescript
const result = await client.editUserProfile({
  nickname: "new_trader_name",
  notification: {}
});
```

### Staking Operations

#### Get Staking Statistics

```typescript
const stakingStats = await client.getStakingStats();
```

#### Get User Staking Account

```typescript
const userStaking = await client.getUserStakingAccount({
  owner: publicKey,
  stakedTokenMint: tokenMint
});
```

### Liquidity Operations

#### Add Genesis Liquidity

```typescript
const result = await client.addGenesisLiquidity({
  amountIn: liquidityAmount,
  minLpAmountOut: new BN(minLpAmount),
  notification: {}
});
```

#### Get Add Liquidity Amount and Fee

```typescript
const result = await client.getAddLiquidityAmountAndFee({
  amountIn: new BN(amount),
  token: tokenData
});
```

## Features

- TypeScript support
- Solana Web3.js integration
- Anchor Program support
- Complete transaction management
- Notification system integration
- Position management
- User profile system
- Staking operations
- Liquidity management

## License

MIT 