import "dotenv/config";
import mysql from "mysql2/promise";
import { DEFAULT_SERVICES } from "../shared/services";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const connection = await mysql.createConnection(databaseUrl);

try {
  await connection.beginTransaction();
  for (const service of DEFAULT_SERVICES) {
    await connection.execute(
      `INSERT INTO services
        (id, title, description, duration, price, active, \`order\`, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        duration = VALUES(duration),
        price = VALUES(price),
        active = VALUES(active),
        \`order\` = VALUES(\`order\`),
        updatedAt = NOW()`,
      [
        service.id,
        service.title,
        service.description,
        service.duration,
        service.price,
        service.active,
        service.order,
      ]
    );
  }
  await connection.commit();
  console.log(`Servizi inseriti o aggiornati: ${DEFAULT_SERVICES.length}`);
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
