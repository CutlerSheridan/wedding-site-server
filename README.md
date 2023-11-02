# Wedding Site (Backend)

## The server-side code for my wedding website

Find the frontend repo [here](https://github.com/CutlerSheridan/wedding-site-client).

#### TODO NEXT

#### TODO LATER

##### Features

- add 'characters' API routes
- ? make it so changing sent_savedate, sent_invite, or any rsvp field to true changes next_round to false
- ? move conditional changes to Guest object into guestController to declutter guests.js

##### Behavior

- validate/sanitize PUT /:guest_id
- forbid username from being used more than once
- change PUT /:guest_id so it does not fetch original document, rather I will pass entire document with updates and just replace old doc with that
- consider indices for:
  - guests.group
    - groupController.findOne()
- clean up debugs

##### Style

- add credit

##### Production Deployment Checklist

- clean up comments
- clean up logs/debugs
- change default backend db to production db

#### DONE

_1.0.0_

- swap default db to production
- clean up some comments and logs/debugs

_0.3.3_

- add ability to populate specific collection to current DB

_0.3.2_

- extend popoulatedb.js and populatedb route to be able to delete or populate specific collections
  - /delete/:collection_name/:target_db
  - /migrate-db/:collection_name/:copy_direction

_0.3.1_

- add real guest data to populatedb

_0.3.0_

- add testing db and distinguish it from production db
- add characters to sample data
- add function to migrate data from one db to the other
- add populatedb routes to migrate data
- extend populatedb deletion and migration routes to take parameters to dictate target DB
- add 'characters' collection to db with fields:
  - name
  - survives
  - optional
  - role
  - backstory
  - secrets

_0.2.12_

- add route for PUT /guests
- add route for DELETE /guests/:guest_id
- make POST /guests 'await' before responding, jesus

_0.2.11_

- add a group with one address to populatedb
- add a group with multiple addresses to populatedb
- add JWT authentication to GET /guests
- add fields to guests:
  - ready_to_send
  - survives
  - role

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
