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
};

export type RulePathList = Array<string>;
export type RuleNodeList = Array<RuleNode>;
