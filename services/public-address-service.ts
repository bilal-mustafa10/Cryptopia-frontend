export interface PublicAddressResponse {
  publicAddress: string;
}

export const publicAddressService = {
  async fetchPublicAddress(): Promise<PublicAddressResponse> {
    try {
      const res = await fetch("/api/wallet/public_address", {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch public address.");
      }

      return await res.json();
    } catch (error: any) {
      throw new Error(error.message || "An unknown error occurred.");
    }
  },
};
