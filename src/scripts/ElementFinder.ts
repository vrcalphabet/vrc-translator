import { ResultTypes, RuleTypes } from '../common';

export default class ElementFinder {
  private static nsResolver: XPathNSResolver = (prefix) =>
    prefix === 'svg' ? 'http://www.w3.org/2000/svg' : null;

  public static find(nodes: RuleTypes.RuleNodeList): ResultTypes.Result {
    const result: ResultTypes.Result = [];

    for (const node of nodes) {
      const elements = this.query(node.xpath, node.multi);

      if (elements.length === 0) continue;
      result.push({
        key: node.key,
        attribute: node.attribute,
        custom: node.custom,
        transKeys: node.transKeys,
        nodes: elements,
      });
    }

    return result;
  }

  private static query(xpath: string, multi: boolean): Array<Node> {
    let fullXpath: string;
    if (xpath.startsWith('::')) {
      fullXpath = xpath.slice(3);
    } else {
      fullXpath = 'div[@id="app"]/main[1]' + xpath;
    }

    if (multi) {
      return this.querySelectorAll(fullXpath);
    } else {
      return this.querySelector(fullXpath);
    }
  }

  private static querySelector(xpath: string): Array<Node> {
    const element = this.evaluate(xpath, XPathResult.FIRST_ORDERED_NODE_TYPE);
    return element.singleNodeValue ? [element.singleNodeValue] : [];
  }

  private static querySelectorAll(xpath: string): Array<Node> {
    const elements = this.evaluate(xpath, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
    return Array.from({ length: elements.snapshotLength }, (_, index) => {
      return elements.snapshotItem(index)!;
    });
  }

  private static evaluate(xpath: string, type: number): XPathResult {
    return document.evaluate(
      this.setSVGNamespace(xpath),
      document.body,
      this.nsResolver,
      type,
      null
    );
  }

  private static setSVGNamespace(xpath: string): string {
    return xpath.replace(/\/svg.+$/g, (m) => m.replaceAll(/(?<=\/)\w+/g, (m) => `svg:${m}`));
  }
}
