
// const sessionController = require('./../session/sessionController');
// const User = require('../user/userModel');
const jwtoken = require('jsonwebtoken')
var request = require('request');
const decodePolyline = require('decode-google-map-polyline');

const secretSuperKey = 'safw42346sDrPepperdfse6wa34234234'; //used for JWT stuffs

const stravaController = {};
stravaController.setStravaOauth = setStravaOauth;
stravaController.loadStravaProfile = loadStravaProfile;
stravaController.getActivities = getActivities;
stravaController.getPointsFromActivites = getPointsFromActivites;


function setStravaOauth(req, res, next) {
    let stravaCode = req.query.code;

    // const formData = {
    //   client_id: '8ff748bfa843d6aac77d',
    //   client_secret: '2d162d1b718607b8e1c4fa3366ede1c24b9fb6db',
    //   code: githubCode
    // };

    request.post(
        {
            url: 'https://www.strava.com/oauth/token',
            form: {
                client_id: '16175',
                client_secret: '3d2f97aa68d9930ee1f9a16c09b6f749b9dd53f7',
                code: stravaCode
            }
        },
        function (err, httpResponse, body) {
            if (err) {
                console.log(`Error with strava auth ${err}`);
                res.locals.err = "Error with strava - try again or logging with username/password";
                return next();
            }
            tokenRegex = /access_token":"([^"]+)/
            bodyArray = tokenRegex.exec(body);
            console.log(bodyArray[1]);
            // "{"token_type":"Bearer","access_token":"adaa94e12ea9e8d3c85ea3cd6932a7ff833b3f30",
            // "athlete":{"id":1075670,"username":"sirclesam","resource_state":2,"firstname":"Sam "
            // ,"lastname":"Wise | LG","city":"Los Angeles","state":"California",
            // "country":"United States","sex":"M","premium":true,"summit":true,
            // "created_at":"2012-09-06T17:53:52Z","updated_at":"2019-04-20T13:03:34Z"
            // ,"badge_type_id":1,
            // "profile_medium":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/1075670/948003/4/medium.jpg","profile":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/1075670/948003/4/large.jpg","friend":null,"follower":null}}"

            //JWS token time
            let payload = {
                token: bodyArray[1]
            }

            let jwt = jwtoken.sign(payload, secretSuperKey, { expiresIn: 2000 });
            res.cookie('stravajwt', jwt, { httpOnly: true });
            return next();
        }
    );
}

function loadStravaProfile(req, res, next) {
    console.log("Starting Strava Profile");
    let hubCookie = req.cookies.stravajwt;

    jwtoken.verify(hubCookie, secretSuperKey, function (err, payload) {
        if (err) {
            console.log(`Token Invalid: ${err}`);
            res.locals.err = "Strava token invalid"
        } else {
            console.log(`Session Valid - allow to proceed. User: ${payload.token}`);
            if (payload.token) res.locals.token = payload.token;
            // "https://www.strava.com/api/v3/athlete/activities?before=&after=&page=&per_page="
            // https://www.strava.com/api/v3/activities/{id}?include_all_efforts=" "Authorization: Bearer [[token]]"
            request.get(
                {
                    url: 'https://www.strava.com/api/v3/activities/2307995672?include_all_efforts=false',
                    headers: {
                        'Authorization': 'Bearer adaa94e12ea9e8d3c85ea3cd6932a7ff833b3f30'
                    }
                },
                function (err, httpResponse, body) {
                    if (err) {
                        console.log(`Error with strava auth ${err}`);
                        res.locals.err = "Error with strava - try again or logging with username/password";
                        return next();
                    }
                    console.log(`strava Data Aquired!!`);
                    let stravaData = JSON.parse(body);

                    // console.log(stravaData);

                    let stravaObj = {
                        avatar: 'https://dgalywyr863hv.cloudfront.net/pictures/athletes/1075670/948003/4/large.jpg',
                        username: "sssssirclesam"
                    }
                    res.locals.strava = stravaObj;

                    return next();
                }
            );










        }
    });

}

function getActivities(req, res, next) {
    let number = req.query.numberOf;
    let before = req.query.before;
    let after = req.query.after;
    let page = 1;
    const stravaQuery = `https://www.strava.com/api/v3/athlete/activities?before=${before}&after=${after}&page=${page}&per_page=${number}`
    // const stravaQuery = 'https://www.strava.com/api/v3/activities/2307995672?include_all_efforts=false'
    console.log(stravaQuery);
    console.log(`Getting ${number} actvities`);


    request.get(
        {
            url: stravaQuery,
            headers: {
                'Authorization': 'Bearer 16bc607c4adbf5a87d0b2e73284d4f8f8d83ed00'
            }
        },
        function (err, httpResponse, body) {
            if (err) {
                console.log(`Error with strava auth ${err}`);
                res.locals.err = "Error with strava - try again or logging with username/password";
                return next();
            }
            console.log(`strava Data Aquired!!`);
            // console.log(body);
            let stravaData = JSON.parse(body);
            // console.log(`Parsing ${stravaData.length} activities`);
            let activities = [];
            stravaData.forEach(element => {
                const newActivity = {};
                newActivity.id = element.id;
                newActivity.name = element.name;
                newActivity.line = element.map.summary_polyline;
                newActivity.color = 'red'
                newActivity.selected = false;

                activities.push(newActivity);
            });
            res.locals.activities = activities;
            return next();
        }
    );

}

function getPointsFromActivites(req, res, next) {
    let activities = res.locals.activities;
    // let pointsArray = []
    activities.forEach(activity => {
        try {
            const decodedPath = decodePolyline(activity.line);
            // pointsArray.push(decodedPath);
            activity.points = decodedPath;
        } catch (error) {
            console.log(`Error decoding activity: ${activity.name}`);
        }

    })

    // activities.push(pointsArray); //include points array as final item in array, must pop before processing names
    res.locals.activities = activities;
    return next();
}


module.exports = stravaController;
