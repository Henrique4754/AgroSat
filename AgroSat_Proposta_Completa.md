# 🛰️ AgroSat — Proposta Completa
**Global Solution — FIAP 1TDS A/B/C/D/E — 1º Semestre 2026**

---

## 1. Contexto do Desafio

O desafio da Global Solution propõe o desenvolvimento de **uma plataforma web inovadora** que conecte o ecossistema espacial aos desafios reais da Terra, utilizando dados, infraestrutura orbital, inteligência artificial e tecnologias emergentes para promover sustentabilidade, eficiência, inclusão e qualidade de vida.

A entrega exige:
- Apresentação visual em PDF (slides)
- Vídeo pitch de até 3 minutos no YouTube (público)
- Protótipo visual da plataforma web
- Modelo lógico e físico de dados
- Demonstração do uso de Inteligência Artificial

---

## 2. Nome da Solução

> **AgroSat**
> *Monitoramento agrícola via satélite para pequenos e médios produtores do Brasil e América Latina*

---

## 3. O Problema

Pequenos e médios agricultores no Brasil e na América Latina sofrem perdas evitáveis todos os anos por três razões principais:

1. **Pragas não detectadas a tempo** — sem monitoramento contínuo, infestações se alastram antes de serem percebidas, causando prejuízos enormes.
2. **Irrigação ineficiente** — sem dados de umidade do solo e previsão climática integrados, produtores irrigam em excesso ou de menos, desperdiçando água e prejudicando a lavoura.
3. **Colheitas mal planejadas** — sem previsão do ponto ideal de maturação cruzado com janelas de clima favorável, produtores perdem o momento certo da colheita.

Os dados que poderiam resolver esses problemas já existem: satélites da NASA e da ESA coletam imagens da Terra continuamente e disponibilizam essas informações gratuitamente. O problema é que esses dados são **técnicos, fragmentados e completamente inacessíveis** para quem mais precisa deles.

> **O espaço já tem as respostas. O pequeno agricultor não consegue ouvi-las.**

---

## 4. A Solução — AgroSat

O AgroSat é uma **plataforma web** que transforma imagens de satélites públicos em alertas e recomendações práticas, em linguagem simples, acessíveis pelo celular ou computador.

O produtor:
1. Cadastra sua propriedade (localização e tipo de cultura)
2. Recebe análises automáticas baseadas em imagens de satélite atualizadas
3. É avisado sobre riscos, recomendações de irrigação e janela ideal de colheita
4. Pode tirar dúvidas com o assistente AgroBot

Tudo isso **sem precisar entender nada de satélite, sensoriamento remoto ou análise de dados**.

---

## 5. Público-Alvo

| Perfil | Descrição |
|---|---|
| Pequenos agricultores familiares | Produtores com até 4 módulos fiscais, acesso limitado a tecnologia e consultoria agrônoma |
| Médios produtores rurais | Produtores com lavouras entre 50 e 500 hectares, com algum acesso a tecnologia mas sem soluções integradas acessíveis |

**Recorte geográfico:** Brasil (com foco no Cerrado, Sul e regiões do Nordeste) e América Latina.

---

## 6. Fonte de Dados (gratuitos e públicos)

| Fonte | O que fornece |
|---|---|
| NASA Landsat (USGS EarthExplorer) | Imagens multiespectrais da superfície terrestre, base para cálculo de NDVI |
| ESA Sentinel-2 (Copernicus) | Imagens de alta resolução espacial (10m), ideal para monitoramento de lavouras |
| INPE / CPTEC | Dados climáticos brasileiros, previsão de chuvas e temperatura |
| NASA POWER | Dados de radiação solar e temperatura para análise agroclimática |

> Todos os dados satelitais são **públicos e gratuitos** — zero custo de aquisição de imagens.

---

## 7. Funcionalidades da Plataforma

### 7.1 Mapa da Propriedade
- Visualização georreferenciada da lavoura cadastrada
- Camada de índice **NDVI** (Normalized Difference Vegetation Index) colorida por faixas de saúde da vegetação
- Atualização automática a cada nova passagem de satélite (5 a 16 dias, dependendo do satélite)

