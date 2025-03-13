import { LocalizedResultTypes, ResultTypes, RuleTypes } from '../common';

export default class Source2Key {
  private localizedResult!: LocalizedResultTypes.LocalizedResult;

  public parse(result: ResultTypes.Result): LocalizedResultTypes.LocalizedResult {
    this.localizedResult = [];

    for (const resultNode of result) {
      if (resultNode.key) {
        this.findSourceResultNode(resultNode);
      }
      if (resultNode.custom) {
        this.applyCustomResultNode(resultNode);
      }
    }
    
    return this.localizedResult;
  }

  private applyCustomResultNode(resultNode: ResultTypes.ResultNode): void {
    for (const node of resultNode.nodes) {
      this.applyCustomNode(node, resultNode.custom!);
    }
  }

  private applyCustomNode(node: Node, custom: string): void {
    if (node instanceof HTMLElement) {
      node.style.cssText += custom;
    }
  }

  private findSourceResultNode(resultNode: ResultTypes.ResultNode): void {
    for (const node of resultNode.nodes) {
      this.findSourceNode(node, resultNode);
    }
  }

  private findSourceNode(
    node: Node,
    {
      key,
      transKeys,
      attribute,
    }: { key: string; transKeys: RuleTypes.RuleKeysDef; attribute: string | null }
  ): void {
    const text = this.getText(node, attribute);
    if (text === null) return;

    const match = this.findKey(text, key, transKeys);
    if (match === null) return;

    this.localizedResult.push(
      Object.assign(match, {
        node: node,
        attribute: attribute,
      })
    );
  }

  private getText(node: Node, attribute: string | null): string | null {
    let text: string | null;
    if (node instanceof Text) {
      text = node.nodeValue;
    } else if (attribute !== null) {
      text = (node as HTMLElement).getAttribute(attribute);
    } else if (node instanceof SVGElement) {
      text = (node as SVGElement).textContent;
    } else {
      text = (node as HTMLElement).innerText;
    }

    return text ? text.trim().toLowerCase() : null;
  }

  private findKey(
    text: string,
    key: string,
    transKeys: RuleTypes.RuleKeysDef
  ): LocalizedResultTypes.LocalizedResultMatch | null {
    for (const keyDef of transKeys) {
      const match = text.match(keyDef.source);
      if (match) {
        return {
          key: [key, keyDef.key].join('.'),
          placeholder: match.groups || {},
        };
      }
    }

    return null;
  }
}
