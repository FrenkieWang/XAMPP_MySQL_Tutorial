// Function to fetch members and render as radios
function fetchAllMembers() {
    axios.get('http://localhost:5000/members/get')
    .then(response => {
        const memberRadioDiv = document.getElementById('memberRadio');

        response.data.forEach(member => {
            const radio = document.createElement('input');
            const label = document.createElement('label');

            radio.type = 'radio';
            radio.name = 'memberID'; 
            radio.value = member._id.toString();

            label.htmlFor = radio.id;
            label.textContent = member.firstName + " " + member.lastName; 

            const container = document.createElement('div');
            container.appendChild(radio);
            container.appendChild(label);
            memberRadioDiv.appendChild(container);
        });
    })
    .catch(error => console.error(error));
}

// Function to fetch courses and render as checkboxes
function fetchAllCourses() {
    axios.get('http://localhost:5000/courses/get')
    .then(response => {
        const classCheckboxDiv = document.getElementById('classCheckbox');
        response.data.forEach(course => {
            const checkbox = document.createElement('input');
            const label = document.createElement('label');

            checkbox.type = 'checkbox';
            checkbox.name = 'classBasket';
            checkbox.value = course._id.toString();

            label.htmlFor = checkbox.id;
            label.textContent = course.courseName;

            const container = document.createElement('div');
            container.appendChild(checkbox);
            container.appendChild(label);
            classCheckboxDiv.appendChild(container);
        });
    })
    .catch(error => console.error(error));
}


