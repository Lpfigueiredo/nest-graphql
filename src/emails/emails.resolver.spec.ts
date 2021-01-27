import { Test, TestingModule } from '@nestjs/testing';
import { EmailsResolver } from './emails.resolver';
import { EmailsService } from './emails.service';

describe('EmailsResolver', () => {
  let resolver: EmailsResolver;
  let service: EmailsService;

  const mockData = {
    email: 'any@email.com',
    name: 'any_name',
  };

  const serviceFactory = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailsResolver,
        {
          provide: EmailsService,
          useFactory: () => serviceFactory,
        },
      ],
    }).compile();

    resolver = module.get<EmailsResolver>(EmailsResolver);
    service = module.get<EmailsService>(EmailsService);
  });

  describe('findAll()', () => {
    it('should call service.findAll', async () => {
      await resolver.findAll();
      expect(service.findAll).toBeCalled();
    });

    it('should return service.findAll return', async () => {
      (service.findAll as jest.Mock).mockReturnValue([mockData]);
      expect(await resolver.findAll()).toEqual([mockData]);
    });
  });

  describe('findOne()', () => {
    it('should call service.findOne with correct value', async () => {
      await resolver.findOne(mockData.email);
      expect(service.findOne).toBeCalledWith(mockData.email);
    });

    it('should return service.findOne return', async () => {
      (service.findOne as jest.Mock).mockReturnValue(mockData);
      expect(await resolver.findOne(mockData.email)).toEqual(mockData);
    });
  });

  describe('createEmail()', () => {
    it('should call service.create with correct params', async () => {
      await resolver.createEmail(mockData);
      expect(service.create).toBeCalledWith(mockData);
    });

    it('should return service.create return', async () => {
      (service.create as jest.Mock).mockReturnValue(mockData);
      expect(await resolver.createEmail(mockData)).toEqual(mockData);
    });
  });

  describe('updateEmail()', () => {
    it('should call service.update with correct params', async () => {
      await resolver.updateEmail(mockData);
      expect(service.update).toBeCalledWith(mockData);
    });

    it('should return service.update return', async () => {
      (service.update as jest.Mock).mockReturnValue(mockData);
      expect(await resolver.updateEmail(mockData)).toEqual(mockData);
    });
  });

  describe('removeEmail()', () => {
    it('should call service.remove with correct value', async () => {
      await resolver.removeEmail(mockData.email);
      expect(service.remove).toBeCalledWith(mockData.email);
    });

    it('should return service.remove return', async () => {
      (service.remove as jest.Mock).mockReturnValue(mockData);
      expect(await resolver.removeEmail(mockData.email)).toEqual(mockData);
    });
  });
});
