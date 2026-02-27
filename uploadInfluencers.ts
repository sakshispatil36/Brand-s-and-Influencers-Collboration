import admin from "firebase-admin";
import csv from "csvtojson";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

const categories = [
  "Food",
  "Fashion",
  "Travel",
  "Tech",
  "Fitness",
  "Beauty",
  "Lifestyle",
];

function getRandomCategory() {
  return categories[Math.floor(Math.random() * categories.length)];
}

function convertFollowers(value: string): number {
  if (!value) return 0;

  const v = value.toLowerCase().trim();

  if (v.endsWith("k")) return parseFloat(v) * 1000;
  if (v.endsWith("m")) return parseFloat(v) * 1000000;

  return Number(v) || 0;
}

async function uploadData() {
  const jsonArray = await csv().fromFile("./top_insta_influencers_data.csv");
  console.log("FIRST ROW:", jsonArray[0]);

for (const item of jsonArray) {
 
const rawEngagement = item.engagementRate;
const engagementRate = rawEngagement
  ? parseFloat(String(rawEngagement).replace("%", "").trim())
  : 0;

    await db.collection("influencers").add({
    name: item.channel_info || "Unknown",
    rank: Number(item.rank) || 0,
    influenceScore: Number(item.influence_score) || 0,
    followers: convertFollowers(item.followers),
    engagementRate: engagementRate,
    City: item.City || "Unknown",
    category: [getRandomCategory()],
    bio: `Creator in ${getRandomCategory()} niche`,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
    console.log("Saving:", item.channel_info, item.followers);
    console.log("Headers:", Object.keys(jsonArray[0]));
  }
  

  console.log("✅ Upload completed!");
}


uploadData();