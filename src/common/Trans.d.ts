export type Trans = {
  [key: string]: TransNodeList;
};
export type TransNodeList = Array<TransNode>;
export type TransNode = {
  source: string | RegExp,
  trans: string
};