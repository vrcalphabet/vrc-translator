import escapeRegExp from 'escape-string-regexp';
import { RuleTypes, XprTypes } from '../common';

export default class KeysParser {
  private keys!: RuleTypes.RuleTransKeys;

  public parse(tree: XprTypes.XprTransKeys): RuleTypes.RuleTransKeys {
    this.keys = {};
    this.parseObject(tree, []);
    return this.keys;
  }

  private parseObject(tree: XprTypes.XprTransKeys, keyStack: string[]): void {
    for (const key in tree) {
      this.parseValue(key, tree[key], keyStack);
    }
  }

  private parseValue(key: string, value: string | XprTypes.XprTransKeys, keyStack: string[]): void {
    // typeof value === string
    if (typeof value === 'string') {
      this.pushValue(keyStack.join('.'), key, value);
    }
    // typeof value === XprTypes.XprTransKeys
    else {
      keyStack.push(key);
      this.parseObject(value, keyStack);
      keyStack.pop();
    }
  }

  private pushValue(key: string, source: string, transKey: string): void {
    if (!(key in this.keys)) {
      this.keys[key] = [];
    }

    this.keys[key].push({ source: this.normalizeSource(source), key: transKey });
  }

  private normalizeSource(source: string): RegExp {
    const regex = escapeRegExp(source)
      .replaceAll(/\[\[([a-z]\w*)\]\]/g, '(?<$1>.+?)')
      .replaceAll(/\{\{([a-z]\w*)\}\}/g, '(?<$1>\\S+?)');
    return new RegExp(`^${regex}$`);
  }
}
