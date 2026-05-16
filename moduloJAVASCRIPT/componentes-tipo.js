class CrudTipos extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.tipos = JSON.parse(localStorage.getItem('tiposVehiculos')) || [
            { nombre: 'Moto', tarifa: 5 },
            { nombre: 'Carro', tarifa: 10 }
        ];
        if(!localStorage.getItem('tiposVehiculos')) this.guardar();
    }

    connectedCallback() { this.render(); }

    guardar() {
        localStorage.setItem('tiposVehiculos', JSON.stringify(this.tipos));
        window.dispatchEvent(new CustomEvent('tipos-actualizados'));
        this.render();
    }

    agregar() {
        const nom = this.shadowRoot.querySelector('#nom').value;
        const tar = this.shadowRoot.querySelector('#tar').value;
        if(nom && tar) {
            this.tipos.push({ nombre: nom, tarifa: parseFloat(tar) });
            this.guardar();
        }
    }

    eliminar(index) {
        this.tipos.splice(index, 1);
        this.guardar();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            .crud-box { background: rgba(0,0,0,0.5); padding: 15px; border-radius: 10px; color: white; font-family: sans-serif; border: 1px solid #444; }
            input { padding: 8px; margin: 5px; border-radius: 5px; border: none; }
            button { cursor: pointer; padding: 8px; background: #27ae60; color: white; border: none; border-radius: 5px; }
            table { width: 100%; margin-top: 10px; border-collapse: collapse; }
            th { text-align: left; border-bottom: 1px solid #666; }
            .btn-del { background: #e74c3c; padding: 3px 8px; }
        </style>
        <div class="crud-box">
            <input type="text" id="nom" placeholder="Ej: Camioneta">
            <input type="number" id="tar" placeholder="Tarifa Q">
            <button id="add">Añadir Tipo</button>
            <table>
                <thead><tr><th>Tipo</th><th>Tarifa</th><th></th></tr></thead>
                <tbody>
                    ${this.tipos.map((t, i) => `
                        <tr>
                            <td>${t.nombre}</td>
                            <td>Q${t.tarifa}</td>
                            <td><button class="btn-del" data-i="${i}">X</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
        this.shadowRoot.querySelector('#add').onclick = () => this.agregar();
        this.shadowRoot.querySelectorAll('.btn-del').forEach(btn => {
            btn.onclick = () => this.eliminar(btn.dataset.i);
        });
    }
}
customElements.define('crud-tipos', CrudTipos);