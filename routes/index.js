var conn = require('./../inc/db');
var express = require('express');
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations');
var contacts = require('./../inc/contacts');
var emails = require('./../inc/emails');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  menus.getMenus().then(results =>{
    
    res.render('index', { title: 'Restaurante Saboroso!',
    menus: results,
    isHome: true

  });

  
  });
  
});
/*
 * ROTAS DAS PAGINAS DO SITE
*/
router.get('/contacts', function(req, res, next){

  contacts.render(req, res, null);
     


});

router.post('/contacts', function(req, res, next){

  
   /*
  * Validação dos campos na unha
  */
 if(!req.body.name){

  contacts.render(req, res, "Digite o Nome!");
  
} else if(!req.body.email){

  contacts.render(req, res, "Email é obrigatório");
  

} else if (!req.body.message){

  contacts.render(req, res, "escreva uma mensagem");

} else {
 
  contacts.save(req.body).then(results =>{

    req.body = {};//no momento que a promessa voltar com sucesso, pode limpar os campos
    contacts.render(req, res, null, "Reserva realizada com Sucesso");//toast com sucesso

  }).catch(err =>{
   
    
    contacts.render(req, res, err.message);

  });
}


});


router.get('/menus', function(req, res, next){

  menus.getMenus().then(results=>{

    res.render('index', { title: 'Restaurante Saboroso!',
    background: 'images/img_bg_1.jpg',
    h1: 'Saboreie nosso menu!',
    menus: results
    

  });

  
    
    

});

});

router.get('/reservations', function(req, res, next){

  reservations.render(req, res);

  

});

router.post('/reservations', function(req, res, next){
  /*
  * Validação dos campos na unha
  */
  if(!req.body.name){

    reservations.render(req, res, "Digite o Nome!");
    
  } else if(!req.body.email){

    reservations.render(req, res, "Email é obrigatório");
    

  } else if (!req.body.people){

    reservations.render(req, res, "Escolha o numero de pessoas");
    
  } else if(!req.body.date){

    reservations.render(req, res, "escolha uma data");
    

  } else if (!req.body.time){

    reservations.render(req, res, "escolha o horario");
    

  } else{
    /**
     * Se todos os campos preenchidos, entao é chamado a funcao save
     */
    console.log("PAYLOAD: ",req.body);

    reservations.save(req.body).then(results =>{
      
      req.body = {};//no momento que a promessa voltar com sucesso, pode limpar os campos
      reservations.render(req, res, null, "Reserva realizada com Sucesso");//toast com sucesso

    }).catch(err =>{
     
      reservations.render(req, res, err.message);

    });
  }

  

});

router.get('/services', function(req, res, next){

  res.render('services', { 
    title: 'Serviços - Restaurante Saboroso!',
    background: 'images/img_bg_1.jpg',
    h1: 'É um prazer poder servir!'
    
   });
  

});

router.post('/subscribe', function(req, res, next){

  emails.save(req).then(results =>{
    
    res.send(results);

  }).catch(err =>{

    res.send(err);

  });



});

module.exports = router;
