import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';

import { typeormConfigNest } from './config/typeorm-nest.config';

import { VideosModule } from './resources/videos/videos.module';
import { VideosResolver } from './resources/videos/videos.resolver';
import { ConfigModule } from '@nestjs/config';
import { UploadsModule } from './resources/uploads/uploads.module';
import { SchdulesModule } from './resources/schdules/schdules.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
    }),
    TypeOrmModule.forRoot(typeormConfigNest),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '.env.local', isGlobal: true }),
    VideosModule,
    UploadsModule,
    SchdulesModule,
  ],
  controllers: [AppController],
  providers: [AppService, VideosResolver],
})
export class AppModule {}
