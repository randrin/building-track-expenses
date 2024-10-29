import { Controller, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { DocumentsService } from './documents.service';

@ApiTags('Building Track Projects')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token') // For Swagger access-token
@Controller('documents')
@ApiForbiddenResponse({ description: 'Forbidden.' })
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiBadRequestResponse({ description: 'Bad request.' })
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}
}
