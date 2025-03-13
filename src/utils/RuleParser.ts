import { RuleTypes, XprTypes } from '../common';
import RuleValidator from './RuleValidator';

/** ツリー構造のノードを単純なノードの配列に変換するクラス */
export default class RuleParser {
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
    return this.rule;
  }

  private createRuleGroup(group: XprTypes.XprGroup): RuleTypes.RuleGroup {
    return {
      includes: RuleValidator.normalizePathList(group.includes),
      excludes: RuleValidator.normalizePathList(group.excludes),
      nodes: [],
      transKeys: RuleValidator.normalizeKeys(group.transKeys),
    } satisfies RuleTypes.RuleGroup;
  }

  private parseGroups(groups: XprTypes.Xpr): void {
    for (const group of groups) {
      const ruleGroup = this.createRuleGroup(group);
      this.rule.push(ruleGroup);
      this.parseGroup(group, ruleGroup);
    }
  }

  private parseGroup(group: XprTypes.XprGroup, ruleGroup: RuleTypes.RuleGroup): void {
    this.parseNodes(group.nodes, ruleGroup.nodes, ruleGroup.transKeys, []);
  }

  private parseNodes(
    nodes: XprTypes.XprNodeList,
    ruleNodeList: RuleTypes.RuleNodeList,
    transKeys: RuleTypes.RuleTransKeys,
    xpathList: Array<string>
  ): void {
    for (const node of nodes) {
      this.parseNode(node, ruleNodeList, transKeys, xpathList);
    }
  }

  private parseNode(
    node: XprTypes.XprParentNode | XprTypes.XprChildNode,
    ruleNodeList: RuleTypes.RuleNodeList,
    transKeys: RuleTypes.RuleTransKeys,
    xpathList: Array<string>
  ): void {
    xpathList.push(node.xpath);

    // typeof node === XprTypes.XprChildNode
    if ('key' in node) {
      ruleNodeList.push({
        ...node,
        xpath: RuleValidator.validateXpath(xpathList.join('')),
        transKeys: transKeys[node.key],
      });
    }
    // typeof node === XprTypes.XprParentNode
    else {
      this.parseNodes(node.nodes, ruleNodeList, transKeys, xpathList);
    }

    xpathList.pop();
  }
}
