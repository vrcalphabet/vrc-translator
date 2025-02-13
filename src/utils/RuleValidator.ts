import { RuleTypes } from '../common';

export default class RuleValidator {
  public static validate(rule: RuleTypes.Rule): void {
    for (const ruleGroup of rule) {
      this.validateGroup(ruleGroup);
    }
  }

  private static validateGroup(ruleGroup: RuleTypes.RuleGroup): void {
    this.validateNodes(ruleGroup.nodes);
  }

  private static validateNodes(nodes: RuleTypes.RuleNodeList): void {
    for (const node of nodes) {
      this.validateNode(node);
    }
  }

  private static validateNode(node: RuleTypes.RuleNode): void {
    node.xpath = this.validateXpath(node.xpath);
  }

  private static validateXpath(xpath: string): string {
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
