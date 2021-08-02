function handleLogin(response) {
    // send token to server for verification
    // if valid, display new classroom / open classroom buttons
    // add buttons to div, set on click functions
    var googleButtonDiv = document.getElementById("gbutton");
    googleButtonDiv.style.display = "none";

    loadOpenClassrooms();

    var newClassroomButtonDiv = document.getElementById('new_classroom_button');
    newClassroomButtonDiv.style.display = "block";
    var newClassroomButton = document.createElement('button');
    var newClassroomButtonText = document.createElement('span');
    newClassroomButtonText.innerText = "New Classroom";
    newClassroomButton.onclick = createClassroom;
    newClassroomButton.appendChild(newClassroomButtonText);
    newClassroomButtonDiv.appendChild(newClassroomButton);

    var openClassroomButtonDiv = document.getElementById('open_classroom_button');
    openClassroomButtonDiv.style.display = "block";
}
   
function createClassroom() {
    // let teacher enter class name
    // once entered, generate link with button to copy
    // show button to open the new classroom
    var form = document.getElementById('new_classroom_form');
    form.style.display = "block";
    form.addEventListener('submit', submitNewClassName);
}

function submitNewClassName(event) {
    event.preventDefault();
    var name = document.getElementById("new_class_input").value;
    var classUrl = `https://fielddaylab.wisc.edu/play/aqualab/ci/develop?classcode=${name}`

    fetch(`https://fieldday-web.wcer.wisc.edu/wsgi-bin/opengamedata.wsgi/classroom/${name}`, {
        method: "PUT", 
        body: name
    }).then(res => {
        console.log(res);
    });

    var form = document.getElementById("new_classroom_form");
    form.style.display = "none";

    var newClassDiv = document.getElementById("new_classroom_button");
    var newClassText = document.createElement('span');
    newClassText.innerText = classUrl;

    var openTeacherLink = document.createElement('a');
    openTeacherLink.href = `teacher_view.html?id=${name}`;
    openTeacherLink.innerText = "Open";

    newClassDiv.appendChild(openTeacherLink);
    newClassDiv.appendChild(newClassText);
}

function loadOpenClassrooms() {
    fetch("classrooms.json")
        .then(response => response.json())
        .then(json => displayOpenClassrooms(json));
}

function displayOpenClassrooms(classrooms) {
    var classroomsDiv = document.getElementById('classrooms')

    for (var i = 0; i < classrooms.length; ++i) {
        var classroomElement = document.createElement('a');
        classroomElement.href = `teacher_view.html?id=${classrooms[i].id}`
        classroomElement.innerHTML = `${classrooms[i].name} ${classrooms[i].url}`
        classroomsDiv.appendChild(classroomElement);
    }
}

function dropdown() {
    document.getElementById("classrooms").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
