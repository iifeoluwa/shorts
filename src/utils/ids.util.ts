import { nanoid } from 'nanoid/async';

export const generateID = (length: number) => {
  return nanoid(length);
};
