import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '3mehwDCA6KvTmzx.root',
  password: 'srW7Cm9n41N0iAwC',
  database: 'dietista',
  ssl: { rejectUnauthorized: true }
});

try {
  // Creare tabelle mancanti
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS \`body_measurements\` (
      \`id\` int AUTO_INCREMENT NOT NULL,
      \`userId\` int NOT NULL,
      \`date\` timestamp NOT NULL DEFAULT (now()),
      \`weight\` decimal(5,2),
      \`height\` decimal(5,2),
      \`bmi\` decimal(5,2),
      \`waist\` decimal(5,2),
      \`hips\` decimal(5,2),
      \`chest\` decimal(5,2),
      \`notes\` text,
      CONSTRAINT \`body_measurements_id\` PRIMARY KEY(\`id\`)
    )
  `);
  console.log('✓ body_measurements creata');

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS \`food_diary\` (
      \`id\` int AUTO_INCREMENT NOT NULL,
      \`userId\` int NOT NULL,
      \`date\` timestamp NOT NULL DEFAULT (now()),
      \`meal\` varchar(50) NOT NULL,
      \`food\` text NOT NULL,
      \`calories\` int,
      \`proteins\` decimal(5,2),
      \`carbs\` decimal(5,2),
      \`fats\` decimal(5,2),
      CONSTRAINT \`food_diary_id\` PRIMARY KEY(\`id\`)
    )
  `);
  console.log('✓ food_diary creata');

  // Verificare e aggiungere colonne mancanti in diets
  const [cols] = await conn.execute('SHOW COLUMNS FROM diets');
  const colNames = cols.map(c => c.Field);
  console.log('Colonne diets attuali:', colNames);

  const dietsToAdd = [
    ['pdfUrl', "ADD `pdfUrl` text NOT NULL DEFAULT ''"],
    ['fileKey', "ADD `fileKey` text NOT NULL DEFAULT ''"],
    ['fileName', "ADD `fileName` varchar(255) NOT NULL DEFAULT ''"],
    ['fileSize', "ADD `fileSize` int NOT NULL DEFAULT 0"],
    ['version', "ADD `version` int NOT NULL DEFAULT 1"],
    ['isActive', "ADD `isActive` boolean NOT NULL DEFAULT true"],
    ['viewedAt', "ADD `viewedAt` timestamp NULL"],
  ];

  for (const [col, sql] of dietsToAdd) {
    if (!colNames.includes(col)) {
      await conn.execute(`ALTER TABLE \`diets\` ${sql}`);
      console.log(`✓ Aggiunta colonna diets.${col}`);
    } else {
      console.log(`- diets.${col} già presente`);
    }
  }

  // Verificare e aggiungere colonne mancanti in blog_posts
  const [bpCols] = await conn.execute('SHOW COLUMNS FROM blog_posts');
  const bpColNames = bpCols.map(c => c.Field);
  
  if (!bpColNames.includes('imageKey')) {
    await conn.execute("ALTER TABLE `blog_posts` ADD `imageKey` varchar(500)");
    console.log('✓ Aggiunta colonna blog_posts.imageKey');
  } else {
    console.log('- blog_posts.imageKey già presente');
  }

  // Verifica finale
  const [tables] = await conn.execute('SHOW TABLES');
  console.log('\n✅ Tabelle nel database:', tables.map(t => Object.values(t)[0]));

} catch (e) {
  console.error('Errore:', e.message);
} finally {
  await conn.end();
}
