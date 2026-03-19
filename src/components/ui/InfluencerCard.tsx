interface Influencer {
  name: string;
  channelId: string;
  description: string;
  thumbnail: string;
  youtubeUrl: string;
}

interface Props {
  influencer: Influencer;
}

export default function InfluencerCard({ influencer }: Props) {

  const instagramLink = `https://instagram.com/${influencer.name.replace(/\s/g,"")}`;

  return (
    <div className="border p-4 rounded-lg shadow-md">

      <img src={influencer.thumbnail} alt="thumbnail" />

      <h3>{influencer.name}</h3>

      <a href={influencer.youtubeUrl} target="_blank" rel="noopener noreferrer">
        View YouTube
      </a>

      <br />

      <a href={instagramLink} target="_blank" rel="noopener noreferrer">
        Contact on Instagram
      </a>

      <br />

      <a href={`mailto:contact@${influencer.name}.com`}>
        Send Email
      </a>

    </div>
  );
}