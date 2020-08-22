/* This script:
 *
 * 1.  Truncates all the data in the 'armor' and 'items' collections on
 *     Firestore.
 * 2.  Reads whatever is in /setup/armor.js and /setup/items.js and imports that
 *     into Firestore.
 *
 * Running it *shouldn't* cause any problems, since it doesn't replace any user
 * data, but it should only need to be run if changes to the data-structure are
 * made. It'll probably only get run once, ever.
 */

const credentials = require('../firebase.json');
const { firebase } = require('@firebase/app');
require('@firebase/firestore');

const { armor, sets } = require('./armor');
const items = require('./items');

const firebaseApp = firebase.initializeApp(credentials);
const db = firebaseApp.firestore();

const main = async () => {
  console.log('Truncating...');

  // Don't need to worry about doing it in batches, since there's not very many
  // items
  for (const collection of ['armor', 'items', 'armor-sets']) {
    await db.collection(collection).get().then(async snapshot => {
      const batch = db.batch();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));

      console.log(`Committing ${collection} deletion...`);
      await batch.commit();
    });
  }

  console.log('Importing...');

  // Add all items first
  await Promise.all(items.map(async item => {
    // Pull the tag off the item
    const { tag, ...itemWithoutTag } = item;
    const ref = db.collection('items').doc(tag);
    await ref.set(itemWithoutTag);
    console.log(`Added item: ${tag}`);

    // Attach DocumentReference to the item object
    item.ref = ref;
    return item;
  }));

  // Add all armor next
  await Promise.all(armor.map(async armorPiece => {
    // Each upgrade's (↓↓↓) items' property is pulled from that level
    for (const [i, { items }] of armorPiece.upgrades.entries()) {
      // item.upgrades: the list of all upgrades,
      // item.upgrades[n].items: the items required for the nth upgrade
      armorPiece.upgrades[i].items = Object.entries(items)
        .map(([itemTag, quantity]) => {
          // Get the itemRef for each upgrade
          return {
            item: db.collection('items').doc(itemTag),
            quantity
          };
        });
    }

    const { tag, ...itemWithoutTag } = armorPiece;
    const ref = db.collection('armor').doc(tag);
    await ref.set(itemWithoutTag);
    console.log(`Added armor: ${tag}`);

    armorPiece.ref = ref;
    return armorPiece;
  }));

  // Add all the armor-sets
  await Promise.all(sets.map(async armorSet => {
    // Turn all the 'tag' references into actual DocumentReferences
    armorSet.pieces = armorSet.pieces
      .map(piece => db.collection('armor').doc(piece));

    const { tag, ...itemWithoutTag } = armorSet;
    const ref = db.collection('armor-sets').doc(tag);
    await ref.set(itemWithoutTag);
    console.log(`Added armor-set: ${tag}`);

    // Now, go back through the pieces and give them a reference to this new set
    armorSet.pieces.forEach(piece => piece.set({ set: ref }, { merge: true }));

    armorSet.ref = ref;
    return armorSet;
  }));

  return;
}

main().then(() => {
  console.log('Finished!');
  process.exitCode = 0;
  process.exit();
});