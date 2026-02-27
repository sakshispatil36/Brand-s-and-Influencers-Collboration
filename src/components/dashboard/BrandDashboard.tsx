import { useEffect, useState, useCallback } from "react";
import { db, auth } from "@/integrations/firebase/client";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  orderBy,
  limit
  //orderBy
} from "firebase/firestore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, UserPlus, Trash2 } from "lucide-react";
import  CreateCampaignDialog  from "./CreateCampaignDialog";
import  CampaignApplications  from "./CampaignApplications";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import { useToast } from "@/hooks/use-toast";
import ProfileSettings from "./ProfileSettings";
// import { getRecommendedInfluencers } from "../../services/recommendationservice";
import { Influencer } from "../../types/influencer";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { calculateCredibility } from "@/services/credibilityService";

/* ===================== TYPES ===================== */

export interface Campaign {
  id: string;
  brand_name?: string;
  title?: string;
  description?: string;
  budget?: number;
  status?: string;
  applicationsCount: number;
  campaign_applications?: { id: string }[];
}

interface PublicInfluencer {
  id: string;
  full_name?: string;
  bio?: string;
  // category: string[];
  // followers: number;
  company_name?: string;
  engagementRate?: number;
}

/* ===================== COMPONENT ===================== */

const BrandDashboard = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [influencers, setInfluencers] = useState<PublicInfluencer[]>([]);
    // const [recommended, setRecommended] = useState<Influencer[]>([]);
    // const [showSearch, setShowSearch] = useState(false);
    // const [searchCategory, setSearchCategory] = useState("");
    const [recommendedInfluencers, setRecommendedInfluencers] = useState<Influencer[]>([]);
    const [totalApplications, setTotalApplications] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
    const [pendingCount, setPendingCount] = useState(0);
    const [approvedCount, setApprovedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    const [trustedCount, setTrustedCount] = useState(0);
    const [normalCount, setNormalCount] = useState(0);
    const [suspiciousCount, setSuspiciousCount] = useState(0);
    const applicationChartData = [
      { name: "Pending", count: pendingCount },
      { name: "Approved", count: approvedCount },
      { name: "Rejected", count: rejectedCount },
    ];
    const engagementChartData = [
      { name: "Trusted", value: trustedCount },
      { name: "Normal", value: normalCount },
      { name: "Suspicious", value: suspiciousCount },
    ];
    const [averageEngagement, setAverageEngagement] = useState(0);
      const { toast } = useToast();

  /* ===================== FETCH DATA ===================== */

  const fetchData = useCallback(async () => {
  const user = auth.currentUser;
  if (!user) return;
  const brandId = user.uid;
  console.log("brandId:", brandId);

  try {
    /* ---------- CAMPAIGNS ---------- */
    const campaignsQuery = query(
      collection(db, "campaigns"),
      where("brand_id", "==", brandId)
    );

    const campaignsSnap = await getDocs(campaignsQuery);
    console.log("Campaign docs:", campaignsSnap.docs.map(d => d.data()));
    const campaignsData: Campaign[] = await Promise.all(
      campaignsSnap.docs.map(async (docSnap) => {
        const data = docSnap.data();
        let applicationsCount = 0;
        try{
        const applicationsQuery = query(
            collection(db, "campaign_applications"),
            where("campaign_id", "==", docSnap.id),
            //orderBy("applied_at", "desc")
          );

          const countSnap = await getCountFromServer(applicationsQuery);
          applicationsCount = countSnap.data().count;
            } catch (err) {
              console.warn(`Failed to fetch applications count for campaign ${docSnap.id}`, err);
              applicationsCount = 0; 
            }
        return {
          id: docSnap.id,
          brand_name: data.brand_name,   
          title: data.title,
          description: data.description,
          budget: data.budget,
          status: data.status,
          applicationsCount,
        };
      })
    );

    setCampaigns(campaignsData);

    setTotalApplications(
      campaignsData.reduce((sum, c) => sum + c.applicationsCount, 0)
    );

    /* ---------- INFLUENCERS ---------- */
    const influencersQuery = query(
      collection(db, "profiles"),
      where("user_type", "==", "influencer")
    );

    const influencersSnap = await getDocs(influencersQuery);

    const influencersData: PublicInfluencer[] = influencersSnap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        full_name: data.full_name ?? "",
        bio: data.bio ?? "",
        company_name: data.company_name ?? "",
        engagementRate: data.engagementRate ?? 0,
      };
    });

    setInfluencers(influencersData);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load dashboard data";
    toast({
      title: "Error",
      description: message,
    });
  }
}, [toast]);

  /* ===================== EFFECT ===================== */

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ===================== DELETE CAMPAIGN ===================== */

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await deleteDoc(doc(db, "campaigns", campaignId));
      toast({
        title: "Success",
        description: "Campaign deleted successfully!",
      });
      fetchData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Error",
        description: message,
      });
    }
  };

