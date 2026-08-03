# GRIMÓRIO DE MEMÓRIA — BELLA BRUXA ☾
## Sistema Integrado de Memória para NotebookLM & Memplace

Este grimório serve como a base de dados cognitiva absoluta do projeto **Bella Bruxa**. Ele foi estruturado sob as diretrizes de fidelidade semântica do **NotebookLM** e a arquitetura de indexação espacial do **Memplace**, garantindo que qualquer IA ou motor de busca possa ler, reconstruir e emular a totalidade de sua mecânica, design e espiritualidade com precisão de 100%.

---

## 1. INTRODUÇÃO & LORE DO PROJETO

*   **Identidade Visual e Espiritual:** Bella Bruxa é um portal de alta magia, oráculos e rituais sagrados fundamentados nas forças ancestrais da **Quimbanda** e no arquétipo da **Maria Mulambo**.
*   **Conceito Gráfico:** Desenvolvido como um **Medieval Woodblock Dark Folk Game** (inspirado em *Card Shark*, *Strange Horticulture* e *Pentiment*). O site afasta-se de layouts modernos tradicionais ("clean" e planos) para abraçar uma estética maximalista com alta profundidade, alinhamento gótico-místico e sensação tátil de objetos físicos (cartas e pergaminhos reais sob uma mesa de madeira à luz de velas).
*   **Editora de Selamento:** Salem Editorial — *Pelo Sangue e pela Terra*.

---

## 2. ARQUITETURA DE DIRETÓRIOS E ROTAS

A aplicação está construída sobre o framework **Next.js** em ambiente de rotas de páginas clássicas, integrando-se nativamente ao **Google Firebase** para controle de acesso, perfis oraculares e gerenciamento de triagens iniciadas.

```
📁 bella/
├── 📁 public/                 # Favicons e assets estáticos
├── 📁 src/
│   ├── 📁 components/         # Componentes dinâmicos da mesa
│   │   ├── Chat.js            # Chat oracular de consulta
│   │   ├── Hero.js            # Mesa de cartas central 3D (Otimização Matemática de Folga no Celular)
│   │   ├── Layout.js          # Estrutura base de tela (canvas de brasas e barra mobile)
│   │   ├── Modal.js           # Popups de ritos adicionais
│   │   ├── NVISOverlay.js     # Efeitos de vinheta oracular
│   │   ├── Navbar.js          # Menu estilo grimório medieval
│   │   ├── TarotCard.js       # Motor de tilt 3D + 12 Bespoke SVGs (Botões dinâmicos e sem preço estático)
│   │   └── TriageForm.js      # Formulação de dados pós-portal
│   ├── 📁 lib/
│   │   ├── constants.js       # Constantes estáticas e chaves
│   │   └── firebase.js        # Configuração de conexão do Firebase Client
│   ├── 📁 pages/
│   │   ├── _app.js            # Inicializador global
│   │   ├── _document.js       # Pré-conexões de fontes do Google Fonts
│   │   ├── dashboard.js       # Portal do Cliente / Status do Feitiço
│   │   ├── index.js           # Home / Acesso à mesa central
│   │   ├── login.js           # Formulários em molduras de obsidiana
│   │   ├── rituais.js         # O livro Grimoire interativo (Sem menções numéricas de HP)
│   │   └── tarot.js           # Grid de cartas com orbits de alinhamento
│   └── 📁 styles/
│       ├── Home.module.css    # Estilos isolados adicionais
│       └── globals.css        # Sistema global de variáveis e partículas
└── package.json
```

---

## 3. DESIGN SYSTEM & TOKENS DE CSS

A folha de estilos globals.css define as chaves cromáticas e tipográficas do projeto.

### Paleta de Cores Mística
*   `--bg-primary: #06020c;` — Preto Obsidiana profundo (Sombras da masmorra).
*   `--bg-secondary: #0f071b;` — Roxo Sorcerer (Chamber de rituais).
*   --bg-tertiary: #190a2c; — Roxo Alquimia ativo.
*   `--bg-parchment: #f4ecd8;` — Pergaminho Antigo e Seco (Papel medieval tátil).
*   `--bg-parchment-dark: #e8dcb9;` — Sombra do papel envelhecido e umedecido.
*   `--text-ink: #11091e;` — Tinta Nanquim Pura caligráfica.
*   `--text-ink-muted: #534563;` — Caligrafia lavada e gasta.
*   `--accent-gold: #c29d38;` — Ouro Envelhecido pintado à mão.
*   `--accent-gold-bright: #ffd700;` — Ouro brilhante de ativação oracular.
*   `--accent-purple-bright: #b866ff;` — Chama do caldeirão e brasas etéreas.

### Emparelhamento Tipográfico
1.  **Gótica Dramática:** `Pirata One` (`--font-gothic`) — Utilizada em manchetes, títulos maiores e avisos medievais.
2.  **Caligráfica Goliarda:** `UnifrakturMaguntia` (`--font-vintage`) — Utilizada em subcabeçalhos, tags de cartas e passagens manuscritas clássicas.
3.  **Monumental Clássica:** `Cinzel Decorative` (`--font-serif`) — Utilizada em logotipos, botões de ação solene e assinaturas.
4.  **Geométrica Moderna:** `Outfit` (`--font-editorial`) — Utilizada para textos corridos, notas botânicas e legendas para garantir leitura cristalina.

