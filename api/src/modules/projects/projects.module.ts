import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { JwtStrategy } from 'src/app/utils/jwt-strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { config } from 'src/app/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './schemas/project.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { DocumentSchema } from '../documents/schemas/document.schema';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (conf: ConfigService) => {
        return {
          secret: conf.get<string>(config.jwt.secret),
          signOptions: {
            expiresIn: conf.get<string | number>(config.jwt.expiration),
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Document', schema: DocumentSchema }]),
    MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
  ],
  providers: [ProjectsService, JwtStrategy],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
