document.addEventListener('DOMContentLoaded', function() {
    var createEditUserForm = document.getElementById('createEditUserForm');
    var userForm = document.getElementById('userForm');   
    var addressDashBoard = document.getElementById('addressDashBoard');  

    var currentEditingUserId = null; // Make sure to edit only one user



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
        const xhr = new XMLHttpRequest();
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
        const xhr = new XMLHttpRequest();
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
});