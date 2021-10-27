const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

fetch(`https://fieldday-web.wcer.wisc.edu/wsgi-bin/opengamedata.wsgi/classroom/${id}`)
    .then(response => response.json())
    .then(json => displayStudentList(json));

function displayStudentList(students) {
    var studentListDiv = document.getElementById('student-list')

    for (var i = 0; i < students.classlist.length; ++i) {
        var studentElement = document.createElement('p');
        studentElement.innerText = `Name: ${students.classlist[i]}`;
        studentListDiv.appendChild(studentElement);
    }
}