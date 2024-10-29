import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../dto/signIn.dto';
import * as bcrypt from 'bcryptjs';
import { config } from 'src/app/config';
import { sign, verify } from 'jsonwebtoken';
import { UserStatusEnums } from 'src/app/utils/common-enums';
import { Project } from 'src/modules/projects/schemas/project.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private jwtService: JwtService,
  ) {}
  async signIn(signInDto: SignInDto): Promise<{ token: string; user: User }> {
    const { email, password } = signInDto;

    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('Invalid email address');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = sign({ id: user._id }, config.jwt.secret, {
      expiresIn: config.jwt.expiration,
    }); // TODO: Pass the role into the token

    return { token, user };
  }

  async logout(token: string): Promise<{ message: string }> {
    try {
      if (token) {
        const decodeToken = verify(token, config.jwt.secret);
        const userId = decodeToken['id'];
        await this.userModel.findOneAndUpdate(
          { _id: userId },
          {
            lastLogin: new Date(),
            currentDepartment: {},
          },
        );
        return {
          message: 'User logout successfully.',
        };
      }
      return new HttpException(
        `Token expired or malformed`,
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      console.log('Error: ', error);
      return new HttpException(
        `Token expired or malformed`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUser(userId: string): Promise<{ user: User }> {
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      const user = await this.userModel.findById({ _id: userId });
      if (user) {
        await this.userModel.findByIdAndUpdate(
          { _id: userId },
          { status: UserStatusEnums.ARCHIVED },
        );
        return { user };
      }
      throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
    } else {
      throw new HttpException(
        `User ID is not valid. Please try again with a valid ID`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async userConnected(token: string): Promise<any> {
    try {
      if (token) {
        const decodeToken = verify(token, config.jwt.secret);
        const userId = decodeToken['id'];
        const user = await this.userModel.findOne({ _id: userId });
        return { user };
      }
    } catch (error) {
      console.log('Error: ', error);
      return new HttpException(
        `Token expired or malformed`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUserProject(
    userId: string,
    projectId: string,
  ): Promise<{ user: User } | any> {
    const userFound = await this.userModel.findById({ _id: userId });
    if (userFound) {
      const project = await this.projectModel
        .findById({
          _id: projectId,
        })
        .populate('manager');
      if (project) {
        await this.userModel.findByIdAndUpdate(
          { _id: userId },
          {
            currentProject: {
              ...project,
              manager: {
                ...project.manager,
                contact: {
                  phoneNumber: project.manager.contact.phoneNumber,
                  phonePrefix: project.manager.contact.phonePrefix,
                },
              },
            },
          },
        );
        const user = await this.userModel.findById({ _id: userId });
        return { user };
      }
      throw new HttpException(`Department not found.`, HttpStatus.NOT_FOUND);
    }
    throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
  }
}
