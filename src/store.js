const state = {
  userid: undefined,
  selected: undefined,
  get signedin() { return this.userid != undefined; },
};

export default state;

export const userProgress = {
  head: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  body: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  legs: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  levelUp: function(armor) {
    if (this[armor.type][armor.indx] < 4) this[armor.type][armor.indx] += 1;
  },
  levelDown: function(armor) {
    if (this[armor.type][armor.indx] > 0) this[armor.type][armor.indx] -= 1;
  }
}