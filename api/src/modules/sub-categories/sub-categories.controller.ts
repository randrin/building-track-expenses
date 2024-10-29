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
import { AuthGuard } from 'src/middlewares/auth.guard';
import { SubCategoriesService } from './sub-categories.service';
import { SubCategoryCreateDto } from './dto/sub-categoryCreate.dto';
import { SubCategory } from './schemas/sub-category.schema';

@ApiTags('Tam Tam Sub Categories')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token') // For Swagger access-token
@ApiForbiddenResponse({ description: 'Forbidden.' })
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiBadRequestResponse({ description: 'Bad request.' })
@Controller('sub-categories')
export class SubCategoriesController {
  constructor(private readonly subCatService: SubCategoriesService) {}

  @Post('/create')
  @ApiOkResponse({
    description: 'Sub Category created successfully.',
  })
  async createSubCategory(
    @Body() subCategoryDto: SubCategoryCreateDto,
    @Req() req: Request,
  ): Promise<{ subCategory: SubCategory }> {
    return await this.subCatService.createSubCategory(subCategoryDto, req);
  }

  @Get('/')
  @ApiOkResponse({
    description: 'Retrieve all sub categories.',
  })
  async getSubCategories(): Promise<{ subCategories: SubCategory[] }> {
    return await this.subCatService.getSubCategories();
  }

  @Get('/query')
  @ApiOkResponse({
    description: 'Retrieve all subcategories by query.',
  })
  async getSubCategoriesQuery(
    @Query() query: any,
  ): Promise<{ subCategories: SubCategory[] }> {
    return await this.subCatService.getSubCategoriesQuery(query.page);
  }

  @Get('/:subCategoryId')
  @ApiOkResponse({
    description: 'Retrieve a sub category.',
  })
  @ApiNotFoundResponse({
    description: 'Sub Category not found.',
  })
  async getSubCategoryById(
    @Param('subCategoryId') subCategoryId: string,
  ): Promise<{ subCategory: SubCategory }> {
    return await this.subCatService.getSubCategoryById(subCategoryId);
  }

  @Get('/category/:categoryId')
  @ApiOkResponse({
    description: 'Retrieve a sub categories by category id.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  async getSubCategoriesByCategoryId(
    @Param('categoryId') categoryId: string,
  ): Promise<{ subCategories: SubCategory[] }> {
    return await this.subCatService.getSubCategoriesByCategoryId(categoryId);
  }

  @Put('/status/:subCategoryId')
  @ApiOkResponse({
    description: 'Sub Category status updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Sub Category not found.',
  })
  async enabledOrDisabledSubCategory(
    @Param('subCategoryId') subCategoryId: string,
    @Req() req: Request,
  ) {
    return await this.subCatService.enabledOrDisabledSubCategory(
      subCategoryId,
      req,
    );
  }

  @Put('/update/:subCategoryId')
  @ApiOkResponse({
    description: 'Sub Category updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Sub Category not found.',
  })
  async updateSubCategory(
    @Body() subCategoryDto: SubCategoryCreateDto,
    @Param('subCategoryId') subCategoryId: string,
    @Req() req: Request,
  ) {
    return await this.subCatService.updateSubCategory(
      subCategoryDto,
      subCategoryId,
      req,
    );
  }

  @Delete('/delete/:subCategoryId')
  @ApiOkResponse({
    description: 'Sub Category deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Sub Category not found.',
  })
  async deleteSubCategory(
    @Param('subCategoryId') subCategoryId: string,
  ): Promise<{ message: string }> {
    return await this.subCatService.deleteSubCategory(subCategoryId);
  }
}
