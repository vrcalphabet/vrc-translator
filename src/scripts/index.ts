import PageTranslator from './PageTranslator';

(async () => {
  console.log('[vrc-translator] script injected!');

  const translator = new PageTranslator();
  await translator.initialize();
  translator.observe();
})();
