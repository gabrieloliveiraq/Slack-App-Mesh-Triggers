const web = require('../config/slack.js');

let dataPayload;
let dataPayloadPromise = new Promise((resolve) => {
  dataPayload = resolve;
});


const openModal = async (trigger_id) => {
  dataPayload = null;
  dataPayloadPromise = new Promise((resolve) => {
    dataPayload = resolve;
  });
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

  await web.views.open(modal);
};

const extractFormData = (payload) => {
  const date = payload.view.state.values.input_block_1["datepicker-action"].selected_date;
  const module = payload.view.state.values.input_block_2["multi_static_select-action"].selected_options[0].text.text;
  const description = payload.view.state.values.input_block_3["plain_text_input-action"].value;

  dataPayload({date, module, description}); 

  return { date, module, description }
};

const getDataPayload = async () => {
  return dataPayloadPromise;
};

const sendMessage = async (channel, date, module, description) => {
  try {
    await web.chat.postMessage({
      channel: channel,
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
              value: module,
              short: false
            },
            {
              title: 'Descrição',
              value: description,
              short: false
            }
          ]
        }
      ]
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
};

module.exports = { openModal, extractFormData, sendMessage, getDataPayload };