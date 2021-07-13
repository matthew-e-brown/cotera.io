# How the account works

- Account `index.vue` contains an encapsulated section for `TheEmailAndPassword`
  section.
- The other two sections are simply in place: they have no logic. Instead, the
  other four buttons simply open up the Modal and have it perform their jobs.


## Things that need the re-auth form

- Linking an account
  - If the user is attempting to link a Google account, they will need to
    re-verify their email.
  - If the user is attempting to link an email & password, they will need to
    sign-in with Google again.
- Unlinking an account
  - They will need to verify with either of the two options
- Deleting their account
  - Verify by providing them either of the two sign in methods, depending on
    what's available

Changing the email and password can be handled by catching and using the values
from the form to attempt to reauthenticate.


## Things that need the warning

- Are you sure you want to unlink your Google account?
  - triggers auth form
- Are you sure you want to unlink your Email & Password?
  - triggers auth form
- Are you sure you want to reset your progress?
- Are you sure you want to delete your account?
- Are you *very* sure you want to delete your account?
  - triggers auth form


## Things that will redirect

- Linking a new Google account
- Reauthorizing with a Google account
  - to unlink their email account
  - to delete their account




## When the user clicks on one of the four buttons:

1.  flash up an 'are you sure'
    1.  to open, emit an 'open-modal' event with a callback function
    2.  that callback function should perform the action that the button would
        normally do should there be no double-check
2.  when hit yes, perform the action by running the callback
3.  if a re-auth comes up, flash up the re-auth screen
    1.  take the callback that was previously run and pass it to the callback of
        the re-auth screen
    2.  When re-authed, run that callback
4.  If the re-auth required a redirect, we use a switch statement to run the
    appropriate callback