import { faker } from '@faker-js/faker';

import { User } from '@shared/interfaces';

export function generateOneCustomer(): User {
  return generateOneUser('customer');
}

export function generateOneAdmin(): User {
  return generateOneUser('admin');
}

function generateOneUser(role: User['role']): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.internet.userName(),
    password: faker.internet.password(),
    role,
  };
}
