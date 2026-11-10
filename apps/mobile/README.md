# apps/mobile

Expo app, added in Phase 3.

When it arrives it talks to the API through `@pg/api-client` and must not import
`@pg/database` (the shared ESLint base config already blocks it).
