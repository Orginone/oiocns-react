import { command } from '@/ts/base';
import { IBoxProvider } from '@/ts/core/work/box';
import { useState, useEffect } from 'react';

export const useStagings = (box: IBoxProvider, relations: string) => {
  const [stagings, setStagings] = useState(box.relations(relations, ['实体']));
  useEffect(() => {
    const id = command.subscribe((type, cmd) => {
      switch (type) {
        case 'stagings':
          switch (cmd) {
            case 'refresh':
              setStagings(box.relations(relations, ['实体']));
              break;
          }
          break;
      }
    });
    return () => {
      command.unsubscribe(id);
    };
  });
  return stagings;
};
