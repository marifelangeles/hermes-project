require('dotenv').config();
const pool = require('../modules/pool');
var request = require("request"); //this is the request for authorization access token

/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library

var client_id = '65587'; // Your client id
var client_secret = process.env.CLIENT_SECRET_WORDPRESS; // Your secret
var redirect_uri = 'https://hermes-group-marifel.herokuapp.com/wordpress/callback_wordpress'; // Your redirect uri

const router = express.Router();

router.get('/token_check', function (req, res) {// this is the route to check to 
  // see if we have a token for the account.
  // we should delete an entry when someone loggs out.
  let userId = req.user.id// set user id
  const queryText = `SELECT * FROM "storage" WHERE "user_id" = $1;`
  pool.query(queryText, [userId])// query to get the token and then send a bolien.
    .then((results) => {
      if (results.rowCount > 0 && results.rows[0].wordpress) {// this is a saftey check. would of berak otherway.
        res.send(true)
      }
      else {
        res.send(false)
      }
    })
})

// main authorization steeps this is where the user inputed information is sent along.
router.get('/callback_wordpress', function (req, res) {
  // console.log('call back wordpress was hit')
  // console.log(req.body);
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null; // this is the token we got back form wordpress
  if (code === null || typeof (code) === 'undefined') res.send(500)
  const queryText = `SELECT * FROM "current_user";`
  let userId = req.user.id
  if (userId === null) res.send(500);
  //attempt to grab the current user form the database
  //execute an authorization code grant flow using ga post
  var authOptions = {
    url: 'https://public-api.wordpress.com/oauth2/token',
    form: // i have changed this from body, parameter(s), and some more I forgot. 
    {
      grant_type: 'authorization_code',
      code: code,
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_uri,
    },
    json: true
  };
  request.post(authOptions, function (error, response, body) {
    console.log('log body', body)
    let access_token = body.access_token
    let blogId = body.blog_id // we will make this a global variable and update it every time they auth.
    let blogurl = body.blog_url
    checkStorage(access_token, userId, blogId, blogurl)// this updates the database with the token.
    res.redirect('https://hermes-group-marifel.herokuapp.com/#/connect')
    // to DB
  })
})

// main authorization steeps this is where the user inputed information is sent along.

//post rout for Wordpress
router.post('/post_episode', function (req, res) {
  console.log('this is logging req.body on wordpress post_episode', req.body)

  let userId = req.user.id || null;
  if (userId === null) res.send(500);
  const queryText = `SELECT * FROM "storage" WHERE "user_id" = $1;`
  pool.query(queryText, [userId]) // this is to get the user ID.
    .then((results) => {
      if (results.rowCount > 0 && results.rows[0].wordpress) { // check to make sure we have token and not beak code if we don't.
        let access_token = results.rows[0].wordpress;
        let blogid = results.rows[0].blog_id;
        var authOptions = {
          method: 'POST',
          'auth': { // this pulls from the auth library -- in otherwords if automaticly formats it to be the proper formate for the request.
            'bearer': access_token
          },
          url: `https://public-api.wordpress.com/rest/v1.2/sites/${blogid}/posts/new`
        };
        let postWordpress = request.post(authOptions, function (error, response, body) {// this is asyniced.
          // this gose to the heap. when the object gose to the heap we can then add stuff to it.
          // we get a callback (think of it as a promise for the most part.)
          res.redirect('https://hermes-group-marifel.herokuapp.com/#/home')  //this is a local host for wordpress instead of / but for presentation we will have to use redirect
        })
        // below is what we are adding to the asynic object that is in the heap at this point.
        // we can add too it becuse we get the callback object.
        const form = postWordpress.form();// this is taking the place of the form object its being called as an
        // function and we can add to the form object using the appends below this dose let us dynamicly put fields in the object.
        form.append(req.body) // this is sending the entire req.body object it might have to be seperated out into its component parts.

      }
      else {
        res.send(500)
      }
    }).catch((error) => {
      console.log(error);
      res.send(500);
    })
})

checkStorage = (access_token, userId, blogId, blogurl) => { //checks if user has accounts
  const queryText = `SELECT * FROM "storage" WHERE "user_id"=$1;`
  pool.query(queryText, [userId]) //hardcoded
    .then((result) => {
      // add user if not in database
      if (!result.rows[0]) {
        postToStorage(access_token, userId, blogId, blogurl) //if no account, create one
      }
      else {
        updateToStorage(access_token, userId, blogId, blogurl) // if account update db
      }
    })
}

updateToStorage = (access_token, userId, blogId, blogurl) => {

  const queryText = `UPDATE "storage" SET "wordpress"=$1, "blog_id"=$3, "blog_url"=$4 WHERE "id"=$2;` //update access token by user id
  pool.query(queryText, [access_token, userId, blogId, blogurl]).then(() => {
    console.log('access token added to database');
  }).catch(error => {
    console.log('there was an error adding access_token to database', error);
  })
}

postToStorage = (access_token, userId, blogId, blogurl) => {

  const queryText = `INSERT INTO "storage" ("user_id", "wordpress", "blog_id", "blog_url") VALUES ($1,$2, $3, $4)` //create access token by user id
  pool.query(queryText, [userId, access_token, blogId, blogurl]).then(() => {
    console.log('access token added to database');
  }).catch(error => {
    console.log('there was an error adding access_token to database', error);
  })
}
module.exports = router;