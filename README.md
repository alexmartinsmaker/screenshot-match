# BoraDarAula

## O problema
Professores costumam enviar o mesmo currículo para vagas muito diferentes. O BoraDarAula ajuda a comparar o currículo com uma vaga docente e a preparar uma versão mais alinhada a ela — **sem inventar informações**.

## Público
Professoras e professores de qualquer etapa de ensino que buscam uma nova vaga.

## Como funciona (fluxo)
1. Cole o texto da vaga no campo **Descrição da vaga**.
2. Cole o texto do currículo no campo **Currículo** (não há upload de arquivo).
3. Clique em **Analisar compatibilidade**. Se algum campo estiver vazio, uma mensagem indica qual preencher, e o texto digitado é mantido.
4. Os resultados aparecem abaixo: percentual estimado, palavras-chave encontradas, palavras-chave não mencionadas e o currículo organizado, que pode ser baixado em PDF.

## Como a estimativa é calculada
- Os textos são normalizados (minúsculas, sem acentos).
- Palavras muito comuns (artigos, preposições etc.) são ignoradas.
- **Termos administrativos e localidades não entram no cálculo**: remuneração, entrevista, jornada, horário, benefícios, processo seletivo, cidades e estados etc. não são requisitos nem competências.
- Expressões relevantes, como “Educação Infantil” ou “Ensino Médio”, são reconhecidas como uma única palavra-chave.
- **Equivalências explícitas** são consideradas: por exemplo, “Ciências Biológicas” conta como formação relacionada a “Biologia”, e “práticas de laboratório” conta como redação relacionada a “aulas práticas”. São relações pontuais declaradas no código — não significa que os termos sejam idênticos em todos os contextos.
- **Compatibilidade = palavras-chave relevantes da vaga presentes no currículo ÷ total de palavras-chave relevantes da vaga.**

O percentual é uma estimativa automática, não uma avaliação profissional nem garantia de aprovação.

## Limitações
A comparação por palavras-chave não reconhece sinônimos além das equivalências declaradas (ex.: “docente” × “professor”) e não compreende o contexto em que as palavras aparecem.

## Itens não mencionados
As palavras-chave da vaga que não aparecem no currículo são apresentadas como **“não mencionadas”** — pontos a confirmar, e não afirmações sobre a experiência da pessoa. Elas nunca são acrescentadas ao currículo.

## Regra de não inventar informações
O currículo organizado usa somente o texto original: o primeiro bloco (geralmente dados pessoais) permanece no topo, o resumo/objetivo profissional (se existir) vem logo em seguida, e as demais seções — separadas por linhas em branco — são reordenadas pela relevância para a vaga. Nenhuma experiência, curso, resultado ou dado é criado ou alterado.

## PDF
- O PDF é gerado no navegador e contém todo o currículo organizado.
- **Paginação por seções**: um bloco (título, datas e texto de uma experiência, por exemplo) não é dividido entre páginas, a menos que seja maior que uma página inteira.
- Se a última página ficaria quase vazia, o espaçamento é compactado automaticamente para equilibrar o documento — sem remover conteúdo.
- Acentos do português são preservados; símbolos sem suporte na fonte (como “•” e travessão) são substituídos por equivalentes.

## Nova análise
O botão **Enviar novo currículo** limpa os campos da vaga e do currículo e remove os resultados anteriores.

## Outras informações
- Interface responsiva (celular e computador).
- Não utiliza serviços externos de IA: toda a análise acontece no navegador, com regras e equivalências declaradas no código.

## Mega prompt e mudanças
> Esta seção pode ser completada após a implementação.

### Mega prompt usado
_(cole aqui o prompt original)_

### Mudanças feitas durante o desenvolvimento
- Revisão da análise de compatibilidade: termos administrativos e localidades deixaram de contar como requisitos; equivalências explícitas passaram a ser reconhecidas (ex.: “Ciências Biológicas” ↔ “Biologia”, “práticas de laboratório” ↔ “aulas práticas”).
- Itens ausentes passaram a ser exibidos como “não mencionadas no currículo” (pontos a confirmar), sem afirmar nada sobre a experiência da pessoa.
- O currículo organizado passou a destacar o resumo profissional logo após os dados pessoais.
- Paginação do PDF corrigida: seções não são mais divididas entre páginas e a última página não fica quase vazia.

## Endereço publicado
_(adicione aqui o link do app publicado)_

## Exemplo de uso
_(opcional: adicione um exemplo de vaga e de currículo)_
