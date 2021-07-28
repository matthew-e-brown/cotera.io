import { ItemTag } from '@/items';

import rawArmorList from '@/assets/data/armor.json';
import rawAmiiboList from '@/assets/data/amiibo.json';

export type ArmorLevel = 0 | 1 | 2 | 3 | 4;
export type ArmorType = 'head' | 'body' | 'legs';
export type ArmorTag = `${ArmorType}_${number}`;
export type Upgrade = {
  defense: number;
  items: [ ItemTag, number ][];
};

export interface ArmorSet {
  tag: `set_${number}`;
  name: string;
  pieces: ArmorTag[];
}

const counts = { head: 0, body: 0, legs: 0 };
([] as any[]).concat(rawArmorList, rawAmiiboList).forEach((armor: any) => {
  const [ type ]: [ ArmorType ] = armor.tag.split('_');
  counts[type] += 1;
});

export { counts };