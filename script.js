const backgroundMusic = document.getElementById("backgroundMusic");
const caixa_fixa = document.getElementById("fixa");
const caixa_texto = document.getElementById("caixatexto");
const pau = document.getElementById("pau");
const caixa_dinamica = document.getElementById("dinamica");
const clickSound = new Audio('sons/efeitos/click.mp3');

function playClickSound() {
    clickSound.play();
}

document.addEventListener('click', playClickSound);

let playerName = '';
let currentSceneIndex = 0;
let finalOutcome = "";

const scenes = [ 
    {src: 'cenas/planeta.gif', texts: ["Em um mundo à beira do colapso agrícola...", "Onde as mudanças climáticas ameaçam a segurança alimentar..."] },
    { src: 'cenas/empresa.gif', texts: ["Uma corporação promete uma solução revolucionária...", "AGROCORP, uma multinacional que monopolizou o mercado agrícola...", "Promete salvar o mundo da fome..."] },
    { src: 'cenas/preto.png', texts: ["Mas um grande problema permanece."] },
    { src: 'cenas/parasita.gif', texts: ["PARASITAS"] },
    { src: 'cenas/frasco.gif', texts: ["A ciência tentou vários métodos...", "Técnicas, inseticidas..."]},
    { src: 'cenas/dna.gif', texts: ["Mas teve que apelar para a mudança genética...", "Diretamente nas sementes e em herbicidas..."] },
    { src: 'cenas/guia.gif', texts: ["Você é o cientista que vai trabalhar nesse projeto ambicioso.","Convocamos você para o projeto Soja Titã."]},
    {src: 'cenas/microscopio.png', texts: ["Sua missão é liderar os laboratórios..."]},
    {src: 'cenas/soja.gif', texts: ["Aumentar a produção da soja...", "E garantir resistência a todos os parasitas.", "Eu serei seu guia e, antes de começarmos, preciso saber o seu nome."] },
];

function iniciarJogo() {
    iniciarMusica();
    setTimeout(() => {
        removerImagemInicial();
        setTimeout(() => {
            mostrarCenaAtual();
        }, 1500);
    }, 1000);
}

function iniciarMusica() {
    backgroundMusic.volume = 0;
    backgroundMusic.play().then(() => {
        const fadeDuration = 5000;
        const fadeSteps = 50;
        const fadeIntervalTime = fadeDuration / fadeSteps;
        const volumeIncrement = 1 / fadeSteps;

        const fadeInterval = setInterval(() => {
            if (backgroundMusic.volume < 0.8) {
                backgroundMusic.volume = Math.min(backgroundMusic.volume + volumeIncrement, 0.8);
            } else {
                clearInterval(fadeInterval);
            }
        }, fadeIntervalTime);
    }).catch(error => {
        console.error("Erro ao tentar reproduzir a música: ", error);
    });
}

function pararMusica() {
    const fadeDuration = 2000;
    const fadeSteps = 50;
    const fadeIntervalTime = fadeDuration / fadeSteps;
    const volumeDecrement = backgroundMusic.volume / fadeSteps;

    const fadeInterval = setInterval(() => {
        if (backgroundMusic.volume > 0) {
            backgroundMusic.volume = Math.max(backgroundMusic.volume - volumeDecrement, 0);
        } else {
            clearInterval(fadeInterval);
            backgroundMusic.pause();
        }
    }, fadeIntervalTime);
}

function removerImagemInicial() {
    const logo = document.getElementById('logo');
    if (logo) {
        logo.style.opacity = 0;
        setTimeout(() => logo.remove(), 1000);
    }
}

function criarBotaoIniciar() {
    const botao_iniciar = document.createElement('button');
    botao_iniciar.innerText = "INICIAR";
    botao_iniciar.addEventListener('click', () => {
        botao_iniciar.remove();
        caixa_dinamica.style.marginTop = '0';
        iniciarJogo();
    });
    return botao_iniciar;
}

const falandoAudio = new Audio('sons/efeitos/falando.mp3');
falandoAudio.loop = true; 

function exibirTexto(textos, callback, manterTexto = false) {
    caixa_texto.style.display = 'flex';
    caixa_texto.style.marginTop = '20px';
    let textoIndex = 0;
    let charIndex = 0;

    function digitarTexto() {
        if (textoIndex < textos.length) {
            let texto = textos[textoIndex];
            pau.innerHTML = '';  

            falandoAudio.currentTime = 0; 
            falandoAudio.play();

            function digitarCaracter() {
                if (charIndex < texto.length) {
                    pau.innerHTML += texto[charIndex++];
                    let delay = Math.random() * 70 + 20;

                    if (Math.random() < 0.15) {
                        delay += Math.random() * 100 + 50;
                    }

                    setTimeout(digitarCaracter, delay);
                } else {
                    setTimeout(() => {
                        falandoAudio.pause();
                        textoIndex++;
                        charIndex = 0;
                        digitarTexto();  
                    }, 500);
                }
            }

            digitarCaracter(); 
        } else {
            falandoAudio.pause();
            
            if (!manterTexto) {
                setTimeout(callback, 1500);  
            } else {
                callback();  
            }
        }
    }

    digitarTexto();  
}

function mostrarCenaAtual() {
    if (currentSceneIndex >= scenes.length) {
        console.error("Índice de cena fora do limite.");
        return;
    }

    const cena = scenes[currentSceneIndex];

    if (cena.src) {
        const uniqueSrc = `${cena.src}?${new Date().getTime()}`;
        mostrarGif(uniqueSrc, true);
        exibirTexto(cena.texts, () => {
            setTimeout(() => {
                currentSceneIndex++;
                if (currentSceneIndex < scenes.length) {
                    mostrarCenaAtual();
                } else {
                    mostrarInputName();
                }
            }, 2000);
        });
    } else {
        console.error("Caminho de imagem não encontrado para a cena atual.");
    }
}

function mostrarGif(src, loop = true) {
    caixa_fixa.innerHTML = ''; 

    const gif = document.createElement('img');
    gif.src = src;
    gif.id = 'scene';
    gif.style.opacity = 0;
    gif.style.transition = 'opacity 1.5s';
    gif.style.maxHeight = '100%';
    gif.style.maxWidth = '100%';
    gif.style.display = 'block';

    if (!loop) {
        gif.setAttribute('loop', '');
    }

    caixa_fixa.appendChild(gif);

    setTimeout(() => {
        gif.style.opacity = 1;
    }, 100);
}

