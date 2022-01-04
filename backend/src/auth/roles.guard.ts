import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    this.matchRoles(roles, user.roles);

    return true;
  }

  matchRoles(roles: string[], userRoles: string[]): boolean {
    for (let i = 0; i < userRoles.length; i++) {
      for (let j = 0; j < roles.length; j++) {
        if (userRoles[i] === roles[j]) {
          return true;
        }
      }
    }
    return true;
  }
}
