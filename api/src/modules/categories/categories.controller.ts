import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { CategoriesService } from './categories.service';
import { CategoryCreateDto } from './dto/categoryCreate.dto';
import { Category } from './schemas/category.schema';
import { AuthGuard } from 'src/middlewares/auth.guard';

@ApiTags('Tam Tam Categories')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token') // For Swagger access-token
@ApiForbiddenResponse({ description: 'Forbidden.' })
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiBadRequestResponse({ description: 'Bad request.' })
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('/create')
  @ApiOkResponse({
    description: 'Category created successfully.',
  })
  async createCategory(
    @Body() categoryDto: CategoryCreateDto,
    @Req() req: Request,
  ): Promise<{ category: Category }> {
    return await this.categoriesService.createCategory(categoryDto, req);
  }

  @Get('/')
  @ApiOkResponse({
    description: 'Retrieve all categories.',
  })
  async getCategories(): Promise<{ categories: Category[] }> {
    return await this.categoriesService.getCategories();
  }

  @Get('/query')
  @ApiOkResponse({
    description: 'Retrieve all categories by query.',
  })
  async getCategoriesQuery(@Query() query: any): Promise<{ categories: Category[] }> {
    return await this.categoriesService.getCategoriesQuery(query.page);
  }

  @Get('/:categoryId')
  @ApiOkResponse({
    description: 'Retrieve a category.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  async getCategoryById(
    @Param('categoryId') categoryId: string,
  ): Promise<{ category: Category }> {
    return await this.categoriesService.getCategoryById(categoryId);
  }

  @Put('/status/:categoryId')
  @ApiOkResponse({
    description: 'Category status updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  async enabledOrDisabledCategory(
    @Param('categoryId') categoryId: string,
    @Req() req: Request,
  ): Promise<{ category: Category }> {
    return await this.categoriesService.enabledOrDisabledCategory(
      categoryId,
      req,
    );
  }

  @Put('/update/:categoryId')
  @ApiOkResponse({
    description: 'Category updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  async updateCategory(
    @Body() categoryDto: CategoryCreateDto,
    @Param('categoryId') categoryId: string,
    @Req() req: Request,
  ): Promise<{ category: Category }> {
    return await this.categoriesService.updateCategory(
      categoryDto,
      categoryId,
      req,
    );
  }

  @Delete('/delete/:categoryId')
  @ApiOkResponse({
    description: 'Category deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  async deleteCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<{ message: string }> {
    return await this.categoriesService.deleteCategory(categoryId);
  }
}
