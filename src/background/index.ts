import Storage from '../utils/Storage';
import DataUpdater from './DataUpdater';

/**
 * サービスワーカー起動時に実行される関数
 */
async function initialize(): Promise<void> {
  console.log('拡張機能がアクティベートされました。');

  if ((await Storage.get('host')) === undefined) {
    await Storage.set('host', 'https://vrcalphabet.github.io/vrc-transition/');
  }

  // 30分ごとに更新を確認する
  const min30 = 1000 * 60 * 30;
  setInterval(checkUpdate, min30);
  checkUpdate();
}

function checkUpdate(): void {
  // データの更新
  console.log('更新データを確認中...');
  DataUpdater.checkUpdate();
}

chrome.runtime.onInstalled.addListener(initialize);
chrome.runtime.onStartup.addListener(initialize);