document.addEventListener('DOMContentLoaded', function() {
    fetchAllMembers(); 
    fetchAllCourses(); 
    refreshEnrollments(); // Refresh <table> when Page loaded
    var currentEditingEnrollmentId = null; // Make sure to edit only one enrollment

    // [Path 1 - Get] -- Get all Enrollments - 'http://localhost:5000/enrollments/get'
    function refreshEnrollments() {

        axios.get('http://localhost:5000/enrollments/get')
        .then(response => {
            const enrollmentList = document.getElementById('enrollmentList');
            enrollmentList.innerHTML = ''; // Clear Enrollment Table
            
            response.data.forEach(currentEnrollment => {   
                const fullName = currentEnrollment.memberID.firstName + " " + currentEnrollment.memberID.lastName;
                const courses = currentEnrollment.classBasket.map(course => course.courseName).join(", ");

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${currentEnrollment._id.toString()}</td> 
                    <td>${fullName}</td>  
                    <td>${courses}</td>
                    <td>
                        <a href="#" onclick="editEnrollment('${currentEnrollment._id.toString()}')">edit</a> / 
                        <a href="#" onclick="deleteEnrollment('${currentEnrollment._id.toString()}')">delete</a>
                    </td>
                `;
                enrollmentList.appendChild(tr);
            });

            // [Default] - Select first Radio
            const radios = document.querySelectorAll('input[name="memberID"]');
            if (radios.length > 0) radios[0].checked = true;            
        })
        .catch(error => console.error(error.message));      
    }

    // [Path 2 - POST] -- Create a Enrollment - 'http://localhost:5000/enrollments/create'
    document.getElementById('createEnrollmentButton').addEventListener('click', (event) => {
        event.preventDefault(); 

        // Populate `enrollment` Object with the content of <form>
        let enrollmentForm = document.getElementById('enrollmentForm');
        var enrollment = {
            classBasket : []
        };
        Array.from(enrollmentForm.elements).forEach(field => {
            if (field.type === 'checkbox' && field.checked) {   
                enrollment.classBasket.push(field.value);                 
            } else if (field.type === 'radio' && field.checked) {
                enrollment[field.name] = field.value;
            }
            else if (field.type !== 'submit' && field.type !== 'checkbox' && field.type !== 'radio') {
                enrollment[field.name] = field.value;
            }
        });

        if (enrollment.classBasket.length !== 3) {
            alert("Gym members must exactly take 3 classes!");
            return; // Prevent Submission
        }          

        axios.post('http://localhost:5000/enrollments/create', enrollment)
        .then(() => {
            refreshEnrollments(); // Refresh <table> after CREATE
            console.log(`Enrollment created: `, enrollment);
            enrollmentForm.reset(); // Clear the form
        })
        .catch(error => console.error(error.message));
    });      


    // [Path 3 - GET] -- Get a Enrollment - 'http://localhost:5000/enrollments/get/:enrollmentId'
    window.editEnrollment = function(enrollmentId) {             
        currentEditingEnrollmentId = enrollmentId;  // Change current Editing EnrollmentId  

        axios.get(`http://localhost:5000/enrollments/get/${enrollmentId}`)
        .then(response => {
            console.log("Get this Enrollment", response.data); 
            let enrollmentData = {...response.data}; // light copy, avoid changing the original data
            delete enrollmentData._id; 
            delete enrollmentData.__v; 
        
            // Fill the <form> with fetched Enrollment
            let enrollmentForm = document.getElementById('enrollmentForm');                 
            Object.keys(enrollmentData).forEach(key => {
                const element = enrollmentForm.elements[key];  

                if(element instanceof NodeList){
                    if(element[0]?.type === 'checkbox'){
                        const checkboxValues = enrollmentData[key].map(item => item._id);
                        document.querySelectorAll(`input[name="${key}"]`).forEach(checkbox => {
                            checkbox.checked = checkboxValues.includes(checkbox.value);
                        });
                    } else if (element[0]?.type === 'radio'){
                        const radioValue = enrollmentData[key]._id;
                        document.querySelectorAll(`input[name="${key}"]`).forEach(radio => {
                            radio.checked = (radioValue === radio.value);
                        });
                    }                                                 
                } else {
                    element.value = enrollmentData[key];
                }     
            });
        
            // Enable edit <button>, disable create <button>
            document.getElementById('editEnrollmentButton').disabled = false;
            document.getElementById('createEnrollmentButton').disabled = true;
        })
        .catch(error => console.error(error.message));      
    };


    // [Path 4 - PUT] -- Update a Enrollment - 'http://localhost:5000/enrollments/update/:enrollmentId'
    document.getElementById('editEnrollmentButton').addEventListener('click',  (event) => {
        event.preventDefault();    

        // Populate `enrollment` Object with the content of <form>
        let enrollmentForm = document.getElementById('enrollmentForm');
        var enrollment = {
            classBasket : []
        };
        Array.from(enrollmentForm.elements).forEach(field => {
            if (field.type === 'checkbox' && field.checked) {   
                enrollment.classBasket.push(field.value);                 
            } else if (field.type === 'radio' && field.checked) {
                enrollment[field.name] = field.value;
            }
            else if (field.type !== 'submit' && field.type !== 'checkbox' && field.type !== 'radio') {
                enrollment[field.name] = field.value;
            }
        });

        if (enrollment.classBasket.length !== 3) {
            alert("Gym members must exactly take 3 classes!");
            return; // Prevent Submission
        }     

        axios.put(`http://localhost:5000/enrollments/update/${currentEditingEnrollmentId}`, enrollment)
        .then((response) => {
            refreshEnrollments(); // Refresh <table> after UPDATE
            console.log(`Enrollment: ${currentEditingEnrollmentId} updated`, response.data);
            enrollmentForm.reset(); // Clear the form
    
            // Disable edit <button>, enable create <button>
            document.getElementById('editEnrollmentButton').disabled = true;
            document.getElementById('createEnrollmentButton').disabled = false;
        })
        .catch(error => console.error(error.message));     
    });

    // [Path 5 -- DELETE] -- Delete a Enrollment - 'http://localhost:5000/enrollments/delete/:modulId'
    window.deleteEnrollment = function(enrollmentId) {             
        axios.delete(`http://localhost:5000/enrollments/delete/${enrollmentId}`)
        .then(() => {
            console.log(`Enrollment: ${enrollmentId} deleted successfully`);
            refreshEnrollments(); // Refresh the list after deleting
        })
        .catch(error => console.error(error.message));
    };

    // [Path 6 -- Create] -- Generate Random Course - 'http://localhost:5000/courses/generate-course'
    document.getElementById('generateRandomCourse').addEventListener('click', () => {  
        // Randomly check 1 Radio
        const radios = document.querySelectorAll('input[name="memberID"]');
        if (radios.length > 0) {
            const randomRadioIndex = Math.floor(Math.random() * radios.length);
            radios.forEach((radio, index) => {
                radio.checked = index === randomRadioIndex;
            });
        }

        // Randomly check 3 Checkboxes
        const checkboxes = Array.from(document.querySelectorAll('input[name="classBasket"]'));
        if (checkboxes.length >= 3) {
            checkboxes.forEach(checkbox => checkbox.checked = false);    
            // Random shuffle Array and select the first 3 Elements
            const shuffled = checkboxes.sort(() => 0.5 - Math.random()); 
            shuffled.slice(0, 3).forEach(checkbox => checkbox.checked = true); 
        }
    });

}); // End of Load Page