import { Trans } from '../common/Trans';
import { Tsr } from '../common/Tsr';

/** ツリー構造の翻訳データを単純なキーと翻訳データの配列に変換するクラス */
export default class TransParser {
  /** 変換後のキーと翻訳データの集合 */
  private trans!: Trans;

  /**
   * ツリー構造の`trans.json`を単純な配列に変換します。
   * @param tree ツリー構造の`trans.json`
   * @returns 変換された単純なキーと翻訳データの配列
   */
  public parse(tree: Tsr): Trans {
    /** 変換後のキーと翻訳データの集合 */
    this.trans = {};
    this.parseObject(tree, []);
    return this.trans;
  }

  private parseObject(tree: Tsr, keyList: Array<string>): void {
    for (const key in tree) {
      this.parseValue(key, tree[key], keyList);
    }
  }

  private parseValue(key: string, value: string | Tsr, keyList: Array<string>): void {
    keyList.push(key);
    // typeof value === string
    if (typeof value === 'string') {
      this.pushValue(keyList.join('.'), value);
    }
    // typeof value === TsrTypes.Tsr
    else {
      this.parseObject(value, keyList);
    }
    keyList.pop();
  }

  private pushValue(key: string, trans: string): void {
    this.trans[key] = trans;
  }
}
