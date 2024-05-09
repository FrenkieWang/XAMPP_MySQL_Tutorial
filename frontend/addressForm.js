document.addEventListener('DOMContentLoaded', () => {  
    const params = new URLSearchParams(window.location.search);
    const currentEditingUserID = params.get('userID');
    const thisAddressType = params.get('addressType');

    document.getElementById('userAddressTitle').innerText = `CRUD for User(${currentEditingUserID})'s ${thisAddressType} Address`;
    var currentEditingAddressID = null; // Make sure to edit only one addresss
    refreshAddresses();   // Refresh Addresses in userID 


    // [Path 1] GET -- Generate Random Address - 'http://localhost:5000/users/addresses/generate-address'
    document.getElementById('generateRandomAddress').addEventListener('click', (event) => {  
        event.preventDefault(); 

        var xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:5000/users/addresses/generate-address`, true);
        xhr.send();       
        xhr.onerror = function() {
            console.error('Network error');
        };
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                const addressData = JSON.parse(this.responseText);
                console.log("Generate a Address", addressData);  

                // Fill the <form> with fetched Address
                let addressForm = document.getElementById('addressForm');                 
                Object.keys(addressData).forEach(key => {
                    addressForm.elements[key].value = addressData[key]; 
                });
            } else {
                console.error(this.statusText);
            }
        };                       
    });

    // [Path 2] GET - Get all addresses for a specific user - 'http://localhost:5000/users/addresses/get/:userID/:addressType'
    function refreshAddresses() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:5000/users/addresses/get/${currentEditingUserID}/${thisAddressType}`, true);
        xhr.send();       
        xhr.onerror = function() {
            console.error('Network error');
        };
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                const addressList = document.getElementById('addressList');
                addressList.innerHTML = '';  // Clear Address Table
        
                const addressData = JSON.parse(this.responseText);
                console.log(addressData);
                // If already has the type of address, disable create <button>
                document.getElementById('createAddressButton').disabled = (addressData.length !== 0);

                addressData.forEach(currentAddress => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${currentAddress.userID}</td>
                        <td>${currentAddress.addressID}</td>
                        <td>${currentAddress.addressType}</td>
                        <td>${currentAddress.addressLine1} &nbsp; ${currentAddress.addressLine2 || ''}</td>
                        <td>${currentAddress.town}</td>
                        <td>${currentAddress.countyCity}</td>
                        <td>${currentAddress.eircode || ''}</td>
                        <td>
                            <a href="#" onclick="editAddress('${currentAddress.addressID}');">edit</a> / 
                            <a href="#" onclick="deleteAddress('${currentAddress.addressID}');">delete</a>
                        </td>
                    `;
                    addressList.appendChild(tr);
                });
            } else {
                console.error(this.statusText);
            }
        };
    }

    // [Path 3] POST - Create an address for a specific user - 'http://localhost:5000/users/addresses/create/:userID'
    document.getElementById('createAddressButton').addEventListener('click', (event) => {
        event.preventDefault();  
    
        // Populate `address` Object with the content of <form>
        let addressForm = document.getElementById('addressForm');
        var formData = new FormData(addressForm);
        var address = {};    
        formData.forEach((value, name) => address[name] = value);
        address.addressType = thisAddressType;
        
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `http://localhost:5000/users/addresses/create/${currentEditingUserID}`, true);    
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(address));
        xhr.onerror = function() {
            console.error('Network error');
        };
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                refreshAddresses(); // Refresh <table> after CREATE
                console.log(`User ${currentEditingUserID}'s ${thisAddressType} Address created:`, address);
                addressForm.reset();
            } else {
                console.error(this.statusText);
            }
        };                 
    });

    // [Path 4] GET - Get a specific address for a specific user - 'http://localhost:5000/users/addresses/get/:userID/:addressID'
    window.editAddress = function (addressID) {     
        currentEditingAddressID = addressID;  // Change current Editing addressID

        let xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:5000/users/addresses/getone/${currentEditingUserID}/${currentEditingAddressID}`, true);
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
                delete addressData.addressID; 
                delete addressData.userID; 
                delete addressData.addressType; 

                // Fill the <form> with fetched Address
                let addressForm = document.getElementById('addressForm');                 
                Object.keys(addressData).forEach(key => {          
                    addressForm.elements[key].value = addressData[key];                   
                });

                // Enable edit <button>, disable create <button>
                document.getElementById('editAddressButton').disabled = false;
                document.getElementById('createAddressButton').disabled = true;
            } else {
                console.error(this.statusText);
            }
        };
    }

    // [Path 5] PUT - Update a specific address for a specific user - 'http://localhost:5000/users/addresses/update/:userID/:addressID'
    document.getElementById('editAddressButton').addEventListener('click',  (event) => {
        event.preventDefault();

        // Populate `address` Object with the content of <form>
        let addressForm = document.getElementById('addressForm');
        var formData = new FormData(addressForm);
        var address = {};    
        formData.forEach((value, name) => address[name] = value);
        address.addressType = thisAddressType;

        let xhr = new XMLHttpRequest();
        xhr.open('PUT', `http://localhost:5000/users/addresses/update/${currentEditingUserID}/${currentEditingAddressID}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json'); // Data Type to be sent: JSON 
        xhr.send(JSON.stringify(address));
        xhr.onerror = function() {
            console.error('Network error');
        };    
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {   
                refreshAddresses(); // Refresh <table> after CREATE
                console.log(`User ${currentEditingUserID}'s ${thisAddressType} Address updated`, address);
                addressForm.reset(); // Reset the form 
                
                // Disable edit <button>
                document.getElementById('editAddressButton').disabled = true;
            } else {
                console.error(this.statusText);
            }
        };  
    });    

    // [Path 6] DELETE - Delete a specific address for a specific user - '/users/:userID/addresses/delete/:addressID'   
    window.deleteAddress = function(addressID) {
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:5000/users/addresses/delete/${currentEditingUserID}/${addressID}`, true);
        xhr.send();    
        xhr.onerror = function() {
            console.error('Network error');
        };
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {    
                console.log(`User ${currentEditingUserID}'s ${thisAddressType} Address deleted`);
                refreshAddresses(); // Refresh <table> after CREATE
            } else {
                console.error(this.statusText);
            }
        };                    
    };  
});