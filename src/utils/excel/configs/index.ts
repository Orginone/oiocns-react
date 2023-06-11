import { ISpeciesItem, SpeciesType } from '@/ts/core';
import { SheetConfig, ReadConfig, SheetName, ExcelConfig } from '../types';
import { SpeciesSheetConfig, SpeciesReadConfig } from './species';
import { PropSheetConfig, PropReadConfig } from './property';
import { DictSheetConfig, DictReadConfig } from './dict';
import { DictItemSheetConfig, DictItemReadConfig } from './dictitem';

export const getConfigs = (species: ISpeciesItem) => {
  let configs: SheetConfig<any>[] = [new SpeciesSheetConfig(species)];
  switch (species.metadata.typeName) {
    case SpeciesType.Store:
      configs.push(new PropSheetConfig(species));
      break;
    case SpeciesType.Dict:
      configs.push(new DictSheetConfig(species), new DictItemSheetConfig(species));
      break;
  }
  return configs;
};

export const getReadConfigs = (species: ISpeciesItem, excel: ExcelConfig<any>) => {
  let readConfigs: ReadConfig<any, any, SheetConfig<any>, any>[] = [];
  for (let config of getConfigs(species)) {
    switch (config.sheetName) {
      case SpeciesType.Store:
      case SpeciesType.Dict:
      case SpeciesType.Market:
      case SpeciesType.Application:
      case SpeciesType.Flow:
      case SpeciesType.Work:
      case SpeciesType.Thing:
      case SpeciesType.Data:
        readConfigs.push(new SpeciesReadConfig(config as SpeciesSheetConfig, excel));
        break;
      case SheetName.Property:
        readConfigs.push(new PropReadConfig(config as PropSheetConfig, excel));
        break;
      case SheetName.Dict:
        readConfigs.push(new DictReadConfig(config as DictSheetConfig, excel));
        break;
      case SheetName.DictItem:
        readConfigs.push(new DictItemReadConfig(config as DictItemSheetConfig, excel));
        break;
    }
  }
  return readConfigs;
};