//   const loadRecommendations = async () => {
//   if (!searchCategory) return;

//   const data = await getRecommendedInfluencers({
//     category: searchCategory,
//     location: "Pune",
//   });

//   setRecommended(data);
// };

const loadAnalytics = async () => {
  const user = auth.currentUser;
  if (!user) return;

  /* ---------- APPLICATION STATUS BREAKDOWN ---------- */
  const appsSnap = await getDocs(collection(db, "campaign_applications"));

  let pending = 0;
  let approved = 0;
  let rejected = 0;

  appsSnap.forEach((doc) => {
    const data = doc.data();
    if (data.status === "applied") pending++;
    if (data.status === "approved") approved++;
    if (data.status === "rejected") rejected++;
  });

  setPendingCount(pending);
  setApprovedCount(approved);
  setRejectedCount(rejected);

  /* ---------- INFLUENCER CREDIBILITY ---------- */
  const infSnap = await getDocs(collection(db, "influencers"));

  let trusted = 0;
  let normal = 0;
  let suspicious = 0;
  let totalEngagement = 0;
  let totalInfluencers = 0;

  infSnap.forEach((doc) => {
    const data = doc.data();
    const engagement = Number(data.engagementRate ?? 0);

    totalEngagement += engagement;
    totalInfluencers++;

    if (engagement >= 4) trusted++;
    else if (engagement >= 2) normal++;
    else suspicious++;
  });

  setTrustedCount(trusted);
  setNormalCount(normal);
  setSuspiciousCount(suspicious);

  if (totalInfluencers > 0) {
    setAverageEngagement(
      Number((totalEngagement / totalInfluencers).toFixed(2))
    );
  }
};

useEffect(() => {
  if (activeTab === "analytics") {
    loadAnalytics();
  }
}, [activeTab]);

const loadCampaignRecommendations = async () => {
  if (!selectedCampaign) {
    toast({
      title: "Select Campaign",
      description: "Please select a campaign first",
    });
    return;
  }

  const campaignSnap = await getDoc(doc(db, "campaigns", selectedCampaign));
  if (!campaignSnap.exists()) return;

  const campaignData = campaignSnap.data();
  const category = campaignData.category;

  if (!category) {
    toast({
      title: "No Category Found",
      description: "This campaign has no category",
    });
    return;
  }

  const q = query(
    collection(db, "influencers"),
    where("category", "array-contains", category),
    orderBy("followers", "desc"),
    limit(20)
  );

  const snapshot = await getDocs(q);

const influencers: Influencer[] = snapshot.docs.map((docSnap) => {
  const data = docSnap.data();
 console.log("Full Data:", data); // 👈 ADD THIS
  console.log("Engagement:", data.engagementRate); // 👈 ADD THIS

  const followersValue = Number(data.followers ?? 0);
  const engagement = Number(data.engagementRate ?? 0);

  const credibility = calculateCredibility(followersValue);

  return {
    id: docSnap.id,
    name: data.name || "Unknown",
    followers: followersValue,
    followersCount: followersValue.toString(),
    category: data.category || [],
    location: data.City || "India",
    engagementRate: engagement,
    status: credibility.status,
    credibilityScore: credibility.credibilityScore,
    suspicious: credibility.suspicious,
    matchScore: 0,
  };
});
  setRecommendedInfluencers(influencers);
};

