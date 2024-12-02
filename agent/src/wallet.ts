import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import dotenv from "dotenv";

interface WalletInfo {
  walletId: string;
  address: string;
  network: string;
}

interface BalanceInfo {
  asset: string;
  balance: number;
  address: string;
}

interface TradeResult {
  tradeId: string;
  fromAsset: string;
  toAsset: string;
  amount: number;
  status: string;
}

interface WebhookInfo {
  webhookId: string;
  callbackUrl: string;
  status: string;
}

export class MPCWallet {
  private wallet: Wallet | null = null;
  private coinbase: Coinbase | null = null;

  constructor() {
    this.setupCDP();
  }

  private setupCDP(): void {
    dotenv.config();
    const apiKeyName = process.env.CDP_API_KEY_NAME;
    const privateKey = process.env.CDP_API_KEY_PRIVATE;

    if (!apiKeyName || !privateKey) {
      throw new Error("CDP API credentials not found in environment variables");
    }

    this.coinbase = new Coinbase({
      apiKeyName,
      privateKey: privateKey.replaceAll("\\n", "\n"),
    });
  }

  async createWallet(network: string = "base-sepolia"): Promise<WalletInfo> {
    try {
      this.wallet = await Wallet.create();
      const defaultAddress = await this.wallet.getDefaultAddress().toString();

      // Save wallet data securely
      const seedFile = await this.wallet.export();
      // In production, use proper secure storage
      // For now, we'll just log it
      console.log("Wallet seed:", seedFile);

      return {
        walletId: this.wallet.getId()!,
        address: defaultAddress,
        network,
      };
    } catch (err) {
      throw new Error(`Failed to create wallet: ${err}`);
    }
  }

  async getWalletInfo(): Promise<WalletInfo> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }

    const defaultAddress = await this.wallet.getDefaultAddress();
    return {
      walletId: this.wallet.getId()!,
      address: defaultAddress.toString(),
      network: "base-sepolia",
    };
  }

  async getBalance(asset: string = "eth"): Promise<BalanceInfo> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }

    try {
      const balance = await this.wallet.getBalance(asset);
      const defaultAddress = await this.wallet.getDefaultAddress().toString();

      return {
        asset,
        balance: balance.toNumber(),
        address: defaultAddress,
      };
    } catch (err) {
      throw new Error(`Failed to get balance: ${err}`);
    }
  }

  async executeTrade(
    amount: number,
    fromAsset: string,
    toAsset: string,
    gasless: boolean = true
  ): Promise<TradeResult> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }

    try {
      const trade = await this.wallet.createTrade({
        amount,
        fromAssetId: fromAsset,
        toAssetId: toAsset
      });

      await trade.wait();

      return {
        tradeId: trade.getId(),
        fromAsset,
        toAsset,
        amount,
        status: trade.getStatus()!,
      };
    } catch (err) {
      throw new Error(`Failed to execute trade: ${err}`);
    }
  }

  async loadExistingWallet(
    walletId: string,
    seed: string
  ): Promise<WalletInfo> {
    try {
      this.wallet = await Wallet.import({ seed, walletId });
      await this.wallet.listAddresses();
      return this.getWalletInfo();
    } catch (err) {
      throw new Error(`Failed to load wallet: ${err}`);
    }
  }
}
