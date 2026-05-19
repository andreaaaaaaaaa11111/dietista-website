import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<string>('');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const verifyMutation = trpc.consultations.verifyEmail.useMutation({
    onSuccess: () => {
      setStatus('success');
      setMessage('Email verificata con successo! La tua richiesta di consulenza è stata confermata.');
    },
    onError: (error) => {
      setStatus('error');
      setMessage(error.message || 'Errore nella verifica dell\'email. Il token potrebbe essere scaduto o non valido.');
    },
  });

  useEffect(() => {
    // Estrai il token dall'URL
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    
    if (!tokenParam) {
      setStatus('error');
      setMessage('Token non trovato nell\'URL.');
      return;
    }

    setToken(tokenParam);
    
    // Verifica l'email automaticamente
    verifyMutation.mutate({ token: tokenParam });
  }, []);

  return (
    <div className="py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Verifica Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === 'loading' && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-sage-600 animate-spin" />
                <p className="text-center text-gray-600">
                  Stiamo verificando la tua email...
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center gap-4">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-gray-900">Successo!</h3>
                  <p className="text-sm text-gray-600">{message}</p>
                </div>
                <Button 
                  onClick={() => setLocation('/')}
                  className="w-full bg-sage-600 hover:bg-sage-700"
                >
                  Torna alla Home
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center gap-4">
                <AlertCircle className="w-12 h-12 text-red-600" />
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-gray-900">Errore</h3>
                  <p className="text-sm text-gray-600">{message}</p>
                </div>
                <Button 
                  onClick={() => setLocation('/prenota')}
                  variant="outline"
                  className="w-full"
                >
                  Invia una nuova richiesta
                </Button>
                <Button 
                  onClick={() => setLocation('/')}
                  className="w-full bg-sage-600 hover:bg-sage-700"
                >
                  Torna alla Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
