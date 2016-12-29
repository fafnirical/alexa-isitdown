import { app as AlexaApp } from 'alexa-app';

import isItDownIntent from './isitdown-intent';

// Allow hot-swapping.
module.change_code = 1;

const Skill = new AlexaApp('isitdown');

Skill.launch((request, response) => {
  const launchMessage = `
    <speak>
      To ask me for outage information, tell me a web domain.
    </speak>
  `;

  response.say(launchMessage)
    .send();
});

Skill.intent('IsItDown',
  {
    slots: {
      DOMAIN: 'DOMAINS',
    },
    utterances: [
      '{|website} {|outage} {|info|information} {|for} {-|DOMAIN}',
    ],
  },
  isItDownIntent,
);

const exitIntent = (request, response) => {
  const exitMessage = `
    <speak>
      Goodbye!
    </speak>
  `;

  response.say(exitMessage)
    .send();
};
Skill.intent('AMAZON.StopIntent', exitIntent);
Skill.intent('AMAZON.CancelIntent', exitIntent);

export default Skill;
