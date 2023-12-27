const CELULAR_EMPRESA = '553182903387';
// Inicializa  proximoIdCarrinho com valor salvo no navegador ou o valor 1
let proximoIdCarrinho = 1;

function obterCarrinhoSalvo() {
    let carrinho = JSON.parse(localStorage.getItem('meu_carrinho')) || [];

    // Obtém o último item adicionado
    const ultimoItem = carrinho.length > 0 ? carrinho[carrinho.length - 1] : null;

    // Obtém a expiração do último item
    const ultimaExpiracao = ultimoItem ? ultimoItem.expiracao : null;

    let carrinhoAtualizado = carrinho.filter(item =>
        ultimaExpiracao > new Date().getTime()
    );

    localStorage.setItem('meu_carrinho', JSON.stringify(carrinhoAtualizado));

    if (carrinhoAtualizado.length > 0) {
        proximoIdCarrinho = localStorage.getItem('proximo_id_carrinho') || 1;
    }

    return carrinhoAtualizado;
}

$(document).ready(function () {
    cardapio.eventos.init();


});



var cardapio = {};

// Inicializa MEU_CARRINHO com dados salvos no navegador ou uma lista vazia
var MEU_CARRINHO = obterCarrinhoSalvo() || [];

var MEU_ENDERECO = null;
var VALOR_CARRINHO = 0;
var MEU_NOME = null;



cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.atualizarBadgeTotal();
        cardapio.metodos.atualizarQtdItensCarrinho();
        cardapio.metodos.carregarBotaoWhatsap();

    }
}

