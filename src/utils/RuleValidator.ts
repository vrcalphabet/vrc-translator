import escapeRegExp from 'escape-string-regexp';
import { RuleTypes, XprTypes } from '../common';
import KeysParser from './KeysParser';

export default class RuleValidator {
  public static normalizePathList(pathList: XprTypes.XprPathList): RuleTypes.RulePathList {
    return pathList.map((path) => {
      const pathRegEx = escapeRegExp(path)
        .replaceAll('/@d', '/[\\w-]+?')
        .replaceAll('/@p', '(/[\\w-]+?)+')
        .replaceAll('/@f', '(/[\\w-]+?\\.\\w+?)?');
      return new RegExp(`^${pathRegEx}$`);
    });
  }

  public static normalizeKeys(keys: XprTypes.XprTransKeys): RuleTypes.RuleTransKeys {
    return new KeysParser().parse(keys);
  }

  public static validateXpath(xpath: string): string {
    const result: string[] = [];

    // 識別子と条件で別々のトークンに分ける
    // 'a[b]/c[d]' → ['a', '[b]', '/c', '[d]']
    const tokens = xpath.split(/(\[.+?\])/);
    tokens.forEach((token, index) => {
      // インデックスが偶数（識別子）の場合
      if (index % 2 === 0) {
        result.push(this.validateXpathIdent(token));
      }
      // インデックスが奇数（条件）の場合
      else {
        result.push(this.validateXpathCond(token));
      }
    });

    return result.join('');
  }

  private static validateXpathIdent(xpathIdent: string): string {
    return (
      xpathIdent
        // #id記法を属性記法に変換
        .replaceAll(/#([\w-]+)/g, '[@id="$1"]')
        // .class記法を属性記法に変換
        .replaceAll(/\.([\w-]+)/g, '[contains(@class, "$1")]')
    );
  }

  private static validateXpathCond(xpathCond: string): string {
    return (
      xpathCond
        // インデックス範囲指定を正しい記法に変換
        .replaceAll(/(\d+):(\d+)/g, '(position() >= $1 and position() <= $2)')
        // インデックス複数指定を正しい記法に変換
        .replaceAll(/(\d+),(\d+)/g, 'position() = $1 or position() = $2')
        .replaceAll(/,(\d+)/g, ' or position() = $1')
        .replaceAll(/(\d+),/g, 'position() = $1 or ')
    );
  }
}
