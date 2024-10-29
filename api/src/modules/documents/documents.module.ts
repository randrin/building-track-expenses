import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { config } from 'src/app/config';
import { DocumentSchema } from './schemas/document.schema';
import { MongooseModule } from '@nestjs/mongoose';
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
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Document', schema: DocumentSchema }]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, JwtStrategy],
})
export class DocumentsModule {}
