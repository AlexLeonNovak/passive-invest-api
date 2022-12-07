import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { Routes } from '@nestjs/core/router/interfaces';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './modules/account/account.module';

const routes: Routes = [
  { path: '/auth', module: AuthModule },
  { path: '/users', module: UsersModule },
  { path: '/account', module: AccountModule },
];

@Module({
  imports: [RouterModule.register(routes), ...routes.map(route => route.module)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
