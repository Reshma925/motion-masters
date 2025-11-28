import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Summary from "./pages/Summary";
import ScalarsVectors from "./pages/topics/ScalarsVectors";
import DistanceDisplacement from "./pages/topics/DistanceDisplacement";
import SpeedVelocity from "./pages/topics/SpeedVelocity";
import Acceleration from "./pages/topics/Acceleration";
import EquationsOfMotion from "./pages/topics/EquationsOfMotion";
import ProjectileMotion from "./pages/topics/ProjectileMotion";
import RelativeMotion from "./pages/topics/RelativeMotion";
import KinematicsGraphs from "./pages/topics/KinematicsGraphs";
import NotFound from "./pages/NotFound";
import { MainLayout } from "./components/kinematics/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/topic/scalars-vectors" element={<MainLayout><ScalarsVectors /></MainLayout>} />
          <Route path="/topic/distance-displacement" element={<MainLayout><DistanceDisplacement /></MainLayout>} />
          <Route path="/topic/speed-velocity" element={<MainLayout><SpeedVelocity /></MainLayout>} />
          <Route path="/topic/acceleration" element={<MainLayout><Acceleration /></MainLayout>} />
          <Route path="/topic/equations-of-motion" element={<MainLayout><EquationsOfMotion /></MainLayout>} />
          <Route path="/topic/projectile-motion" element={<MainLayout><ProjectileMotion /></MainLayout>} />
          <Route path="/topic/relative-motion" element={<MainLayout><RelativeMotion /></MainLayout>} />
          <Route path="/topic/kinematics-graphs" element={<MainLayout><KinematicsGraphs /></MainLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
