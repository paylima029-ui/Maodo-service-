import { pool } from "@workspace/db";
import type { Logger } from "pino";

export async function initDb(log: Logger): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      delay TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'FileText',
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      reference TEXT NOT NULL UNIQUE,
      service_id TEXT NOT NULL,
      service_name TEXT NOT NULL,
      service_price INTEGER NOT NULL,
      service_delay TEXT,
      client_name TEXT NOT NULL,
      client_phone TEXT NOT NULL,
      client_email TEXT,
      description TEXT NOT NULL,
      file_name TEXT,
      file_path TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_status TEXT NOT NULL DEFAULT 'pending',
      payment_reference TEXT,
      payment_method TEXT,
      transaction_id TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    ALTER TABLE services ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMP NOT NULL DEFAULT NOW();
    ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url   TEXT;
    ALTER TABLE orders   ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMP NOT NULL DEFAULT NOW();
    ALTER TABLE orders   ADD COLUMN IF NOT EXISTS service_delay TEXT;
    ALTER TABLE orders   ADD COLUMN IF NOT EXISTS file_name TEXT;
    ALTER TABLE orders   ADD COLUMN IF NOT EXISTS file_path TEXT;
    ALTER TABLE orders   ADD COLUMN IF NOT EXISTS payment_reference TEXT;
    ALTER TABLE orders   ADD COLUMN IF NOT EXISTS payment_method TEXT;
    ALTER TABLE orders   ADD COLUMN IF NOT EXISTS transaction_id TEXT;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      visit_date DATE NOT NULL UNIQUE,
      count INTEGER NOT NULL DEFAULT 0
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS formations (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      image_url TEXT,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS modules (
      id SERIAL PRIMARY KEY,
      formation_id INTEGER NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id SERIAL PRIMARY KEY,
      module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      theory TEXT NOT NULL DEFAULT '',
      media_type TEXT NOT NULL DEFAULT 'none',
      media_url TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id SERIAL PRIMARY KEY,
      lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      question TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS quiz_options (
      id SERIAL PRIMARY KEY,
      quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL DEFAULT false,
      "order" INTEGER NOT NULL DEFAULT 0
    );
  `);

  log.info("Database schema initialized");
}
