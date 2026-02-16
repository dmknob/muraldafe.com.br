# Project Standards Template

> **Propósito**: Este documento serve como template para padrões técnicos e de design reutilizáveis entre projetos da Corpo Digital. Os padrões aqui definidos podem ser referenciados e adaptados em projetos específicos.

---

## 1. Internacionalização e Localização

### 1.1 Formatação de Data
**Padrão Brasileiro (pt-BR)**
- **Formato**: DD/MM/AAAA
- **Implementação JavaScript**: `toLocaleDateString('pt-BR')`
- **Exemplos**:
  ```javascript
  // ✅ Correto
  new Date(data).toLocaleDateString('pt-BR')
  // Resultado: 16/02/2026
  
  // ❌ Incorreto
  new Date(data).toLocaleDateString()
  // Resultado: 2/16/2026 (formato US)
  ```
- **Aplicação**: Cards, modais, tabelas, relatórios, interface administrativa

### 1.2 Formatação de Moeda
**Padrão Brasileiro (pt-BR)**
- **Implementação**: `toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })`
- **Resultado**: R$ 1.234,56

### 1.3 Formatação de Números
**Padrão Brasileiro (pt-BR)**
- **Separador Decimal**: vírgula (,)
- **Separador de Milhares**: ponto (.)
- **Implementação**: `toLocaleString('pt-BR')`

---

## 2. Design Responsivo

### 2.1 Mobile-First Approach
**Dispositivo Base**: iPhone SE2 (375x667px)

**Princípios**:
- Projetar primeiro para 375px de largura
- Expandir progressivamente para telas maiores
- Usar Tailwind CSS breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

**Breakpoints Padrão (Tailwind CSS)**:
```css
sm: 640px   // Phones em landscape
md: 768px   // Tablets
lg: 1024px  // Laptops
xl: 1280px  // Desktops
2xl: 1536px // Large desktops
```

**Estratégias Comuns**:
1. **Tabelas → Cards**: Em mobile, substituir tabelas por cards verticais
   ```html
   <!-- Desktop: Table -->
   <div class="hidden md:block">
     <table>...</table>
   </div>
   
   <!-- Mobile: Cards -->
   <div class="md:hidden space-y-4">
     <div class="card">...</div>
   </div>
   ```

2. **Navegação**: Hamburger menu para mobile, navbar horizontal para desktop
3. **Botões**: Full-width em mobile (`w-full sm:w-auto`)
4. **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### 2.2 Touch Targets
- **Mínimo**: 44x44px (recomendação Apple/Google)
- **Padding em botões mobile**: `py-2.5 px-4` (mínimo)
- **Espaçamento entre elementos clicáveis**: 8px mínimo

### 2.3 Typography Responsivo
```html
<!-- Headings -->
<h1 class="text-2xl md:text-4xl">
<h2 class="text-xl md:text-3xl">

<!-- Body -->
<p class="text-sm md:text-base">
```

---

## 3. Acessibilidade (A11y)

### 3.1 Contraste
- **WCAG AA**: Mínimo 4.5:1 para texto normal
- **WCAG AA**: Mínimo 3:1 para texto grande (>18px)
- **Ferramenta**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 3.2 Navegação por Teclado
- Todos os elementos interativos devem ser acessíveis via Tab
- Ordem de tabulação lógica
- Focus states visíveis: `focus:ring-2 focus:ring-offset-2`

### 3.3 ARIA Labels
```html
<button aria-label="Fechar modal">×</button>
<input aria-label="Buscar graças" placeholder="Buscar...">
```

---

## 4. Performance

### 4.1 Imagens
- **Formato**: WebP (fallback: JPG/PNG)
- **Lazy Loading**: `loading="lazy"` para imagens fora da viewport inicial
- **Compressão**: Quality 50 a 80% para WebP
- **Srcset**: Fornecer múltiplas resoluções para responsividade

### 4.2 Fontes
- **Font Display**: `font-display: swap` para evitar FOIT
- **Preload**: Fontes críticas devem usar `<link rel="preload">`
- **Subsets**: Carregar apenas caracteres necessários (Latin, Latin-ext)

### 4.3 CSS e JS
- **Minificação**: Sempre em produção
- **Critical CSS**: Inline CSS crítico no `<head>`
- **Defer/Async**: Scripts não-críticos devem usar `defer` ou `async`

---

## 5. SEO

