import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing in drizzle.config.ts');
} else {
  console.log('DATABASE_URL is present');
}

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
