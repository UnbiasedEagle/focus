import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

type Transaction = Parameters<
  Parameters<ReturnType<typeof drizzle>['transaction']>[0]
>[0];

// The HTTP driver behind `db` cannot keep a transaction open across statements,
// so transactions run on a short-lived pooled connection.
export async function runInTransaction<T>(
  work: (tx: Transaction) => Promise<T>
): Promise<T> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    return await drizzle(pool).transaction(work);
  } finally {
    await pool.end();
  }
}
