import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailsService } from './emails.service';
import { Email } from './entities/email.entity';

describe('EmailsResolver', () => {
  let service: EmailsService;
  let repository: Repository<Email>;

  const mockData = {
    email: 'any@email.com',
    name: 'any_name',
  };

  const repositoryFactory = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailsService,
        {
          provide: getRepositoryToken(Email),
          useFactory: () => repositoryFactory,
        },
      ],
    }).compile();

    service = module.get<EmailsService>(EmailsService);
    repository = module.get(getRepositoryToken(Email));
  });

  describe('findAll()', () => {
    it('should call repository.find', async () => {
      await service.findAll();
      expect(repository.find).toBeCalled();
    });

    it('should return repository.find return', async () => {
      (repository.find as jest.Mock).mockReturnValue([mockData]);
      expect(await service.findAll()).toStrictEqual([mockData]);
    });
  });

  describe('findOne()', () => {
    it('should call repository.findOne', async () => {
      await service.findOne(mockData.email);
      expect(repository.findOne).toBeCalledWith({ email: mockData.email });
    });

    it('should return repository.findOne return', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(mockData);
      expect(await service.findOne(mockData.email)).toStrictEqual(mockData);
    });
  });

  describe('create()', () => {
    it('should call repository.save', async () => {
      await service.create(mockData);
      expect(repository.save).toBeCalledWith(mockData);
    });

    it('should return repository.save return', async () => {
      (repository.save as jest.Mock).mockReturnValue(mockData);
      expect(await service.create(mockData)).toStrictEqual(mockData);
    });

    it('should throw if called with invalid email', async () => {
      let error;
      try {
        await service.create({ ...mockData, email: 'invalid' });
      } catch (err) {
        error = err;
      }
      expect(error[0].property).toBe('email');
    });

    it('should throw if called with empty name', async () => {
      let error;
      try {
        await service.create({ ...mockData, name: '' });
      } catch (err) {
        error = err;
      }
      expect(error[0].property).toBe('name');
    });

    it('should throw if called with empty email', async () => {
      let error;
      try {
        await service.create({ ...mockData, email: '' });
      } catch (err) {
        error = err;
      }
      expect(error[0].property).toBe('email');
    });
  });

  describe('update()', () => {
    it('should call repository.findOne', async () => {
      await service.update(mockData);
      expect(repository.findOne).toBeCalledWith({ email: mockData.email });
    });

    it('should throw if email not exists', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(undefined);
      await expect(service.update(mockData)).rejects.toThrow(
        new NotFoundException(),
      );
    });

    it('should throw if called with empty name', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(mockData);
      let error;
      try {
        await service.update({ ...mockData, name: '' });
      } catch (err) {
        error = err;
      }
      expect(error[0].property).toBe('name');
    });

    it('should return repository.save return', async () => {
      const mockUpdatedData = { ...mockData, name: 'updated name' };
      (repository.findOne as jest.Mock).mockReturnValue(mockData);
      (repository.save as jest.Mock).mockReturnValue(mockUpdatedData);
      expect(await service.update(mockUpdatedData)).toStrictEqual(
        mockUpdatedData,
      );
      expect(repository.save).toBeCalledWith(mockUpdatedData);
    });
  });

  describe('remove()', () => {
    it('should call repository.findOne', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(mockData);
      await service.remove(mockData.email);
      expect(repository.findOne).toBeCalledWith({ email: mockData.email });
    });

    it('should throw if email not exists', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(undefined);
      await expect(service.remove(mockData.email)).rejects.toThrow(
        new NotFoundException(),
      );
    });

    it('should return removed object', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(mockData);
      expect(await service.remove(mockData.email)).toStrictEqual(mockData);
    });
  });
});
