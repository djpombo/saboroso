var conn = require('./db');
var Pagination = require("./../inc/Pagination");
var moment = require("moment");

module.exports = { 
    
    
   render(req, res, error, success){

    res.render('reservations', { 
        title: 'Reservas - Restaurante Saboroso!',
        background: 'images/img_bg_2.jpg',
        h1: 'Reserve uma Mesa!',
        body: req.body,
        error,
        success,
       
      
      });


   },

   save(fields){

    console.log("SAVEID: ", fields.id);
    if(fields.id === undefined) fields.id = "0";

    console.log("SAVE: ", fields);
    console.log("SAVEID: ", fields.id);

    return new Promise ((resolve, reject)=>{

      
      if(fields.date.indexOf('/') > -1){

        let date = fields.date.split('/');//data esta vindo dd/mm/yyyy

      fields.date = `${date[2]}-${date[1]}-${date[0]}`;//padrao da data no SQL yyyy-mm-dd
      console.log("DATE: ", fields.date);

      } else {
      

      

      let query;
      let params = [
                  fields.name,
                  fields.email,
                  fields.people,
                  fields.date,
                  fields.time
      ];
      console.log("PARAMS: ", params);
      
     
      if(parseInt(fields.id) > 0){

        query = `
          UPDATE tb_reservations
          SET
            name = ?,
            email = ?,
            people = ?,
            date = ?,
            time = ?
          WHERE
            id = ?

        `;
        params.push(fields.id);

      } else {

        
        query = `
        INSERT INTO tb_reservations (name, email, people, date, time)
        VALUES (?, ?, ?, ?, ?)
          
        `, [
            fields.name,
            fields.email,
            fields.people,
            fields.date,
            fields.time

        ];


      }

      console.log("PARAMS SAVE: ", params);
      conn.query(query, params, (err, results)=>{

                if(err){

                  reject(err);

                } else {

                  resolve(results);

                }

              });//fim da conn.query
      }

    });//fim da promisse




  },//fim do metodo save()

  getReservations(req){

    return new Promise((resolve, reject)=>{

    let page = req.query.page;
    let dtStart = req.query.start;
    let dtEnd = req.query.end;


    if(!page) page = 1;

    let params = [];

    if(dtStart && dtEnd) params.push(dtStart, dtEnd);

    let pag = new Pagination(

      `SELECT sql_calc_found_rows *
        FROM tb_reservations
        ${(dtStart && dtEnd) ? 'WHERE date BETWEEN ? AND ?' : '' }
        ORDER BY name LIMIT ?, ?`,
       params
         
    );

   pag.getPage(page).then(data =>{

      resolve({
        data,
        links: pag.getNavigation(req.query)

      });

    })
  }); 
  
},

delete(id){

  return new Promise((resolve, reject)=>{

    conn.query(`
        DELETE FROM tb_reservations
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
    chart(req){

      return new Promise((resolve, reject)=>{

        conn.query(`
                    SELECT
                      CONCAT(YEAR(date), '-', MONTH(date)) AS date,
                        COUNT(*) AS total,
                        SUM(people) / COUNT(*) AS avg_people
                    FROM tb_reservations
                    WHERE
                      date BETWEEN ? AND ?
                    GROUP BY YEAR(date), MONTH(date)
                    ORDER BY YEAR(date) DESC, MONTH(date) DESC;
        `,[
          req.query.start,
          req.query.end
        ], (err, results)=>{

          if(err){
            reject(err);
          }else{

            let months = [];
            let values = [];

            results.forEach(row=>{

              months.push(moment(row.date).format('MMM YYYY'));
              values.push(row.total);

            });


            resolve({
              months,
              values
            });
          }

        })

      });


    }

};