import Vue from 'vue';

const state = Vue.observable({
  userid: undefined,
  selected: undefined,
  get signedin() { return this.userid != undefined; },
});

const userProgress = Vue.observable({
  head: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  body: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  legs: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
});

export default state;
export { userProgress };