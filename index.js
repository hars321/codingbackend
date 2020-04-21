const express =require('express');
const app =express();
// const db_connect=require('./db_connect.js');
const cors=require('cors');
const bodyParser = require('body-parser');
const mysql =require('mysql');
const fetch = require("node-fetch");

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());

var connection = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'RSEayGKsug',
    password: 'du0p9BB7ku',
    database: 'RSEayGKsug'
  })

  

function date(){
    var currentdate = new Date(); 
    return currentdate;
}
app.get('/',(req,res)=>{
   ans=date()
   res.send(ans);
})
app.post("/compiler",(req,res)=>{
    
    content=JSON.stringify(req.body)
    console.log(content)
    fetch('https://api.jdoodle.com/v1/execute',{
            method:'POST',
            body:content,
            mode: "cors",
            
            headers:{'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':""},
            
            }).then((response=>response.json())).then(data=>{

                console.log(data);
                res.status(200).json(data);
            })
})
app.post("/signup",(req,res)=>{
    var time=date();
    time=time.toUTCString();
    console.log(req.body);
    user_details=req.body;
    user_details["id"]=time;
    //  console.log(user_details);
    
     qry=`INSERT INTO \`singnup\` (\`name\`, \`email\`, \`password\`) VALUES (\'${req.body.name}\', \'${req.body.email}\', \'${req.body.password}\')`;
     console.log(qry);
    connection.query(qry, function (error, results, fields) {
        if(error){
            console.log("cant insert value");
            res.status(404).json('error');
        }
        else{
            console.log("value inserted succefully");
            res.status(200).json('success');
        }
    
})
});
app.post("/login",(req,res)=>{
    
    
    console.log(req.body);
    user_details=req.body;
    
    //  console.log(user_details);
    qry=`SELECT id from \`singnup\` where email=\'${req.body.email}\' and password=\'${req.body.password}\' `
     
     console.log(qry);
    connection.query(qry, function (error, results, fields) {
        if(error){
            console.log("cant get value");
            res.status(404).json('error');
        }
        else{
            console.log("value is  " + results);
            res.status(200).json('success');
        }
    
})
});
app.get('/practice',(req,res)=>{
    qry=`SELECT * from \`practice\` `
    console.log(qry)
    connection.query(qry,function(error,results, fields){
        if(error){
            console.log("cant fetch");
            res.status(404).json('error');
        }
        else{
            res.status(200).json(results);
        }
    })
})
app.post('/getQuestion',(req,res)=>{
    qry=`SELECT * from \`question\` where \`question_id\`=${req.body.id}`
    console.log(qry)
    connection.query(qry,function(error,results, fields){
        if(error){
            console.log("cant fetch");
            res.status(404).json('error');
        }
        else{
            console.log(results)
            res.status(200).json(results);
        }
    })
})
app.post("/competition",(req,res)=>{
    qry=`INSERT INTO \`competition\` (\`competition_id\`,\`qid1\`, \`qid2\`, \`qid3\`, \`qid4\`,\`qid5\`,\`qid6\`,\`qid7\`,\`qid8\`,\`competition_name\`) VALUES (\'${req.body.competition_id}\',\'${req.body.qid1}\',\'${req.body.qid2}\',\'${req.body.qid3}\', \'${req.body.qid4}\',\'${req.body.qid5}\',\'${req.body.qid6}\',\'${req.body.qid7}\',\'${req.body.qid8}\',\'${req.body.competition_name}\')`;
    console.log(qry);
    connection.query(qry,function (error, results, fields) {
        if(error){
            console.log("cant insert competition");
            res.status(404).json('error');
        }
        else{
            console.log("competion details inserted ");
            res.status(200).json(req.body.qid1);
        }
})
}
)
app.post("/competition-details",(req,res)=>{
    console.log(req.body.id);
    qry=`SELECT * FROM  \`competition\` WHERE competition_id=${req.body.id}`
    console.log(qry)
    connection.query(qry,function(error, results, fields){
        if(error){
            console.log("cant find competition")
            res.status(404).json('error')
        }
        else{
            console.log(results);
            res.status(200).json(results);
        }
    })
})
app.post("/submit-question",(req,res)=>{
    
    qry=`INSERT INTO \`question\` (\`question_id\`,\`name\`, \`description\`, \`input\`, \`output\`) VALUES (\'${req.body.qid}\',\'${req.body.name}\', \'${req.body.description}\', \'${req.body.input}\',\'${req.body.output}\')`;
    console.log(qry);
    connection.query(qry, function (error, results, fields) {
        if(error){
            console.log("cant insert");
            res.status(404).json('error');
        }
        else{
            console.log("value is  inserted");
            res.status(200).json(req.body.qid);
        }
    })
    
})
app.listen(process.env.PORT||8080,()=>{
    
    connection.connect(function(err) {
        if (err){
            console.log('error connecting to server');
        }
        else{
          console.log('You are now connected to server...');
        }
      });
      
    console.log("listening on 8080");
})