import { TsrTypes, TransTypes } from '../common';

/** ツリー構造の翻訳データを単純なキーと翻訳データの配列に変換するクラス */
export default class TransParser {
  private static readonly INSTANCE = new TransParser();
  private constructor() {}

  public static getInstance(): TransParser {
    return this.INSTANCE;
  }

  /** 変換後のキーと翻訳データの集合 */
  private trans!: TransTypes.Trans;

  /**
   * ツリー構造の`trans.json`を単純な配列に変換します。
   * @param tree ツリー構造の`trans.json`
   * @returns 変換された単純なキーと翻訳データの配列
   */
  public parse(tree: TsrTypes.Tsr): TransTypes.Trans {
    /** 変換後のキーと翻訳データの集合 */
    this.trans = {};
    this.parseObject(tree, []);
    return this.trans;
  }

  private parseObject(tree: TsrTypes.Tsr, keyList: Array<string>): void {
    for (const key in tree) {
      this.parseValue(key, tree[key], keyList);
    }
  }

  private parseValue(key: string, value: string | TsrTypes.Tsr, keyList: Array<string>): void {
    // typeof value === string
    if (typeof value === 'string') {
      this.pushValue(keyList.join('/'), key, value);
    }
    // typeof value === TsrTypes.Tsr
    else {
      keyList.push(key);
      this.parseObject(value, keyList);
      keyList.pop();
    }
  }

  private pushValue(key: string, source: string, trans: string): void {
    if (!(key in this.trans)) {
      this.trans[key] = [];
    }

    this.trans[key].push({ source, trans });
  }
}
