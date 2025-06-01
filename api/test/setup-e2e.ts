import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "../generated/prisma";
import { config } from "dotenv";
import { envSchema } from "../src/infra/env/env";
import { beforeAll, afterAll, beforeEach } from "vitest";

config({ path: ".env", override: true });
config({ path: ".env.test", override: true });

const env = envSchema.parse(process.env);

let prisma: PrismaClient;

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error("Please provider a DATABASE_URL environment variable");
  }

  const url = new URL(env.DATABASE_URL);
  url.searchParams.set("schema", schemaId);
  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);
  process.env.DATABASE_URL = databaseURL;

  execSync("npx prisma migrate deploy");

  prisma = new PrismaClient();
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});

// Limpa o banco de dados antes de cada teste
beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
});
