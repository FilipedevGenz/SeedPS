# Integração com a API de Blog

## Visão Geral

Este projeto foi desenvolvido utilizando **HTML**, **CSS** e **JavaScript**, realizando a integração com uma API REST responsável pelo gerenciamento de postagens de um blog ou mural de depoimentos.

A API fornece funcionalidades para:

* Verificação de disponibilidade do serviço (Health Check);
* Listagem de postagens;
* Criação de novas postagens;
* Exclusão de postagens.

A URL base da API é:

```
https://blog-api.seedabit.org.br/api
```

---

# Configuração

A camada de integração utiliza duas constantes principais:

```javascript
const API_URL = "https://blog-api.seedabit.org.br/api";
const API_KEY = "key-XXXXXXXX";
```

Onde:

* **API_URL** representa a URL base da API.
* **API_KEY** corresponde à chave utilizada para autenticação das requisições protegidas.

---

# Autenticação

Os endpoints protegidos exigem o envio do cabeçalho HTTP:

```
x-api-key: key-XXXXXXXX
```

Exemplo:

```
GET /posts HTTP/1.1
Host: blog-api.seedabit.org.br
x-api-key: key-XXXXXXXX
```

---

# Estrutura da Camada de Integração

Toda a comunicação com a API foi centralizada no objeto **`apiRequest`**, responsável por encapsular todas as chamadas HTTP da aplicação.

Essa abordagem reduz duplicação de código, facilita a manutenção e torna futuras alterações na API transparentes para o restante da aplicação.

Os métodos disponíveis são:

```javascript
apiRequest.healthCheck();

apiRequest.getPosts();

apiRequest.createPost({
    title,
    content,
    author
});

apiRequest.deletePost(id);
```

---

# Endpoints

## 1. Health Check

Verifica se a API está disponível para utilização.

### Endpoint

```
GET /
```

### Exemplo

```javascript
const response = await apiRequest.healthCheck();
```

### Retorno de sucesso

```javascript
{
    success: true,
    status: 200,
    statusText: "OK"
}
```

### Retorno de erro

```javascript
{
    success: false,
    status: 500,
    statusText: "Internal Server Error"
}
```

---

## 2. Listar Postagens

Recupera todas as postagens cadastradas.

### Endpoint

```
GET /posts
```

### Headers

```
x-api-key
```

### Exemplo

```javascript
const response = await apiRequest.getPosts();
```

### Retorno esperado

```javascript
{
    success: true,
    data: [
        {
            id: 1,
            title: "Meu título",
            content: "Conteúdo",
            author: "Autor"
        }
    ],
    status: 200,
    statusText: "OK"
}
```

---

## 3. Criar Postagem

Cria uma nova postagem.

### Endpoint

```
POST /posts
```

### Headers

```
x-api-key
Content-Type: application/json
Accept: */*
```

### Body

```json
{
    "title": "Título",
    "content": "Conteúdo da postagem",
    "author": "Nome do autor"
}
```

### Exemplo

```javascript
await apiRequest.createPost({
    title: "Nova postagem",
    content: "Texto da postagem",
    author: "João"
});
```

### Retorno esperado

```javascript
{
    success: true,
    data: {
        id: 10,
        title: "Nova postagem",
        content: "Texto da postagem",
        author: "João"
    },
    status: 201,
    statusText: "Created"
}
```

---

## 4. Excluir Postagem

Remove uma postagem a partir do seu identificador.

### Endpoint

```
DELETE /posts/{id}
```

### Headers

```
x-api-key
Content-Type: application/json
Accept: */*
```

### Exemplo

```javascript
await apiRequest.deletePost(15);
```

### Retorno esperado

```javascript
{
    success: true,
    data: {
        ...
    },
    status: 200,
    statusText: "OK"
}
```

---

# Tratamento de Erros

Todos os métodos da camada de integração retornam uma estrutura padronizada, permitindo que a interface trate os resultados de maneira uniforme.

## Sucesso

```javascript
{
    success: true,
    data,
    status,
    statusText
}
```

## Falha HTTP

```javascript
{
    success: false,
    data: null,
    status,
    statusText
}
```

## Erro de rede ou exceção

```javascript
{
    success: false,
    data: null,
    status: 0,
    statusText: error.message
}
```

Esse padrão elimina a necessidade de a camada de interface depender diretamente do comportamento do `fetch`, simplificando o fluxo de tratamento de erros.

---

# Estratégia de Tratamento de Exceções

Durante o desenvolvimento foi adotada a decisão de **não propagar exceções (`throw`) para as camadas superiores da aplicação**. Em vez disso, toda operação retorna um objeto padronizado contendo o resultado da requisição.

Essa estratégia foi escolhida porque falhas como respostas HTTP inválidas, indisponibilidade da API ou erros de rede fazem parte do fluxo esperado da aplicação e podem ser tratadas diretamente pelo código consumidor, sem interromper a execução através de exceções.

Além de simplificar o consumo da API, essa abordagem favorece o desempenho do código executado pelo motor **V8** (utilizado pelo Node.js e pelos navegadores baseados em Chromium). A criação e propagação de exceções envolve a captura da stack trace e pode limitar algumas otimizações realizadas pelo compilador Just-In-Time (JIT). Ao reservar o mecanismo de exceções apenas para falhas realmente inesperadas, mantém-se um fluxo de execução mais previsível e potencialmente mais eficiente.

Com isso, a interface precisa apenas verificar o campo `success`, tornando o código mais limpo, consistente e de fácil manutenção.

---

# Fluxo da Aplicação

## Carregamento inicial

```
DOMContentLoaded
        │
        ▼
loadPosts()
        │
        ▼
apiRequest.getPosts()
        │
        ▼
GET /posts
        │
        ▼
renderPosts()
```

---

## Criação de postagem

```
Usuário envia formulário
        │
        ▼
createPost()
        │
        ▼
POST /posts
        │
        ▼
Sucesso
        │
        ▼
loadPosts()
        │
        ▼
Atualização automática da lista
```

---

## Exclusão de postagem

```
Usuário clica em excluir
        │
        ▼
Confirmação
        │
        ▼
deletePost(id)
        │
        ▼
DELETE /posts/{id}
        │
        ▼
Elemento removido do DOM
```

---

# Boas Práticas Adotadas

## Centralização da comunicação HTTP

Toda comunicação com a API é realizada exclusivamente pelo objeto `apiRequest`, reduzindo duplicação de código e facilitando futuras alterações.

---

## Uso de `async/await`

Todas as operações assíncronas utilizam `async/await`, proporcionando código mais legível e simplificando o tratamento de operações assíncronas.

---

## Padronização das respostas

Todos os métodos retornam o mesmo formato:

```javascript
{
    success,
    data,
    status,
    statusText
}
```

Essa padronização reduz condicionais espalhadas pela aplicação e desacopla a interface da implementação do `fetch`.

---

## Escape de HTML

Antes da renderização de qualquer conteúdo recebido da API é utilizada a função:

```javascript
escapeHtml()
```

Ela impede a inserção de HTML arbitrário no DOM, reduzindo riscos de ataques de **Cross-Site Scripting (XSS)**.

---

## Separação dos estados da interface

A renderização da aplicação foi dividida em estados específicos:

* `renderLoading()` — carregamento das informações;
* `renderEmpty()` — ausência de postagens;
* `renderError()` — exibição de erros;
* `renderPosts()` — renderização da lista de postagens.

Essa separação torna o fluxo de renderização mais previsível, melhora a organização do código e facilita futuras manutenções e evoluções da aplicação.
