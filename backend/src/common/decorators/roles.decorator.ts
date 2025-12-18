import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type AppRole = 'admin' | 'buyer';

export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);

import { SetMetadata } from '@nestjs/common';

export type AppRole = 'admin' | 'buyer';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);

import { SetMetadata } from '@nestjs/common';

export type AppRole = 'admin' | 'buyer';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);


