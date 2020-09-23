const express = require("express")
const app = express()
const bodyParser =require("body-parser")
const cors =require("cors")
const jwt = require("jsonwebtoken")

//senha de acesso
const JWTsecret = "pelo-amor-de-deus-nao-pode-mostrar-isso-por-segurança" 

app.use(cors());


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//MIDDLEWARE
function auth(req, res, next){

    const authToken = req.headers['authorization'];

    if(authToken != undefined){

        const bearer = authToken.split(' ');
        var token = bearer[1];
        
        jwt.verify(token,JWTsecret, (err,data) =>{
            
            if(err){
                res.status(401);
                res.json({err: "Token Invalido"})
            }else{

                req.token = token;
                req.loggedUser = {id:data.id, email: data.email}

                next(); //sucesso na requisição
            }
        });
         
    }else{
        res.status(401); //não autorizado
        res.json({err: "Token Invalido!"})
    }
    
     

}

//falso db
var DB = {
    games:[
        {
            id:1,
            title:"narnia",
            year: 2018,
            price: 79
        },
        {
            id:2,
            title:"gta",
            year: 2012,
            price: 30
        },
        {
            id:3,
            title:"prision break",
            year: 2019,
            price: 58
        }
    ],
    users: [
        {
            id: 1,
            name:"tanzia",
            email:"tanizia23@",
            password: "12345"
        },
        {
            id: 2,
            name:"jander",
            email:"janser@",
            password: "jandersom"
        }
    ]
}

//listagem dos dados , todos os games
app.get("/games",auth, (req,res) => {

    res.statusCode = 200;  //"ocorreu tudo certo"
    res.json(DB.games);
})

//busca game pelo id
app.get("/games/:id",auth, (req,res) => {
    var id = parseInt(req.params.id);
    res.statusCode = 200;


    var HATEOAS = [          //AUXILIA NO CONSUMO DA API , está aqui para usar o params id dessa rota
        {
            href: "http://localhost:8000/game/"+id,
            method: "DELETE",
            rel: "Delete_game"
        },
        {
            href: "http://localhost:8000/game/"+id,
            method: "PUT",
            rel: "edit_game"
        },
        {
            href: "http://localhost:8000/game/"+id,
            method: "GET",
            rel: "get_game"
        },
        {
            href: "http://localhost:8000/games",
            method: "GET",
            rel: "get_all_games"
        }
        
    ]



    
    if(!isNaN(id) && id != undefined){
        
        var game = DB.games.find( g => g.id == id);
        if(game != undefined){
            res.statusCode = 200;
            res.json({game, _links: HATEOAS});
        }else{
            res.sendStatus(404); //não existe not found
        }
    }else{
        //mostra ao ususario o tipo de erro statusCode
        res.sendStatus(400)
    }
    
})

//cadastro de games no bd falso
app.post("/game",auth, (req,res) => {

    var {title, price, year} = req.body;
    //precisa validar os dados e retornar os erros *****

    DB.games.push({
        id: 4,
        title,
        price,
        year
    })  //push é para add dados dentro de um array

    res.sendStatus(200)
})

//deletando dados
app.delete("/game/:id",auth, (req, res) => { 

    var id = parseInt(req.params.id);

    if(!isNaN(id) && id != undefined){
        
        var index = DB.games.findIndex(g => g.id == id);

        if(index == -1){

            res.sendStatus(400); //não encontrado
            
        }else{
            DB.games.splice(index,1);
            res.sendStatus(200);
        }

    }else{
        //mostra ao ususario o tipo de erro statusCode
        res.sendStatus(400)
    }

})

//ediçao de dados (pode ser feito usando os tres metodos, get, post, put**) **preferêncial
app.put("/game/:id",auth, (req,res) => {
    var id = parseInt(req.params.id);
    res.statusCode = 200;

    if(!isNaN(id) && id != undefined){
        
        var game = DB.games.find( g => g.id == id);
        if(game != undefined){

            var {title, price, year} = req.body; //se algum desses elementos vierem underfined significa que ele não quer editar aquele campo
        
            if(title != undefined){
                game.title = title;
            }
            if(price != undefined){
                game.price = price;
            }
            if(year != undefined){
                game.year = year;
            }

            res.send(200)

        }else{
            res.sendStatus(404); //não existe not found
        }

    }else{
        //mostra ao ususario o tipo de erro statusCode
        res.sendStatus(400)
    }
})


//authetication of login
app.post("/auth", (req, res) => {
    var {email , password} = req.body;

    if(email != undefined || password != undefined){

       var user =  DB.users.find(use => use.email == email);

       if(user != undefined){

            if(user.password == password){
                    //informações do usuario dentro do token, token, tempo de expiração
                jwt.sign({id: user.id, email: user.email}, JWTsecret,{expiresIn:"48h"},(err, token) =>{
                    if(err){
                        res.status(400);
                        res.json({err: "Falha Interna"})
                    }else{
                        res.status(200)
                        res.json({token: token})  //retorna o token criptografado
                    }
                })

            }else{
                res.status(401);
                res.json({err: "Credenciais Inválidas"})
            }

       }else{
           res.status(404);
           res.json({err: "O email enviado não está cadastrado"})
       }

    }else{
        res.status(400);
        res.json({err: "O email ou senha é invalido"})
    }
})




app.listen(8000 , () => {
    console.log("API rodando")
})