import './index.less';
import { Button } from 'antd';
import React from 'react';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import CardWidthTitle from '@/components/CardWidthTitle';
import { useHistory } from 'react-router-dom';
import * as ai from 'react-icons/ai';
import * as im from 'react-icons/im';

interface ShortcutsComType {
  props: []; //入口列表
}
const btns = [
  { label: '定标准', icon: <ai.AiOutlineSetting style={{ marginRight: 10 }} /> },
  { label: '加好友', icon: <ai.AiOutlineUserAdd style={{ marginRight: 10 }} /> },
  { label: '建群组', icon: <ai.AiOutlineTeam style={{ marginRight: 10 }} /> },
  { label: '加群组', icon: <ai.AiOutlineUsergroupAdd style={{ marginRight: 10 }} /> },
  { label: '建单位', icon: <im.ImOffice style={{ marginRight: 10 }} /> },
  { label: '加单位', icon: <im.ImTree style={{ marginRight: 10 }} /> },
];

const BannerCom: React.FC<ShortcutsComType> = () => {
  const history = useHistory();

  /**
   * @description: 按钮循环
   * @return {*}
   */

  return (
    <CardWidthTitle className="shortcuts-wrap" title={'常用'}>
      <div className="groupbuttons">
        {btns.map((item) => {
          return (
            <Button
              className="shortcuts-btn"
              key={item.label}
              size="large"
              icon={item.icon}
              onClick={() => {
                switch (item.label) {
                  case '加好友':
                    command.emitter('config', 'joinFriend', orgCtrl.user.directory);
                    break;
                  case '定标准':
                    orgCtrl.currentKey = '';
                    orgCtrl.changCallback();
                    history.push('/setting');
                    break;
                  case '建群组':
                    command.emitter('config', 'newCohort', orgCtrl.user.directory);
                    break;
                  case '加群组':
                    command.emitter('config', 'joinCohort', orgCtrl.user.directory);
                    break;
                  case '建单位':
                    command.emitter('config', 'newCompany', orgCtrl.user.directory);
                    break;
                  case '加单位':
                    command.emitter('config', 'joinCompany', orgCtrl.user.directory);
                    break;
                  default:
                    break;
                }
              }}>
              {item.label}
            </Button>
          );
        })}
      </div>
    </CardWidthTitle>
  );
};

export default BannerCom;
