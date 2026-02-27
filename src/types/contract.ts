export interface Contract {
  id: string;
  campaignTitle: string;
  influencerId: string;
  status: "generated" | "signed";
  signatureFile: File | null;
}