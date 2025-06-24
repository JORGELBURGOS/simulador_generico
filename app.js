// Estado global de la aplicación
const appState = {
    currentProject: null,
    projectName: 'Nuevo Proyecto',
    lastSaved: null,
    completedSteps: []
};

// Cargar ejemplo
document.getElementById('load-example').addEventListener('click', () => {
    fetch('data/ejemplo.json')
        .then(response => response.json())
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
    fetch('data/vacio.json')
        .then(response => response.json())
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
        localStorage.setItem('savedProject', JSON.stringify(appState.currentProject));
        localStorage.setItem('projectState', JSON.stringify({
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
        const savedProject = localStorage.getItem('savedProject');
        const savedState = localStorage.getItem('projectState');
        
        if (!savedProject || !savedState) {
            alert('No se encontró ningún proyecto guardado.');
            return;
        }
        
        appState.currentProject = JSON.parse(savedProject);
        const state = JSON.parse(savedState);
        appState.projectName = state.projectName;
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

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    updateProgressTracker();
});