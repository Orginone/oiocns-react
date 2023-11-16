import orgCtrl from '@/ts/controller';
import { useStagings } from '../../../core/hooks/useChange';
import { defineElement } from '../../defineElement';
import React from 'react';
import { Badge, Button } from 'antd';
import { command } from '@/ts/base';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Context } from '../../../render/PageContext';

interface IProps {
  ctx: Context;
  length: number;
}

const Design: React.FC<IProps> = ({ length, ctx }) => {
  return (
    <Badge color="red" count={length}>
      <Button
        shape="circle"
        size="large"
        type="primary"
        onClick={() => command.emitter('stagings', 'open', ctx.view.mode)}
        icon={<AiOutlineShoppingCart />}
      />
    </Badge>
  );
};

const View: React.FC<Pick<IProps, 'ctx'>> = ({ ctx }) => {
  const stagings = useStagings(orgCtrl.box, ctx.view.pageInfo.relations);
  return <Design length={stagings.length} ctx={ctx} />;
};

export default defineElement({
  render(_, ctx) {
    if (ctx.view.mode == 'design') {
      return <Design length={20} ctx={ctx} />;
    }
    return <View ctx={ctx}></View>;
  },
  displayName: 'Badge',
  meta: {
    type: 'Element',
    label: '徽标数',
    props: {},
  },
});
