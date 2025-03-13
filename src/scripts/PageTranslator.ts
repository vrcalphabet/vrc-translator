import DataParser from '../utils/DataParser';
import DomObserver from './DomObserver';
import ElementFinder from './ElementFinder';
import RuleFilter from './RuleFilter';
import Source2Key from './Source2Key';
import Translator from './Translator';

export default class PageTranslator {
  private ruleFilter!: RuleFilter;
  private translator!: Translator;

  public async initialize(): Promise<void> {
    const data = await DataParser.parse();
    if (data === null) return;

    console.log(data);
    this.ruleFilter = new RuleFilter(data.rules);
    this.translator = new Translator(data.trans);
  }

  public observe(): void {
    DomObserver.observe(this.domChanged.bind(this));
  }

  private domChanged(): void {
    const filteredRule = this.ruleFilter.filter();
    const result = ElementFinder.find(filteredRule);
    const sourceKey = new Source2Key().parse(result);
    this.translator.translate(sourceKey);
    console.log(result);
    console.log(sourceKey);
  }
}
