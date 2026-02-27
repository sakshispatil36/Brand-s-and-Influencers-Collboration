// import { Routes, Route } from "react-router-dom";
// import Index from "@/pages/Index";
// import Auth from "@/pages/Auth";
// import Dashboard from "@/pages/Dashboard";
// import NotFound from "@/pages/NotFound";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Index />} />
//       <Route path="/auth" element={<Auth />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

// export default App;

import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/ProtectedRoute";
import InfluencerDashboard from "@/components/dashboard/InfluencerDashboard";
import BrandDashboard from "@/components/dashboard/BrandDashboard";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={ 
      <ProtectedRoute> 
        <Dashboard /> 
      </ProtectedRoute> 
      } />
      <Route path="*" element={<NotFound />} />
      <Route path="/brands" element={
      <ProtectedRoute>
        <BrandDashboard />
      </ProtectedRoute>
    } 
      />
      <Route path="/influencers" element={
          <ProtectedRoute>
            <InfluencerDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
    <Toaster/>
    </>
  );
}

export default App;