cardapio.metodos = {

    // obtem a lista de itens do cardápio
    obterItensCardapio: (categoria = 'acai-creme') => {
        var filtro = MENU[categoria];

        $('#itensCardapio').html('')

        $.each(filtro, (i, e) => {
            let temp = cardapio.templates.item
                .replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id);

            $('#itensCardapio').append(temp)
        });

        // remove o botao ativo
        $('.container-menu a').removeClass('active');

        // seta o menu clicado para ativo
        $('#menu-' + categoria).addClass('active')
    },

    //adicionar ao carrinho o item do cardápio
    adicionarAoCarrinho: (id) => {
        let qtd = 1

        // obter a categoria ativa
        var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

        //obtem a lista de itens
        let filtro = MENU[categoria];

        // obter o item
        let item = $.grep(filtro, (e, i) => { return e.id == id });


        if (item.length > 0) {
            // Criar um novo objeto de item com um ID de carrinho exclusivo
            let itemCarrinho = Object.assign({}, item[0]);
            itemCarrinho.idCarrinho = proximoIdCarrinho;
            proximoIdCarrinho++; // Incrementar o contador global

            itemCarrinho.qntd = qtd;

            itemCarrinho.expiracao = new Date().getTime() + 45 * 60 * 1000;
            MEU_CARRINHO.push(itemCarrinho);
        }

        cardapio.metodos.mensagem('Item adicionado ao carrinho', cor = 'green');

        cardapio.metodos.atualizarBadgeTotal();
        cardapio.metodos.atualizarQtdItensCarrinho();
        localStorage.setItem('meu_carrinho', JSON.stringify(MEU_CARRINHO));
        localStorage.setItem('proximo_id_carrinho', JSON.stringify(proximoIdCarrinho));
    },

    // atualiza o badge de totais dos botões "Meu Carrinho"
    atualizarBadgeTotal: () => {
        var total = 0;
        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd;

        });

        if (total > 0) {
            $('.botao-carrinho').removeClass('hidden');
            $('.container-total-carrinho').removeClass('hidden');
        }
        else {
            $('.botao-carrinho').addClass('hidden');
            $('.container-total-carrinho').addClass('hidden');
        }

        $('.badge-total-carrinho').html(total)
    },

    // atualiza a quantidade de itens do carrinho na parte superior do carrinho
    atualizarQtdItensCarrinho: () => {
        const qtdItens = MEU_CARRINHO.length;

        $('#qtd-itens-carrinho').text(qtdItens);

        if (qtdItens != 1) {
            $('#txt-qtd-itens-carrinho').text('Itens');
        } else {
            $('#txt-qtd-itens-carrinho').text('Item');
        }

    },

    // abrir a modal de carrinho
    abrirCarrinho: (abrir) => {
        if (abrir) {
            $('#modalCarrinho').removeClass('hidden')
            cardapio.metodos.carregarCarrinho();
        }
        else {

            $('#modalCarrinho').addClass('hidden')
        }
    },

    // altera os textos e exibe os botões das etapas
    carregarEtapa: (etapa) => {
        if (etapa == 1) {
            $('#lblTituloEtapa').text('Seu Carrinho: ');
            $('#itensCarrinho').removeClass('hidden');
            $('#localEntrega').addClass('hidden');
            $('#resumoCarrinho').addClass('hidden');

            $('.etapa').removeClass('active');
            $('.etapa1').addClass('active');

            $('#btnEtapaPedido').removeClass('hidden');
            $('#btnEtapaEndereco').addClass('hidden');
            $('#btnEtapaResumo').addClass('hidden');
            $('#btnEtapaVoltar').addClass('hidden');
            $('#container-itens-carrinho').removeClass('hidden');

        }
        if (etapa == 2) {
            $('#lblTituloEtapa').text('Endereço de entrega: ');
            $('#itensCarrinho').addClass('hidden');
            $('#localEntrega').removeClass('hidden');
            $('#resumoCarrinho').addClass('hidden');

            $('.etapa').removeClass('active');
            $('.etapa1').addClass('active');
            $('.etapa2').addClass('active');

            $('#btnEtapaPedido').addClass('hidden');
            $('#btnEtapaEndereco').removeClass('hidden');
            $('#btnEtapaResumo').addClass('hidden');
            $('#btnEtapaVoltar').removeClass('hidden');
            $('#container-itens-carrinho').addClass('hidden');
        }
        if (etapa == 3) {
            $('#lblTituloEtapa').text('Resumo do pedido: ');
            $('#itensCarrinho').addClass('hidden');
            $('#localEntrega').addClass('hidden');
            $('#resumoCarrinho').removeClass('hidden');

            $('.etapa').removeClass('active');
            $('.etapa1').addClass('active');
            $('.etapa2').addClass('active');
            $('.etapa3').addClass('active');

            $('#btnEtapaPedido').addClass('hidden');
            $('#btnEtapaEndereco').addClass('hidden');
            $('#btnEtapaResumo').removeClass('hidden');
            $('#btnEtapaVoltar').removeClass('hidden');
            $('#container-itens-carrinho').removeClass('hidden');
        }
    },

    // botão voltar etapa 
    voltarEtapa: () => {
        let etapa = $(".etapa.active").length;

        cardapio.metodos.carregarEtapa(etapa - 1);

    },

    // carrega a lista de itens do carrinho
    carregarCarrinho: () => {
        cardapio.metodos.carregarEtapa(1);


        if (MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');


            $.each(MEU_CARRINHO, (i, e) => {
                // se for milkshake
                if (e.id.includes("milk")) {

                    // chama método que verifica se Arrays de sorvetes e cobertura existem 
                    cardapio.metodos.criarArrayDeSorvetesCoberturas(i);

                    let itemCarrinho = cardapio.templates.itemCarrinho2.replace(/\${img}/g, e.img)
                        .replace(/\${nome}/g, e.name)
                        .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                        .replace(/\${id}/g, e.id)
                        .replace(/\${qntd}/g, e.qntd)
                        .replace(/\${idCarrinho}/g, e.idCarrinho);

                    $("#itensCarrinho").append(itemCarrinho);

                    // lista os sorvetes disponíveis para o item
                    $.each(MILK_SHAKE['sorvetes'], (idSorvete, sorvete) => {
                        let sorvetes = cardapio.templates.sorvetes
                            .replace(/\${id}/g, sorvete.id)
                            .replace(/\${nome}/g, sorvete.name)
                            .replace(/\${idCarrinho}/g, e.idCarrinho)
                            .replace(/\${desc}/g, sorvete.desc);

                        $("#sorvetes_" + e.id + "_" + e.idCarrinho).append(sorvetes);

                        if (MEU_CARRINHO[i].sorvetes.some(obj => obj.id === sorvete.id)) {
                            cardapio.metodos.remarcarCheckboxesSorvetes(e.idCarrinho, sorvete.id);

                        }
                    });

                    $.each(MILK_SHAKE['coberturas'], (idCobertura, cobertura) => {
                        let coberturas = cardapio.templates.coberturas
                            .replace(/\${id}/g, cobertura.id)
                            .replace(/\${nome}/g, cobertura.name)
                            .replace(/\${idCarrinho}/g, e.idCarrinho)
                            .replace(/\${desc}/g, cobertura.desc);

                        $("#coberturas_" + e.id + "_" + e.idCarrinho).append(coberturas);

                        if (MEU_CARRINHO[i].coberturas.some(obj => obj.id === cobertura.id)) {
                            cardapio.metodos.remarcarRadiosCoberturas(e.idCarrinho, cobertura.id);
                        }
                    });


                    // se for Creme de Acaí ou Vitamina
                } else {

                    // chama método cria os Arrays de acrescimos 
                    cardapio.metodos.criarArraysDeAcrescimos(i);

                    let itemCarrinho = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                        .replace(/\${nome}/g, e.name)
                        .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                        .replace(/\${id}/g, e.id)
                        .replace(/\${qntd}/g, e.qntd)
                        .replace(/\${idCarrinho}/g, e.idCarrinho);

                    $("#itensCarrinho").append(itemCarrinho);

                    if (e.id.includes("1l")) {
                        $('#p-' + e.idCarrinho).text('Pode selecionar até 6 que não havera alteração no preço total, acima de 6 será cobrado R$ 1.50 por cada acréscimo comum adicional:');
                    }

                    // lista os acrescimos comuns disponíveis para o item
                    $.each(ACRESCIMOS['acrescimos-comum'], (idAcrescimoComum, acrescimoComum) => {
                        let acrecimosComuns = cardapio.templates.acrescimoComum
                            .replace(/\${id}/g, acrescimoComum.id)
                            .replace(/\${nome}/g, acrescimoComum.name)
                            .replace(/\${idCarrinho}/g, e.idCarrinho);

                        $("#acrescimoComum_" + e.id + "_" + e.idCarrinho).append(acrecimosComuns);

                        // remarcar checkbox de acrescimo comum
                        if (MEU_CARRINHO[i].acrescimosComuns.some(obj => obj.id === acrescimoComum.id)) {
                            cardapio.metodos.remarcarCheckboxesAcrescimos(e.idCarrinho, acrescimoComum.id)
                        }
                    });

                    // lista os acrescimos especiais disponíveis para o item
                    $.each(ACRESCIMOS['acrescimos-especiais'], (idAcrescimoEspecial, acrescimoEspecial) => {
                        let acrecimosEspeciais = cardapio.templates.acrecimosEspecial
                            .replace(/\${id}/g, acrescimoEspecial.id)
                            .replace(/\${nome}/g, acrescimoEspecial.name)
                            .replace(/\${idCarrinho}/g, e.idCarrinho)
                            .replace(/\${preco}/g, acrescimoEspecial.price.toFixed(2).replace('.', ','));

                        $("#acrescimoEspecial_" + e.id + "_" + e.idCarrinho).append(acrecimosEspeciais);

                        // remarcar checkbox de acrescimo especial
                        if (MEU_CARRINHO[i].acrescimosEspeciais.some(obj => obj.id === acrescimoEspecial.id)) {
                            cardapio.metodos.remarcarCheckboxesAcrescimos(e.idCarrinho, acrescimoEspecial.id);
                        }
                    });
                }
            });

        }
        else {
            cardapio.metodos.carrinhoVazio();
        }

        cardapio.metodos.carregarValores();
    },

    // imprime o icone do carrinho vazio
    carrinhoVazio: () => {
        $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> <b>Seu carrinho está vazio.</b></p>');
    },

    // diminuir quantidade do item no carrinho
    diminuirQuantidadeCarrinho: (id) => {
        let qtdAtual = parseInt($('#qntd-carrinho_' + id).text());
        if (qtdAtual > 1) {
            $('#qntd-carrinho_' + id).text(qtdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, --qtdAtual);
        } else {
            cardapio.metodos.removerItemCarrinho(id);
        }

    },
    // aumentar quantidade do item no carrinho
    aumentarQuantidadeCarrinho: (id) => {
        let qtdAtual = parseInt($('#qntd-carrinho_' + id).text());
        $('#qntd-carrinho_' + id).html(qtdAtual + 1);
        cardapio.metodos.atualizarCarrinho(id, ++qtdAtual);

    },

    // botão remover item do carrinho
    removerItemCarrinho: (id) => {
        const indice = MEU_CARRINHO.findIndex((item) => item.idCarrinho == id.split("_")[1]);

        cardapio.metodos.animacaoeRemover(id, indice);

    },
    animacaoeRemover: (id, indice) => {
        item = $('#item-carrinho_' + id);

        // Adicione a classe de animação
        item.addClass('animated fadeOutRight');

        item.one('animationend', function () {
            item.remove();

            MEU_CARRINHO.splice(indice, 1);


            cardapio.metodos.atualizarBadgeTotal();
            cardapio.metodos.atualizarQtdItensCarrinho();
            localStorage.setItem('meu_carrinho', JSON.stringify(MEU_CARRINHO));


            if (MEU_CARRINHO.length == 0) {
                cardapio.metodos.carrinhoVazio();
            }
            cardapio.metodos.carregarValores();
        });
    },

    // atualiza o carrinho com a quantidade atual
    atualizarCarrinho: (id, qntd) => {
        let objIndex = MEU_CARRINHO.findIndex((obj) => {
            return obj.idCarrinho == id.split("_")[1]
        });
        MEU_CARRINHO[objIndex].qntd = qntd;

        // atualiza o carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();

        // atualiza os valores (R$) totais do carrinho
        cardapio.metodos.carregarValores();

    },

    // Carrega os valores de Total do Carrinho
    carregarValores: () => {
        VALOR_CARRINHO = 0;

        $('#lblValorTotal').text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => {

            let VALOR_ITEM = 0;

            if (!e.id.includes('milk')) {

                // se for acai de 1L
                if (e.id.includes('1l')) {
                    VALOR_ITEM = parseFloat(e.price) + cardapio.metodos.calcularValorAcrescimoComum1L(e.acrescimosComuns) + cardapio.metodos.calcularValorAcrescimoEspecial(e.acrescimosEspeciais);

                    // se for acai até 700ML
                } else {
                    VALOR_ITEM = parseFloat(e.price) + cardapio.metodos.calcularValorAcrescimoComum(e.acrescimosComuns) + cardapio.metodos.calcularValorAcrescimoEspecial(e.acrescimosEspeciais);
                }

            }

            // se for milkshake
            else {
                VALOR_ITEM = parseFloat(e.price);
            }

            // mostra valor do item
            $('#preco_' + e.id + '_' + e.idCarrinho).text(`R$ ${VALOR_ITEM.toFixed(2).replace('.', ',')}`);

            // atualiza valor do carrinho com valor do item * quantidade daquele item
            VALOR_CARRINHO += parseFloat(VALOR_ITEM * e.qntd);

            // mostra total do carrinho
            if ((i + 1) == MEU_CARRINHO.length) {
                $('#lblValorTotal').text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);

            }

            // salva valor do item na memória
            e.valorItem = VALOR_ITEM;

            localStorage.setItem('meu_carrinho', JSON.stringify(MEU_CARRINHO));
        });

    },

    calcularValorAcrescimoComum: (acrescimos) => {
        let totalAcrescimoComum = 0;
        // Verifica se há mais de 3 acrescimosComuns
        if (acrescimos.length > 3) {
            $.each(acrescimos.slice(3), (i, e) => {
                // Calcula o valor dos acrescimosComuns a partir do terceiro acréscimo
                totalAcrescimoComum += parseFloat(e.price);
            });
        }
        return totalAcrescimoComum;
    },

    calcularValorAcrescimoComum1L: (acrescimos) => {
        let totalAcrescimoComum = 0;
        // Verifica se há mais de 6 acrescimosComuns
        if (acrescimos.length > 6) {
            $.each(acrescimos.slice(6), (i, e) => {
                // Calcula o valor dos acrescimosComuns além dos primeiros 3
                totalAcrescimoComum += parseFloat(e.price);
            });
        }
        return totalAcrescimoComum;
    },

    calcularValorAcrescimoEspecial: (acrescimos) => {
        let totalAcrescimoEspecial = 0;
        $.each(acrescimos, (i, e) => {
            totalAcrescimoEspecial += parseFloat(e.price);
        });
        return totalAcrescimoEspecial;
    },

    criarArraysDeAcrescimos: (i) => {
        // Variável Booleana para saber se existem os arrays de acrescimo do açaí
        const naoExistemOsArrays = !MEU_CARRINHO[i].hasOwnProperty('acrescimosComuns') && !MEU_CARRINHO[i].hasOwnProperty('acrescimosEspeciais');

        // se não existir os arrays cria os dois e inicializa vazio
        if (naoExistemOsArrays) {
            Object.defineProperty(MEU_CARRINHO[i], 'acrescimosComuns', {
                writable: true,
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(MEU_CARRINHO[i], 'acrescimosEspeciais', {
                writable: true,
                enumerable: true,
                configurable: true
            });

            MEU_CARRINHO[i].acrescimosComuns = [];
            MEU_CARRINHO[i].acrescimosEspeciais = [];
        }
    },

    criarArrayDeSorvetesCoberturas: (i) => {
        // Variável Booleana para saber se existem os arrays de acrescimo do açaí
        const naoExistemOsArrays = !MEU_CARRINHO[i].hasOwnProperty('sorvetes') && !MEU_CARRINHO[i].hasOwnProperty('coberturas');

        // se não existir os arrays cria os dois e inicializa vazio
        if (naoExistemOsArrays) {
            Object.defineProperty(MEU_CARRINHO[i], 'sorvetes', {
                writable: true,
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(MEU_CARRINHO[i], 'coberturas', {
                writable: true,
                enumerable: true,
                configurable: true
            });

            MEU_CARRINHO[i].sorvetes = [];
            MEU_CARRINHO[i].coberturas = [];
        }
    },

    // adiciona um acrescimo comum ao Açaí
    adicionarOuRemoverAcrescimoComum: (idCarrinho, idAcrescimoComum) => {
        acrescimoComum = ACRESCIMOS['acrescimos-comum'].find(acrescimo => idAcrescimoComum == acrescimo.id);

        $.each(MEU_CARRINHO, function (index, item) {
            if (item.idCarrinho == idCarrinho) {

                let acrescimoExistente = item.acrescimosComuns.find(acrescimo => acrescimo.id == acrescimoComum.id);

                if (!acrescimoExistente) {
                    // Adiciona novos itens de acréscimosComuns aos itens antigos
                    item.acrescimosComuns.push(acrescimoComum);

                } else {

                    item.acrescimosComuns = item.acrescimosComuns.filter(acrescimo => acrescimo.id !== acrescimoExistente.id);

                }
                return false; // Para de percorrer assim que encontrar o item
            }
        });
    },

    // adiciona um acrescimo comum ao Açaí
    adicionarOuRemoverAcrescimoEspecial: (idCarrinho, idAcrescimoEspecial) => {
        acrescimoEspecial = ACRESCIMOS['acrescimos-especiais'].find(acrescimo => idAcrescimoEspecial == acrescimo.id);

        $.each(MEU_CARRINHO, function (index, item) {
            if (item.idCarrinho == idCarrinho) {

                let acrescimoExistente = item.acrescimosEspeciais.find(acrescimo => acrescimo.id == acrescimoEspecial.id);

                if (!acrescimoExistente) {
                    // Adiciona novos itens de acréscimosComuns aos itens antigos
                    item.acrescimosEspeciais.push(acrescimoEspecial);

                } else {

                    item.acrescimosEspeciais = item.acrescimosEspeciais.filter(acrescimo => acrescimo.id !== acrescimoExistente.id);

                }
                return false; // Para de percorrer assim que encontrar o item
            }
        });
    },

    adicionarOuRemoverSorvete: (checkbox, idCarrinho, idSorvete) => {
        sorveteEscolhido = MILK_SHAKE['sorvetes'].find(sorvete => idSorvete == sorvete.id);

        $.each(MEU_CARRINHO, function (index, item) {
            if (item.idCarrinho == idCarrinho) {

                let sorveteExistente = item.sorvetes.find(sorvete => sorveteEscolhido.id == sorvete.id);

                if (!sorveteExistente && checkbox.checked) {
                    // Adiciona novo item de sorvete aos itens antigos
                    item.sorvetes.push(sorveteEscolhido);

                } else {

                    item.sorvetes = item.sorvetes.filter(sorvete => sorveteEscolhido.id !== sorvete.id);
                }
                return false; // Para de percorrer assim que encontrar o item
            }
        });
        localStorage.setItem('meu_carrinho', JSON.stringify(MEU_CARRINHO));
    },

    adicionarOuRemoverCobertura: (checkbox, idCarrinho, idCobertura) => {
        coberturaEscolhida = MILK_SHAKE['coberturas'].find(cobertura => idCobertura == cobertura.id);

        $.each(MEU_CARRINHO, function (index, item) {
            if (item.idCarrinho == idCarrinho) {


                if (item.coberturas.length == 0) {
                    // Adiciona novo item de sorvete aos itens antigos
                    item.coberturas.push(coberturaEscolhida);
                }
                else {
                    item.coberturas.push(coberturaEscolhida);
                    item.coberturas.shift();
                }

                return false; // Para de percorrer assim que encontrar o item
            }
        });
        localStorage.setItem('meu_carrinho', JSON.stringify(MEU_CARRINHO));
    },

    remarcarCheckboxesAcrescimos: (idCarrinho, idAcrescimo) => {
        let checkbox = $('#' + idAcrescimo + '_' + idCarrinho);

        checkbox.prop('checked', true);
    },

    remarcarRadiosCoberturas: (idCarrinho, idAcrescimo) => {
        let checkbox = $('#cobertura_' + idAcrescimo + '_' + idCarrinho);

        checkbox.prop('checked', true);
    },

    remarcarCheckboxesSorvetes: (idCarrinho, idAcrescimo) => {
        let checkbox = $('#sorvete_' + idAcrescimo + '_' + idCarrinho);

        checkbox.prop('checked', true);
    },

    mostrarAcrescimos(id, mostrar) {
        if (!mostrar) {
            $('#ver-acrescimos-up-' + id).addClass('hidden');
            $('#ver-acrescimos-down-' + id).removeClass('hidden');

            setTimeout(() => {
                $('#acrescimos-' + id).addClass('slideOutUp');
                $('#sorvetes-' + id).addClass('slideOutUp');
                setTimeout(() => {

                    $('#acrescimos-' + id).removeClass('slideOutUp');
                    $('#acrescimos-' + id).addClass('hidden');
                    $('#sorvetes-' + id).removeClass('slideOutUp');
                    $('#sorvetes-' + id).addClass('hidden');
                }, 150)

            }, 200);
        }
        else {
            $('#ver-acrescimos-down-' + id).addClass('hidden');
            $('#acrescimos-' + id).removeClass('hidden');
            $('#ver-acrescimos-up-' + id).removeClass('hidden');
            $('#sorvetes-' + id).removeClass('hidden');

        }
    },


    carregarEndereco: () => {
        if (MEU_CARRINHO.length <= 0) {
            cardapio.metodos.mensagem('Seu carrinho esta vazio');
            return;
        }

        if (!cardapio.metodos.validarMilkShake()) return;

        cardapio.metodos.carregarEtapa(2);
    },

    validarMilkShake: () => {
        for (var i = 0; i < MEU_CARRINHO.length; i++) {
            var milkshake = MEU_CARRINHO[i];
            var sorvetesSelecionados = milkshake.sorvetes;

            if (milkshake.id.includes('milk') && (!sorvetesSelecionados || sorvetesSelecionados.length === 0)) {
                cardapio.metodos.mensagem('Selecione pelo menos um sabor de sorvete para o ' + milkshake.name);
                return false;
            }
        }
        return true;
    },

    // API viaCEP
    buscarCep: () => {
        var cep = $('#txtCEP').val().trim().replace(/\D/g, '');

        if (cep != '') {

            // expressão regular validadora de cep
            var validaCep = /^[0-9]{8}$/;

            if (validaCep.test(cep)) {

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                    if (!("erro" in dados)) {

                        if (dados.uf == 'MG') {
                            // atualizar os campos com os valores retornados
                            $('#txtEndereco').val(dados.logradouro);
                            $('#txtBairro').val(dados.bairro);
                            $('#txtCidade').val(dados.localidade);
                            $('#ddlUf').val(dados.uf);

                            $('#txtNumero').focus();
                        }
                        else {
                            cardapio.metodos.mensagem('Desculpe, no momento só atendemos em Minas Gerais.')
                        }


                    }
                    else {
                        cardapio.metodos.mensagem('CEP não encontrado. Se necessário preencha as informações manualmente.');

                    }
                })

            }
            else {
                cardapio.metodos.mensagem('Formato do CEP inválido.');
                $('#txtCEP').focus();
            }

        }

        else {
            cardapio.metodos.mensagem('Por favor, informe o CEP.')
            $('#txtCEP').focus();
        }
    },

    mascaraCep: (event) => {
        let input = event.target;
        const valor = input.value;


        if (!valor) {
            input.value = "";
        }

        input.value = valor.replace(/\D/g, '');
        input.value = valor.replace(/(\d{5})(\d)/, '$1-$2');

        if (input.value.length == 9) {
            cardapio.metodos.buscarCep();
        }
    },

    // validação antes de prosseguir para etapa 3
    resumoPedido: () => {
        let nome = $('#txtNome').val().trim();
        let cep = $('#txtCEP').val().trim();
        let endereco = $('#txtEndereco').val().trim();
        let bairro = $('#txtBairro').val().trim();
        let cidade = $('#txtCidade').val().trim();
        let uf = $('#ddlUf').val().trim();
        let numero = $('#txtNumero').val().trim();
        let complemento = $('#txtComplemento').val().trim();

        if (nome.length <= 3) {
            cardapio.metodos.mensagem('Por favor informe o Nome.');
            $('#txtNome').focus();
            return;
        }

        if (cep.length <= 0) {
            cardapio.metodos.mensagem('Por favor informe o CEP. Caso não tenha coloque um número qualquer');
            $('#txtCEP').focus();
            return;
        }

        if (endereco.length <= 0) {
            cardapio.metodos.mensagem('Por favor informe o Endereço.');
            $('#txtEndereco').focus();
            return;
        }

        if (bairro.length <= 0) {
            cardapio.metodos.mensagem('Por favor informe o Bairro.');
            $('#txtBairro').focus();
            return;
        }

        if (cidade.length <= 0) {
            cardapio.metodos.mensagem('Por favor informe a Cidade.');
            $('#txtCidade').focus();
            return;
        }

        if (uf == '-1') {
            cardapio.metodos.mensagem('Por favor informe o Estado (UF).');
            $('#ddlUf').focus();
            return;
        }

        if (numero.length <= 0) {
            cardapio.metodos.mensagem('Por favor informe o Número.');
            $('#txtNumero').focus();
            return;
        }

        MEU_NOME = nome;

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        }

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();

    },

    carregarResumo: () => {
        $('#listaItensResumo').html('');

        $.each(MEU_CARRINHO, (i, e) => {

            if (!e.id.includes("milk")) {
                let itemCarrinhoResumo = cardapio.templates.acaiResumo.replace(/\${id}/g, e.id)
                    .replace(/\${idCarrinho}/g, e.idCarrinho)
                    .replace(/\${img}/g, e.img)
                    .replace(/\${nome}/g, e.name)
                    .replace(/\${preco}/g, e.valorItem.toFixed(2).replace('.', ','))
                    .replace(/\${qntd}/g, e.qntd)
                    .replace(/\${qtdAcrescimos}/g, cardapio.metodos.qtdTotalDeAcrescimosAcai(e));


                $("#listaItensResumo").append(itemCarrinhoResumo);

                $.each(e.acrescimosComuns, (indiceAcrescimo, acrescimo) => {

                    let acrescimoComumResumo = cardapio.templates.acrescimosResumo.replace(/\${nome}/g, acrescimo.name);

                    $('#acrescimosResumo_' + e.id + '_' + e.idCarrinho).append(acrescimoComumResumo);

                });

                $.each(e.acrescimosEspeciais, (indiceAcrescimo, acrescimo) => {

                    let acrescimoEspecialResumo = cardapio.templates.acrescimosResumo.replace(/\${nome}/g, acrescimo.name);

                    $('#acrescimosResumo_' + e.id + '_' + e.idCarrinho).append(acrescimoEspecialResumo);

                });
            }

            else {
                let itemCarrinhoResumo = cardapio.templates.milkShakeResumo.replace(/\${id}/g, e.id)
                    .replace(/\${idCarrinho}/g, e.idCarrinho)
                    .replace(/\${img}/g, e.img)
                    .replace(/\${nome}/g, e.name)
                    .replace(/\${preco}/g, e.valorItem.toFixed(2).replace('.', ','))
                    .replace(/\${qntd}/g, e.qntd);


                $("#listaItensResumo").append(itemCarrinhoResumo);

                $.each(e.sorvetes, (indiceSorvete, sorvete) => {

                    let sorvetesResumo = cardapio.templates.acrescimosResumo.replace(/\${nome}/g, sorvete.name);

                    $('#sorvetesResumo_' + e.id + '_' + e.idCarrinho).append(sorvetesResumo);

                });

                $.each(e.coberturas, (indiceCobertura, cobertura) => {

                    let coberturaResumo = cardapio.templates.acrescimosResumo.replace(/\${nome}/g, cobertura.name);

                    $('#coberturaResumo_' + e.id + '_' + e.idCarrinho).append(coberturaResumo);

                });
            }
        });

        $('#resumoEndereco').html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);

        $('#cidadeEndereco').html(`${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`)

        cardapio.metodos.finalizarPedido();
    },

    // Atualiza o link do botão de Whatsapp
    finalizarPedido: () => {

        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {

            var texto = `Olá, gostaria de fazer um pedido em nome de *${MEU_NOME}.*\n`;
            texto += `*Já selecionei meu pedido pelo Cardápio Digital*`;
            texto += `\n\n*Itens do pedido:*\${itens}`;
            texto += '\n\n*Endereço de entrega:*';
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
            texto += `\n\n*Total (sem entrega): R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}*`;

            var itens = '';

            $.each(MEU_CARRINHO, (i, e) => {

                itens += `\n\n*${e.qntd}x ${e.name} ....... R$ ${e.valorItem.toFixed(2).replace('.', ',')}*\n`;


                if (e.id.includes('milk')) {
                    const sorvetes = e.sorvetes;
                    const coberturas = e.coberturas


                    itens += '\n    *Sorvete(s):*\n';

                    $.each(sorvetes, (i, sorvete) => {
                        const dots = cardapio.metodos.gerarPontos(sorvetes, sorvete);
                        const formattedPrice = `R$ 0,00`;
                        itens += `* ${sorvete.name} ${dots} ${formattedPrice}\n`;
                    });

                    itens += '\n    *Cobertura:*\n';

                    maxLength = Math.max(...cobertura.map(item => item.name.length));
                    $.each(coberturas, (i, cobertura) => {
                        const dots = cardapio.metodos.gerarPontos(coberturas, cobertura);
                        const formattedPrice = `R$ 0,00`;
                        itens += `* ${cobertura.name} ${dots} ${formattedPrice}\n`;
                    });
                }
                else {

                    const acrescimosComuns = e.acrescimosComuns;

                    if (acrescimosComuns.length > 0) {
                        itens += '\n    *Acréscimos Comuns:*\n';

                    }

                    $.each(acrescimosComuns, (index, acrescimo) => {

                        if (e.id.includes('1l')) {
                            if (index < 6) {
                                const dots = cardapio.metodos.gerarPontos(acrescimosComuns, acrescimo);
                                const formattedPrice = `R$ 0,00`;
                                itens += `* ${acrescimo.name} ${dots} ${formattedPrice}\n`;
                            }
                            else {
                                const dots = cardapio.metodos.gerarPontos(acrescimosComuns, acrescimo);
                                const formattedPrice = `R$ ${acrescimo.price.toFixed(2).replace('.', ",")}`;
                                itens += `* ${acrescimo.name} ${dots} ${formattedPrice}\n`;
                            }

                        } else {
                            if (index < 3) {
                                const dots = cardapio.metodos.gerarPontos(acrescimosComuns, acrescimo);
                                const formattedPrice = `R$ 0,00`;
                                itens += `* ${acrescimo.name} ${dots} ${formattedPrice}\n`;
                            }
                            else {
                                const dots = cardapio.metodos.gerarPontos(acrescimosComuns, acrescimo);
                                const formattedPrice = `R$ ${acrescimo.price.toFixed(2).replace('.', ",")}`;
                                itens += `* ${acrescimo.name} ${dots} ${formattedPrice}\n`;
                            }
                        }
                    });


                    const acrescimosEspeciais = e.acrescimosEspeciais;

                    if (acrescimosEspeciais.length > 0) {
                        itens += '\n    *Acréscimos Especiais:*\n';
                    }
                    $.each(acrescimosEspeciais, (i, acrescimo) => {
                        const dots = cardapio.metodos.gerarPontos(acrescimosComuns, acrescimo);
                        const formattedPrice = `R$ ${acrescimo.price.toFixed(2).replace('.', ",")}`;
                        itens += `* ${acrescimo.name} ${dots} ${formattedPrice}\n`;
                    });

                    itens += `\n--------------------------------------------------`;
                }

                // ultimo item
                if ((i + 1) == MEU_CARRINHO.length) {
                    texto = texto.replace(/\${itens}/g, itens);


                    let encode = encodeURIComponent(texto);
                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

                    $('#btnEtapaResumo').attr('href', URL);
                    console.log(texto);
                }
            });
        }

    },

    qtdTotalDeAcrescimosAcai: (itemDeCarrinho) => {
        return itemDeCarrinho.acrescimosComuns.length + itemDeCarrinho.acrescimosEspeciais.length;
    },

    carregarBotaoWhatsap: () => {
        $('.botao-whatsapp').attr('href', `https://wa.me/${CELULAR_EMPRESA}?text=Olá preciso de um pedido em específico, não disponível no Cardapio Digital.`)
    },

    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800)
        }, tempo);
    },

    animarBadgeTotal: () => {
        let badge = $('.botao-carrinho');
        badge.removeClass('animated bounceIn')
        badge.addClass('animated rubberBand');


        badge.on('animationend', function () {
            badge.removeClass('animated rubberBand');

        });

    },

    limitarCheckboxes: (checkbox) => {
        var divAvo = checkbox.closest('.acrescimosComum');

        var checkboxesNaDiv = divAvo.querySelectorAll('input[id^="sorvete_"]:checked');

        if (checkboxesNaDiv.length > 2) {
            checkbox.checked = false;
        }
    },

    gerarPontos: (adicionais, adicional) => {
        let maxLength = Math.max(...adicionais.map(item => item.name.length));
        const espacosEntrePontos = adicional.name.length <= 7 ? 2 : 1;
        const dots = '-'.repeat((maxLength - adicional.name.length + espacosEntrePontos));
        return dots;
    },

    titleize: (element) => {
        var inputElement = element;
        var words = inputElement.value.toLowerCase().split(" ");
        for (var a = 0; a < words.length; a++) {
            var w = words[a];
            words[a] = w.charAt(0).toUpperCase() + w.slice(1);
        }
        inputElement.value = words.join(" ");
    }
}


