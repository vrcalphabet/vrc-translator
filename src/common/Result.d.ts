export type Result = Array<ResultNode>;
export type ResultNode = {
  key: string,
  attribute: string | null,
  custom: string | null,
  nodes: Array<Node>
};
