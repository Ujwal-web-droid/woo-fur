import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookingProvider } from "@/context/BookingContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import { UpdatePrompt } from "@/components/pwa/UpdatePrompt";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Animals from "./pages/Animals";
import AnimalProfile from "./pages/AnimalProfile";
import Programs from "./pages/Programs";
import RescueProgram from "./pages/programs/RescueProgram";
import RehabilitationProgram from "./pages/programs/RehabilitationProgram";
import TherapyProgram from "./pages/programs/TherapyProgram";
import PartTimePetsProgram from "./pages/programs/PartTimePetsProgram";
import Stories from "./pages/Stories";
import StoryDetail from "./pages/StoryDetail";
import StorySubmit from "./pages/StorySubmit";
import Booking from "./pages/Booking";
import BookingConfirmation from "./pages/BookingConfirmation";
import Support from "./pages/Support";
import Volunteer from "./pages/Volunteer";
import FAQ from "./pages/FAQ";
import Install from "./pages/Install";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Admin pages
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminAnimals } from "./pages/admin/AdminAnimals";
import { AdminPrograms } from "./pages/admin/AdminPrograms";
import { AdminProgramContent } from "./pages/admin/AdminProgramContent";
import { AdminBookings } from "./pages/admin/AdminBookings";
import { AdminStories } from "./pages/admin/AdminStories";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminContent } from "./pages/admin/AdminContent";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { AdminAuditLog } from "./pages/admin/AdminAuditLog";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BookingProvider>
          <Toaster />
          <Sonner />
          <OfflineBanner />
          <UpdatePrompt />
          <InstallPrompt />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/animals" element={<Animals />} />
              <Route path="/animals/:id" element={<AnimalProfile />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/rescue" element={<RescueProgram />} />
              <Route path="/programs/rehabilitation" element={<RehabilitationProgram />} />
              <Route path="/programs/therapy" element={<TherapyProgram />} />
              <Route path="/programs/part-time-pets" element={<PartTimePetsProgram />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/stories/submit" element={<StorySubmit />} />
              <Route path="/stories/:id" element={<StoryDetail />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/booking/confirmation" element={<BookingConfirmation />} />
              <Route path="/support" element={<Support />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/install" element={<Install />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
{/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="animals" element={<AdminAnimals />} />
                <Route path="programs" element={<AdminPrograms />} />
                <Route path="program-content" element={<AdminProgramContent />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="stories" element={<AdminStories />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="audit-log" element={<AdminAuditLog />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
