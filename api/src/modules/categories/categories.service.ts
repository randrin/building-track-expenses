import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { CategoryCreateDto } from './dto/categoryCreate.dto';
import { JwtStrategy } from 'src/app/utils/jwt-strategy';
import { StatusEnums } from 'src/app/utils/common-enums';
import { capitalizeFirstLetter } from 'src/app/utils/common-functions';
import { PAGE_SIZE_DEFAULT } from 'src/app/utils/common-constants';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private jwtStrategy: JwtStrategy,
  ) {}

  async createCategory(
    categoryDto: CategoryCreateDto,
    req: Request,
  ): Promise<{ category: Category } | any> {
    try {
      const { title, description, status } = categoryDto;
      const findOnCategory = await this.categoryModel.findOne({
        title: capitalizeFirstLetter(title),
      });
      if (findOnCategory) {
        throw new HttpException(
          `Category ${title} already exists in system. Please change the title.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const newCategory = await this.categoryModel.create({
        title,
        description,
        status,
        createdBy: (await this.jwtStrategy.getUserOperation(req['user']))._id,
      });

      return { newCategory };
    } catch (error) {
      console.log('Error: ', error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getCategories(): Promise<{ categories: Category[] } | any> {
    const data = await this.categoryModel
      .find({})
      .populate('createdBy')
      .sort({ updatedAt: -1 });
    return { data };
  }

  async getCategoriesQuery(
    page: number,
  ): Promise<{ categories: Category[]; count: number } | any> {
    const dataTot = await this.categoryModel
      .find({})
      .populate('createdBy')
      .sort({ updatedAt: -1 });
    const index = (page == 0 ? 1 : page - 1) * PAGE_SIZE_DEFAULT;
    const count = dataTot.length;
    const data =
      dataTot.length > PAGE_SIZE_DEFAULT
        ? dataTot.slice(index, index + PAGE_SIZE_DEFAULT)
        : dataTot;
    return { data, count };
  }
  
  async getCategoryById(categoryId: string): Promise<{ category: Category }> {
    if (categoryId.match(/^[0-9a-fA-F]{24}$/)) {
      const category = await this.categoryModel.findById({ _id: categoryId });
      if (category) {
        return { category };
      }
      throw new HttpException(`Category not found.`, HttpStatus.NOT_FOUND);
    } else {
      throw new HttpException(
        `Category ID is not valid. Please try again with a valid ID`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateCategory(
    categoryDto: CategoryCreateDto,
    categoryId: string,
    req: Request,
  ): Promise<{ category: Category } | any> {
    const { title, description, status } = categoryDto;
    const category = await this.categoryModel.findById({ _id: categoryId });
    if (category) {
      const findOnCategory = await this.categoryModel.findOne({
        title: capitalizeFirstLetter(title),
      });
      if (findOnCategory && category.title !== capitalizeFirstLetter(title)) {
        throw new HttpException(
          `Category ${title} already exists in system. Please change the title.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const updCategory = await this.categoryModel
        .findByIdAndUpdate(
          { _id: categoryId },
          {
            title: capitalizeFirstLetter(title),
            description: capitalizeFirstLetter(description),
            status,
            createdBy: (await this.jwtStrategy.getUserOperation(req['user']))
              ._id,
          },
        )
        .exec();
      return { updCategory };
    }
    throw new HttpException(`Category not found.`, HttpStatus.NOT_FOUND);
  }

  async enabledOrDisabledCategory(
    categoryId: string,
    req: Request,
  ): Promise<{ category: Category } | any> {
    const category = await this.categoryModel.findById({ _id: categoryId });
    if (category) {
      const updCategory = await this.categoryModel
        .findByIdAndUpdate(
          { _id: categoryId },
          {
            status:
              category.status === StatusEnums.ACTIVE
                ? StatusEnums.DISABLED
                : StatusEnums.ACTIVE,
            createdBy: (await this.jwtStrategy.getUserOperation(req['user']))
              ._id,
          },
        )
        .exec();
      return { updCategory };
    }
    throw new HttpException(`Category not found.`, HttpStatus.NOT_FOUND);
  }

  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    const category = await this.categoryModel.findById({ _id: categoryId });
    if (category) {
      await this.categoryModel.findByIdAndDelete({ _id: categoryId });
      return { message: 'Category deleted successfully.' };
    }
    throw new HttpException(`Category not found.`, HttpStatus.NOT_FOUND);
  }
}
