import { IDirectory } from '@/ts/core';
import { DirectoryHandler, DirectorySheet } from '../sheets/directory';
import { AttrHandler, AttrSheet, FormHandler, FormSheet } from '../sheets/template/form';
import { PropHandler, PropSheet } from '../sheets/standard/property';
import { ClassifySheet, DictSheet, SpeciesHandler } from '../sheets/standard/species';
import {
  ClassifyItemHandler,
  ClassifyItemSheet,
  DictItemHandler,
  DictItemSheet,
} from '../sheets/standard/speciesitem';

export const getStandardSheets = (directory: IDirectory) => {
  return [
    new DirectoryHandler(new DirectorySheet(directory)),
    new SpeciesHandler(new DictSheet(directory)),
    new DictItemHandler(new DictItemSheet(directory)),
    new SpeciesHandler(new ClassifySheet(directory)),
    new ClassifyItemHandler(new ClassifyItemSheet(directory)),
    new PropHandler(new PropSheet(directory)),
  ];
};

export const getBusinessSheets = (directory: IDirectory) => {
  return [
    new DirectoryHandler(new DirectorySheet(directory)),
    new FormHandler(new FormSheet(directory)),
    new AttrHandler(new AttrSheet(directory)),
  ];
};

export { AnyHandler, AnySheet } from './anything';
