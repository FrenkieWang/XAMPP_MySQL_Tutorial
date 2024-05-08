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

document.addEventListener('DOMContentLoaded', function() {
    refreshMembers(); // Refresh <table> when Page loaded
    var currentEditingMemberId = null; // Make sure to edit only one member

    // [Path 1 - Get] -- Get all Members - 'http://localhost:5000/members/get'
    function refreshMembers() {
        axios.get('http://localhost:5000/members/get')
        .then(response => {
            const memberList = document.getElementById('memberList');
            memberList.innerHTML = ''; // Clear Member Table
            
            response.data.forEach(currentMember => {
                const titleDisplay = currentMember.title === 'Other' ?
                    currentMember.titleOther : currentMember.title;
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${currentMember._id.toString()}</td> 
                    <td>${currentMember.memberID}</td>
                    <td>${titleDisplay}</td>
                    <td>${currentMember.firstName + " " + currentMember.lastName}</td>
                    <td>${currentMember.email}</td> 
                    <td>${currentMember.premium}</td> 
                    <td>
                        <a href="#" onclick="editMember('${currentMember._id.toString()}')">edit</a> / 
                        <a href="#" onclick="deleteMember('${currentMember._id.toString()}')">delete</a>
                    </td>
                `;
                memberList.appendChild(tr);
            });
        })
        .catch(error => console.error(error.message));
    }

    // [Path 2 - POST] -- Create a Member - 'http://localhost:5000/members/create'
    document.getElementById('createMemberButton').addEventListener('click', (event) => {
        event.preventDefault(); 

        // Populate `member` Object with the content of <form>
        let memberForm = document.getElementById('memberForm');
        var formData = new FormData(memberForm);
        var member = {};
        formData.forEach((value, name) => member[name] = value);

        axios.post('http://localhost:5000/members/create', member)
        .then(() => {
            refreshMembers(); // Refresh <table> after CREATE
            console.log(`Member created: `, member);
            memberForm.reset(); // Clear the form
        })
        .catch(error => console.error(error.message));
    });      


    // [Path 3 - GET] -- Get a Member - 'http://localhost:5000/members/get/:memberId'
    window.editMember = function(memberId) {             
        currentEditingMemberId = memberId;  // Change current Editing MemberId  

        axios.get(`http://localhost:5000/members/get/${memberId}`)
        .then(response => {
            console.log("Get this Member", response.data); 
            let memberData = {...response.data}; // light copy, avoid changing the original data
            delete memberData._id; 
            delete memberData.__v; 
        
            // Fill the <form> with fetched Member
            let memberForm = document.getElementById('memberForm');
            Object.keys(memberData).forEach(key => {
                memberForm.elements[key].value = memberData[key];                         
            });
        
            // Enable edit <button>, disable create <button>
            document.getElementById('editMemberButton').disabled = false;
            document.getElementById('createMemberButton').disabled = true;
        })
        .catch(error => console.error(error.message));      
    };


    // [Path 4 - PUT] -- Update a Member - 'http://localhost:5000/members/update/:memberId'
    document.getElementById('editMemberButton').addEventListener('click',  (event) => {
        event.preventDefault();    

        // Populate `member` Object with the content of <form>
        let memberForm = document.getElementById('memberForm');
        var formData = new FormData(memberForm);
        var member = {};
        formData.forEach((value, name) => member[name] = value);

        axios.put(`http://localhost:5000/members/update/${currentEditingMemberId}`, member)
        .then((response) => {
            refreshMembers(); // Refresh <table> after UPDATE
            console.log(`Member: ${currentEditingMemberId} updated`, response.data);
            memberForm.reset(); // Clear the form
    
            // Disable edit <button>, enable create <button>
            document.getElementById('editMemberButton').disabled = true;
            document.getElementById('createMemberButton').disabled = false;
        })
        .catch(error => console.error(error.message));     
    });

    // [Path 5 -- DELETE] -- Delete a Member - 'http://localhost:5000/members/delete/:modulId'
    window.deleteMember = function(memberId) {             
        axios.delete(`http://localhost:5000/members/delete/${memberId}`)
        .then(() => {
            console.log(`Member: ${memberId} deleted successfully`);
            refreshMembers(); // Refresh the list after deleting
        })
        .catch(error => console.error(error.message));
    };

    // [Path 6 -- Create] -- Generate Random Member - 'http://localhost:5000/members/generate-member'
    document.getElementById('generateRandomMember').addEventListener('click', (event) => {  
        event.preventDefault(); 

        axios.get(`http://localhost:5000/members/generate-member`)
        .then(response => {
            console.log("Generate a Member", response.data); 
            let memberData = {...response.data}; // light copy
            delete memberData._id; 
            delete memberData.__v; 
        
            // Fill the <form> with fetched Member
            let memberForm = document.getElementById('memberForm');
            Object.keys(memberData).forEach(key => {
                memberForm.elements[key].value = memberData[key];                       
            });
            toggleTitleOther(memberData.title); 
        })
        .catch(error => console.error(error.message));  
    });

}); // End of Load Page