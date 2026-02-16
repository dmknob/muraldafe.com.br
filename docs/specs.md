# Projeto: Mural da Fé - muraldafe.com.br
## Objetivo
 O domínio é auto explicativo. O objetivo inicial foi cadastrar Graças recebidas, e vender a arte de um santinho personalizado relatando esta Graça, como forma da pessoa que recebeu o santinho, agradecer ao Intercessor e fomentar a Fé dos que estão passando por dificuldades (parecidas ou não). Vamos coletar o relato, documentar no site e produzir a arte para o santinho, e entregar uma quantia previamente acordada impressa em alta qualidade. Objetivo de atender o Brasil todos. Moramos próximo ao Santuário do Padre Reus, que tem grande visitação.
 Aproveitando este domínio da arte digital moderna com IA, e inspirados por São Carlo Acutis, resolvemos expandir o serviço também para paróquias e comunidades que queiram fazer um material personalisado e ao mesmo tempo serem catalogadas no nosso site.

## Requisitos Funcionais (RF)
### Gestão e Estrutura de Dados

* RF01 - Cadastro de Intercessores: Registro de figuras de fé (nome, slug, bio, imagem previamente gerada por IA). Deve ser o primeiro passo para permitir vínculos posteriores.

* RF02 - Cadastro de Comunidades (Dependente): Registro de paróquias/santuários vinculados a um Intercessor já existente.

* RF03 - Registro de Graças (Relatos): Cadastro de testemunhos vinculados a um Intercessor (obrigatório) e Comunidade (opcional). Uma Graça pertence a um Intercessor, e opcionalmente a UMA Comunidade. Uma Comunidade pertence a um Intercessor.

* RF04 - Controle Editorial: Status de "Rascunho" ou "Publicado" para todas as entidades, controlado internamente.

* RF05 - Gestão de Slugs (Bater o Martelo): O sistema deve permitir slugs personalizados para Graças, Comunidades e Intercessores. A decisão final da URL cabe à curadoria da Corpo Digital, independente da preferência do cliente - SLUGS não podem ser alterador a posteriori para não quebrar QRCodes já impressos.

Navegação e UX

* RF06 - Estrutura de Silos Rígidos: Organização em /intercessores/ e /comunidades/ para facilitar o SEO.

* RF07 - Mural de Cards: Grid de graças que expande o relato completo. A implementação da URL dinâmica com # será avaliada na prática para validar se a UX atende às expectativas.

* RF08 - Renderização de Página Canônica: Geração de página limpa e exclusiva para cada graça (/padre-reus/relato), otimizada para QR Codes e compartilhamento direto.

* RF09 - Vínculo de Padroado: Exibição automática de graças do intercessor nas páginas das comunidades onde ele é padroeiro, com destaque para relatos locais.

## Requisitos Não Funcionais (RNF)
* RNF01 - SSR (Server Side Rendering): O servidor deve entregar o HTML completo para garantir a indexação dos relatos pelo Google - Uso de template engine com EJS.

* RNF02 - Performance com WebP: Todas as imagens devem ser convertidas e servidas em WebP - isto é feito fora do sistema, pela equipe de gestão do site ao cadastrar um novo Intercessor/Comunidade/Graça alcançada.

* RNF03 - Indexação Semântica: Geração de sitemap.xml dinâmico cobrindo todos os silos de conteúdo.

* RNF04 - Atmosfera de Luxo (UI): Fidelidade à paleta (Preto/Vinho e Dourado) e tipografia nobre (Cinzel e Cardo/Playfair).

* RNF05 - Navegação Híbrida (A avaliar): Uso de modais para manter o tempo de permanência, sujeito a validação técnica e de usabilidade durante o desenvolvimento.
- https://muraldafe.com.br/intercessores/padre-reus#jsk renderiza a página do Intercessor, e sobre ela um modal com os dados da Graça de JSK.
- https://muraldafe.com.br/intercessores/padre-reus/jsk renderiza a página da Graça de JSK apenas, sem o modal nem dados do Intercessor (apenas com um link para 'subir' de nível).
O objetivo é ter uma URL com muito conteudo, vinculada ao Intercessor, e que seja fácil as pessoas irem 'pulando' de Graça em Graça na leitura. E uma outra URL 'limpa' para 'vender' ao Devoto com o relato apenas da Sua Graça alcançada, com um link exclusivo.

