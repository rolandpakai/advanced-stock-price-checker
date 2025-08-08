import { DefaultApi } from "finnhub-ts";

if (!process.env.FINNHUB_API_KEY) {
  throw new Error("Missing FINNHUB_API_KEY in environment variables");
}

const finnhubClient = new DefaultApi({
  apiKey: process.env.FINNHUB_API_KEY,
  isJsonMime: (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  },
});

export default finnhubClient;