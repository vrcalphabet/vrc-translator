import Storage from './Storage';
import RuleParser from './RuleParser';
import TransParser from './TransParser';
import { XprTypes, RuleTypes, TsrTypes, TransTypes } from '../common';

export default class DataParser {
  /**
   * `rule.json`の内容を`chrome.storage`から取得し、単純な配列に変換したものを返します。
   * @returns 変換された`rule.json`の内容、値が保存されていない場合はnull
   */
  public static async parseRule(): Promise<RuleTypes.Rule | null> {
    const ruleContent = await Storage.get('rule');
    if (ruleContent === undefined) return null;

    const ruleParser = RuleParser.getInstance();
    const ruleData: XprTypes.Xpr = JSON.parse(ruleContent) satisfies XprTypes.Xpr;
    return ruleParser.parse(ruleData);
  }

  /**
   * `trans.json`の内容を`chrome.storage`から取得し、単純な配列に変換したものを返します。
   * @returns 変換された`trans.json`の内容、値が保存されていない場合はnull
   */
  public static async parseTrans(): Promise<TransTypes.Trans | null> {
    const transContent = await Storage.get('trans');
    if (transContent === undefined) return null;

    const transParser = TransParser.getInstance();
    const transData: TsrTypes.Tsr = JSON.parse(transContent) satisfies TsrTypes.Tsr;
    return transParser.parse(transData);
  }
}
