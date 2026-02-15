-- Create tables for SPIE Elige voting system

CREATE TABLE IF NOT EXISTS "voters" (
  "id" SERIAL PRIMARY KEY,
  "nombre" TEXT NOT NULL,
  "cedula" TEXT NOT NULL UNIQUE,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "elections" (
  "id" SERIAL PRIMARY KEY,
  "titulo" TEXT NOT NULL,
  "descripcion" TEXT NOT NULL DEFAULT '',
  "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "options" (
  "id" SERIAL PRIMARY KEY,
  "texto" TEXT NOT NULL,
  "election_id" INTEGER NOT NULL REFERENCES "elections"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "delegations" (
  "id" SERIAL PRIMARY KEY,
  "from_voter_id" INTEGER NOT NULL UNIQUE REFERENCES "voters"("id") ON DELETE CASCADE,
  "to_voter_id" INTEGER NOT NULL REFERENCES "voters"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "votes" (
  "id" SERIAL PRIMARY KEY,
  "voter_id" INTEGER NOT NULL REFERENCES "voters"("id") ON DELETE CASCADE,
  "election_id" INTEGER NOT NULL REFERENCES "elections"("id") ON DELETE CASCADE,
  "option_id" INTEGER NOT NULL REFERENCES "options"("id") ON DELETE CASCADE,
  "weight" INTEGER NOT NULL DEFAULT 1,
  "timestamp" TIMESTAMPTZ NOT NULL DEFAULT now()
);