### 5.1 Meta Tags Essenciais
```html
<title>Título da Página | Nome do Site</title>
<meta name="description" content="Descrição concisa (150-160 caracteres)">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Open Graph -->
<meta property="og:title" content="Título">
<meta property="og:description" content="Descrição">
<meta property="og:image" content="URL da imagem">
<meta property="og:url" content="URL canônica">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
```

### 5.2 Estrutura Semântica
- Usar tags HTML5 semânticas: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- Hierarquia de headings: Um único `<h1>` por página, `<h2>` para seções principais
- `<img>` com `alt` descritivo

### 5.3 URLs
- **Padrão**: Kebab-case, minúsculas, sem caracteres especiais
- **Estrutura clara**: `/categoria/subcategoria/item`
- **Permanência**: URLs não devem mudar (especialmente se impressas em materiais físicos)

---

## 6. Segurança

### 6.1 Autenticação
- **Senhas**: Sempre hash com bcrypt (salt rounds: 10-12)
- **Sessões**: HTTP-only cookies, secure flag em produção
- **CSRF**: Tokens em formulários críticos

### 6.2 Validação de Input
- **Client-side**: HTML5 validation + JavaScript
- **Server-side**: Sempre validar no backend (nunca confiar no client)
- **Sanitização**: Escapar output para prevenir XSS

### 6.3 Headers de Segurança
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 7. Git e Versionamento

### 7.1 Commits
**Formato**: `tipo(escopo): mensagem`

**Tipos**:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta lógica)
- `refactor`: Refatoração de código
- `test`: Testes
- `chore`: Tarefas de manutenção

**Exemplos**:
```
feat(auth): adiciona autenticação JWT
fix(admin): corrige formatação de data em cards
docs(readme): atualiza instruções de instalação
```

### 7.2 Branches
- `main`: Produção
- `develop`: Desenvolvimento ativo
- `feature/nome-da-feature`: Novas funcionalidades
- `fix/nome-do-bug`: Correções

---

## 8. Nomenclatura

### 8.1 Arquivos e Pastas
- **Kebab-case**: `nome-do-arquivo.js`
- **Componentes React/Vue**: PascalCase `NomeDoComponente.jsx`
- **Pastas**: Minúsculas, plural quando aplicável (`controllers/`, `models/`, `views/`)

### 8.2 Variáveis e Funções (JavaScript)
- **camelCase**: `nomeVariavel`, `minhaFuncao()`
- **Constantes**: `SNAKE_CASE_MAIUSCULA`
- **Classes**: `PascalCase`
- **Privadas**: Prefixo `_` (convenção): `_metodoPrivado()`

### 8.3 CSS
- **Tailwind**: Usar classes utilitárias sempre que possível
- **Custom CSS**: BEM notation quando necessário
  ```css
  .block-name__element-name--modifier-name
  ```

---

## 9. Banco de Dados

### 9.1 Nomenclatura de Tabelas
- **Minúsculas**, **plural**: `users`, `posts`, `comments`
- **Snake_case** para nomes compostos: `user_profiles`

### 9.2 Nomenclatura de Colunas
- **Snake_case**: `created_at`, `user_id`, `full_name`
- **Chaves estrangeiras**: `{tabela_singular}_id` (ex: `user_id`)
- **Timestamps**: `created_at`, `updated_at`
- **Soft deletes**: `deleted_at`

### 9.3 Status e Enums
- Usar strings descritivas ao invés de números: `'publicado'`, `'rascunho'` (melhor que `1`, `2`)

---

## 10. Testes

### 10.1 Estrutura de Testes
```javascript
describe('Feature/Module', () => {
  describe('funcao()', () => {
    it('deve fazer X quando Y', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 10.2 Nomenclatura
- **Inglês**: Nome dos testes em inglês
- **Padrão**: "should [comportamento esperado] when [condição]"
- Exemplo: `should return 404 when grace not found`

### 10.3 Cobertura
- **Mínimo**: 70% de code coverage
- **Foco**: Lógica de negócio, helpers, utilidades críticas

---

## Como Usar Este Template

1. **Para novos projetos**: Copie as seções relevantes para o `docs/specs.md` do projeto
2. **Adaptação**: Ajuste os padrões conforme necessidades específicas do projeto
3. **Referência**: Link de volta para este documento quando aplicável
4. **Evolução**: Contribua com novos padrões baseados em aprendizados de projetos

---

**Última Atualização**: 2026-02-16
**Mantido por**: Corpo Digital
