/**
 * Pagina di login con Clerk
 * Accessibile su /accedi
 */
import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/logo-completo.png"
            alt="Studio Dietista Arianna Pelliccioni"
            className="h-16 mx-auto mb-4 dark:brightness-0 dark:invert"
          />
          <h1 className="text-2xl font-bold text-foreground">Accedi al tuo account</h1>
          <p className="text-muted-foreground mt-2">
            Accedi per gestire le tue consulenze e il tuo profilo
          </p>
        </div>
        <SignIn
          routing="path"
          path="/accedi"
          signUpUrl="/registrati"
          afterSignInUrl="/"
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
