export type Rule = Array<RuleGroup>;
export type RuleGroup = {
  includes: RulePathList;
  excludes: RulePathList;
  nodes: RuleNodeList;
};
export type RuleNode = {
  key: string;
  xpath: string;
  multi: boolean;
  attribute: string | null;
  custom: string | null;
};

export type RulePathList = Array<RegExp>;
export type RuleNodeList = Array<RuleNode>;
