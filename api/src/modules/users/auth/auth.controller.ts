import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from '../dto/signIn.dto';
import { User } from '../schemas/user.schema';

@ApiTags('Authentication/Authorization')
@Controller('auth')
@ApiForbiddenResponse({ description: 'Forbidden.' })
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiBadRequestResponse({ description: 'Bad request.' })
export class AuthController {
  constructor(private readonly authUsersService: AuthService) {}

  @Post('/login')
  @ApiOkResponse({
    description: 'User has been successfully logged.',
  })
  async login(
    @Body() signInDto: SignInDto,
  ): Promise<{ user: User; accessToken: string }> {
    const { token, user } = await this.authUsersService.signIn(signInDto);
    return {
      user,
      accessToken: token,
    };
  }

  @Post('/logout')
  @ApiOkResponse({
    description: 'User has been successfully logged.',
  })
  async logout(@Req() req: Request): Promise<{ message: string }> {
    const token = req.headers['authorization']?.split(' ')[1];
    return await this.authUsersService.logout(token);
  }

  @Delete('/delete/profile/:userId')
  @ApiOkResponse({
    description: 'User deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  async deleteUser(@Param('userId') userId: string): Promise<{ user: User }> {
    return await this.authUsersService.deleteUser(userId);
  }

  @ApiOkResponse({
    description: 'Token already valid.',
  })
  @ApiForbiddenResponse({ description: 'Token expired or malformed.' })
  @ApiUnauthorizedResponse({ description: 'Token expired or malformed.' })
  @Get('/user/:token')
  async userAuth(@Param('token') token: string): Promise<any> {
    return await this.authUsersService.userConnected(token);
  }

  @Put('/update/project/:projectId/profile/:userId')
  @ApiOkResponse({
    description: 'User updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  async updateUserProject(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<{ user: User }> {
    return await this.authUsersService.updateUserProject(userId, projectId);
  }
}
