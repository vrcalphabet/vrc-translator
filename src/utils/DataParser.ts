import { RuleTransTypes, RuleTypes, TransTypes, TsrTypes, XprTsrTypes, XprTypes } from '../common';
import RuleParser from './RuleParser';
import Storage from './Storage';
import TransParser from './TransParser';

export default class DataParser {
  public static async parse(): Promise<RuleTransTypes.RuleTrans | null> {
    const data = await Storage.get('data');
    if (!data) return null;

    const parsedData = JSON.parse(data) as XprTsrTypes.XprTsr;
    const rules = this.parseRule(parsedData.rules);
    const trans = this.parseTrans(parsedData.trans);

    return {
      rules: rules,
      trans: trans,
    } as RuleTransTypes.RuleTrans;
  }

  /**
   * `rule.json`の内容を`chrome.storage`から取得し、単純な配列に変換したものを返します。
   * @returns 変換された`rule.json`の内容、値が保存されていない場合はnull
   */
  public static parseRule(rules: XprTypes.Xpr): RuleTypes.Rule {
    return new RuleParser().parse(rules);
  }

  /**
   * `trans.json`の内容を`chrome.storage`から取得し、単純な配列に変換したものを返します。
   * @returns 変換された`trans.json`の内容、値が保存されていない場合はnull
   */
  public static parseTrans(trans: TsrTypes.Tsr): TransTypes.Trans {
    return new TransParser().parse(trans);
  }
}
