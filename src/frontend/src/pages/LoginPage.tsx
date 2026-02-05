import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoggingIn, isLoginError, loginError } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-violet-500 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-96 bg-violet-900/20 blur-[100px] pointer-events-none" />

      <nav className="relative z-10 p-6 flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 tracking-tighter">
          QuickReveal.
        </h1>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center text-center mt-20 px-4 animate-in fade-in duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
          <Sparkles size={12} /> Exclusivité Paris
        </div>
        <h2 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6">
          Le monopole de <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400">
            la nuit & du dimanche.
          </span>
        </h2>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          La seule marketplace qui transforme les horaires "morts" en revenus premium.
          <br />
          Clients VIP. Tarifs Majorés. Expérience Luxe.
        </p>

        <Card className="max-w-md mx-auto bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Bienvenue</CardTitle>
            <CardDescription className="text-slate-400">Connectez-vous pour accéder au club.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full bg-white text-black font-bold hover:bg-slate-100 group"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter avec Internet Identity
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            {isLoginError && (
              <p className="text-sm text-red-400 text-center">{loginError?.message || 'Erreur de connexion'}</p>
            )}
          </CardContent>
        </Card>

        {/* Mockup Preview */}
        <div className="mt-20 relative w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 h-full w-full" />
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
            className="rounded-t-3xl border-t border-x border-white/10 opacity-60 w-full"
            alt="App Preview"
          />
        </div>
      </main>
    </div>
  );
}
