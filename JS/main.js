let courseCollection;

let numPlayers = 4;
let numHoles = 18;

function loadObject() {
    $('.menuContainer').css('display', 'none');
    $('.setupContainer').css('display', 'flex');

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            courseCollection = JSON.parse(this.responseText);
            console.log(courseCollection);

            for (let i = 0; i < courseCollection.courses.length; i++) {
                $('#selectCourse').append('<option value="' + courseCollection.courses[i].id + '">' + courseCollection.courses[i].name + '</option>')
            }
            // loadCourse(courseCollection.courses[0].id);
            // loadCourse(courseCollection.courses[1].id);
            // loadCourse(courseCollection.courses[2].id);
        }
    };
    xhttp.open('GET', 'https://golf-courses-api.herokuapp.com/courses', true);
    xhttp.send();
}

let myCourse;

function loadCourse(courseid) {
    console.log(courseid);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            myCourse = JSON.parse(this.responseText);
            console.log(myCourse);

            loadTee();
            // $('.mainContainer').css('background-image', 'url(' + courseCollection.courses[2].image +')');
        }
    };
    xhttp.open('GET', 'https://golf-courses-api.herokuapp.com/courses/' + courseid, true);
    xhttp.send();
}

function loadTee() {
    $('#selectTee').html('<option>Select Tee</option>');
    let teeArray = myCourse.data.holes[0].teeBoxes;
    for(let i = 0; i < teeArray.length; i++) {
        $('#selectTee').append('<option value="' + i + '">' + teeArray[i].teeType + '</option>')
    }
}

function buildCard() {
    $('.gameContainer').css('display', 'flex');
    $('.setupContainer').css('display', 'none');
    for(let i = 1; i <= numHoles; i++) {
        $('.gameContainer').append('<div id="col' + i +'" class="column">' + i + '</div>')
    }
    addHoles();
}

function addHoles() {
    for(let p = 1; p <= numPlayers; p++) {
        for(let h = 1; h <= numHoles; h++) {
            $('#col' + h).append('<input class="hole" type="text" id="p' + p + 'h' + h + '">');
        }
    }
}

function getNames(playerNum) {
    $('.playerNameContainer').html('');
    for (let i = 1; i <= playerNum; i++) {
        $('.playerNameContainer').append(`<input class="player" id="player${i}" type="text">`);
    }
}