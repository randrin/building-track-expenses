import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SubCategoryCreateDto } from './dto/sub-categoryCreate.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from './schemas/sub-category.schema';
import { Model } from 'mongoose';
import { JwtStrategy } from 'src/app/utils/jwt-strategy';
import { StatusEnums } from 'src/app/utils/common-enums';
import { capitalizeFirstLetter } from 'src/app/utils/common-functions';
import { PAGE_SIZE_DEFAULT } from 'src/app/utils/common-constants';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
    private jwtStrategy: JwtStrategy,
  ) {}

  async createSubCategory(
    subCategoryDto: SubCategoryCreateDto,
    req: Request,
  ): Promise<{ subCategory: SubCategory } | any> {
    try {
      const { title, description, category, status } = subCategoryDto;
      const findOnSubCategory = await this.subCategoryModel.findOne({
        title: capitalizeFirstLetter(title),
      });
      if (findOnSubCategory) {
        throw new HttpException(
          `Sub category ${title} already exists in system. Please change the title.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const newSubCategory = await this.subCategoryModel.create({
        title,
        description,
        category,
        status,
        createdBy: (await this.jwtStrategy.getUserOperation(req['user']))._id,
      });

      return { newSubCategory };
    } catch (error) {
      console.log('Error: ', error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getSubCategories(): Promise<{ subCategories: SubCategory[] } | any> {
    const data = await this.subCategoryModel
      .find({})
      .populate('createdBy category')
      .sort({ updatedAt: -1 });
    return { data };
  }

  async getSubCategoriesQuery(
    page: number,
  ): Promise<{ subCategories: SubCategory[]; count: number } | any> {
    const dataTot = await this.subCategoryModel
      .find({})
      .populate('createdBy category')
      .sort({ updatedAt: -1 });
    const index = (page == 0 ? 1 : page - 1) * PAGE_SIZE_DEFAULT;
    const count = dataTot.length;
    const data =
      dataTot.length > PAGE_SIZE_DEFAULT
        ? dataTot.slice(index, index + PAGE_SIZE_DEFAULT)
        : dataTot;
    return { data, count };
  }

  async getSubCategoriesByCategoryId(
    categoryId: string,
  ): Promise<{ subCategories: SubCategory[] } | any> {
    if (categoryId.match(/^[0-9a-fA-F]{24}$/)) {
      const data = await this.subCategoryModel
        .find({ category: categoryId })
        .populate('createdBy category')
        .sort({ updatedAt: -1 });
      return { data };
    } else {
      throw new HttpException(
        `Category ID is not valid. Please try again with a valid ID`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getSubCategoryById(
    subCategoryId: string,
  ): Promise<{ subCategory: SubCategory }> {
    if (subCategoryId.match(/^[0-9a-fA-F]{24}$/)) {
      const subCategory = await this.subCategoryModel.findById({
        _id: subCategoryId,
      });
      if (subCategory) {
        return { subCategory };
      }
      throw new HttpException(`Sub category not found.`, HttpStatus.NOT_FOUND);
    } else {
      throw new HttpException(
        `Sub Category ID is not valid. Please try again with a valid ID`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateSubCategory(
    subCategoryDto: SubCategoryCreateDto,
    subCategoryId: string,
    req: Request,
  ): Promise<{ subCategory: SubCategory } | any> {
    const { title, description, category, status } = subCategoryDto;

    const subCategory = await this.subCategoryModel.findById({
      _id: subCategoryId,
    });
    if (subCategory) {
      const findOnSubCategory = await this.subCategoryModel.findOne({
        title: capitalizeFirstLetter(title),
      });
      if (
        findOnSubCategory &&
        subCategory.title !== capitalizeFirstLetter(title)
      ) {
        throw new HttpException(
          `Sub category ${title} already exists in system. Please change the title.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const updSubCategory = await this.subCategoryModel
        .findByIdAndUpdate(
          { _id: subCategoryId },
          {
            title: capitalizeFirstLetter(title),
            description: capitalizeFirstLetter(description),
            category,
            status,
            createdBy: (await this.jwtStrategy.getUserOperation(req['user']))
              ._id,
          },
        )
        .exec();
      return { updSubCategory };
    }
    throw new HttpException(`Sub Category not found.`, HttpStatus.NOT_FOUND);
  }

  async enabledOrDisabledSubCategory(
    subCategoryId: string,
    req: Request,
  ): Promise<{ subCategory: SubCategory } | any> {
    const subCategory = await this.subCategoryModel.findById({
      _id: subCategoryId,
    });
    if (subCategory) {
      const updSubCategory = await this.subCategoryModel
        .findByIdAndUpdate(
          { _id: subCategoryId },
          {
            status:
              subCategory.status === StatusEnums.ACTIVE
                ? StatusEnums.DISABLED
                : StatusEnums.ACTIVE,
            createdBy: (await this.jwtStrategy.getUserOperation(req['user']))
              ._id,
          },
        )
        .exec();
      return { updSubCategory };
    }
    throw new HttpException(`Sub Category not found.`, HttpStatus.NOT_FOUND);
  }

  async deleteSubCategory(subCategoryId: string): Promise<{ message: string }> {
    const subCategory = await this.subCategoryModel.findById({
      _id: subCategoryId,
    });
    if (subCategory) {
      await this.subCategoryModel.findByIdAndDelete({ _id: subCategoryId });
      return { message: 'Sub category deleted successfully.' };
    }
    throw new HttpException(`Sub category not found.`, HttpStatus.NOT_FOUND);
  }
}
