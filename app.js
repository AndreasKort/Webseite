const users = [
  { email: 'kort@fn.de', password: '1234' },
  { email: 'bartlomiej.idzinski@docc.techstarter.de', password: '1234' },
  { email: 'ingo.neubert@docc.techstarter.de', password: '1234' },
  { email: 'mathias.popow@docc.techstarter.de', password: '1234' }
]; // Array zum Speichern der Benutzer

let tasks = []; // Array zum Speichern der Aufgaben

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;

  // Überprüfen der Benutzeranmeldeinformationen
  let isValidUser = users.some(function(user) {
    return user.email === username && user.password === password;
  });

  // Anmeldeformular wird ausgeblendet und Anwendungsbereich angezeigt
  if (isValidUser) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
  } else {
    alert('Falscher Benutzername oder Passwort!');
  }
});

// Funktion zum Vergleichen von Datumszeichenfolgen im Format "YYYY-MM-DD"
function compareDueDates(a, b) {
  const dateA = new Date(a.dueDate);
  const dateB = new Date(b.dueDate);

  // Verwenden von getTime(), um den Vergleich in Millisekunden durchzuführen
  if (dateA.getTime() < dateB.getTime()) return -1;
  if (dateA.getTime() > dateB.getTime()) return 1;
  return 0;
}

// Laden der Aufgabenliste aus dem Local Storage
let savedTasks = localStorage.getItem('tasks');
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
  // Sortieren der geladenen Aufgabenliste nach Fälligkeitsdatum
  tasks.sort(compareDueDates);
  // Aufgabenliste anzeigen
  tasks.forEach(addTaskToList);
  // Aktualisiere die Checkboxen basierend auf dem Aufgabenstatus
  updateCheckboxStatus();
}

// Aufgabe hinzufügen
document.getElementById('add-task-form').addEventListener('submit', function(event) {
  event.preventDefault();
  let title = document.getElementById('task-title').value;
  let description = document.getElementById('task-description').value;
  let dueDate = document.getElementById('task-dueDate').value;
  let task = {
    title: title,
    description: description,
    dueDate: dueDate,
    completed: false
  };
  // Aufgabe zur Liste hinzufügen
  tasks.push(task);

  // Sortieren der Aufgabenliste nach Fälligkeitsdatum
  tasks.sort(compareDueDates);

  // Speichern der aktualisierten Aufgabenliste im Local Storage
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Hier kannst du die Aufgabe zur Liste hinzufügen
  // Beispiel: Speichern der Aufgabe in einer Datenbank oder im Local Storage
  addTaskToList(task);
  clearAddTaskForm();
});

// Funktion zum Laden der Aufgabenliste in die Anzeige
function loadTasks() {
  let taskList = document.getElementById('tasks');
  taskList.innerHTML = ''; // Lösche die aktuelle Anzeige

  tasks.forEach(function(task) {
    addTaskToList(task);
  });
}

// Aufgabenliste anzeigen
function addTaskToList(task) {
  let taskList = document.getElementById('tasks');
  let li = document.createElement('li');
  li.innerHTML = '<input type="checkbox"> ' + task.title + '<br>Description: ' + task.description + '<br>Due Date: ' + task.dueDate;
  if (task.completed) {
    li.classList.add('completed');
  }
  taskList.appendChild(li);

  // Hier fügen wir die Funktion zur Markierung von Aufgaben hinzu
  let checkbox = li.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('click', function(event) {
    task.completed = checkbox.checked;
    if (checkbox.checked) {
      li.classList.add('completed');
    } else {
      li.classList.remove('completed');
    }

    // Speichern der aktualisierten Aufgabenliste im Local Storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  });
}

// Suchfunktion
document.getElementById('search-button').addEventListener('click', function() {
  let searchInput = document.getElementById('search-input').value.toLowerCase();
  let tasksList = document.getElementById('tasks').getElementsByTagName('li');
  for (let i = 0; i < tasksList.length; i++) {
    let taskTitle = tasksList[i].innerText.toLowerCase();
    if (taskTitle.includes(searchInput)) {
      tasksList[i].style.display = 'block';
    } else {
      tasksList[i].style.display = 'none';
    }
  }
});

// Hilfsfunktionen / Aufgaben werden geleert
function clearAddTaskForm() {
  document.getElementById('task-title').value = '';
  document.getElementById('task-description').value = '';
  document.getElementById('task-dueDate').value = '';
}

// Aktualisiere den Status der Checkboxen basierend auf dem Aufgabenstatus
function updateCheckboxStatus() {
  tasks.forEach(function(task, index) {
    let li = document.getElementsByTagName('li')[index];
    let checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.checked = task.completed;
  });
}

// Rufe loadTasks() auf, um die Aufgaben beim Laden der Seite anzuzeigen
loadTasks();
