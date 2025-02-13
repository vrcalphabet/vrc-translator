import FileRetriever from './FileRetriever';
import Storage from '../utils/Storage';

export default class DataUpdater {
  public static async checkUpdate(): Promise<void> {
    /** 更新が必要かどうか */
    const needsUpdate = await this.needsUpdate();
    if (needsUpdate) {
      /** データの更新が成功したか */
      const success = this.update();
      if (!success) {
        console.log(
          'データの更新に失敗しました: サーバがダウンしているか、サーバにファイルが存在していない可能性があります。'
        );
      }
    } else {
      console.log('データは最新の状態です。');
    }
  }

  /**
   * ローカルとサーバの最終更新時刻を比較し、更新が必要かを真偽値で返します。
   * @returns サーバのほうが新しい場合: true, 同じ場合: false
   */
  private static async needsUpdate(): Promise<boolean> {
    /** クライアントの最終更新時刻 */
    const localLastUpdate = await Storage.get('lastUpdate');
    // 値が保存されていない（初回起動時、データ消去時）
    if (localLastUpdate === undefined) {
      return true;
    }

    /** サーバの最終更新時刻 */
    const serverLastUpdate = await FileRetriever.getLastUpdate();
    // 何らかのエラー（サーバダウン状態、ネットワーク未接続等）
    if (serverLastUpdate === null) {
      return false;
    }

    // サーバーの最終更新時刻のほうが新しかったらtrue
    return +localLastUpdate < +serverLastUpdate;
  }

  private static async update(): Promise<boolean> {
    const lastUpdate = await FileRetriever.getLastUpdate();
    if (lastUpdate === null) return false;
    const rule = await FileRetriever.getRule();
    if (rule === null) return false;
    const trans = await FileRetriever.getTrans();
    if (trans === null) return false;

    Storage.set('lastUpdate', lastUpdate);
    Storage.set('rule', rule);
    Storage.set('trans', trans);

    console.log('データを更新しました。');

    return true;
  }
}
