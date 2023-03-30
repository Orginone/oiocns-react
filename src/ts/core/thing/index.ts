import { kernel } from '../../base';
import { INullSpeciesItem } from './ispecies';
import { SpeciesItem } from './species';

/**
 * 加载分类树
 * @param id 组织id
 */
export const loadSpeciesTree = async (id: string) => {
  let item: INullSpeciesItem;
  const res = await kernel.querySpeciesTree({
    id: id,
    page: {
      offset: 0,
      limit: 0,
      filter: '',
    },
  });
  if (res.success) {
    item = new SpeciesItem(res.data, undefined, id);
  }
  return item;
};

export type { INullSpeciesItem, ISpeciesItem } from './ispecies';
export type { IFlowDefine } from './iflowDefine';
