import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { UserCreateDto } from './dto/userCreate.dto';

@ApiTags('Building Track Users')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token') // For Swagger access-token
@Controller('users')
@ApiForbiddenResponse({ description: 'Forbidden.' })
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiBadRequestResponse({ description: 'Bad request.' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    description: 'Users has been successfully retrieved.',
  })
  async getAllUsers(): Promise<{ users: User[] }> {
    return await this.usersService.allUsers();
  }

  @Post('/create')
  @ApiOkResponse({
    description: 'User has been successfully insert.',
  })
  async createUser(
    @Body() userCreateDto: UserCreateDto,
    @Req() req: Request,
  ): Promise<{ user: User }> {
    return await this.usersService.createUser(userCreateDto, req);
  }

  @Put('/status/:status/:userId')
  @ApiOkResponse({
    description: 'User status updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  async updateStatusUser(
    @Param('userId') userId: string,
    @Param('status') status: string,
    @Req() req: Request,
  ): Promise<{ user: User }> {
    return await this.usersService.updateStatusUser(userId, status, req);
  }

  @Get('/:userId')
  @ApiOkResponse({
    description: 'Retrieve a user.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  async getUserById(@Param('userId') userId: string): Promise<{ user: User }> {
    return await this.usersService.getUserById(userId);
  }
}
