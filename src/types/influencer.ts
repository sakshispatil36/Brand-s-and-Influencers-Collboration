export interface Influencer {
  id: string;
  name: string;
  followers: number;
  followersCount: string;
  category: string[];
  bio?: string;
  location: string;
  engagementRate: number;

  rank?: number;
  influenceScore?: number;
  City?: string;

  credibilityScore?: number;
  suspicious?: boolean;
  status?: "Trusted" | "Normal" | "Suspicious";
  matchScore?: number;
}