function mostrarInputName() {
    pararMusica(); 
    guiaFalando = true; 
    const guia_perguntando = `cenas/guia-perguntando.gif?${new Date().getTime()}`;
    mostrarGif(guia_perguntando);
    const inputPrompt = "Qual é o seu nome?";
    exibirTexto([inputPrompt], () => {
        caixa_dinamica.innerHTML = ''; 

        const inputName = document.createElement('input');
        inputName.id = 'inputName';
        inputName.placeholder = "Escreva aqui...";
        inputName.style.display = 'inline-block';

        const submitName = document.createElement('button');
        submitName.id = 'submitName';
        submitName.innerText = " > ";
        submitName.style.display = 'inline-block';

        submitName.addEventListener('click', () => {
            playerName = inputName.value.trim();
            if (playerName) {
                inputName.remove();
                submitName.remove();
                pau.innerHTML = '';
                mostrarApresentacaoChefe();
            } else {
                alert("Por favor, insira um nome.");
            }
        });

        caixa_dinamica.appendChild(inputName);
        caixa_dinamica.appendChild(submitName);
    }, true);
}

function mostrarApresentacaoChefe() {
    const ap_chefe = `cenas/apresentacao-chefe.gif?${new Date().getTime()}`;
    mostrarGif(ap_chefe);
    exibirTexto([
        "Este ao meu lado é o seu chefe.",
    ], () => {
        mostrarPerguntaChefe();
    });
}

function mostrarPerguntaChefe() {
    const chefe_falando = `cenas/chefe-agrocorp.gif?${new Date().getTime()}`;
    mostrarGif(chefe_falando);
    exibirTexto([
        `Uma pergunta... Você aceita vir para a AGROCORP, ${playerName}?`
    ], () => {
        caixa_dinamica.innerHTML = ''; 

        const escolha1 = document.createElement('button');
        escolha1.innerText = "Aceitar";
        escolha1.addEventListener('click', () => {
            const chefe_sas = `cenas/chefe_satisfeito.gif?${new Date().getTime()}`;
            mostrarGif(chefe_sas);
            removerBotoes();
            exibirTexto([
                "Você aceitou a oferta.",
                "O chefe parece satisfeito com sua decisão.",
                `Agora, ${playerName}, você está oficialmente no projeto Soja Titã.`
            ], () => {
                mostrarEscolhas();
            });
        });

        const escolha2 = document.createElement('button');
        escolha2.innerText = "Questionar a ética";
        escolha2.addEventListener('click', () => {
            const chefe_fal = `cenas/chefe.gif?${new Date().getTime()}`;
            mostrarGif(chefe_fal); 
            removerBotoes(); 
            exibirTexto([
                `Entendo suas preocupações, ${playerName}. Mas lembre-se...`,
                "Esse projeto pode salvar milhões...",
                "Outro cientista pode assumir seu lugar, caso você não esteja confortável."
            ], () => {
                const chefe_sass = `cenas/chefe_satisfeito.gif?${new Date().getTime()}`;
                mostrarGif(chefe_sass);
                exibirTexto(["Sob pressão, você acaba cedendo e aceitando a oferta..."], () => {
                    mostrarEscolhas();
                });
            });
        });
        


        caixa_dinamica.appendChild(escolha1);
        caixa_dinamica.appendChild(escolha2);
    }, true);
}

function mostrarEscolhas() {
    const uniqueSrc = `cenas/herbicida_e_praga.gif?${new Date().getTime()}`;
    mostrarGif(uniqueSrc); 
    exibirTexto([
        `${playerName}, você precisa tomar uma decisão.`,
        "Pode focar em resistência a pragas...",
        "Ou adicionar resistência a herbicidas.",
        "Qual você escolhe?"
    ], () => {
        caixa_dinamica.innerHTML = ''; 

        const escolha1 = document.createElement('button');
        escolha1.innerText = "Adicionar resistência a herbicidas";
        escolha1.addEventListener('click', () => {
            const uniqueSrc1 = `cenas/herbicida.gif?${new Date().getTime()}`
            mostrarGif(uniqueSrc1);
            removerBotoes();
            mostrarEscolhaEscala("herbicidas");
        });

        const escolha2 = document.createElement('button');
        escolha2.innerText = "Focar em resistência a pragas";
        escolha2.addEventListener('click', () => {
            const uniqueSrc2 = `cenas/praga.gif?${new Date().getTime()}`
            mostrarGif(uniqueSrc2);
            removerBotoes();
            mostrarEscolhaEscala("pragas");
        });

        caixa_dinamica.appendChild(escolha1);
        caixa_dinamica.appendChild(escolha2);
    }, true);
}

function mostrarEscolhaEscala(tipo) {
    const escala_teste = `cenas/teste_escala.png?${new Date().getTime()}`;
    mostrarGif(escala_teste);
    exibirTexto([
        "Agora, é crucial decidir a escala dos testes...",
        "Você pode optar por expandir rapidamente para testes em larga escala...",
        "Acelerando o processo e potencializando os lucros antecipadamente...",
        "Ou seguir com testes limitados e controlados...",
        "Adotando uma abordagem mais segura e cautelosa.",
        "Qual caminho você vai escolher?"
    ], () => {
        caixa_dinamica.innerHTML = '';

        const escolha1 = document.createElement('button');
        escolha1.innerText = "Testes em Larga Escala";
        escolha1.addEventListener('click', () => {
            removerBotoes();
            explicarTermos(tipo, "largaEscala");
        });

        const escolha2 = document.createElement('button');
        escolha2.innerText = "Testes Limitados e Controlados";
        escolha2.addEventListener('click', () => {
            removerBotoes();
            explicarTermos(tipo, "limitado");
        });

        caixa_dinamica.appendChild(escolha1);
        caixa_dinamica.appendChild(escolha2);
    }, true);
}


