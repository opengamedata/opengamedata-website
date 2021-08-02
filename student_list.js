fetch("students.json")
    .then(response => response.json())
    .then(json => displayStudentList(json));

function displayStudentList(students) {
    var studentListDiv = document.getElementById('student-list')

    for (var i = 0; i < students.length; ++i) {
        var studentElement = document.createElement('p');
        studentElement.innerText = `Name: ${students[i].name}, Save Code: ${students[i].savecode}`;
        studentListDiv.appendChild(studentElement);
    }
}
