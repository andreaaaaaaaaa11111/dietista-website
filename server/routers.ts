import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "@shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { notifyOwner } from "./_core/notification";
import { sendEmail } from "./_core/sendEmail";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";
import * as supabaseDb from "./supabaseDb";
import { DEFAULT_SERVICES } from "@shared/services";
import { BETTER_KEYS, betterRequestMessage, getBetterOffers } from "@shared/betterOffers";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ===== SERVICES =====
  services: router({
    list: publicProcedure.query(async () => {
      try {
        const services = await supabaseDb.getActiveServices();
        return services.length > 0 ? services : DEFAULT_SERVICES;
      } catch (error) {
        console.warn("[Supabase] Services fallback:", error);
        return DEFAULT_SERVICES;
      }
    }),
    
    listAll: adminProcedure.query(async ({ ctx }) => {
      return await supabaseDb.getAllServices(supabaseDb.requestAccessToken(ctx.req)!);
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return (await supabaseDb.getServiceById(input.id)) ?? DEFAULT_SERVICES.find(service => service.id === input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        description: z.string(),
        price: z.number(),
        duration: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        await supabaseDb.createService(supabaseDb.requestAccessToken(ctx.req)!, input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        duration: z.number().optional(),
        active: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        await supabaseDb.updateService(supabaseDb.requestAccessToken(ctx.req)!, id, data);
        return { success: true };
      }),
  }),

  // ===== BLOG =====
  blog: router({
    list: publicProcedure.query(async () => {
      return await db.getPublishedBlogPosts();
    }),
    
    listAll: adminProcedure.query(async () => {
      return await db.getAllBlogPosts();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getBlogPostBySlug(input.slug);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getBlogPostById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        content: z.string(),
        excerpt: z.string(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const post = await db.createBlogPost(input);
        return post;
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateBlogPost(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteBlogPost(input.id);
        return { success: true };
      }),
    
    generateContent: adminProcedure
      .input(z.object({
        topic: z.string(),
        style: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Sei un esperto di nutrizione. Scrivi articoli di blog ben strutturati in italiano." },
            { role: "user", content: "Scrivi un articolo sul tema: " + input.topic + ". Stile: " + (input.style || "informativo") + "." },
          ],
        });
        const content = response.choices[0].message.content;
        return { content };
      }),
    
    categories: publicProcedure.query(async () => {
      return await db.getAllBlogCategories();
    }),
  }),

  // ===== AI ASSISTANT =====
  aiAssistant: router({
    generateContent: adminProcedure
      .input(z.object({
        type: z.enum(['article', 'recipe', 'advice']),
        topic: z.string(),
      }))
      .mutation(async ({ input }) => {
        let prompt = '';
        
        if (input.type === 'article') {
          prompt = `Scrivi un articolo educativo su nutrizione riguardante: "${input.topic}". 
          L'articolo deve essere informativo, ben strutturato con titoli e paragrafi, e scritto in italiano.
          Includi consigli pratici e basati su evidenze scientifiche.
          Formato: Markdown con titoli (# ##), paragrafi e liste quando appropriato.`;
        } else if (input.type === 'recipe') {
          prompt = `Crea una ricetta salutare per: "${input.topic}".
          Includi: ingredienti con quantità, modalità di preparazione, tempo di cottura, valori nutrizionali approssimativi.
          Scrivi in italiano con un tono amichevole e pratico.
          Formato: Markdown con sezioni chiare.`;
        } else if (input.type === 'advice') {
          prompt = `Fornisci consigli nutrizionali pratici su: "${input.topic}".
          I consigli devono essere basati su principi di nutrizione corretta, facili da seguire e adatti a tutti.
          Scrivi in italiano con un tono professionale ma accessibile.
          Formato: Markdown con punti numerati o bullet points.`;
        }
        
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: 'Tu sei un esperto nutrizionista che crea contenuti educativi e ricette salutari in italiano.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        });
        
        const content = response.choices[0]?.message?.content || '';
        return { content };
      }),
  }),

  // ===== CONSULTATION REQUESTS =====
  consultations: router({
    // Invia una nuova richiesta di consulenza
    submit: publicProcedure
      .input(z.object({
        serviceId: z.number().optional(),
        betterOffer: z.enum(BETTER_KEYS).optional(),
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        age: z.number().optional(),
        weight: z.number().optional(),
        height: z.number().optional(),
        goal: z.string().optional(),
        medicalConditions: z.string().optional(),
        allergies: z.string().optional(),
        currentDiet: z.string().optional(),
        message: z.string().optional(),
        privacyConsent: z.boolean(),
      }))
      .mutation(async ({ input, ctx }) => {
        const token = supabaseDb.requestAccessToken(ctx.req);
        const { betterOffer, ...request } = input;
        if (betterOffer) {
          const services = await supabaseDb.getActiveServices();
          const offer = getBetterOffers(services).find(item => item.key === betterOffer)!;
          request.serviceId = offer.source.id;
          request.message = betterRequestMessage(offer, request.message);
        }
        await supabaseDb.createConsultationRequest(token, request, ctx.user?.openId);
        await supabaseDb.trackEvent(
          token,
          { eventType: "booking_submitted", path: "/prenota", serviceId: request.serviceId },
          ctx.user?.openId,
        );
        return { success: true };
      }),
    
    // Lista consulenze dell'utente loggato (per userId OR email)
    getMyConsultations: protectedProcedure.query(async ({ ctx }) => {
      return await supabaseDb.getMyConsultations(supabaseDb.requestAccessToken(ctx.req)!);
    }),

    // Lista richieste (admin)
    list: adminProcedure.query(async ({ ctx }) => {
      return await supabaseDb.getAllConsultationRequests(supabaseDb.requestAccessToken(ctx.req)!);
    }),
    
    // Lista tutte le richieste (admin) - alias per compatibilità
    listAll: adminProcedure.query(async ({ ctx }) => {
      return await supabaseDb.getAllConsultationRequests(supabaseDb.requestAccessToken(ctx.req)!);
    }),
    
    // Dettaglio richiesta (admin)
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        return await supabaseDb.getConsultationRequestById(supabaseDb.requestAccessToken(ctx.req)!, input.id);
      }),
    
    // Aggiorna stato richiesta (admin)
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['new', 'contacted', 'scheduled', 'completed']),
      }))
      .mutation(async ({ input, ctx }) => {
        await supabaseDb.updateConsultationStatus(supabaseDb.requestAccessToken(ctx.req)!, input.id, input.status);
        return { success: true };
      }),
    
    // Elimina richiesta (admin)
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await supabaseDb.deleteConsultationRequest(supabaseDb.requestAccessToken(ctx.req)!, input.id);
        return { success: true };
      }),
    
    // Verifica email con token
    verifyEmail: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        const request = await db.getConsultationRequestByToken(input.token);
        if (!request) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Token non valido' });
        }
        await db.verifyConsultationEmail(request.id);
        
        // Invia notifica alla dietista
        const adminNotificationEmail = await db.getAdminNotificationEmail();
        const emailAddress = adminNotificationEmail?.value || 'pelliccioniarianna.dietista@gmail.com';
        
        await notifyOwner({
          title: 'Nuova richiesta di consulenza confermata',
          content: `Una nuova richiesta di consulenza è stata confermata:\n\nNome: ${request.name}\nEmail: ${request.email}\nTelefono: ${request.phone}\nObiettivo: ${request.goal}\nCondizioni mediche: ${request.medicalConditions}\nAllergie: ${request.allergies}`,
        });
        
        return { success: true };
      }),
  }),

  // ===== USER PREFERENCES =====
  userPreferences: router({
    // Get user preferences
    get: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserPreferences(ctx.user.id);
    }),
    
    // Update preferences
    update: protectedProcedure
      .input(z.object({
        theme: z.enum(['light', 'dark', 'system']).optional(),
        weight: z.number().optional(),
        height: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertUserPreferences(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // ===== BLOG LIKES =====
  blogLikes: router({
    // Toggle like on a post
    toggle: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await db.toggleBlogLike(ctx.user.id, input.postId);
      }),
    
    // Get user's liked posts
    myLikes: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserBlogLikes(ctx.user.id);
    }),
    
    // Get likes count for a post
    count: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        return await db.getBlogLikesCount(input.postId);
      }),
  }),

  // ===== SAVED POSTS =====
  savedPosts: router({
    // Toggle save on a post
    toggle: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await db.toggleSavedPost(ctx.user.id, input.postId);
      }),
    
    // Get user's saved posts
    mySaved: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserSavedPosts(ctx.user.id);
    }),
    
    // Get user's saved post IDs
    mySavedIds: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserSavedPostIds(ctx.user.id);
    }),
  }),

  // ===== EMAIL TEMPLATES =====
  emailTemplates: router({
    // Get template by name
    getByName: adminProcedure
      .input(z.object({ name: z.string() }))
      .query(async ({ input }) => {
        return await db.getEmailTemplate(input.name);
      }),
    
    // List all templates
    listAll: adminProcedure.query(async () => {
      return await db.getAllEmailTemplates();
    }),
    
    // Upsert template
    upsert: adminProcedure
      .input(z.object({
        name: z.string(),
        subject: z.string(),
        body: z.string(),
      }))
      .mutation(async ({ input }) => {
        await db.upsertEmailTemplate(input);
        return { success: true };
      }),
  }),

  // ===== TESTIMONIALS =====
  testimonials: router({
    list: publicProcedure.query(async () => {
      return await supabaseDb.getPublishedTestimonials();
    }),
    
    listAll: adminProcedure.query(async ({ ctx }) => {
      return await supabaseDb.getAllTestimonials(supabaseDb.requestAccessToken(ctx.req)!);
    }),
    
    // Utente loggato può creare una recensione (non approvata)
    submit: protectedProcedure
      .input(z.object({
        content: z.string().min(10),
        rating: z.number().min(1).max(5),
      }))
      .mutation(async ({ ctx, input }) => {
        await supabaseDb.createTestimonial(supabaseDb.requestAccessToken(ctx.req)!, {
          name: ctx.user.name || 'Utente',
          email: ctx.user.email || undefined,
          content: input.content,
          rating: input.rating,
          approved: false,
        }, ctx.user.openId);
        return { success: true };
      }),
    
    // Admin crea recensione (già approvata)
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        content: z.string(),
        rating: z.number().min(1).max(5),
      }))
      .mutation(async ({ input, ctx }) => {
        await supabaseDb.createTestimonial(supabaseDb.requestAccessToken(ctx.req)!, { ...input, approved: true });
        return { success: true };
      }),
    
    // Admin approva recensione
    approve: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await supabaseDb.updateTestimonial(supabaseDb.requestAccessToken(ctx.req)!, input.id, { approved: true });
        return { success: true };
      }),
    
    // Admin rifiuta recensione (imposta approved a false)
    reject: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await supabaseDb.updateTestimonial(supabaseDb.requestAccessToken(ctx.req)!, input.id, { approved: false });
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await supabaseDb.deleteTestimonial(supabaseDb.requestAccessToken(ctx.req)!, input.id);
        return { success: true };
      }),
  }),

  // ===== CONTACT REQUESTS =====
  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        consultationType: z.string().optional(),
        message: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const token = supabaseDb.requestAccessToken(ctx.req);
        await supabaseDb.createContactRequest(token, input);
        await supabaseDb.trackEvent(token, { eventType: "contact_submitted", path: "/contatti" }, ctx.user?.openId);
        return { success: true };
      }),
    
    list: adminProcedure.query(async ({ ctx }) => {
      return await supabaseDb.getAllContactRequests(supabaseDb.requestAccessToken(ctx.req)!);
    }),
    
    // Alias per compatibilità
    listAll: adminProcedure.query(async ({ ctx }) => {
      return await supabaseDb.getAllContactRequests(supabaseDb.requestAccessToken(ctx.req)!);
    }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['new', 'read', 'replied']),
      }))
      .mutation(async ({ input, ctx }) => {
        await supabaseDb.updateContactRequestStatus(supabaseDb.requestAccessToken(ctx.req)!, input.id, input.status);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await supabaseDb.deleteContactRequest(supabaseDb.requestAccessToken(ctx.req)!, input.id);
        return { success: true };
      }),
  }),

  // ===== DIETS =====
  diets: router({
    // Utente loggato può visualizzare la propria dieta attiva
    getMyDiet: protectedProcedure.query(async ({ ctx }) => {
      return await db.getDietByUserId(ctx.user.id);
    }),
    
    // Utente loggato può visualizzare lo storico delle sue diete
    getMyHistory: protectedProcedure.query(async ({ ctx }) => {
      return await db.getDietHistory(ctx.user.id);
    }),
    
    // Utente marca la dieta come visualizzata
    markAsViewed: protectedProcedure
      .input(z.object({ dietId: z.number() }))
      .mutation(async ({ input }) => {
        await db.markDietAsViewed(input.dietId);
        return { success: true };
      }),
    
    // Admin visualizza tutte le diete
    listAll: adminProcedure.query(async () => {
      return await db.getAllDiets();
    }),
    
    // Admin ottiene lista utenti per selezione
    listUsers: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),
    
    // Admin crea o aggiorna la dieta di un paziente (con upload PDF)
    createOrUpdate: adminProcedure
      .input(z.object({
        userId: z.number(),
        title: z.string(),
        pdfUrl: z.string(),
        fileKey: z.string(),
        fileName: z.string(),
        fileSize: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { userId, ...dietData } = input;
        await db.createOrUpdateDiet(userId, dietData);
        return { success: true };
      }),
    
    // Admin elimina la dieta di un paziente
    delete: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteDiet(input.userId);
        return { success: true };
      }),
  }),
  
  // ===== FOOD DIARY =====
  foodDiary: router({
    getByDate: protectedProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ ctx, input }) => {
        return await db.getFoodDiaryByDate(ctx.user.id, input.date);
      }),

    getByDateRange: protectedProcedure
      .input(z.object({ startDate: z.string(), endDate: z.string() }))
      .query(async ({ ctx, input }) => {
        return await db.getFoodDiaryByDateRange(ctx.user.id, input.startDate, input.endDate);
      }),

    add: protectedProcedure
      .input(z.object({
        date: z.string(),
        mealType: z.enum(['colazione', 'spuntino_mattina', 'pranzo', 'spuntino_pomeriggio', 'cena']),
        description: z.string().min(1),
        calories: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createFoodDiaryEntry({ ...input, userId: ctx.user.id });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx: _ctx, input }) => {
        await db.deleteFoodDiaryEntry(input.id);
        return { success: true };
      }),
  }),

  // ===== BODY MEASUREMENTS =====
  bodyMeasurements: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getBodyMeasurements(ctx.user.id, input.limit ?? 30);
      }),

    add: protectedProcedure
      .input(z.object({
        date: z.string(),
        weight: z.number().optional(), // kg * 10
        waist: z.number().optional(),  // mm
        hips: z.number().optional(),
        chest: z.number().optional(),
        arm: z.number().optional(),
        thigh: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createBodyMeasurement({ ...input, userId: ctx.user.id });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx: _ctx, input }) => {
        await db.deleteBodyMeasurement(input.id);
        return { success: true };
    }),
  }),

  // ===== ANALYTICS =====
  analytics: router({
    track: publicProcedure
      .input(z.object({
        path: z.string().min(1).max(500),
        serviceId: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await supabaseDb.trackEvent(
          supabaseDb.requestAccessToken(ctx.req),
          { eventType: "page_view", path: input.path, serviceId: input.serviceId },
          ctx.user?.openId,
        );
        return { success: true };
      }),

    dashboard: adminProcedure.query(async ({ ctx }) => {
      return await supabaseDb.getDashboardStats(supabaseDb.requestAccessToken(ctx.req)!);
    }),
  }),

  // Storage upload endpoint
  storage: router({
    upload: protectedProcedure
      .input(z.object({
        key: z.string(),
        data: z.array(z.number()),
        contentType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { storagePut } = await import("./storage");
        const buffer = new Uint8Array(input.data);
        const result = await storagePut(input.key, buffer, input.contentType);
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
