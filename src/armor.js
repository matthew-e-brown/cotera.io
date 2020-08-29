import { userProgress } from '@/store';

class Armor {
  constructor(src) {
    this.tag = src.tag;
    this.name = src.name;
    this._defense = src.defense;
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
    if (this.level == 0) return this._defense;
    else return this.upgrades[this.level - 1].defense;
  }

  get nextDefense() {
    if (this.level == 4) return '??';
    else return this.upgrades[this.level].defense;
  }
}

// Default export, is mapped to the class above when exported
const armorlist = [
  {
    "tag": "head_0",
    "name": "Hylian Hood",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_0": 5 } },
      { "defense": 8, "items": { "item_0": 8, "item_1": 5 } },
      { "defense": 12, "items": { "item_1": 10, "item_12": 5 } },
      { "defense": 20, "items": { "item_12": 15, "item_73": 15 } }
    ]
  },
  {
    "tag": "body_0",
    "name": "Hylian Tunic",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_0": 5 } },
      { "defense": 8, "items": { "item_0": 8, "item_1": 5 } },
      { "defense": 12, "items": { "item_1": 10, "item_12": 5 } },
      { "defense": 20, "items": { "item_12": 15, "item_73": 15 } }
    ]
  },
  {
    "tag": "legs_0",
    "name": "Hylian Trousers",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_0": 5 } },
      { "defense": 8, "items": { "item_0": 8, "item_1": 5 } },
      { "defense": 12, "items": { "item_1": 10, "item_12": 5 } },
      { "defense": 20, "items": { "item_12": 15, "item_73": 15 } }
    ]
  },
  {
    "tag": "head_1",
    "name": "Cap of the Wild",
    "defense": 4,
    "upgrades": [
      { "defense": 7, "items": { "item_130": 10, "item_40": 2 } },
      { "defense": 12, "items": { "item_132": 5, "item_34": 2 } },
      { "defense": 18, "items": { "item_67": 5, "item_43": 2 } },
      { "defense": 28, "items": { "item_77": 1, "item_37": 2 } }
    ]
  },
  {
    "tag": "body_1",
    "name": "Tunic of the Wild",
    "defense": 4,
    "upgrades": [
      { "defense": 7, "items": { "item_130": 10, "item_39": 2 } },
      { "defense": 12, "items": { "item_132": 5, "item_33": 2 } },
      { "defense": 18, "items": { "item_67": 5, "item_42": 2 } },
      { "defense": 28, "items": { "item_77": 1, "item_36": 2 } }
    ]
  },
  {
    "tag": "legs_1",
    "name": "Trousers of the Wild",
    "defense": 4,
    "upgrades": [
      { "defense": 7, "items": { "item_130": 10, "item_38": 2 } },
      { "defense": 12, "items": { "item_132": 5, "item_32": 2 } },
      { "defense": 18, "items": { "item_67": 5, "item_41": 2 } },
      { "defense": 28, "items": { "item_77": 1, "item_35": 2 } }
    ]
  },
  {
    "tag": "head_2",
    "name": "Zora Helm",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_23": 3 } },
      { "defense": 8, "items": { "item_31": 5, "item_84": 5 } },
      { "defense": 12, "items": { "item_45": 5, "item_86": 5 } },
      { "defense": 20, "items": { "item_45": 10, "item_72": 15 } }
    ]
  },
  {
    "tag": "body_2",
    "name": "Zora Armor",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_23": 3 } },
      { "defense": 8, "items": { "item_31": 5, "item_84": 5 } },
      { "defense": 12, "items": { "item_45": 5, "item_86": 5 } },
      { "defense": 20, "items": { "item_45": 10, "item_72": 15 } }
    ]
  },
  {
    "tag": "legs_2",
    "name": "Zora Greaves",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_23": 3 } },
      { "defense": 8, "items": { "item_31": 5, "item_84": 5 } },
      { "defense": 12, "items": { "item_45": 5, "item_86": 5 } },
      { "defense": 20, "items": { "item_45": 10, "item_72": 15 } }
    ]
  },
  {
    "tag": "head_3",
    "name": "Desert Voe Headband",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_9": 3 } },
      { "defense": 6, "items": { "item_9": 5, "item_27": 3 } },
      { "defense": 7, "items": { "item_27": 8, "item_47": 3 } },
      { "defense": 11, "items": { "item_47": 10, "item_70": 5 } }
    ]
  },
  {
    "tag": "body_3",
    "name": "Desert Voe Spaulder",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_9": 3 } },
      { "defense": 6, "items": { "item_9": 5, "item_27": 3 } },
      { "defense": 7, "items": { "item_27": 8, "item_47": 3 } },
      { "defense": 11, "items": { "item_47": 10, "item_70": 5 } }
    ]
  },
  {
    "tag": "legs_3",
    "name": "Desert Voe Trousers",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_9": 3 } },
      { "defense": 6, "items": { "item_9": 5, "item_27": 3 } },
      { "defense": 7, "items": { "item_27": 8, "item_47": 3 } },
      { "defense": 11, "items": { "item_47": 10, "item_70": 5 } }
    ]
  },
  {
    "tag": "head_4",
    "name": "Snowquill Headdress",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_7": 3 } },
      { "defense": 8, "items": { "item_7": 5, "item_79": 3 } },
      { "defense": 12, "items": { "item_25": 8, "item_112": 5 } },
      { "defense": 20, "items": { "item_46": 10, "item_69": 5 } }
    ]
  },
  {
    "tag": "body_4",
    "name": "Snowquill Tunic",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_7": 3 } },
      { "defense": 8, "items": { "item_7": 5, "item_79": 3 } },
      { "defense": 12, "items": { "item_25": 8, "item_112": 5 } },
      { "defense": 20, "items": { "item_46": 10, "item_69": 5 } }
    ]
  },
  {
    "tag": "legs_4",
    "name": "Snowquill Trousers",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_7": 3 } },
      { "defense": 8, "items": { "item_7": 5, "item_79": 3 } },
      { "defense": 12, "items": { "item_25": 8, "item_112": 5 } },
      { "defense": 20, "items": { "item_46": 10, "item_69": 5 } }
    ]
  },
  {
    "tag": "head_5",
    "name": "Flamebreaker Helm",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_59": 1, "item_49": 2 } },
      { "defense": 8, "items": { "item_59": 3, "item_2": 4 } },
      { "defense": 12, "items": { "item_61": 3, "item_3": 3 } },
      { "defense": 20, "items": { "item_61": 5, "item_30": 2 } }
    ]
  },
  {
    "tag": "body_5",
    "name": "Flamebreaker Armor",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_59": 1, "item_49": 2 } },
      { "defense": 8, "items": { "item_59": 3, "item_2": 4 } },
      { "defense": 12, "items": { "item_61": 3, "item_3": 3 } },
      { "defense": 20, "items": { "item_61": 5, "item_30": 2 } }
    ]
  },
  {
    "tag": "legs_5",
    "name": "Flamebreaker Boots",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_59": 1, "item_49": 2 } },
      { "defense": 8, "items": { "item_59": 3, "item_2": 4 } },
      { "defense": 12, "items": { "item_61": 3, "item_3": 3 } },
      { "defense": 20, "items": { "item_61": 5, "item_30": 2 } }
    ]
  },
  {
    "tag": "head_6",
    "name": "Stealth Mash",
    "defense": 2,
    "upgrades": [
      { "defense": 4, "items": { "item_80": 3 } },
      { "defense": 6, "items": { "item_80": 5, "item_52": 5 } },
      { "defense": 9, "items": { "item_117": 8, "item_98": 5 } },
      { "defense": 16, "items": { "item_90": 10, "item_81": 5 } }
    ]
  },
  {
    "tag": "body_6",
    "name": "Stealth Chest Guard",
    "defense": 2,
    "upgrades": [
      { "defense": 4, "items": { "item_80": 3 } },
      { "defense": 6, "items": { "item_80": 5, "item_52": 5 } },
      { "defense": 9, "items": { "item_117": 8, "item_98": 5 } },
      { "defense": 16, "items": { "item_90": 10, "item_81": 5 } }
    ]
  },
  {
    "tag": "legs_6",
    "name": "Stealth Tights",
    "defense": 2,
    "upgrades": [
      { "defense": 4, "items": { "item_80": 3 } },
      { "defense": 6, "items": { "item_80": 5, "item_52": 5 } },
      { "defense": 9, "items": { "item_117": 8, "item_98": 5 } },
      { "defense": 16, "items": { "item_90": 10, "item_81": 5 } }
    ]
  },
  {
    "tag": "head_7",
    "name": "Climber's Bandanna",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_24": 3, "item_114": 3 } },
      { "defense": 8, "items": { "item_26": 5, "item_58": 5 } },
      { "defense": 12, "items": { "item_27": 5, "item_55": 10 } },
      { "defense": 20, "items": { "item_25": 5, "item_83": 15 } }
    ]
  },
  {
    "tag": "body_7",
    "name": "Climbing Gear",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_24": 3, "item_114": 3 } },
      { "defense": 8, "items": { "item_26": 5, "item_58": 5 } },
      { "defense": 12, "items": { "item_27": 5, "item_55": 10 } },
      { "defense": 20, "items": { "item_25": 5, "item_83": 15 } }
    ]
  },
  {
    "tag": "legs_7",
    "name": "Climbing Boots",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_24": 3, "item_114": 3 } },
      { "defense": 8, "items": { "item_26": 5, "item_58": 5 } },
      { "defense": 12, "items": { "item_27": 5, "item_55": 10 } },
      { "defense": 20, "items": { "item_25": 5, "item_83": 15 } }
    ]
  },
  {
    "tag": "head_8",
    "name": "Radiant Mask",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_74": 5, "item_12": 3 } },
      { "defense": 8, "items": { "item_74": 8, "item_3": 3 } },
      { "defense": 12, "items": { "item_74": 10, "item_16": 2 } },
      { "defense": 20, "items": { "item_74": 20, "item_6": 1 } }
    ]
  },
  {
    "tag": "body_8",
    "name": "Radiant Shirt",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_74": 5, "item_12": 3 } },
      { "defense": 8, "items": { "item_74": 8, "item_3": 3 } },
      { "defense": 12, "items": { "item_74": 10, "item_16": 2 } },
      { "defense": 20, "items": { "item_74": 20, "item_6": 1 } }
    ]
  },
  {
    "tag": "legs_8",
    "name": "Radiant Tights",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_74": 5, "item_12": 3 } },
      { "defense": 8, "items": { "item_74": 8, "item_3": 3 } },
      { "defense": 12, "items": { "item_74": 10, "item_16": 2 } },
      { "defense": 20, "items": { "item_74": 20, "item_6": 1 } }
    ]
  },
  {
    "tag": "head_9",
    "name": "Soldier's Helm",
    "defense": 4,
    "upgrades": [
      { "defense": 7, "items": { "item_10": 5, "item_12": 3 } },
      { "defense": 12, "items": { "item_24": 5, "item_3": 3 } },
      { "defense": 18, "items": { "item_45": 5, "item_30": 3 } },
      { "defense": 28, "items": { "item_5": 4, "item_6": 2 } }
    ]
  },
  {
    "tag": "body_9",
    "name": "Soldier's Armor",
    "defense": 4,
    "upgrades": [
      { "defense": 7, "items": { "item_10": 5, "item_12": 3 } },
      { "defense": 12, "items": { "item_24": 5, "item_3": 3 } },
      { "defense": 18, "items": { "item_45": 5, "item_30": 3 } },
      { "defense": 28, "items": { "item_5": 4, "item_6": 2 } }
    ]
  },
  {
    "tag": "legs_9",
    "name": "Soldier's Greaves",
    "defense": 4,
    "upgrades": [
      { "defense": 7, "items": { "item_10": 5, "item_12": 3 } },
      { "defense": 12, "items": { "item_24": 5, "item_3": 3 } },
      { "defense": 18, "items": { "item_45": 5, "item_30": 3 } },
      { "defense": 28, "items": { "item_5": 4, "item_6": 2 } }
    ]
  },
  {
    "tag": "head_10",
    "name": "Ancient Helm",
    "defense": 4,
    "upgrades": [
      { "defense": 7, "items": { "item_18": 5, "item_19": 5 } },
      { "defense": 12, "items": { "item_19": 15, "item_17": 10 } },
      { "defense": 18, "items": { "item_20": 15, "item_21": 5 } },
      { "defense": 28, "items": { "item_77": 1, "item_22": 2 } }
    ]
  },
  {
    "tag": "body_10",
    "name": "Ancient Cuirass",
    "defense": 4,
    "upgrades": [
      { "defense": 7, "items": { "item_18": 5, "item_19": 5 } },
      { "defense": 12, "items": { "item_19": 15, "item_17": 10 } },
      { "defense": 18, "items": { "item_20": 15, "item_21": 5 } },
      { "defense": 28, "items": { "item_77": 1, "item_22": 2 } }
    ]
  },
  {
    "tag": "legs_10",
    "name": "Ancient Greaves",
    "defense": 4,
    "upgrades": [
      { "defense": 7, "items": { "item_18": 5, "item_19": 5 } },
      { "defense": 12, "items": { "item_19": 15, "item_17": 10 } },
      { "defense": 18, "items": { "item_20": 15, "item_21": 5 } },
      { "defense": 28, "items": { "item_77": 1, "item_22": 2 } }
    ]
  },
  {
    "tag": "head_11",
    "name": "Rubber Helm",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_8": 3 } },
      { "defense": 8, "items": { "item_8": 5, "item_104": 5 } },
      { "defense": 12, "items": { "item_113": 5, "item_48": 5 } },
      { "defense": 20, "items": { "item_48": 10, "item_71": 10 } }
    ]
  },
  {
    "tag": "body_11",
    "name": "Rubber Armor",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_8": 3 } },
      { "defense": 8, "items": { "item_8": 5, "item_104": 5 } },
      { "defense": 12, "items": { "item_113": 5, "item_48": 5 } },
      { "defense": 20, "items": { "item_48": 10, "item_71": 10 } }
    ]
  },
  {
    "tag": "legs_11",
    "name": "Rubber Tights",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_8": 3 } },
      { "defense": 8, "items": { "item_8": 5, "item_104": 5 } },
      { "defense": 12, "items": { "item_113": 5, "item_48": 5 } },
      { "defense": 20, "items": { "item_48": 10, "item_71": 10 } }
    ]
  },
  {
    "tag": "head_12",
    "name": "Barbarian Helm",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_4": 1 } },
      { "defense": 6, "items": { "item_4": 3, "item_5": 2 } },
      { "defense": 7, "items": { "item_5": 4, "item_6": 1 } },
      { "defense": 11, "items": { "item_6": 2, "item_35": 1 } }
    ]
  },
  {
    "tag": "body_12",
    "name": "Barbarian Armor",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_4": 1 } },
      { "defense": 6, "items": { "item_4": 3, "item_5": 2 } },
      { "defense": 7, "items": { "item_5": 4, "item_6": 1 } },
      { "defense": 11, "items": { "item_6": 2, "item_37": 1 } }
    ]
  },
  {
    "tag": "legs_12",
    "name": "Barbarian Leg Wraps",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_4": 1 } },
      { "defense": 6, "items": { "item_4": 3, "item_5": 2 } },
      { "defense": 7, "items": { "item_5": 4, "item_6": 1 } },
      { "defense": 11, "items": { "item_6": 2, "item_36": 1 } }
    ]
  },
  {
    "tag": "body_13",
    "name": "Champion's Tunic",
    "defense": 5,
    "upgrades": [
      { "defense": 8, "items": { "item_81": 3 } },
      { "defense": 14, "items": { "item_81": 3, "item_37": 2 } },
      { "defense": 22, "items": { "item_81": 3, "item_36": 2 } },
      { "defense": 32, "items": { "item_81": 10, "item_35": 2 } }
    ]
  },
  {
    "tag": "legs_13",
    "name": "Sand Boots",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_15": 5, "item_58": 10 } },
      { "defense": 8, "items": { "item_15": 10, "item_126": 10 } },
      { "defense": 12, "items": { "item_16": 2, "item_114": 15 } },
      { "defense": 18, "items": { "item_16": 4, "item_83": 15 } }
    ]
  },
  {
    "tag": "legs_14",
    "name": "Snow Boots",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_13": 5, "item_58": 10 } },
      { "defense": 8, "items": { "item_44": 5, "item_126": 10 } },
      { "defense": 12, "items": { "item_14": 5, "item_114": 15 } },
      { "defense": 18, "items": { "item_39": 2, "item_83": 15 } }
    ]
  },
  {
    "tag": "head_13",
    "name": "Diamond Circlet",
    "defense": 4,
    "upgrades": [
      { "defense": 7, "items": { "item_68": 2, "item_76": 3 } },
      { "defense": 12, "items": { "item_68": 4, "item_76": 3 } },
      { "defense": 18, "items": { "item_68": 6, "item_77": 1 } },
      { "defense": 28, "items": { "item_68": 10, "item_77": 1 } }
    ]
  },
  {
    "tag": "head_14",
    "name": "Ruby Circlet",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_69": 2, "item_76": 3 } },
      { "defense": 8, "items": { "item_69": 4, "item_76": 3 } },
      { "defense": 12, "items": { "item_69": 6, "item_77": 1 } },
      { "defense": 20, "items": { "item_69": 10, "item_77": 1 } }
    ]
  },
  {
    "tag": "head_15",
    "name": "Sapphire Circlet",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_70": 2, "item_76": 3 } },
      { "defense": 8, "items": { "item_70": 4, "item_76": 3 } },
      { "defense": 12, "items": { "item_70": 6, "item_77": 1 } },
      { "defense": 20, "items": { "item_70": 10, "item_77": 1 } }
    ]
  },
  {
    "tag": "head_16",
    "name": "Topaz Earrings",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_71": 2, "item_76": 3 } },
      { "defense": 8, "items": { "item_71": 4, "item_76": 3 } },
      { "defense": 12, "items": { "item_71": 6, "item_77": 1 } },
      { "defense": 18, "items": { "item_71": 10, "item_77": 1 } }
    ]
  },
  {
    "tag": "head_17",
    "name": "Opal Earrings",
    "defense": 3,
    "upgrades": [
      { "defense": 5, "items": { "item_72": 5, "item_76": 3 } },
      { "defense": 8, "items": { "item_72": 8, "item_76": 3 } },
      { "defense": 12, "items": { "item_72": 16, "item_76": 3 } },
      { "defense": 22, "items": { "item_72": 20, "item_76": 3 } }
    ]
  },
  {
    "tag": "head_18",
    "name": "Amber Earrings",
    "defense": 4,
    "upgrades": [
      { "defense": 7, "items": { "item_73": 5, "item_76": 3 } },
      { "defense": 12, "items": { "item_73": 10, "item_76": 3 } },
      { "defense": 18, "items": { "item_73": 20, "item_76": 3 } },
      { "defense": 28, "items": { "item_73": 30, "item_76": 3 } }
    ]
  },
  {
    "tag": "head_19",
    "name": "Vah Ruta Divine Helm",
    "defense": 4,
    "upgrades": [
      { "defense": 7, "items": { "item_18": 5, "item_19": 5 } },
      { "defense": 12, "items": { "item_19": 15, "item_17": 10 } },
      { "defense": 18, "items": { "item_20": 15, "item_21": 5 } },
      { "defense": 28, "items": { "item_77": 1, "item_22": 2 } }
    ]
  },
  {
    "tag": "head_20",
    "name": "Vah Medoh Divine Helm",
    "defense": 4,
    "upgrades": [
      { "defense": 7, "items": { "item_18": 5, "item_19": 5 } },
      { "defense": 12, "items": { "item_19": 15, "item_17": 10 } },
      { "defense": 18, "items": { "item_20": 15, "item_21": 5 } },
      { "defense": 28, "items": { "item_77": 1, "item_22": 2 } }
    ]
  },
  {
    "tag": "head_21",
    "name": "Vah Rudania Divine Helm",
    "defense": 4,
    "upgrades": [
      { "defense": 7, "items": { "item_18": 5, "item_19": 5 } },
      { "defense": 12, "items": { "item_19": 15, "item_17": 10 } },
      { "defense": 18, "items": { "item_20": 15, "item_21": 5 } },
      { "defense": 28, "items": { "item_77": 1, "item_22": 2 } }
    ]
  },
  {
    "tag": "head_22",
    "name": "Vah Naboris Divine Helm",
    "defense": 4,
    "upgrades": [
      { "defense": 7, "items": { "item_18": 5, "item_19": 5 } },
      { "defense": 12, "items": { "item_19": 15, "item_17": 10 } },
      { "defense": 18, "items": { "item_20": 15, "item_21": 5 } },
      { "defense": 28, "items": { "item_77": 1, "item_22": 2 } }
    ]
  }
];

