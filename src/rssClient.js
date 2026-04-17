const buildProxyUrl = (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get');
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);
  return proxyUrl.toString();
};

const loadRss = (url) => fetch(buildProxyUrl(url))
  .catch(() => {
    throw new Error('errors.network');
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('errors.network');
    }
    return response.json().catch(() => {
      throw new Error('errors.network');
    });
  })
  .then((data) => {
    if (!data.contents) {
      throw new Error('errors.network');
    }
    return data.contents;
  });

export default loadRss;
