import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validateOrReject } from 'class-validator';
import { Repository } from 'typeorm';
import { CreateEmailInput } from './dto/create-email.input';
import { Email } from './entities/email.entity';

@Injectable()
export class EmailsService {
  constructor(
    @InjectRepository(Email) private emailRepository: Repository<Email>,
  ) {}

  async create(createEmailInput: CreateEmailInput): Promise<Email> {
    const createEmail = new Email();
    Object.assign(createEmail, createEmailInput);
    await validateOrReject(createEmail);
    return await this.emailRepository.save(createEmail);
  }

  async findAll(): Promise<Email[]> {
    return await this.emailRepository.find();
  }

  async findOne(email: string): Promise<Email> {
    return await this.emailRepository.findOne({ email });
  }

  async update({ email, name }): Promise<Email> {
    const updateEmail = await this.emailRepository.findOne({ email });
    if (!updateEmail) {
      throw new NotFoundException();
    }
    updateEmail.name = name;
    const validateEmail = new Email();
    Object.assign(validateEmail, updateEmail);
    await validateOrReject(validateEmail);
    return await this.emailRepository.save(updateEmail);
  }

  async remove(email: string): Promise<Email> {
    const deleteEmail = await this.emailRepository.findOne({ email });
    if (!deleteEmail) {
      throw new NotFoundException();
    }
    await this.emailRepository.delete({ email });
    return deleteEmail;
  }
}
