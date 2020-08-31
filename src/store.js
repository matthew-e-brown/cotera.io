import Vue from 'vue';
import firebase from '@/firebase';

// General state for the app itself
const state = Vue.observable({
  userid: undefined,
  selected: undefined,
  get signedin() { return this.userid != undefined; },
});

// State for user progress
const DEFAULT_PROGRESS = {
  head: Array(23).fill(0),
  body: Array(14).fill(0),
  legs: Array(15).fill(0)
}

const userProgress = Vue.observable({ ...DEFAULT_PROGRESS });

const uploadToFirebase = () => {
  firebase.firestore()
    .collection('user-progress')
    .doc(state.userid)
    .set(
      Object.entries(userProgress)
        // Turn arrays to strings
        .map(([k, v]) => ({ [k]: v.join('') }))
        // Join [ {head: ""}, {body: ""} ] -> { head: "", body: "" }
        .reduce((acc, cur) => ({ ...acc, ...cur }))
    );
}

const levelUp = armor => {
  Vue.set(userProgress[armor.type], armor.indx, armor.level + 1);
  if (state.signedin) uploadToFirebase();
}

const levelDown = armor => {
  Vue.set(userProgress[armor.type], armor.indx, armor.level - 1);
  if (state.signedin) uploadToFirebase();
}

let unsubscribe = undefined;
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    state.userid = user.uid;

    // If they've just signed in, overwrite the blank progress object with their
    // firestore data
    unsubscribe = firebase.firestore()
      .collection('user-progress')
      .doc(state.userid)
      .onSnapshot(doc => {
        // Don't worry about it, one will be created once they edit something
        if (!doc.exists) return;
  
        // Get the numbers out of the string
        Object.entries(doc.data())
          .forEach(([k, v]) =>
            Vue.set(userProgress, k, v.split('').map(n => Number(n)))
          );
      });
  } else {
    state.userid = undefined;

    if (unsubscribe) unsubscribe();

    // Reset to default values
    Object.entries(DEFAULT_PROGRESS)
      .forEach(([k, v]) => 
        Vue.set(userProgress, k, v)
      );
  }
});

export default state;
export { userProgress, levelUp, levelDown };