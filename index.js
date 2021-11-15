const request = require('request');
const express = require('express');
const app = express();


let metaData = {
    //token: 'lip_jfvgGVXubyUHMlDan86G',
    token: 'lip_dwiOyZuKOOCvrNxq25aT',
    teamId: 'esp-chess-club',
    nextDate: new Date('2021-11-16T16:00:00.000Z'),
    step: 1 //day
}

let tournamentInfo = {
    'clock.limit': '600', //10 min
    'clock.increment': '0',
    'nbRounds': '7',
    'name': 'ESP Swiss Rapid Tournament',
    'startsAt': metaData.nextDate,
    'roundInterval': '60',
    'variant': 'standard',
    'description': 'Tournoi hebdomadaire à cadence Rapide.',
    'rated': 'true',
    'chatFor': '20' //only team members
};

let options = {
    'method': 'POST',
    'url': `https://lichess.org/api/swiss/new/${metaData.teamId}`,
    'headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${metaData.token}`
    },
    form: tournamentInfo
};

function createTournament(){
    request.post(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
    metaData.nextDate = metaData.nextDate.setDate(metaData.nextDate.getDate() + metaData.step); //set it to the next week
}

function checkDate(){
    let now = Date.now();
    console.log("verifier pour " + metaData.nextDate);

    //creates the tournament 1h in advance
    if((now - 3000 < metaData.nextDate - 3600000 && metaData.nextDate - 3600000 < now + 3000) || metaData.nextDate - 3600000 < now){
        createTournament();
    }
}

createTournament();

setInterval(checkDate, 1000);

app.listen(process.env.PORT || 5000, function a(){})