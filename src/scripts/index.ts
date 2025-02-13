import PageTranslator from './PageTranslator';

(async () => {
  console.log('script injected!');

  const translator = new PageTranslator();
  await translator.initialize();
  translator.observe();
})();
