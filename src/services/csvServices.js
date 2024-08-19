const fs = require('fs');
const { getDataPayload } = require('../services/slackServices');

const convertToCSV = (data) => {
  const values = Object.values(data);
  return values.join(',') + '\n';
};

const appendFileCsv = async () => {
  try {
      const dataSlack = await getDataPayload();
      console.log('Dados recebidos para gravação:', dataSlack);
  
      if (!dataSlack) {
        console.error('Nenhum dado foi recebido para gravação');
        return;
      }
    let dataString = typeof dataSlack === 'object' ? convertToCSV(dataSlack) : String(dataSlack);
    let bufferData = Buffer.from(dataString);
    
     await new Promise((resolve, reject) => {
      fs.appendFile('dataSlack.csv', bufferData, (err) => {
        if (err) {
          console.error('Erro ao salvar no arquivo CSV:', err);
          return reject(err);
        }
        resolve();
      });
    });

  } catch (error) {
    console.error('Erro ao obter os dados do Slack ou salvar no arquivo:', error);
  }
}

module.exports = { appendFileCsv };
