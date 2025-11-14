// Contar zeros em uma linha
function contarZerosLinha(matriz, linhaIndex) {
  return matriz[linhaIndex].filter(num => num === 0).length;
}

// Contar zeros em uma coluna
function contarZerosColuna(matriz, colIndex) {
  return matriz.map(linha => linha[colIndex]).filter(num => num === 0).length;
}

// Escolher linha ou coluna com mais zeros
export function escolherLinhaOuColuna(matriz) {
  const n = matriz.length;

  // Melhor linha
  let melhorLinha = 0;
  let maxZerosLinha = contarZerosLinha(matriz, 0);
  for (let i = 1; i < n; i++) {
    const zeros = contarZerosLinha(matriz, i);
    if (zeros > maxZerosLinha) {
      maxZerosLinha = zeros;
      melhorLinha = i;
    }
  }

  // Melhor coluna
  let melhorColuna = 0;
  let maxZerosColuna = contarZerosColuna(matriz, 0);
  for (let j = 1; j < n; j++) {
    const zeros = contarZerosColuna(matriz, j);
    if (zeros > maxZerosColuna) {
      maxZerosColuna = zeros;
      melhorColuna = j;
    }
  }

  // Decide se vai expandir por linha ou coluna
  if (maxZerosLinha >= maxZerosColuna) {
    return { tipo: 'linha', indice: melhorLinha }; //retorna qual a linha excluida ex: "1" seria a segunda linha
  } else {
    return { tipo: 'coluna', indice: melhorColuna };
  }
}


// Recebe a matriz 4x4, a linha e a coluna que queremos remover
export function gerarSubmatriz(matriz, linhaRemover, colunaRemover) {
  const submatriz = [];

  for (let i = 0; i < matriz.length; i++) {
    if (i === linhaRemover) continue; // pula a linha removida

    const novaLinha = [];
    for (let j = 0; j < matriz[i].length; j++) {
      if (j === colunaRemover) continue; // pula a coluna removida
      novaLinha.push(matriz[i][j]);
    }

    submatriz.push(novaLinha);
  }

  return submatriz; // retorna a submatriz 3x3
}


export function calcularDeterminantesMenores(matriz, escolha) {
  const resultados = [];
  const n = matriz.length;

  if (escolha.tipo === "linha") {
    const i = escolha.indice;
    for (let j = 0; j < n; j++) {
      if (matriz[i][j] === 0) continue;
      const sub = gerarSubmatriz(matriz, i, j);
      const { det, passo } = determinante3x3(sub);

      // GUARDA OS INDICES REAIS NA MATRIZ ORIGINAL
      resultados.push({
        elemento: matriz[i][j],
        submatriz: sub,
        det,
        passo,
        i, // linha real
        j  // coluna real
      });
    }
  } else {
    const j = escolha.indice;
    for (let i = 0; i < n; i++) {
      if (matriz[i][j] === 0) continue;
      const sub = gerarSubmatriz(matriz, i, j);
      const { det, passo } = determinante3x3(sub);

      // GUARDA OS INDICES REAIS NA MATRIZ ORIGINAL
      resultados.push({
        elemento: matriz[i][j],
        submatriz: sub,
        det,
        passo,
        i, // linha real
        j  // coluna real
      });
    }
  }

  return resultados;
}




// Calcula determinante 3x3 sarrus
export function determinante3x3(m) {
  const a = m[0][0], b = m[0][1], c = m[0][2];
  const d = m[1][0], e = m[1][1], f = m[1][2];
  const g = m[2][0], h = m[2][1], i = m[2][2];

  // Diagonais principais
  const dp1 = a * e * i;
  const dp2 = b * f * g;
  const dp3 = c * d * h;
  const somaDP = dp1 + dp2 + dp3;

  // Diagonais secundárias
  const ds1 = c * e * g;
  const ds2 = a * f * h;
  const ds3 = b * d * i;
  const somaDS = ds1 + ds2 + ds3;

  // Determinante
  const det = somaDP - somaDS;

  // Montando a explicação detalhada com sinais
 const passo = `
  <b>Cálculos da matriz 3x3:</b><br><br>

  <b>Diagonais principais:</b><br>
  ${a} × ${e} × ${i} + ${b} × ${f} × ${g} + ${c} × ${d} × ${h}<br>
  = <b>${dp1}</b> + <b>${dp2}</b> + <b>${dp3}</b> = <b>${somaDP}</b><br><br>

  <b>Diagonais secundárias:</b><br>
  ${c} × ${e} × ${g} + ${a} × ${f} × ${h} + ${b} × ${d} × ${i}<br>
  = <b>${ds1}</b> + <b>${ds2}</b> + <b>${ds3}</b> = <b>${somaDS}</b><br><br>

  <b>Determinante:</b><br>
  Soma das diagonais principais - Soma das diagonais secundárias<br>
  = <b>${somaDP}</b> - <b>${somaDS}</b> = <b>${det}</b><br><br>

  <b>Resultado da menor determinante:</b> <b>${det}</b>
`;


  return { det, passo };
}


export function calcularCofator(matriz, i, j) {
  const sub = gerarSubmatriz(matriz, i, j);
  const { det } = determinante3x3(sub); // determinante real da submatriz

  const expoente = i + j + 2; // +2 porque i,j são índices 0-based, mas a fórmula usa 1-based
  const sinal = ((i + j) % 2 === 0 ? 1 : -1); // sinal do cofator
  const cofator = sinal * det;

  const passoCofator = `
Calculo do Cofator para o elemento na posição linha ${i + 1}, coluna ${j + 1}:<br>
Cofator = (-1)^(${i + 1} + ${j + 1}) * determinante menor<br>
Cofator = (-1)^(${expoente}) * ${det} <br>
Sinal = ${sinal >= 0 ? '+' : '-'}1 → Cofator = ${cofator}
`;

  return { cofator, passoCofator };
}




export function determinanteFinalLaplace(matriz, escolha) {
  const resultados = calcularDeterminantesMenores(matriz, escolha);
  let determinanteFinal = 0;

  let formulaNumerica = "<p><b>Substituindo os valores:</b></p><p>Det = ";
  let passoFinal = "<h3>🧮 Cálculo do determinante final pelo método de Laplace:</h3>";

  // 🔹 Fórmula simbólica bonita com subscritos
  let formulaSimbolica = "<p><b>Expansão de Laplace (fórmula geral):</b></p><p>Det = ";

  resultados.forEach((item, idx) => {
    const { cofator, passoCofator } = calcularCofator(matriz, item.i, item.j);
    const produto = item.elemento * cofator;
    determinanteFinal += produto;

    // Detalhes de cada elemento
    passoFinal += `
      <p><b>Elemento ${item.elemento}</b> → ${passoCofator} = ${produto}</p>
    `;

    // 🧮 Fórmula simbólica com índices em <sub>
    formulaSimbolica += `a<sub>${item.i + 1}${item.j + 1}</sub>·C<sub>${item.i + 1}${item.j + 1}</sub>`;
    if (idx < resultados.length - 1) formulaSimbolica += " + ";

    // Fórmula numérica
    formulaNumerica += `(${item.elemento} * ${cofator})`;
    if (idx < resultados.length - 1) formulaNumerica += " + ";
  });

  formulaSimbolica += "</p>";
  formulaNumerica += `</p><p><b>Determinante final = ${determinanteFinal}</b></p>`;

  // Junta tudo no retorno final
  const resultadoHTML = `
    ${passoFinal}
    ${formulaSimbolica}
    ${formulaNumerica}
  `;

  return { determinanteFinal, passoFinal: resultadoHTML };
}
