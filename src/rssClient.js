const buildProxyUrl = (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get');
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);

  return proxyUrl.toString();
};

const loadRss = async (url) => {
  let response;

  try {
    response = await fetch(buildProxyUrl(url));
  } catch {
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

  if (!data.contents) {
    throw new Error('errors.network');
  }

  return data.contents;
};

export default loadRss;