cardapio.templates = {
    item: `
    <div class="col-3 mb-3 wow fadeInUp">
        <div class="card card-item" id="\${id}">
            <div class="img-produto">
                <img src="\${img}" />
            </div>
            <p class="title-produto text-center mt-4">
                <b>\${nome}</b>
            </p>
            <p class="price-produto text-center">
                <b>R$ \${preco}</b>
            </p>
            <div class="add-carrinho">
                <span class="btn-add d-flex justify-content-center align-items-center" title="Adicionar ao Carrinho" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}');cardapio.metodos.animarBadgeTotal()">
                <i class="fas fa-shopping-bag"></i>
                </span>
            </div>
        </div>
    </div>
    `,
    itemCarrinho: `
    <div class="itemCarrinho" id="item-carrinho_\${id}_\${idCarrinho}">
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}"
                    alt="">
            </div>
            <div class="dados-produtos">
                <p class="title-produto"><b>\${nome}</b></p>
                <p class="price-produto"><b  id="preco_\${id}_\${idCarrinho}">R$ \${preco}</b></p>
            </div>
            <div class="add-carrinho">
                <button class="btn-purple btn-sm  ver-acrescimos hidden" id=ver-acrescimos-down-\${idCarrinho} onclick="cardapio.metodos.mostrarAcrescimos('\${idCarrinho}',true)">
                    <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn-purple btn-sm ver-acrescimos" id=ver-acrescimos-up-\${idCarrinho}  onclick="cardapio.metodos.mostrarAcrescimos('\${idCarrinho}',false)">
                    <i class="fas fa-arrow-up hd"></i> 
                </button>
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}_\${idCarrinho}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho_\${id}_\${idCarrinho}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}_\${idCarrinho}')"><i class="fas fa-plus"></i></span>
                <span class="btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}_\${idCarrinho}')"><i class="fas fa-times"></i></span>

            </div>

        </div>
        
        <div class="col-12 acrescimos animated bounceInDown" id="acrescimos-\${idCarrinho}">
                <p class="title-produto"><b>Acrescimos Comuns</b></p>
                <p id="p-\${idCarrinho}">Pode selecionar até 3 que não havera alteração no preço total, acima de 3 será cobrado R$ 1.50 por cada acréscimo comum adicional:</p>

                <div id="acrescimoComum_\${id}_\${idCarrinho}" class="acrescimosComum">

                </div>

                <p class="title-produto especial"><b>Acrescimos Especiais</b></p>

                <div id="acrescimoEspecial_\${id}_\${idCarrinho}" class="acrescimosEspecial">

                </div>
                            
        </div>
    </div>    
    `,

    itemCarrinho2: `
    <div class="itemCarrinho" id="item-carrinho_\${id}_\${idCarrinho}">
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}"
                    alt="">
            </div>
            <div class="dados-produtos">
                <p class="title-produto"><b>\${nome}</b></p>
                <p class="price-produto"><b id="preco_\${id}_\${idCarrinho}">R$ \${preco}</b></p>
            </div>
            <div class="add-carrinho">
                    <button class="btn-purple btn-sm  ver-acrescimos hidden" id=ver-acrescimos-down-\${idCarrinho} onclick="cardapio.metodos.mostrarAcrescimos('\${idCarrinho}',true)">
                    <i class="fas fa-arrow-down"></i>
                    </button>
                    <button class="btn-purple btn-sm ver-acrescimos" id=ver-acrescimos-up-\${idCarrinho}  onclick="cardapio.metodos.mostrarAcrescimos('\${idCarrinho}',false)">
                    <i class="fas fa-arrow-up hd"></i> 
                </button>
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}_\${idCarrinho}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho_\${id}_\${idCarrinho}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}_\${idCarrinho}')"><i class="fas fa-plus"></i></span>
                <span class="btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}_\${idCarrinho}')"><i class="fas fa-times"></i></span>

            </div>

        </div>
        
        <div class="col-12 acrescimos animated bounceInDown" id="sorvetes-\${idCarrinho}">
                <p class="title-produto"><b>Escolha os Sorvetes</b></p>
                <p>Podem ser selecionados até 2 sabores de sorvete: </p>

                <div id="sorvetes_\${id}_\${idCarrinho}" class="acrescimosComum">

                </div>

                <p class="title-produto coberturas"><b>Coberturas</b></p>
                <p>Escolha um sabor de cobertura: </p>

                <form>
                <div id="coberturas_\${id}_\${idCarrinho}" class="acrescimosComum">

                </div>
                </form>       
        </div>
    </div>    
    `,


    acrescimoComum: `
    <div class="acrescimo">
        <input type="checkbox" id="\${id}_\${idCarrinho}" onchange="cardapio.metodos.adicionarOuRemoverAcrescimoComum(\${idCarrinho}, '\${id}'); cardapio.metodos.carregarValores()">
        <label for="\${id}_\${idCarrinho}">\${nome}</label>
    </div>`,
    acrecimosEspecial: `
    <div class="acrescimo">
        <input type="checkbox" id="\${id}_\${idCarrinho}" class="checkbox-custom" onchange="cardapio.metodos.adicionarOuRemoverAcrescimoEspecial(\${idCarrinho}, '\${id}'); cardapio.metodos.carregarValores()">
        <label for="\${id}_\${idCarrinho}" class="checkbox-custom-label">\${nome} <br>R$\${preco}</label>
    </div>`,

    sorvetes: `
    <div class="acrescimo">
        <input type="checkbox" id="\${desc}_\${id}_\${idCarrinho}" onchange="cardapio.metodos.limitarCheckboxes(this);cardapio.metodos.adicionarOuRemoverSorvete(this, \${idCarrinho}, '\${id}')">
        <label for="\${desc}_\${id}_\${idCarrinho}">\${nome}</label>
    </div>`,

    coberturas: `
    <div class="acrescimo">
        <input type="radio" id="\${desc}_\${id}_\${idCarrinho}" name="\${desc}" onchange="cardapio.metodos.adicionarOuRemoverCobertura(this, \${idCarrinho}, '\${id}')">
        <label for="\${desc}_\${id}_\${idCarrinho}">\${nome}</label>
    </div>`,

    acaiResumo: `
        <div class="col-12 item-carrinho resumo" >
            <div class="img-produto-resumo">
                <img src="\${img}">
            </div>
            <div class="dados-produtos">

                <p class="title-produto-resumo">
                        <b>\${nome}</b>
                </p>

                <p class="price-produto-resumo">
                    <b>R$\${preco}</b>
                </p>
                <div class="acrescimos-resumo" id="acrescimosResumo_\${id}_\${idCarrinho}">
                    <b>Acréscimos (\${qtdAcrescimos}): </b>

                </div>

            </div>
            <p class="quantidade-produto-resumo">
                x <b>\${qntd}</b>
            </p>
        </div>
    `,

    milkShakeResumo: `
        <div class="col-12 item-carrinho resumo" >
            <div class="img-produto-resumo">
                <img src="\${img}">
            </div>
            <div class="dados-produtos">

                <p class="title-produto-resumo">
                        <b>\${nome}</b>
                </p>

                <p class="price-produto-resumo">
                    <b>R$\${preco}</b>
                </p>
                <div class="acrescimos-resumo" id="sorvetesResumo_\${id}_\${idCarrinho}">
                    <b>Sorvetes: </b>

                </div>

                <div class="acrescimos-resumo" id="coberturaResumo_\${id}_\${idCarrinho}">
                    <b>Cobertura: </b>

                </div>

            </div>
            <p class="quantidade-produto-resumo">
                x <b>\${qntd}</b>
            </p>
        </div>
    `,

    acrescimosResumo: `
    <div class="acrescimo">
        <b>*</b>\${nome}, 
    </div>`


}