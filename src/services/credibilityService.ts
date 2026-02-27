export const calculateCredibility = (followers: number) => {
  let status: "Trusted" | "Normal" | "Suspicious";
  let score = 0;

  if (followers < 50000) {
    status = "Suspicious";
    score = 40;
  } 
  else if (followers < 100000) {
    status = "Normal";
    score = 70;
  } 
  else {
    status = "Trusted";
    score = 90;
  }

  return {
    credibilityScore: score,
    status,
    suspicious: status === "Suspicious",
  };
};