### 7.2 Alerta de Pragas
- Detecção de anomalias no NDVI que indicam estresse vegetal atípico
- Classificação por nível de risco: baixo, médio e alto
- Notificação automática ao produtor com dias de antecedência

### 7.3 Recomendação de Irrigação
- Análise cruzada de umidade estimada do solo (derivada de imagens de satélite) com previsão de precipitação
- Recomendação em linguagem simples: "Irrigar hoje", "Aguardar 2 dias", "Chuva prevista — não irrigar"
- Estimativa de volume de água recomendado por hectare

### 7.4 Janela de Colheita
- Monitoramento da evolução do NDVI ao longo do ciclo da cultura para estimar maturação
- Cruzamento com previsão climática dos próximos 7 a 14 dias
- Recomendação da melhor janela de colheita com aviso de riscos climáticos

### 7.5 Alertas por WhatsApp / SMS
- Integração com canal de mensageria (WhatsApp Business API ou SMS)
- Avisos automáticos enviados diretamente ao produtor, sem necessidade de acessar a plataforma
- Mensagens curtas e em linguagem acessível

### 7.6 AgroBot — Assistente Inteligente
- Chatbot integrado à plataforma
- Responde perguntas sobre a lavoura em linguagem natural e simples
- Exemplos de perguntas atendidas:
  - "Minha plantação está com risco de praga?"
  - "Quando devo colher meu milho?"
  - "Preciso irrigar hoje?"
  - "Como interpretar o mapa de NDVI?"

---

## 8. Uso de Inteligência Artificial

A IA no AgroSat é **pontual e justificada** — não é o núcleo do produto, mas a camada de interpretação que transforma dados brutos em recomendações acessíveis. Isso mantém o custo operacional controlado.

| Aplicação de IA | Tipo | Custo |
|---|---|---|
| AgroBot — resposta a perguntas simples | NLP / LLM via API (ex: Claude API) | Baixo — chamadas pontuais |
| Detecção de anomalias no NDVI | Regras + threshold estatístico (não exige ML pesado) | Muito baixo |
| Previsão de risco cruzando clima + vegetação | Modelo de regressão ou árvore de decisão | Baixo |
| Sugestão da janela de colheita | Algoritmo baseado em curva histórica de NDVI + clima | Muito baixo |

> **Importante para a apresentação:** deixar claro que 90% das recomendações são baseadas em **algoritmos determinísticos e dados abertos**, com IA como camada de interface e interpretação — não como infraestrutura pesada.

---

## 9. Modelo de Dados

### 9.1 Entidades Principais

| Entidade | Descrição |
|---|---|
| `PRODUTOR` | Usuário da plataforma (agricultor) |
| `PROPRIEDADE` | Fazenda ou sítio cadastrado pelo produtor |
| `TALHAO` | Subdivisão da propriedade (gleba específica monitorada) |
| `CULTURA` | Tipo de cultura plantada (milho, soja, café, etc.) |
| `IMAGEM_SATELITE` | Registro de uma imagem de satélite processada para um talhão |
| `LEITURA_NDVI` | Valor de NDVI calculado a partir de uma imagem para um talhão |
| `ALERTA` | Notificação gerada automaticamente pela plataforma |
| `RECOMENDACAO` | Sugestão de ação gerada (irrigar, colher, monitorar praga) |
| `PREVISAO_CLIMA` | Dados meteorológicos e previsão integrados ao talhão |
| `INTERACAO_AGROBOT` | Histórico de conversas do produtor com o AgroBot |

### 9.2 Relacionamentos Principais

```
PRODUTOR (1) ----< (N) PROPRIEDADE
PROPRIEDADE (1) ----< (N) TALHAO
TALHAO (1) ----< (N) CULTURA
TALHAO (1) ----< (N) IMAGEM_SATELITE
IMAGEM_SATELITE (1) ----< (N) LEITURA_NDVI
TALHAO (1) ----< (N) ALERTA
TALHAO (1) ----< (N) RECOMENDACAO
TALHAO (1) ----< (N) PREVISAO_CLIMA
PRODUTOR (1) ----< (N) INTERACAO_AGROBOT
```

### 9.3 Atributos por Entidade (resumo)

