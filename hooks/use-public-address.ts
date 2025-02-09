import { useState, useCallback } from "react";
import { publicAddressService, PublicAddressResponse } from "@/services/public-address-service";

export function usePublicAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicAddress, setPublicAddress] = useState<string | null>(null);

  const fetchPublicAddress = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data: PublicAddressResponse = await publicAddressService.fetchPublicAddress();
      setPublicAddress(data.publicAddress);
      return data;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { publicAddress, loading, error, fetchPublicAddress };
}

