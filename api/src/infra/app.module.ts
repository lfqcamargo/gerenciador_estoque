import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { HttpModule } from "./http/http.module";
import { EnvModule } from "./env/env.module";
import { envSchema } from "./env/env";
import { CacheModule } from "./cache/cache.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
    CacheModule,
  ],
})
export class AppModule {}
