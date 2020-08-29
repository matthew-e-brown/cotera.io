const state = {
  userid: undefined,
  selected: undefined,
  get signedin() { return this.userid != undefined; },
};

export default state;

export const userProgress = {
  _head: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  _body: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  _legs: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  _update: function(field, value) {
    this[field] = value;
  },
  set head(value) { this._update('head', value); },
  set body(value) { this._update('body', value); },
  set legs(value) { this._update('legs', value); },
  get head() { return this._head },
  get body() { return this._body },
  get legs() { return this._legs },
}