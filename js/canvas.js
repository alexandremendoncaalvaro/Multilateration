var margem = 50;
var tamanho_cubos_grid = 10;
var tamanho_ponto = 10;
var offset_centro_ponto = tamanho_ponto / 2;
var quantidade_beacons_lateracao = 5;
var quantidade_beacons_detectada = 5;
var cor_calculados = "dodgerblue";
var cor_detectados = "#444";
let beacons = [];

var aumento_velocidade = 0;
var posicao_x = 0;
var posicao_y = 0;

function inicializacao_calculando_ponto() {
    plotar_canvas();
}

function inicializacao_calculando_distancias() {
    plotar_canvas();
    captura_mouse();
}

function captura_mouse() {
    canvas = document.getElementById("layer2");
    contexto = canvas.getContext("2d");

    canvas.addEventListener('mousemove', function (evt) {
        var posicaoMouse = pegarPosicaoMouse(canvas, evt);
        posicao_x = Math.ceil(posicaoMouse.x - margem);
        posicao_y = Math.ceil(posicaoMouse.y - margem);
        plotar_beacons_ativos(posicao_x, posicao_y);
    }, false);

    window.addEventListener("keydown", mover_beacon, false);
    window.addEventListener("keyup", function (e) {
        aumento_velocidade = 0;
    });
}

