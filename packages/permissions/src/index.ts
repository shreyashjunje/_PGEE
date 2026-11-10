// PLACEHOLDER — expand when real features arrive.
// The roles are final, but the subjects and the role-permission map below are
// examples only: no per-organization conditions, no field-level rules yet.
import { createMongoAbility, type MongoAbility } from '@casl/ability';

export const Role = {
  /** Runs the SaaS; not tied to one organization. */
  SUPER_ADMIN: 'SUPER_ADMIN',
  /** Owns an organization (the SaaS customer). */
  OWNER: 'OWNER',
  /** Works for an organization, added by its owner. */
  STAFF: 'STAFF',
  /** A person renting a bed in a PG. Never the SaaS customer. */
  TENANT: 'TENANT',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export type Action = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subject = 'all' | 'Organization' | 'User';
export type Permission = { action: Action; subject: Subject };
export type AppAbility = MongoAbility<[Action, Subject]>;

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  SUPER_ADMIN: [{ action: 'manage', subject: 'all' }],
  OWNER: [
    { action: 'read', subject: 'Organization' },
    { action: 'update', subject: 'Organization' },
    { action: 'manage', subject: 'User' },
  ],
  STAFF: [
    { action: 'read', subject: 'Organization' },
    { action: 'read', subject: 'User' },
  ],
  TENANT: [],
};

export function defineAbilityFor(user: { role: Role }): AppAbility {
  return createMongoAbility<[Action, Subject]>([...ROLE_PERMISSIONS[user.role]]);
}
