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
    var currentEditingUserId = null; // Make sure to edit only one user
    var currentEditingAddressId = null; // Make sure to edit only one addresss
    refreshUsers(); // Refresh Users when browser loaded


    // [Path 1] GET - Get all Users - 'http://localhost:5000/users/get'
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
                const users = JSON.parse(this.responseText);
                users.forEach(currentUser => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${currentUser.userId}</td>
                        <td>${currentUser.title === 'Other' ? currentUser.titleOther : currentUser.title}</td>
                        <td>${currentUser.firstName}</td>
                        <td>${currentUser.surName}</td>
                        <td>${currentUser.mobile}</td>
                        <td>${currentUser.email}</td>
                        <td>
                            <a href="#" onclick="showAddressTable(${currentUser.userId});">Show Address</a>
                        </td>
                        <td>
                            <a href="#" onclick="editUser(${currentUser.userId})">edit</a> / 
                            <a href="#" onclick="deleteUser(${currentUser.userId});">delete</a>
                        </td>
                    `;
                    userList.appendChild(tr);
                });
            }else{
                console.error(this.statusText);
            }
        };
    }

    // [Path 2] POST - Create a User - 'http://localhost:5000/users/create'
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

    // [Path 3] GET - Get a User - 'http://localhost:5000/users/get/:userId'
    window.editUser = function(userId) {       
        currentEditingUserId = userId;  // Change current Editing UserId   
        document.getElementById('editingUser').innerText = `Editing User: ${userId}`;
    
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:5000/users/get/${userId}`, true); 
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
                delete userData.userId; 
                // delete userData._id; 
                // delete userData.__v;      

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

    // [Path 4] PUT - Update a User - 'http://localhost:5000/users/update/:userId'
    document.getElementById('editUserButton').addEventListener('click', (event) => {
        event.preventDefault();

        // Populate `user` Object with the content of <form>
        let userForm = document.getElementById('userForm');
        var formData = new FormData(userForm);
        var user = {};
        formData.forEach((value, name) => user[name] = value);

        let xhr = new XMLHttpRequest();
        xhr.open('PUT', `http://localhost:5000/users/update/${currentEditingUserId}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json'); // Data Type to be sent: JSON 
        xhr.send(JSON.stringify(user));
        xhr.onerror = function() {
            console.error('Network error');
        };    

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                refreshUsers(); // Refresh <table> after UPDATE
                console.log(`Member: ${currentEditingUserId} updated`, user);
                userForm.reset(); // Clear the form

                // Disable edit <button>, enable create <button>
                document.getElementById('editUserButton').disabled = true;
                document.getElementById('createUserButton').disabled = false;
            } else {
                console.error(this.statusText);
            }
        };
    });

    // [Path 5] DELETE - Delete a User - 'http://localhost:5000/users/delete/:userId'
    window.deleteUser = function(userId) {
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:5000/users/delete/${userId}`, true);   
        xhr.send();
        xhr.onerror = function() {
            console.error('Network error');
        };

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                console.log(`User: ${userId} deleted successfully`);
                refreshUsers(); // Refresh the list after deleting
            } else {
                console.error(this.statusText);
            }
        };
    };  


    // [Show Address] - Function in each Row with `userId`
    window.showAddressTable = function(userId) {
        // Hide UserPage and show AddressPage.
        document.getElementById('userDashBoard').style.display = 'none';
        document.getElementById('addressDashBoard').style.display = 'block';
        // Disable edit <button>, enable create <button>
        document.getElementById('editAddressButton').disabled = true;
        document.getElementById('createAddressButton').disabled = false;

        currentEditingUserId = userId;
        document.getElementById('userAddressTitle').innerText = `CRUD for User(${userId})'s Address`;
        refreshAddresses();  // Refresh Addresses in userId 
    }

    // [Path 6] GET - Read all addresses for a specific user - 'http://localhost:5000/users/:userId/addresses'
    function refreshAddresses() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:5000/users/${currentEditingUserId}/addresses`, true);
        xhr.send();       
        xhr.onerror = function() {
            console.error('Network error');
        };

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                const addressList = document.getElementById('addressList');
                addressList.innerHTML = '';  // Clear Address Table
    
                const addresses = JSON.parse(this.responseText);
                addresses.forEach(currentAddress => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${currentAddress.userId}</td>
                        <td>${currentAddress.addressId}</td>
                        <td>${currentAddress.addressType}</td>
                        <td>${currentAddress.addressLine1} &nbsp; ${currentAddress.addressLine2 || ''}</td>
                        <td>${currentAddress.town}</td>
                        <td>${currentAddress.countyCity}</td>
                        <td>${currentAddress.eircode || ''}</td>
                        <td>
                            <a href="#" onclick="editAddress(${currentEditingUserId}, ${currentAddress.addressId});">edit</a> / 
                            <a href="#" onclick="deleteAddress(${currentEditingUserId}, ${currentAddress.addressId});">delete</a>
                        </td>
                    `;
                    addressList.appendChild(tr);
                });
            } else {
                console.error(this.statusText);
            }
        };
    }    

    // [Path 7] POST - Create an address for a specific user - 'http://localhost:5000/users/:userId/addresses/create'
    document.getElementById('createAddressButton').addEventListener('click', (event) => {
        event.preventDefault();  
    
        // Populate `address` Object with the content of <form>
        let addressForm = document.getElementById('addressForm');
        var formData = new FormData(addressForm);
        var address = {};    
        formData.forEach((value, name) => address[name] = value);
    
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `http://localhost:5000/users/${currentEditingUserId}/addresses/create`, true);    
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(address));
        xhr.onerror = function() {
            console.error('Network error');
        };

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                refreshAddresses(); // Refresh <table> after CREATE
                console.log(`User ${currentEditingUserId}'s Address created:`, address);
                addressForm.reset();
            } else {
                console.error(this.statusText);
            }
        };  
    });

    // [Path 8] GET - Read a specific address for a specific user - 'http://localhost:5000/users/:userId/addresses/:addressId'
    window.editAddress = function (userId, addressId) {
        // Change current Editing UserId and addressId, render them in Page
        currentEditingUserId = userId;  
        document.getElementById('editingUser').innerText = `Editing User: ${currentEditingUserId}`;        
        currentEditingAddressId = addressId;   
        document.getElementById('editingAddress').innerText = `Editing Address: ${currentEditingAddressId}`;

        let xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:5000/users/${currentEditingUserId}/addresses/${currentEditingAddressId}`, true);
        xhr.send();
        xhr.onerror = function() {
            console.error('Network error');
        };
   
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                // Get First element of JSON Array, print it on Console
                const addressArray = JSON.parse(this.responseText);
                const address = addressArray[0];
                console.log("Get this Address", address); 

                let addressData = {...address}; // light copy, avoid changing the original data
                delete addressData.userId; 
                delete addressData.addressId; 
                // delete addressData._id; 
                // delete addressData.__v;  

                // Fill the <form> with fetched Enrollment
                let addressForm = document.getElementById('addressForm');                 
                Object.keys(addressData).forEach(key => {
                    const element = addressForm.elements[key];  

                    if(element instanceof NodeList){
                        if (element[0]?.type === 'radio'){
                            const radioValue = addressData[key];
                            document.querySelectorAll(`input[name="${key}"]`).forEach(radio => {
                                radio.checked = (radioValue === radio.value);
                            });
                        }                                                 
                    } 
                    else {
                        element.value = addressData[key];
                    }     
                });
    
                // Enable edit <button>, disable create <button>
                document.getElementById('editAddressButton').disabled = false;
                document.getElementById('createAddressButton').disabled = true;
            } else {
                console.error(this.statusText);
            }
        };
    }

    // [Path 9] PUT - Update a specific address for a specific user - 'http://localhost:5000/users/:userId/addresses/:addressId/update'
    document.getElementById('editAddressButton').addEventListener('click',  (event) => {
        event.preventDefault();

        // Populate `address` Object with the content of <form>
        let addressForm = document.getElementById('addressForm');
        var formData = new FormData(addressForm);
        var address = {};    
        formData.forEach((value, name) => address[name] = value);

        let xhr = new XMLHttpRequest();
        xhr.open('PUT', `http://localhost:5000/users/${currentEditingUserId}/addresses/${currentEditingAddressId}/update`, true);
        xhr.setRequestHeader('Content-Type', 'application/json'); // Data Type to be sent: JSON 
        xhr.send(JSON.stringify(address));
        xhr.onerror = function() {
            console.error('Network error');
        };    

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                refreshAddresses(); // Refresh <table> after CREATE
                console.log(`Address: ${currentEditingAddressId} of User: ${currentEditingUserId} updated:`, address);
                addressForm.reset(); // Reset the form

                // Disable edit <button>, enable create <button>
                document.getElementById('editAddressButton').disabled = true;
                document.getElementById('createAddressButton').disabled = false;
            } else {
                console.error(this.statusText);
            }
        };      
    });    

    // [Path 10] DELETE - Delete a specific address for a specific user - '/users/:userId/addresses/delete/:addressId'   
    window.deleteAddress = function(userId, addressId) {
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:5000/users/${userId}/addresses/delete/${addressId}`, true);
        xhr.send();    
        xhr.onerror = function() {
            console.error('Network error');
        };

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                console.log(`Address: ${addressId} of User: ${userId} deleted successfully`);
                refreshAddresses(); // Refresh <table> after CREATE
            } else {
                console.log(`Failed to Delete ${userId}'s Address:`, this.statusText);
            }
        };   
    };

    // [Back To User List] - Function of Link
    document.getElementById('backToUserList').addEventListener('click', (event) => {
        event.preventDefault();

        // Show UserPage and hide AddressPage.            
        document.getElementById('userDashBoard').style.display = 'block';
        document.getElementById('addressDashBoard').style.display = 'none';
        // Disable edit <button>, enable create <button>
        document.getElementById('editUserButton').disabled = true;
        document.getElementById('createUserButton').disabled = false;
         
        currentEditingUserId = null; // clear editing userId  
        currentEditingAddressId = null; // clear editing addressId  
        refreshUsers(); // Refresh Users when browser loaded   
    });
});