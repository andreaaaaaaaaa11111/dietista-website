create schema if not exists private;

alter function public.handle_new_user() set schema private;
alter function public.is_site_admin() set schema private;

revoke all on function private.handle_new_user() from public, anon, authenticated;
revoke all on function private.is_site_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_site_admin() to anon, authenticated;

drop policy "servizi gestiti dall amministratore" on public.services;

create policy "amministratore inserisce servizi"
on public.services for insert to authenticated
with check ((select private.is_site_admin()));

create policy "amministratore aggiorna servizi"
on public.services for update to authenticated
using ((select private.is_site_admin()))
with check ((select private.is_site_admin()));

create policy "amministratore elimina servizi"
on public.services for delete to authenticated
using ((select private.is_site_admin()));

drop policy "profile proprio o amministratore" on public.profiles;
create policy "profile proprio o amministratore"
on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select private.is_site_admin()));

drop policy "servizi pubblici attivi" on public.services;
create policy "servizi pubblici attivi"
on public.services for select to anon, authenticated
using (active or (select private.is_site_admin()));

drop policy "utente vede le proprie consulenze" on public.consultation_requests;
create policy "utente vede le proprie consulenze"
on public.consultation_requests for select to authenticated
using (
  user_uid = (select auth.uid())
  or lower(email) = lower(coalesce(((select auth.jwt()) ->> 'email'), ''))
  or (select private.is_site_admin())
);

drop policy "amministratore gestisce consulenze" on public.consultation_requests;
create policy "amministratore gestisce consulenze"
on public.consultation_requests for update to authenticated
using ((select private.is_site_admin()))
with check ((select private.is_site_admin()));

drop policy "amministratore elimina consulenze" on public.consultation_requests;
create policy "amministratore elimina consulenze"
on public.consultation_requests for delete to authenticated
using ((select private.is_site_admin()));

drop policy "amministratore gestisce contatti" on public.contact_requests;
create policy "amministratore gestisce contatti"
on public.contact_requests for select to authenticated
using ((select private.is_site_admin()));

drop policy "amministratore aggiorna contatti" on public.contact_requests;
create policy "amministratore aggiorna contatti"
on public.contact_requests for update to authenticated
using ((select private.is_site_admin()))
with check ((select private.is_site_admin()));

drop policy "amministratore elimina contatti" on public.contact_requests;
create policy "amministratore elimina contatti"
on public.contact_requests for delete to authenticated
using ((select private.is_site_admin()));

drop policy "testimonianze approvate pubbliche" on public.testimonials;
create policy "testimonianze approvate pubbliche"
on public.testimonials for select to anon, authenticated
using (approved or (select private.is_site_admin()));

drop policy "utente invia testimonianza" on public.testimonials;
create policy "utente invia testimonianza"
on public.testimonials for insert to authenticated
with check (user_uid = (select auth.uid()) or (select private.is_site_admin()));

drop policy "amministratore aggiorna testimonianze" on public.testimonials;
create policy "amministratore aggiorna testimonianze"
on public.testimonials for update to authenticated
using ((select private.is_site_admin()))
with check ((select private.is_site_admin()));

drop policy "amministratore elimina testimonianze" on public.testimonials;
create policy "amministratore elimina testimonianze"
on public.testimonials for delete to authenticated
using ((select private.is_site_admin()));

drop policy "amministratore legge eventi" on public.site_events;
create policy "amministratore legge eventi"
on public.site_events for select to authenticated
using ((select private.is_site_admin()));

create index consultation_requests_service_id_idx on public.consultation_requests(service_id);
create index consultation_requests_user_uid_idx on public.consultation_requests(user_uid);
create index site_events_service_id_idx on public.site_events(service_id);
create index site_events_user_uid_idx on public.site_events(user_uid);
create index testimonials_user_uid_idx on public.testimonials(user_uid);
