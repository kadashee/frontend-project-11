const getElementTextContent = (element, selector) => {
  const target = element.querySelector(selector);

  if (!target) {
    throw new Error('errors.parse');
  }

  return target.textContent.trim();
};

const parseRss = (content) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(content, 'application/xml');

  if (document.querySelector('parsererror')) {
    throw new Error('errors.parse');
  }

  const channel = document.querySelector('channel');

  if (!channel) {
    throw new Error('errors.parse');
  }

  const feed = {
    title: getElementTextContent(channel, 'title'),
    description: getElementTextContent(channel, 'description'),
  };

  const posts = Array
    .from(channel.querySelectorAll('item'))
    .map((item) => ({
      title: getElementTextContent(item, 'title'),
      description: getElementTextContent(item, 'description'),
      link: getElementTextContent(item, 'link'),
    }));

  return { feed, posts };
};

export default parseRss;
