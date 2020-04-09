const mysql = require('mysql2');//buscar o plugin de conexao do node com o mysql


// create the connection to database
// preencha o json com as especificações já criadas no MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    database: 'saboroso',
    password: 'Pombo2010*',
    multipleStatements: true
  });

  module.exports = connection;//resposta pra quem solicitar a conexao