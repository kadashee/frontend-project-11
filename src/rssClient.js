const buildProxyUrl = (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get');
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);

  return proxyUrl.toString();
};

const loadRss = async (url) => {
  let response;
  const proxyUrl = buildProxyUrl(url);

  try {
    response = await fetch(proxyUrl);
  } catch (e) {
    console.error('FETCH ERROR', proxyUrl, e?.message);
    throw new Error('errors.network');
  }

  if (!response.ok) {
    throw new Error('errors.network');
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error('errors.network');
  }

  if (!Object.hasOwn(data, 'contents')) {
    throw new Error('errors.network');
  }

  return data.contents;
};

export default loadRss;
