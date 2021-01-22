import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.CI === 'true' ? 'postgres' : 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database:
    process.env.NODE_ENV === 'test' ? 'nest-graphql-test' : 'nest-graphql',
  synchronize: true,
  autoLoadEntities: true,
  dropSchema: process.env.NODE_ENV === 'test',
};
