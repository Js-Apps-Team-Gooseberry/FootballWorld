import * as requester from 'requester';

function getStandings() {   
    return requester.apiGetJSON('http://api.football-data.org/v1/competitions/426/leagueTable');
}

export { getStandings };