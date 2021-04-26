import { ItemTag } from '@/items';
import { syncedState } from '@/state';

import rawArmorList from '@/assets/data/armor.json';
import rawAmiiboList from '@/assets/data/amiibo.json';

export type ArmorLevel = 0 | 1 | 2 | 3 | 4;
export type ArmorType = 'head' | 'body' | 'legs';
export type ArmorTag = `${ArmorType}_${number}`;
export type Upgrade = {
  defense: number;
  items: Map<ItemTag, number>;
};

export class Armor {
  public readonly name: string;
  public readonly upgrades: Upgrade[];
  public readonly type: ArmorType;
  public readonly indx: number;

  private baseDefense: number;

  constructor(json: any) {
    this.name = json.name;
    this.baseDefense = json.defense;

    this.upgrades = json.upgrades.map((upgrade: any) => {
      const items = new Map<ItemTag, number>();

      Object.keys(upgrade.items).forEach(tag => {
        items.set(tag as ItemTag, upgrade.items[tag]);
      });

      return { defense: upgrade.defense, items };
    });

    const split = json.tag.split('_');
    this.type = split[0];
    this.indx = Number(split[1]);
  }

  public get tag(): ArmorTag {
    return `${this.type}_${this.indx}` as ArmorTag;
  }

  public get level(): ArmorLevel {
    return syncedState.progress[this.type][this.indx];
  }

  public get sprite(): string {
    return `/images/${this.type}/${this.tag}.png`;
  }

  public get defense(): number {
    if (this.level == 0) return this.baseDefense;
    else return this.upgrades[this.level - 1].defense;
  }

  public get nextDefense(): number {
    if (this.level + 1 >= 5) return NaN;
    else return this.upgrades[this.level].defense;
  }

  public get itemsToUpgrade(): Map<ItemTag, number> {
    if (this.level + 1 >= 5) return new Map<ItemTag, number>();
    else return this.upgrades[this.level].items;
  }

}

const armorList = rawArmorList.map(armor => new Armor(armor));
const amiiboList = rawAmiiboList.map(armor => new Armor(armor));

const counts = { head: 0, body: 0, legs: 0 };
([] as Armor[]).concat(armorList, amiiboList).forEach(armor => {
  counts[armor.type] += 1;
});

export default armorList;
export { amiiboList, counts };