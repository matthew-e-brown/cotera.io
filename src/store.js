// Don't really need Vuex for an app this small. This is simply a
// source-of-truth for some global application stuff.

export default {
  signedin: false,
  userid: null,
  selected: null,
  // Used only if unavailable from Firestore
  userProgress: {
    // default values, strings of "000...000"
    head: Array(23).fill('0').join(''),
    body: Array(14).fill('0').join(''),
    legs: Array(15).fill('0').join(''),
  },
};