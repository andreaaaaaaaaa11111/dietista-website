import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Seed Services
console.log("Seeding services...");
await db.execute(`
  INSERT INTO services (title, description, duration, price, active, \`order\`) VALUES
  ('Prima Consulenza Nutrizionale', 'Valutazione completa dello stato nutrizionale, analisi delle abitudini alimentari e definizione degli obiettivi. Include misurazione composizione corporea e piano alimentare personalizzato.', 60, 8000, true, 1),
  ('Piano Alimentare Personalizzato', 'Elaborazione di un piano alimentare su misura basato sulle tue esigenze, preferenze e obiettivi. Include ricette, lista della spesa e consigli pratici.', 45, 6000, true, 2),
  ('Follow-up Nutrizionale', 'Consulenza di controllo per monitorare i progressi, aggiustare il piano alimentare e risolvere eventuali difficoltà. Include nuova misurazione composizione corporea.', 30, 4000, true, 3),
  ('Consulenza Nutrizione Sportiva', 'Piano nutrizionale specifico per atleti e sportivi, ottimizzato per performance, recupero e composizione corporea. Include timing dei nutrienti e integrazione.', 60, 9000, true, 4),
  ('Educazione Alimentare', 'Sessione educativa su temi specifici: lettura etichette, spesa consapevole, organizzazione pasti, cucina salutare. Ideale per famiglie e gruppi.', 45, 5000, true, 5)
  ON DUPLICATE KEY UPDATE title=title;
`);

// Seed Blog Categories
console.log("Seeding blog categories...");
await db.execute(`
  INSERT INTO blog_categories (name, slug, description) VALUES
  ('Nutrizione', 'nutrizione', 'Articoli su principi nutrizionali e alimentazione sana'),
  ('Ricette', 'ricette', 'Ricette salutari e bilanciate'),
  ('Benessere', 'benessere', 'Consigli per uno stile di vita sano'),
  ('Diete Speciali', 'diete-speciali', 'Informazioni su diete per esigenze specifiche')
  ON DUPLICATE KEY UPDATE name=name;
`);

// Seed Sample Blog Posts
console.log("Seeding blog posts...");
await db.execute(`
  INSERT INTO blog_posts (title, slug, content, excerpt, categoryId, published, publishedAt) VALUES
  (
    'I Benefici della Dieta Mediterranea',
    'benefici-dieta-mediterranea',
    '# I Benefici della Dieta Mediterranea\n\nLa dieta mediterranea è riconosciuta a livello mondiale come uno dei modelli alimentari più salutari e sostenibili. Basata sulle tradizioni culinarie dei paesi che si affacciano sul Mar Mediterraneo, questa dieta offre numerosi benefici per la salute.\n\n## Caratteristiche Principali\n\nLa dieta mediterranea si caratterizza per:\n\n- **Abbondanza di frutta e verdura** fresca e di stagione\n- **Cereali integrali** come base dell''alimentazione\n- **Olio d''oliva** come principale fonte di grassi\n- **Pesce** consumato regolarmente\n- **Legumi** come fonte proteica vegetale\n- **Consumo moderato** di latticini, uova e carni bianche\n- **Limitato consumo** di carni rosse e dolci\n\n## Benefici per la Salute\n\nNumerosi studi scientifici hanno dimostrato che seguire la dieta mediterranea può:\n\n1. **Ridurre il rischio cardiovascolare**: grazie all''alto contenuto di grassi monoinsaturi e omega-3\n2. **Prevenire il diabete tipo 2**: per l''equilibrio glicemico garantito dai cereali integrali\n3. **Supportare la salute cognitiva**: proteggendo dal declino cognitivo\n4. **Favorire la longevità**: associata a una maggiore aspettativa di vita\n\n## Come Iniziare\n\nPer adottare la dieta mediterranea:\n\n- Inizia gradualmente introducendo più verdure nei pasti\n- Sostituisci il burro con olio d''oliva extravergine\n- Scegli cereali integrali invece di quelli raffinati\n- Aumenta il consumo di legumi (2-3 volte a settimana)\n- Riduci le carni rosse privilegiando pesce e carni bianche\n\nRicorda: la dieta mediterranea non è solo un modo di mangiare, ma uno stile di vita che include anche attività fisica regolare e convivialità a tavola.',
    'Scopri i benefici scientificamente provati della dieta mediterranea e come adottarla nella tua vita quotidiana per migliorare la salute.',
    1,
    true,
    NOW()
  ),
  (
    '5 Consigli per una Colazione Nutriente',
    '5-consigli-colazione-nutriente',
    '# 5 Consigli per una Colazione Nutriente\n\nLa colazione è davvero il pasto più importante della giornata? La risposta è sì, se fatta nel modo giusto. Ecco 5 consigli per iniziare la giornata con energia.\n\n## 1. Non Saltarla Mai\n\nSaltare la colazione può portare a:\n- Calo di energia e concentrazione\n- Aumento della fame a metà mattina\n- Scelte alimentari meno salutari durante la giornata\n\n## 2. Includi Proteine\n\nLe proteine al mattino aiutano a:\n- Mantenere la sazietà più a lungo\n- Stabilizzare la glicemia\n- Preservare la massa muscolare\n\n**Fonti proteiche ideali**: yogurt greco, uova, ricotta, frutta secca\n\n## 3. Scegli Carboidrati Complessi\n\nI carboidrati integrali forniscono:\n- Energia graduale e costante\n- Fibre per la salute intestinale\n- Vitamine del gruppo B\n\n**Opzioni consigliate**: avena, pane integrale, cereali integrali\n\n## 4. Aggiungi Frutta Fresca\n\nLa frutta apporta:\n- Vitamine e minerali essenziali\n- Antiossidanti protettivi\n- Dolcezza naturale\n\n## 5. Idratati\n\nNon dimenticare di bere:\n- Un bicchiere d''acqua appena sveglio\n- Tè o tisane senza zucchero\n- Caffè con moderazione\n\n## Esempio di Colazione Bilanciata\n\n- Porridge di avena con frutta fresca e mandorle\n- Yogurt greco con muesli integrale e mirtilli\n- Toast integrale con avocado e uovo\n- Smoothie con banana, spinaci, latte vegetale e burro di mandorle',
    'Scopri come preparare una colazione bilanciata che ti dia energia per tutta la mattina.',
    3,
    true,
    NOW()
  )
  ON DUPLICATE KEY UPDATE title=title;
`);