function explicarTermos(tipo) {
    let textos;
    if (tipo === "pragas") {
        const uniqueSrc2 = `cenas/praga.gif?${new Date().getTime()}`
        mostrarGif(uniqueSrc2);
        textos = [
            "Focar em resistência a pragas...",
            `Isso significa usar técnicas de biotecnologia, ${playerName},`,
            "como CRISPR/Cas9 ou transgenia.",
            "Essas técnicas ajudam a tornar as plantas mais resistentes aos insetos.",
            "Vamos explicar brevemente o que cada uma dessas técnicas envolve."
        ];
    } else if (tipo === "herbicidas") {
        const uniqueSrc1 = `cenas/herbicida.gif?${new Date().getTime()}`
        mostrarGif(uniqueSrc1);
        textos = [
            "Adicionar resistência a herbicidas...",
            `Isso envolve modificar geneticamente as plantas, ${playerName},`,
            "para que elas possam sobreviver a altas doses de herbicidas.",
            "Isso pode ser feito através de CRISPR/Cas9 ou engenharia de proteínas.",
            "Vamos explicar brevemente o que cada uma dessas técnicas envolve."
        ];
    }

    exibirTexto(textos, () => {
        explicarTecnicas(tipo);
    });
}

function explicarTecnicas(tipo) {
    let textos;
    if (tipo === "pragas") {
        const dna2 = `cenas/dna2.gif?${new Date().getTime()}`;
        mostrarGif(dna2);
        textos = [
            "CRISPR/Cas9 é uma técnica avançada.",
            "Ela permite modificar diretamente os genes das plantas.",
            "Pode ser usada para criar plantas...",
            "Plantas que produzem toxinas específicas contra pragas...",
            "Ou desenvolver mecanismos de defesa mais sofisticados.",
            "Transgenia é uma técnica mais tradicional.",
            "Ela envolve a introdução de genes de outras espécies...",
            "Criando plantas com características de resistência a pragas...",
            "É um método mais comprovado, mas menos preciso."
        ];
    } else if (tipo === "herbicidas") {
        const dna2 = `cenas/dna2.gif?${new Date().getTime()}`;
        mostrarGif(dna2);
        textos = [
            "CRISPR/Cas9 pode ser usada para modificar os genes das plantas...",
            "Permitindo que resistam a herbicidas específicos.",
            "Isso pode levar à criação de plantas que desativam herbicidas...",
            "Ou que neutralizam esses herbicidas.",
            "Engenharia de Proteínas envolve a produção de proteínas dentro das plantas...",
            "Essas proteínas podem desativar os herbicidas ou ajudar a quebrá-los no solo."
        ];
    }

    exibirTexto(textos, () => {
        mostrarEscolhaTecnica(tipo);
    });
}

function mostrarEscolhaTecnica(tipo) {
    const molecula = `cenas/molecula.gif?${new Date().getTime()}`;
    mostrarGif(molecula); 
    exibirTexto([
        "Com essas informações, você pode escolher...",
        "Escolher a técnica de melhoramento genético que deseja usar.",
        "Qual você escolhe?"
    ], () => {
        caixa_dinamica.innerHTML = ''; 

        const escolha1 = document.createElement('button');
        escolha1.innerText = tipo === "pragas" ? "CRISPR/Cas9" : "CRISPR/Cas9";
        escolha1.addEventListener('click', () => {
            const molecula = `cenas/molecula.gif?${new Date().getTime()}`;
            mostrarGif(molecula); 
            removerBotoes();
            mostrarEscolhaControle(tipo, "crispr");
        });

        const escolha2 = document.createElement('button');
        escolha2.innerText = tipo === "pragas" ? "Transgenia" : "Engenharia de Proteínas";
        escolha2.addEventListener('click', () => {
            const molecula = `cenas/molecula.gif?${new Date().getTime()}`;
            mostrarGif(molecula); 
            removerBotoes();
            mostrarEscolhaControle(tipo, tipo === "pragas" ? "transgenia" : "proteinas");
        });

        caixa_dinamica.appendChild(escolha1);
        caixa_dinamica.appendChild(escolha2);
    });
}

function mostrarEscolhaControle(tipo, tecnica) {
    const dna3 = `cenas/dna3.gif?${new Date().getTime()}`;
    mostrarGif(dna3); 
    let textos;
    if (tecnica === "crispr") {
        if (tipo === "pragas") {
            textos = [
                "Para CRISPR/Cas9...",
                "Você pode escolher entre os seguintes métodos de controle de pragas...",
                "Modificação para produção de toxinas específicas contra pragas.",
                "Ou o desenvolvimento de mecanismos de defesa melhorados."
            ];
        } else if (tipo === "herbicidas") {
            textos = [
                "Para CRISPR/Cas9...",
                "Você pode escolher entre os seguintes métodos de controle de herbicidas...",
                "Modificação para desativação de herbicidas específicos.",
                "Ou o desenvolvimento de mecanismos para neutralização de herbicidas."
            ];
        }
    } else if (tecnica === "transgenia") {
        textos = [
            "Para Transgenia...",
            "Você pode escolher entre os seguintes métodos de controle de pragas...",
            "Incorporação de genes para produção de substâncias repelentes.",
            "Ou o desenvolvimento de características de resistência...",
            "Através de cruzamento com outras variedades."
        ];
    } else if (tecnica === "proteinas") {
        textos = [
            "Para Engenharia de Proteínas...",
            "Você pode escolher entre os seguintes métodos de controle de herbicidas...",
            "Desenvolvimento de proteínas de resistência múltipla.",
            "Ou a modificação para degradação de herbicidas no solo."
        ];
    }

    exibirTexto(textos, () => {
        mostrarEscolhaFinal(tipo, tecnica);
    });
}

function mostrarEscolhaFinal(tipo, tecnica) {
    const molecula3 = `cenas/molecula2.gif?${new Date().getTime()}`;
    mostrarGif(molecula3);
    exibirTexto([
        "Com base na técnica escolhida...",
        "Selecione o método específico que você deseja implementar."
    ], () => {
        caixa_dinamica.innerHTML = ''; 

        const escolha1 = document.createElement('button');
        if (tecnica === "crispr" && tipo === "pragas") {
            escolha1.innerText = "Produção de Toxinas";
        } else if (tecnica === "crispr" && tipo === "herbicidas") {
            escolha1.innerText = "Desativação de Herbicidas";
        } else if (tecnica === "transgenia") {
            escolha1.innerText = "Substâncias Repelentes";
        } else if (tecnica === "proteinas") {
            escolha1.innerText = "Resistência Múltipla";
        }
        escolha1.addEventListener('click', () => {
            const molecula3 = `cenas/molecula2.gif?${new Date().getTime()}`;
            mostrarGif(molecula3); 
            removerBotoes();
            mostrarConsequencias(tipo, tecnica, escolha1.innerText);
        });

        const escolha2 = document.createElement('button');
        if (tecnica === "crispr" && tipo === "pragas") {
            escolha2.innerText = "Mecanismos de Defesa";
        } else if (tecnica === "crispr" && tipo === "herbicidas") {
            escolha2.innerText = "Neutralização de Herbicidas";
        } else if (tecnica === "transgenia") {
            escolha2.innerText = "Resistência Através de Cruzamento";
        } else if (tecnica === "proteinas") {
            escolha2.innerText = "Degradação de Herbicidas no Solo";
        }
        escolha2.addEventListener('click', () => {
            const molecula3 = `cenas/molecula2.gif?${new Date().getTime()}`;
            mostrarGif(molecula3); 
            removerBotoes();
            mostrarConsequencias(tipo, tecnica, escolha2.innerText);
        });

        caixa_dinamica.appendChild(escolha1);
        caixa_dinamica.appendChild(escolha2);
    });
}

