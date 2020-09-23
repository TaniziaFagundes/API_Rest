# API_Rest Games
Está API é utilizada para fazer CRUD de games e foi criada com o objetivo de estudos de API rest

## Endpoints
<hr>
### GET /games

retorna a lista de todos os games cadastrados no banco de dados

#### Parametros

nenhum

#### Respostas

##### OK! 200

Caso essa resposta aconteça voce recebe a listagem de todos os games

Exemplo de resposta:

```
[
    {
        "id": 1,
        "title": "narnia",
        "year": 2018,
        "price": 79
    },
    {
        "id": 2,
        "title": "gta",
        "year": 2012,
        "price": 30
    },
    {
        "id": 3,
        "title": "prision break",
        "year": 2019,
        "price": 58
    }
]
```


##### Falha na autenticaço! 401

Caso essa resposta aconteça significa que ocorreu uma falha no processo de autenticação da requisição. 
motivos: token invalido ou token expirado

Exemplo de resposta:

```
{
    "err": "Token Invalido!"
}
```

<hr>

### POST /auth

Responsavel por realizar o processo de login, gerando um Token ao usuario.

#### Parametros

email: Email do usuario cadastrado no sistema
password: Senha do usuario cadastrado

Examplo:
```
{
    "email":"name@exemple.com",
    "password": "12345"
}
```

#### Respostas

##### OK! 200

Caso essa resposta aconteça voce recebe o token para acessar a API

Exemplo de resposta:

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0YW5pemlhMjNAIiwia
    WF0IjoxNjAwODE5NzMzLCJleHAiOjE2MDA5OTI1MzN9.roy19m_GSIs_0cm_qOQ8riQk0HRxiKjTSu7l44Q6icg"
}
```


##### Falha na autenticaço! 401

Caso essa resposta aconteça significa que ocorreu uma falha no processo de autenticação da requisição. 
motivos: SENHA ou EMAIL incorretos

Exemplo de resposta:

```
{
    "err": "Tcredenciais incorretas!"
}
```

<hr>
