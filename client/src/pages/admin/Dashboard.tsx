import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { MessageSquare, Star, Users } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: testimonials } = trpc.testimonials.listAll.useQuery();
  const { data: consultations } = trpc.consultations.listAll.useQuery();
  const { data: contacts } = trpc.contact.listAll.useQuery();

  const stats = [
    {
      title: "Richieste Consulenza",
      value: consultations?.length || 0,
      icon: Users,
      description: "Richieste ricevute",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },

    {
      title: "Testimonianze",
      value: testimonials?.filter((t: any) => t.approved).length || 0,
      icon: Star,
      description: "Recensioni approvate",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Richieste Contatto",
      value: contacts?.length || 0,
      icon: MessageSquare,
      description: "Messaggi ricevuti",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Benvenuta Dottoressa Pelliccioni</h1>
          <p className="text-muted-foreground">Panoramica del tuo sito web</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ultime Richieste Consulenza</CardTitle>
            </CardHeader>
            <CardContent>
              {!consultations || consultations.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nessuna richiesta</p>
              ) : (
                <div className="space-y-4 overflow-x-auto">
                  {consultations.slice(0, 5).map((consultation: any) => (
                    <div key={consultation.id} className="flex flex-col gap-2 border-b pb-4 last:border-0 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{consultation.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{consultation.email}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(consultation.createdAt).toLocaleDateString('it-IT')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>


        </div>
      </div>
    </AdminLayout>
  );
}