function mostrarConsequencias(tipo, tecnica, metodo) {
    const planeta_gif = `cenas/planeta.gif?${new Date().getTime()}`;
    mostrarGif(planeta_gif);
    let textos = [
        `${playerName}, você escolheu ${metodo}.`,
        "Inicialmente, os resultados foram promissores.",
        "No entanto, após alguns anos, começaram a surgir problemas inesperados..."
    ];

    if (tipo === "pragas" && tecnica === "crispr") {
        if (metodo === "Produção de Toxinas") {
            textos.push(
                "As plantas desenvolveram toxinas eficazes contra pragas...",
                "Mas essas toxinas começaram a afetar outros organismos no ecossistema.",
                "Com o tempo, as pragas evoluíram e tornaram-se resistentes.",
                "Isso forçou o uso de toxinas ainda mais potentes, agravando o problema."
            );
        } else if (metodo === "Mecanismos de Defesa") {
            textos.push(
                "Os mecanismos de defesa avançados funcionaram bem inicialmente...",
                "Porém, o custo de produção aumentou significativamente.",
                "Além disso, as plantas com defesas melhoradas cresceram mais lentamente...",
                "Reduzindo a produtividade agrícola em algumas áreas."
            );
        }
    } else if (tipo === "herbicidas" && tecnica === "crispr") {
        if (metodo === "Desativação de Herbicidas") {
            textos.push(
                "As plantas desativaram os herbicidas específicos com sucesso...",
                "Mas isso levou à proliferação de ervas daninhas resistentes.",
                "Agricultores tiveram que usar mais herbicidas, contaminando o solo e a água.",
                "Eventualmente, a produção agrícola foi severamente afetada."
            );
        } else if (metodo === "Neutralização de Herbicidas") {
            textos.push(
                "As plantas conseguiram neutralizar alguns herbicidas...",
                "Mas a eficácia foi variável, causando problemas em diferentes regiões.",
                "Em algumas áreas, o acúmulo de resíduos tóxicos se tornou um problema grave.",
                "A biodiversidade local foi comprometida, afetando a saúde dos ecossistemas."
            );
        }
    } else if (tecnica === "transgenia") {
        if (metodo === "Substâncias Repelentes") {
            textos.push(
                "As substâncias repelentes produzidas pelas plantas foram eficazes no início...",
                "Mas com o tempo, as pragas desenvolveram resistência a esses compostos.",
                "Isso levou a um ciclo de aumento da dosagem e novos surtos de pragas."
            );
        } else if (metodo === "Resistência Através de Cruzamento") {
            textos.push(
                "O cruzamento com outras variedades deu resultados estáveis...",
                "Mas foi um processo lento e menos específico.",
                "Apesar de ser seguro, a eficácia foi limitada...",
                "E exigiu mais tempo para resultados significativos."
            );
        }
    } else if (tecnica === "proteinas") {
        if (metodo === "Resistência Múltipla") {
            textos.push(
                "As proteínas de resistência múltipla funcionaram bem contra vários herbicidas...",
                "Mas o custo de produção e estabilidade das proteínas foi um grande desafio.",
                "Isso resultou em uma menor adoção da tecnologia e problemas em áreas de baixa renda."
            );
        } else if (metodo === "Degradação de Herbicidas no Solo") {
            textos.push(
                "A modificação para degradação dos herbicidas no solo foi inovadora...",
                "Mas gerou resíduos complexos que se acumularam ao longo do tempo.",
                "Esses resíduos tiveram impactos desconhecidos nos ecossistemas locais.",
                "Eventualmente, a sustentabilidade do projeto foi questionada."
            );
        }
    }

    exibirTexto(textos, () => {
        mostrarOpcoesFinais(tipo, "largaEscala"); 
    });
}

function mostrarOpcoesFinais(tipo, escala) {
    const guia_e_chefe = `cenas/guia_e_chefe.png?${new Date().getTime()}`;
    mostrarGif(guia_e_chefe); 
    exibirTexto([
        `${playerName}, você optou por continuar com ${escala === "limitado" ? "Testes Limitados e Controlados" : "Testes em Larga Escala"}.`,
        "Agora, você deve decidir como proceder com os resultados.",
        "Você quer encobrir e continuar o projeto ou cancelar o projeto?"
    ], () => {
        caixa_dinamica.innerHTML = '';

        const escolha1 = document.createElement('button');
        escolha1.innerText = "Encobrir os problemas e continuar";
        escolha1.addEventListener('click', () => {
            mostrarGif(guia_e_chefe);
            removerBotoes();
            calcularResultadoFinal(tipo, escala, "encobrir");
        });

        const escolha2 = document.createElement('button');
        escolha2.innerText = "Tentar cancelar o projeto";
        escolha2.addEventListener('click', () => {
            mostrarGif(guia_e_chefe); 
            removerBotoes();
            mostrarCancelarProjeto(tipo, escala);
        });

        caixa_dinamica.appendChild(escolha1);
        caixa_dinamica.appendChild(escolha2);
    });
}

function mostrarCancelarProjeto(tipo, escala) {
    const chefe_satisfeito = `cenas/chefe_satisfeito.gif?${new Date().getTime()}`;
    mostrarGif(chefe_satisfeito);
    exibirTexto([
        `${playerName}, você decidiu tentar cancelar o projeto.`,
        "Agora você deve decidir como lidar com a situação:",
        "Você vai expor a empresa ou relatar os problemas ao chefe?"
    ], () => {
        caixa_dinamica.innerHTML = '';

        const escolha1 = document.createElement('button');
        escolha1.innerText = "Expor a Empresa";
        escolha1.addEventListener('click', () => {
            mostrarGif(chefe_satisfeito);
            removerBotoes();
            calcularResultadoFinal(tipo, escala, "expor");
        });

        const escolha2 = document.createElement('button');
        escolha2.innerText = "Relatar ao Chefe";
        escolha2.addEventListener('click', () => {
            mostrarGif(chefe_satisfeito);
            removerBotoes();
            calcularResultadoFinal(tipo, escala, "relatar");
        });

        caixa_dinamica.appendChild(escolha1);
        caixa_dinamica.appendChild(escolha2);
    });
}

