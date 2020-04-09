var conn = require("./db");

module.exports = {

    render(req, res, error, success){
    
        res.render('emails', {
            title: 'Emails - Restaurante Saboroso!',
            background: 'images/img_bg_3.jpg',
            h1: 'E-mails',
            body: req.body,
            error,
            success
            
            
    
    
        });
    },

    getEmails(){

        return new Promise ((resolve, reject) =>{

            conn.query(`
                    SELECT * FROM tb_emails ORDER BY email;
                
                `, 
                (err, results)=>{

                    if(err)
                    {
                
                        reject(err);
                
                    } 
                    else
                    {
                    
                        resolve(results);
                    }

                });
        });

    },

    delete(id){

        console.log('ID: ', id);
        
        return new Promise((resolve, reject)=>{
         
            
            conn.query(`

                DELETE FROM tb_emails
                WHERE id= ?
            
            `,[
                id
            ], (err, results) =>{

                if(err){

                    reject(err);

                }
                else{

                    resolve(results);
                }
            });

        });


    },

    save(req){


        return new Promise((resolve, reject)=>{
        
            if(!req.fields.email){
                reject("Preencha o Email");
                

            } else {

                conn.query(`
                INSERT INTO tb_emails (email) VALUES (?)
                
                `,[
                req.fields.email
                ], (err, results)=>{

                    if(err){
                        reject(err.message);
                    } else {
                        resolve(results);
                    }
                });

    
        
            }
        });
    }
    
};
