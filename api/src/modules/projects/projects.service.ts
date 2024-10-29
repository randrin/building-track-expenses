import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PREFIX_PRO } from 'src/app/utils/common-constants';
import { capitalizeFirstLetter } from 'src/app/utils/common-functions';
import { JwtStrategy } from 'src/app/utils/jwt-strategy';
import { ProjectCreateDto } from './dto/project.create.dto';
import { Project } from './schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private jwtStrategy: JwtStrategy,
  ) {}

  async allProjects(): Promise<{ projects: Project[] } | any> {
    const data = await this.projectModel
      .find({})
      .populate('createdBy')
      .sort({ updatedAt: -1 });
    return { data };
  }

  async getProjectsById(userId: string): Promise<{ project: Project[] } | any> {
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      const projects = await this.projectModel.find({
        contributors: { $in: userId },
      });
      if (projects) {
        return { projects };
      }
      throw new HttpException(`Project not found.`, HttpStatus.NOT_FOUND);
    } else {
      throw new HttpException(
        `User ID is not valid. Please try again with a valid ID`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createProject(
    projectDto: ProjectCreateDto,
    req: Request,
  ): Promise<{ project: Project } | any> {
    try {
      const { name, description, manager, logo } = projectDto;

      const findOnProject = await this.projectModel.findOne({
        name: capitalizeFirstLetter(name),
      });
      if (findOnProject) {
        throw new HttpException(
          `Project already found with name ${name}. Please try another name.`,
          HttpStatus.NOT_FOUND,
        );
      }

      //Save Project
      const newProject = await this.projectModel.create({
        logo,
        name,
        code: PREFIX_PRO + (Math.floor(Math.random() * 90000) + 10000), // random 5 digit code
        description,
        manager,
        createdBy: (await this.jwtStrategy.getUserOperation(req['user']))._id,
      });

      return { newProject };
    } catch (error) {
      console.log('Error: ', error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateStatusProject(
    projectId: string,
    status: string,
    req: Request,
  ): Promise<{ project: Project } | any> {
    const project = await this.projectModel.findById({
      _id: projectId,
    });
    if (project) {
      const updProject = await this.projectModel
        .findByIdAndUpdate(
          { _id: projectId },
          {
            status,
            createdBy: (await this.jwtStrategy.getUserOperation(req['user']))
              ._id,
          },
        )
        .exec();
      return { updProject };
    }
    throw new HttpException(`Project not found.`, HttpStatus.NOT_FOUND);
  }
}
