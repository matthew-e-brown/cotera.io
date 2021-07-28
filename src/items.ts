import rawItemList from '@/assets/data/items.json';

export type ItemTag = `item_${number}`;

const itemSprites = new Map<ItemTag, string>();
const itemNames = new Map<ItemTag, string>();

rawItemList.forEach(item => {
  itemSprites.set(item.tag as ItemTag, `/images/items/${item.tag}.png`);
  itemNames.set(item.tag as ItemTag, item.name);
});

export { itemSprites, itemNames };