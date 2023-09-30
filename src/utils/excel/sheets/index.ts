import { IDirectory } from '@/ts/core';
import { DirectoryHandler, DirectorySheet } from '../sheets/directory';
import { AttrHandler, AttrSheet, FormHandler, FormSheet } from '../sheets/form';
import { PropHandler, PropSheet } from '../sheets/property';
import { ClassifySheet, DictSheet, SpeciesHandler } from '../sheets/species';
import {
  ClassifyItemHandler,
  ClassifyItemSheet,
  DictItemHandler,
  DictItemSheet,
} from '../sheets/speciesitem';

export const getSheets = (directory: IDirectory) => {
  return [
    new DirectoryHandler(new DirectorySheet(directory)),
    new SpeciesHandler(new DictSheet(directory)),
    new DictItemHandler(new DictItemSheet(directory)),
    new SpeciesHandler(new ClassifySheet(directory)),
    new ClassifyItemHandler(new ClassifyItemSheet(directory)),
    new PropHandler(new PropSheet(directory)),
    new FormHandler(new FormSheet(directory)),
    new AttrHandler(new AttrSheet(directory)),
  ];
};

export { AnySheet, AnyHandler } from './anything';
