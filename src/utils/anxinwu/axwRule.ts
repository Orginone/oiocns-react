import { kernel, model, schema } from '@/ts/base';
import { formatDate } from '@/utils';
// 转化申请_填写信息表单ID
const zhuanhua_tianxiexinxi_formId = '505330904395292673';
// 转化申请_选择成果表单ID
const zhuanhua_xuanzechengguo_formId = '505330904529510401';
//转化申请_收益分配表单ID
const zhuanhua_shouyifenpei_formId = '505330904923774977';
//转化申请_填写信息_项目名称
const zhuanhua_tianxiexinxi_name = '505330903522877455';
//转化申请_填写信息_金额
const zhuanhua_tianxiexinxi_jine = '505330903510294534';
//转化申请_填写信息_转让方式
const zhuanhua_tianxiexinxi_zrfs = '505330904445624336';
//转化申请_选择成果_成果名称
const zhuanhua_xuanzechengguo_name = '505330903506100235';
//转化申请_选择成果_金额
const zhuanhua_xuanzechengguo_jine = '505330904571453447';
//转化申请_选择成果_所有发明人
const zhuanhua_xuanzechengguo_suoyouren = '505330904571453445';
//转化申请_收益分配_人名
const zhuanhua_shouyifenpei_person = '505330903514488851';
//转化申请_收益分配_成果名称
const zhuanhua_shouyifenpei_name = '505330904969912321';

// 赋权_基本信息_表单ID
const fuquan_jibenxinxi_formId = '505330905028632577';
// 赋权_基本信息_拟转化金额
const fuquan_jibenxinxi_jine = '505330905074769926';
//赋权_选择成果_表单ID
const fuquan_xuanzechengguo_formId = '505330905141878785';
//赋权_选择成果_金额
const fuquan_xuanzechengguo_jine = '505330905188016137';
//赋权_选择成果_成果名称
const fuquan_xuanzechengguo_name = '505330903506100235';
//赋权_选择成果_所有发明人
const fuquan_xuanzechengguo_suoyouren = '505330905188016136';
//赋权_收益分配_表单ID
const fuquan_shouyifenpei_formId = '505330905498394625';
//赋权_收益分配_人名
const fuquan_shouyifenpei_person = '505330903514488851';
//赋权_收益分配_成果名称
const fuquan_shouyifenpei_name = '505330905540337665';
const fuquan_shiyong_formid = '505330905322233857';
const fuquan_shiyong_name = '505330905364176897';
const fuquan_suoyou_formid = '505330905406119937';
const fuquan_suoyou_name = '505330905448062977';

const hetong_jibenxinxi_formId = '505330905594863617';
const hetong_jibenxinxi_name = '505330905649389570';
const hetong_jibenxinxi_htname = '505330905653583873';
const hetong_jibenxinxi_jingbanren = '505330905649389571';
const hetong_jibenxinxi_churangfangshi = '505330905649389571';
const hetong_jibenxinxi_jine = '505330905653583875';
const hetong_xuanze_formId = '510765567343468545';
const hetong_xuanze_name = '505330903522877455';
const hetong_xuanze_churangfangshi = '505330903527071751';
const hetong_xuanze_jine = '505330903510294534';
const hetong_xuanze_jingbanren = '505330903514488837';

const shouyifenpei_formId = '505330905959768065';
const shouyifenpei_htname = '505330906026876930';
const shouyifenpei_name = '505330906026876931';
const shouyifenpei_htjine = '505330906026876932';
const shouyifenpei_jingbanren = '505330906026876933';
const shouyifenpei_xuanze_formId = '511844784000868353';
const shouyifenpei_xuanze_name = '505330903522877455';
const shouyifenpei_xuanze_htname = '505330903510294530';
const shouyifenpei_xuanze_htjine = '505330903510294534';
const shouyifenpei_xuanze_jingbanren = '505330903514488846';

