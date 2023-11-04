import { ISpecies } from '@/ts/core';
import { Context } from '../../render/PageContext';

export type SpeciesProp = { code: string; name: string; speciesId: string };
export type SpeciesEntity = { code: string; name: string; species: ISpecies };
export type SpeciesNode = {
  key: string;
  label: string;
  children: SpeciesNode[];
  itemType: string;
  item: any;
};

export const loadItems = async (init: SpeciesProp[], ctx: Context) => {
  const items = await ctx.view.pageInfo.loadSpecies(init.map((item) => item.speciesId));
  const result: SpeciesEntity[] = [];
  for (const prop of init) {
    const find = items.find((item) => item.id == prop.speciesId);
    if (find) {
      result.push({
        code: prop.code,
        name: prop.name,
        species: find,
      });
    }
  }
  for (const item of items) {
    await item.loadContent();
  }
  return result;
};
