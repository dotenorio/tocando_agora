# Tocando agora (beta) #

Extensão para notificar qual música/vídeo está tocando no Deezer, YouTube, Spotify, Google Play Music ou YouTube Music.

Baixe na [Chrome Web Store](https://chrome.google.com/webstore/detail/tocando-agora-beta/ahlldljeehledjbbpfeklndmlkinhmfg)

> *Recomendado o uso com [Key Socket Media Keys](https://goo.gl/XCIzG4)*

## Qualidade do código ##

* `$ npm run lint`
    * _Usamos o [JavaScript Standard Style](https://github.com/feross/standard)_

### Changelog ###

* 1.7.21
    * Atualizando traduções

* 1.7.20
    * Novo ícone para o Youtube Music

* 1.7.19
    * Adicionando suporte ao Youtube Music

* 1.6.19
    * Correção para pegar o nome do canal do youtube e exibir nas notificações do youtube

* 1.6.18
    * Melhorando tratamento do texto da notificação para Spotify e Youtube
    * Atualizando icones do Google Play Music e Youtube nas notificações
    * Corrigindo notificações do Spotify que apareciam fora do player

* 1.6.17
    * Melhorando tratamento do texto da notificação para alguns modelos de título

* 1.6.16
    * Adicionando reposítório no GitHub

* 1.5.16
    * Adicionando i18n (somente para manifest.json): 'pt_BR' e 'en'

* 1.4.16
    * Melhorando a exibição dos textos e imagens na notificação

* 1.4.15
    * Correção de Manifest Inválido

* 1.4.13
    * Inserindo comando que permite ver o que está tocando agora

* 1.3.13
    * Ignorando tratamento para notificar quando Google Play Música

* 1.3.12
    * Tratamento para notificar corretamente Deezer e Spotify

* 1.3.11
    * Refeito o script que monitorava a troca de músicas e mais algumas melhorias

* 1.2.9
    * Melhoria no script que monitorava a troca de músicas

* 1.2.8
    * Melhoria na busca por aba

* 1.2.7
    * Todo o código foi refeito para melhor manutenibilidade
    * Fluxos foram melhorados para evitar execução de métodos repetidamente

* 0.2.7
    * Correções na exibição de notificações

* 0.2.6
    * Ao clicar na notificação, a aba correspondente é aberta

* 0.1.6
    * Adicionando suporte para o Google Play Music
    * Mudança no padrão de versionamento, 0.0.0: [mudança significativa].[novo recurso].[correções]

* 0.0.6
    * Não exibir notificações para títulos inválidos (que não são de música/vídeo)
    * Pequena melhoria nos logs exibidos na aba onde a extensão está ativa

* 0.0.5
    * Correções e melhorias na exibição de notificações

* 0.0.4
    * Adicionado ícone na barra de endereços para habilitar/desabilitar notificações naquela aba e também para deixar visível que aquela aba está com o Tocando Agora agindo.

* 0.0.3
    * Resolvendo problemas para 'autoupdating'

* 0.0.2
    * Corrigida a notificação que era exibida quando se buscava no Youtube.

* 0.0.1
    * Primeira versão.
