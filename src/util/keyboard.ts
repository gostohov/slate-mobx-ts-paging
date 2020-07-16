import { keys, IKey } from './keys';

export const hasEffect = (keyCode: number): boolean => {
  const key = keys.find(k => k.code === keyCode);
  return key?.effect!;
}