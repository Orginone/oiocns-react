import orgCtrl from '@/ts/controller';
import FormModal from '@/bizcomponents/GlobalComps/createForm';
import TeamModal from '@/bizcomponents/GlobalComps/createTeam';
import SpeciesModal from '@/bizcomponents/GlobalComps/createSpecies';
import AuthorityModal from '@/bizcomponents/GlobalComps/createAuthority';
import DictModal from '@/bizcomponents/GlobalComps/createDict';
import { GroupMenuType, MenuType } from '../config/menuType';
import SearchTarget from '@/bizcomponents/SearchCompany';
import { MenuItemType } from 'typings/globelType';
import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { XTarget } from '@/ts/base/schema';
import { ISpeciesItem, TargetType } from '@/ts/core';
import PropertyModal from '@/bizcomponents/GlobalComps/createProperty';
import ImportModal from '@/bizcomponents/GlobalComps/import';
import { model } from '@/ts/base';

interface IProps {
  operateKey: string;
  selectMenu: MenuItemType;
  confrim: () => void;
}

const OperateIndex = ({ selectMenu, operateKey, confrim }: IProps) => {
  const [searchCallback, setSearchCallback] = useState<XTarget[]>();
  return (
    <>
      {/** 用户模态框 */}
      {operateKey.includes('用户') && (
        <TeamModal
          isEdit={operateKey.includes('编辑')}
          title={operateKey.split('|')[0]}
          open={operateKey.includes('用户')}
          handleCancel={confrim}
          handleOk={confrim}
          current={selectMenu.item}
          typeNames={operateKey.split('|')}
        />
      )}

      {/** 字典模态框 */}
      {operateKey.includes('字典') && (
        <DictModal
          space={
            selectMenu.itemType == GroupMenuType.DictGroup ? selectMenu.item : undefined
          }
          open={operateKey.includes('字典')}
          handleCancel={confrim}
          handleOk={confrim}
          dict={selectMenu.itemType == MenuType.Dict ? selectMenu.item : undefined}
        />
      )}
      {/** 分类模态框 */}
      {operateKey.includes('类别') &&
        (operateKey.includes('导入') ? (
          <ImportModal
            title={operateKey}
            open={operateKey.includes('导入')}
            handleCancel={confrim}
            handleOk={confrim}
            species={selectMenu.item}
            sheetNumber={0}
            operatingItem={async function (item: any): Promise<void> {
              let species = selectMenu.item as ISpeciesItem;0
              await species.create({
                name: item['名称'],
                code: item['代码'],
                typeName: item['类型'],
                authId: species.metadata.authId,
                remark: item['说明'],
              } as model.SpeciesModel);
            }}
          />
        ) : (
          <SpeciesModal
            title={operateKey}
            open={operateKey.includes('类别')}
            handleCancel={confrim}
            handleOk={confrim}
            current={
              selectMenu.itemType != MenuType.Species ? selectMenu.item : undefined
            }
            species={
              selectMenu.itemType === MenuType.Species ? selectMenu.item : undefined
            }
          />
        ))}
      {/** 权限模态框 */}
      {operateKey.includes('权限') && (
        <AuthorityModal
          title={operateKey}
          open={operateKey.includes('权限')}
          current={selectMenu.item}
          handleCancel={confrim}
          handleOk={confrim}
        />
      )}
      {/** 权限模态框 */}
      {operateKey.includes('表单') && (
        <FormModal
          open={operateKey.includes('表单')}
          current={operateKey.includes('编辑') ? selectMenu.item : undefined}
          species={operateKey.includes('新增') ? selectMenu.item : undefined}
          handleCancel={confrim}
          handleOk={confrim}
        />
      )}
      {/** 属性模态框 */}
      {operateKey.includes('属性') && (
        <PropertyModal
          species={
            operateKey.includes('新增') ? selectMenu.item : selectMenu.item.species
          }
          data={operateKey.includes('编辑') ? selectMenu.item.property : undefined}
          open={operateKey.includes('属性')}
          handleCancel={confrim}
          handleOk={confrim}
        />
      )}
      {/** 用户搜索框 */}
      {operateKey.includes('加入') && (
        <Modal
          title={'搜索' + operateKey.split('|')[1]}
          open={operateKey.includes('加入')}
          width={670}
          destroyOnClose={true}
          bodyStyle={{ padding: 0 }}
          okText="确定"
          onOk={async () => {
            if (await orgCtrl.user.applyJoin(searchCallback || [])) {
              message.success('已申请加入成功.');
            }
            confrim();
          }}
          onCancel={confrim}>
          <SearchTarget
            searchCallback={setSearchCallback}
            searchType={
              operateKey.includes('单位') ? TargetType.Company : TargetType.Cohort
            }
          />
        </Modal>
      )}
    </>
  );
};

export default OperateIndex;