const formatFollowers = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(".0", "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(".0", "") + "K";
  }
  return num.toString();
};



 return (
    <>
      <Navbar />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DashboardSidebar userType="brand" activeTab={activeTab} onTabChange={setActiveTab} />

          <main className="flex-1 p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-foreground">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "campaigns" && "My Campaigns"}
                {activeTab === "influencers" && "Influencers"}
                {activeTab === "analytics" && "Analytics"}
                {activeTab === "settings" && "Settings"}
              </h1>
              {(activeTab === "campaigns" || activeTab === "dashboard") && (
                <Button onClick={() => setDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              )}
              <Button
              variant="outline"
              disabled={!selectedCampaign}
              onClick={loadCampaignRecommendations}
            >
              Show Recommendations
            </Button>
            </div>

            {activeTab === "dashboard" && (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-card-foreground">
                        Total Campaigns
                      </CardTitle>
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-card-foreground">{campaigns.length}</div>
                      <p className="text-xs text-muted-foreground">Active and closed campaigns</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-card-foreground">
                        Total Applications
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-card-foreground">
                        {totalApplications}
                      </div>
                      <p className="text-xs text-muted-foreground">Influencers interested</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-card-foreground">
                        Available Influencers
                      </CardTitle>
                      <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-card-foreground">{influencers.length}</div>
                      <p className="text-xs text-muted-foreground">Registered on platform</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
{activeTab === "campaigns" && (
              <div className="space-y-4">
                {campaigns.length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="pt-6 pb-6 flex flex-col items-center gap-4">
                      <p className="text-center text-muted-foreground">
                        No campaigns yet. Create your first campaign to get started!
                      </p>
                      <Button onClick={() => setDialogOpen(true)} size="lg">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Create Your First Campaign
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-muted-foreground">{campaigns.length} campaign(s)</p>
                      <Button onClick={() => setDialogOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Campaign
                      </Button>
                      <Button
                        variant="outline"
                        disabled={!selectedCampaign}
                        onClick={loadCampaignRecommendations}
                      >
                        Show Recommendations
                      </Button>
                    </div>
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="space-y-4">
                        <Card className="bg-card border-border">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-card-foreground">{campaign.brand_name}</CardTitle>
                                <CardDescription className="text-muted-foreground mt-2">
                                  {campaign.title}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <div className="text-sm text-muted-foreground">Budget</div>
                                  <div className="text-lg font-bold text-primary">
                                    ${Number(campaign.budget).toFixed(2)}
                                  </div>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleDeleteCampaign(campaign.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-card-foreground">{campaign.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                {campaign.applicationsCount} applications received
                              </div>
                               <div className="flex gap-2">

                              {/* ✅ SELECT CAMPAIGN BUTTON */}
                              <Button
                                size="sm"
                                variant={selectedCampaign === campaign.id ? "default" : "outline"}
                                onClick={() => setSelectedCampaign(campaign.id)}
                              >
                                {selectedCampaign === campaign.id ? "Selected" : "Select"}
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setSelectedCampaign(selectedCampaign === campaign.id ? null : campaign.id)
                                }
                              >
                                {selectedCampaign === campaign.id ? "Hide Applications" : "View Applications"}
                              </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        {selectedCampaign === campaign.id && (
                          <CampaignApplications campaignId={campaign.id} campaignTitle={campaign.title ?? ""} brandName={campaign.brand_name ?? ""} />
                        )} 
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
            {recommendedInfluencers.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
              {recommendedInfluencers.map((inf) => (
                <Card key={inf.id}>
                  <CardContent className="p-4">
                    <p className="font-medium">{inf.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Followers: {formatFollowers(inf.followers)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Category: {inf.category?.join(", ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Engagement Rate: {inf.engagementRate}%
                    </p>
                    {inf.status === "Trusted" && (
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                      🟢 Trusted Influencer
                    </span>
                  )}

                  {inf.status === "Normal" && (
                    <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
                      🟡 Normal Influencer
                    </span>
                  )}

                  {inf.status === "Suspicious" && (
                    <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                      🔴 Suspicious Influencer
                    </span>
                  )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

            {activeTab === "influencers" && (
            <>
              {/* Top bar */}
              {/* <div className="flex justify-between items-center mb-4">
                <Button onClick={() => setShowSearch(true)}>
                  Show Recommended Influencers
                </Button>
              </div>

              {/* Search section 
              {showSearch && (
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder="Enter category (food, fitness, fashion...)"
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="border px-3 py-2 rounded w-64"
                  />

                  <Button onClick={loadRecommendations}>
                    Search
                  </Button>
                </div>
              )}  */}

              {/* Recommended influencers (NOW correctly positioned) */}
              {/* {recommended.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                  {recommended.map((inf) => (
                    <Card key={inf.id} className="bg-card border-border">
                      <CardHeader>
                        <CardTitle>{inf.name}</CardTitle>
                        <CardDescription>{inf.category}</CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Followers: {inf.followersCount}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Engagement Rate: {inf.engagementRate}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Location: {inf.location}
                        </p>

                        <p className="text-sm text-muted-foreground">
                        Credibility Score: {inf.credibilityScore}/100
                      </p>

                    {inf.status === "Trusted" && (
                      <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        🟢 Trusted Influencer
                      </span>
                    )}

                    {inf.status === "Normal" && (
                      <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                        🟡 Normal Influencer
                      </span>
                    )}

                    {inf.status === "Suspicious" && (
                      <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                        🔴 Suspicious Account
                      </span>
                    )}
                    </CardContent>
                    </Card>
                    
                  ))}
                </div>
              )} */}

              {/* Existing influencer list */}
              {influencers.length === 0 ? (
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      No influencers registered yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {influencers.map((influencer) => (
                    <Card key={influencer.id} className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-card-foreground">
                          {influencer.full_name || "Unnamed"}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {influencer.company_name || "Influencer"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {influencer.bio || "No bio available"}
                        </p>
                        <div className="mt-4">
                          <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                            ID: {influencer.id.slice(0, 8)}...
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
            {/* {activeTab === "analytics" && (
  <div className="space-y-6">

    {/* Application Breakdown 
    <Card>
      <CardHeader>
        <CardTitle>Application Status Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>🟡 Pending: {pendingCount}</p>
        <p>🟢 Approved: {approvedCount}</p>
        <p>🔴 Rejected: {rejectedCount}</p>
      </CardContent>
    </Card>

    {/* Influencer Credibility Summary 
    <Card>
      <CardHeader>
        <CardTitle>Influencer Credibility Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>🟢 Trusted Influencers: {trustedCount}</p>
        <p>🟡 Normal Influencers: {normalCount}</p>
        <p>🔴 Suspicious Influencers: {suspiciousCount}</p>
      </CardContent>
    </Card>

    {/* Engagement Insights 
    <Card>
      <CardHeader>
        <CardTitle>Engagement Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <p>📊 Average Engagement Rate: {averageEngagement}%</p>
      </CardContent>
    </Card> */}

{activeTab === "analytics" && (
  <div className="space-y-6">

    {/* 📊 Application Status Chart */}
    <Card>
      <CardHeader>
        <CardTitle>Application Status Overview</CardTitle>
      </CardHeader>
      <CardContent style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={applicationChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    {/* 📈 Influencer Credibility Chart */}
    <Card>
      <CardHeader>
        <CardTitle>Influencer Credibility Distribution</CardTitle>
      </CardHeader>
      <CardContent style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={engagementChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#16a34a" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    {/* 📊 Average Engagement */}
    <Card>
      <CardHeader>
        <CardTitle>Engagement Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">
          Average Engagement Rate: {averageEngagement}%
        </p>
      </CardContent>
    </Card>

  </div>
)}
 

            {activeTab === "settings" && (
              <ProfileSettings />
            )}
          </main>
        </div>

        <CreateCampaignDialog open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={fetchData} />
      </SidebarProvider>
    </>
  );
};

export default BrandDashboard;