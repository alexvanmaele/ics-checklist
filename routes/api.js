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
/*
	SETUP
*/
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
/*
	ROUTES
*/
// Default route
router.get('/', function(req, res, next)
{
    res.send('ICS Checklist API - Please use the correct subpath for addressing the API system.');
});
// Get all device types
router.get('/device-types', function(req, res, next)
{
    connection.query('SELECT * from types ORDER BY id', function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});
// Get all vendors
router.get('/vendors', function(req, res, next)
{
    connection.query('SELECT * from vendors ORDER BY id', function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});
// Get all vendors per device type
router.get('/vendors/:typeId', function(req, res, next)
{
    var query = `
		select vendors.name
		from devices
		join vendors on vendors.id = devices.vendor
		where devices.id in (select dt.device from device_types dt where dt.type = ?)
	`;
    connection.query(query, [req.params.typeId], function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});
// Get all devices with vendor per device type
router.get('/devices/:typeId', function(req, res, next)
{
    var query = `
		select vendors.name as vendor, series.name as series, devices.name as device
		from devices
		join series on series.id = devices.series
		join vendors on vendors.id = devices.vendor
		where devices.id in (select dt.device from device_types dt where dt.type = ?)
		order by vendors.name
	`;
    connection.query(query, [req.params.typeId], function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});
/*
	DEBUG
*/
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
/*
	EXPORTS
*/
module.exports = router;