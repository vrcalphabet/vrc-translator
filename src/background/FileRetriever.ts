import TimeLogger from '../utils/TimeLogger';

export default class FileRetriever {
  private static readonly baseURL = 'https://vrcalphabet.github.io/vrc-transition/';
  private static timeLogger = new TimeLogger(
    '"$<name>"をサーバから$<time>ミリ秒かけて取得しました。データサイズ: $<size>バイト'
  );

  /**
   * 最終更新時刻をサーバから取得します。
   * @returns 最終更新時刻
   */
  public static async getLastUpdate() {
    return this.getContent('lastUpdate.txt');
  }

  /**
   * 最新の翻訳データをサーバから取得します。
   * @returns 翻訳データ
   */
  public static async getTrans() {
    return this.getContent('trans.json');
  }

  /**
   * 最新のルールデータをサーバから取得します。
   * @returns ルールデータ
   */
  public static async getRule() {
    return this.getContent('rule.json');
  }

  /**
   * 特定のファイルの中身をプレーンテキストで取得します。
   * @param fileName ファイル名
   * @returns ファイルの中身、ファイルが存在しない場合などはnull。
   */
  private static async getContent(fileName: string): Promise<string | null> {
    this.timeLogger.start(fileName);

    const url = this.getURL(fileName);
    const res = await fetch(url, { cache: 'no-cache' });
    // ファイルが存在しない場合
    if (!res.ok) {
      console.error(`${fileName} をサーバから取得できませんでした。`);
      return null;
    }

    /** ファイルの中身 */
    const content = await res.text();
    this.timeLogger.end(fileName, { size: content.length.toLocaleString() });
    return content;
  }

  /**
   * ベースのURLとファイル名を結合して新しいURLを返します。
   * @param fileName ファイル名
   * @returns ベースのURLとファイル名が結合されたURL
   */
  private static getURL(fileName: string): string {
    const url = new URL(fileName, this.baseURL);
    return url.href;
  }
}
