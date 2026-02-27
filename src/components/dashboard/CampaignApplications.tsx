import { useState, useEffect } from "react";
import { db } from "@/integrations/firebase/client";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, X, MessageSquare } from "lucide-react";
import MessagingPanel from "./MessagingPanel";
import { generateContractPDF } from "../../services/contractService";
import { onSnapshot } from "firebase/firestore";
// import type { Influencer } from "@/types/influencer";

export interface Application {
  id: string;
  status: string;
  message: string;
  created_at: Date; 
  influencer_id: string;
  signature_url?: string | null;  
  profiles?: {
  full_name: string;
  bio: string;
  company_name: string;
  };
}

interface CampaignApplicationsProps {
  campaignId: string;
  campaignTitle: string;
  brandName: string;  
}

const CampaignApplications = ({ campaignId, campaignTitle, brandName }: CampaignApplicationsProps) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedInfluencer, setSelectedInfluencer] = useState<{id: string, name: string} | null>(null);
  const [contractsMap, setContractsMap] = useState<Record<string, string>>({});
  // const [recommendedInfluencers, setRecommendedInfluencers] = useState<Influencer[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Helper function to fetch profile
  const getProfile = async (influencerId: string) => {
    if (!influencerId) return undefined;
    const profileSnap = await getDoc(doc(db, "profiles", influencerId));
    if (!profileSnap.exists()) return undefined;
    const data = profileSnap.data();
    return {
      full_name: data.full_name,
      bio: data.bio,
      company_name: data.company_name,
    };
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "campaign_applications"),
        where("campaign_id", "==", campaignId),
        //orderBy("applied_at", "desc")
      );
      const snapshot = await getDocs(q);

      const apps: Application[] = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const profile = await getProfile(data.influencer_id);
          return {
            id: docSnap.id,
            status: data.status,
            message: data.message,
            created_at: data.applied_at?.toDate?.() ?? new Date(),
            influencer_id: data.influencer_id,
            profiles: profile,
            signature_url: data.signature_url || null, 
          };
        })
      );

      setApplications(apps);
    } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    toast({
      title: "Error",
      description: message,
    });
  } finally {
    setLoading(false);
  }
};


  const handleStatusUpdate = async (applicationId: string, newStatus: "approved" | "rejected") => {
    try {
      const applicationRef = doc(db, "campaign_applications", applicationId);
      await updateDoc(applicationRef, { status: newStatus });

      toast({
        title: "Success",
        description: `Application ${newStatus} successfully!`,
      });

      fetchApplications();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Error",
        description: message,
      });
    }
  };

  useEffect(() => {
  const contractQuery = query(
    collection(db, "contracts"),
    where("campaign_id", "==", campaignId)
  );

  const unsubscribe = onSnapshot(contractQuery, (snapshot) => {
    const contractData: Record<string, string> = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.signature_url && data.influencer_id) {
        contractData[data.influencer_id] = data.signature_url;
      }
    });

    setContractsMap(contractData); // 👈 MUST BE HERE
  });

  return () => unsubscribe();
}, [campaignId]);


useEffect(() => {
  fetchApplications();
}, [campaignId]);

// const fetchRecommendations = async () => {
//   try {
//     // 🔥 Fetch campaign category directly here
//     const campaignSnap = await getDoc(doc(db, "campaigns", campaignId));

//     if (!campaignSnap.exists()) return;

//     const campaignData = campaignSnap.data();
//     const category = campaignData.category;

//     if (!category) {
//       console.log("No category found in campaign");
//       return;
//     }

//     const q = query(
//       collection(db, "influencers"),
//       where("category", "array-contains", category),
//       orderBy("followers", "desc"),
//       limit(20)
//     );

//     const snapshot = await getDocs(q);

//     const influencers: Influencer[] = snapshot.docs.map((docSnap) => {
//       const data = docSnap.data();
//       const followersValue = data.followers ?? 0;

//       return {
//       id: docSnap.id,
//       name: data.name || "Unknown",
//       followers: followersValue,
//       followersCount: String(followersValue),
//       category: data.category || [],
//       location: data.City || "India",
//       engagementRate: data.engagementRate ?? 0,
//       rank: data.rank ?? 0,
//       influenceScore: data.influenceScore ?? 0,
//       City: data.City ?? "Unknown",
//       credibilityScore: 0,
//       suspicious: false,
//       status: "Normal",
//       matchScore: 0,
//     };
//     });

