$(document).ready(function () {
    cardapio.eventos.init();


});


var cardapio = {};

var MEU_CARRINHO = [];
var VALOR_CARRINHO = 0;

let proximoIdCarrinho = 1;

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
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
            MEU_CARRINHO.push(itemCarrinho);
        }

        cardapio.metodos.mensagem('Item adicionado ao carrinho', cor = 'green');

        cardapio.metodos.atualizarBadgeTotal();
        cardapio.metodos.atualizarQtdItensCarrinho();

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
                    });

                    $.each(MILK_SHAKE['coberturas'], (idCobertura, cobertura) => {
                        let coberturas = cardapio.templates.coberturas
                            .replace(/\${id}/g, cobertura.id)
                            .replace(/\${nome}/g, cobertura.name)
                            .replace(/\${idCarrinho}/g, e.idCarrinho)
                            .replace(/\${desc}/g, cobertura.desc);

                        $("#coberturas_" + e.id + "_" + e.idCarrinho).append(coberturas);
                    });


                    // se for Creme de Acaí ou Vitamina
                } else {

                    // Variável Booleana para saber se existem os arrays de acrescimo do açaí
                    const naoExistemOsArrays = !MEU_CARRINHO[i].hasOwnProperty('acrescimosComuns') && !MEU_CARRINHO[i].hasOwnProperty('acrescimosEspeciais');

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

                    let itemCarrinho = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                        .replace(/\${nome}/g, e.name)
                        .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                        .replace(/\${id}/g, e.id)
                        .replace(/\${qntd}/g, e.qntd)
                        .replace(/\${idCarrinho}/g, e.idCarrinho);

                    $("#itensCarrinho").append(itemCarrinho);
                    if (e.id.includes("1l")) {
                        $('#p-' + e.idCarrinho).text('Pode selecionar até 6 que não havera alteração no preço total, acima de 6 será cobrado R$ 1.50 por cada acrescimo comum adicional:');
                    }
                     // lista os acrescimos disponíveis para o item
                    $.each(ACRESCIMOS['acrescimos-comum'], (idAcrescimoComum, acrescimoComum) => {
                        let acrecimosComuns = cardapio.templates.acrescimoComum
                            .replace(/\${id}/g, acrescimoComum.id)
                            .replace(/\${nome}/g, acrescimoComum.name)
                            .replace(/\${idCarrinho}/g, e.idCarrinho);

                        $("#acrescimoComum_" + e.id + "_" + e.idCarrinho).append(acrecimosComuns);

                        if (MEU_CARRINHO[i].acrescimosComuns.includes(acrescimoComum)){
                            cardapio.metodos.remarcarCheckboxes(e.idCarrinho, acrescimoComum.id)
                        }
                    });

                    $.each(ACRESCIMOS['acrescimos-especiais'], (idAcrescimoEspecial, acrescimoEspecial) => {
                        let acrecimosEspeciais = cardapio.templates.acrecimosEspecial
                            .replace(/\${id}/g, acrescimoEspecial.id)
                            .replace(/\${nome}/g, acrescimoEspecial.name)
                            .replace(/\${idCarrinho}/g, e.idCarrinho)
                            .replace(/\${preco}/g, acrescimoEspecial.price.toFixed(2).replace('.', ','));

                        $("#acrescimoEspecial_" + e.id + "_" + e.idCarrinho).append(acrecimosEspeciais);

                        if (MEU_CARRINHO[i].acrescimosEspeciais.includes(acrescimoEspecial)){
                            cardapio.metodos.remarcarCheckboxes(e.idCarrinho, acrescimoEspecial.id);
                        }
                    });
                }
            });

            cardapio.metodos.carregarValores();

        }
        else {
            cardapio.metodos.carrinhoVazio();
            cardapio.metodos.carregarValores();
        }
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

        const confirmacao = confirm("Tem certeza que deseja remover este item?");

        if (confirmacao) {
            MEU_CARRINHO.splice(indice, 1);

            $('#item-carrinho_' + id).remove();

            cardapio.metodos.atualizarBadgeTotal();
            cardapio.metodos.atualizarQtdItensCarrinho();
        }

        if (MEU_CARRINHO.length == 0) {
            cardapio.metodos.carrinhoVazio();
        }
        cardapio.metodos.carregarValores();
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

            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if ((i + 1) == MEU_CARRINHO.length) {
                $('#lblValorTotal').text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
            }

        });

    },

    // adiciona um acrescimo comum ao Açaí
    adicionarOuRemoverAcrescimoComum: (idCarrinho, idAcrescimoComum) => {
        acrescimoComum = ACRESCIMOS['acrescimos-comum'].find(acrescimo => idAcrescimoComum == acrescimo.id);

        $.each(MEU_CARRINHO, function (index, item) {
            if (item.idCarrinho == idCarrinho) {
                // Verifica se o item já possui a propriedade acrescimosComuns
                if (!item.hasOwnProperty('acrescimosComuns')) {
                    Object.defineProperty(item, 'acrescimosComuns', {
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                    item.acrescimosComuns = [];
                }

                let acrescimoExistente = item.acrescimosComuns.find(acrescimo => acrescimo.id == acrescimoComum.id);

                if (!acrescimoExistente) {
                    // Adiciona novos itens de acréscimosComuns aos itens antigos
                    item.acrescimosComuns.push(acrescimoComum);

                } else {

                    item.acrescimosComuns = item.acrescimosComuns.filter(acrescimo => acrescimo !== acrescimoExistente);

                }
                return false; // Para de percorrer assim que encontrar o item
            }
        });     
    },

    // adiciona um acrescimo comum ao Açaí
    adicionarOuRemoverAcrescimoEspecial: (idCarrinho, idAcrescimoEspecial) => {
        acrescimoEspecial= ACRESCIMOS['acrescimos-especiais'].find(acrescimo => idAcrescimoEspecial == acrescimo.id);

        $.each(MEU_CARRINHO, function (index, item) {
            if (item.idCarrinho == idCarrinho) {
                // Verifica se o item já possui a propriedade acrescimosComuns
                if (!item.hasOwnProperty('acrescimosEspeciais')) {
                    Object.defineProperty(item, 'acrescimosEspeciais', {
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                    item.acrescimosEspeciais = [];
                }

                let acrescimoExistente = item.acrescimosEspeciais.find(acrescimo => acrescimo.id == acrescimoEspecial.id);

                if (!acrescimoExistente) {
                    // Adiciona novos itens de acréscimosComuns aos itens antigos
                    item.acrescimosEspeciais.push(acrescimoEspecial);

                } else {

                    item.acrescimosEspeciais = item.acrescimosEspeciais.filter(acrescimo => acrescimo !== acrescimoExistente);

                }
                return false; // Para de percorrer assim que encontrar o item
            }
        });     
    },
    
    remarcarCheckboxes: (idCarrinho, idAcrescimo) => {
        let checkbox =  $('#'+ idAcrescimo + '_' + idCarrinho);
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

    limitarCheckboxes: (checkbox) => {
        var divAvo = checkbox.closest('.acrescimosComum');

        var checkboxesNaDiv = divAvo.querySelectorAll('input[id^="sorvete_"]:checked');

        if (checkboxesNaDiv.length > 2) {
            checkbox.checked = false;
        }
    }


}


cardapio.templates = {
    item: `
    <div class="col-3 mb-3">
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
                <span class="btn-add d-flex justify-content-center align-items-center" title="Adicionar ao Carrinho" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')">
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
                <p class="price-produto"><b>R$ \${preco}</b></p>
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
                <p id="p-\${idCarrinho}">Pode selecionar até 3 que não havera alteração no preço total, acima de 3 será cobrado R$ 1.50 por cada acrescimo comum adicional:</p>

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
                <p class="price-produto"><b>R$ \${preco}</b></p>
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
        <input type="checkbox" id="\${id}_\${idCarrinho}" onchange="cardapio.metodos.adicionarOuRemoverAcrescimoComum(\${idCarrinho}, '\${id}')">
        <label for="\${id}_\${idCarrinho}">\${nome}</label>
    </div>`,
    acrecimosEspecial: `
    <div class="acrescimo">
        <input type="checkbox" id="\${id}_\${idCarrinho}" class="checkbox-custom" onchange="cardapio.metodos.adicionarOuRemoverAcrescimoEspecial(\${idCarrinho}, '\${id}')">
        <label for="\${id}_\${idCarrinho}" class="checkbox-custom-label">\${nome} <br>R$\${preco}</label>
    </div>`,

    sorvetes: `
    <div class="acrescimo">
        <input type="checkbox" id="\${desc}_\${id}_\${idCarrinho}" onchange="cardapio.metodos.limitarCheckboxes(this);">
        <label for="\${desc}_\${id}_\${idCarrinho}">\${nome}</label>
    </div>`,
    coberturas: `
    <div class="acrescimo">
        <input type="radio" id="\${desc}_\${id}_\${idCarrinho}" name="\${desc}">
        <label for="\${desc}_\${id}_\${idCarrinho}">\${nome}</label>
    </div>`,

}