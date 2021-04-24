import { progress } from '@/state';

import rawArmorList from '@/assets/data/armor.json';
import rawAmiiboList from '@/assets/data/amiibo-armor.json';


/**
 * Internal representation of an armor-item that wraps the raw JSON data with
 * getters for different properties to help provide error checking.
 */
class Armor {
  constructor(srcJson) {
    this.tag = srcJson.tag;           // Internal ID, ex. head_13
    this.name = srcJson.name;         // The item's name
    this.baseDefense = src.defense;   // The items defense without upgrades
    this.upgrades = src.upgrades;     // List of item upgrades
    [ this.type, this.indx ] = src.tag.split('_');
  }

  get sprite() {
    return `/images/${this.type}/${this.tag}.png`;
  }

  get level() {
    return progress[this.type][this.indx];
  }

  get defense() {
    if (this.level == 0) return this.baseDefense;
    else return this.upgrades[this.level - 1].defense;
  }

  get nextDefense() {
    if (this.level + 1 >= 5) return NaN;
    else return this.upgrades[this.level].defense;
  }

  get itemsToUpgrade() {
    if (this.level + 1 >= 5) return [];
    else return Object.entries(this.upgrades[this.level].items);
  }
}


export { Armor };
export const armor = rawArmorList.map(a => new Armor(a));
export const amiiboArmor = rawAmiiboList.map(a => new Armor(a));