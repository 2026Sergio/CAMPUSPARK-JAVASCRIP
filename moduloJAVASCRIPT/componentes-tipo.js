class CrudTipos extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.tipos = JSON.parse(localStorage.getItem('tiposVehiculos')) || [
            { nombre: 'Moto', tarifa: 5 },
            { nombre: 'Carro', tarifa: 10 }
        ];
        this.editIndex = -1; 
        
        if(!localStorage.getItem('tiposVehiculos')) this.guardar();
    }

    connectedCallback() { this.render(); }

    guardar() {
        localStorage.setItem('tiposVehiculos', JSON.stringify(this.tipos));
        window.dispatchEvent(new CustomEvent('tipos-actualizados'));
        this.render();
    }

    
    procesar() {
        const nom = this.shadowRoot.querySelector('#nom').value;
        const tar = this.shadowRoot.querySelector('#tar').value;
        
        if(nom && tar) {
            if(this.editIndex === -1) {
            
                this.tipos.push({ nombre: nom, tarifa: parseFloat(tar) });
            } else {
        
                this.tipos[this.editIndex] = { nombre: nom, tarifa: parseFloat(tar) };
                this.editIndex = -1; 
            }
            this.guardar();
        }
    }

    prepararEdicion(index) {
        this.editIndex = index;
        this.render(); 
        
        const t = this.tipos[index];
        this.shadowRoot.querySelector('#nom').value = t.nombre;
        this.shadowRoot.querySelector('#tar').value = t.tarifa;
    }

    eliminar(index) {
        if(confirm("¿Seguro que quieres borrar este tipo?")) {
            this.tipos.splice(index, 1);
            this.editIndex = -1; 
            this.guardar();
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            .crud-box { background: rgba(0,0,0,0.6); padding: 20px; border-radius: 10px; color: white; font-family: sans-serif; border: 1px solid #444; }
            .form-group { margin-bottom: 15px; display: flex; gap: 10px; flex-wrap: wrap; }
            input { padding: 10px; border-radius: 5px; border: none; flex: 1; min-width: 120px; }
            #btn-accion { cursor: pointer; padding: 10px 20px; background: ${this.editIndex === -1 ? '#27ae60' : '#f39c12'}; color: white; border: none; border-radius: 5px; font-weight: bold; }
            table { width: 100%; margin-top: 15px; border-collapse: collapse; }
            th { text-align: left; border-bottom: 2px solid #666; padding: 8px; }
            td { padding: 8px; border-bottom: 1px solid #444; }
            .btn-del { background: #e74c3c; cursor: pointer; color: white; border: none; border-radius: 3px; padding: 5px 8px; }
            .btn-edit { background: #3498db; cursor: pointer; color: white; border: none; border-radius: 3px; padding: 5px 8px; margin-right: 5px; }
        </style>
        <div class="crud-box">
            <h3>Configuración de Tarifas</h3>
            <div class="form-group">
                <input type="text" id="nom" placeholder="Nombre (Ej: Bus)">
                <input type="number" id="tar" placeholder="Precio Q">
                <button id="btn-accion">${this.editIndex === -1 ? 'Agregar' : 'Actualizar'}</button>
            </div>
            <table>
                <thead><tr><th>Tipo</th><th>Tarifa</th><th>Acciones</th></tr></thead>
                <tbody>
                    ${this.tipos.map((t, i) => `
                        <tr>
                            <td>${t.nombre}</td>
                            <td>Q${t.tarifa}</td>
                            <td>
                                <button class="btn-edit" data-i="${i}">Editar</button>
                                <button class="btn-del" data-i="${i}">X</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;

        this.shadowRoot.querySelector('#btn-accion').onclick = () => this.procesar();
        
        this.shadowRoot.querySelectorAll('.btn-edit').forEach(btn => {
            btn.onclick = () => this.prepararEdicion(btn.dataset.i);
        });

        this.shadowRoot.querySelectorAll('.btn-del').forEach(btn => {
            btn.onclick = () => this.eliminar(btn.dataset.i);
        });
    }
}
customElements.define('crud-tipos', CrudTipos);