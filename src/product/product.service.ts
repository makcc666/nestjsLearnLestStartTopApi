import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ProductModel } from './product.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ReviewModel } from '../review/review.model';
import { Types } from 'mongoose';

@Injectable()
export class ProductService {
	constructor(@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>) {}

	async create(dto: CreateProductDto) {
		return this.productModel.create(dto);
	}

	async findById(id: Types.ObjectId) {
		return this.productModel.findById(id).exec();
	}

	async deleteById(id: Types.ObjectId) {
		return this.productModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: Types.ObjectId, dto: CreateProductDto) {
		return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async findWithReview(dto: FindProductDto) {
		const req = this.productModel.aggregate([
			{
				$match: {
					categories: dto.category,
				},
			},
			{
				$sort: {
					_id: 1,
				},
			},
			{
				$limit: dto.limit,
			},
			{
				$lookup: {
					from: 'Review', localField: '_id', foreignField: 'productId', as: 'reviews',
				},
			},
			{
				$addFields: {
					reviewCount: {
						$size: '$reviews',
					}, reviewAvg: {
						$avg: '$reviews.rating',
					}, reviews: {
						$function: {
							body: `function(reviews){return reviews.sort((a,b)=>new Date(b.createdAt) - new Date(a.createdAt))}`,
							args: ['$reviews'],
							lang: 'js',
						},
					},
				},

			},

		])
			.exec();

		return await req as (ProductModel & {
			reviews: ReviewModel[],
			reviewCount: number,
			reviewAvg: number
		})[];
	}
}
