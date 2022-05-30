interface VeiculoInterface {
    nome?: string;
    placa?: string;
    entrada: Date | string;
}

(function () {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);
    function calcTempo(mil: number) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor(mil % 60000) / 1000;
        return `${min} m e ${sec} s`;
    }

    function patio() {
        function criar(veiculo: VeiculoInterface, salva?: boolean) {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
            <button class="delete" data-placa="${veiculo.placa}">X</button>
            </td>
            `;
            row.querySelector('.delete')?.addEventListener('click', function () {
                deletar(this.dataset.placa);
            });
            $('#patio')?.appendChild(row);

            if (salva) salvar([...carregar(), veiculo]);
        }

        function carregar(): VeiculoInterface[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        function render() {
            $('#patio')!.innerHTML = '';
            const patio = carregar();
            if (patio.length) {
                patio.forEach((veiculo) => criar(veiculo));
            }
        }

        function deletar(placa: string) {
            const { entrada, nome } = carregar().find((veiculo) => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

            if (!confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) return;
            salvar(carregar().filter((veiculo) => veiculo.placa !== placa));
            render();
        }

        function salvar(veiculos: VeiculoInterface[]) {
            localStorage.setItem('patio', JSON.stringify(veiculos));
        }

        return { criar, carregar, render, deletar, salvar };
    }

    patio().render();
    $('#cadastrar')?.addEventListener('click', () => {
        const nome = $('#nome')?.value;
        const placa = $('#placa')?.value;

        if (!(nome || placa)) {
            alert('Os campos nome e placa são obrigatórios!');
            return;
        } else {
            patio().criar({ nome, placa, entrada: new Date().toISOString() }, true);
        }
    });
})();
