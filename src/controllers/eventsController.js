const handleEvent = (req, res) => {
    const { type, challenge } = req.body;
    console.log('Recebeu uma requisição no /slack/events');
  
    if (type === 'url_verification') {
      return res.status(200).send({ challenge });
    }
  };
  
  module.exports = { handleEvent };
  