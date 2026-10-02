import app = require('./app');
import process = require('node:process');

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}.`);
});
