/** タイマーを計測し、時間をログに出力するクラス */
export default class TimeLogger {
  private template: string;
  private timer: Map<string, number>;
  
  /**
   * @param template ログ出力のテンプレート文字列（オプション）
   */
  public constructor(template?: string) {
    if(template !== undefined) {
      this.template = template;
    } else {
      this.template = '[$<name>] Took $<time> ms';
    }
    this.timer = new Map<string, number>();
  }
  
  /**
   * タイマーを開始する
   * @param name タイマーの名前
   */
  public start(name: string): void {
    this.timer.set(name, performance.now() as number);
  }
  
  /**
   * タイマーを終了し、時間をログに出力する
   * @param name タイマーの名前
   * @param placeholder 置換用のプレースホルダ（オプション）
   * @returns タイマーが存在するか
   */
  public end(name: string, placeholder?: Placeholder): boolean {
    if (!this.timer.has(name)) {
      return false;
    }
    
    const end = performance.now();
    const start = this.timer.get(name)!;
    
    if (placeholder === undefined) {
      placeholder = {};
    }
    
    Object.assign(placeholder, {
      name: name,
      time: Math.floor(end - start)
    });
    
    console.log(this.setPlaceholder(placeholder));
    this.timer.delete(name);
    
    return true;
  }
  
  /**
   * プレースホルダをテンプレート文字列に変換する
   * @param placeholder 置換用のプレースホルダ
   * @returns プレースホルダが設定されたテンプレート文字列
   */
  private setPlaceholder(placeholder: any): string {
    let template = this.template;
    for (const key in placeholder) {
      template = template.replaceAll(`$<${key}>`, placeholder[key].toString());
    }
    
    return template;
  }
}

type Placeholder = {
  [key: string]: any;
};