import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/integrations/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import InfluencerDashboard from "@/components/dashboard/InfluencerDashboard";
import BrandDashboard from "@/components/dashboard/BrandDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;

      // ✅ Same as: if (!session)
      if (!user) {
        navigate("/auth");
        return;
      }

      // ✅ Same as profiles select query
      const profileRef = doc(db, "profiles", user.uid);
      const profileSnap = await getDoc(profileRef);

      // ✅ Same behavior: only set if profile exists
      if (profileSnap.exists()) {
        setUserType(profileSnap.data().user_type);
      }

      // ✅ Same loading stop (always called)
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {userType === "influencer" ? (
        <InfluencerDashboard />
      ) : (
        <BrandDashboard />
      )}
    </div>
  );
};

export default Dashboard;
