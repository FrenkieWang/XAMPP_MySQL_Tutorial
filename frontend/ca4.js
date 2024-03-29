document.addEventListener('DOMContentLoaded', function() {
    var createEditUserForm = document.getElementById('createEditUserForm');
    var userForm = document.getElementById('userForm');   
    var addressDashBoard = document.getElementById('addressDashBoard');
    var createEditAddressForm = document.getElementById('createEditAddressForm');
    var addressForm = document.getElementById('addressForm');    

    var currentEditingUserId = null; // Make sure to edit only one user
    var currentEditingAddressId = null; // Make sure to edit only one addresss

    // Set Logic of Title Selection
    var titleSelect = document.querySelector('select[name="title"]');
    var titleOtherGroup = document.getElementById('titleOtherGroup');
    function handleTitleChange() {
        if (this.value === 'Other') {
            titleOtherGroup.style.display = 'block';
        } else {
            titleOtherGroup.style.display = 'none';
        }
    }
    titleSelect.addEventListener('change', handleTitleChange);

    
    //*********************************User************************* */
    // Set function of `Create User` Link
    document.querySelector('a[href="/user/create"]').addEventListener('click', function(event) {
        event.preventDefault();

        createEditUserForm.style.display = 'block';
        addressDashBoard.style.display = 'none';
        document.getElementById('editUserButton').disabled = true;
        document.getElementById('createUserButton').disabled = false;
        document.getElementById('editingUser').innerText = `Editing User: None`;
    });

    // Set function of every `Back To User List` Link
    document.querySelectorAll('.backToUserList').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            createEditUserForm.style.display = 'none';
            addressDashBoard.style.display = 'none';
        });
    });

    refreshUsers(); // Refresh Users when browser loaded

    // [Path 1] GET - Read all Users - '/users/get'
    function refreshUsers() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:5000/users/get', true);

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                const users = JSON.parse(this.responseText);

                // Clear User Table
                const userList = document.getElementById('userList');
                userList.innerHTML = ''; 

                // Create every Table Row in <tbody id="userList">
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
                            <a href="#" onclick="event.preventDefault(); showAddressTable(${currentUser.userId});">Show Address</a>
                        </td>
                        <td>
                            <a href="#" onclick="editUser(${currentUser.userId})">edit</a> | 
                            <a href="#" onclick="event.preventDefault(); deleteUser(${currentUser.userId});">delete</a>
                        </td>
                    `;
                    userList.appendChild(tr);
                });
            }else{
                console.log('Failed to fetch Users:', this.statusText);
            }
        };

        xhr.onerror = function() {
            console.error('Network error');
        };

        xhr.send();
    }


    // [Path 2] POST - Create a User - '/users/create'
    document.getElementById('createUserButton').addEventListener('click', function(event) {
        event.preventDefault(); 

        // Create a FormData object. Input : <form> element
        var formData = new FormData(userForm);
        var user = {};         
        // Store <form> `[name]:value` into user Object
        formData.forEach(function(value, key) {
            user[key] = value;
        });
    
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:5000/users/create', true);

        xhr.setRequestHeader('Content-Type', 'application/json'); // Data Type to be sent: JSON       

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                console.log('User created successfully');
                refreshUsers(); // Refresh <table> after CREATE
            } else {
                console.log('Failed to Create a User:', this.statusText);
            }
        };
    
        xhr.onerror = function() {
            console.error('Network error');
        };        

        console.log(user); // Convert JSON into String, print on Console
        xhr.send(JSON.stringify(user));     
    });    


    // [Path 3] GET - Read a User - '/users/get/:userId'
    window.editUser = function(userId) {        
        addressDashBoard.style.display = 'none'; // close Address DashBoard
        
        currentEditingUserId = userId;  // Change current Editing UserId   
        document.getElementById('editingUser').innerText = `Editing User: ${currentEditingUserId}`;
    
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:5000/users/get/${currentEditingUserId}`, true);

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                // Get First element of JSON Array, print it on Console
                var userArray = JSON.parse(this.responseText);
                var user = userArray[0];
                console.log(user); 

                // Fill the <form> with fetched User
                userForm.elements['title'].value = user.title;
                userForm.elements['titleOther'].value = user.titleOther || ''; // Avoid Null
                userForm.elements['firstName'].value = user.firstName;
                userForm.elements['surName'].value = user.surName;
                userForm.elements['mobile'].value = user.mobile;
                userForm.elements['email'].value = user.email;

                // Change `Disable` and `Hidden`
                createEditUserForm.style.display = 'block';
                document.getElementById('editUserButton').disabled = false;
                document.getElementById('createUserButton').disabled = true;

                // Refresh TitleOther Input
                titleOtherGroup.style.display = user.title === 'Other' ? 'block' : 'none';
            } else {
                console.log('Failed to Get this User:', this.statusText);
            }
        };

        xhr.onerror = function() {
            console.error('Network error');
        };

        xhr.send();
    };


    // [Path 4] PUT - Update a User - '/users/update/:userId'
    document.getElementById('editUserButton').addEventListener('click',  function(event) {
        event.preventDefault();

        var formData = new FormData(userForm);
        var user = {};
        formData.forEach(function(value, key) {
            user[key] = value;
        });

        let xhr = new XMLHttpRequest();
        xhr.open('PUT', `http://localhost:5000/users/update/${currentEditingUserId}`, true);

        xhr.setRequestHeader('Content-Type', 'application/json'); // Data Type to be sent: JSON 

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                console.log('User updated successfully');
                refreshUsers(); // Refresh <table> after UPDATE
            } else {
                console.log('Failed to Edit User:', this.statusText);
            }
        };

        xhr.onerror = function() {
            console.error('Network error');
        };    
        
        console.log(user); // Convert JSON into String, print on Console
        xhr.send(JSON.stringify(user));
    });


    // [Path 5] DELETE - Delete a User - '/users/delete/:userId'
    window.deleteUser = function(userId) {
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:5000/users/delete/${userId}`, true);
        
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                console.log(`User: ${userId} deleted successfully`);
                refreshUsers(); // Refresh the list after deleting
            } else {
                console.log('Failed to Delete User:', this.statusText);
            }
        };

        xhr.onerror = function() {
            console.error('Network error');
        };

        xhr.send();
    }; 
    

    //*********************************Address************************* */
    // Set function of `Create Address` Link
    document.querySelector('a[href="/user/address/create"]').addEventListener('click', function(event) {
        event.preventDefault();
        // Change `Disable` and `Hidden`
        createEditAddressForm.style.display = 'block';
        addressForm.style.display = 'block';
        document.getElementById('editAddressButton').disabled = true;
        document.getElementById('createAddressButton').disabled = false;
        document.getElementById('editingAddress').innerText = `Editing Address: None`;
    });
    
    // Set the function of `Show Address` in each Row with `userId`
    window.showAddressTable = function(userId) {
        currentEditingUserId = userId;
        document.getElementById('userAddressTitle').innerText = `CRUD for User(${userId})'s Address`;

        addressDashBoard.style.display = 'block';
        createEditUserForm.style.display = 'none';
        addressForm.style.display = 'none';

        refreshAddresses();  // Refresh Addresses in userId 
    }

    // Set function of `Back To Address List` Link
    document.getElementById('backToAddressList').addEventListener('click', function(event) {
        event.preventDefault();
        createEditAddressForm.style.display = 'none';        
    });   


    // [Path 6] GET - Read all addresses for a specific user - '/users/:userId/addresses'
    function refreshAddresses() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:5000/users/${currentEditingUserId}/addresses`, true);

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                const addresses = JSON.parse(this.responseText);
    
                // Clear Address Table
                const addressList = document.getElementById('addressList');
                addressList.innerHTML = ''; 
    
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
                            <a href="#" onclick="editAddress(${currentEditingUserId}, ${currentAddress.addressId});">edit</a> | 
                            <a href="#" onclick="event.preventDefault(); deleteAddress(${currentEditingUserId}, ${currentAddress.addressId});">delete</a>

                        </td>
                    `;
                    addressList.appendChild(tr);
                });
            } else {
                console.log(`Failed to fetch User ${currentEditingUserId}'s Addresses:`, this.statusText);
            }
        };

        xhr.onerror = function() {
            console.error('Network error');
        };
    
        xhr.send();
    }
    

    // [Path 7] POST - Create an address for a specific user - '/users/:userId/addresses/create'
    document.getElementById('createAddressButton').addEventListener('click', function (event) {
        event.preventDefault();  
    
        // Create a FormData object. Input : <form> element
        var formData = new FormData(addressForm);
        var address = {};    
        // Store <form> `[name]:value` into address Object
        formData.forEach(function(value, key) {
            address[key] = value;
        });
    
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `http://localhost:5000/users/${currentEditingUserId}/addresses/create`, true);    

        xhr.setRequestHeader('Content-Type', 'application/json');
    
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                console.log(`User ${currentEditingUserId}'s Address created successfully`);
                refreshAddresses(); // Refresh <table> after CREATE
            } else {
                console.log(`Failed to create User ${currentEditingUserId}'s Address:`, this.statusText);
            }
        };
    
        xhr.onerror = function() {
            console.error('Network error');
        };
    
        xhr.send(JSON.stringify(address));
    });

    // [Path 8] GET - Read a specific address for a specific user - '/users/:userId/addresses/:addressId'
    window.editAddress = function (userId, addressId) {
        // Change current Editing UserId and addressId, render them in Page
        currentEditingUserId = userId;  
        document.getElementById('editingUser').innerText = `Editing User: ${currentEditingUserId}`;        
        currentEditingAddressId = addressId;   
        document.getElementById('editingAddress').innerText = `Editing Address: ${currentEditingAddressId}`;

        let xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:5000/users/${currentEditingUserId}/addresses/${currentEditingAddressId}`, true);
    
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                // Get First element of JSON Array, print it on Console
                const addressArray = JSON.parse(this.responseText);
                const address = addressArray[0];
                console.log(address);

                // Fill the <form> with fetched User
                if (address.addressType === 'home') {
                    addressForm.querySelector('input[id="home"]').checked = true;
                } else if (address.addressType === 'shipping') {
                    addressForm.querySelector('input[id="shipping"]').checked = true;
                }
                addressForm.elements['addressLine1'].value = address.addressLine1;
                addressForm.elements['addressLine2'].value = address.addressLine2 || ''; // Avoid null
                addressForm.elements['town'].value = address.town;
                addressForm.elements['countyCity'].value = address.countyCity;
                addressForm.elements['eircode'].value = address.eircode || '';
    
                // Change `Disable` and `Hidden`
                createEditAddressForm.style.display = 'block';
                addressForm.style.display = 'block';
                document.getElementById('editAddressButton').disabled = false;
                document.getElementById('createAddressButton').disabled = true;
            } else {
                console.log('Error:', this.statusText);
            }
        };
    
        xhr.onerror = function() {
            console.error('Network error');
        };
    
        xhr.send();
    }

    // [Path 9] PUT - Update a specific address for a specific user - '/users/:userId/addresses/:addressId/update'
    document.getElementById('editAddressButton').addEventListener('click',  function(event) {
        event.preventDefault();

        var formData = new FormData(addressForm);
        var address = {};    
        formData.forEach(function(value, key) {
            address[key] = value;
        });

        let xhr = new XMLHttpRequest();
        xhr.open('PUT', `http://localhost:5000/users/${currentEditingUserId}/addresses/${currentEditingAddressId}/update`, true);

        xhr.setRequestHeader('Content-Type', 'application/json'); // Data Type to be sent: JSON 

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                console.log(`Address: ${currentEditingAddressId} of User: ${currentEditingUserId} updated successfully`);
                refreshAddresses(); // Refresh <table> after CREATE
            } else {
                console.log(`Failed to update Address:`, this.statusText);
            }
        };

        xhr.onerror = function() {
            console.error('Network error');
        };    
        
        console.log(address); // Convert JSON into String, print on Console
        xhr.send(JSON.stringify(address));
    });
    

    // [Path 10] DELETE - Delete a specific address for a specific user - '/users/:userId/addresses/delete/:addressId'   
    window.deleteAddress = function(userId, addressId) {
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:5000/users/${userId}/addresses/delete/${addressId}`, true);
        
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                console.log(`Address: ${addressId} of User: ${userId} deleted successfully`);
                refreshAddresses(); // Refresh <table> after CREATE
            } else {
                console.log(`Failed to Delete ${userId}'s Address:`, this.statusText);
            }
        };
    
        xhr.onerror = function() {
            console.error('Network error');
        };
    
        xhr.send();
    };

});