document.addEventListener("DOMContentLoaded", () => {
    const lecturerList = document.getElementById("lecturer-list");
    const searchInput = document.getElementById("search-lecturer");
    const addButton = document.getElementById("add-lecturer");
    const modal = new bootstrap.Modal(document.getElementById("lecturerModal"));
    const saveButton = document.getElementById("save-lecturer");
    const nameInput = document.getElementById("lecturer-name");
    const emailInput = document.getElementById("lecturer-email");
    const subjectsSelect = document.getElementById("lecturer-subjects");

    let currentLecturerIndex = -1;

    // Get lecturers from localStorage or initialize as empty array
    const lecturers = JSON.parse(localStorage.getItem("lecturers")) || [];

    // Get subjects from localStorage
    const subjects = JSON.parse(localStorage.getItem("subjects")) || [];

    // Save lecturers to localStorage
    const saveLecturers = () => {
        localStorage.setItem("lecturers", JSON.stringify(lecturers));
    };

    // Render subjects in the select list for lecturers
    const renderSubjects = () => {
        // Clear current subject options
        subjectsSelect.innerHTML = "";

        // Render all subjects saved in localStorage
        subjects.forEach(subject => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = subject.name;
            checkbox.id = `subject-${subject.name}`;
            checkbox.classList.add("form-check-input");

            const label = document.createElement("label");
            label.setAttribute("for", checkbox.id);
            label.classList.add("form-check-label");
            label.textContent = subject.name;

            const div = document.createElement("div");
            div.classList.add("form-check");
            div.appendChild(checkbox);
            div.appendChild(label);

            subjectsSelect.appendChild(div);
        });
    };

    // Render lecturers on the page
    const renderLecturers = () => {
        lecturerList.innerHTML = lecturers.length
            ? lecturers
                  .map(
                      (lecturer, index) => `
                        <div class="col-md-4 mb-4">
                            <div class="card shadow-sm p-3">
                                <h5 class="card-title">${lecturer.name}</h5>
                                <p class="card-text">Email: ${lecturer.email}</p>
                                <p class="card-text">Subjects: ${lecturer.subjects.length ? lecturer.subjects.join(", ") : "No subjects"}</p>
                                <button class="btn btn-warning edit-btn" data-index="${index}">Edit</button>
                                <button class="btn btn-danger delete-btn" data-index="${index}">Delete</button>
                            </div>
                        </div>`
                  )
                  .join("")
            : `<p>No lecturers found.</p>`;
    };

    // Open modal for adding or editing a lecturer
    const openModal = (lecturerIndex = -1) => {
        if (lecturerIndex !== -1) {
            const lecturer = lecturers[lecturerIndex];
            nameInput.value = lecturer.name;
            emailInput.value = lecturer.email;

            // Ensure lecturer.subjects is defined as an array (default to an empty array if not)
            const subjects = lecturer.subjects || [];

            // Loop through each checkbox and check if it's in the lecturer's subjects list
            Array.from(subjectsSelect.querySelectorAll('input[type="checkbox"]')).forEach(checkbox => {
                checkbox.checked = subjects.includes(checkbox.value);  // Check if the subject is selected
            });
        } else {
            nameInput.value = "";
            emailInput.value = "";
            Array.from(subjectsSelect.querySelectorAll('input[type="checkbox"]')).forEach(checkbox => {
                checkbox.checked = false;  // Uncheck all when no lecturer is selected
            });
        }
        currentLecturerIndex = lecturerIndex;
        modal.show();
    };

    // Open modal when Add button is clicked
    addButton.addEventListener("click", () => {
        openModal();
    });

    // Save the lecturer when Save button is clicked
    saveButton.addEventListener("click", () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        // Get all checked checkboxes
        const selectedSubjects = Array.from(subjectsSelect.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

        if (name && email) {
            if (currentLecturerIndex === -1) {
                // Add a new lecturer
                lecturers.push({ name, email, subjects: selectedSubjects });
            } else {
                // Update existing lecturer
                lecturers[currentLecturerIndex] = { name, email, subjects: selectedSubjects };
            }
            saveLecturers();
            renderLecturers();
            modal.hide();
        } else {
            alert("Both name and email are required.");
        }
    });

    // Handle editing and deleting lecturers
    lecturerList.addEventListener("click", event => {
        const index = event.target.dataset.index;

        if (event.target.classList.contains("delete-btn")) {
            lecturers.splice(index, 1);
            saveLecturers();
            renderLecturers();
        } else if (event.target.classList.contains("edit-btn")) {
            openModal(index);
        }
    });

    // Filter lecturers based on search input
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filteredLecturers = lecturers.filter(
            lecturer =>
                lecturer.name.toLowerCase().includes(query) ||
                lecturer.email.toLowerCase().includes(query)
        );
        lecturerList.innerHTML = filteredLecturers.length
            ? filteredLecturers
                  .map(
                      (lecturer, index) => `
                        <div class="col-md-4 mb-4">
                            <div class="card shadow-sm p-3">
                                <h5 class="card-title">${lecturer.name}</h5>
                                <p class="card-text">Email: ${lecturer.email}</p>
                                <p class="card-text">Subjects: ${lecturer.subjects.join(", ")}</p>
                                <button class="btn btn-warning edit-btn" data-index="${index}">Edit</button>
                                <button class="btn btn-danger delete-btn" data-index="${index}">Delete</button>
                            </div>
                        </div>`
                  )
                  .join("")
            : `<p>No results found.</p>`;
    });

    // Initial rendering of subjects and lecturers
    renderSubjects();
    renderLecturers();
});