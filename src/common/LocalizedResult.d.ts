export type LocalizedResult = LocalizedResultNode[];
export type LocalizedResultNode = {
  key: string;
  node: Node;
  attribute: string | null;
  placeholder: {
    [key: string]: string;
  };
};
export type LocalizedResultMatch = Pick<LocalizedResultNode, 'key' | 'placeholder'>;
