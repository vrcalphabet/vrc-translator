export type Rule = Array<RuleGroup>;
export type RuleGroup = {
  includes: RulePathList;
  excludes: RulePathList;
  nodes: RuleNodeList;
  transKeys: RuleTransKeys;
};
export type RuleNode = {
  key: string;
  xpath: string;
  multi: boolean;
  attribute: string | null;
  custom: string | null;
  transKeys: RuleKeysDef;
};

export type RulePathList = Array<RegExp>;
export type RuleNodeList = Array<RuleNode>;

export type RuleTransKeys = {
  [transKey: string]: RuleKeysDef;
};
export type RuleKeysDef = {
  source: RegExp;
  key: string;
}[];
