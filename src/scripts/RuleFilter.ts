import { RuleTypes } from '../common';

export default class RuleFilter {
  private rule: RuleTypes.Rule;
  private pathname!: string;

  public constructor(rule: RuleTypes.Rule) {
    this.rule = rule;
  }

  public filter(): RuleTypes.RuleNodeList {
    // 末尾にスラッシュがある場合はスラッシュを消す
    this.pathname = location.pathname.replace(/\/$/, '');
    const filteredRule = this.rule.filter(this.contains.bind(this));
    return filteredRule.map((ruleGroup) => ruleGroup.nodes).flat();
  }

  private contains(ruleGroup: RuleTypes.RuleGroup): boolean {
    return this.includes(ruleGroup.includes) && this.excludes(ruleGroup.excludes);
  }

  private includes(rulePathList: RuleTypes.RulePathList): boolean {
    return rulePathList.some((path) => path.test(this.pathname));
  }

  private excludes(rulePathList: RuleTypes.RulePathList): boolean {
    return !this.includes(rulePathList);
  }
}
