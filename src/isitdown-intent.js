import cheerio from 'cheerio';
import fetch from 'node-fetch';
import pSeries from 'p-series';

// Allow hot-swapping.
module.change_code = 1;

export default function isItDownIntent(request, response) {
  const domain = request.slot('DOMAIN');

  const tasks = [
    () => fetch(`http://www.isitdownrightnow.com/downorjustme.php?url=${domain}`),
    () => fetch(`http://www.isitdownrightnow.com/check.php?domain=${domain}`),
  ];

  pSeries(tasks)
    .then(results => results[results.length - 1])
    .then(res => res.text())
    .then((body) => {
      const $ = cheerio.load(body);

      const status = $('.upicon').length > 0 ? 'up' : 'down';
      const responseTime = $('.tab').eq(2).text();

      response.say(`${domain} is ${status}. The response time was: ${responseTime}`)
        .send();
    })
    .catch(error => console.error(error));

  return false;
}
