import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import LocalSession from 'telegraf-session-local';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TaskRecord } from './app.task-record.entity';

const localSession = new LocalSession({ database: 'database.json' });

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [localSession.middleware()],
      token: process.env.BOT_TOKEN!,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      migrations: [join(__dirname, '**', '*.migration.{ts,js}')],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TaskRecord]),
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