**PRODUTOR**
- `id_produtor` (PK, NUMBER)
- `nome` (VARCHAR2 100)
- `cpf` (VARCHAR2 14, UNIQUE)
- `email` (VARCHAR2 100)
- `telefone` (VARCHAR2 20)
- `data_cadastro` (DATE)

**PROPRIEDADE**
- `id_propriedade` (PK, NUMBER)
- `id_produtor` (FK)
- `nome_propriedade` (VARCHAR2 100)
- `estado` (VARCHAR2 2)
- `municipio` (VARCHAR2 80)
- `area_total_ha` (NUMBER 10,2)
- `latitude_centroide` (NUMBER 10,6)
- `longitude_centroide` (NUMBER 10,6)

**TALHAO**
- `id_talhao` (PK, NUMBER)
- `id_propriedade` (FK)
- `nome_talhao` (VARCHAR2 80)
- `area_ha` (NUMBER 10,2)
- `geometria_wkt` (CLOB) — polígono em formato WKT
- `ativo` (CHAR 1)

**CULTURA**
- `id_cultura` (PK, NUMBER)
- `id_talhao` (FK)
- `tipo_cultura` (VARCHAR2 80) — ex: Milho, Soja, Café
- `data_plantio` (DATE)
- `data_prevista_colheita` (DATE)
- `fase_atual` (VARCHAR2 50)

**IMAGEM_SATELITE**
- `id_imagem` (PK, NUMBER)
- `id_talhao` (FK)
- `fonte_satelite` (VARCHAR2 30) — ex: Sentinel-2, Landsat-9
- `data_captura` (DATE)
- `resolucao_m` (NUMBER 5,1)
- `cobertura_nuvem_pct` (NUMBER 5,2)
- `url_imagem` (VARCHAR2 500)

**LEITURA_NDVI**
- `id_leitura` (PK, NUMBER)
- `id_imagem` (FK)
- `id_talhao` (FK)
- `data_leitura` (DATE)
- `ndvi_medio` (NUMBER 5,4)
- `ndvi_minimo` (NUMBER 5,4)
- `ndvi_maximo` (NUMBER 5,4)
- `area_estresse_pct` (NUMBER 5,2)

**ALERTA**
- `id_alerta` (PK, NUMBER)
- `id_talhao` (FK)
- `tipo_alerta` (VARCHAR2 50) — PRAGA, IRRIGACAO, CLIMA, COLHEITA
- `nivel_risco` (VARCHAR2 10) — BAIXO, MEDIO, ALTO
- `descricao` (VARCHAR2 500)
- `data_geracao` (DATE)
- `lido` (CHAR 1)
- `notificado_whatsapp` (CHAR 1)

**RECOMENDACAO**
- `id_recomendacao` (PK, NUMBER)
- `id_talhao` (FK)
- `id_alerta` (FK, nullable)
- `tipo` (VARCHAR2 50) — IRRIGAR, COLHER, MONITORAR, AGUARDAR
- `descricao_simples` (VARCHAR2 500)
- `data_recomendacao` (DATE)
- `data_validade` (DATE)
- `aceita` (CHAR 1)

**PREVISAO_CLIMA**
- `id_previsao` (PK, NUMBER)
- `id_talhao` (FK)
- `data_previsao` (DATE)
- `precipitacao_mm` (NUMBER 8,2)
- `temp_max_c` (NUMBER 5,2)
- `temp_min_c` (NUMBER 5,2)
- `umidade_solo_pct` (NUMBER 5,2)
- `risco_geada` (CHAR 1)

**INTERACAO_AGROBOT**
- `id_interacao` (PK, NUMBER)
- `id_produtor` (FK)
- `data_hora` (TIMESTAMP)
- `mensagem_usuario` (CLOB)
- `resposta_bot` (CLOB)
- `contexto_talhao` (NUMBER, FK nullable)

---

## 10. Diferenciais Competitivos

| Aspecto | AgroSat | Soluções existentes |
|---|---|---|
| Custo ao produtor | Gratuito (freemium) ou baixo custo | Caras, inacessíveis para pequenos |
| Dados satelitais | Públicos e gratuitos | Proprietários e pagos |
| Interface | Simples, em português, mobile-first | Técnica e complexa |
| Notificação | WhatsApp/SMS sem precisar abrir app | Exige acesso à plataforma |
| Foco | Pequenos e médios produtores | Grandes corporações do agronegócio |

