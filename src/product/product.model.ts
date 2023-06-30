import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

class ProductCharacteristics {
	name: string;
	value: string;
}

export interface ProductModel extends Base, TimeStamps {}

export class ProductModel {
	@prop() image: string;
	@prop() title: string;
	@prop() price: number;
	@prop() oldPrice: number;
	@prop() credit: number;
	@prop() calculatedRating: number;
	@prop() description: string;
	@prop() advantages: string;
	@prop() disAdvantages: string;
	@prop({ type: () => [String] }) categories: string[];
	@prop({ type: () => [String] }) tags: string[];
	@prop({ type: () => [ProductCharacteristics], _id: false }) characteristics: ProductCharacteristics[];

}
