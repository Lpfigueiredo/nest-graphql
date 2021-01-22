import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database:
    process.env.NODE_ENV === 'test' ? 'nest-graphql-test' : 'nest-graphql',
  synchronize: true,
  autoLoadEntities: true,
};
