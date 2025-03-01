import { ResultTypes, TransTypes } from '../common';

export default class Translator {
  private trans: TransTypes.Trans;

  public constructor(trans: TransTypes.Trans) {
    this.trans = trans;
  }

  public translate(result: ResultTypes.Result): void {
    for (const resultNode of result) {
      this.translateResultNode(resultNode);
    }
  }

  private translateResultNode(resultNode: ResultTypes.ResultNode): void {
    for (const node of resultNode.nodes) {
      this.translateNode(node, resultNode.key, resultNode.attribute);
    }
  }

  private translateNode(node: Node, key: string, attribute: string | null): void {
    const text = this.getText(node, attribute);
    if (text === null) return;

    const trans = this.findTrans(key, text);
    if (trans === null) return;
    
    this.setText(node, attribute, trans);
  }
  
  private setText(node: Node, attribute: string | null, newText: string): void {
    if (node instanceof Text) {
      node.nodeValue = newText;
    } else if (attribute !== null) {
      (node as HTMLElement).setAttribute(attribute, newText);
    } else {
      (node as HTMLElement).innerText = newText;
    }
  }

  private getText(node: Node, attribute: string | null): string | null {
    let text: string | null;
    if (node instanceof Text) {
      text = node.nodeValue;
    } else if (attribute !== null) {
      text = (node as HTMLElement).getAttribute(attribute);
    } else {
      text = (node as HTMLElement).innerText;
    }

    return text ? text.trim() : null;
  }

  private findTrans(key: string, source: string): string | null {
    return this.findTransNodeList(this.trans[key], source);
  }

  private findTransNodeList(
    transNodeList: TransTypes.TransNodeList,
    source: string
  ): string | null {
    for (const transNode of transNodeList) {
      const trans = this.findTransNode(transNode, source);
      if (trans !== null) return trans;
    }
    return null;
  }

  private findTransNode(transNode: TransTypes.TransNode, source: string): string | null {
    if (transNode.source === source.toLowerCase()) {
      return transNode.trans;
    } else {
      return null;
    }
  }
}