export const validate = async (
  formId: string,
  formData: Map<string, model.FormEditData>,
  belongId: string,
  fields: {
    [id: string]: model.FieldModel[];
  },
  changedValues: any,
) => {
  switch (formId) {
    // 转化申请 成果信息填写表
    case zhuanhua_tianxiexinxi_formId:
    case zhuanhua_xuanzechengguo_formId:
      if (
        formId == zhuanhua_xuanzechengguo_formId ||
        changedValues[zhuanhua_tianxiexinxi_zrfs] != undefined
      ) {
        var form1 = formData.get(zhuanhua_tianxiexinxi_formId);
        var form2 = formData.get(zhuanhua_xuanzechengguo_formId);
        var form3 = formData.get(zhuanhua_shouyifenpei_formId);
        if (form1 && form2 && form3 && form2.after.length > 0) {
          const cgtype = form1.after[0][zhuanhua_tianxiexinxi_zrfs];
          if (cgtype) {
            var typeText = fields[zhuanhua_tianxiexinxi_formId]
              .find((a) => a.id == zhuanhua_tianxiexinxi_zrfs)
              ?.lookups?.find((a) => a.value == cgtype)?.text;
            // 项目名称
            form1.after[0][zhuanhua_tianxiexinxi_name] = `${
              form2.after[0][zhuanhua_xuanzechengguo_name]
            }${
              form2.after.length > 1 ? '等' + form2.after.length + '项' : ''
            }${typeText}`;
          }
          //协议定价/挂牌底价/拍卖底价
          var jine = 0;
          const after: schema.XThing[] = [];
          for (const thing of form2.after) {
            jine += thing[zhuanhua_xuanzechengguo_jine] ?? 0;
            for (const personName of (
              thing[zhuanhua_xuanzechengguo_suoyouren] as string
            ).split(/;|；/)) {
              const result = await kernel.createThing(belongId, [], form3.formName);
              if (result.success) {
                result.data[zhuanhua_shouyifenpei_name] =
                  thing[zhuanhua_xuanzechengguo_name];
                result.data[zhuanhua_shouyifenpei_person] = personName;
                after.push(result.data);
              }
            }
          }
          form3.after = after;
          form1.after[0][zhuanhua_tianxiexinxi_jine] = jine;
          return true;
        }
      }
      break;
    case fuquan_xuanzechengguo_formId:
      {
        var form1 = formData.get(fuquan_jibenxinxi_formId);
        var form2 = formData.get(fuquan_xuanzechengguo_formId);
        var form3 = formData.get(fuquan_shouyifenpei_formId);
        var shiyongForm = formData.get(fuquan_shiyong_formid);
        var suoyouForm = formData.get(fuquan_suoyou_formid);
        if (
          form1 &&
          form2 &&
          shiyongForm &&
          suoyouForm &&
          form3 &&
          form2.after.length > 0
        ) {
          var jine = 0;
          const after: schema.XThing[] = [];
          const shiyongafter: schema.XThing[] = [];
          const suoyouafter: schema.XThing[] = [];
          for (const thing of form2.after) {
            jine += thing[fuquan_xuanzechengguo_jine] ?? 0;
            {
              const result = await kernel.createThing(belongId, [], shiyongForm.formName);
              if (result.success) {
                result.data[fuquan_shiyong_name] = thing[fuquan_xuanzechengguo_name];
                shiyongafter.push(result.data);
              }
            }
            {
              const result = await kernel.createThing(belongId, [], suoyouForm.formName);
              if (result.success) {
                result.data[fuquan_suoyou_name] = thing[fuquan_xuanzechengguo_name];
                suoyouafter.push(result.data);
              }
            }
            for (const personName of (
              thing[fuquan_xuanzechengguo_suoyouren] as string
            ).split(/;|；/)) {
              const result = await kernel.createThing(belongId, [], form3.formName);
              if (result.success) {
                result.data[fuquan_shouyifenpei_name] = thing[fuquan_xuanzechengguo_name];
                result.data[fuquan_shouyifenpei_person] = personName;
                after.push(result.data);
              }
            }
          }
          form3.after = after;
          shiyongForm.after = shiyongafter;
          suoyouForm.after = suoyouafter;
          form1.after[0][fuquan_jibenxinxi_jine] = jine;
          return true;
        }
      }
      break;
    case hetong_xuanze_formId:
      {
        const form1 = formData.get(hetong_jibenxinxi_formId);
        const form2 = formData.get(hetong_xuanze_formId);
        if (form1 && form2) {
          if (form2.after.length > 0) {
            const form2Data = form2.after.at(-1);
            if (form2Data) {
              form1.after[0][hetong_jibenxinxi_name] = form2Data[hetong_xuanze_name];
              if (form1.after[0][hetong_jibenxinxi_htname] == undefined) {
                form1.after[0][hetong_jibenxinxi_htname] = form2Data[hetong_xuanze_name];
              }
              form1.after[0][hetong_jibenxinxi_jine] = form2Data[hetong_xuanze_jine];
              form1.after[0][hetong_jibenxinxi_jingbanren] =
                form2Data[hetong_xuanze_jingbanren];
              form1.after[0][hetong_jibenxinxi_churangfangshi] =
                form2Data[hetong_xuanze_churangfangshi];
              form2.after = [form2Data];
            }
          } else {
            delete form1.after[0][hetong_jibenxinxi_name];
            delete form1.after[0][hetong_jibenxinxi_jine];
            delete form1.after[0][hetong_jibenxinxi_jingbanren];
            delete form1.after[0][hetong_jibenxinxi_churangfangshi];
          }
          return true;
        }
      }
      break;
    case '505330905959768065':
      {
        const ratio_zhijie_id = '505330906026876943'; //直接提取比例
        const ratio_henxiang_id = '505330906026876944'; //横向经费比例
        const form1 = formData.get('505330905959768065');
        if (form1) {
          var success = false;
          //直接提取比例、横向经费比例总和应为100,不为100则提示，并清除两个值以重填.防止填入修改后比例
          if (
            form1.after[0][ratio_zhijie_id] &&
            form1.after[0][ratio_henxiang_id] == undefined
          ) {
            form1.after[0][ratio_henxiang_id] = 100 - form1.after[0][ratio_zhijie_id];
            success = true;
          }
          if (
            form1.after[0][ratio_henxiang_id] &&
            form1.after[0][ratio_zhijie_id] == undefined
          ) {
            form1.after[0][ratio_zhijie_id] = 100 - form1.after[0][ratio_henxiang_id];
            success = true;
          }
          if (
            form1.after[0][ratio_zhijie_id] > 100 ||
            form1.after[0][ratio_henxiang_id] > 100
          ) {
            alert('比例超出范围');
            form1.after[0][ratio_zhijie_id] = null;
            form1.after[0][ratio_henxiang_id] = null;
            success = true;
          }
          if (
            form1.after[0][ratio_zhijie_id] &&
            form1.after[0][ratio_henxiang_id] &&
            form1.after[0][ratio_zhijie_id] + form1.after[0][ratio_henxiang_id] != 100
          ) {
            alert('直接提取比例、横向经费比例总和应为100%');
            form1.after[0][ratio_zhijie_id] = null;
            form1.after[0][ratio_henxiang_id] = null;
            success = true;
          }
          if (form1 && changedValues['505330906026876934'] != undefined) {
            //净收益
            form1.after[0]['505330906026876942'] = changedValues['505330906026876934'];
            success = true;
          }
          if (
            form1?.after[0]['505330906026876934'] != undefined &&
            form1?.after[0]['505330906026876943'] != undefined
          ) {
            form1.after[0]['505330906026876945'] =
              (form1?.after[0]['505330906026876934'] *
                form1?.after[0]['505330906026876943']) /
              100;
            success = true;
          }
          if (
            form1?.after[0]['505330906026876934'] != undefined &&
            form1?.after[0]['505330906026876944'] != undefined
          ) {
            form1.after[0]['505330903535460360'] =
              (form1?.after[0]['505330906026876934'] *
                form1?.after[0]['505330906026876944']) /
              100;
            success = true;
          }

          return success;
        }
      }
      break;
    case '505330905028632577': //成果信息-转化状态 ：未转化时必填转化方式及转化对象，否则不是必填项。
      {
        const zt_zhuanhua_id = '505330905074769931'; //转化状态
        let form1 = formData.get(fuquan_jibenxinxi_formId);
        if (form1) {
          //未转化
          if (
            form1.after[0][zt_zhuanhua_id] == 'S505330880009609218' &&
            fields['505330905028632577'][7].options &&
            fields['505330905028632577'][9].options
          ) {
            fields['505330905028632577'][7].options.isRequired = true;
            fields['505330905028632577'][9].options.isRequired = true;
          }
          //转化许可中
          if (
            form1.after[0][zt_zhuanhua_id] == 'S505330880009609220' &&
            fields['505330905028632577'][7].options &&
            fields['505330905028632577'][9].options
          ) {
            fields['505330905028632577'][7].options.isRequired = false;
            fields['505330905028632577'][9].options.isRequired = false;
          }
          return true;
        }
      }
      break;
    case shouyifenpei_xuanze_formId:
      {
        const form1 = formData.get(shouyifenpei_formId);
        const form2 = formData.get(shouyifenpei_xuanze_formId);
        const neibushouyi = formData.get('505330906203037697');
        if (form1 && form2 && neibushouyi) {
          if (form2.after.length > 0) {
            const form2Data = form2.after.at(-1);
            if (form2Data) {
              form1.after[0][shouyifenpei_htname] = form2Data[shouyifenpei_xuanze_htname];
              form1.after[0][shouyifenpei_name] = form2Data[shouyifenpei_xuanze_name];
              form1.after[0][shouyifenpei_htjine] = form2Data[shouyifenpei_xuanze_htjine];
              form1.after[0][shouyifenpei_jingbanren] =
                form2Data[shouyifenpei_xuanze_jingbanren];
              form2.after = [form2Data];
              const shouyiAfter = [];
              {
                const result = await kernel.createThing(
                  belongId,
                  [],
                  neibushouyi.formName,
                );
                if (result) {
                  result.data['505330906244980737'] = '一种忆阻器等效电路的构建方法';
                  result.data['505330906244980738'] = '刘国华';
                  result.data['505330906244980739'] = '40193';
                  result.data['505330906244980743'] = 100;
                  result.data['505330906244980744'] = form1.after[0][shouyifenpei_htjine];
                  shouyiAfter.push(result.data);
                }
              }
              {
                const result = await kernel.createThing(
                  belongId,
                  [],
                  neibushouyi.formName,
                );
                if (result) {
                  result.data['505330906244980737'] = '一种忆阻器等效电路的构建方法';
                  result.data['505330906244980738'] = '王光义';
                  result.data['505330906244980739'] = '40110';
                  result.data['505330906244980743'] = 0;
                  result.data['505330906244980744'] = 0;
                  shouyiAfter.push(result.data);
                }
              }
              neibushouyi.after = shouyiAfter;
            }
          } else {
            delete form1.after[0][shouyifenpei_htname];
            delete form1.after[0][shouyifenpei_name];
            delete form1.after[0][shouyifenpei_htjine];
            delete form1.after[0][shouyifenpei_jingbanren];
            neibushouyi.after = [];
          }
          return true;
        }
      }
      break;

    default:
      break;
  }
  return false;
};

export const initApplyData = (
  belongId: string,
  instanceData: model.InstanceDataModel,
  formData: Map<string, model.FormEditData>,
) => {
  [...instanceData.node.primaryForms, ...instanceData.node.detailForms].forEach(
    (form) => {
      var initData = instanceData.data[form.id]?.at(-1);
      var data1: schema.XThing[] = [];
      if (initData) {
        for (var after of initData.after) {
          var before = initData.before.find((a) => a.id == after.id);
          data1.push({ ...before, ...after });
        }
      }
      const data = {
        before: data1,
        after: data1,
        nodeId: instanceData.node.id,
        formName: form.name,
        creator: belongId,
        createTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
      };
      instanceData.data[form.id] = [data];
      formData.set(form.id, data);
    },
  );
};