function pegarPosicaoMouse(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function mover_beacon(e) {
    var deslocamento = 1;
    if (aumento_velocidade <= 10) {
        aumento_velocidade += 0.1;
    }

    switch (e.keyCode) {
        case 37:
            posicao_x -= deslocamento + aumento_velocidade;
            break;
        case 38:
            posicao_y -= deslocamento + aumento_velocidade;
            break;
        case 39:
            posicao_x += deslocamento + aumento_velocidade;
            break;
        case 40:
            posicao_y += deslocamento + aumento_velocidade;
            break;
    }
    plotar_beacons_ativos(posicao_x, posicao_y);
}

function quadrado(n) {
    return n * n;
}

function calcular_distancia_dois_pontos(a, b) {
    var diferenca_horizontal = a.x - b.x;
    var diferenca_vertical = a.y - b.y;

    var quadrado_cateto_x = quadrado(diferenca_horizontal);
    var quadrado_cateto_y = quadrado(diferenca_vertical);

    var hipotenusa = Math.sqrt(quadrado_cateto_x + quadrado_cateto_y);

    return hipotenusa;
}

function plotar_canvas() {
    canvas = document.getElementById("canvas");
    contexto = canvas.getContext("2d");

    plotar_area();
    plotar_grid();
    plotar_ancoras();

    function plotar_grid() {
        var latitude_atual = margem;
        var longitude_atual = margem;
        var numeracao = 0;

        for (latitude_atual; latitude_atual <= canvas.height - margem; latitude_atual += tamanho_cubos_grid) {
            contexto.fillStyle = "#888";
            contexto.strokeStyle = "#333";
            if ((latitude_atual - margem) % (10 * tamanho_cubos_grid) != 0) {
                contexto.beginPath();
                contexto.moveTo(margem, latitude_atual);
                contexto.lineTo(canvas.width - margem, latitude_atual);
                contexto.stroke();
            }
        }

        numeracao = 0;

        for (longitude_atual; longitude_atual <= canvas.width - margem; longitude_atual += tamanho_cubos_grid) {
            contexto.fillStyle = "#888";
            contexto.strokeStyle = "#333";
            if ((longitude_atual - margem) % (10 * tamanho_cubos_grid) == 0) {
                contexto.strokeStyle = "#888";
                contexto.beginPath();
                contexto.moveTo(longitude_atual, tamanho_cubos_grid);
                contexto.lineTo(longitude_atual, canvas.height - tamanho_cubos_grid);
                contexto.stroke();
                contexto.font = "10px Arial";
                contexto.fillText(numeracao, longitude_atual + 2, 2 * tamanho_cubos_grid);
                contexto.fillText(numeracao, longitude_atual + 2, canvas.height - tamanho_cubos_grid);
                numeracao += 100;
            } else {
                contexto.beginPath();
                contexto.moveTo(longitude_atual, margem);
                contexto.lineTo(longitude_atual, canvas.height - margem);
                contexto.stroke();
            }
        }

        latitude_atual = margem;
        numeracao = 0;

        for (latitude_atual; latitude_atual <= canvas.height - margem; latitude_atual += tamanho_cubos_grid) {
            contexto.fillStyle = "#888";
            contexto.strokeStyle = "#333";
            if ((latitude_atual - margem) % (10 * tamanho_cubos_grid) == 0) {
                contexto.strokeStyle = "#888";
                contexto.beginPath();
                contexto.moveTo(tamanho_cubos_grid, latitude_atual);
                contexto.lineTo(canvas.width - tamanho_cubos_grid, latitude_atual);
                contexto.stroke();
                contexto.font = "10px Arial";
                contexto.fillText(numeracao, tamanho_cubos_grid, latitude_atual - 2);
                contexto.fillText(numeracao, canvas.width - 2.5 * tamanho_cubos_grid, latitude_atual - 2);
                numeracao += 100;
            }
        }
    }

    function plotar_area() {
        contexto.fillStyle = "#222";
        contexto.fillRect(margem, margem, canvas.width - 2 * margem, canvas.height - 2 * margem);
    }
}

function plotar_ancoras() {
    canvas = document.getElementById("layer1");
    contexto = canvas.getContext("2d");

    var latitude_atual = 50;
    var longitude_atual = 50;

    for (latitude_atual; latitude_atual < canvas.height - margem; latitude_atual += 100) {
        longitude_atual = 50;
        for (longitude_atual; longitude_atual < canvas.width - margem; longitude_atual += 100) {
            p_beacon = {
                x: longitude_atual,
                y: latitude_atual,
                r: 0
            };
            beacons.push(p_beacon);
            plotar_ponto(p_beacon, "black");
        }
    }
}

function plotar_ponto(p, cor, mostrar_distancia = false) {
    contexto.fillStyle = cor;
    contexto.strokeStyle = contexto.fillStyle;
    if (cor == "white") {
        contexto.beginPath();
        contexto.arc(margem + p.x, margem + p.y, tamanho_ponto * 0.75, 0, 2 * Math.PI, false);
        contexto.fill();
    } else {
        contexto.fillRect(margem + p.x - offset_centro_ponto, margem + p.y - offset_centro_ponto, tamanho_ponto, tamanho_ponto);
    }

    contexto.beginPath();

    if (cor != "black" && cor != "white") {
        contexto.arc(margem + p.x, margem + p.y, p.r, 0, 2 * Math.PI);
    } else {
        contexto.arc(margem + p.x, margem + p.y, p.r, 0, 2 * Math.PI);
    }
    contexto.stroke();
    if (mostrar_distancia) {
        if (cor == cor_calculados) {
            contexto.fillStyle = "white";
        } else {
            contexto.fillStyle = cor_detectados;
        }
        contexto.font = "10px Arial";
        contexto.fillText("Dist: " + Math.ceil(p.r), p.x + margem + tamanho_ponto, p.y + margem + offset_centro_ponto / 2);
    }
}

function plotar_beacons_ativos(px, py) {
    canvas = document.getElementById("layer2");
    contexto = canvas.getContext("2d");
    contexto.clearRect(0, 0, canvas.width, canvas.height);

    px = Math.ceil(px);
    py = Math.ceil(py);

    p = {
        x: px,
        y: py,
        r: 0
    };

    beacons.forEach(b => {
        b.r = calcular_distancia_dois_pontos(p, b);
    });

    function comparar(a, b) {
        if (a.r < b.r)
            return -1;
        if (a.r > b.r)
            return 1;
        return 0;
    }

    beacons.sort(comparar);

    for (i = 0; i < quantidade_beacons_detectada; i++) {
        pn = {
            x: beacons[i].x,
            y: beacons[i].y,
            r: beacons[i].r
        };
        if (i < quantidade_beacons_lateracao) {
            plotar_ponto(pn, cor_calculados, true);
        } else {
            plotar_ponto(pn, cor_detectados, true);
        }
    }

    plotar_ponto(p, "white");
    var mensagem = px + ',' + py;
    contexto.fillStyle = "white";
    contexto.font = "10px Arial";
    contexto.fillText(mensagem, px + margem + tamanho_ponto, py + margem + offset_centro_ponto / 2);
}

function plotar_beacons_lidos(beacons) {
    canvas = document.getElementById("layer2");
    contexto = canvas.getContext("2d");
    contexto.clearRect(0, 0, canvas.width, canvas.height);

    function comparar(a, b) {
        if (a.r < b.r)
            return -1;
        if (a.r > b.r)
            return 1;
        return 0;
    }

    beacons.sort(comparar);

    for (i = 0; i < quantidade_beacons_detectada; i++) {
        pn = {
            x: beacons[i].x,
            y: beacons[i].y,
            r: beacons[i].r
        };
        if (i < quantidade_beacons_lateracao) {
            plotar_ponto(pn, cor_calculados, true);
        } else {
            plotar_ponto(pn, cor_detectados, true);
        }
    }
}