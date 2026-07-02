import { keyRotationService } from "@/server/services/key-rotation.service";

interface ProviderPayload {
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export class ProviderClient {
  /**
   * Executes a request against an AI Provider, securely injecting the rotated API key.
   * If the provider returns a 429 Rate Limit error, this automatically marks the key
   * as exhausted and retries with the next available key.
   */
  async executeWithFailover(
    providerName: string, 
    modelName: string, 
    payload: ProviderPayload,
    maxRetries: number = 3
  ): Promise<any> {
    let attempts = 0;
    let lastError: any = null;

    while (attempts < maxRetries) {
      attempts++;
      
      // 1. Get an available key
      const keyData = await keyRotationService.getAvailableKey(providerName, modelName);
      
      // 2. Inject the key into the headers (assuming Bearer token standard)
      const headers = {
        "Content-Type": "application/json",
        ...payload.headers,
        "Authorization": `Bearer ${keyData.key}`
      };

      // Special case for Gemini which uses x-goog-api-key or URL params
      let finalEndpoint = payload.endpoint;
      if (providerName.toLowerCase() === "gemini") {
        delete (headers as any)["Authorization"];
        finalEndpoint = payload.endpoint.includes('?') 
          ? `${payload.endpoint}&key=${keyData.key}` 
          : `${payload.endpoint}?key=${keyData.key}`;
      } else if (providerName.toLowerCase() === "anthropic") {
        delete (headers as any)["Authorization"];
        (headers as any)["x-api-key"] = keyData.key;
      }

      const startTime = Date.now();
      
      try {
        // 3. Make the Request
        const response = await fetch(finalEndpoint, {
          method: payload.method || "POST",
          headers,
          body: payload.body ? JSON.stringify(payload.body) : undefined
        });

        // 4. Handle Rate Limits (429)
        if (response.status === 429) {
          const retryAfter = response.headers.get("retry-after");
          const duration = retryAfter && parseInt(retryAfter) > 60 ? "HOUR" : "MINUTE";
          
          await keyRotationService.reportKeyExhausted(keyData.keyId, duration as any);
          lastError = new Error(`Rate limit exceeded on key ${keyData.keyId}`);
          continue; // Instantly failover to the next key
        }

        if (!response.ok) {
          const errData = await response.text();
          throw new Error(`Provider API Error: ${response.status} ${errData}`);
        }

        const data = await response.json();
        
        // 5. Record Successful Usage (Mocking token math for now)
        const tokensIn = data.usage?.prompt_tokens || 0;
        const tokensOut = data.usage?.completion_tokens || 0;
        const cost = 0; // Requires actual cost math from ProviderModel

        await keyRotationService.recordUsage({
          keyId: keyData.keyId,
          providerId: keyData.providerId,
          modelId: keyData.modelId,
          tokensIn,
          tokensOut,
          cost,
          requestTimeMs: Date.now() - startTime
        });

        return data;

      } catch (error: any) {
        lastError = error;
        // If it's a network timeout, we might want to failover. Otherwise throw.
        if (error.name === "AbortError" || error.message.includes("fetch")) {
          // Timeout or DNS error, mark as temporarily broken and retry
          await keyRotationService.reportKeyExhausted(keyData.keyId, "MINUTE");
          continue;
        }
        
        // Other errors (like 400 Bad Request) shouldn't cause a failover because the key is fine, the prompt is bad.
        await keyRotationService.recordUsage({
          keyId: keyData.keyId,
          providerId: keyData.providerId,
          modelId: keyData.modelId,
          tokensIn: 0,
          tokensOut: 0,
          cost: 0,
          requestTimeMs: Date.now() - startTime,
          isError: true
        });
        throw error;
      }
    }

    throw new Error(`Failed to execute provider request after ${maxRetries} failover attempts. Last error: ${lastError?.message}`);
  }
}

export const providerClient = new ProviderClient();
