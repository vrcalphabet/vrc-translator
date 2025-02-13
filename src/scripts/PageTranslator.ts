import DataParser from '../utils/DataParser';
import RuleFilter from './RuleFilter';
import DomObserver from './DomObserver';
import ElementFinder from './ElementFinder';
import Translator from './Translator';

export default class PageTranslator {
  private ruleFilter!: RuleFilter;
  private translator!: Translator;

  public async initialize(): Promise<void> {
    const ruleData = await DataParser.parseRule();
    if (ruleData === null) return;
    const transData = await DataParser.parseTrans();
    if (transData === null) return;

    console.log(ruleData);
    console.log(transData);

    this.ruleFilter = new RuleFilter(ruleData);
    this.translator = new Translator(transData);
  }

  public observe(): void {
    DomObserver.observe(this.domChanged.bind(this));
  }

  private domChanged(): void {
    const filteredRule = this.ruleFilter.filter();
    const result = ElementFinder.find(filteredRule);
    this.translator.translate(result);
    console.log(filteredRule);
    console.log(result);
  }
}
