import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, BarChart3, CalendarCheck, Eye, Loader2, MessageSquare, Sparkles, Star, Users } from "lucide-react";
import { Link } from "wouter";

const statusLabel: Record<string, string> = {
  new: "Nuova",
  contacted: "Contattata",
  scheduled: "Programmata",
  completed: "Completata",
};

export default function Dashboard() {
  const { data, isLoading, error } = trpc.analytics.dashboard.useQuery(undefined, {
    refetchInterval: 30_000,
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-8">
            <p className="font-semibold text-red-900">Impossibile caricare le statistiche</p>
            <p className="mt-1 text-sm text-red-700">{error?.message ?? "Riprova tra poco."}</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const stats = [
    {
      title: "Richieste consulenza",
      value: data.summary.consultations,
      description: `${data.summary.newConsultations} nuove`,
      icon: CalendarCheck,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      href: "/admin/gestione-consulenze",
    },
    {
      title: "Visite al sito",
      value: data.summary.pageViews,
      description: "ultimi 7 giorni",
      icon: Eye,
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      href: "/",
    },
    {
      title: "Messaggi contatto",
      value: data.summary.contacts,
      description: `${data.summary.unreadContacts} da leggere`,
      icon: MessageSquare,
      color: "text-violet-700",
      bgColor: "bg-violet-50",
      href: "/admin/contatti",
    },
    {
      title: "Testimonianze",
      value: data.summary.approvedTestimonials,
      description: "recensioni approvate",
      icon: Star,
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      href: "/admin/testimonianze",
    },
    {
      title: "Pazienti registrati",
      value: data.summary.registeredUsers,
      description: "account utenti",
      icon: Users,
      color: "text-cyan-700",
      bgColor: "bg-cyan-50",
      href: "/admin/gestione-consulenze",
    },
    {
      title: "Servizi richiesti",
      value: data.topServices.length,
      description: "tipologie prenotate",
      icon: BarChart3,
      color: "text-rose-700",
      bgColor: "bg-rose-50",
      href: "/servizi",
    },
  ];

  const chartMax = Math.max(1, ...data.daily.flatMap(day => [day.visits, day.requests]));
  const today = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <AdminLayout>
      <div className="space-y-7 lg:space-y-9">
        <section className="relative overflow-hidden rounded-[32px] bg-[#153927] px-6 py-8 text-white shadow-[0_24px_70px_rgba(24,61,43,0.22)] sm:px-8 lg:px-10 lg:py-10">
          <div aria-hidden="true" className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-2xl" />
          <div aria-hidden="true" className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-lime-200/10 blur-3xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
                Panoramica in tempo reale
              </span>
              <h2 className="font-sans text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-[44px]">
                Benvenuta, Dottoressa Pelliccioni
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-emerald-50/75 sm:text-base">
                Tutto ciò che accade sul sito, raccolto in uno spazio semplice e immediato.
              </p>
            </div>
            <div className="w-fit rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-emerald-100/65">Oggi</p>
              <p className="mt-1 text-sm font-semibold capitalize text-white">{today}</p>
            </div>
          </div>
        </section>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map(stat => (
            <Link
              key={stat.title}
              href={stat.href}
              aria-label={`Apri ${stat.title}`}
              className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-4"
            >
              <Card className="group relative h-full overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_22px_55px_rgba(15,23,42,0.11)]">
                <div className={`absolute -right-10 -top-12 h-28 w-28 rounded-full opacity-60 blur-2xl ${stat.bgColor}`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-sans text-sm font-semibold text-slate-600">{stat.title}</CardTitle>
                  <div className={`relative rounded-2xl p-3 ring-1 ring-black/[0.03] transition duration-300 group-hover:scale-105 ${stat.bgColor}`}>
                    <stat.icon className={`h-[18px] w-[18px] ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="font-sans text-4xl font-semibold tracking-[-0.045em] text-slate-950">{stat.value}</div>
                  <div className="mt-1.5 flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-slate-400">{stat.description}</p>
                    <ArrowUpRight className="h-4 w-4 text-slate-300 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-700" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="border-b border-slate-100/80 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="font-sans text-lg font-semibold tracking-tight">Andamento settimanale</CardTitle>
                  <p className="mt-1 text-xs text-slate-400">Attività degli ultimi 7 giorni</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-2.5 text-slate-500">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="mb-6 flex gap-5 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#153927] shadow-[0_0_0_4px_rgba(31,107,72,0.09)]" />Visite</span>
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_0_4px_rgba(56,189,248,0.09)]" />Richieste</span>
              </div>
              <div className="relative flex h-52 items-end gap-3 rounded-2xl bg-[linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:100%_25%] px-2 pt-2">
                {data.daily.map(day => (
                  <div key={day.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div className="flex h-40 w-full items-end justify-center gap-1">
                      <div
                        className="w-1/3 min-w-2 rounded-t-lg bg-gradient-to-t from-[#153927] to-[#153927] shadow-sm transition-all duration-700"
                        style={{ height: `${Math.max(day.visits ? 8 : 2, (day.visits / chartMax) * 100)}%` }}
                        title={`${day.visits} visite`}
                      />
                      <div
                        className="w-1/3 min-w-2 rounded-t-lg bg-gradient-to-t from-sky-500 to-sky-300 shadow-sm transition-all duration-700"
                        style={{ height: `${Math.max(day.requests ? 8 : 2, (day.requests / chartMax) * 100)}%` }}
                        title={`${day.requests} richieste`}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(`${day.date}T12:00:00`).toLocaleDateString("it-IT", { weekday: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-slate-100/80 pb-5">
              <CardTitle className="font-sans text-lg font-semibold tracking-tight">Servizi più richiesti</CardTitle>
              <p className="text-xs text-slate-400">Preferenze dei pazienti</p>
            </CardHeader>
            <CardContent className="pt-1">
              {data.topServices.length === 0 ? (
                <p className="text-sm text-muted-foreground">I dati compariranno dopo la prima richiesta.</p>
              ) : (
                <div className="space-y-5">
                  {data.topServices.slice(0, 6).map((service, index) => {
                    const max = data.topServices[0]?.count ?? 1;
                    return (
                      <div key={service.id} className="space-y-1.5">
                        <div className="flex justify-between gap-3 text-sm">
                          <span className="line-clamp-1 font-medium text-slate-700"><span className="mr-2 text-xs text-slate-300">0{index + 1}</span>{service.title}</span>
                          <strong className="font-semibold text-slate-900">{service.count}</strong>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#153927] to-emerald-400" style={{ width: `${(service.count / max) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-slate-100/80 pb-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="font-sans text-lg font-semibold tracking-tight">Ultime richieste di consulenza</CardTitle>
                <p className="mt-1 text-xs text-slate-400">Le attività più recenti del sito</p>
              </div>
              <div className="hidden rounded-2xl bg-emerald-50 p-2.5 text-emerald-700 sm:block">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            {data.recentConsultations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessuna richiesta ricevuta.</p>
            ) : (
              <div className="divide-y">
                {data.recentConsultations.map(consultation => (
                  <div key={consultation.id} className="grid gap-2 rounded-xl px-2 py-4 transition hover:bg-slate-50/80 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{consultation.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{consultation.email}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{statusLabel[consultation.status] ?? consultation.status}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(consultation.createdAt).toLocaleDateString("it-IT")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
