/* =============================================================================
 * SQLite via node:sqlite (stable in Node 22.16+).
 *
 * No native build, no prebuild compat headaches — the binding ships with the
 * Node runtime. The API is close to better-sqlite3 (synchronous, prepared
 * statements with .get/.all/.run).
 * ============================================================================= */

import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { DatabaseSync, type StatementSync } from "node:sqlite";

export type SubmissionRow = {
  id: number;
  date: string;
  user: string;
  display_name: string | null;
  hero: string;
  ability: string;
  outcome: "a" | "b" | "draw";
  ticks: number;
  remaining_hp: number;
  score: number;
  at_ms: number;
};

export type Db = DatabaseSync;
export type Stmt = StatementSync;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS submissions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  date          TEXT    NOT NULL,
  user          TEXT    NOT NULL,
  display_name  TEXT,
  hero          TEXT    NOT NULL,
  ability       TEXT    NOT NULL,
  outcome       TEXT    NOT NULL CHECK (outcome IN ('a','b','draw')),
  ticks         INTEGER NOT NULL,
  remaining_hp  INTEGER NOT NULL,
  score         INTEGER NOT NULL,
  at_ms         INTEGER NOT NULL,
  UNIQUE(date, user) ON CONFLICT REPLACE
);

CREATE INDEX IF NOT EXISTS idx_subs_date_score ON submissions(date, score DESC);
CREATE INDEX IF NOT EXISTS idx_subs_user_date  ON submissions(user, date);
`;

export function openDb(filePath: string): Db {
  const inMemory = filePath === ":memory:";
  let target = filePath;
  if (!inMemory) {
    const abs = isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath);
    mkdirSync(dirname(abs), { recursive: true });
    target = abs;
  }
  const db = new DatabaseSync(target);
  // node:sqlite supports PRAGMA via exec.
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA synchronous = NORMAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(SCHEMA);
  return db;
}
