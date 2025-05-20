let gotas = [];
let solo;
let tipoSolo = "vegetacao"; // valor inicial
let elementosVisuais = []; // Array para armazenar árvores e prédios

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvas-holder");
  solo = new Solo(tipoSolo);
  criarCenario(tipoSolo);
}

function criarCenario(tipo) {
  elementosVisuais = [];
  if (tipo === "vegetacao") {
    // Cria árvores com troncos e copas mais definidos
    elementosVisuais.push({ tipo: "arvore", x: 70, yBase: solo.altura, altTronco: 80, largTronco: 15, raioCopa: 40, corTronco: "#795548", corCopa: "#228B22" }); // Verde floresta
    elementosVisuais.push({ tipo: "arvore", x: 180, yBase: solo.altura, altTronco: 60, largTronco: 12, raioCopa: 35, corTronco: "#795548", corCopa: "#228B22" });
    elementosVisuais.push({ tipo: "arvore", x: 300, yBase: solo.altura, altTronco: 90, largTronco: 18, raioCopa: 45, corTronco: "#795548", corCopa: "#228B22" });
    elementosVisuais.push({ tipo: "arvore", x: 450, yBase: solo.altura, altTronco: 70, largTronco: 14, raioCopa: 38, corTronco: "#795548", corCopa: "#228B22" });
    elementosVisuais.push({ tipo: "arvore", x: 560, yBase: solo.altura, altTronco: 85, largTronco: 16, raioCopa: 42, corTronco: "#795548", corCopa: "#228B22" });
    // Adicione mais árvores aqui se quiser
  } else if (tipo === "urbanizado") {
    // Cria prédios retangulares que ficam na base
    elementosVisuais.push({ tipo: "predio", x: 50, yBase: solo.altura, largura: 60, altura: 120, cor: "#808080" }); // Cinza
    elementosVisuais.push({ tipo: "predio", x: 140, yBase: solo.altura, largura: 70, altura: 150, cor: "#A9A9A9" }); // Cinza escuro
    elementosVisuais.push({ tipo: "predio", x: 250, yBase: solo.altura, largura: 55, altura: 110, cor: "#696969" }); // Cinza bem escuro
    elementosVisuais.push({ tipo: "predio", x: 360, yBase: solo.altura, largura: 80, altura: 180, cor: "#D3D3D3" }); // Cinza claro
    elementosVisuais.push({ tipo: "predio", x: 480, yBase: solo.altura, largura: 65, altura: 130, cor: "#808080" });
    // Adicione mais prédios aqui se quiser
  }
}

function draw() {
  background(200, 220, 255); // céu (dia padrão)
  if (tipoSolo === "urbanizado") {
    background(10, 30, 70); // Céu noturno
    fill(255);
    ellipse(50, 50, 30, 30); // Lua simples
    fill(255, 255, 204); // Cor amarelada para estrelas
    for (let i = 0; i < 100; i++) {
      point(random(width), random(height / 2), random(2)); // Estrelas simples
    }
  }

  for (let i = gotas.length - 1; i >= 0; i--) {
    gotas[i].cair();
    gotas[i].mostrar();

    if (gotas[i].atingeSolo(solo.altura)) {
      solo.aumentarErosao();
      gotas.splice(i, 1);
    }
  }

  solo.mostrar();

  // Desenha os elementos visuais (árvores ou prédios)
  for (let elemento of elementosVisuais) {
    if (elemento.tipo === "arvore") {
      fill(elemento.corTronco);
      rect(elemento.x - elemento.largTronco / 2, elemento.yBase - elemento.altTronco, elemento.largTronco, elemento.altTronco);
      fill(elemento.corCopa);
      ellipse(elemento.x, elemento.yBase - elemento.altTronco - elemento.raioCopa / 2, elemento.raioCopa, elemento.raioCopa * 0.8); // Copa um pouco oval
    } else if (elemento.tipo === "predio") {
      fill(elemento.cor);
      rect(elemento.x - elemento.largura / 2, elemento.yBase - elemento.altura, elemento.largura, elemento.altura);
      // Adicione detalhes das janelas aqui se desejar
    }
  }

  if (frameCount % 5 === 0) {
    gotas.push(new Gota());
  }
}

function setSoilType(tipo) {
  tipoSolo = tipo;
  solo = new Solo(tipoSolo);
  criarCenario(tipo); // Recria o cenário visual
}

class Gota {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.vel = random(4, 6);
  }

  cair() {
    this.y += this.vel;
  }

  mostrar() {
    stroke(0, 0, 200);
    line(this.x, this.y, this.x, this.y + 10);
  }

  atingeSolo(ySolo) {
    return this.y > ySolo;
  }
}

class Solo {
  constructor(tipo) {
    this.tipo = tipo;
    this.altura = height - 80;
    this.erosao = 0;
  }

  aumentarErosao() {
    let taxa;
    if (this.tipo === "vegetacao") taxa = 0.1;
    else if (this.tipo === "exposto") taxa = 0.5;
    else if (this.tipo === "urbanizado") taxa = 0.3;

    this.erosao += taxa;
    this.altura += taxa;
  }

  mostrar() {
    noStroke();
    if (this.tipo === "vegetacao") fill(60, 150, 60);
    else if (this.tipo === "exposto") fill(139, 69, 19);
    else if (this.tipo === "urbanizado") fill(120);

    rect(0, this.altura, width, height - this.altura);

    fill(0);
    textSize(14);
    textAlign(LEFT);
    text(`Erosão: ${this.erosao.toFixed(1)}`, 10, 20);
    text(`Tipo de solo: ${this.tipo}`, 10, 40);
  }
}
