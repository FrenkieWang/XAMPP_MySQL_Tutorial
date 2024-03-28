document.addEventListener('DOMContentLoaded', function() {
    fetchUsers();

    function fetchUsers() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:5000/users/get', true);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                const users = JSON.parse(this.responseText);
                displayUsers(users);
            } else {
                console.log('Failed to fetch users:', this.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Network error');
        };
        xhr.send();
    }

    function displayUsers(users) {
        const userList = document.getElementById('userList');
        userList.innerHTML = ''; // Clear existing users
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.title === 'Other' ? user.titleOther : user.title}</td>
                <td>${user.firstName}</td>
                <td>${user.surName}</td>
                <td>${user.mobile}</td>
                <td>${user.email}</td>
                <td><a href="/user/${user.userId}/address/">Show Address</a></td>
                <td>
                    <a href="/user/edit/${user.userId}">edit</a> | 
                    <a href="/" onclick="event.preventDefault(); deleteUser(${user.userId});">delete</a>
                </td>
            `;
            userList.appendChild(tr);
        });
    }

    window.deleteUser = function(userId) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:5000/users/delete/${userId}`, true);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                fetchUsers(); // Refresh the list after deleting
            } else {
                console.log('Failed to delete user:', this.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Network error');
        };
        xhr.send();
    };
});
