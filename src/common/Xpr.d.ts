export type Xpr = Array<XprGroup>;
export type XprGroup = {
  includes: XprPathList;
  excludes: XprPathList;
  nodes: XprNodeList;
  transKeys: XprTransKeys;
};
export type XprTransKeys = {
  [transKey: string]: XprTransKeys | string;
};
export type XprParentNode = {
  xpath: string;
  nodes: XprNodeList;
};
export type XprChildNode = {
  key: string;
  xpath: string;
  multi: boolean;
  attribute: string | null;
  custom: string | null;
};

export type XprPathList = Array<string>;
export type XprNodeList = Array<XprParentNode | XprChildNode>;
