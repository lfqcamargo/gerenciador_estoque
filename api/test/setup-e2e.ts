import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "../generated/prisma";
import { config } from "dotenv";
import { envSchema } from "../src/infra/env/env";
import { beforeAll, afterAll } from "vitest";
import Redis from "ioredis";
import { DomainEvents } from "@/core/events/domain-events";

config({ path: ".env", override: true });
config({ path: ".env.test", override: true });

const env = envSchema.parse(process.env);

const prisma = new PrismaClient();
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
});

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

  DomainEvents.shouldRun = false;

  await redis.flushdb();

  execSync("npx prisma migrate deploy");
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
  await redis.flushdb();
});

// // Limpa o banco de dados antes de cada teste
// beforeEach(async () => {
//   await prisma.user.deleteMany();
//   await prisma.company.deleteMany();
// });
