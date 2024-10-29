import { Module } from '@nestjs/common';
import { SubCategoriesController } from './sub-categories.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { config } from 'src/app/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from '../categories/schemas/category.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { SubCategorySchema } from './schemas/sub-category.schema';
import { SubCategoriesService } from './sub-categories.service';
import { JwtStrategy } from 'src/app/utils/jwt-strategy';

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
    MongooseModule.forFeature([{ name: 'SubCategory', schema: SubCategorySchema }]),
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [SubCategoriesService, JwtStrategy],
  controllers: [SubCategoriesController]
})
export class SubCategoriesModule {}