function calcularResultadoFinal(tipo, escala, acao) {
    const cenarios = [];
    let impactoGlobal, mortes, areasAfetadas, economia, inflacao, fome;

    if (tipo === "pragas" && escala === "limitado" && acao === "relatar") {
        cenarios.push(
            { gif: 'cenas/chefe_putin.png', textos: [
                `${playerName} decidiu relatar os problemas ao chefe...`,
                "O chefe discorda veementemente...",
                "Afirmando que o projeto é vital para o futuro da empresa e do mundo."
            ]},
            { gif: 'cenas/empresa.gif', textos: [
                `${playerName} perde o cargo e é substituído(a) por outro cientista...`,
                "Esse novo cientista decide continuar o projeto sem alterações.",
                "O novo cientista, pressionado pela corporação..."
            ]},
            { gif: 'cenas/calamidade02.png', textos: [
                "Decide expandir o uso das sementes modificadas em algumas regiões...",
                "Dentro de 2 anos, as pragas começam a desenvolver resistência rapidamente,",
                "Exigindo o uso de pesticidas mais fortes."
            ]},
            { gif: 'cenas/calamidade04.png', textos: [
                "O solo nas áreas de teste começa a se degradar,",
                "com a biodiversidade local sofrendo enormes impactos.",
                "A contaminação das fontes de água torna-se um problema crescente,"
            ]},
            { gif: 'cenas/calamidade03.png', textos: [
                "afetando diretamente as populações rurais.",
                "Dentro de 5 anos, a produção agrícola cai drasticamente,",
                "levando a uma escassez de alimentos em diversas regiões...",
                "Essa escassez se transforma em uma crise alimentar,",
                "afetando milhões de pessoas nas áreas mais pobres."
            ]}
        );
        impactoGlobal = "Moderado";
        mortes = "200 mil";
        areasAfetadas = "10% das terras agrícolas";
        economia = "Crise econômica moderada em nível local.";
        inflacao = "A inflação regional subiu para 15%";
        fome = "5% da população rural afetada pela fome.";

    } else if (tipo === "pragas" && escala === "limitado" && acao === "expor") {
        cenarios.push(
            { gif: 'cenas/expor.png', textos: [
                `${playerName} decidiu expor os perigos associados ao projeto da Soja Titã...`,
                "Utilizando vídeos e postagens detalhadas,",
                `${playerName} desencadeia um linchamento online contra a AGROCORP...`,
                "As ações da empresa caem 40% em apenas duas semanas,",
                "com uma crescente pressão pública por transparência."
            ]},
            { gif: 'cenas/calamidade01.png', textos: [
                "A empresa, temendo maiores repercussões, decide cancelar o projeto,",
                "limitando os danos às áreas de teste.",
                `Entretanto, a reputação de ${playerName} é abalada,`,
                "e ele se torna alvo de ataques online e físicos."
            ]},
            { gif: 'cenas/calamidade04.png', textos: [
                `Após alguns meses de perseguição, ${playerName} é brutalmente assassinado(a),`,
                "revelando-se mais tarde que a empresa tinha ligações com a máfia...",
                "Mesmo assim, as consequências para a AGROCORP são severas,",
                "com a economia local afetada por anos.",
                "Eventualmente, a economia se recupera...",
                "Mas a confiança na biotecnologia agrícola permanece abalada por anos."
            ]}
        );
        impactoGlobal = "Baixo";
        mortes = "Menos de 10 mil diretamente relacionadas ao projeto.";
        areasAfetadas = "5% das terras agrícolas.";
        economia = "Recuperação econômica moderada, com queda temporária nas ações.";
        inflacao = "A inflação temporária atingiu 5%.";
        fome = "2% da população rural afetada pela fome.";

    } else if (tipo === "pragas" && escala === "largaEscala" && acao === "relatar") {
        cenarios.push(
            { gif: 'cenas/chefe_putin.png', textos: [
                `${playerName} decidiu relatar os problemas ao chefe...`,
                "O chefe, no entanto, discordou veementemente...",
                "Afirmando que o projeto era essencial para o futuro da empresa e do mundo."
            ]},
            { gif: 'cenas/empresa.gif', textos: [
                `${playerName} foi então removido do cargo e substituído(a) por outro cientista...`,
                "O novo cientista, pressionado pela corporação...",
                "Decidiu expandir o projeto em larga escala, ignorando os alertas..."
            ]},
            { gif: 'cenas/calamidade02.png', textos: [
                "No início, os resultados são promissores...",
                "Com um aumento significativo na produção agrícola."
            ]},
            { gif: 'cenas/calamidade03.png', textos: [
                "No entanto, dentro de 3 anos, as pragas se adaptam rapidamente às modificações,",
                "tornando-se mais resistentes.",
                "Os pesticidas usados para combater as novas pragas se tornam cada vez mais tóxicos,",
                "afetando o solo e a saúde humana."
            ]},
            { gif: 'cenas/suicidios.png', textos: [
                "Vastas áreas agrícolas se tornam inférteis,",
                "levando a uma redução maciça na produção de alimentos.",
                "O colapso agrícola resulta em uma fome global,",
                "afetando principalmente países em desenvolvimento.",
                "Governos tentam intervir com importações e ajuda humanitária,",
                "mas a escala do desastre é esmagadora.",
                "Dentro de 5 anos...",
                "Cerca de 1 milhão de pessoas morrem de fome ou doenças relacionadas à desnutrição."
            ]}
        );
        impactoGlobal = "Alto";
        mortes = "1 milhão de pessoas diretamente afetadas pela fome.";
        areasAfetadas = "30% das terras agrícolas globais.";
        economia = "Crise econômica global severa, com inflação global subindo 20%.";
        inflacao = "A inflação global subiu para 20% devido ao colapso agrícola.";
        fome = "10% da população mundial afetada pela fome.";

    } else if (tipo === "pragas" && escala === "largaEscala" && acao === "expor") {
        cenarios.push(
            { gif: 'cenas/expor.png', textos: [
                `${playerName} decidiu expor os perigos associados ao projeto da Soja Titã...`,
                `A campanha de ${playerName} leva a uma queda abrupta nas ações da AGROCORP,`,
                "com uma perda de 50% em 3 meses..."
            ]},
            { gif: 'cenas/calamidade01.png', textos: [
                "Pressionada pelo público e investidores, a empresa cancela o projeto,",
                "mas o dano já foi feito."
            ]},
            { gif: 'cenas/calamidade02.png', textos: [
                "As áreas afetadas pela soja geneticamente modificada sofrem com a contaminação do solo,",
                "levando à desertificação.",
                "A recuperação dessas áreas é lenta e cara,",
                "com muitos agricultores abandonando suas terras."
            ]},
            { gif: 'cenas/calamidade04.png', textos: [
                `Dentro de 5 anos, ${playerName} é assassinado por um grupo radical,`,
                "que o culpa pela crise econômica.",
                "Mesmo após sua morte...",
                "A reputação da AGROCORP e da biotecnologia agrícola é gravemente danificada.",
                "A crise econômica global persiste,",
                "com uma inflação elevada e um declínio prolongado na produção agrícola."
            ]}
        );
        impactoGlobal = "Alto";
        mortes = "500 mil mortes diretamente relacionadas ao projeto.";
        areasAfetadas = "25% das terras agrícolas globais.";
        economia = "Crise econômica global moderada, com inflação subindo 15%.";
        inflacao = "A inflação global subiu para 15% devido ao impacto na produção agrícola.";
        fome = "15% da população rural afetada pela fome.";

    } else if (tipo === "herbicidas" && escala === "limitado" && acao === "relatar") {
        cenarios.push(
            { gif: 'cenas/chefe_putin.png', textos: [
                `${playerName} decidiu relatar os problemas ao chefe...`,
                "O chefe, no entanto, discordou veementemente...",
                "Afirmando que o projeto era essencial para o futuro da empresa e do mundo."
            ]},
            { gif: 'cenas/empresa.gif', textos: [
                `${playerName} foi então removido do cargo e substituído(a) por outro cientista...`,
                "O novo cientista decidiu continuar o projeto em áreas limitadas,",
                `sem considerar as preocupações de ${playerName}.`
            ]},
            { gif: 'cenas/calamidade02.png', textos: [
                "Dentro de 2 anos, ervas daninhas começam a desenvolver resistência...",
                "Resistência aos herbicidas aplicados nas plantações...",
                "Para conter essas ervas,",
                "os agricultores aumentam a quantidade e a toxicidade dos herbicidas,",
                "afetando o solo e a água."
            ]},
            { gif: 'cenas/calamidade03.png', textos: [
                "O solo nas áreas afetadas começa a se tornar infértil,",
                "e a contaminação da água leva a surtos de doenças.",
                "A produção agrícola cai,",
                "levando a uma crise alimentar nas regiões mais pobres e menos desenvolvidas.",
                "Tentativas de reverter a situação são insuficientes, e dentro de 5 anos,",
                "meio milhão de pessoas morrem de fome."
            ]},
            { gif: 'cenas/calamidade04.png', textos: [
                "A economia dessas regiões entra em colapso,",
                "com a inflação aumentando rapidamente devido à escassez de alimentos."
            ]}
        );
        impactoGlobal = "Alto";
        mortes = "500 mil pessoas afetadas diretamente pela crise alimentar.";
        areasAfetadas = "15% das terras agrícolas.";
        economia = "Crise econômica significativa em nível regional, com aumento de 10% na inflação.";
        inflacao = "A inflação regional subiu para 10%.";
        fome = "7% da população rural afetada pela fome.";

    } else if (tipo === "herbicidas" && escala === "limitado" && acao === "expor") {
        cenarios.push(
            { gif: 'cenas/expor.png', textos: [
                `${playerName} decidiu expor os perigos associados ao projeto da Soja Titã...`,
                `Com a ajuda da mídia, ${playerName} lança uma campanha online,`,
                "revelando os riscos do projeto..."
            ]},
            { gif: 'cenas/calamidade01.png', textos: [
                "As ações da AGROCORP caem 35% em 4 semanas,",
                "A empresa se vê pressionada a cancelar o projeto.",
                "O cancelamento ocorre...",
                "Mas não antes de causar danos significativos,",
                "Danos às áreas de teste e às comunidades locais."
            ]},
            { gif: 'cenas/calamidade03.png', textos: [
                "Dentro de 2 anos, as áreas afetadas começam a se recuperar,",
                "mas o processo é lento e caro.",
                `Infelizmente, ${playerName} é alvo de vingança por parte da empresa...`,
                "Sendo assassinado(a)...",
                "Apesar disso...",
                "A exposição leva a uma maior fiscalização de projetos de engenharia genética."
            ]},
            { gif: 'cenas/calamidade02.png', textos: [
                "A economia se recupera gradualmente,",
                "mas a confiança pública na biotecnologia é abalada por muito tempo."
            ]}
        );
        impactoGlobal = "Moderado";
        mortes = "100 mil mortes relacionadas ao projeto.";
        areasAfetadas = "10% das terras agrícolas.";
        economia = "Recuperação econômica moderada, com inflação subindo 7%.";
        inflacao = "A inflação subiu para 7%, mas foi controlada.";
        fome = "5% da população afetada pela fome.";

    } else if (tipo === "herbicidas" && escala === "largaEscala" && acao === "relatar") {
        cenarios.push(
            { gif: 'cenas/chefe_putin.png', textos: [
                `${playerName} decidiu relatar os problemas ao chefe...`,
                "O chefe, no entanto, discordou veementemente...",
                "Afirmando que o projeto era essencial para o futuro da empresa e do mundo."
            ]},
            { gif: 'cenas/empresa.gif', textos: [
                `${playerName} foi então removido do cargo e substituído(a) por outro cientista...`,
                "O novo cientista, ignorando os avisos de ${playerName},",
                "decide expandir o projeto em larga escala..."
            ]},
            { gif: 'cenas/calamidade02.png', textos: [
                "Inicialmente, o projeto parece ser um sucesso,",
                "com um aumento na produção agrícola."
            ]},
            { gif: 'cenas/calamidade04.png', textos: [
                "Mas dentro de 3 anos, as ervas daninhas começam a desenvolver resistência,",
                "tornando o uso de herbicidas ineficaz.",
                "Para conter as ervas resistentes, os agricultores usam cada vez mais herbicidas,",
                "contaminando solos e corpos d'água."
            ]},
            { gif: 'cenas/calamidade03.png', textos: [
                "Essa contaminação leva a um colapso ecológico,",
                "com impactos devastadores sobre a fauna e a flora locais.",
                "A fome global aumenta à medida que grandes áreas agrícolas se tornam inférteis,",
                "causando uma crise humanitária."
            ]},
            { gif: 'cenas/suicidio.gif', textos: [
                "Tentativas de mitigação falham, e dentro de uma década,",
                "100 milhões de pessoas morrem devido à fome e doenças...",
                "Devastado pela culpa de ter participado do projeto...",
                `${playerName} acaba tirando a própria vida.`
            ]}
        );
        impactoGlobal = "Extremo";
        mortes = "100 milhões de mortes relacionadas à crise.";
        areasAfetadas = "60% das terras agrícolas globais.";
        economia = "Colapso econômico global severo, com inflação subindo 30%.";
        inflacao = "A inflação global subiu para 30% devido à crise alimentar.";
        fome = "15% da população mundial afetada pela fome.";

    } else if (tipo === "herbicidas" && escala === "largaEscala" && acao === "expor") {
        cenarios.push(
            { gif: 'cenas/expor.png', textos: [
                `${playerName} decidiu expor os perigos associados ao projeto da Soja Titã...`,
                `A campanha de ${playerName} resulta em uma queda de 60% nas ações da AGROCORP.`,
                "O projeto é cancelado..."
            ]},
            { gif: 'cenas/calamidade01.png', textos: [
                "Mas os danos ecológicos já estavam em curso e são irreversíveis em muitas áreas.",
                "A desertificação de grandes regiões agrícolas",
                "leva a uma queda abrupta na produção de alimentos."
            ]},
            { gif: 'cenas/calamidade03.png', textos: [
                "Dentro de 5 anos, as consequências econômicas se agravam,",
                "com um aumento significativo da fome mundial.",
                `A situação se deteriora a tal ponto que ${playerName} é assassinado em casa,`,
                "quando pessoas desesperadas invadem sua residência em busca de comida,",
                "em uma cidade caótica e selvagem..."
            ]},
            { gif: 'cenas/suicidios.png', textos: [
                "As tensões sociais e econômicas persistem por décadas,",
                "com muitos países lutando para se recuperar da catástrofe.",
                "As ações da AGROCORP nunca se recuperam totalmente,",
                "permanecendo baixas por décadas."
            ]}
        );
        impactoGlobal = "Extremo";
        mortes = "50 milhões de mortes diretamente relacionadas ao projeto.";
        areasAfetadas = "40% das terras agrícolas globais.";
        economia = "Crise econômica global severa, com inflação subindo 25%.";
        inflacao = "A inflação global subiu para 25%.";
        fome = "20% da população mundial afetada pela fome.";

    } else if (tipo === "pragas" && escala === "limitado" && acao === "encobrir") {
        cenarios.push(
            { gif: 'cenas/empresa.gif', textos: [
                `${playerName} decidiu encobrir os problemas e continuar o projeto...`,
                "A soja resistente a pragas continua a ser usada,"
            ]},
            { gif: 'cenas/calamidade04.png', textos: [
                "Mas as pragas desenvolvem resistência em apenas 2 anos...",
                "O aumento do uso de pesticidas leva à degradação do solo",
                "e contaminação de fontes de água."
            ]},
            { gif: 'cenas/calamidade03.png', textos: [
                "Dentro de 3 anos...",
                "Vastas áreas agrícolas começam a sofrer com uma queda na produtividade.",
                "A escassez de alimentos afeta inicialmente as áreas rurais,",
                "mas logo se espalha para as regiões urbanas."
            ]},
            { gif: 'cenas/suicidio.gif', textos: [
                "A crise alimentar leva a uma migração em massa das áreas mais afetadas,",
                "agravando ainda mais a situação.",
                "Devastado pela culpa e pela incapacidade de reverter os danos...",
                `${playerName} comete suicídio 4 anos após o início do projeto.`
            ]}
        );
        impactoGlobal = "Moderado";
        mortes = "100 mil mortes relacionadas à crise alimentar.";
        areasAfetadas = "20% das terras agrícolas.";
        economia = "Crise econômica regional, com inflação subindo 12%.";
        inflacao = "A inflação regional subiu para 12%.";
        fome = "5% da população rural afetada pela fome.";

    } else if (tipo === "pragas" && escala === "largaEscala" && acao === "encobrir") {
        cenarios.push(
            { gif: 'cenas/empresa.gif', textos: [
                `${playerName} decidiu encobrir os problemas e continuar o projeto...`,
                "A soja geneticamente modificada é lançada globalmente,",
                "mas os problemas ecológicos surgem rapidamente..."
            ]},
            { gif: 'cenas/calamidade03.png', textos: [
                "A produção agrícola global começa a colapsar,",
                "levando a uma crise que atinge principalmente os países em desenvolvimento.",
                "O aumento do uso de pesticidas resulta na contaminação de vastas áreas de solo e água."
            ]},
            { gif: 'cenas/calamidade04.png', textos: [
                "Governos tentam intervir,",
                "mas a escala do problema é muito grande para ser contida de forma eficaz.",
                "Em meio ao colapso, milhões de pessoas são deslocadas de suas terras,",
                "gerando crises de refugiados em várias regiões."
            ]},
            { gif: 'cenas/suicidio.gif', textos: [
                `${playerName}, incapaz de lidar com a devastação causada pelo projeto...`,
                "Comete suicídio em 3 anos..."
            ]}
        );
        impactoGlobal = "Alto";
        mortes = "10 milhões de mortes relacionadas à crise.";
        areasAfetadas = "40% das terras agrícolas globais.";
        economia = "Crise econômica global, com inflação subindo 20%.";
        inflacao = "A inflação global subiu para 20% devido à crise alimentar.";
        fome = "10% da população mundial afetada pela fome.";

    } else if (tipo === "herbicidas" && escala === "limitado" && acao === "encobrir") {
        cenarios.push(
            { gif: 'cenas/empresa.gif', textos: [
                `${playerName} decidiu encobrir os problemas e continuar o projeto...`,
                "A soja resistente a herbicidas continua a ser usada em áreas limitadas,",
                "mas logo as ervas daninhas desenvolvem resistência..."
            ]},
            { gif: 'cenas/calamidade02.png', textos: [
                "Os agricultores aumentam o uso de herbicidas,",
                "levando à contaminação do solo e da água nas regiões afetadas."
            ]},
            { gif: 'cenas/calamidade04.png', textos: [
                "A produção agrícola começa a cair, e a crise alimentar se instala,",
                "afetando principalmente as regiões mais pobres."
            ]},
            { gif: 'cenas/suicidio.gif', textos: [
                "Os governos locais tentam mitigar a crise, mas as intervenções são ineficazes.",
                `${playerName}, devastado pelo impacto do projeto e pela culpa...`,
                "comete suicídio 4 anos depois..."
            ]}
        );
        impactoGlobal = "Alto";
        mortes = "500 mil mortes relacionadas à crise.";
        areasAfetadas = "15% das terras agrícolas.";
        economia = "Crise econômica regional, com inflação subindo 15%.";
        inflacao = "A inflação regional subiu para 15% com o aumento nos preços dos alimentos.";
        fome = "7% da população afetada pela fome.";

    } else if (tipo === "herbicidas" && escala === "largaEscala" && acao === "encobrir") {
        cenarios.push(
            { gif: 'cenas/empresa.gif', textos: [
                `${playerName} decidiu encobrir e continuar o projeto...`,
                "A soja resistente a herbicidas é adotada globalmente,",
                "e inicialmente, a produtividade aumenta..."
            ]},
            { gif: 'cenas/calamidade04.png', textos: [
                "Mas dentro de poucos anos, as ervas daninhas desenvolvem resistência,",
                "exigindo quantidades crescentes de herbicidas.",
                "O uso excessivo de herbicidas contamina solos e corpos d'água,",
                "levando a um colapso ambiental em larga escala."
            ]},
            { gif: 'cenas/suicidios.png', textos: [
                "Governos e organizações internacionais tentam intervir, mas o dano já é irreversível.",
                "Dentro de uma década, 500 milhões de pessoas morrem devido à fome,",
                "doenças relacionadas e conflitos sociais..."
            ]},
            { gif: 'cenas/suicidio.gif', textos: [
                `${playerName}, incapaz de suportar o peso da culpa...`,
                "comete suicídio em meio ao colapso global..."
            ]}
        );
        impactoGlobal = "Extremo";
        mortes = "500 milhões de mortes relacionadas à crise.";
        areasAfetadas = "70% das terras agrícolas globais.";
        economia = "Colapso econômico global total, com inflação subindo 35%.";
        inflacao = "A inflação global subiu para 35% devido ao colapso total da economia.";
        fome = "30% da população mundial afetada pela fome.";
    }

    function mostrarCenario(index) {
        if (index < cenarios.length) {
            const cenario = cenarios[index];
            mostrarGif(cenario.gif);
            exibirTextoSequencial(cenario.textos, () => {
                setTimeout(() => mostrarCenario(index + 1), 1000);
            });
        } else {
            mostrarEstatisticas();
        }
    }

    function exibirTextoSequencial(textos, callback, textoIndex = 0) {
        if (textoIndex < textos.length) {
            exibirTexto([textos[textoIndex]], () => {
                setTimeout(() => exibirTextoSequencial(textos, callback, textoIndex + 1), 1000);
            });
        } else {
            callback();
        }
    }

    function mostrarEstatisticas() {
        const estatisticas = [
            `Impacto global: ${impactoGlobal}`,
            `Mortes: ${mortes}`,
            `Áreas afetadas: ${areasAfetadas}`,
            `Recuperação econômica: ${economia}`,
            `Inflação: ${inflacao}`,
            `Fome: ${fome}`
        ];
        exibirTextoSequencial(estatisticas, mostrarBonecoT);
    }

    function mostrarBonecoT() {
        const musicaSombria = new Audio('sons/bg/sombrio.mp3');
        musicaSombria.loop = true;
        musicaSombria.play();
        mostrarGif('cenas/t.png');

        const textosBonecoT = [
            "O tempo está se esgotando... A Terra, a natureza...",
            "Está implorando por um respiro.",
            "Vivemos em um mundo onde produzimos alimento suficiente para todos,",
            "mas ainda assim, muitos passam fome...",
            "A desigualdade social nos corrói...",
            "enquanto as prateleiras de uns transbordam...",
            "E os pratos de outros permanecem vazios...",
            "Empresas, guiadas pelo lucro acima de tudo...",
            "Envenenam o solo e a água com agrotóxicos,",
            "ignorando o preço real que a natureza paga.",
            "Estamos presos em um ciclo onde o curto prazo dita as regras,",
            "onde o crescimento econômico justifica a destruição ambiental.",
            "Mas a sociedade precisa olhar além do imediato...",
            "precisamos de uma mudança que considere o futuro de todos, não apenas de alguns.",
            "É hora de reavaliar nossas prioridades, de colocar a vida,",
            "a saúde, e o bem-estar do planeta acima dos números...",
            "A Terra já deu seu aviso, e o tempo para agir é agora,",
            "antes que o ciclo se complete e o ponto de retorno se perca para sempre..."
        ];
        exibirTextoSequencial(textosBonecoT, mostrarBotaoReiniciar);
    }

    function mostrarBotaoReiniciar() {
        caixa_texto.style.display = 'none';
        const uniqueSrc = `cenas/empresa.gif?${new Date().getTime()}`;
        mostrarGif(uniqueSrc);
        caixa_dinamica.innerHTML = '';
        const botaoReiniciar = document.createElement('button');
        botaoReiniciar.innerText = "Reiniciar Jogo";
        botaoReiniciar.addEventListener('click', () => location.reload());
        caixa_dinamica.appendChild(botaoReiniciar);
    }

    mostrarCenario(0);
}


function removerBotoes() {
    while (caixa_dinamica.firstChild) {
        caixa_dinamica.removeChild(caixa_dinamica.firstChild);
    }
}

function inicializar() {
    const logo = document.createElement('img');
    logo.src = 'cenas/logo.gif';
    logo.id = 'logo';
    logo.style.opacity = 1;
    logo.style.transition = "opacity 1s";
    caixa_fixa.appendChild(logo);
    caixa_dinamica.appendChild(criarBotaoIniciar()); 
}

document.addEventListener('DOMContentLoaded', inicializar);

