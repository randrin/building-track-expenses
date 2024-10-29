import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { config } from 'src/app/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './schemas/category.schema';
import { JwtStrategy } from 'src/app/utils/jwt-strategy';
import { UserSchema } from '../users/schemas/user.schema';

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
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [CategoriesService, JwtStrategy],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
