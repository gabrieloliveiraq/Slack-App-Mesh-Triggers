const { WebClient } = require('@slack/web-api');
const express = require('express');
require('dotenv').config();

const token = process.env.SLACK_BOT_TOKEN;
const web = new WebClient(token);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.post('/slack/events', (req, res) => {
  const { type, challenge } = req.body;
  console.log('Recebeu uma requisição no /slack/events');

  if (type === 'url_verification') {
    return res.status(200).send({ challenge });
  }
});

let channelId = ''
console.log(`Meu chanel sem nada: ${channelId}`)
app.post('/slack/shortcuts', async (req, res) => {
  console.log('Recebeu uma requisição no /slack/shortcuts');

  try {
    parsedPayload = req.body.payload
  } catch (error) {
    console.error('Erro ao parsear o payload JSON:', error);
    return res.status(400).send('Bad Request: Invalid payload JSON');
  }

  const trigger_id = req.body.trigger_id
  const channel_id = req.body.channel_id

  if (!trigger_id) {
    console.error('trigger_id não encontrado');
    return res.status(400).send('Bad Request: trigger_id missing');
  }

  channelId = channel_id
  console.log(`Meu chanel com valor primeira: ${channelId}`)
  res.status(200).send('Success');

  const modal = {
    "trigger_id": trigger_id,
    "view": {
      "type": "modal",
      "callback_id": "form_submission",
      "title": {
        "type": "plain_text",
        "text": "Preencha o Formulário"
      },
      "blocks": [
        {
          "type": "input",
          "block_id": "input_block_1",
          "element": {
            "type": "datepicker",
            "initial_date": "2024-08-14",
            "placeholder": {
              "type": "plain_text",
              "text": "Selecione uma data",
              "emoji": true
            },
            "action_id": "datepicker-action"
          },
          "label": {
            "type": "plain_text",
            "text": "Data do Acionamento",
            "emoji": true
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "input",
          "block_id": "input_block_2",
          "element": {
            "type": "multi_static_select",
            "placeholder": {
              "type": "plain_text",
              "text": "Selecione uma opção",
              "emoji": true
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "Conta Corrente",
                  "emoji": true
                },
                "value": "value-0"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "Cobrança",
                  "emoji": true
                },
                "value": "value-1"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "E-bank",
                  "emoji": true
                },
                "value": "value-2"
              }
            ],
            "action_id": "multi_static_select-action"
          },
          "label": {
            "type": "plain_text",
            "text": "Módulo",
            "emoji": true
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "input",
          "block_id": "input_block_3",
          "element": {
            "type": "plain_text_input",
            "multiline": true,
            "action_id": "plain_text_input-action"
          },
          "label": {
            "type": "plain_text",
            "text": "Descreva sobre o Acionamento",
            "emoji": true
          }
        }
      ],
      "submit": {
        "type": "plain_text",
        "text": "Enviar"
      }
    }
  };

  try {
    await web.views.open(modal);
  } catch (error) {
    console.error('Erro ao abrir modal:', error);
    return res.status(500).send('Internal Server Error');
  }
})

let dataReceived = ''

app.post('/slack/interactivity', async (req, res) => {
  console.log('Requisição recebida no /slack/interactivity');
  try {
    const payload = JSON.parse(req.body.payload);

    if (payload.type === 'view_submission' && payload.view.callback_id === 'form_submission') {
      const date = payload.view.state.values.input_block_1["datepicker-action"].selected_date;
      const modulo = payload.view.state.values.input_block_2["multi_static_select-action"].selected_options[0].text.text;
      const description = payload.view.state.values.input_block_3["plain_text_input-action"].value;

      dataReceived = { date, modulo, description }
      console.log(dataReceived)
      try {
        await web.chat.postMessage({
          channel: channelId,
          text: 'Aqui estão os dados do formulário preenchido:',
          attachments: [
            {
              fields: [
                {
                  title: 'Data do Acionamento',
                  value: date,
                  short: false
                },
                {
                  title: 'Módulo',
                  value: modulo,
                  short: false
                },
                {
                  title: 'Descrição',
                  value: description,
                  short: false
                }
                // Outros campos do formulário...
              ]
            }
          ]
        });
        console.log(`Meu chanel com valor segunda: ${channelId}`)
      } catch (error) {
        console.error('Erro ao enviar mensagem para o canal:', error);
        return res.status(500).send('Internal Server Error');
      }

      res.status(200).send();

    } else {
      console.error('Erro ao enviar mensagem para o canal:', error);
    }

    return res.status(200).end();
  } catch (error) {
    console.error('Erro ao processar o payload:', error);
    return res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});