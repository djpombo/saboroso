let conn = require('./db');
let path = require('path');

module.exports = {

        getMenus(){

            return new Promise ((resolve, reject) =>{

                conn.query(`
                        SELECT * FROM tb_menus ORDER BY title;
                    
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
        /**
         * 
         * @param {*} fields - sao os campos strings para gravar no banco
         * @param {*} files - quando vem outros tipos de arquivo, com jpg, avi, rar
         */
        save(fields, files){
       
            return new Promise((resolve, reject)=>{
                /**
                 * Antes de efetuar a query da image, fazer o parse do path
                 * para que o name da foto vire um hash, que pode ser recuperado do
                 * arquivo public/images
                 */
                fields.photo = `images/${path.parse(files.photo.path).base}`;

                let query;
                let queryPhoto = '';
                let params = [
                    fields.title,
                    fields.description,
                    fields.price
                ];
                if(files.photo.name){
                    
                    queryPhoto = ',photo = ?';//virgula antes para concatenar com a query
                    params.push(fields.photo);//push no array para inserir a foto

                } else {


                }


                
                /**
                 * Testa o que vem no fields, se ele tiver um id é um update e nao um novo registro
                 */
                if(parseInt(fields.id)> 0){
                    /**
                     * SQL query para UPDATE no banco
                     */
                    params.push(fields.id);
                    query= `
                        UPDATE tb_menus
                        SET title = ?,
                            description = ?,
                            price = ?
                            ${queryPhoto}
                        WHERE id = ?
                    
                    `;
                   


                } else {

                    if(!files.photo.name){

                        reject('Envie uma imagem');
                    } else{
                    /**
                     * SQL query para inserção no banco
                     */
                    query = `
                    INSERT INTO tb_menus (title, description, price, photo)
                    VALUES (?, ?, ?, ?)         
                 `;
                    

                    }
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
        
        delete(id){

            return new Promise((resolve, reject)=>{

                conn.query(`
                    DELETE FROM tb_menus
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
            
            
    }






