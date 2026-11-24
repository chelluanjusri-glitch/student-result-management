
// Get student records from Local Storage
let students = JSON.parse(localStorage.getItem("students")) || [];

let editIndex = -1;

// Admin Login
function adminLogin() {
    let username = document.getElementById("adminUser").value;
    let password = document.getElementById("adminPass").value;

    if (username === "admin" && password === "12345") {
        sessionStorage.setItem("adminLoggedIn", "true");

        document.getElementById("loginSection").style.display = "none";
        document.getElementById("dashboard").style.display = "block";

        displayStudents();
    } else {
        document.getElementById("loginMessage").innerText =
            "Invalid Username or Password!";
    }
}

// Check Admin Login
if (window.location.pathname.endsWith("admin.html")) {
    if (sessionStorage.getItem("adminLoggedIn") === "true") {
        document.addEventListener("DOMContentLoaded", function() {
            document.getElementById("loginSection").style.display = "none";
            document.getElementById("dashboard").style.display = "block";
            displayStudents();
        });
    }
}

// Logout
function logout() {
    sessionStorage.removeItem("adminLoggedIn");
    window.location.href = "index.html";
}

// Calculate Result
function calculateResult(m1, m2, m3) {
    let total = m1 + m2 + m3;
    let percentage = total / 3;

    let grade = "F";

    if (m1 >= 35 && m2 >= 35 && m3 >= 35) {
        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B";
        else if (percentage >= 60) grade = "C";
        else if (percentage >= 50) grade = "D";
        else grade = "Pass";
    }

    return {
        total: total,
        percentage: percentage.toFixed(2),
        grade: grade,
        status: grade === "F" ? "Fail" : "Pass"
    };
}

// Add or Update Student
function addStudent() {
    if (sessionStorage.getItem("adminLoggedIn") !== "true") {
        alert("Please login as admin first!");
        return;
    }

    let roll = document.getElementById("roll").value.trim();
    let name = document.getElementById("name").value.trim();
    let course = document.getElementById("course").value.trim();

    let m1 = Number(document.getElementById("mark1").value);
    let m2 = Number(document.getElementById("mark2").value);
    let m3 = Number(document.getElementById("mark3").value);

    if (!roll || !name || !course ||
        document.getElementById("mark1").value === "" ||
        document.getElementById("mark2").value === "" ||
        document.getElementById("mark3").value === "") {
        alert("Please fill all fields!");
        return;
    }

    if ([m1, m2, m3].some(m => !Number.isInteger(m) || m < 0 || m > 100)) {
        alert("Marks must be whole numbers between 0 and 100!");
        return;
    }

    let existingIndex = students.findIndex(
        (s, i) => s.roll.toLowerCase() === roll.toLowerCase() && i !== editIndex
    );

    if (existingIndex !== -1) {
        alert("Roll number already exists!");
        return;
    }

    let result = calculateResult(m1, m2, m3);

    let student = {
        roll, name, course, m1, m2, m3,
        ...result
    };

    if (editIndex === -1) {
        students.push(student);
    } else {
        students[editIndex] = student;
    }

    localStorage.setItem("students", JSON.stringify(students));

    alert(editIndex === -1 ? "Student Added Successfully!" : "Student Updated Successfully!");

    editIndex = -1;
    document.getElementById("saveButton").innerText = "Add Result";
    clearFields();
    displayStudents();
}

// Clear Input Fields
function clearFields() {
    ["roll", "name", "course", "mark1", "mark2", "mark3"]
        .forEach(id => document.getElementById(id).value = "");
}

// Display Students
function displayStudents() {
    let table = document.getElementById("studentTable");
    if (!table) return;

    let search = document.getElementById("searchAdmin").value.toLowerCase();

    table.innerHTML = "";

    students.forEach((s, index) => {
        if (!s.roll.toLowerCase().includes(search)) return;

        table.innerHTML += `
        <tr>
            <td>${s.roll}</td>
            <td>${s.name}</td>
            <td>${s.course}</td>
            <td>${s.total}</td>
            <td>${s.percentage}%</td>
            <td>${s.grade}</td>
            <td>
                <button onclick="editStudent(${index})">Edit</button>
                <button onclick="deleteStudent(${index})">Delete</button>
            </td>
        </tr>`;
    });
}

// Edit Student
function editStudent(index) {
    let s = students[index];

    document.getElementById("roll").value = s.roll;
    document.getElementById("name").value = s.name;
    document.getElementById("course").value = s.course;
    document.getElementById("mark1").value = s.m1;
    document.getElementById("mark2").value = s.m2;
    document.getElementById("mark3").value = s.m3;

    editIndex = index;
    document.getElementById("saveButton").innerText = "Update Result";

    window.scrollTo(0, 0);
}

// Delete Student
function deleteStudent(index) {
    if (confirm("Are you sure you want to delete this student?")) {
        students.splice(index, 1);
        localStorage.setItem("students", JSON.stringify(students));
        displayStudents();
    }
}

// Search Student Result
function searchResult() {
    let roll = document.getElementById("studentRoll").value.trim().toLowerCase();

    let student = students.find(
        s => s.roll.toLowerCase() === roll
    );

    let result = document.getElementById("result");

    if (!roll) {
        result.innerHTML = "Please enter your roll number.";
        return;
    }

    if (!student) {
        result.innerHTML = "No student record found!";
        return;
    }

    result.innerHTML = `
        <h2>Student Result</h2>
        <p><b>Roll Number:</b> ${student.roll}</p>
        <p><b>Name:</b> ${student.name}</p>
        <p><b>Course:</b> ${student.course}</p>
        <hr>
        <h3>Subject Marks</h3>
        <p>Subject 1: ${student.m1}/100</p>
        <p>Subject 2: ${student.m2}/100</p>
        <p>Subject 3: ${student.m3}/100</p>
        <hr>
        <p><b>Total Marks:</b> ${student.total}/300</p>
        <p><b>Percentage:</b> ${student.percentage}%</p>
        <p><b>Grade:</b> ${student.grade}</p>
        <h3>Result: ${student.status}</h3>
    `;
}
