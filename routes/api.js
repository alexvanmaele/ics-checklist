var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection(
{
    host: 'localhost',
    user: 'root',
    password: 'toor',
    database: 'ics_checklist'
});

connection.connect(function(err)
{
    if (!err)
    {
        console.log("Database is connected ... \n\n");
    }
    else
    {
        console.log("Error connecting database ... \n\n");
    }
});

router.get('/', function(req, res, next)
{
    res.send('ICS Checklist API - Please use the correct subpath for addressing the API system.');
});
router.get('/device-types', function(req, res, next)
{
    connection.query('SELECT * from types', function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        console.log('Device types:');
        rows.forEach(function(val, i, arr)
        {
            console.log(val.name);
        });
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});
router.get('/vendors', function(req, res, next)
{
    res.send('Vendors TODO');
});
router.get("/test-database", function(req, res)
{
    connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields)
    {
        if (err)
        {
            console.log(err);
            res.send('Database error. See console logs.');
        }
        else
        {
            res.send('Database connection OK!');
        }
    });
});

module.exports = router;