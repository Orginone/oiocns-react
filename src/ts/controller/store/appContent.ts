import provider from '../../core/provider';

function createProduct(values) {
  console.log(values);
  return provider.getPerson.createProduct(values);
}
export { createProduct };
