import { ISpeciesItem, SpeciesType } from '@/ts/core';
import { SheetConfig, ReadConfig, SheetName, ExcelConfig } from '../types';
import { SpeciesSheetConfig, SpeciesReadConfig } from './base/species';
import { PropSheetConfig, PropReadConfig } from './store/property';
import { DictSheetConfig, DictReadConfig } from './dict/dict';
import { DictItemSheetConfig, DictItemReadConfig } from './dict/dictitem';
import { FormSheetConfig, WorkSheetConfig, FormReadConfig, WorkReadConfig } from './base/form';
import { FormAttrSheetConfig, FormAttrReadConfig, WorkAttrSheetConfig, WorkAttrReadConfig } from './base/attribute';

export const getConfigs = (species: ISpeciesItem) => {
  let configs: SheetConfig<any>[] = [new SpeciesSheetConfig(species)];
  switch (species.metadata.typeName) {
    case SpeciesType.Store:
      configs.push(new PropSheetConfig(species));
      break;
    case SpeciesType.Dict:
      configs.push(new DictSheetConfig(species), new DictItemSheetConfig(species));
      break;
    case SpeciesType.Thing:
      configs.push(new FormSheetConfig(species), new FormAttrSheetConfig(species));
      break;
    case SpeciesType.Work:
      configs.push(new WorkSheetConfig(species), new WorkAttrSheetConfig(species));
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
      case SheetName.Form:
        readConfigs.push(new FormReadConfig(config as FormSheetConfig, excel));
        break;
      case SheetName.Work:
        readConfigs.push(new WorkReadConfig(config as WorkSheetConfig, excel));
        break;
      case SheetName.FormAttr:
        readConfigs.push(new FormAttrReadConfig(config as FormAttrSheetConfig, excel));
        break;
      case SheetName.WorkAttr:
        readConfigs.push(new WorkAttrReadConfig(config as WorkAttrSheetConfig, excel));
        break;
    }
  }
  return readConfigs;
};
