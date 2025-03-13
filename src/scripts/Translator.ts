import { LocalizedResultTypes, TransTypes } from '../common';

export default class Translator {
  private trans: TransTypes.Trans;

  public constructor(trans: TransTypes.Trans) {
    this.trans = trans;
  }

  public translate(result: LocalizedResultTypes.LocalizedResult): void {
    for (const resultNode of result) {
      this.translateNode(resultNode);
    }
  }

  private translateNode(node: LocalizedResultTypes.LocalizedResultNode): void {
    const trans = this.getTransByKey(node.key, node.placeholder);
    this.setText(node.node, node.attribute, trans);
  }

  private getTransByKey(key: string, placeholder: { [key: string]: string }): string {
    const trans = this.trans[key];
    return trans.replaceAll(/\{\{\w+\}\}/g, (key) => {
      return placeholder[key.slice(2, -2)] ?? key;
    });
  }

  private setText(node: Node, attribute: string | null, trans: string): void {
    if (node instanceof Text) {
      node.nodeValue = trans;
    } else if (attribute !== null) {
      (node as HTMLElement).setAttribute(attribute, trans);
    } else if (node instanceof SVGElement) {
      (node as SVGElement).textContent = trans;
    } else {
      (node as HTMLElement).innerText = trans;
    }
  }
}
