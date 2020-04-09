var express = require("express");//carrega o express
var router = express.Router();//carrega dentro do express o metodo router
var admin = require("./../inc/admin");
var users = require("./../inc/users");
var menus = require("./../inc/menus");
var reservations = require("./../inc/reservations");
var contacts = require("./../inc/contacts");
var emails = require("./../inc/emails");
var moment = require("moment");


moment.locale("pt-br");//cofigurar data para brazilian
/**
 * MIDDLEWARE em nivel de roteador
 * bloqueia o acesso as pastas do admin para usuarios nao logados
 */
router.use(function(req, res, next){

    //criando um array de excessoes para rotas que podem ser acessadas sem estar logado
    if(['/login'].indexOf(req.url) === -1 && !req.session.user){
        
        res.redirect("/admin/login");

    } else {

        next();

    }

});
/**
 * MIDDLEWARE dos Menus da Admin
 */
router.use(function(req, res, next){

    req.menus = admin.getMenus(req);//mandar o req para o getMenus para recuperar a url

    next();


});


/*
 * ROTAS
*/
router.get("/logout", function(req, res, next){

    delete req.session.user;//deleta o user da session

    res.redirect("/admin/login");

});

router.get("/", function(req, res, next){

    admin.dashboard().then(data =>{

        
        res.render("admin/index", admin.getParams(req,
            {
                data
            }
            
    
        )).catch(err =>{

            console.error(err);
        });


    });

    



});

router.post("/login", function(req, res, next){

    

    if(!req.body.email){

        users.render(req, res, "Digite o e-mail!");

    } else if(!req.body.password){

        users.render(req, res, "Digite sua senha");
    } else {

        users.login(req.body.email, req.body.password).then(user =>{

            req.session.user = user;//guarda o usuario na sessao
            res.redirect("/admin");//se conseguiu logar, entao vai pro painel

        }).catch(err =>{

            users.render(req, res, err.message);

        });
    }


});

router.get("/login", function(req, res, next){


    users.render(req, res, null);

    



});
/**
 * ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 * ||||||||||||||||| ROTAS DOS E-MAILS ||||||||||||||||||||||||||||||||||||||
 * ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 */
 

router.get("/emails", function(req, res, next){

    emails.getEmails().then(data =>{

        res.render("admin/emails", admin.getParams(req, {
            data

        }));

    });
    



});

router.delete("/emails/:id", function(req, res, next){

    
    emails.delete(req.params.id).then(results =>{

        res.send(results);
        

    }).catch(err =>{

        res.send(err);

    });

});
/**
 * ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 * |||||||||||||||| ROTAS DOS CONTACTS ||||||||||||||||||||||||||||||||||||||
 * ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 */

router.get("/contacts", function(req, res, next){

    contacts.getContacts().then(data =>{

        res.render("admin/contacts", admin.getParams(req, {
            data

        }));

    });

});

router.delete("/contacts/:id", function(req, res, next){

    
    contacts.delete(req.params.id).then(results =>{

        res.send(results);
        

    }).catch(err =>{

        res.send(err);

    });

});

/**
 * ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 * ||||||||||||||||||| ROTAS DOS MENUS ||||||||||||||||||||||||||||||||||||||
 * ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 */

router.get("/menus", function(req, res, next){

    /**
     * menus.getMenus retorna uma Promisse com a consulta no banco e entao o resolve retorna
     * um objeto data da pesquisa e renderiza na rota
     */
    menus.getMenus().then(menusData =>{

        res.render("admin/menus", admin.getParams(req, {
            
            menusData

        }));


    });

});

router.post('/menus', function(req, res, next){
    
    menus.save(req.fields, req.files).then(results =>{
        
        res.send(results);

    }).catch(err =>{

        res.send(err);
    });


});
/**
 * DELETE passando o parametro id via url /:id
 */
router.delete('/menus/:id', function(req, res, next){

    //faz o casting do parametro via url com req.params.id
    menus.delete(req.params.id).then(results =>{

        res.send(results);

    }).catch(err =>{

        res.send(err);
    });

});



/**
 * ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 * |||||||||||||||| ROTAS DAS RESERVAS ||||||||||||||||||||||||||||||||||||||
 * ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 */

router.get("/reservations", function(req, res, next){
    let start = (req.query.start) ? req.query.start : moment().subtract(2, "year").format("YYYY-MM-DD");
    let end = (req.query.end) ? req.query.end : moment().format("YYYY-MM-DD");
    /** */
    reservations.getReservations(
        req
        
        ).then(pag =>{
        res.render("admin/reservations", admin.getParams(req, {
            date:{
                start, 
                end
                
            },
           data: pag.data,
           moment,
           links: pag.links
           
 
      }));

    });
 
});

router.get("/reservations/chart", function(req, res, next){
    
    req.query.start = (req.query.start) ? req.query.start : moment().subtract(2, "year").format("YYYY-MM-DD");
    req.query.end = (req.query.end) ? req.query.end : moment().format("YYYY-MM-DD");

    reservations.chart(req).then(chartData =>{

        res.send(chartData);
    })

});

router.post('/reservations', function(req, res, next){
    console.log("ADMIN PAYLOAD", req.fields, req.files);
    reservations.save(req.fields, req.files).then(results =>{
        
        res.send(results);

    }).catch(err =>{

        res.send(err);
    });


});
/**
 * DELETE passando o parametro id via url /:id
 */
router.delete('/reservations/:id', function(req, res, next){

    //faz o casting do parametro via url com req.params.id
    reservations.delete(req.params.id).then(results =>{

        res.send(results);

    }).catch(err =>{

        res.send(err);
    });

});

/**
 * ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 * |||||||||||||||||||| ROTAS DOS USERS||||||||||||||||||||||||||||||||||||||
 * ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 */

router.get("/users", function(req, res, next){

    users.getUsers().then(data =>{

        res.render("admin/users", admin.getParams(req, {data}));

    }).catch(err =>{

        res.send(err);

    })

    

});

router.post("/users", function(req, res, next){

   users.save(req.fields).then(results =>{

    res.send(results);

   }).catch(err =>{

    res.send({

        error: err
    });

   });

});

router.post("/users/password-change", function(req, res, next){

    users.changePassword(req).then(results =>{
 
     res.send(results);
 
    }).catch(err =>{
 
    //console.log("ERROR: ", err);
     res.send({

        error: err
     });
     
 
    });
 
 });



router.delete("/users/:id", function(req, res, next){

    users.delete(req.params.id).then(results =>{

        res.send(results);
    
       }).catch(err =>{
    
        res.send(err);
    
       });

});





module.exports = router;