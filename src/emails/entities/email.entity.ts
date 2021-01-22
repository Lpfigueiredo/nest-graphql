import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, Generated, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class Email {
  @Column()
  @Generated('uuid')
  id: string;

  @PrimaryColumn()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  name: string;
}
