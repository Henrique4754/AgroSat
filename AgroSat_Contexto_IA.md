# CONTEXTO DO PROJETO — AGROSAT
> Este arquivo é uma janela de contexto para IA. Leia integralmente antes de responder qualquer solicitação relacionada a este projeto.

---

## IDENTIDADE DO PROJETO

- **Nome:** AgroSat
- **Tagline:** Monitoramento agrícola via satélite para pequenos e médios produtores do Brasil e América Latina
- **Tipo de entrega:** Plataforma web inovadora
- **Origem:** Global Solution FIAP — 1TDS A/B/C/D/E — 1º Semestre 2026
- **Prazo:** 09/06/2026
- **Formato de entrega:** PDF de apresentação (slides) + vídeo pitch YouTube (máx. 3 min)

---

## CONTEXTO DO DESAFIO (FIAP)

O tema é **Indústria Espacial**. O objetivo é criar uma plataforma web que conecte o ecossistema espacial a problemas reais da Terra, usando dados orbitais, IA e tecnologias emergentes. A solução deve gerar impacto positivo em sustentabilidade, eficiência, inclusão ou qualidade de vida.

---

## DECISÕES JÁ TOMADAS (não questionar)

| Decisão | Valor |
|---|---|
| Tema escolhido | Monitoramento agrícola com dados de satélite |
| Público-alvo | Pequenos agricultores familiares + médios produtores rurais |
| Recorte geográfico | Brasil (Cerrado, Sul, Nordeste) + América Latina |
| Problemas que resolve | Pragas, irrigação ineficiente, janela de colheita |
| Uso de IA | Pontual e de baixo custo (não é o núcleo do produto) |
| Dados satelitais | Públicos e gratuitos (NASA Landsat, ESA Sentinel-2) |
| Tamanho do grupo | 4-5 pessoas, habilidades em tech, design, dados e negócios |

---

## O PROBLEMA

Pequenos e médios agricultores no Brasil e América Latina perdem safras por:
1. Pragas detectadas tarde demais
2. Irrigação ineficiente (excesso ou falta)
3. Colheitas mal planejadas (clima + maturação)

Dados de satélite que resolveriam esses problemas existem e são gratuitos, mas são técnicos e inacessíveis ao produtor comum.

---

## A SOLUÇÃO

Plataforma web que transforma imagens de satélites públicos (NASA Landsat, ESA Sentinel-2) em alertas e recomendações práticas, em linguagem simples, acessíveis por celular ou computador. O produtor cadastra a propriedade e recebe automaticamente avisos sobre saúde da lavoura, irrigação e colheita — sem precisar entender sensoriamento remoto.

---

## FUNCIONALIDADES (6 no total)

| # | Nome | Descrição resumida |
|---|---|---|
| 1 | Mapa da propriedade | Visualização da lavoura com índice NDVI por faixas de saúde da vegetação |
| 2 | Alerta de pragas | Detecta anomalias no NDVI com antecedência, classifica risco (baixo/médio/alto) |
| 3 | Recomendação de irrigação | Cruza umidade do solo + previsão de chuva → recomendação simples |
| 4 | Janela de colheita | Monitora maturação via NDVI + previsão climática → melhor data para colher |
| 5 | Alertas por WhatsApp/SMS | Notificações automáticas sem necessidade de abrir a plataforma |
| 6 | AgroBot | Chatbot que responde perguntas sobre a lavoura em linguagem natural |

---

## FONTES DE DADOS (todas gratuitas e públicas)

| Fonte | Uso |
|---|---|
| NASA Landsat (USGS EarthExplorer) | Imagens multiespectrais para NDVI |
| ESA Sentinel-2 (Copernicus) | Imagens alta resolução (10m) para monitoramento |
| INPE / CPTEC | Dados climáticos e previsão de chuvas brasileiros |
| NASA POWER | Dados agroclimáticos (radiação, temperatura) |

---

## USO DE IA (pontual, baixo custo)

| Aplicação | Tecnologia | Custo |
|---|---|---|
| AgroBot (perguntas do produtor) | NLP / LLM via API | Baixo — chamadas pontuais |
| Detecção de anomalias NDVI | Threshold estatístico | Muito baixo |
| Previsão de risco (clima + vegetação) | Regressão / árvore de decisão | Baixo |
| Sugestão de janela de colheita | Curva histórica NDVI + clima | Muito baixo |

