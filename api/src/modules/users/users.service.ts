import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { Project } from '../projects/schemas/project.schema';
import { JwtStrategy } from 'src/app/utils/jwt-strategy';
import { UserCreateDto } from './dto/userCreate.dto';
import {
  BACKGROUND_RGA,
  PREFIX_PASSWORD,
  PREFIX_TAM_TAM,
} from 'src/app/utils/common-constants';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Project.name)
    private projectModel: Model<Project>,
    private jwtStrategy: JwtStrategy,
  ) {}

  async allUsers(): Promise<{ users: User[] } | any> {
    const data = await this.userModel
      .find({})
      .populate('createdBy')
      .sort({ updatedAt: -1 });
    return { data };
  }

  async getUserById(userId: string): Promise<{ user: User }> {
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      const user = await this.userModel.findById({ _id: userId });
      if (user) {
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

  async updateStatusUser(
    userId: string,
    status: string,
    req: Request,
  ): Promise<{ user: User } | any> {
    const user = await this.userModel.findById({
      _id: userId,
    });
    if (user) {
      const updUser = await this.userModel
        .findByIdAndUpdate(
          { _id: userId },
          {
            status,
            createdBy: (await this.jwtStrategy.getUserOperation(req['user']))
              ._id,
          },
        )
        .exec();
      return { updUser };
    }
    throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
  }

  async createUser(
    userCreateDto: UserCreateDto,
    req: Request,
  ): Promise<{ user: User } | any> {
    try {
      const { firstName, lastName, email, role, dateOfBorn, gender, contact } =
        userCreateDto;
      const { phoneNumber } = contact;
      // 1. Validation Email and Phone Number
      const userEmail = await this.userModel.findOne({
        email,
      });
      if (userEmail) {
        throw new HttpException(
          `User with ${email} already exists in system. Please change the email.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const userPhone = await this.userModel.findOne({
        phoneNumber,
      });
      if (userPhone) {
        throw new HttpException(
          `User with ${phoneNumber} already exists in system. Please change the phone number.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      // 2. Temporary password user -> TamddMMYYYY! es. Tam10032024!
      let currentDate = new Date().getDate();
      let currentMonth = new Date().getMonth() + 1;
      currentMonth = (
        currentMonth < 10 ? '0' + currentMonth : currentMonth
      ) as number;
      let currentYear = new Date().getFullYear();
      const defaultPassword = `${PREFIX_PASSWORD}${currentDate}${currentMonth}${currentYear}${'!'}`;

      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      const user = await this.userModel.create({
        gender,
        firstName,
        lastName,
        tmpPassword: true,
        username: `${PREFIX_TAM_TAM}${
          Math.floor(Math.random() * 90000) + 10000
        }`, // random 5 digit code
        email,
        role,
        contact,
        dateOfBorn,
        photoRGA:
          BACKGROUND_RGA[Math.floor(Math.random() * BACKGROUND_RGA.length)],
        password: hashedPassword,
        createdBy: (await this.jwtStrategy.getUserOperation(req['user']))._id,
      });

      // 3. Add user to department
      // for (let group = 0; group < groups.length; group++) {
      //   await this.organizationModel.findByIdAndUpdate(groups[group], {
      //     $push: { users: user._id },
      //   });
      // }

      //   await this.projectModel.findByIdAndUpdate(department, {
      //     $push: { contributors: user._id },
      //   });

      // 5. Send link invitation

      return { user };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