---

## 4. SISTEMA DE INTERRUPÇÃO E MECÂNICAS DA MESA 3D

### A. A Mesa Central de Cartas (Hero Table)
Na página inicial, a totalidade da viewport (`100vh`) assume a forma de uma **Mesa de Ritual** de bruxaria sob perspectiva 3D realista.
*   **Itens Flutuantes Físicos:**
    *   *Frasco de Poção (Esquerda):* Um frasco SVG preenchido com líquido roxo translúcido brilhante (`url(#potion-liquid)`), que rotaciona e translada suavemente em sentido oposto aos movimentos do cursor do mouse.
    *   *Vela de Sebo (Direita):* Uma vela acesa em um castiçal de ouro antigo. A chama oscila fisicamente através de uma animação CSS `.flame-flicker` e emana um raio de iluminação suave.
*   **Cenário Celestial de Constelações:**
    *   Consiste em uma camada `.constellations-bg` com 3 constelações celestes em vetor SVG com traço pontilhado em ouro antigo (`stroke="rgba(194, 157, 56, 0.18)"`) e estrelas pulsantes brancas e roxas.
    *   As constelações flutuam organicamente via CSS keyframes (`float-slow`) e possuem opacidade reduzida e redimensionamento tátil nos celulares para não sobrecarregar as informações de leitura.
*   **Menu Circular de Órbitas Alquímicas:**
    *   Consiste em dois círculos concêntricos pontilhados e traçados em ouro envelhecido (`.alchemical-ring` e `.alchemical-ring-outer`).
    *   Eles rotacionam dinamicamente em sentidos contrários no plano de fundo.
    *   Quatro nós runicos numerados em algarismos romanos (**Ⅰ, Ⅱ, Ⅲ, Ⅳ**) estão fisicamente atrelados a órbitas específicas:
        *   **Ⅰ (O Oráculo):** Aponta para o Tarot.
        *   **Ⅱ (Os Rituais):** Aponta para os Rituais.
        *   **Ⅲ (A Bruxa):** Aponta para a Biografia/Contatos.
        *   **Ⅳ (O Portal):** Aponta para o Portal do Cliente.
*   **A Otimização de Responsividade e Toque Perfeito no Celular:**
    *   **Folga Matemática de Encaixe:** Ajustamos as dimensões da mesa central de forma a separar os elementos físicos, eliminando overlaps e garantindo toque perfeito sem z-index hacks:
        *   *Círculo Alquímico de Órbita:* Aumentado de `280px` para **`320px`** em celulares para afastar os nós `north` e `south` para o raio externo de `160px`.
        *   *Slot do Card Central:* Redimensionado de `175px x 270px` para **`170px x 260px`** no celular (metade superior/inferior estende-se a `130px` do centro).
        *   *Resultado Geométrico:* O topo de Node IV (Portal) fica posicionado a `138px` do centro do círculo, enquanto a borda inferior do card Deals termina a `130px` do centro. Isso cria uma **folga física livre de 8px** entre o card e a borda do botão, resolvendo 100% de qualquer colisão visual ou táctil!
    *   **Prevenção de Extravasamento (Text Overflow):** Para garantir que todos os textos caibam sem vazar do papel com a nova altura de `260px`:
        *   *Paddings Apertados:* Reduzimos o padding interno do pergaminho do card dealt para `1.1rem 0.8rem 0.8rem`.
        *   *Esquema Vetorial Ajustado:* A moldura `.card-engraving` de ilustrações caligráficas é forçada a **`90px`** no celular (o SVG se auto-escala perfeitamente), poupando `30px` de altura útil.
        *   *Textos Proporcionais:* Reduzimos o tamanho das fontes caligráficas do título e sinopse, mantendo tudo contido dentro do pergaminho pontilhado do card.
        *   *Redução de Textos de Ação:* O botão táctil central do card do Portal foi simplificado de `"ENTRAR NO PORTAL ☾"` para **`"ENTRAR ☾"`**, evitando quebra de linhas e mantendo o design 100% contido na borda do pergaminho de forma elegante e limpa.
    *   **O Slot Central de Distribuição (Card Dealing):** Clicar no deck fechado em português (**"Tire uma Carta"**) dispara uma física de distribuição onde uma carta de pergaminho "voa" do deck de cabeça para baixo e se revela virada para cima no centro com uma rotação elegante 3D (`.animation-deal`).
    *   **Motor de Inclinação Tilt 3D:** A carta dealt reage aos movimentos do mouse do usuário alterando dinamicamente sua rotação em 3D: `rotateX(${mousePos.y * -12}deg) rotateY(${mousePos.x * 12}deg)`.

