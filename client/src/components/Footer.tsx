import { Link } from "wouter";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img 
              src="/logo-completo.png" 
              alt="Arianna Pelliccioni Dietista" 
              className="h-12 w-auto dark:brightness-0 dark:invert"
            />
            <p className="text-sm text-muted-foreground">
              Nutrizione personalizzata per il tuo benessere
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigazione</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/servizi">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Servizi
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/nutrizione-sportiva" className="text-muted-foreground hover:text-primary transition-colors">
                  Nutrizione Sportiva
                </Link>
              </li>
              <li>
                <Link href="/chi-sono">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Chi Sono
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/testimonianze">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Testimonianze
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contatti">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Contatti
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Servizi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Prima Visita Nutrizionale</li>
              <li>Visita di controllo</li>
              <li>Prima visita Online</li>
              <li>Visita di controllo online</li>
              <li>Educazione Alimentare</li>
              <li>Analisi della composizione corporea (MetaDieta BIA)</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contatti</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>pelliccioniarianna.dietista@gmail.com</span>
              </li>
              <li className="flex items-start space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+39 350 1765893</span>
              </li>
              <li className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>San.Ar. studi medici<br/>Via Piero Calamandrei, 137<br/>Arezzo</span>
              </li>
              <li className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Medicina Specialistica<br/>Piazza De Gasperi, 29<br/>Camucia-Cortona</span>
              </li>
              <li className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Poliambulatorio Fisioterapico Pineta Srl<br/>Località Pineta, 13<br/>Macchie (PG)</span>
              </li>
              <li className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Centro Sinergia<br/>Via Amilchare Ponchielli, 30<br/>Corciano (PG)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Dietista Arianna Pelliccioni. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}
