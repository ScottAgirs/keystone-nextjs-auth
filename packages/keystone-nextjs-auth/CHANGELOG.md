# @opensaas-keystone/nextjs-auth

## 20.0.1

### Patch Changes

- 5503dec: upgrade babel and other packages
- 5503dec: Fix up providers in build

## 20.0.0

### Major Changes

- b385ee4: Upgrade to next-authv4 see https://next-auth.js.org/getting-started/upgrade-v4 for more info.

  BREAKING CHANGE:
  `sessionSecret` now required in `createAuth`

  `Providers` now under `@opensaas/keystone-nextjs-auth/providers/` ie `import Auth0 from '@opensaas/keystone-nextjs-auth/providers/auth0';` these can also be imported from next-auth by `import Auth0 from 'next-auth/providers/auth0';` if preferred.

### Patch Changes

- a6ad41a: fix redirect for custom path
- 0043ca8: clean up some types

## 19.1.0

### Minor Changes

- fa61bd9: Allow custom port to be defined by env `PORT` as well as a custom path

## 19.0.0

### Major Changes

- 5ac88ef: Upgrade to `keystone-6/core` for more information see https://keystonejs.com/releases/2021-12-01

## 18.0.1

### Patch Changes

- 9b6052a: Fix access issue to allow `/api/__keystone_api_build`

## 18.0.0

### Major Changes

- cff5031: Upgrade to `"@keystone-next/keystone": "^29.0.0"` see https://keystonejs.com/releases/2021-11-24 for more information

## 17.0.0

### Major Changes

- c619df8: Upgrade to `"@keystone-next/keystone": "28.0.0"`

## 16.0.1

### Patch Changes

- 2e3ae54: Fix Nullish coalescing operator in next-config for older versions of node

## 16.0.0

### Major Changes

- eaea6af: Upgrade to Keystone 27

## 15.0.0

### Major Changes

- 900b00b: make subjectID unique to allow `findOne` instead of `findMany`

### Minor Changes

- 54a8f5f: upgrade keystone to 26.1.1

### Patch Changes

- 5d28c2d: Fix types to allow a number as the subjectid

## 14.1.1

### Patch Changes

- bfe1860: Fix breaking changes to Context from keystone-next 26

## 14.1.0

### Minor Changes

- 84a7eea: keystone upgrade to `26.1.1`

## 14.0.0

### Major Changes

- 5a64376: Upgrade to keystone-next version 26

## 13.0.2

### Patch Changes

- 06cf34e: fix up next-config

## 13.0.1

### Patch Changes

- fb84793: next 11 fixes for next-config

## 13.0.0

### Major Changes

- e5d413a: Keystone Version upgrade to 25.0.0

## 12.0.2

### Patch Changes

- d17f159: fix #25 - `publicPages` not added correctly

## 12.0.1

### Patch Changes

- 49f3922: update readme with new instructions

## 12.0.0

### Major Changes

- 3b9b9e8: map publicPages to providers to allow the auto addition of callback and signin URLs to the `publicPages` array in keystone. This requires providers to mvoe to the `createAuth` configuration which probably make more sense anyway. See readme for new configuration.
- decb7d1: Upgrade keystone-next to 24 with latest API upgrades

## 11.1.0

### Minor Changes

- f79ceab: Add endSession to clean next-auth cookie

## 11.0.0

### Major Changes

- 664f8c2: Upgrade keystone packages

## 10.0.3

### Patch Changes

- 0d8cc8a: Feat: Add google provider paths to the keystone public pages config

## 10.0.2

### Patch Changes

- 2d5f594: version bump

## 10.0.1

### Patch Changes

- 5175fc9: Fix error from findMany in findMatchingIdentities

## 10.0.0

### Major Changes

- 05de370: Change session data to be stored in JWT to reduce db load on session lookup

## 9.1.0

### Minor Changes

- Make keystonePath optional

## 9.0.0

### Major Changes

- Add keystone base path

## 8.1.4

### Patch Changes

- Fix up some more types

## 8.1.3

### Patch Changes

- update types

## 8.1.2

### Patch Changes

- Comment update

## 8.1.1

### Patch Changes

- Fix updateOne error

## 8.1.0

### Minor Changes

- https://github.com/keystonejs/keystone/pull/6022/files

## 8.0.0

### Major Changes

- upgrade keystone

## 7.0.0

### Major Changes

- Fix up providers config

## 6.3.0

### Minor Changes

- Change return in session

## 6.2.0

### Minor Changes

- next-config error fix

## 6.1.0

### Minor Changes

- fix next-config error

## 6.0.0

### Major Changes

- Auto add and next config

## 5.0.0

### Major Changes

- enable autoadd hooked in with keystone lists

## 4.2.0

### Minor Changes

- For error

## 4.1.0

### Minor Changes

- Fix forEach error

## 4.0.0

### Major Changes

- update babel and remove some logging

## 3.0.0

### Major Changes

- fix up a few errors

## 2.1.0

### Minor Changes

- Add readme

## 2.0.0

### Major Changes

- c0d53b8: initial
