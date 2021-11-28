const request = require('request');
const express = require('express');
const app = express();

let metaData = {
    privateMessageToken: 'lip_VHVBafFH8Mfhf5u8qDsV',
    tournamentToken: 'lip_dwiOyZuKOOCvrNxq25aT',
    teamId: 'esp-chess-club',
    nextDate: new Date(Date.now()),
    step: 1 //jour
}

//on veut que le tournoi commence à 16h
metaData.nextDate.setHours(16, 0, 0, 0);

//s'il est 16h passées
if(Date.now() > metaData.nextDate){
    //on avance metaData.nextDate de metaData.step jours
    metaData.nextDate.setDate(metaData.nextDate.getDate() + metaData.step);
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
    'chatFor': '20' //membres de l'equipe
};

//message envoyé aux membres de la team à la création d'un tournoi
let messagingMembersInfo = {
    message: `Bonjour, \ncher membre de ESP-Chess-Club \nUn Tournoi à Système Suisse a été créé.\n\nInfos:\n\nDébut: le ${metaData.nextDate.toLocaleDateString()} à ${metaData.nextDate.toLocaleTimeString()},\nCadence: ${tournamentInfo["clock.limit"]/60}+${tournamentInfo["clock.increment"]},\nRondes: ${tournamentInfo.nbRounds},\nIntervalle Inter-Rondes: ${tournamentInfo.roundInterval} secondes, \nClassé: ${tournamentInfo.rated}.\n\nEnvoyé par esp-automation-bot 😉 (https://github.com/lamine2000/lichess_automations) !\n`
};

//header et body de la requete de creation de tournoi
let optionsTournamentRequest = {
    'method': 'POST',
    'url': `https://lichess.org/api/swiss/new/${metaData.teamId}`,
    'headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${metaData.tournamentToken}`
    },
    'form': tournamentInfo
};

//header et body de la requete d'envoi du message à la team
let optionsMessagingMembersRequest = {
    'method': 'POST',
    'url': `https://lichess.org/team/${metaData.teamId}/pm-all`,
    'headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${metaData.tournamentToken}`
    },
    'form': messagingMembersInfo
};

function handleErrorResponse(error, reqponse){
    if (error) throw new Error(error);
        console.log(response.body);
        console.log(erro.message)
}

//fonction qui fait la requete de creation du tournoi
function createTournament(){
    request.post(optionsTournamentRequest, handleErrorResponse);
}

//fonction qui fait la requete d'envoi du message à la team
function sendMessageToMembers(){
    request.post(optionsMessagingMembersRequest, handleErrorResponse);
}

function sendPrivateMessage(message, dest){
    request.post(
        {
            'method': 'POST',
            'url': `https://lichess.org/inbox/${dest}`,
            'heasers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${metaData.privateMessageToken}`
            },
            'form': {'text': `message`}
        },
        handleErrorResponse
    )
}

//fonction qui met à jour la date de début du prochain tournoi
function updateNextDate(){
    metaData.nextDate = metaData.nextDate.setDate(metaData.nextDate.getDate() + metaData.step);
}

//fonction qui compare la date de debut du tournoi avec la date actuelle. Elle appelle les autres fonctions lorsqu'un tournoi doit etre créé
function checkDate(){
    let now = Date.now();
    console.log("verifier pour " + metaData.nextDate.toString());

    //creer le tournoi 5h (18 000 000 ms) en avance
    if((now - 3000 < metaData.nextDate - 18000000 && metaData.nextDate - 18000000 < now + 3000) || metaData.nextDate - 18000000 < now){
        createTournament();
        updateNextDate();
        sendMessageToMembers();
    }
}

app.get(
    '',
    (req, res) => {
        res.status(200).send('Hi this app is running ;)');
    }
);

app.post(
    '/send',
    (req, res) => {
        let msg = req.body.text;
        let dest = req.body.dest;
        console.log(msg+dest);

        sendPrivateMessage(msg, dest);
    }
)

//ecouter sur le port 5000 en local et une fois déployé, écouter sur le port choisi par le service de deploiement
app.listen(
    process.env.PORT || 5000,

    //Appeler chackDate() toutes les secondes
    function run(){setInterval(checkDate, 1000);}
);