var express = require("express");
var cloudinary = require('cloudinary');
var bodyParser = require('body-parser');

var bunyan = require('bunyan');
 var log = bunyan.createLogger({ name: 'myserver',
  	serializers: {
  	req: bunyan.stdSerializers.req,
  	res: bunyan.stdSerializers.res 
  	}
  });

var fortune = require('./lib/fortune.js');

var app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Config for cloudinary
//http://cloudinary.com/documentation/node_image_manipulation#text_layers
cloudinary.config({ 
  cloud_name: 'dro6he6lr', 
  api_key: '848221614325287', 
  api_secret: 'bx0PpkGT5lo3e74CuWIhMn29i_s' 
});


//Include handlebars
var handlebars = require('express3-handlebars')
				.create({defaultLayout : 'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');



app.set('port', process.env.PORT || 3000);


//Static folder
app.use( 
	
	express.static( __dirname + '/public' )

);


app.get('/', function(req, res){
	res.render('home');
});

app.get('/about', function(req, res){
	res.render('about', { fortune: fortune.getFortune() } );
});


//Form handling
app.post('/pic', function(req, res){

	console.log(req.body);

		try{
			cloudinary.uploader.upload( __dirname + "/test/bat.jpg", function(result) { 
			  	
			  	console.log(result);

			  	var pid = result.public_id;
			  	var image = cloudinary.image(pid + ".jpg", { alt: "Sample Image" })
				res.render('form', { image : image });

			});

		}catch(ex){
			console.log(ex);
			console.log("Error uploading to cloudinary.");
		}

		
});

app.get('/pic', function(req, res){
	res.render('form', {});
});



app.get('/thankyou', function(req, res){



});

app.use(function(req, res){

	res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found');

});

// custom 500 page
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){

	console.log('Express APP started on http://localhost:' + app.get('port'));
});