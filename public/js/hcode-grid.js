class HcodeGrid{

    constructor(configs){
        configs.listeners = Object.assign({            
            afterUpdateClick: (e)=>{
              $('#modal-update').modal('show');//jquery para abrir o modal
            },
            afterDeleteClick: (e)=>{
                window.location.reload();

              },
            afterFormCreate: (e)=>{
                window.location.reload();//força o refresh da pagina após a inserção

            },
            afterFormUpdate: (e)=>{
                window.location.reload();//força o refresh da pagina após a inserção

            },
            afterFormCreateError: (e)=>{
                alert("Não foi possivel enviar o formulario");

            },
            afterFormUpdateError: (e)=>{
                alert("Não foi possivel alterar o formulario");

            }
        }, configs.listeners);
        
        /**
         * Object.assign junta dois objetos em um só, no caso o
         * objeto padrão dos forms e btns junta com os que são 
         * passados como parametros quando a classe é chamada
         */
        this.options = Object.assign({},
        {

        formCreate: '#modal-create form',
        formUpdate: '#modal-update form',
        btnUpdate: 'btn-update',
        btnDelete: 'btn-delete',
        onUpdateLoad: (form, name, data) =>{

            let input = form.querySelector('[name=' +name+']');
            if (input) input.value = data[name];
        }
      

        }, configs);

        this.rows = [...document.querySelectorAll('table tbody tr')];

        this.initForms();
        this.initButtons();
        
   
    }

    initForms(){

        this.formCreate = document.querySelector(this.options.formCreate);

        if(this.formCreate){
                
            this.formCreate.save({

                success: ()=>{

                    this.fireEvent('afterFormCreate');

                },
                failure: () =>{
                    this.fireEvent('afterFormCreateError');

                }

            });
        }

        

            this.formUpdate = document.querySelector(this.options.formUpdate);

                if(this.formUpdate){
                        
                    this.formUpdate.save({
                        success: ()=>{
                            this.fireEvent('afterFormUpdate');

                        },
                        failure: ()=>{
                            this.fireEvent('afterFormUpdateError');

                        }


                    });
            }

    }
    
    fireEvent(name, args){
        if (typeof this.options.listeners[name] === 'function'){

            this.options.listeners[name].apply(this, args);
        }

    }

    getTrData (e) {
 
        let path = e.path || (e.composedPath && event.composedPath()) || composedPath(e.target);
        
        if (path) {
       
          let tr = path.find(el => {
       
            return (el.tagName.toUpperCase() === 'TR');
       
          });
       
          return JSON.parse(tr.dataset.row);
        }
      }

    btnUpdateClick(e){

        this.fireEvent('beforeUpdateClick', e);

                let data = this.getTrData(e); 


                //para preencher o campos do modal com as informações do JSON data
                for (let name in data){

                    this.options.onUpdateLoad(this.formUpdate, name, data);
                   

                }

         
                this.fireEvent('afterUpdateClick', [e]);



    }

    btnDeleteClick(e){

        
        this.fireEvent('beforeDeleteClick', e);

        let data = this.getTrData(e);
        /**
         * eval converte uma string em um template string para passar o att
         * concatenando as crases "`" + var + "`"
         */
        if(confirm(eval("`" + this.options.deleteConfirm + "`"))){  

            fetch(eval("`" + this.options.deleteUrl + "`"), {
                method: "DELETE"

        })
            .then(response => response.json())
            .then(json =>{
                
                this.fireEvent('afterDeleteClick');
               
        });
        
        }//fim do confirm


    }

    initButtons(){
    
        this.rows.forEach(row =>{
        /**
         * Pegar os btns e converter em um array com spread [...btn]
         * clicando no editar da linha, encontra com find o tagName dele e coloca na variavel tr
         * o dataset deste elemento
         */
            [...row.querySelectorAll('.btn')].forEach( btn =>{

                btn.addEventListener('click', e=>{

                    if(e.target.classList.contains(this.options.btnUpdate)){

                        this.btnUpdateClick(e);

                    }else if(e.target.classList.contains(this.options.btnDelete)){

                        this.btnDeleteClick(e);

                    } else {

                        this.fireEvent('buttonClick', [e.target, this.getTrData(e), e]);

                    }
                });

            });

        });
     
    }//fim do initButtons()


}//fim da class