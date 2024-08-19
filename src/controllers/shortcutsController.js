const slackService = require('../services/slackServices.js');

let storedChannelIdPromiseResolve;
let storedChannelIdPromise = new Promise((resolve) => {
  storedChannelIdPromiseResolve = resolve;
});

const handleShortcut = async (req, res) => {
  console.log('Recebeu uma requisição no /slack/shortcuts');
  const trigger_id = req.body.trigger_id;
  const channel_id = req.body.channel_id;

  if (!trigger_id) {
    console.error('trigger_id não encontrado');
    return res.status(400).send('Bad Request: trigger_id missing');
  }
  
  storedChannelIdPromiseResolve(channel_id);

  res.status(200).send('Success');

  try {
    await slackService.openModal(trigger_id);
  } catch (error) {
    console.error('Erro ao abrir modal:', error);
    return res.status(500).send('Internal Server Error');
  }
};

const getStoredChannelId = () => {
  return storedChannelIdPromise;
};

module.exports = { handleShortcut, getStoredChannelId };
