document.addEventListener('DOMContentLoaded', function() {
    // Manejo de pestañas
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab + '-tab';
            
            // Remover activo de todos los botones y contenidos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Activar el seleccionado
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Alternar entre modos de carga
    const cargaMode = document.getElementById('carga-mode');
    const detailedForm = document.getElementById('detailed-client-form');
    const totalForm = document.getElementById('total-client-form');
    
    cargaMode.addEventListener('change', function() {
        if (this.value === 'detallada') {
            detailedForm.style.display = 'block';
            totalForm.style.display = 'none';
        } else {
            detailedForm.style.display = 'none';
            totalForm.style.display = 'block';
        }
    });
    
    // Manejo de clientes
    const clientesBody = document.getElementById('clientes-body');
    const addClienteBtn = document.getElementById('add-cliente');
    
    addClienteBtn.addEventListener('click', function() {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" class="form-control" placeholder="Nombre del cliente"></td>
            <td>
                <select class="form-control">
                    <option value="retail">Retail</option>
                    <option value="corporativo">Corporativo</option>
                    <option value="gobierno">Gobierno</option>
                    <option value="otros">Otros</option>
                </select>
            </td>
            <td><input type="number" class="form-control" placeholder="%"></td>
            <td><input type="number" class="form-control" placeholder="%"></td>
            <td>
                <select class="form-control unidad-select">
                    <!-- Opciones se llenarán dinámicamente -->
                </select>
            </td>
            <td><button class="btn btn-danger remove-row">Eliminar</button></td>
        `;
        
        clientesBody.appendChild(row);
        updateUnidadesSelects();
        
        // Agregar evento para eliminar fila
        row.querySelector('.remove-row').addEventListener('click', function() {
            row.remove();
            updateSummary();
        });
        
        // Agregar eventos para actualizar el resumen cuando cambien los datos
        const inputs = row.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', updateSummary);
        });
        
        updateSummary();
    });
    
    // Manejo de unidades de negocio
    const unidadesBody = document.getElementById('unidades-body');
    const addUnidadBtn = document.getElementById('add-unidad');
    
    addUnidadBtn.addEventListener('click', function() {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" class="form-control" placeholder="Nombre de la unidad"></td>
            <td><input type="number" class="form-control" placeholder="Costos fijos"></td>
            <td><input type="number" class="form-control" placeholder="Ventas estimadas"></td>
            <td><button class="btn btn-danger remove-row">Eliminar</button></td>
        `;
        
        unidadesBody.appendChild(row);
        
        // Agregar evento para eliminar fila
        row.querySelector('.remove-row').addEventListener('click', function() {
            row.remove();
            updateUnidadesSelects();
            updateSummary();
        });
        
        // Agregar eventos para actualizar el resumen y los selects cuando cambien los datos
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('change', function() {
                updateUnidadesSelects();
                updateSummary();
            });
        });
        
        updateUnidadesSelects();
        updateSummary();
    });
    
    // Manejo de productos/servicios
    const productosBody = document.getElementById('productos-body');
    const addProductoBtn = document.getElementById('add-producto');
    
    addProductoBtn.addEventListener('click', function() {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" class="form-control" placeholder="Nombre del producto/servicio"></td>
            <td>
                <select class="form-control unidad-select">
                    <!-- Opciones se llenarán dinámicamente -->
                </select>
            </td>
            <td><input type="number" class="form-control" placeholder="Precio"></td>
            <td><input type="number" class="form-control" placeholder="Costo unitario"></td>
            <td><input type="number" class="form-control" placeholder="Unidades vendidas"></td>
            <td><button class="btn btn-danger remove-row">Eliminar</button></td>
        `;
        
        productosBody.appendChild(row);
        updateUnidadesSelects();
        
        // Agregar evento para eliminar fila
        row.querySelector('.remove-row').addEventListener('click', function() {
            row.remove();
            updateSummary();
        });
        
        // Agregar eventos para actualizar el resumen cuando cambien los datos
        const inputs = row.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', updateSummary);
        });
        
        updateSummary();
    });
    
    // Actualizar selects de unidades de negocio
    function updateUnidadesSelects() {
        const unidadSelects = document.querySelectorAll('.unidad-select');
        const unidades = Array.from(unidadesBody.querySelectorAll('tr')).map(row => {
            const nameInput = row.querySelector('td:first-child input');
            return nameInput ? nameInput.value : '';
        }).filter(name => name.trim() !== '');
        
        unidadSelects.forEach(select => {
            select.innerHTML = '';
            
            if (unidades.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No hay unidades definidas';
                select.appendChild(option);
            } else {
                unidades.forEach((unidad, index) => {
                    const option = document.createElement('option');
                    option.value = `unidad-${index}`;
                    option.textContent = unidad;
                    select.appendChild(option);
                });
            }
        });
    }
    
    // Actualizar resumen
    function updateSummary() {
        // Contar clientes
        const totalClientes = cargaMode.value === 'detallada' 
            ? clientesBody.querySelectorAll('tr').length
            : document.getElementById('total-ventas').value ? 1 : 0;
        
        // Contar unidades
        const totalUnidades = unidadesBody.querySelectorAll('tr').length;
        
        // Contar productos
        const totalProductos = productosBody.querySelectorAll('tr').length;
        
        // Calcular ventas totales
        let ventasTotales = 0;
        
        if (cargaMode.value === 'detallada') {
            // Calcular ventas de productos
            const productoRows = productosBody.querySelectorAll('tr');
            productoRows.forEach(row => {
                const precio = parseFloat(row.querySelector('td:nth-child(3) input').value) || 0;
                const unidades = parseFloat(row.querySelector('td:nth-child(5) input').value) || 0;
                ventasTotales += precio * unidades;
            });
        } else {
            ventasTotales = parseFloat(document.getElementById('total-ventas').value) || 0;
        }
        
        // Actualizar UI
        document.getElementById('total-clientes').textContent = totalClientes;
        document.getElementById('total-unidades').textContent = totalUnidades;
        document.getElementById('total-productos').textContent = totalProductos;
        document.getElementById('ventas-totales').textContent = `$${ventasTotales.toLocaleString()}`;
    }
    
    // Guardar datos del negocio
    document.getElementById('save-business-data').addEventListener('click', function() {
        if (!appState.currentProject) {
            alert('No hay un proyecto cargado. Cree o cargue un proyecto primero.');
            return;
        }
        
        // Recopilar datos según el modo de carga
        if (cargaMode.value === 'detallada') {
            // Datos detallados
            const clientes = Array.from(clientesBody.querySelectorAll('tr')).map(row => {
                return {
                    nombre: row.querySelector('td:first-child input').value,
                    segmento: row.querySelector('td:nth-child(2) select').value,
                    participacion: parseFloat(row.querySelector('td:nth-child(3) input').value) || 0,
                    rentabilidad: parseFloat(row.querySelector('td:nth-child(4) input').value) || 0,
                    unidad: row.querySelector('td:nth-child(5) select').value
                };
            });
            
            const unidades = Array.from(unidadesBody.querySelectorAll('tr')).map(row => {
                return {
                    nombre: row.querySelector('td:first-child input').value,
                    costosFijos: parseFloat(row.querySelector('td:nth-child(2) input').value) || 0,
                    ventasEstimadas: parseFloat(row.querySelector('td:nth-child(3) input').value) || 0
                };
            });
            
            const productos = Array.from(productosBody.querySelectorAll('tr')).map(row => {
                return {
                    nombre: row.querySelector('td:first-child input').value,
                    unidad: row.querySelector('td:nth-child(2) select').value,
                    precio: parseFloat(row.querySelector('td:nth-child(3) input').value) || 0,
                    costoUnitario: parseFloat(row.querySelector('td:nth-child(4) input').value) || 0,
                    unidadesVendidas: parseFloat(row.querySelector('td:nth-child(5) input').value) || 0
                };
            });
            
            appState.currentProject.cargaNegocio = {
                modo: 'detallada',
                clientes,
                unidades,
                productos
            };
        } else {
            // Datos totales
            appState.currentProject.cargaNegocio = {
                modo: 'total',
                ventasTotales: parseFloat(document.getElementById('total-ventas').value) || 0,
                costosFijosTotales: parseFloat(document.getElementById('total-costos-fijos').value) || 0,
                costosVariablesUnitarios: parseFloat(document.getElementById('total-costos-variables').value) || 0
            };
        }
        
        // Marcar paso como completado
        if (!appState.completedSteps.includes('carga')) {
            appState.completedSteps.push('carga');
            updateProgressTracker();
        }
        
        alert('Datos del negocio guardados correctamente.');
    });
    
    // Cargar datos existentes si los hay
    if (appState.currentProject?.cargaNegocio) {
        const data = appState.currentProject.cargaNegocio;
        
        if (data.modo === 'detallada') {
            cargaMode.value = 'detallada';
            detailedForm.style.display = 'block';
            totalForm.style.display = 'none';
            
            // Cargar unidades
            data.unidades.forEach(unidad => {
                unidadesBody.innerHTML += `
                    <tr>
                        <td><input type="text" class="form-control" value="${unidad.nombre}"></td>
                        <td><input type="number" class="form-control" value="${unidad.costosFijos}"></td>
                        <td><input type="number" class="form-control" value="${unidad.ventasEstimadas}"></td>
                        <td><button class="btn btn-danger remove-row">Eliminar</button></td>
                    </tr>
                `;
            });
            
            // Cargar clientes
            data.clientes.forEach(cliente => {
                clientesBody.innerHTML += `
                    <tr>
                        <td><input type="text" class="form-control" value="${cliente.nombre}"></td>
                        <td>
                            <select class="form-control">
                                <option value="retail" ${cliente.segmento === 'retail' ? 'selected' : ''}>Retail</option>
                                <option value="corporativo" ${cliente.segmento === 'corporativo' ? 'selected' : ''}>Corporativo</option>
                                <option value="gobierno" ${cliente.segmento === 'gobierno' ? 'selected' : ''}>Gobierno</option>
                                <option value="otros" ${cliente.segmento === 'otros' ? 'selected' : ''}>Otros</option>
                            </select>
                        </td>
                        <td><input type="number" class="form-control" value="${cliente.participacion}"></td>
                        <td><input type="number" class="form-control" value="${cliente.rentabilidad}"></td>
                        <td>
                            <select class="form-control unidad-select">
                                <!-- Opciones se llenarán dinámicamente -->
                            </select>
                        </td>
                        <td><button class="btn btn-danger remove-row">Eliminar</button></td>
                    </tr>
                `;
            });
            
            // Cargar productos
            data.productos.forEach(producto => {
                productosBody.innerHTML += `
                    <tr>
                        <td><input type="text" class="form-control" value="${producto.nombre}"></td>
                        <td>
                            <select class="form-control unidad-select">
                                <!-- Opciones se llenarán dinámicamente -->
                            </select>
                        </td>
                        <td><input type="number" class="form-control" value="${producto.precio}"></td>
                        <td><input type="number" class="form-control" value="${producto.costoUnitario}"></td>
                        <td><input type="number" class="form-control" value="${producto.unidadesVendidas}"></td>
                        <td><button class="btn btn-danger remove-row">Eliminar</button></td>
                    </tr>
                `;
            });
            
            // Configurar eventos para las filas cargadas
            setTimeout(() => {
                updateUnidadesSelects();
                
                // Establecer los valores correctos para los selects de unidad
                if (data.clientes.length > 0) {
                    const clienteRows = clientesBody.querySelectorAll('tr');
                    data.clientes.forEach((cliente, index) => {
                        if (clienteRows[index]) {
                            const select = clienteRows[index].querySelector('.unidad-select');
                            if (select) {
                                select.value = cliente.unidad;
                            }
                        }
                    });
                }
                
                if (data.productos.length > 0) {
                    const productoRows = productosBody.querySelectorAll('tr');
                    data.productos.forEach((producto, index) => {
                        if (productoRows[index]) {
                            const select = productoRows[index].querySelector('.unidad-select');
                            if (select) {
                                select.value = producto.unidad;
                            }
                        }
                    });
                }
                
                // Agregar eventos a los botones de eliminar
                document.querySelectorAll('.remove-row').forEach(btn => {
                    btn.addEventListener('click', function() {
                        this.closest('tr').remove();
                        updateSummary();
                    });
                });
                
                // Agregar eventos para actualizar el resumen
                document.querySelectorAll('input, select').forEach(input => {
                    input.addEventListener('change', updateSummary);
                });
                
                updateSummary();
            }, 100);
        } else {
            // Modo total
            cargaMode.value = 'total';
            detailedForm.style.display = 'none';
            totalForm.style.display = 'block';
            
            document.getElementById('total-ventas').value = data.ventasTotales;
            document.getElementById('total-costos-fijos').value = data.costosFijosTotales;
            document.getElementById('total-costos-variables').value = data.costosVariablesUnitarios;
            
            updateSummary();
        }
    }
});