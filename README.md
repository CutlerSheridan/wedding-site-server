# Wedding Site (Backend)

## The server-side code for my wedding website

Find the frontend repo [here](https://github.com/CutlerSheridan/wedding-site-client).

#### TODO NEXT

- make it so changing sent_savedate, sent_invite, or any rsvp field to true changes next_round to false

#### TODO LATER

##### Features

- change put PUT /:guest_id so it does not fetch original document, rather I will pass entire document with updates and just replace old doc with that
- move conditional changes to Guest object into guestController to declutter guests.js
- add game fields to Guest

##### Behavior

- consider indices for:
  - guests.group
    - groupController.findOne()

##### Style

- add credit

#### DONE

_0.2.10_

- add game fiedls to Guest
  - 'character'
  - 'intro'
  - 'secrets'
  - 'sent_character'
  - 'notes'
- enable populatedb to auto-decline if all three RSVPs are specified as false

_0.2.9_

- add next_round sorting to Guests and Groups
- update PUT /:guest_id to account for status of declination
- update PUT /:guest_id to give RSVP and declined updates proper behavior
  - when switching RSVP and all three are now false, set declined to true
  - when setting to declined, retain other RSVP values
  - when declined, if an RSVP is switched to null or true, set declined to false
  - when declined, if RSVP is switched to false, declined value remains false
  - allow setting declined to false even if all RSVPs are false

_0.2.8_

- refactor /auth/signup to use validation

_0.2.7_

- fix guestController.findByName() so regex must match full name, not just a portion of name

_0.2.6_

- update PUT /guests/:guest_id so it detects if user has declined all three events or not and sets guest.declined accordingly
- add bigger group to populatedb

_0.2.5_

- refactor both findByName() methods to handle when no user is found

_0.2.4_

- write search route for inputting guest name

_0.2.3_

- extract guest methods into guestController
- rewrite /guest/count\* routes so only one is used
- refactor everything so Groups no longer has a model, it's just a linking field in each Guest

_0.2.2_

- write routes for:
  - /groups
  - /groups/:group_id

_0.2.1_

- write routes for:
  - /guests
  - GET /guests/:guest_id
  - PUT /guests/:guest_id
  - /family:whose_family
  - /count/all
  - /count/friday
  - /count/saturday
  - /count/sunday
- add routes for /api/populatedb, /del

_0.2.0_

- write Guest schema
- write Group schema
- populate db with sample data

_0.1.2_

- changed jwtFromRequest to extract jwt from authorization header instead of query params

_0.1.1_

- move /signup and /login to 'auth' route
- write jwt verification middleware
- add jwt middleware before secure routes

_0.1.0_

- add User model
- add userController model
- add passport signup config
- add passport login config
- add passport jwt config
- add /signup route
- add /login route
- get signup route functional
- get login authentication working with jwt

_0.0.0_

- Initial commit
