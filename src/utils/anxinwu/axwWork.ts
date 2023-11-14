import { model, schema } from '@/ts/base';
import { logger } from '@/ts/base/common';
import orgCtrl from '@/ts/controller';
import { IWorkTask } from '@/ts/core';
import axios from 'axios';

const baseUrl = 'https://51jishu.com';
// 转化申请_填写信息表单ID
const zhuanhua_tianxiexinxi_formId = '505330904395292673';
// 转化申请_选择成果表单ID
const zhuanhua_xuanzechengguo_formId = '505330904529510401';

export const getLoginToken = async (): Promise<{
  success: boolean;
  messsgae: string;
  tonket?: string;
}> => {
  const ret = await axios.post(
    `/userinfo/user/loginByAppKey`,
    {
      app_key: '7c1373b8fec010dba9b2cf06e7b232a7',
      app_secret: 'fec010dba9b2cf06',
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  if (ret.status == 200) {
    const datas = ret.data['datas'];
    if (datas) {
      const tonket = datas['tonket'];
      if (tonket) {
        return { success: true, tonket, messsgae: '' };
      }
    }
  }
  return { success: false, messsgae: ret.statusText };
};

export const approvelWork = async (work: IWorkTask) => {
  switch (work.taskdata.defineId) {
    //转化申请
    case '507470117328789504':
      if (work.taskdata.identityId == '507468792658534400') {
        await pushAchievement(work.instanceData!);
      }
      break;
    default:
      break;
  }
  return true;
};
const pushAchievement = async (instanceData: model.InstanceDataModel) => {
  var result = await getLoginToken();
  if (result.success) {
    const last = instanceData.data[zhuanhua_tianxiexinxi_formId]?.at(-1);
    const form1 = last?.after[0];
    const data = await getAchievementInfo(instanceData);
    var ret = await axios.post(`/api/open/achievement/submit`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: result.tonket!,
      },
    });
    if (ret.status == 200) {
      const datas = ret.data['datas'];
      if (datas) {
        const achievement_no = datas['achievement_no'];
        if (achievement_no) {
          console.log(achievement_no);
          if (form1) {
            form1['512155583277834241'] = achievement_no;
            return true;
          }
        }
      }
    } else {
      logger.error('推送成果失败!' + JSON.stringify(ret.data));
    }
  } else {
    logger.error('获取tpken失败!');
  }
  return false;
};

const getAchievementInfo = async (instanceData: model.InstanceDataModel) => {
  const form1 = instanceData.data[zhuanhua_tianxiexinxi_formId]?.at(-1)?.after.at(-1);
  const form2 = instanceData.data[zhuanhua_xuanzechengguo_formId]?.at(-1)?.after;
  if (form1 && form2) {
    const detail = form2.map((a) => {
      return {
        effective: 1,
        owner: a['505330903514488840'] ?? '未知',
        asset_no: a['505330903501905922'] ?? '未知',
        inventor: (a['505330904571453445'] as string)?.split(/;|；/) ?? [],
        patent_name: a['505330903506100235'] ?? '未知',
        patent_no: a['505330903501905922'] ?? '未知',
      };
    });
    const contact =
      (await orgCtrl.user.findEntityAsync(form1['505330904445624325']))?.name ?? '未知';
    var transfer_mode = 'apply_transfer';
    switch (form1['505330904445624336']) {
      case 'S505330879372075010':
        transfer_mode = 'patent_transfer';
        break;
      case 'S505330879372075025':
        transfer_mode = 'apply_transfer';
        break;
      case 'S505330879372075011':
        transfer_mode = 'ordinary';
        break;
      case '505330879372075014':
        transfer_mode = 'exclusive';
        break;
      case 'S505330879372075016':
        transfer_mode = 'exclude';
        break;
      case 'SF':
        transfer_mode = 'other_permit';
        break;
      case 'S505330879372075019':
        transfer_mode = 'free';
        break;
      case 'S505330879372075021':
        transfer_mode = 'shareholder';
        break;
      default:
        transfer_mode = 'other';
        break;
    }
    var maturity = 'development';
    switch (form1['505330904445624327']) {
      case 'S505330879762145282':
        maturity = 'development';
        break;
      case 'S505330879762145284':
        maturity = 'demo';
        break;
      case 'S505330879762145286':
        maturity = 'small';
        break;
      case 'S505330879762145287':
        maturity = 'pilot';
        break;
      case 'S505330879762145290':
        maturity = 'production';
        break;
      default:
        break;
    }
    var classification = form1['505330904445624334'];
    return {
      public: 1,
      is_back: true,
      //是否为专利
      patent: 1,
      //转让方式
      transfer_mode: [transfer_mode],
      //成熟度
      maturity: maturity,
      //单据编号
      invoice_no: 'CGZH20220417000094',
      //成果名称
      name_cn: form1['505330903522877455'],
      //行业分类
      classification: ['6', '6001'],
      //成果详情
      patent_detail: detail,
      //定价方式
      pricing_type: 'definite',
      //成果说明
      detail_url_cn: form1['505330904445624328'] ?? ' ',
      //所属地区
      affiliating_area: ['0', '330000', '330101'],
      //赋权年限
      permit_period: '',
      //价格
      price: {
        amount: form1['505330903510294534'],
      },
      //成果联系人
      contact: contact,
      //接受成交主体类型
      principal_type: ['enterprise'],
    };
  }
};
