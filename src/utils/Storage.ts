export default class Storage {
  /**
   * ブラウザにデータを保存します。
   * @param key キー
   * @param value 値
   */
  public static async set(key: string, value: string): Promise<void> {
    chrome.storage.local.set({ [key]: value });
  }

  /**
   * ブラウザからデータを取得します。
   * @param key キー
   * @returns キーに対応する値。値が保存されていない場合はundefinedになります。
   */
  public static async get(key: string): Promise<string | undefined>;
  /**
   * ブラウザからデータを取得します。
   * @param key キー
   * @param defaultValue デフォルト値
   * @returns キーに対応する値。値が保存されていない場合はdefaultValueになります。
   */
  public static async get(key: string, defaultValue: string): Promise<string>;
  public static async get(key: string, defaultValue?: string): Promise<string | undefined> {
    const data: string | undefined = await new Promise((resolve) => {
      chrome.storage.local.get(key, (items) => {
        resolve(items[key]);
      });
    });
    if (data === undefined) return defaultValue;
    return data;
  }

  /**
   * ブラウザからデータを削除します。
   * @param key キー
   */
  public static async remove(key: string): Promise<void> {
    chrome.storage.local.remove(key);
  }
}