* RNF06 - Infraestrutura SQLite: Uso de SQLite para garantir robustez e simplicidade inicial.

## Contrato de interface:

## Visual Identity
- Paleta de cores:
  - Fundo: Preto absoluto (#000000) ou Vinho/Marrom profundo.
  - Destaques: Dourado (#D4AF37).
  - Texto: Marfim/Brancogelo para contraste.
- Tipografia:
  - Títulos: Fonte Cinzel (caixa alta).
  - Corpo de texto: Cardo ou Playfair Display.
  - Evitar sans-serif.

* TODO: definir interface administrativa para os cadastros.

* Home (O Portal de Entrada) - https://muraldafe.com.br

Objetivo: Agir como um filtro de entrada limpo e imponente.

    Conteúdo Central (Pitch): "O FUTURO DA DEVOÇÃO É FÍSICO E DIGITAL".

    Subtexto: Texto explicando a união entre tradição (iconografia sacra) e inovação (IA).

    Ações (CTAs):

        Botão [INTERCESSORES] (Link: /intercessores/).

        Botão [COMUNIDADES] (Link: /comunidades/).

    Identidade: Logotipo centralizado em Dourado (#D4AF37) com a assinatura "by Corpo Digital".

* Página do Intercessor (/intercessores/:slug) - https://muraldafe.com.br/intercessores/padre-reus

    Objeto Intercessor: nome, biografia, oracao, imagem_principal_webp. 
    Lista de Graças: Array de objetos contendo nome_exibicao, localidade, slug_relato e resumo_texto

Objetivo: Contar a história do intercessor e listar os testemunhos vinculados.

Cabeçalho do Intercessor:
    Nome (Fonte Cinzel, Caixa Alta).
    Imagem IA (WebP em alta definição).
    Biografia Curta e Oração.
    Mural (Grid de Cards):
        Card de Graça: Exibe Iniciais do Devoto, Cidade/Estado, Data e um Resumo bem Curto do relato.
        Comportamento: Clique abre o Modal/URL Dinâmica. - https://muraldafe.com.br/intercessores/padre-reus#jsk
    Rodapé Contextual: CTA para transformar seu próprio testemunho em santinho.
    

* Página da Comunidade (/comunidades/:slug) - https://muraldafe.com.br/comunidades/paroquia-santa-terezinha-campo-bom-rs

    Objeto Comunidade: nome, historia_local, padroeiro_nome, padroeiro_id. 
    Galeria Estática: Array de strings com os caminhos das imagens (/uploads/comunidades/foto1.webp).
    Mural Relacionado: Lista de graças onde intercessor_id == padroeiro_id.

Objetivo: Valorizar a história local e as graças alcançadas através do padroeiro da paróquia.

    Identidade da Comunidade:
        Nome da Paróquia/Santuário.
        História (colhida via entrevista) e Galeria de Fotos (Antigas e Atuais).
    Vínculo Espiritual:
        Padroeiro Relacionado: Link e imagem do intercessor daquela comunidade.
    Mural Local:
        Lista de graças filtradas pelo intercessor_id (padroeiro).
        Destaque visual (moldura dourada) para graças com comunidade_id igual ao da página atual (quando o devoto atribui a Graça à comunidade junto do Intercessor).

* Página da Graça / Prestígio (/intercessores/:santo/:relato) - https://muraldafe.com.br/intercessores/padre-reus/jsk

    Dados do Relato: nome_exibicao (conforme escolha do devoto), localidade, texto_completo_relato. 
    Dados do Produto: imagem_santinho.webp (foto do material físico). 
    Navegação de Retorno: Link dinâmico para o Mural do Intercessor pai.

Objetivo: A visualização individual e limpa, acessada via QR Code no santinho físico.

    Dados do Relato:
        Iniciais e Localidade do devoto.
        Texto do Testemunho (Tipografia Cardo, Marfim sobre fundo Vinho Profundo).
    Prova Material:
        Foto do Santinho: imagem real do produto físico entregue ao devoto, ou imagem da arte digital desenvolvida.
    Navegação de Retorno:
        Botão discreto em dourado: "Voltar para o Mural de [Nome do Intercessor]".

### Componentes Globais (Contrato Estético)
Elemento        Especificação Técnica
Fundo           Preto absoluto ou Vinho/Marrom profundo.
Destaques       Dourado (#D4AF37) em linhas finas ou bordas de botões.
Tipografia      Títulos em Cinzel (Dourado); Corpo em Cardo (Marfim).
Imagens         Todas em WebP com carregamento otimizado.
Rodapé          Contato (WhatsApp/E-mail) e assinatura institucional.

### Componentes Globais

    Header: Identidade visual MURAL DA FÉ em dourado.
    Footer: Mensagem de encerramento ("Sua história merece ser preservada..."), link de WhatsApp e assinatura "by Corpo Digital".


## Observações técnicas
- Cada relato/graça deve ter uma URL única e exclusiva para indexação do Google.
- Gerar dinamicamente um `sitemap.xml` que inclua todas as URLs relevantes (intercessores, comunidades, graças).

# Testes

## 1. Testes Unitários
- Verificar cada unidade de código (funções, métodos) para garantir que estejam funcionando conforme o esperado.
- Cobrir todos os módulos principais da aplicação.

## 2. Testes de Integração
- Garantir que diferentes componentes do sistema trabalhem juntos sem conflitos.
- Acompanhar a evolução das integrações entre serviços e APIs.

## 3. Segurança Básica
- Implementar proteções contra ataques comuns (SQL Injection, XSS).
- Validar entradas de dados na interface administrativa.
- Garantir que senhas sejam armazenadas em hash e rotas administativas estejam protegidas.

## 4. Testes de Usabilidade
- Avaliar a experiência do usuário após o MVP estar funcional.
- Foco inicial: navegação móvel e usabilidade na interface administrativa.

## 5. Testes de Desempenho
- Postergar para fases subsequentes, uma vez que o MVP é pequeno e a aplicação é leve.

---

**Prioridades Atuais:**
1. Implementar testes unitários.
2. Garantir segurança básica na interface administrativa.
3. Realizar testes de integração conforme os serviços forem se integrando.

## Notas de Implementação

* Terminologia: Fica vetado o uso de termos como "perpetuidade" ou "permanente" ou "eterno" no código e na copy do site, substituindo por "Registro de Memória Digital". Também não usamos o termo 'milagre' e sim 'Graça alcançada'.

* Segregação: A formalização de consentimento e a parte operacional de vendas permanecem fora do escopo do sistema do site.

## Standards de Projeto

### Formatação de Data
* **Padrão**: Todas as datas devem ser exibidas no formato brasileiro DD/MM/AAAA.
* **Implementação**: Utilizar `toLocaleDateString('pt-BR')` em todas as renderizações de data.
* **Escopo**: Aplica-se a:
  - Cards de graças
  - Modais
  - Páginas individuais de graças
  - Interface administrativa
* **Justificativa**: Consistência com o público brasileiro e conformidade com padrões locais.

### Layout Mobile-First
* **Dispositivo Base**: iPhone SE2 (375x667px)
* **Breakpoint**: Design responsivo com breakpoint em `md:` (768px) do Tailwind CSS.
* **Abordagem**:
  - Mobile: Card views com layout vertical empilhado
  - Desktop: Tabelas e layouts multi-coluna
* **Áreas Críticas**:
  - Dashboard administrativo
  - Listas de gerenciamento (Intercessores, Comunidades, Graças)
  - Navegação principal (menu hamburger no mobile)
* **Justificativa**: A maioria do tráfego virá de dispositivos móveis, conforme especificado nas Restrições.

## Restrições
 * O site vai rodar em um VPS simples com Debian 12. Precisa ser rápido e responsivo, visto que a maioria do tráfego virá de celulares.
 * Neste projeto, SEO é fundamental, pois as artes já produzidas serão as 'propagandas' que teremos para captar mais clientes.