---

## 11. Narrativa do Pitch (roteiro sugerido)

**Abertura (0:00 — 0:25)**
> "Todo ano, agricultores brasileiros perdem bilhões de reais em lavouras. Pragas que poderiam ser detectadas dias antes. Colheitas perdidas por chuva que era previsível. Água desperdiçada em irrigação desnecessária. O dado que evitaria tudo isso já existe — está a 700 km acima das nossas cabeças, em satélites que fotografam cada hectare do país. O problema é que esse dado nunca chegou até quem mais precisa."

**O problema (0:25 — 0:50)**
> "Pequenos e médios produtores não têm como interpretar imagens de satélite. As plataformas existentes são caras e técnicas demais. O resultado: tecnologia espacial de ponta ficando parada enquanto famílias perdem safras."

**A solução (0:50 — 1:40)**
> "Apresentamos o AgroSat. Uma plataforma web simples que transforma dados de satélites públicos da NASA e da ESA em alertas práticos: 'sua lavoura tem risco de praga', 'irrigue amanhã', 'colha entre quinta e sábado — chuva chega no domingo'. Tudo no celular, em português, sem precisar entender nada de tecnologia espacial."

**Funcionalidades (1:40 — 2:20)**
> Demonstração das telas: mapa com NDVI, painel de alertas, recomendação de irrigação, calendário de colheita, AgroBot.

**IA e inovação (2:20 — 2:45)**
> "O AgroBot responde dúvidas do produtor em linguagem natural. A plataforma usa inteligência artificial para cruzar dados de satélite com previsão climática e gerar recomendações automáticas — tudo com dados abertos e gratuitos."

**Fechamento (2:45 — 3:00)**
> "O espaço sempre foi a fronteira da humanidade. Com o AgroSat, essa fronteira chega pela primeira vez até o pequeno agricultor. Porque quem planta o nosso futuro merece as melhores ferramentas do mundo."

---

## 12. Estrutura de Slides Sugerida

| Slide | Conteúdo |
|---|---|
| 1 | Capa — Nome da solução, nomes e RMs dos integrantes |
| 2 | O problema — dados e impacto (perdas agrícolas evitáveis) |
| 3 | A solução — AgroSat em uma frase + diagrama de funcionamento |
| 4 | Como funciona — fluxo: satélite → dados → plataforma → produtor |
| 5 | Funcionalidades — mapa NDVI, alertas, irrigação, colheita, AgroBot |
| 6 | Protótipo — tela do dashboard / mapa da propriedade |
| 7 | Protótipo — tela de alertas e recomendações |
| 8 | Protótipo — tela do AgroBot |
| 9 | Uso de IA — como e onde a IA é aplicada |
| 10 | Modelo lógico de dados |
| 11 | Modelo físico de dados (DDL resumido) |
| 12 | Diferenciais e impacto esperado |
| 13 | Link do vídeo pitch no YouTube |

---

## 13. Critérios de Avaliação x AgroSat

| Critério | Peso | Por que o AgroSat pontua bem |
|---|---|---|
| Clareza e estrutura da solução | 20% | Problema real, solução direta, público bem definido |
| Qualidade da modelagem de dados | 20% | 10 entidades com relacionamentos, cardinalidades e tipos definidos |
| Usabilidade e protótipo | 20% | Telas simples, mobile-first, fluxo claro para o usuário |
| Qualidade do vídeo pitch | 30% | Narrativa emocional forte, demonstração de telas, IA justificada |
| Design da apresentação | 10% | Identidade visual coesa (verde/terra/espaço) |

---

## 14. Referências e Fontes

- NASA Landsat: https://www.nasa.gov
- ESA Copernicus / Sentinel: https://www.esa.int
- Disaster Charter: https://disasterscharter.org
- NASA POWER (dados agroclimáticos): https://power.larc.nasa.gov
- INPE / CPTEC: https://www.cptec.inpe.br

---

*Documento gerado como guia de desenvolvimento da Global Solution — AgroSat. Data: junho/2026.*
