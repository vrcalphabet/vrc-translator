import { XprTypes, RuleTypes } from '../common';
import RuleValidator from './RuleValidator';

/** ツリー構造のノードを単純なノードの配列に変換するクラス */
export default class RuleParser {
  private static readonly INSTANCE = new RuleParser();
  private constructor() {}

  public static getInstance(): RuleParser {
    return this.INSTANCE;
  }

  /** 変換後のノードの配列の集合 */
  private rule!: RuleTypes.Rule;

  /**
   * ツリー構造の`rule.json`を単純な配列に変換します。
   * @param tree ツリー構造の`rule.json`
   * @returns 変換された単純な配列
   */
  public parse(tree: XprTypes.Xpr): RuleTypes.Rule {
    /** 変換後のノードの配列の集合 */
    this.rule = [];
    this.parseGroups(tree);
    RuleValidator.validate(this.rule);
    return this.rule;
  }

  private createRuleGroup(group: XprTypes.XprGroup): RuleTypes.RuleGroup {
    return {
      includes: group.includes,
      excludes: group.excludes,
      nodes: [],
    } satisfies RuleTypes.RuleGroup;
  }

  private parseGroups(groups: XprTypes.Xpr): void {
    for (const group of groups) {
      const ruleGroup = this.createRuleGroup(group);
      this.rule.push(ruleGroup);
      this.parseGroup(group, ruleGroup, [group.name]);
    }
  }

  private parseGroup(
    group: XprTypes.XprGroup,
    ruleGroup: RuleTypes.RuleGroup,
    keyList: Array<string>
  ): void {
    this.parseNodes(group.nodes, ruleGroup.nodes, keyList, []);
  }

  private parseNodes(
    nodes: XprTypes.XprNodeList,
    ruleNodeList: RuleTypes.RuleNodeList,
    keyList: Array<string>,
    xpathList: Array<string>
  ): void {
    for (const node of nodes) {
      this.parseNode(node, ruleNodeList, keyList, xpathList);
    }
  }

  private parseNode(
    node: XprTypes.XprParentNode | XprTypes.XprChildNode,
    ruleNodeList: RuleTypes.RuleNodeList,
    keyList: Array<string>,
    xpathList: Array<string>
  ): void {
    if (node.key !== null) keyList.push(node.key);
    xpathList.push(node.xpath);

    // typeof node === XprTypes.XprChildNode
    if ('multi' in node) {
      ruleNodeList.push({
        ...node,
        key: keyList.join('/'),
        xpath: xpathList.join(''),
      });
    }
    // typeof node === XprTypes.XprParentNode
    else {
      this.parseNodes(node.nodes, ruleNodeList, keyList, xpathList);
    }

    if (node.key !== null) keyList.pop();
    xpathList.pop();
  }
}
