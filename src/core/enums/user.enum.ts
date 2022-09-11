export enum UserStatus {
  NEW = 'new',
  WAIT = 'wait',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserAuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}
