const request = require('request');

let metaData = {
    token: 'lip_jfvgGVXubyUHMlDan86G',
    teamId: 'esp-chess-club',
    date: new Date('2021-11-15T03:10:00.000Z'),
    step: 1 //weekly
}

let tournamentInfo = {
    'clock.limit': '600', //10 min
    'clock.increment': '0',
    'nbRounds': '7',
    'name': 'ESP Swiss Rapid Tournament',
    'startsAt': metaData.date,
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
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
    metaData.date = metaData.date.setDate(metaData.date.getDate() + metaData.step); //set it to the next week
}

function checkDate(){
    let now = Date.now();
    console.log("verifier pour " + metaData.date);
    if((now - 3000 < metaData.date && metaData.date < now + 3000) || metaData.date < now){
        createTournament();
    }
}

createTournament();

setInterval(checkDate, 1000);
