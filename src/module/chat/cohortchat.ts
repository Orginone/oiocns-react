import API from '../../services';
class CohortSericve {
  /**
   * @description: 邀请加入群聊
   * @return {*}
   */
  public async getpullPerson(params: any) {
    const { data, success, code } = await API.cohort.pullPerson({
      data: params,
    });

    if (!success) {
      return { data: {}, success };
    }
    return { data, success, code };
  }

  /**
   * @description: 移出群聊
   * @return {*}
   */
  public async getremovePerson(params: any) {
    const { data, success, code } = await API.cohort.removePerson({
      data: params,
    });

    if (!success) {
      return { data: {}, success };
    }
    return { data, success, code };
  }
}
const cohortSericve = new CohortSericve();
export default cohortSericve;
