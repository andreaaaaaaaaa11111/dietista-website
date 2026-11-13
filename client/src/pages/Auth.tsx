import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, LockKeyhole, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEO from "@/components/SEO";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Mode = "login" | "register" | "forgot";

function getAuthErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("rate limit") || normalizedMessage.includes("too many requests")) {
    return "Sono state inviate troppe richieste ravvicinate. Attendi un minuto e riprova una sola volta.";
  }

  if (normalizedMessage.includes("invalid login credentials")) {
    return "Email o password non corrette.";
  }

  return message || "Riprova tra poco.";
}

function safeRedirect(): string {
  const value = new URLSearchParams(window.location.search).get("redirect");
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/area-personale";
}

export default function Auth() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true);
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Accesso effettuato");
        const requestedDestination = safeRedirect();
        const destination =
          requestedDestination === "/area-personale" && data.user?.app_metadata?.role === "admin"
            ? "/admin"
            : requestedDestination;
        setLocation(destination);
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reimposta-password`,
        });
        if (error) throw error;
        setRecoverySent(true);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: name.trim() },
            emailRedirectTo: `${window.location.origin}/accedi?redirect=${encodeURIComponent(safeRedirect())}`,
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Account creato");
          setLocation(safeRedirect());
        } else {
          setConfirmationSent(true);
        }
      }
    } catch (error) {
      toast.error(
        mode === "login"
          ? "Accesso non riuscito"
          : mode === "forgot"
            ? "Invio non riuscito"
            : "Registrazione non riuscita",
        {
        description: getAuthErrorMessage(error),
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-secondary/30 via-background to-accent/20 py-16 px-4">
      <SEO title="Accedi - Dietista Arianna Pelliccioni" description="Accedi alla tua area personale." />
      <div className="mx-auto max-w-md">
        <Card className="border-primary/10 shadow-xl">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <LockKeyhole className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-3xl">
              {mode === "login" ? "Bentornato/a" : mode === "register" ? "Crea il tuo account" : "Recupera la password"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Accedi per consultare il tuo percorso e le tue richieste."
                : mode === "register"
                  ? "Registrati per avere un’area personale dedicata."
                  : "Riceverai un link sicuro per scegliere una nuova password."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSupabaseConfigured ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
                <p className="font-semibold mb-1">Attivazione dell’accesso quasi completata</p>
                <p>Inserisci URL e chiave pubblica del progetto Supabase nelle variabili del sito per abilitare registrazione e login.</p>
              </div>
            ) : confirmationSent ? (
              <div className="py-6 text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
                <h2 className="text-xl font-semibold">Controlla la tua email</h2>
                <p className="text-sm text-muted-foreground">Ti abbiamo inviato il link per confermare l’account.</p>
                <Button
                  className="w-full"
                  onClick={async () => {
                    if (!supabase) return;
                    setLoading(true);
                    const { error } = await supabase.auth.resend({
                      type: "signup",
                      email,
                      options: { emailRedirectTo: `${window.location.origin}/accedi` },
                    });
                    setLoading(false);
                    if (error) {
                      toast.error("Impossibile reinviare l’email", { description: getAuthErrorMessage(error) });
                    } else {
                      toast.success("Email di conferma inviata di nuovo");
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Invia di nuovo l’email"}
                </Button>
                <Button className="w-full" variant="outline" onClick={() => { setConfirmationSent(false); setMode("login"); }}>
                  Torna all’accesso
                </Button>
              </div>
            ) : recoverySent ? (
              <div className="py-6 text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
                <h2 className="text-xl font-semibold">Controlla la tua email</h2>
                <p className="text-sm text-muted-foreground">
                  Se l’indirizzo è registrato, riceverai il link per impostare una nuova password.
                </p>
                <Button variant="outline" className="w-full" onClick={() => { setRecoverySent(false); setMode("login"); }}>
                  Torna all’accesso
                </Button>
              </div>
            ) : (
              <>
                {mode !== "forgot" && (
                  <div className="grid grid-cols-2 rounded-xl bg-muted p-1 mb-6">
                    <Button type="button" variant={mode === "login" ? "default" : "ghost"} onClick={() => setMode("login")}>
                      Accedi
                    </Button>
                    <Button type="button" variant={mode === "register" ? "default" : "ghost"} onClick={() => setMode("register")}>
                      Registrati
                    </Button>
                  </div>
                )}
                <form onSubmit={submit} className="space-y-4">
                  {mode === "register" && (
                    <div className="space-y-2">
                      <Label htmlFor="auth-name">Nome e cognome</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="auth-name" className="pl-9" value={name} onChange={(event) => setName(event.target.value)} required />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="auth-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="auth-email" className="pl-9" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                    </div>
                  </div>
                  {mode !== "forgot" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <Label htmlFor="auth-password">Password</Label>
                        {mode === "login" && (
                          <button
                            type="button"
                            className="text-xs font-medium text-primary hover:underline"
                            onClick={() => setMode("forgot")}
                          >
                            Password dimenticata?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="auth-password" className="pl-9" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />
                      </div>
                      {mode === "register" && <p className="text-xs text-muted-foreground">Usa almeno 8 caratteri.</p>}
                    </div>
                  )}
                  <Button className="w-full" size="lg" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{mode === "login" ? "Accedi" : mode === "register" ? "Crea account" : "Invia link di recupero"}<ArrowRight className="ml-2 h-4 w-4" /></>}
                  </Button>
                  {mode === "forgot" && (
                    <Button type="button" variant="ghost" className="w-full" onClick={() => setMode("login")}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Torna all’accesso
                    </Button>
                  )}
                </form>
              </>
            )}
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-5">Accesso protetto da Supabase Auth.</p>
      </div>
    </main>
  );
}
