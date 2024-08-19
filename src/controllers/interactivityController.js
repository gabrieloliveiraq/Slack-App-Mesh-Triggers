const slackService = require('../services/slackServices.js');
const { getStoredChannelId } = require('./shortcutsController');
const { appendFileCsv } = require('../services/csvServices.js')

const handleInteractivity = async (req, res) => {
  console.log('Requisição recebida no /slack/interactivity');
  const channel_id = await getStoredChannelId();

  try {
    const payload = JSON.parse(req.body.payload);

    if (payload.type === 'view_submission' && payload.view.callback_id === 'form_submission') {
      const { date, module, description } = slackService.extractFormData(payload);
      res.status(200).send();
      try {
            slackService.sendMessage(channel_id, date, module, description),
            await appendFileCsv()
        console.log('Mensagem enviada e dados gravados no CSV com sucesso');
      } catch (error) {
        console.error('Erro ao enviar mensagem ou salvar no CSV:', error);
      }
    }

  } catch (error) {
    console.error('Erro ao processar o payload:', error);
    res.status(500).send('Internal Server Error');
  }
};




module.exports = { handleInteractivity };
