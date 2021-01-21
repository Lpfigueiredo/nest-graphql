import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsModule } from './emails/emails.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'nest-graphql',
      synchronize: true,
      autoLoadEntities: true,
    }),
    EmailsModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
  ],
})
export class AppModule {}
