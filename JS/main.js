let courseCollection;

let numPlayers;
let teeSelection;
let nameArray = [];

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
    storeNames();

    $('.gameContainer').css('display', 'flex');
    $('.setupContainer').css('display', 'none');

    buildHole();
    buildYard();
    buildPar();
    buildHcp();

    buildPlayers();
}

function buildHole() {
    for(let i = 1; i <= 18; i++) {
        $('.holeContainer').append(`<div id="hole${i}" class="hole">${i}</div>`);

        if(i == 9) {
            $('.holeContainer').append(`<div id="outHole" class="out">Out</div>`);
        }
        if(i == 18) {
            $('.holeContainer').append(`<div id="inHole" class="in">In</div>`);
            $('.holeContainer').append(`<div id="totalHole" class="total">Total</div>`);
        }
    }
}

function buildYard() {
    for(let i = 0; i < 18; i++) {
        $('.yardContainer').append(`<div id="yard${i}" class="yard">${myCourse.data.holes[i].teeBoxes[teeSelection].yards}</div>`);

        if(i == 8) {
            $('.yardContainer').append(`<div id="outYard" class="out"></div>`);
        }
        if(i == 17) {
            $('.yardContainer').append(`<div id="inYard" class="in"></div>`);
            $('.yardContainer').append(`<div id="totalYard" class="total"></div>`);
        }
    }

    $(`#outYard`).append(calcOut('yard'));
    $(`#inYard`).append(calcIn('yard'));
    $(`#totalYard`).append(calcTotal('Yard'));
}

function buildPar() {
    for(let i = 0; i < 18; i++) {
        $('.parContainer').append(`<div id="par${i}" class="par">${myCourse.data.holes[i].teeBoxes[teeSelection].par}</div>`);

        if(i == 8) {
            $('.parContainer').append(`<div id="outPar" class="out"></div>`);
        }
        if(i == 17) {
            $('.parContainer').append(`<div id="inPar" class="in"></div>`);
            $('.parContainer').append(`<div id="totalPar" class="total"></div>`);
        }
    }

    $(`#outPar`).append(calcOut('par'));
    $(`#inPar`).append(calcIn('par'));
    $(`#totalPar`).append(calcTotal('Par'));
}

function buildHcp() {
    for (let i = 0; i < 18; i++) {
        $('.hcpContainer').append(`<div id="hcp${i}" class="hcp">${myCourse.data.holes[i].teeBoxes[teeSelection].hcp}</div>`);

        if (i == 8) {
            $('.hcpContainer').append(`<div id="outHcp" class="out"></div>`);
        }
        if (i == 17) {
            $('.hcpContainer').append(`<div id="inHcp" class="in"></div>`);
            $('.hcpContainer').append(`<div id="totalHcp" class="total"></div>`);
        }
    }

    $(`#outHcp`).append('-');
    $(`#inHcp`).append('-');
    $(`#totalHcp`).append('-');
}

function buildPlayers() {
    for (let i = 1; i <= numPlayers; i++) {
        $('.gameContainer').append(`<div id="playerContainer${i}" class="playerContainer"><div class="cardTitle">${nameArray[i-1]}</div></div>`);
        for(let p = 0; p < 18; p++) {
            $(`#playerContainer${i}`).append(`<input id="p${i}score${p}" class="score" type="number" onchange="updateScore(${i}, this.value, ${p})">`);

            if(p == 8) {
                $(`#playerContainer${i}`).append(`<div id="outPlayer${i}" class="out"></div>`);
            }
            if(p == 17) {
                $(`#playerContainer${i}`).append(`<div id="inPlayer${i}" class="in"></div>`);
                $(`#playerContainer${i}`).append(`<div id="totalPlayer${i}" class="total"></div>`);
            }
        }
    }
}

function updateScore(playerNum, value, holeNum) {
    let outTotal = 0;
    let tempOut = 0;
    let inTotal = 0;
    let tempIn = 0;

    if(holeNum < 9){
        for(let o = 0; o < 9; o++) {
            tempOut = Number($(`#p${playerNum}score${o}`).val());
            outTotal += tempOut;
        }
        $(`#outPlayer${playerNum}`).html(outTotal);
    }
    else if(holeNum >= 9){
        for(let i = 9; i < 18; i++) {
            tempIn = Number($(`#p${playerNum}score${i}`).val());
            inTotal += tempIn;
        }
        $(`#inPlayer${playerNum}`).html(inTotal);
    }

    outTotal = Number($(`#outPlayer${playerNum}`).text());
    inTotal = Number($(`#inPlayer${playerNum}`).text());
    let finalTotal = outTotal + inTotal;
    $(`#totalPlayer${playerNum}`).text(finalTotal);
}

function calcOut(rowName) {
    let outTotal = 0;
    let outTemp = 0;
    for(let i = 0; i < 9; i++) {
        outTemp = Number($(`#${rowName}${i}`).text());
        outTotal += outTemp;
    }
    return outTotal;
}

function calcIn(rowName) {
    let inTotal = 0;
    let inTemp = 0;
    for(let i = 9; i < 18; i++) {
        inTemp = Number($(`#${rowName}${i}`).text());
        inTotal += inTemp;
    }
    return inTotal;
}

function calcTotal(rowName) {
    let outTotal = Number($(`#out${rowName}`).text());
    let inTotal = Number($(`#in${rowName}`).text());

    return outTotal + inTotal;
}

function storeNames() {
    let playerName;
    nameArray = [];

    for(let i = 1; i <= numPlayers; i++) {
        playerName = $(`#player${i}`).val();
        nameArray.push(playerName);
    }
}

function getNames(playerNum) {
    numPlayers = Number(playerNum);
    $('.playerNameContainer').html('');
    for (let i = 1; i <= numPlayers; i++) {
        $('.playerNameContainer').append(`<input onchange="checkName(this.value)" class="player" id="player${i}" type="text">`);
    }
}

function checkName(name) {
    console.log('checkName');
}

function checkNumber(value, thisId) {
    if(typeof value != 'number') {
        modalId = thisId;
        displayNumModal();
    }
}

function displayNumModal() {
    $('.numberModal').css('display', 'flex');
}

function clearNumModal() {
    $('.numberModal').css('display', 'none');
    $(`#${modalId}`).val('');
}