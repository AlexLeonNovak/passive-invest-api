import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { Routes } from '@nestjs/core/router/interfaces';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

const routes: Routes = [
  { path: '/auth', module: AuthModule },
  { path: '/users', module: UsersModule },
];

@Module({
  imports: [RouterModule.register(routes), UsersModule, AuthModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
