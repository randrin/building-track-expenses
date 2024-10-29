import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './app/config';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const port = config.port;
  const apiPrefix = config.api.prefix;
  const apiVersion = config.api.version;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  const configSwagger = new DocumentBuilder()
    .setTitle('Building Track Expenses')
    .setDescription('Building Track API to call and test')
    .setVersion(`${apiVersion}`)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    ) // This for authorize api that need token in Swagger
    .setExternalDoc(
      'Confluence Documentation',
      'https://randrin.atlassian.net/wiki/spaces/TT/overview?homepageId=410255565',
    )
    .setContact(
      'Randrin Nzeukang',
      'https://github.com/randrin/building-track-expenses',
      'nzeukangrandrin@gmail.com',
    )
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup(`${apiPrefix}/${apiVersion}`, app, document);
  await app.listen(port, () => {
    console.log(
      `===================================================================`,
    );
    console.log(
      `*** 🚀 API & Swagger Link - http://localhost:${port}${apiPrefix}/${apiVersion} ***`,
    );
    console.log(
      `====================================================================`,
    );
  });
}
bootstrap();