//     setRecommendedInfluencers(influencers);

//     console.log("Recommended count:", influencers.length);

//   } catch (error) {
//     console.error("Recommendation error:", error);
//   }
// };


  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Applications for {brandName}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {applications.length} application(s) received
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No applications yet</p>
        ) : (
          applications.map((app) => (
            <Card key={app.id} className="bg-background border-border">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base text-card-foreground">
                      {app.profiles?.full_name || "Unnamed Influencer"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {app.profiles?.company_name || "Influencer"}
                    </CardDescription>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      app.status === "approved"
                        ? "bg-green-500/20 text-green-600"
                        : app.status === "rejected"
                        ? "bg-red-500/20 text-red-600"
                        : "bg-yellow-500/20 text-yellow-600"  }`}>
                    {app.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* <Button onClick={fetchRecommendations} className="mb-4">
                  Show Recommendations
                </Button> */}

                {/* {recommendedInfluencers.length > 0 && (
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold">Recommended Influencers</h3>
                    {recommendedInfluencers.map((inf) => (
                      <Card key={inf.id} className="bg-background border-border">
                        <CardContent className="p-4">
                          <p className="font-medium">{inf.name}</p>
                          <p className="text-sm text-muted-foreground">
                          Followers: {inf.followers.toLocaleString()}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Influence Score: {inf.influenceScore}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Country: {inf.City}
                        </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )} */}

                {app.profiles?.bio && (
                  <p className="text-sm text-muted-foreground">{app.profiles.bio}</p>
                )}
                {app.message && (
                  <div>
                    <h5 className="text-sm font-semibold text-card-foreground mb-1">Message:</h5>
                    <p className="text-sm text-muted-foreground">{app.message}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {app.status === "applied" && (
                    <>
                      <Button
                        disabled={loading}
                        size="sm"
                        onClick={() => handleStatusUpdate(app.id, "approved")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusUpdate(app.id, "rejected")}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setSelectedInfluencer(
                        selectedInfluencer?.id === app.influencer_id
                          ? null
                          : { id: app.influencer_id, name: app.profiles?.full_name || "Influencer" }
                      )
                    }
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {selectedInfluencer?.id === app.influencer_id ? "Hide Messages" : "Message"}
                  </Button>
                </div>
               {app.status === "approved" && (
                <div className="flex items-center gap-3 mt-2 flex-wrap">

                  {/* Generate Contract */}
                  <Button
                    size="sm"
                    onClick={() => {
                      const url = generateContractPDF({
                        brandName: "Your Brand",
                        influencerName: app.profiles?.full_name || "Influencer",
                        campaignTitle: campaignTitle,
                        paymentTerms: "₹20,000 after campaign completion",
                        deliverables: "3 Instagram posts + 2 stories",
                        timeline: "Campaign duration: 15 days",
                        cancellationPolicy: "Either party can cancel with 7 days notice",
                      });

                      window.open(url, "_blank");
                    }}
                  >
                    Generate Contract
                  </Button>

                  {/* Upload Signature
                  <label>
                    <input
                      type="file"
                      accept="application/pdf"
                      hidden
                      onChange={(e) => handleSignatureUpload(e, app.id)}
                    />

                    <Button size="sm" variant="outline" asChild>
                      <span>✍ Upload Signature</span>
                    </Button>
                  </label> */}

                  {/* View Uploaded Signature */}
                  {contractsMap[app.influencer_id] && (
                    <>
                      <a
                        href={contractsMap[app.influencer_id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 underline"
                      >
                        📄 View Signature
                      </a>

                      <span className="text-green-600 text-sm font-medium">
                        ✅ Contract Signed
                      </span>
                    </>
                  )}

                </div>
              )}
              </CardContent>
            </Card>
          ))
        )}
        {selectedInfluencer && (
          <MessagingPanel
            campaignId={campaignId}
            receiverId={selectedInfluencer.id}
            receiverName={selectedInfluencer.name}
          />
        )}
        
      </CardContent>
    </Card>
  );
};

export default CampaignApplications;
