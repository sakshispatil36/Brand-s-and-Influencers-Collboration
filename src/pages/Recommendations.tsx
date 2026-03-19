import { useEffect, useState } from "react";
import { fetchInfluencers } from "../services/InfluencerService";
import InfluencerCard from "../components/ui/InfluencerCard";

interface Influencer {
  name: string;
  channelId: string;
  description: string;
  thumbnail: string;
  youtubeUrl: string;
}

export default function Recommendations() {

  const [influencers, setInfluencers] = useState<Influencer[]>([]);

  useEffect(() => {

    const loadInfluencers = async () => {
      try {
        const data = await fetchInfluencers("fitness");
        setInfluencers(data.influencers);
      } catch (error) {
        console.error("Error fetching influencers:", error);
      }
    };

    loadInfluencers();

  }, []);

  return (
    <div className="grid grid-cols-3 gap-6">

      {influencers.map((inf) => (
        <InfluencerCard key={inf.channelId} influencer={inf} />
      ))}

    </div>
  );
}