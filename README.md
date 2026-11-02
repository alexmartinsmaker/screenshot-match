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
O app normaliza os textos para comparar palavras sem diferenciar maiúsculas, minúsculas ou acentos. Também aplica regras para ignorar palavras comuns e reconhecer algumas expressões e equivalências declaradas no código.

A análise ainda pode incluir palavras irrelevantes ou deixar de reconhecer termos relacionados. No teste realizado, por exemplo, apareceram fragmentos de nomes de localidades e termos administrativos entre os itens não mencionados. Por isso, as palavras encontradas, as não mencionadas e o percentual devem ser interpretados como uma estimativa automática e revisados pela pessoa usuária.

O percentual é calculado com base na proporção de palavras-chave identificadas na vaga que também são reconhecidas no currículo. Não é uma avaliação profissional nem uma garantia de aprovação.


## Limitações
A comparação é baseada em regras e palavras-chave; não compreende plenamente o contexto e reconhece apenas as equivalências previstas no código. Pode apontar termos irrelevantes ou não identificar conceitos expressos de outra forma. Os itens apresentados como “não mencionados” são pontos a confirmar, não afirmações sobre a experiência da pessoa.


## Itens não mencionados
As palavras-chave da vaga que não aparecem no currículo são apresentadas como **“não mencionadas”** — pontos a confirmar, e não afirmações sobre a experiência da pessoa. Elas nunca são acrescentadas ao currículo.

## Regra de não inventar informações
O currículo organizado usa somente o texto original: o primeiro bloco (geralmente dados pessoais) permanece no topo, o resumo/objetivo profissional (se existir) vem logo em seguida, e as demais seções — separadas por linhas em branco — são reordenadas pela relevância para a vaga. Nenhuma experiência, curso, resultado ou dado é criado ou alterado.

## PDF
O currículo organizado pode ser baixado em PDF.
Confira o arquivo após baixá-lo para verificar a paginação e a apresentação do conteúdo. 
A organização pode distribuir as seções entre páginas, e a última página pode ficar com pouco conteúdo.

## Nova análise
O botão **Enviar novo currículo** limpa os campos da vaga e do currículo e remove os resultados anteriores.

## Outras informações
- Interface responsiva (celular e computador).
- Não utiliza serviços externos de IA: toda a análise acontece no navegador, com regras e equivalências declaradas no código.

## Mega prompt e mudanças
> Esta seção pode ser completada após a implementação.

## Mega prompt e mudanças

### Mega prompt usado

```text
Crie uma aplicação web responsiva chamada BoraDarAula, voltada a professores que desejam comparar seu currículo com uma vaga docente e preparar uma versão do currículo mais alinhada à vaga, sem inventar informações.

OBJETIVO E ESCOPO
O app deve ser um protótipo funcional de uma única tela, sem login e sem integração com serviços externos de inteligência artificial. A comparação e a organização do currículo devem acontecer localmente no navegador, sem enviar os textos a uma API.

VISUAL E RESPONSIVIDADE
Use uma identidade visual acolhedora, escolar, leve e profissional. A cor principal deve ser terracota, com verde, preto e branco como cores de apoio. Garanta que a interface funcione bem tanto em celulares quanto em computadores: textos legíveis, campos e botões confortáveis para toque, layout adaptável e sem rolagem horizontal.

TELA PRINCIPAL
Exiba a frase principal: “Ajuste seu currículo para a vaga que você sonha”.

Inclua dois campos de texto grandes e identificados claramente:
1. “Descrição da vaga”, para a pessoa colar o texto da vaga docente.
2. “Currículo”, para a pessoa colar o texto do currículo. Não inclua opção de upload de arquivo.

Inclua o botão “Analisar compatibilidade”. A análise só pode começar quando os dois campos estiverem preenchidos. Se um ou ambos estiverem vazios, mostre uma mensagem clara dizendo qual campo precisa ser preenchido. Não apague o conteúdo digitado quando houver erro de validação.

ANÁLISE
Faça a comparação localmente por palavras-chave, sem usar IA externa ou serviços pagos. Normalize maiúsculas e minúsculas e remova diferenças de acentuação. Ignore palavras muito comuns e reconheça expressões relevantes como “Educação Infantil” como uma expressão única, em vez de tratá-la apenas como palavras separadas.

Estime a compatibilidade pela proporção de palavras-chave relevantes identificadas na descrição da vaga que também aparecem no currículo. Mostre o percentual como uma estimativa, não como uma avaliação profissional ou garantia de aprovação. Explique na interface que uma comparação por palavras-chave pode não reconhecer sinônimos nem compreender adequadamente o contexto.

RESULTADOS
Depois da análise, mostre os resultados na mesma tela, abaixo dos campos:
- percentual estimado de compatibilidade;
- palavras-chave da vaga encontradas no currículo;
- requisitos ou palavras-chave importantes da vaga que não foram encontrados;
- uma versão do currículo organizada para destacar primeiro as informações mais relevantes para aquela vaga.

A versão organizada do currículo deve usar somente informações já presentes no texto original. Preserve os dados e as seções existentes e não invente experiências, qualificações, cursos, resultados, dados pessoais ou qualquer outro conteúdo. Como não será usada IA, prefira reorganizar seções ou trechos existentes, mantendo o texto original sempre que necessário, em vez de criar reformulações que possam alterar seu sentido. Apresente os requisitos ausentes separadamente; nunca os acrescente ao currículo.

Inclua uma opção para baixar a versão organizada do currículo em PDF. O arquivo deve conter o texto do currículo organizado e ter uma apresentação simples e legível.

NOVA ANÁLISE
Inclua o botão “Enviar novo currículo”. Ao acioná-lo, limpe os campos da vaga e do currículo e remova os resultados anteriores para permitir começar uma nova análise.

README
Crie ou atualize o README.md do projeto em português. Explique o problema que o BoraDarAula busca resolver, seu público, o funcionamento e o fluxo da análise, como a estimativa é calculada, as limitações da comparação por palavras-chave, a regra de não inventar informações e o comportamento do botão para iniciar uma nova análise. Registre também que a interface é responsiva e que não utiliza serviços externos de IA.

Inclua no README uma seção para documentar o mega prompt usado e as mudanças feitas nele durante o desenvolvimento, deixando claro que esses registros podem ser completados após a implementação. Inclua também um espaço para adicionar o endereço publicado do app e, se disponível, instruções ou exemplo de uso.

Implemente somente o escopo descrito. Mantenha a experiência simples, clara e acessível, com rótulos visíveis nos campos, mensagens de validação compreensíveis e estados de carregamento ou feedback quando forem necessários. Não acrescente login, upload de currículo, integração com IA externa ou funcionalidades fora deste escopo.
```

### Mudanças feitas durante o desenvolvimento

Após a geração inicial, foram solicitados ajustes na análise para filtrar melhor termos administrativos e localidades, reconhecer algumas expressões e equivalências relacionadas a requisitos e apresentar os itens não encontrados como pontos a confirmar, sem tratá-los como afirmações sobre a experiência da pessoa.

Também foi solicitado que o currículo organizado priorizasse o resumo profissional e informações relevantes para a vaga, sem acrescentar experiências ou qualificações. Foram feitos ajustes na geração e na apresentação do PDF.

A análise ainda pode incluir termos irrelevantes ou deixar de reconhecer relações entre conceitos, e o PDF deve ser conferido após o download para verificar a paginação. O percentual é uma estimativa baseada em palavras-chave, não uma avaliação profissional.

### Endereço publicado
https://screenshot-to-living-page-52.lovable.app/