// Seed Availability Slots
console.log("Seeding availability slots...");
await db.execute(`
  INSERT INTO availability_slots (dayOfWeek, startTime, endTime, active) VALUES
  (1, '09:00', '13:00', true),
  (1, '14:00', '18:00', true),
  (2, '09:00', '13:00', true),
  (2, '14:00', '18:00', true),
  (3, '09:00', '13:00', true),
  (3, '14:00', '18:00', true),
  (4, '09:00', '13:00', true),
  (4, '14:00', '18:00', true),
  (5, '09:00', '13:00', true),
  (5, '14:00', '18:00', true),
  (6, '09:00', '13:00', true)
  ON DUPLICATE KEY UPDATE dayOfWeek=dayOfWeek;
`);

// Seed Sample Testimonials
console.log("Seeding testimonials...");
await db.execute(`
  INSERT INTO testimonials (name, content, rating, approved) VALUES
  ('Maria Rossi', 'Esperienza fantastica! La dottoressa è stata molto professionale e attenta alle mie esigenze. Il piano alimentare è facile da seguire e ho già visto ottimi risultati dopo solo un mese.', 5, true),
  ('Luca Bianchi', 'Finalmente ho trovato una dietista che ascolta davvero. Non mi sono mai sentito a dieta, ma ho imparato a mangiare meglio. Ho perso 8kg in 3 mesi senza rinunce impossibili.', 5, true),
  ('Giulia Ferrari', 'Professionalità e competenza al top. Mi ha aiutata a gestire l''alimentazione durante la gravidanza e ora anche per l''allattamento. Consigli preziosi e sempre disponibile.', 5, true),
  ('Marco Colombo', 'Come sportivo avevo bisogno di un piano specifico per le mie performance. Il risultato è stato oltre le aspettative: più energia, recupero migliore e composizione corporea ottimale.', 5, true),
  ('Sara Russo', 'Dopo anni di diete yo-yo, ho finalmente trovato un approccio sostenibile. Non è solo una dieta, ma un vero cambiamento di stile di vita. Grazie infinite!', 5, true),
  ('Andrea Conti', 'Ottima esperienza. La consulenza è stata molto approfondita e il piano alimentare personalizzato perfetto per le mie esigenze lavorative. Consiglio vivamente!', 4, true)
  ON DUPLICATE KEY UPDATE name=name;
`);

console.log("Seed completed successfully!");
await connection.end();
