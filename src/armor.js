import { userProgress } from '@/store';
import rawArmorList from '@/assets/data/armor.json';
import rawAmiiboList from '@/assets/data/amiibo.json';

class Armor {
  constructor(src) {
    this.tag = src.tag;
    this.name = src.name;
    this.baseDefense = src.defense;
    this.upgrades = src.upgrades;
    [ this.type, this.indx ] = src.tag.split('_');
  }

  get sprite() {
    return `/images/${this.type}/${this.tag}.png`;
  }

  get level() {
    return userProgress[this.type][this.indx];
  }

  get defense() {
    if (this.level == 0) return this.baseDefense;
    else return this.upgrades[this.level - 1].defense;
  }

  get nextDefense() {
    if (this.level == 4) return NaN;
    else return this.upgrades[this.level].defense;
  }

  get nextItems() {
    if (this.level == 4) return [];
    else return Object.entries(this.upgrades[this.level].items);
  }
}

export default rawArmorList.map(a => new Armor(a));
export const amiibo= rawAmiiboList.map(a => new Armor(a));