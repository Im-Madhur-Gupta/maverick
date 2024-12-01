import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import { Transaction } from '../types';

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

      return await this.wallet.getDefaultAddress();
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      throw error;
    }
  }

  async executeTransaction(transaction: Transaction): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }

    try {
      const transfer = await this.wallet.createTransfer({
        amount: transaction.amount,
        assetId: transaction.type === 'BUY' ? 'eth' : transaction.tokenAddress,
        destination: transaction.type === 'BUY' ? transaction.tokenAddress : 'eth',
      });

      await transfer.wait();
      const hash = transfer.getTransactionHash();
      
      if (!hash) {
        throw new Error('Transaction failed - no hash returned');
      }

      return hash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  async getBalance(): Promise<WalletBalance> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }

    try {
      const balances = await this.wallet.balances();
      const ethBalance = balances.find(b => b.assetId === 'eth');
      
      if (!ethBalance) {
        throw new Error('ETH balance not found');
      }

      return {
        total: parseFloat(ethBalance.amount),
        available: parseFloat(ethBalance.availableAmount),
        currency: 'ETH'
      };
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      throw error;
    }
  }

  async validateLiquidity(tokenAddress: string, amount: string): Promise<boolean> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }

    try {
      // Get pool info from DEX
      const poolInfo = await this.wallet.getPoolInfo(tokenAddress);
      
      // Check if pool has enough liquidity
      const minLiquidity = parseFloat(process.env.MIN_LIQUIDITY || '1000'); // $1000 default
      if (poolInfo.liquidityUSD < minLiquidity) {
        return false;
      }

      // Check if trade amount is less than X% of pool liquidity
      const maxImpact = parseFloat(process.env.MAX_PRICE_IMPACT || '0.01'); // 1% default
      const tradeAmount = parseFloat(amount);
      if (tradeAmount / poolInfo.liquidityUSD > maxImpact) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to validate liquidity:', error);
      return false;
    }
  }
} 