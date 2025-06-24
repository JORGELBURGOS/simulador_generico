// Estado global de la aplicación
const appState = {
    currentProject: null,
    projectName: 'Nuevo Proyecto',
    lastSaved: null,
    completedSteps: []
};

// Cargar ejemplo
document.getElementById('load-example').addEventListener('click', () => {
    fetch('./data/ejemplo.json')
        .then(response => {
            if (!response.ok) throw new Error('No se pudo cargar el ejemplo');
            return response.json();
        })
        .then(data => {
            appState.currentProject = data;
            appState.projectName = 'Proyecto de Ejemplo';
            appState.lastSaved = new Date();
            appState.completedSteps = ['carga', 'pestel', 'porter', 'bcg'];
            
            updateProgressTracker();
            alert('Ejemplo cargado correctamente. Puede navegar por las diferentes secciones.');
        })
        .catch(error => {
            console.error('Error al cargar el ejemplo:', error);
            alert('Error al cargar el ejemplo. Por favor intente nuevamente.');
        });
});

// Nuevo proyecto
document.getElementById('new-project').addEventListener('click', () => {
    fetch('./data/vacio.json')
        .then(response => {
            if (!response.ok) throw new Error('No se pudo crear nuevo proyecto');
            return response.json();
        })
        .then(data => {
            appState.currentProject = data;
            appState.projectName = 'Nuevo Proyecto';
            appState.lastSaved = new Date();
            appState.completedSteps = [];
            
            updateProgressTracker();
            alert('Nuevo proyecto creado. Comience por la carga de datos.');
        })
        .catch(error => {
            console.error('Error al crear nuevo proyecto:', error);
            alert('Error al crear nuevo proyecto. Por favor intente nuevamente.');
        });
});

// Guardar proyecto
document.getElementById('save-project').addEventListener('click', () => {
    if (!appState.currentProject) {
        alert('No hay proyecto para guardar. Cree o cargue un proyecto primero.');
        return;
    }
    
    try {
        const safeProjectName = encodeURIComponent(appState.projectName);
        
        localStorage.setItem(`savedProject_${safeProjectName}`, JSON.stringify(appState.currentProject));
        localStorage.setItem(`projectState_${safeProjectName}`, JSON.stringify({
            projectName: appState.projectName,
            lastSaved: new Date(),
            completedSteps: appState.completedSteps
        }));
        
        appState.lastSaved = new Date();
        alert('Proyecto guardado correctamente. Puede continuar más tarde.');
    } catch (error) {
        console.error('Error al guardar el proyecto:', error);
        alert('Error al guardar el proyecto. Por favor intente nuevamente.');
    }
});

// Cargar proyecto guardado
document.getElementById('load-project').addEventListener('click', () => {
    try {
        const projectKeys = Object.keys(localStorage).filter(key => key.startsWith('savedProject_'));
        
        if (projectKeys.length === 0) {
            alert('No se encontró ningún proyecto guardado.');
            return;
        }
        
        // Selecciona el primer proyecto encontrado
        const projectKey = projectKeys[0];
        const stateKey = projectKey.replace('savedProject_', 'projectState_');
        
        appState.currentProject = JSON.parse(localStorage.getItem(projectKey));
        const state = JSON.parse(localStorage.getItem(stateKey));
        
        appState.projectName = decodeURIComponent(state.projectName);
        appState.lastSaved = new Date(state.lastSaved);
        appState.completedSteps = state.completedSteps;
        
        updateProgressTracker();
        alert(`Proyecto "${appState.projectName}" cargado correctamente. Último guardado: ${appState.lastSaved.toLocaleString()}`);
    } catch (error) {
        console.error('Error al cargar el proyecto:', error);
        alert('Error al cargar el proyecto. Por favor intente nuevamente.');
    }
});

// Actualizar el rastreador de progreso
function updateProgressTracker() {
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        const stepName = step.dataset.step;
        if (appState.completedSteps.includes(stepName)) {
            step.classList.add('completed');
        } else {
            step.classList.remove('completed');
        }
    });
}

// Navegación sin recarga de página
document.addEventListener('DOMContentLoaded', () => {
    updateProgressTracker();
    
    // Manejar clicks en enlaces del menú
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const path = this.getAttribute('href');
            history.pushState(null, null, path);
            loadPage(path);
        });
    });
    
    // Manejar el botón de retroceso
    window.addEventListener('popstate', () => {
        loadPage(window.location.pathname);
    });
});

function loadPage(path) {
    // Implementa la lógica para cargar contenido dinámico aquí
    console.log('Cargando página:', path);
    // Por ahora, simplemente muestra la ruta en la consola
}