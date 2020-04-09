var conn = require('./db');

class Pagination{


    constructor(query, params = [], itensPerPage = 10){

        this.query = query;
        this.params = params;
        this.itensPerPage = itensPerPage;
        this.currentPage = 1;

    }

    getPage(page){

        this.currentPage = page - 1;//pq o LIMIT do sql começa em 0
        /**
         * currentPage começa em zero no SQL fica LIMIT 0, 10
         * quando a page for 2, a currentPage fica (2-1 = 1)*10 no SQL fica LIMIT 10, 10
         * quando a page for 3, a currentPage fica (3-1 = 1)*10 no SQL fica LIMIT 20, 10
         * e assim sucessivamente
         */
        this.params.push(
            this.currentPage * this.itensPerPage,
            this.itensPerPage

        );

        return new Promise((resolve, reject)=>{

            conn.query([this.query, "SELECT FOUND_ROWS() AS FOUND_ROWS"].join(";"), this.params, (err, results)=>{

                if(err){
                    reject(err);
                } else {
                    /**
                     * usndo multipleStaments, o results do SQL retorna um array bidimensional
                     * onde a primeira query que tem os limits vem na posicao [0][todas as linhas]
                     * enquanto a segunfa query que a found rows fica na posicao [1][0] somente uma row
                     * contendo o total de registros para fins de calculo de paginação
                     */
                    this.data = results[0];
                    this.total = results[1][0].FOUND_ROWS;
                    this.totalPages = Math.ceil(this.total / this.itensPerPage);//Math.ceil arredonda a divisao pra cima
                    this.currentPage++;

                    

                    resolve(this.data);

                }


            });


        });

    }

    getTotal(){

        return this.total;
    }

    getCurrentPage(){

        return this.currentPage;
    }

    getTotalPages(){

        return this.totalPages;
    }

    getNavigation(params){

        let limitPagesNav = 5;
        let links = [];
        let nrStart = 0;
        let nrEnd = 0;

        if(this.getTotalPages() < limitPagesNav){

            limitPagesNav = this.getTotalPages();
        }

        //se estamos nas primeiras paginas
        if((this.getCurrentPage() - parseInt(limitPagesNav/2)) < 1){
            
            nrStart = 1;
            nrEnd = limitPagesNav;

        } 
        //se estou chegando nas ultimas paginas
        else if ((this.getCurrentPage() + parseInt(limitPagesNav/2)) > this.getTotalPages()){

            nrStart = this.getTotalPages() - limitPagesNav;
            nrEnd = this.getTotalPages(); 

        }
        //se estamos no meio das paginas
        else{
            nrStart = this.getCurrentPage() - parseInt(limitPagesNav/2);
            nrEnd = this.getCurrentPage() + parseInt(limitPagesNav/2);
        }

        //regras dos botões anterior e posterior
        if(this.getCurrentPage() > 1){
            links.push({
                text: '<',
                href: '?' + this.getQueryString(Object.assign({}, params,{page: this.getCurrentPage() - 1}))

            });

        }

        for(let x = nrStart; x <= nrEnd; x++){

            links.push({
                text: x,
                href: '?' + this.getQueryString(Object.assign({}, params,{page: x})),
                active: (x === this.getCurrentPage()) ? true : false


            });

        }

        if(this.getCurrentPage() < this.getTotalPages()){

            links.push({
                text: '>',
                href: '?' + this.getQueryString(Object.assign({}, params,{page: this.getCurrentPage() + 1}))

            });

        }

        return links;


    }

    getQueryString(params){

        let queryString = [];

        for(let name in params){
            queryString.push(`${name}=${params[name]}`);

        }

        return queryString.join("&");


    }






}

module.exports = Pagination;