> **Regra de ouro:** 90% das recomendações são algoritmos determinísticos. IA só entra como camada de interface (AgroBot) e interpretação de padrões. Isso mantém o custo operacional viável.

---

## MODELO DE DADOS — ENTIDADES E ATRIBUTOS

### PRODUTOR
```sql
id_produtor     NUMBER          PK
nome            VARCHAR2(100)
cpf             VARCHAR2(14)    UNIQUE
email           VARCHAR2(100)
telefone        VARCHAR2(20)
data_cadastro   DATE
```

### PROPRIEDADE
```sql
id_propriedade      NUMBER          PK
id_produtor         NUMBER          FK → PRODUTOR
nome_propriedade    VARCHAR2(100)
estado              VARCHAR2(2)
municipio           VARCHAR2(80)
area_total_ha       NUMBER(10,2)
latitude_centroide  NUMBER(10,6)
longitude_centroide NUMBER(10,6)
```

### TALHAO
```sql
id_talhao       NUMBER          PK
id_propriedade  NUMBER          FK → PROPRIEDADE
nome_talhao     VARCHAR2(80)
area_ha         NUMBER(10,2)
geometria_wkt   CLOB
ativo           CHAR(1)
```

### CULTURA
```sql
id_cultura              NUMBER          PK
id_talhao               NUMBER          FK → TALHAO
tipo_cultura            VARCHAR2(80)
data_plantio            DATE
data_prevista_colheita  DATE
fase_atual              VARCHAR2(50)
```

### IMAGEM_SATELITE
```sql
id_imagem           NUMBER          PK
id_talhao           NUMBER          FK → TALHAO
fonte_satelite      VARCHAR2(30)
data_captura        DATE
resolucao_m         NUMBER(5,1)
cobertura_nuvem_pct NUMBER(5,2)
url_imagem          VARCHAR2(500)
```

### LEITURA_NDVI
```sql
id_leitura          NUMBER          PK
id_imagem           NUMBER          FK → IMAGEM_SATELITE
id_talhao           NUMBER          FK → TALHAO
data_leitura        DATE
ndvi_medio          NUMBER(5,4)
ndvi_minimo         NUMBER(5,4)
ndvi_maximo         NUMBER(5,4)
area_estresse_pct   NUMBER(5,2)
```

### ALERTA
```sql
id_alerta               NUMBER          PK
id_talhao               NUMBER          FK → TALHAO
tipo_alerta             VARCHAR2(50)    -- PRAGA | IRRIGACAO | CLIMA | COLHEITA
nivel_risco             VARCHAR2(10)    -- BAIXO | MEDIO | ALTO
descricao               VARCHAR2(500)
data_geracao            DATE
lido                    CHAR(1)
notificado_whatsapp     CHAR(1)
```

### RECOMENDACAO
```sql
id_recomendacao     NUMBER          PK
id_talhao           NUMBER          FK → TALHAO
id_alerta           NUMBER          FK → ALERTA (nullable)
tipo                VARCHAR2(50)    -- IRRIGAR | COLHER | MONITORAR | AGUARDAR
descricao_simples   VARCHAR2(500)
data_recomendacao   DATE
data_validade       DATE
aceita              CHAR(1)
```

### PREVISAO_CLIMA
```sql
id_previsao         NUMBER          PK
id_talhao           NUMBER          FK → TALHAO
data_previsao       DATE
precipitacao_mm     NUMBER(8,2)
temp_max_c          NUMBER(5,2)
temp_min_c          NUMBER(5,2)
umidade_solo_pct    NUMBER(5,2)
risco_geada         CHAR(1)
```

### INTERACAO_AGROBOT
```sql
id_interacao        NUMBER          PK
id_produtor         NUMBER          FK → PRODUTOR
data_hora           TIMESTAMP
mensagem_usuario    CLOB
resposta_bot        CLOB
contexto_talhao     NUMBER          FK → TALHAO (nullable)
```

---

## RELACIONAMENTOS

```
PRODUTOR (1) ----< (N) PROPRIEDADE
PROPRIEDADE (1) ----< (N) TALHAO
TALHAO (1) ----< (N) CULTURA
TALHAO (1) ----< (N) IMAGEM_SATELITE
IMAGEM_SATELITE (1) ----< (N) LEITURA_NDVI
TALHAO (1) ----< (N) LEITURA_NDVI
TALHAO (1) ----< (N) ALERTA
TALHAO (1) ----< (N) RECOMENDACAO
ALERTA (1) ----< (N) RECOMENDACAO
TALHAO (1) ----< (N) PREVISAO_CLIMA
PRODUTOR (1) ----< (N) INTERACAO_AGROBOT
TALHAO (1) ----< (N) INTERACAO_AGROBOT
```

