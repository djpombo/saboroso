var conn = require('./db');

module.exports = {

    render(req, res, error){

        res.render("admin/login", {
            body: req.body,
            error


        });


    },

    login(email, password){

        //console.log('SQL EMAIL', email);
        return new Promise((resolve, reject)=>{

            conn.query(`
                SELECT * FROM tb_users WHERE email = ?
            
            
            
            
            `,[
                email
            ], (err, results)=>{
                console.log('SQL EMAIL', results);
                
                if(err){

                    reject(err);

                } else{

                    if(!results.length > 0){

                        reject({
                            message: "Usuario ou senha incorretos!"

                        });

                    } else{

                        let row = results[0];

                        if(row.password != password){

                            reject({
                                message: "Usuario ou senha incorretos!"
    
                            });

                        } else{

                            resolve(row);

                        }

                    }

                    
                    

                }



            });//fim co conn.query

        });//fim da Promisse
    
    },//fim do metodo login()

    getUsers(){

        return new Promise ((resolve, reject) =>{

            conn.query(`
                    SELECT * FROM tb_users ORDER BY name;
                
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

    save(fields, files){
       
        return new Promise((resolve, reject)=>{
           
            let query;
            let queryPhoto = '';
            let params = [
                fields.name,
                fields.email
                
            ];
            
            /**
             * Testa o que vem no fields, se ele tiver um id é um update e nao um novo registro
             */
            if(parseInt(fields.id)> 0){
                /**
                 * SQL query para UPDATE no banco
                 */
                params.push(fields.id);
                query= `
                    UPDATE tb_users
                    SET name= ?,
                        email = ?
                        
                    WHERE id = ?
                
                `;
               


            } else {

                query = `
                INSERT INTO tb_users (name, email, password)
                VALUES (?, ?, ?)         
             `;

                params.push(fields.password);
            }   

            
            conn.query(query, params, (err, results)=>{

                if(err){
                    console.log("REJECT: ", err);
                    reject(err);
                } else{
                    resolve(results);
                }
            });
        });


    }, //fim do save

    changePassword(req){

        return new Promise((resolve, reject) =>{

            if(!req.fields.password){

                reject("Preencha os campos com a senha");
            }
            else if(!req.fields.passwordConfirm){

                reject("Confirme a Senha!");
            }

            else if((req.fields.password) !== (req.fields.passwordConfirm)){

                reject("As senhas precisam ser iguais");
            }
            else{

                conn.query(`
                    UPDATE tb_users 
                    SET password = ?
                    WHERE id = ?
            
                `, [
                    req.fields.password,
                    req.fields.id
                ], (error, results) =>{

                    if(error){

                        reject(err.message);
                        
                    }
                    else{

                        resolve(results);

                    }
                });

            }

        })

    },

    delete(id){

        
        return new Promise((resolve, reject)=>{
            
            conn.query(`
                DELETE FROM tb_users
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
    }


};