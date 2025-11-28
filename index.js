import {
  calcularCofator,
  calcularDeterminantesMenores,
  determinanteFinalLaplace,
  escolherLinhaOuColuna
} from "./calculo.js";

document.getElementById("btnCalcular").addEventListener("click", () => { //inicia o botao e chama as funçoes 
  limparResultado();
  document.getElementById("resultado").style.display = "block";

  const matriz = lerMatriz();
  mostrarMatriz("matriz-original", matriz); // função que reescreve a matriz digitada

  const escolha = escolherLinhaOuColuna(matriz); //Escolher linha ou coluna com mais zeros
  mostrarLinhaOuColunaEscolhida(matriz, escolha, document.getElementById("linhaOuColuna"));//destaca em vermelho a linha ou coluna escolhida

  const resultados = calcularDeterminantesMenores(matriz, escolha);//calcula 3x3 e seus derteminantes 
  resultados.forEach((item) => {
  const { cofator, passoCofator } = calcularCofator(matriz, item.i, item.j);

  document.getElementById("detalhesElementos").innerHTML += `
    <p>Submatriz gerada pelo elemento <b>${item.elemento}</b>:</p>
    <table border='1' cellspacing='0' cellpadding='5'>
      ${item.submatriz.map(linha => "<tr>" + linha.map(v => `<td>${v}</td>`).join("") + "</tr>").join("")}
    </table>
    <p>Elemento ${item.elemento} → determinante menor = ${item.det}</p>
    <p>${item.passo}</p> 
    <p>${passoCofator}</p>
    <hr>
  `;
});

  const { determinanteFinal, passoFinal } = determinanteFinalLaplace(matriz, escolha);
  document.getElementById("passoFinal").innerHTML += passoFinal;
  document.getElementById("detFinalValor").innerText = determinanteFinal;
});


// Limpa os resultados antes de recalcular
function limparResultado() {
  document.getElementById("matriz-original").innerHTML = "<h3>Matriz Original:</h3>";
  document.getElementById("linhaOuColuna").innerHTML = "<h3>📊 Linha ou Coluna Escolhida:</h3>";
  document.getElementById("detalhesElementos").innerHTML = "<h3>🧩 Detalhes de Cada Elemento:</h3>";
  document.getElementById("passoFinal").innerHTML = "";
  document.getElementById("detFinalValor").innerText = "";
}

// Lê os valores da matriz 4x4
function lerMatriz() {
  const matriz = [];
  for (let i = 1; i <= 4; i++) {
    const linha = [];
    for (let j = 1; j <= 4; j++) {
      const valor = Number(document.getElementById(`m${i}${j}`).value);
      linha.push(valor);
    }
    matriz.push(linha);
  }
  return matriz;
}

// Mostra uma matriz dentro de um bloco específico
function mostrarMatriz(id, matriz) {
  let tabela = "<table border='1' cellspacing='0' cellpadding='5'>";
  matriz.forEach(linha => {
    tabela += "<tr>" + linha.map(num => `<td>${num}</td>`).join("") + "</tr>";
  });
  tabela += "</table>";
  document.getElementById(id).innerHTML += tabela;
}

// Mostra a linha ou coluna escolhida para expansão
function mostrarLinhaOuColunaEscolhida(matriz, escolha, container) {
  let numeros = [];

  // Mostra os números da linha ou coluna escolhida
  if (escolha.tipo === "linha") {
    numeros = matriz[escolha.indice];
    container.innerHTML = `<p>Melhor linha para expansão: ${numeros.join(" , ")}</p><hr>`;
  } else {
    numeros = matriz.map(linha => linha[escolha.indice]);
    container.innerHTML = `<p>Melhor coluna para expansão: ${numeros.join(" , ")}</p><hr>`;
  }

  // Mostra a matriz inteira novamente, destacando a linha/coluna
  let tabela = "<table class='tabela-resultado'>";
  matriz.forEach((linha, i) => {
    tabela += "<tr>";
    linha.forEach((valor, j) => {
      if ((escolha.tipo === "linha" && i === escolha.indice) ||
          (escolha.tipo === "coluna" && j === escolha.indice)) {
        tabela += `<td style="color:red; font-weight:bold;">${valor}</td>`;
      } else {
        tabela += `<td>${valor}</td>`;
      }
    });
    tabela += "</tr>";
  });
  tabela += "</table>";

  container.innerHTML += `<h4>Matriz com a ${escolha.tipo} escolhida em destaque:</h4>` + tabela;
}



// Mostra cada submatriz 3x3 gerada
function mostrarSubmatriz(submatriz, elemento) {
  let tabela = "<table border='1' cellspacing='0' cellpadding='5'>";
  submatriz.forEach(linha => {
    tabela += "<tr>" + linha.map(v => `<td>${v}</td>`).join("") + "</tr>";
  });
  tabela += "</table>";
  document.getElementById("detalhesElementos").innerHTML += `
    <p>Submatriz gerada pelo elemento <b>${elemento}</b>:</p>
    ${tabela}
  `;
}
