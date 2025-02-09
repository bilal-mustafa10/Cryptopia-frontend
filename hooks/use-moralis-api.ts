"use client";

import axios from "axios";

const BASE_URL = "https://deep-index.moralis.io/api/v2.2";
// Use a NEXT_PUBLIC_ environment variable so that the API key is available in the client bundle.
// (Be cautious exposing API keys in client code!)
const API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY;

const headers = {
  accept: "application/json",
  "X-API-Key": API_KEY,
};

/**
 * Mapping between chain names and their corresponding hex values.
 */
const CHAIN_HEX_MAP: Record<string, string> = {
  eth: "0x1",
  polygon: "0x89",
  bsc: "0x38",
  avalanche: "0xa86a",
  fantom: "0xfa",
  palm: "0x2a15c308d",
  cronos: "0x19",
  arbitrum: "0xa4b1",
  chiliz: "0x15b38",
  gnosis: "0x64",
  base: "0x2105",
  optimism: "0xa",
  linea: "0xe708",
  moonbeam: "0x504",
  moonriver: "0x505",
  flow: "0x2eb",
  ronin: "0x7e4",
  lisk: "0x46f",
  pulse: "0x171",
};

/**
 * Helper that takes a chain string (e.g. "eth") and returns its hex equivalent
 * (e.g. "0x1"). If no matching hex value is found, the original value is returned.
 */
const getChainHex = (chain: string): string => {
  return CHAIN_HEX_MAP[chain.toLowerCase()] || chain;
};

/**
 * A generic function that makes a request to the Moralis API.
 *
 * @param endpoint - The API endpoint (without BASE_URL)
 * @param options - Optional parameters including query params, HTTP method and JSON payload.
 * @returns The API response data.
 */