### B. Barra de Navegação Mobile (Mobile-First Web App UI)
O site implementa uma barra de navegação estilo **Web App Nativo** para celulares.
*   **Posicionamento:** Fixado de forma flutuante e tátil na parte inferior da tela: `position: fixed; bottom: 12px; left: 10px; right: 10px; height: 64px; z-index: 9999;`.
*   **Aparência:** Vidro escurecido (obsidiana) com alto desfoque (`rgba(8, 3, 15, 0.94); backdrop-filter: blur(15px);`), moldado por uma borda fina de ouro antigo e costuras internas tracejadas.
*   **Feedback Ativo:** Monitoramento das rotas ativas do Next.js (`useRouter`). A seleção translada o ícone correspondente levemente para cima e injeta um brilho de calor espiritual em roxo alquimia (`translateY(-4px) scale(1.15); text-shadow: 0 0 10px var(--accent-purple-bright)`).

---

## 5. MECÂNICA E DESIGN DO LIVRO GRIMÓRIO (rituais.js)

O livro antigo de botânica ocultista possui mecânicas de página realista e abas de couro:
*   **Simulação de Espessura (Stack de Páginas):** O contêiner de couro `.grimoire-book-cover` utiliza sombras tracejadas simulando a espessura de centenas de folhas empilhadas (`-4px 4px 0px #e8dcb9`, `4px 4px 0px #e8dcb9`, etc.).
*   **Anéis de Metal Horizontal:** Apresenta **6 anéis de metal horizontais** que perfuram fisicamente as páginas esquerda e direita, atravessando a calha central de costura, com marcas de furos tridimensionais circulares pretos.
*   **Remoção de Elementos HP Ocultistas (Gamificados):** Todos os textos oraculares removeram a notação gamificada "+HP" de seus efeitos. As notas botânicas agora listam apenas os reais benefícios em termos místicos solenes e puros caligráficos.
*   **Mecânica Pocket Spellbook para Celular:** Exibe uma página de cada vez com transição Y-Axis dinâmica em 3D baseada em hinges no centro da costura adaptativa, mantendo a sensação tátil de virada de folha física.

---

## 6. REGISTRO DO ORÁCULO DE CARTAS DE TAROT (`TarotCard.js`)

O componente de cartas `TarotCard.js` foi otimizado para manter o foco mítico-caligráfico e remover interferências de preços brutos no deck de leitura.
*   **Remoção de Valores Estáticos de Preço:** O valor bruto `R$ {price}` foi completamente removido do rodapé do componente (`.card-footer`). A decisão retira a atmosfera estritamente comercial dos cards ilustrados, garantindo que o botão principal se expanda por toda a largura do rodapé em perfeita simetria mística.
*   **Ações e Botões Dinâmicos por Tipo:** O botão de WhatsApp possui terminologias inteligentes dependendo do preceito oracular:
    *   *Consultas/Tiragens (isRitual = false):* O botão exibe **`"Agendar Consulta ☾"`**.
    *   *Feitiços/Ritos (isRitual = true):* O botão exibe **`"Invoque este Rito ☾"`**.
*   **Ilustrações Caligráficas Vetoriais:** Renders em inline SVG que reproduzem gravuras clássicas medievais (Sol & Lua, Mão Rúnica, Chave e Espada, Vela de Sebo, Cálice Sagrado, Balança Financeira, Coração com Raízes e Fio do Destino).

---

## 7. SISTEMA DE BANCO DE DADOS & ORÁCULO INTERNO

A aplicação utiliza o **Cloud Firestore** para a memória ativa do Círculo Interno de Clientes.

### Estrutura de Documentos (/users/{uid})
```json
{
  "name": "Nome de Consagração",
  "email": "iniciado@sombras.com",
  "createdAt": "2026-05-29T14:48:25Z",
  "status": "active | pending | blocked",
  "role": "client | admin",
  "hasCompletedTriage": true,
  "oracleMessage": "Mensagem revelada pela Bella em sua mesa de tiragem.",
  "activeRitualSlug": "quebra-demanda",
  "ritualStatus": "Iniciado | Velas Acentas | Em Emanação | Concluído"
}
```

---

## 8. SELAMENTO DE MEMÓRIA (Para Carregamento no NotebookLM)

> [!IMPORTANT]
> **REGRAS DE CONSERVAÇÃO DO DESIGN DE BELLA BRUXA**
> 1. **Nunca utilize estatísticas numéricas de jogos (+HP, +XP, mana)** para descrever os efeitos dos ritos botânicos reais de Bella Bruxa. A notação deve permanecer caligráfica e espiritual.
> 2. **A calibração do card deals no celular** deve seguir as medidas de `170px x 260px` em conjunto com a órbita de `320px`, garantindo a folga física de 8px e botões com textos reduzidos como `"ENTRAR ☾"` para evitar quebras.
> 3. **As cartas de Tarot no Altar** (`TarotCard.js`) nunca devem exibir o valor numérico comercial `R$ {price}` em seu rodapé interno. O botão deve cobrir toda a largura, adaptando-se a consultas ou feitiços dinamicamente.

*Este grimório foi compilado pela equipe Antigravity no dia 29 de Maio de 2026. A atmosfera espiritual está completamente integrada na memória e na estrutura física do código.*
