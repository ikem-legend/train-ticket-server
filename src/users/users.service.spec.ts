import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Document, Model } from 'mongoose';
import { sampleUser, userList } from '../../test/constants/users';
import { UsersService } from './users.service';
import { Users } from './entities/users.entity';

type MockModel<T = any> = Partial<Record<keyof Model<Document<T>>, jest.Mock>>;

const createMockModel = <T = any>(): MockModel<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  create: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userModel: MockModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(Users.name), useValue: createMockModel() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<MockModel>(getModelToken(Users.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when user with email exists', () => {
      it('should return the user object', async () => {
        const userEmail = 'johndoe@example.com';
        userModel.findOne.mockImplementationOnce(() => ({
          lean: jest.fn().mockReturnValue(sampleUser),
        }));
        const user = await service.findOne(userEmail);
        expect(user).toEqual(sampleUser);
      });
    });
    describe('otherwise', () => {
      it('should return null', async () => {
        const userEmail = 'test@example.com';

        userModel.findOne.mockImplementationOnce(() => ({
          lean: jest.fn().mockReturnValue(null),
        }));
        const user = await service.findOne(userEmail);
        expect(user).toBeNull();
      });
    });
  });

  describe('edit', () => {
    describe('when user with ID exists', () => {
      it('should update the user information with the given details', async () => {
        const userId = '100001';
        const data = {
          dateOfBirth: new Date('1995-05-28T00:00:00.000Z'),
          phone: '08087654321',
        };
        const updatedUser = { ...sampleUser, data };
        userModel.findOneAndUpdate.mockReturnValue(updatedUser);
        const editedUser = await service.edit(userId, data);
        expect(editedUser).toEqual('User edited successfully');
      });
    });

    describe('otherwise', () => {
      it('should throw an NotFoundException error', () => {
        const userId = '100005';
        const data = {
          dateOfBirth: new Date('1995-05-28T00:00:00.000Z'),
          phone: '08087654321',
        };
        userModel.findOneAndUpdate.mockResolvedValue(null);
        expect(service.edit(userId, data)).rejects.toThrow('User not found');
        expect(service.edit(userId, data)).rejects.toBeInstanceOf(
          NotFoundException,
        );
      });
    });
  });

  describe('findAll', () => {
    describe('when users exist in the database', () => {
      it('should return all the users in the database', async () => {
        userModel.find.mockImplementationOnce(() => ({
          lean: jest.fn().mockReturnValue(userList),
        }));
        const allUsers = await service.findAll();
        expect(allUsers).toEqual(userList);
      });
    });
  });
});
