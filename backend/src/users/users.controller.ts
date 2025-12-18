import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      return null;
    }
    return this.usersService.findCurrentUser(userId);
  }
}

import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';

class UpdateRoleDto {
  role!: 'admin' | 'buyer';
}

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.findMe(user.id);
  }

  @Patch('role')
  @Roles('admin')
  async updateRole(@Body() body: UpdateRoleDto) {
    // In a real app we'd receive which user to update; simplified here.
    throw new Error('Not implemented: updateRole target user');
  }
}


