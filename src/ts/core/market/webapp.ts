import Product from './product';
import { XProduct } from '../../base/schema';

export default class webApp extends Product {
  constructor(prod: XProduct) {
    super(prod);
  }
}
