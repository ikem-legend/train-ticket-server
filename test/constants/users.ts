import { Users, UserStatus } from '../../src/users/entities/users.entity';

export const sampleUser: Omit<Users, '_id' | '__v' | 'password'> = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
  phone: '08081234567',
  userId: 100001,
  dateOfBirth: new Date('1995-05-28T00:00:00.000Z'),
  confirmationToken: '033f8198-2746-4689-a29f-93911c5d449d',
  status: UserStatus.Active,
};

const newUser: Omit<Users, '_id' | '__v' | 'password'> = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
  phone: '08081234567',
  userId: 100001,
  dateOfBirth: new Date('1995-05-28T00:00:00.000Z'),
  confirmationToken: '033f8198-2746-4689-a29f-93911c5d449d',
  status: UserStatus.Active,
};

export const userList = [sampleUser, newUser];
