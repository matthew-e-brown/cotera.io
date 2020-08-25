// Don't really need Vuex for an app this small. This is simply a
// source-of-truth for some global application stuff.

export default {
  signedin: false,
  user: {
    name: '',
    uid: null,
  }
}