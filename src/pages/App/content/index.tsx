import OioForm from '@/components/Form';
import Design from '@/pages/Setting/components/design';
import React, { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import { XOperation } from '@/ts/base/schema';
import { OperationModel } from '@/ts/base/model';
import { Button, Card, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { ImUndo2 } from 'react-icons/im';

interface IProps {
  selectMenu: MenuItemType;
  contentType: string;
  setContentType: Function;
  onSave: Function;
}

/** 内容区 */
const ContentIndex = (props: IProps) => {
  const [operationModel, setOperationModel] = useState<OperationModel>();
  const operationModel2Operation = (model: OperationModel) => {
    // name: string;
    // code: string;
    // attrId: string;
    // rule: string;
    // remark: string;
    // speciesIds: string[];
    // id: string;
    // name: string;
    // code: string;
    // rule: string;
    // remark: string;
    // operationId: string;
    // belongId: string;
    // attrId: string;
    // status: number;
    // createUser: string;
    // updateUser: string;
    // version: string;
    // createTime: string;
    // updateTime: string;
    // operation: XOperation | undefined;
    // belong: XTarget | undefined;
    // attr: XAttribute | undefined;
    // containSpecies: XSpecies[] | undefined;
    // operationRelations: XOperationRelation[] | undefined;
    // let operationId = model.id || getUuid(),
    // let operation: XOperation = {
    //   id: operationId,
    //   name: model.name,
    //   code: model.code,
    //   public: model.public,
    //   remark: model.remark,
    //   speciesId: model.speciesId,
    //   belongId: model.belongId,
    //   defineId: model.defineId || '',
    //   beginAuthId: model.beginAuthId || '',
    //   status: 1,
    //   createUser: '',
    //   updateUser: '',
    //   version: '',
    //   createTime: '',
    //   updateTime: '',
    //   flow: undefined,
    //   species: undefined,
    //   belong: undefined,
    //   items: model.items?.map((item) => {
    //     return {
    //       id: getUuid(),
    //       name: item.name,
    //       code: item.code,
    //       rule: item.rule,
    //       remark: item.remark,
    //       operationId: model.id || '',
    //     };
    //   }),
    // };
    // return operation;
  };
  const saveDesign = async () => {
    if (operationModel) {
      // let operation: XOperation = operationModel2Operation(operationModel);
      // props.onSave(operation);
    }
    message.success('保存成功');
  };
  /** 加载内容区 */
  switch (props.selectMenu.itemType) {
    case '表单':
      if (props.selectMenu.item && props.contentType == 'formDesign') {
        return (
          <Card
            title={props.selectMenu.label}
            extra={
              <>
                <Button
                  onClick={() => {
                    props.setContentType(undefined);
                    saveDesign();
                  }}
                  type="primary"
                  icon={<SaveOutlined />}
                  disabled={!operationModel}>
                  保存
                </Button>
                <Button
                  key="back"
                  type="link"
                  onClick={() => {
                    props.setContentType(undefined);
                  }}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ paddingTop: '2px' }}>
                      <ImUndo2 />
                    </div>
                    <div style={{ paddingLeft: '6px' }}>返回</div>
                  </div>
                </Button>
              </>
            }>
            <Design
              operation={props.selectMenu.item.design}
              current={props.selectMenu.item.species}
              setOperationModel={setOperationModel}
              toFlowDesign={(operation: XOperation) => {}}
            />
          </Card>
        );
      }
      return (
        props.selectMenu.item && (
          <Card>
            {' '}
            <OioForm
              operation={props.selectMenu.item.design}
              onValuesChange={(values) => console.log('values', values)}
              formRef={undefined}
            />
          </Card>
        )
      );
    default:
      return <></>;
  }
};

export default ContentIndex;
