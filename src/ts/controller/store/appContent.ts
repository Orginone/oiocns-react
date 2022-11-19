import { ProductModel } from '@/ts/base/model';
import provider from '../../core/provider';

function createProduct(
  values: Omit<ProductModel, 'id' | 'thingId' | 'typeName' | 'belongId'>,
) {
  console.log(values);
  return provider.getPerson.createProduct(values);
}
export default { createProduct };
