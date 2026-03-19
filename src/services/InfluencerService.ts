export const fetchInfluencers = async (category: string) => {

  const response = await fetch(
    `http://localhost:5000/api/influencers/recommend?category=${category}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch influencers");
  }

  return response.json();
};