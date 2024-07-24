import { faker } from '@faker-js/faker';

import { Product } from '@shared/interfaces';

export const generateOneProduct = (): Product => {
  const price = parseInt(faker.commerce.price());
  return {
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    price,
    description: faker.commerce.productDescription(),
    category: {
      id: faker.number.int(),
      name: faker.commerce.department(),
    },
    images: [
      faker.image.url(),
      faker.image.url(),
    ],
    taxes: price > 0 ? price * .19 : 0,
  };
};

export const generateManyProducts = (size: number = 10): Product[] => {
  const products: Product[] = [];

  for (let index = 0; index < size; index++)
    products.push( generateOneProduct() );

  return [...products];
};
