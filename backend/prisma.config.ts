import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres:09876@pOi@localhost:5432/college",
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
});
