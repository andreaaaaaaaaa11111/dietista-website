/**
 * Pagina di registrazione con Clerk
 * Accessibile su /registrati
 */
import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/logo-completo.png"
            alt="Studio Dietista Arianna Pelliccioni"
            className="h-16 mx-auto mb-4 dark:brightness-0 dark:invert"
          />
          <h1 className="text-2xl font-bold text-foreground">Crea il tuo account</h1>
          <p className="text-muted-foreground mt-2">
            Registrati per accedere all'area personale e gestire le tue consulenze
          </p>
        </div>
        <SignUp
          routing="path"
          path="/registrati"
          signInUrl="/accedi"
          afterSignUpUrl="/"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border border-border rounded-xl",
            },
          }}
        />
      </div>
    </div>
  );
}
