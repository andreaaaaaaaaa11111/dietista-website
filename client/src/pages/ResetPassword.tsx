import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, LockKeyhole } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setCheckingLink(false);
      return;
    }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setReady(Boolean(data.session));
        setCheckingLink(false);
      }
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (active && (event === "PASSWORD_RECOVERY" || session)) {
        setReady(true);
        setCheckingLink(false);
      }
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    if (password !== confirmPassword) {
      toast.error("Le password non coincidono");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error("Impossibile aggiornare la password", { description: error.message });
      return;
    }
    setCompleted(true);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-secondary/30 via-background to-accent/20 py-16 px-4">
      <SEO title="Reimposta password - Dietista Arianna Pelliccioni" description="Scegli una nuova password per la tua area personale." />
      <Card className="mx-auto max-w-md border-primary/10 shadow-xl">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            {completed ? <CheckCircle2 className="h-7 w-7 text-primary" /> : <LockKeyhole className="h-7 w-7 text-primary" />}
          </div>
          <CardTitle className="text-3xl">{completed ? "Password aggiornata" : "Scegli una nuova password"}</CardTitle>
          <CardDescription>
            {completed ? "Ora puoi accedere alla tua area personale." : "Inserisci una password di almeno 8 caratteri."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completed ? (
            <Button className="w-full" size="lg" onClick={() => setLocation("/accedi")}>Vai all’accesso</Button>
          ) : checkingLink ? (
            <div className="flex items-center justify-center gap-3 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Verifica del link in corso…
            </div>
          ) : !ready ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
              Il link non è valido o è scaduto. Richiedi un nuovo link dalla pagina di accesso.
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nuova password</Label>
                <Input id="new-password" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Conferma password</Label>
                <Input id="confirm-password" type="password" minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
              </div>
              <Button className="w-full" size="lg" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salva la nuova password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
