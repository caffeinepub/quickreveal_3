import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import LoginPage from './pages/LoginPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import ProDashboardPage from './pages/ProDashboardPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  // Show loading screen during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center animate-in fade-in duration-300">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Initialisation...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <LoginPage />
      </div>
    );
  }

  // Show loading while fetching profile
  if (profileLoading || !isFetched) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center animate-in fade-in duration-300">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // Show profile setup modal if no profile exists
  if (userProfile === null || userProfile === undefined) {
    return (
      <div className="animate-in fade-in duration-300">
        <ProfileSetupModal />
      </div>
    );
  }

  // Route based on role
  const role = userProfile.role.toLowerCase();
  if (role === 'pro' || role === 'admin') {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <ProDashboardPage />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <ClientDashboardPage />
    </div>
  );
}
