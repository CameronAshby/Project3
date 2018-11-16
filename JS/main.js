let courseCollection;

let numPlayers;
let teeSelection;

let modalId;

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

function setTee(tee) {
    teeSelection = tee;
}

function buildCard() {
    $('.gameContainer').css('display', 'flex');
    $('.setupContainer').css('display', 'none');

    buildHole();
    buildYard();
    buildPar();
    buildHcp();
}

function buildHole() {
    for(let i = 1; i <= 18; i++) {
        $('.holeContainer').append(`<div id="hole${i}" class="hole">${i}</div>`);

        if(i == 9) {
            $('.holeContainer').append(`<div id="out" class="out">Out</div>`);
        }
        if(i == 18) {
            $('.holeContainer').append(`<div id="in" class="in">In</div>`);
            $('.holeContainer').append(`<div id="total" class="total">Total</div>`);
        }
    }
}

function buildYard() {
    for(let i = 0; i < 18; i++) {
        $('.yardContainer').append(`<div id="yard${i}" class="yard">${myCourse.data.holes[i].teeBoxes[teeSelection].yards}</div>`);

        if(i == 8) {
            $('.yardContainer').append(`<div class="out"></div>`);
        }
        if(i == 17) {
            $('.yardContainer').append(`<div class="in"></div>`);
            $('.yardContainer').append(`<div class="total"></div>`);
        }
    }
}

function buildPar() {
    for(let i = 0; i < 18; i++) {
        $('.parContainer').append(`<div id="yard${i}" class="yard">${myCourse.data.holes[i].teeBoxes[teeSelection].par}</div>`);

        if(i == 8) {
            $('.parContainer').append(`<div class="out"></div>`);
        }
        if(i == 17) {
            $('.parContainer').append(`<div class="in"></div>`);
            $('.parContainer').append(`<div class="total"></div>`);
        }
    }
}

function buildHcp() {
    for (let i = 0; i < 18; i++) {
        $('.hcpContainer').append(`<div id="yard${i}" class="yard">${myCourse.data.holes[i].teeBoxes[teeSelection].hcp}</div>`);

        if (i == 8) {
            $('.hcpContainer').append(`<div class="out"></div>`);
        }
        if (i == 17) {
            $('.hcpContainer').append(`<div class="in"></div>`);
            $('.hcpContainer').append(`<div class="total"></div>`);
        }
    }
}

function getNames(playerNum) {
    numPlayers = Number(playerNum);
    $('.playerNameContainer').html('');
    for (let i = 1; i <= playerNum; i++) {
        $('.playerNameContainer').append(`<input onchange="checkName(this.value)" class="player" id="player${i}" type="text">`);
    }
}

function checkName(name) {
    console.log('checkName');
}

function checkNumber(number, thisId) {
    if(typeof number != 'number') {
        modalId = thisId;
        displayModal();
    }
}

function displayModal() {
    $('.numberModal').css('display', 'flex');
}

function clearModal() {
    $('.numberModal').css('display', 'none');
    $(`#${modalId}`).val('');
}