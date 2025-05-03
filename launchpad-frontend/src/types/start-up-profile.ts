export type MarketSize = "small" | "medium" | "large";

export interface StartUpProfile {
  _id: string;
  CompanyVision: string;
  ProductDescription: string;
  MarketSize: MarketSize;
  BusinessModel: string;
  pitchPdf: string; // This will be a Cloudinary URL
}

export type StartUpProfilePayload = Omit<StartUpProfile, "_id">;
