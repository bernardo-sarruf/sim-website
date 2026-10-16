# Site SIM - Metallographica

Site estático em HTML, CSS e JavaScript, com quatro páginas:
- `home.html`
- `sobre.html`
- `metallographica.html`
- `contato.html`

## Publicar no GitHub Pages
1. Extraia o ZIP.
2. Envie todos os arquivos e pastas para a raiz do repositório GitHub.
3. Em Settings → Pages, selecione a branch e a pasta `/ (root)`.
4. Para que a página inicial abra automaticamente, renomeie `home.html` para `index.html` (ou crie uma cópia com esse nome). Os links internos podem continuar apontando para `home.html`; se preferir `index.html`, atualize também os links.

## Configurar o formulário
O formulário valida os campos e prepara uma mensagem por meio do aplicativo de e-mail. Para habilitar:
1. Abra `js/main.js`.
2. Substitua `CONFIGURAR_EMAIL_OFICIAL_AQUI` pelo endereço oficial de contato da SIM.
3. Para envio direto sem abrir o aplicativo de e-mail, será necessário conectar um serviço de formulários/backend.

## Personalização
- Cores principais em `css/style.css`, no bloco `:root`.
- Logotipo: `assets/logo-sim.png`.
- Imagem limpa do Hero: `assets/hero-laboratorio.png`. O texto e os botões do Hero são HTML/CSS e podem ser editados em `home.html`.
- Ondas: SVG inline definido no HTML; pode ajustar as curvas e cores conforme necessário.

O conteúdo funcional do Metallographica foi redigido com base no manual do usuário fornecido. Confirme informações comerciais, compatibilidade atual e disponibilidade das funcionalidades antes da publicação.
