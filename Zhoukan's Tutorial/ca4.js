document.addEventListener('DOMContentLoaded', function() {

    var currentEditingModuleId = null; // Make sure to edit only one module
    refreshModules(); // Refresh Modules when Browser loaded

    // [Path 1 - Get] -- Get all Modules - 'http://localhost:5000/modules/get'
    function refreshModules() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:5000/modules/get', true);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                const modules = JSON.parse(this.responseText);

                // Clear Module Table
                const moduleList = document.getElementById('moduleList');
                moduleList.innerHTML = ''; 

                // Create every Table Row in <tbody id="moduleList">
                modules.forEach(currentModule => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${currentModule.moduleId}</td>
                        <td>${currentModule.code}</td>
                        <td>${currentModule.moduleName}</td> 
                        <td>
                            <a href="#" onclick="editModule(${currentModule.moduleId})">edit</a> | 
                            <a href="#" onclick="event.preventDefault(); deleteModule(${currentModule.moduleId});">delete</a>
                        </td>
                    `;
                    moduleList.appendChild(tr);
                });
            }else{
                console.log('Failed to fetch Modules:', this.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Network error');
        };
        xhr.send();
    }

    // [Path 2 - POST] -- Create a Module - 'http://localhost:5000/modules/create'
    document.getElementById('createModuleButton').addEventListener('click', function(event) {
        event.preventDefault(); 

        // Populate `module` Object with the content of <form>
        var formData = new FormData(moduleForm);
        var module = {};
        formData.forEach(function(value, key) {
            module[key] = value;
        });
    
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:5000/modules/create', true);
        xhr.setRequestHeader('Content-Type', 'application/json'); // Data Type to be sent: JSON       
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                console.log('New Module created successfully');
                refreshModules(); // Refresh <table> after CREATE
            } else {
                console.log('Failed to Create a Module:', this.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Network error');
        };       
        console.log(module); // Convert JSON into String, print on Console
        xhr.send(JSON.stringify(module));     
    });  

    // [Path 3 - GET] -- Get a Module - 'http://localhost:5000/modules/get/:moduleId'
    window.editModule = function(moduleId) {             
        currentEditingModuleId = moduleId;  // Change current Editing ModuleId   
    
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:5000/modules/get/${currentEditingModuleId}`, true);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                // Get First element of JSON Array, print it on Console
                var moduleArray = JSON.parse(this.responseText);
                var module = moduleArray[0];
                console.log("Get this Module", module); 

                // Fill the <form> with fetched Module
                moduleForm.elements['code'].value = module.code;
                moduleForm.elements['moduleName'].value = module.moduleName;

                // Enable edit <button>, disable create <button>
                document.getElementById('editModuleButton').disabled = false;
                document.getElementById('createModuleButton').disabled = true;
            } else {
                console.log('Failed to Get this Module:', this.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Network error');
        };
        xhr.send();
    };

    // [Path 4 - PUT] -- Update a Module - 'http://localhost:5000/modules/update/:moduleId'
    document.getElementById('editModuleButton').addEventListener('click',  function(event) {
        event.preventDefault();

        // Populate `module` Object with the content of <form>
        var formData = new FormData(moduleForm);
        var module = {};
        formData.forEach(function(value, key) {
            module[key] = value;
        });

        let xhr = new XMLHttpRequest();
        xhr.open('PUT', `http://localhost:5000/modules/update/${currentEditingModuleId}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json'); // Data Type to be sent: JSON 
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                console.log(`Module: ${currentEditingModuleId} updated successfully`);
                refreshModules(); // Refresh <table> after UPDATE

                // Disable edit <button>, enable create <button>
                document.getElementById('editModuleButton').disabled = true;
                document.getElementById('createModuleButton').disabled = false;
            } else {
                console.log('Failed to Edit Module:', this.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Network error');
        };            
        xhr.send(JSON.stringify(module));
    });

    // [Path 5 -- DELETE] -- Delete a Module - 'http://localhost:5000/modules/delete/:modulId'
    window.deleteModule = function(moduleId) {
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:5000/modules/delete/${moduleId}`, true);        
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                console.log(`Module: ${moduleId} deleted successfully`);
                refreshModules(); // Refresh the list after deleting
            } else {
                console.log('Failed to Delete Module:', this.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Network error');
        };
        xhr.send();
    }; 

});