import Storage from '../utils/Storage';

async function initialize(): Promise<void> {
  const baseURL = 'https://vrcalphabet.github.io/vrc-transition/';
  const host = document.getElementById('host') as HTMLInputElement;
  const save = document.getElementById('save') as HTMLButtonElement;

  save.addEventListener('click', async () => {
    await Storage.set('host', host.value || baseURL);
    alert('保存しました');
  });

  host.value = await Storage.get('host', baseURL);
}

initialize();
