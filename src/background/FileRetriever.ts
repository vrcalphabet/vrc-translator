import TimeLogger from '../utils/TimeLogger';

export default class FileRetriever {
  private static timeLogger = new TimeLogger(
    '"$<name>"をサーバから$<time>ミリ秒かけて取得しました。データサイズ: $<size>バイト'
  );

  /**
   * 最終更新時刻をサーバから取得します。
   * @returns 最終更新時刻
   */
  public static async getLastUpdate(baseURL: string): Promise<string | null> {
    return this.getContent(baseURL, 'lastUpdate.txt');
  }

  /**
   * 最新の翻訳データをサーバから取得します。
   * @returns 翻訳データ
   */
  public static async getData(baseURL: string): Promise<string | null> {
    return this.getContent(baseURL, 'data.json');
  }

  /**
   * 特定のファイルの中身をプレーンテキストで取得します。
   * @param fileName ファイル名
   * @returns ファイルの中身、ファイルが存在しない場合などはnull。
   */
  private static async getContent(baseURL: string, fileName: string): Promise<string | null> {
    this.timeLogger.start(fileName);

    const url = this.getURL(baseURL, fileName);
    let res: Response;
    try {
      res = await fetch(url, { cache: 'no-cache' });
    } catch (e) {
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
  private static getURL(baseURL: string, fileName: string): string {
    const url = new URL(fileName, baseURL);
    return url.href;
  }
}
