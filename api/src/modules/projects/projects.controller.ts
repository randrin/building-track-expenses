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
import { ProjectsService } from './projects.service';
import { Project } from './schemas/project.schema';
import { ProjectCreateDto } from './dto/project.create.dto';

@ApiTags('Building Track Projects')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token') // For Swagger access-token
@Controller('projects')
@ApiForbiddenResponse({ description: 'Forbidden.' })
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiBadRequestResponse({ description: 'Bad request.' })
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Projects has been successfully retrieved.',
  })
  async getAllUsers(): Promise<{ projects: Project[] }> {
    return await this.projectsService.allProjects();
  }

  @Post('/create')
  @ApiOkResponse({
    description: 'Project has been successfully insert.',
  })
  async createUser(
    @Body() projectDto: ProjectCreateDto,
    @Req() req: Request,
  ): Promise<{ project: Project }> {
    return await this.projectsService.createProject(projectDto, req);
  }

  @Put('/status/:status/:projectId')
  @ApiOkResponse({
    description: 'Project status updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Project not found.',
  })
  async updateStatusUser(
    @Param('projectId') projectId: string,
    @Param('status') status: string,
    @Req() req: Request,
  ): Promise<{ project: Project }> {
    return await this.projectsService.updateStatusProject(
      projectId,
      status,
      req,
    );
  }

  @Get('/user/:userId')
  @ApiOkResponse({
    description: 'Retrieve all projects user.',
  })
  @ApiNotFoundResponse({
    description: 'Project not found.',
  })

  async getProjectsById(
    @Param('userId') userId: string,
  ): Promise<{ projects: Project[] }> {
    return await this.projectsService.getProjectsById(userId);
  }
}
