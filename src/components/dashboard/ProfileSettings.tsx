import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { auth, db } from "@/integrations/firebase/client";
import { doc, updateDoc, getDoc } from "firebase/firestore";

interface Profile {
  full_name: string;
  bio: string;
  company_name: string;
  profile_image_url: string;
}

const ProfileSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    bio: "",
    company_name: "",
    profile_image_url: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);
  
// useEffect(() => {
  const fetchProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const profileRef = doc(db, "profiles", user.uid);
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        throw new Error("Profile not found");
      }

      const data = profileSnap.data();
      setProfile({
        full_name: data.full_name || "",
        bio: data.bio || "",
        company_name: data.company_name || "",
        profile_image_url: data.profile_image_url || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile settings",
      });
    } finally {
      setLoading(false);
    }
  };
  // fetchProfile();
  //   }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const profileRef = doc(db, "profiles", user.uid);

      await updateDoc(profileRef, {
        full_name: profile.full_name,
        bio: profile.bio,
        company_name: profile.company_name,
        profile_image_url: profile.profile_image_url,
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              value={profile.company_name}
              onChange={(e) =>
                setProfile({ ...profile, company_name: e.target.value })
              }
              placeholder="Enter your company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile_image_url">Profile Image URL</Label>
            <Input
              id="profile_image_url"
              value={profile.profile_image_url}
              onChange={(e) =>
                setProfile({ ...profile, profile_image_url: e.target.value })
              }
              placeholder="Enter image URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
