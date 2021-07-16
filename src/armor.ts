import { watch, toRef } from 'vue';

import { ItemTag } from '@/items';
import {
  ArmorType, ArmorTag, ArmorLevel, ArmorSet, Upgrade
} from '@/types/armor';

import store, { SortChoice } from '@/store';
import rawArmorList from '@/assets/data/armor.json';
import rawAmiiboList from '@/assets/data/amiibo.json';
import armorSets from '@/assets/data/armor-sets.json';
import amiiboSets from '@/assets/data/amiibo-sets.json';

export class Armor {
  public readonly name: string;
  public readonly type: ArmorType;
  public readonly indx: number;

  private readonly upgrades: Upgrade[];
  readonly baseDefense: number;

  constructor(json: any) {
    this.name = json.name;
    this.baseDefense = json.defense;

    this.upgrades = json.upgrades.map((upgrade: any) => {
      const items: [ ItemTag, number ][] = [];

      Object.keys(upgrade.items).forEach(tag => {
        items.push([tag as ItemTag, upgrade.items[tag]]);
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
    return store.state.progress[this.type][this.indx];
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

  public get itemsToUpgrade(): [ ItemTag, number ][] {
    if (this.level + 1 >= 5) return [];
    else return this.upgrades[this.level].items;
  }

}

const armorList = rawArmorList.map(armor => new Armor(armor));
const amiiboList = rawAmiiboList.map(armor => new Armor(armor));

const sortList = (armor: Armor[], sets: ArmorSet[], method: SortChoice) => {
  // Sort the array based on this secondary array, made up of just
  // `head_0`, `body_0`, `legs_0`, `head_1`, `body_1`, `legs_1` ...
  const order = sets.reduce(
    (acc, cur) => [ ...acc, ...cur.pieces ],
    [] as ArmorTag[]
  );

  if (method == SortChoice.Type) {
    // Change the order of the 'order' array, so that instead of
    // -> head, body, legs, head, body, legs
    // it's
    // -> head, head, body, body, legs, legs

    const o = [ 'head', 'body', 'legs' ];
    order.sort((a, b): number => {
      const aType = a.substring(0, a.lastIndexOf('_'));
      const bType = b.substring(0, b.lastIndexOf('_'));
      if (aType == bType) return 0; // heads stay with heads, etc.
      else return o.indexOf(aType) - o.indexOf(bType);
    });

  }

  const lastHeadgear = /head_(?:1[345678]|2[56789])/;
  armor.sort((a, b): number => {
    // Special exceptions:

    // Champion's tunic go first
    if (a.tag == 'body_13') return -1;
    else if (b.tag == 'body_13') return 1;

    // Jewelry and Divine Headgear go last
    else if (lastHeadgear.test(a.tag)) {
      // Special headgear stays in default order relative to other headgear
      if (!lastHeadgear.test(b.tag)) return 1;  // all other armors
      else return 0;                            // against other headgear
    }

    else return order.indexOf(a.tag) - order.indexOf(b.tag);
  });
}

// Re-sort lists on preference change
watch(toRef(store.state.prefs, 'sortOrder'), newVal => {
  sortList(armorList, armorSets as ArmorSet[], newVal);
  sortList(amiiboList, amiiboSets as ArmorSet[], newVal);
}, { immediate: true });

export default armorList;
export { amiiboList };