export default armorlist.map(a => new Armor(a));

export const sets = [
  {
    "tag": "set_0",
    "name": "Hylian Set",
    "pieces": [ "head_0", "body_0", "legs_0" ]
  },
  {
    "tag": "set_1",
    "name": "Hero of the Wild Set",
    "pieces": [ "head_1", "body_1", "legs_1" ]
  },
  {
    "tag": "set_2",
    "name": "Zora Set",
    "pieces": [ "head_2", "body_2", "legs_2" ]
  },
  {
    "tag": "set_3",
    "name": "Desert Voe Set",
    "pieces": [ "head_3", "body_3", "legs_3" ]
  },
  {
    "tag": "set_4",
    "name": "Snowquill Set",
    "pieces": [ "head_4", "body_4", "legs_4" ]
  },
  {
    "tag": "set_5",
    "name": "Flamebreaker Set",
    "pieces": [ "head_5", "body_5", "legs_5" ]
  },
  {
    "tag": "set_6",
    "name": "Stealth Set",
    "pieces": [ "head_6", "body_6", "legs_6" ]
  },
  {
    "tag": "set_7",
    "name": "Climber's Set",
    "pieces": [ "head_7", "body_7", "legs_7" ]
  },
  {
    "tag": "set_8",
    "name": "Radiant Set",
    "pieces": [ "head_8", "body_8", "legs_8" ]
  },
  {
    "tag": "set_9",
    "name": "Solider's Set",
    "pieces": [ "head_9", "body_9", "legs_9" ]
  },
  {
    "tag": "set_10",
    "name": "Ancient Set",
    "pieces": [ "head_10", "body_10", "legs_10" ]
  },
  {
    "tag": "set_11",
    "name": "Rubber Set",
    "pieces": [ "head_11", "body_11", "legs_11" ]
  },
  {
    "tag": "set_12",
    "name": "Barbarian Set",
    "pieces": [ "head_12", "body_12", "legs_12" ]
  },
  {
    "tag": "set_13",
    "name": "Jewelry",
    "pieces": [ "head_13", "head_14", "head_15", "head_16", "head_17", "head_18" ]
  },
  {
    "tag": "set_14",
    "name": "Others",
    "pieces": [ "body_13", "legs_13", "legs_14", "head_19", "head_20", "head_21", "head_22" ]
  }
];