---

## ESTRUTURA DA APRESENTAÇÃO (13 slides)

| Slide | Conteúdo |
|---|---|
| 1 | Capa — nome da solução + nomes e RMs dos integrantes |
| 2 | O problema — perdas agrícolas evitáveis, dados que não chegam ao produtor |
| 3 | A solução — AgroSat em uma frase + diagrama de funcionamento |
| 4 | Como funciona — fluxo: satélite → dados → plataforma → produtor |
| 5 | Funcionalidades — visão geral das 6 funcionalidades |
| 6 | Protótipo — tela do dashboard / mapa da propriedade (NDVI) |
| 7 | Protótipo — tela de alertas e recomendações |
| 8 | Protótipo — tela do AgroBot |
| 9 | Uso de IA — onde e como a IA é aplicada, com justificativa de custo |
| 10 | Modelo lógico de dados |
| 11 | Modelo físico de dados (DDL resumido) |
| 12 | Diferenciais e impacto esperado |
| 13 | Link do vídeo pitch no YouTube |

---

## ROTEIRO DO PITCH (3 minutos)

| Trecho | Tempo | Conteúdo |
|---|---|---|
| Abertura | 0:00–0:25 | Problema emocional: agricultores perdendo safras com dados disponíveis no espaço |
| Problema | 0:25–0:50 | Dados satelitais existem mas são inacessíveis ao pequeno produtor |
| Solução | 0:50–1:40 | AgroSat transforma dados da NASA/ESA em alertas simples no celular |
| Demo telas | 1:40–2:20 | Mostrar mapa NDVI, alertas, recomendação de irrigação, AgroBot |
| IA e inovação | 2:20–2:45 | AgroBot + cruzamento de dados satelitais com clima |
| Fechamento | 2:45–3:00 | "O espaço chegando até o agricultor familiar" |

---

## CRITÉRIOS DE AVALIAÇÃO (FIAP)

| Critério | Peso |
|---|---|
| Clareza e estrutura da solução proposta | 20% |
| Qualidade da modelagem de dados | 20% |
| Usabilidade e protótipo visual | 20% |
| Qualidade e objetividade do vídeo pitch | 30% |
| Design e organização da apresentação | 10% |

---

## REGRAS DE ENTREGA (FIAP)

- Entrega **exclusivamente pela plataforma**, sem atraso
- Arquivo: **PDF único** contendo todo o conteúdo
- Vídeo: **YouTube público**, link no último slide
- Sem links externos além do link do pitch
- Apresentação em formato visual (slides), não texto corrido
- Pelo menos um integrante deve aparecer ou narrar o vídeo
- Máximo 5 alunos por equipe, todos da mesma turma

---

## O QUE AINDA PRECISA SER FEITO

- [ ] Protótipo visual das telas (dashboard, alertas, AgroBot)
- [ ] Modelo lógico de dados (diagrama ER)
- [ ] Modelo físico de dados (DDL completo em SQL)
- [ ] Slides da apresentação (Canva / PowerPoint / Google Slides)
- [ ] Gravação e publicação do vídeo pitch no YouTube
- [ ] Exportação da apresentação em PDF

---

## INSTRUÇÕES PARA A IA QUE LER ESTE ARQUIVO

1. **Não questione decisões já tomadas** — tema, público, funcionalidades e modelo de dados estão definidos.
2. **Mantenha consistência de nomenclatura** — use sempre "AgroSat" (com S maiúsculo), "AgroBot", "NDVI", "talhão/talhões".
3. **Ao gerar código SQL**, use sintaxe Oracle (NUMBER, VARCHAR2, CHAR, CLOB, TIMESTAMP).
4. **Ao gerar protótipos visuais**, respeite a identidade: tons de verde (campo), azul escuro (espaço/noite) e âmbar (alerta/colheita).
5. **Ao gerar texto para slides**, seja objetivo — máximo 5 linhas por slide, sem parágrafos longos.
6. **Ao gerar o script do pitch**, respeite os tempos definidos e a narrativa emocional do fechamento.
7. **Não sugerir novas funcionalidades** sem solicitação explícita — o escopo está fechado.
8. **Custo de IA é uma restrição** — qualquer sugestão que envolva IA deve ser pontual, justificada e de baixo custo operacional.
