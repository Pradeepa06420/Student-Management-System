const form = document.getElementById('studentForm');
const idInput = document.getElementById('id');
const nameInput = document.getElementById('name');
const regInput = document.getElementById('registerNumber');
const marksInput = document.getElementById('marks');
const tableBody = document.querySelector('#studentTable tbody');
const sortButton = document.getElementById('sortMarks');
const exportButton = document.getElementById('exportData');

let students = JSON.parse(localStorage.getItem('students')) || [];
let editIndex = null;
let sortDescending = true; // start by sorting highest to lowest

// Render student data in table
function renderTable() {
  tableBody.innerHTML = '';
  students.forEach((student, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.registerNumber}</td>
      <td>${student.marks}</td>
      <td>
        <button onclick="editStudent(${index})">Edit</button>
        <button onclick="deleteStudent(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Add / Edit student
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const id = idInput.value.trim();
  const name = nameInput.value.trim();
  const registerNumber = regInput.value.trim();
  const marks = Number(marksInput.value.trim()); // convert to number

  if (editIndex !== null) {
    students[editIndex] = { id, name, registerNumber, marks };
    editIndex = null;
  } else {
    students.push({ id, name, registerNumber, marks });
  }

  localStorage.setItem('students', JSON.stringify(students));
  renderTable();
  form.reset();
});

// Delete student
function deleteStudent(index) {
  if (!confirm('Are you sure you want to delete this student?')) return;
  students.splice(index, 1);
  localStorage.setItem('students', JSON.stringify(students));
  renderTable();
}

// Edit student
function editStudent(index) {
  const student = students[index];
  idInput.value = student.id;
  nameInput.value = student.name;
  regInput.value = student.registerNumber;
  marksInput.value = student.marks;
  editIndex = index;
}

// Sort by marks (toggle ascending/descending)
sortButton.addEventListener('click', () => {
  students.sort((a, b) => {
    return sortDescending ? b.marks - a.marks : a.marks - b.marks;
  });

  sortDescending = !sortDescending;
  sortButton.textContent = sortDescending ? 'Sort by Marks (Desc)' : 'Sort by Marks (Asc)';

  localStorage.setItem('students', JSON.stringify(students));
  renderTable();
});

// Export as JSON file
exportButton.addEventListener('click', () => {
  const dataStr = JSON.stringify(students, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "students.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Make delete/edit functions global (so HTML buttons can call them)
window.deleteStudent = deleteStudent;
window.editStudent = editStudent;

// Initialize
renderTable();
sortButton.textContent = sortDescending ? 'Sort by Marks (Desc)' : 'Sort by Marks (Asc)'; 