const makeRequest = async (
  endpoint: string,
  options?: {
    params?: Record<string, any>;
    method?: "GET" | "POST";
    jsonData?: Record<string, any>;
  }
): Promise<any> => {
  const url = `${BASE_URL}/${endpoint}`;
  const method = options?.method || "GET";
  try {
    const response = await axios.request({
      url,
      method,
      headers,
      params: options?.params,
      data: options?.jsonData,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

/**
 * A hook that returns functions for fetching various wallet data from Moralis.
 *
 * Each function automatically converts the chain value to its matching hex value.
 */
export const useWalletData = () => {
  // Fetch wallet transaction history.
  const fetchWalletHistory = async (
    address: string,
    chain: string = "eth",
    order: string = "DESC"
  ) => {
    const chainParam = getChainHex(chain);
    const endpoint = `wallets/${address}/history`;
    const params = { chain: chainParam, order };
    return await makeRequest(endpoint, { params });
  };

  // Fetch wallet balance.
  const fetchWalletBalance = async (address: string, chain: string = "eth") => {
    const chainParam = getChainHex(chain);
    // Note: The endpoint format for balance uses the address as the first part of the URL.
    const endpoint = `${address}/balance`;
    const params = { chain: chainParam };
    return await makeRequest(endpoint, { params });
  };

  // Fetch NFT transfers for the given address.
  const fetchNFTTransfers = async (
    address: string,
    chain: string = "eth",
    format: string = "decimal"
  ) => {
    const chainParam = getChainHex(chain);
    const endpoint = `${address}/nft/transfers`;
    const params = { chain: chainParam, format };
    return await makeRequest(endpoint, { params });
  };

  // Fetch ERC20 token transfers for the given address.
  const fetchTokenTransfers = async (
    address: string,
    chain: string = "eth",
    order: string = "DESC"
  ) => {
    const chainParam = getChainHex(chain);
    const endpoint = `${address}/erc20/transfers`;
    const params = { chain: chainParam, order };
    return await makeRequest(endpoint, { params });
  };

  // Fetch NFT trading history for a wallet.
  const fetchWalletNFTTrades = async (address: string, chain: string = "eth") => {
    const chainParam = getChainHex(chain);
    const endpoint = `wallets/${address}/nfts/trades`;
    const params = { chain: chainParam };
    return await makeRequest(endpoint, { params });
  };

  // Fetch tokens owned by a wallet.
  const fetchWalletTokens = async (address: string, chain: string = "eth") => {
    const chainParam = getChainHex(chain);
    const endpoint = `wallets/${address}/tokens`;
    const params = { chain: chainParam };
    return await makeRequest(endpoint, { params });
  };

  // Fetch DeFi positions for a wallet.
  const fetchDefiPositions = async (address: string, chain: string = "eth") => {
    const chainParam = getChainHex(chain);
    const endpoint = `wallets/${address}/defi/positions`;
    const params = { chain: chainParam };
    return await makeRequest(endpoint, { params });
  };

  // Fetch the price for a specific ERC20 token.
  const fetchTokenPrice = async (
    token_address: string,
    chain: string = "eth",
    include_percent_change: boolean = true
  ) => {
    const chainParam = getChainHex(chain);
    const endpoint = `erc20/${token_address}/price`;
    const params: Record<string, any> = { chain: chainParam };
    if (include_percent_change) {
      params.include = "percent_change";
    }
    return await makeRequest(endpoint, { params });
  };

  // Fetch prices for multiple tokens in one request.
  const fetchBatchTokenPrices = async (
    tokens: Array<{ token_address: string }>,
    chain: string = "eth"
  ) => {
    const chainParam = getChainHex(chain);
    const endpoint = "erc20/prices";
    const params = { chain: chainParam };
    const jsonData = { tokens };
    return await makeRequest(endpoint, { params, method: "POST", jsonData });
  };

  // Fetch OHLCV data for a trading pair.
  const fetchPairOHLCV = async (
    pair_address: string,
    chain: string = "eth",
    timeframe: string = "1h",
    currency: string = "usd",
    from_date: string,
    to_date: string
  ) => {
    const chainParam = getChainHex(chain);
    const endpoint = `pairs/${pair_address}/ohlcv`;
    const params = {
      chain: chainParam,
      timeframe,
      currency,
      fromDate: from_date,
      toDate: to_date,
    };
    return await makeRequest(endpoint, { params });
  };

  // Fetch the net worth of a wallet.
  const fetchWalletNetWorth = async (
    address: string,
    exclude_spam: boolean = true,
    exclude_unverified_contracts: boolean = true
  ) => {
    const endpoint = `wallets/${address}/net-worth`;
    const params = {
      exclude_spam: String(exclude_spam).toLowerCase(),
      exclude_unverified_contracts: String(exclude_unverified_contracts).toLowerCase(),
    };
    return await makeRequest(endpoint, { params });
  };

  // Fetch wallet statistics.
  const fetchWalletStats = async (address: string, chain: string = "eth") => {
    const chainParam = getChainHex(chain);
    const endpoint = `wallets/${address}/stats`;
    const params = { chain: chainParam };
    return await makeRequest(endpoint, { params });
  };

  // Resolve an ENS domain to an address.
  const resolveENSDomain = async (domain: string) => {
    const endpoint = `resolve/ens/${domain}`;
    return await makeRequest(endpoint);
  };

  // Resolve an address to its ENS domain.
  const resolveAddressToDomain = async (address: string) => {
    const endpoint = `resolve/${address}/reverse`;
    return await makeRequest(endpoint);
  };

  return {
    fetchWalletHistory,
    fetchWalletBalance,
    fetchNFTTransfers,
    fetchTokenTransfers,
    fetchWalletNFTTrades,
    fetchWalletTokens,
    fetchDefiPositions,
    fetchTokenPrice,
    fetchBatchTokenPrices,
    fetchPairOHLCV,
    fetchWalletNetWorth,
    fetchWalletStats,
    resolveENSDomain,
    resolveAddressToDomain,
  };
};
