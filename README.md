# Site-Kenia-Pinheiro-Studio
==============================================
# Padronização de Classes:
    Usem nomes em inglês, para não ficar cada um em uma língua
    por padrão de mercado, o melhor é a gente usar tudo em inglês

--------------------------
# Estrutura das Classes:

    -section → bloco grande da página (apenas semântico)
    (usa class com nome autoexplicativo)
    
    -container → limita e centraliza o conteúdo (style)

    -title → título principal daquela seção
    
    -card → bloco que representa um item
    -card__title → título dentro do card
    -card__description → descrição dentro do card

-------------------------------
# Explicação dos Conceitos e Onde Usar:

# Section
    Cada -section pode ser criada na pasta component, separados para não deixar a view com HTML enorme.
    A view faz o import das sections

    A -section é a área da página. 
    Exemplo: página de contato pode ter uma só, pois só tem a area da tabela; 
    página inicial pode ter uma para cada bloco (serviços, sobre, depoimentos, etc.).

# Container
    Elemento que aplica estilo de limitação e centralização dentro da -section.

# Classes
    Todas as classes dentro dos containers seguem o padrão -nome no início, 
    para identificar como classe de estilo.

-----------
# Observações

-> Estilizaremos o CSS por classe, não por tags HTML – isso padroniza o código no Vue.
ou seja, sem editar h2 e etc... edite a classe data a esse h2

-> Se usar IA, explique que estamos usando Vue com scoped, 
o CSS entende as classes de forma isolada no escopo do componente.

-> Crie componentes para seções grandes, deixando a view o menor possivel.

==================================================================================
Exemplo:

# html
<template>
  <section class="services">
    <div class="-container">
      <h2 class="-title">Serviços</h2>
      <div class="-card">
        <h3 class="-card__title">Corte</h3>
        <p class="-card__description">Descrição</p>
      </div>
      <div class="-card">
        <h3 class="-card__title">Manicure</h3>
        <p class="-card__description">Descrição</p>
      </div>
    </div>
  </section>
</template>

---------------------

# css
<style scoped>
.services { padding: 60px 0; }
.services .-container { max-width: 1200px; margin: 0 auto; }
.services .-title { font-size: 2rem; text-align: center; }
.services .-card { background: #fff; padding: 20px; border-radius: 8px; }
.services .-card__title { font-weight: bold; }
.services .-card__description { color: #666; }
</style>

==============================================================================
# Regra de praticas de caracteres 

# -  __ -- (traço, hiffen duplo, traço duplo)

# traço
-    (início)	Toda classe de estilo	 -container
-    (meio)	    Separar palavras	     -section-about

# hiffen duplo
__ 	 Bloco + Elemento	                 -card__title

# traço duplo
--	 Bloco/Elemento + Modificador   	 -card--destaque
==============================================================================



-----------

# Instalar as dependencias

npm install

-----------------------
# Rodar servidor

npm run dev

------------

# GitDesktop 

# Processo de merge

No Git Desktop, com a sua branch de sua pagina selecionada:

- Fetch origin (botão no topo) 
- Faça o commit de seu código antes (parte esquerda inferior, tem que adicionar o titulo para poder commitar)

- Current Branch (botao central no topo) 
- no final da lista de branchs → choose a branch to Merge into

- Escolher develop na area da que abrir -> clicar em Merge

- Se der conflito, resolver e clicar em Continue merge







#README DO VUE
------------------------------------------------------------------------------
This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
