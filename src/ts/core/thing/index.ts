import { kernel } from '../../base';
import { INullSpeciesItem } from './ispecies';
import { SpeciesItem } from './species';

/**
 * 加载分类树
 * @param id 组织id
 */
export const loadSpeciesTree = async (id: string) => {
  let item: INullSpeciesItem;
  const res = await kernel.querySpeciesTree(id, '');
  if (res.success) {
    item = new SpeciesItem(res.data, undefined);
  }
  return item;
};

export type { INullSpeciesItem, ISpeciesItem } from './ispecies';
