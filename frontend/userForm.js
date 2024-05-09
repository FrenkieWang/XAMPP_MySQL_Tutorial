function toggleTitleOther(input) {
    const titleOtherGroup = document.getElementById('titleOtherGroup');
    let titleValue = (input instanceof Element)? input.value : input;
    
    if(titleValue == 'Other'){
        titleOtherGroup.style.display = 'block';
    } else {
        titleOtherGroup.style.display = 'none';
        document.querySelector('input[name="titleOther"]').value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {  
    var currentEditingUserID = null; // Make sure to edit only one user
    refreshUsers(); // Refresh Users when browser loaded

        
    // [Path 1] GET -- Generate Random User - 'http://localhost:5000/users/generate-user'
    document.getElementById('generateRandomUser').addEventListener('click', (event) => {  
        event.preventDefault(); 

        var xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:5000/users/generate-user`, true);
        xhr.send();       
        xhr.onerror = function() {
            console.error('Network error');
        };
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                const userData = JSON.parse(this.responseText);
                console.log("Generate a User", userData); 

                // Fill the <form> with fetched User
                let userForm = document.getElementById('userForm');
                Object.keys(userData).forEach(key => {
                    userForm.elements[key].value = userData[key];                       
                });
                toggleTitleOther(userData.title);  
            } else {
                console.error(this.statusText);
            }              
        };
    });

    // [Path 2] GET - Get all Users - 'http://localhost:5000/users/get'
    function refreshUsers() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:5000/users/get', true);
        xhr.send();
        xhr.onerror = function() {
            console.error('Network error');
        };
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                const userList = document.getElementById('userList');
                userList.innerHTML = '';  // Clear User Table

                // Create every Table Row in <tbody id="userList">
                const userData = JSON.parse(this.responseText);
                console.log(userData);
                userData.forEach(currentUser => {
                    const titleDisplay = currentUser.title === 'Other' ?
                    currentUser.titleOther : currentUser.title;
    
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${currentUser.userID}</td>
                        <td>${titleDisplay}</td>
                        <td>${currentUser.firstName}</td>
                        <td>${currentUser.surName}</td>
                        <td>${currentUser.mobile}</td>
                        <td>${currentUser.email}</td>
                        <td>
                            <a href="#" onclick="showAddressTable('${currentUser.userID}', 'home');">
                                Home Address
                            </a>
                        </td>
                        <td>
                            <a href="#" onclick="showAddressTable('${currentUser.userID}', 'shipping');">
                                Shipping Address
                            </a>
                        </td>
                        <td>
                            <a href="#" onclick="editUser('${currentUser.userID}')">edit</a> / 
                            <a href="#" onclick="deleteUser('${currentUser.userID}');">delete</a>
                        </td>
                    `;
                    userList.appendChild(tr);
                });
            }else{
                console.error(this.statusText);
            }      
        }
    }

    // [Path 3] POST - Create a User - 'http://localhost:5000/users/create'
    document.getElementById('createUserButton').addEventListener('click', (event) => {
        event.preventDefault(); 

        // Populate `user` Object with the content of <form>
        let userForm = document.getElementById('userForm');
        var formData = new FormData(userForm);
        var user = {};         
        formData.forEach((value, name) => user[name] = value); 

        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:5000/users/create', true);
        xhr.setRequestHeader('Content-Type', 'application/json'); // Data Type to be sent: JSON   
        xhr.send(JSON.stringify(user));     
        xhr.onerror = function() {
            console.error('Network error');
        };            
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                refreshUsers(); // Refresh <table> after CREATE
                console.log(`User created: `, user);
                userForm.reset(); // Clear the form
            } else {
                console.error(this.statusText);
            }
        }; 
    });  

    // [Path 4] GET - Get a User - 'http://localhost:5000/users/get/:userID'
    window.editUser = function(userID) {       
        currentEditingUserID = userID;  // Change current Editing UserID   

        let xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:5000/users/get/${userID}`, true); 
        xhr.send();       
        xhr.onerror = function() {
            console.error('Network error');
        };
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                // Get First element of JSON Array, print it on Console
                var userArray = JSON.parse(this.responseText);
                var user = userArray[0];

                console.log("Get this User", user); 
                let userData = {...user}; // light copy, avoid changing the original data
                delete userData.userID; 

                // Fill the <form> with fetched User
                let userForm = document.getElementById('userForm');
                Object.keys(userData).forEach(key => {
                    userForm.elements[key].value = userData[key];                         
                });
                toggleTitleOther(userForm.title);

                // Enable edit <button>, disable create <button>
                document.getElementById('editUserButton').disabled = false;
                document.getElementById('createUserButton').disabled = true;
            } else {
                console.error(this.statusText);
            }
        };
    };

    // [Path 5] PUT - Update a User - 'http://localhost:5000/users/update/:userID'
    document.getElementById('editUserButton').addEventListener('click', (event) => {
        event.preventDefault();

        // Populate `user` Object with the content of <form>
        let userForm = document.getElementById('userForm');
        var formData = new FormData(userForm);
        var user = {};
        formData.forEach((value, name) => user[name] = value);

        let xhr = new XMLHttpRequest();
        xhr.open('PUT', `http://localhost:5000/users/update/${currentEditingUserID}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json'); // Data Type to be sent: JSON 
        xhr.send(JSON.stringify(user));
        xhr.onerror = function() {
            console.error('Network error');
        };    
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                refreshUsers(); // Refresh <table> after UPDATE
                console.log(`User with ID: ${currentEditingUserID} updated`);
                userForm.reset(); // Clear the form
        
                // Disable edit <button>, enable create <button>
                document.getElementById('editUserButton').disabled = true;
                document.getElementById('createUserButton').disabled = false;
            } else {
                console.error(this.statusText);
            }
        };
    });

    // [Path 6] DELETE - Delete a User - 'http://localhost:5000/users/delete/:userID'
    window.deleteUser = function(userID) {
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:5000/users/delete/${userID}`, true);   
        xhr.send();
        xhr.onerror = function() {
            console.error('Network error');
        };
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                console.log(`User with ID: ${userID} deleted.`);
                refreshUsers(); // Refresh the list after deleting
            } else {
                console.error(this.statusText);
            }
        };
    };  

    // Add Query Parameter in addressForm.html
    window.showAddressTable = function(userID, addressType) {
        window.location.href = 'addressForm.html?userID=' + userID 
            + '&addressType=' + addressType;  
    }  
});