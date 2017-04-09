var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require("request");
var cheerio = require('cheerio');

var PORT = 8000;
var imdb_obj = null;

//Middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views','views');
app.set('view engine', 'ejs');


//Routes
app.get('/', function(req,res){
    res.render('index', {imdb_obj : imdb_obj} ); 
});

app.post('/getDetails' , function(req, res){
        console.log(req.body);
      request({ uri: req.body.movie_url }, function(error, response, body) {
            
                var $ = cheerio.load(body);
                var stars = [];

                $("span[itemprop='actors']").each(function(){
                    stars.push($(this).find('span').text());
                });

                imdb_obj = {
                    movie_title:  $("div.title_wrapper").find("h1").text().trim(),
                    plot_summary: $("div.summary_text").text().trim(),
                    imdb_community_rating: $("span[itemprop='ratingValue']").text(),
                    director:  $("span[itemprop='director']").find('span').text(),
                    writer: $("div.credit_summary_item span[itemprop='creator']").find('span').text(),
                    stars: stars
                }
                 res.render('index', {imdb_obj : imdb_obj}   );
        
            }
    );
});

app.listen(PORT, function(){
    console.log("Running on port " + PORT);
});
