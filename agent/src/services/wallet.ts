import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import { Transaction } from '../types';
import { ethers } from "ethers";
import { abi as IUniswapV2PairABI } from "@uniswap/v2-core/build/IUniswapV2Pair.json";

interface WalletBalance {
  total: number;
  available: number;
  currency: string;
}

export class WalletService {
  private coinbase: Coinbase;
  private wallet: Wallet | null = null;

  constructor(apiKeyName: string, privateKey: string) {
    this.coinbase = new Coinbase({
      apiKeyName,
      privateKey: privateKey.replaceAll("\\n", "\n"),
    });
  }

  async walletAddress(): Promise<string> {
    if (!this.wallet) {
      console.error("Wallet not initialized");
      return "";
    }

    const address = await this.wallet.getDefaultAddress();
    const addressString = address.toString();

    return addressString;
  }

  async initialize(): Promise<string> {
    try {
      // Create or import existing wallet
      if (process.env.WALLET_DATA) {
        const seedFile = JSON.parse(process.env.WALLET_DATA);
        const walletIds = Object.keys(seedFile);
        const walletId = walletIds[0];
        const seed = seedFile[walletId]?.seed;
        this.wallet = await Wallet.import({ seed, walletId });
      } else {
        this.wallet = await Wallet.create();
      }

      // Fund wallet if needed
      try {
        await this.wallet.faucet();
      } catch (e) {
        console.log("Faucet not available or already funded");
      }

      return (await this.wallet.getDefaultAddress()).getId();
    } catch (error) {
      console.error("Failed to initialize wallet:", error);
      throw error;
    }
  }

  async executeTransaction(transaction: Transaction): Promise<string> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }

    try {
      const transfer = await this.wallet.createTransfer({
        amount: Number(transaction.amount),
        assetId: transaction.type === "BUY" ? "eth" : transaction.tokenAddress,
        destination:
          transaction.type === "BUY" ? transaction.tokenAddress : "eth",
      });

      await transfer.wait();
      const hash = transfer.getTransactionHash();

      if (!hash) {
        throw new Error("Transaction failed - no hash returned");
      }

      return hash;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  }

  async getBalance(): Promise<WalletBalance> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }

    try {
      const balances = await this.wallet.getBalance("eth");

      if (!balances) {
        throw new Error("ETH balance not found");
      }

      return {
        total: balances.toNumber(),
        available: balances.toNumber(),
        currency: "ETH",
      };
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      throw error;
    }
  }

  async validateLiquidity(
    tokenAddress: string,
    amount: string
  ): Promise<boolean> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }

    try {
      const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
      const pairContract = new ethers.Contract(
        tokenAddress,
        IUniswapV2PairABI,
        provider
      );

      const [reserve0, reserve1] = await pairContract.getReserves();
      const token0 = await pairContract.token0();
      const price =
        token0.toLowerCase() === tokenAddress.toLowerCase()
          ? reserve1 / reserve0
          : reserve0 / reserve1;

      const liquidityUSD = reserve0.mul(price).toNumber();

      // Check if pool has enough liquidity
      const minLiquidity = parseFloat(process.env.MIN_LIQUIDITY || "1000");
      if (liquidityUSD < minLiquidity) {
        return false;
      }

      const maxImpact = parseFloat(process.env.MAX_PRICE_IMPACT || "0.01");
      const tradeAmount = parseFloat(amount);
      if (tradeAmount / liquidityUSD > maxImpact) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Failed to validate liquidity:", error);
      return false;
    }
  }
} 