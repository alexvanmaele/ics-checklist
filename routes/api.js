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
// Get device types
router.get('/device-types', function(req, res, next)
{
    connection.query('SELECT * from types ORDER BY id', function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});
// Get vendors
router.get('/vendors', function(req, res, next)
{
    connection.query('SELECT * from vendors ORDER BY id', function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});
// Get vendors per device type
router.get('/vendors/:typeId', function(req, res, next)
{
    var query = `
		select vendors.id, vendors.name
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
// Get devices
router.get('/devices', function(req, res, next)
{
    connection.query('SELECT * from devices ORDER BY id', function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});
// Get devices with vendor per device type
router.get('/devices/:typeId', function(req, res, next)
{
    var query = `
		select devices.id, vendors.name as vendor, series.name as series, devices.name as device
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
// Get services
router.get('/services', function(req, res, next)
{
    connection.query('SELECT * from services ORDER BY id', function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});
// Get services per device
router.get('/services/:deviceId', function(req, res, next)
{
    var query = `
		select services.id, services.name as service
		from services
		join device_services on services.id = device_services.service
		where device_services.device = ?
		order by service
	`;
    connection.query(query, [req.params.deviceId], function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});
// Get protocols
router.get('/protocols', function(req, res, next)
{
    connection.query('SELECT * from protocols ORDER BY id', function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});
// Get protocols per service
router.get('/protocols/:serviceId', function(req, res, next)
{
    var query = `
		select protocols.id, protocols.name as protocol
		from protocols
		join service_protocols on protocols.id = service_protocols.protocol
		where service_protocols.service = ?
		order by protocols.name
	`;
    connection.query(query, [req.params.serviceId], function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});
// Get warnings
router.get('/warnings', function(req, res, next)
{
    connection.query('SELECT * from warnings ORDER BY id', function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});
// Get warnings per protocol
router.get('/warnings/:protocolId', function(req, res, next)
{
    var query = `
		select warnings.id, warnings.name as title, warnings.description
		from warnings
		join protocol_warnings on warnings.id = protocol_warnings.warning
		where protocol_warnings.protocol = ?
		order by warnings.name
	`;
    connection.query(query, [req.params.protocolId], function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});
// Get recommendations
router.get('/recommendations', function(req, res, next)
{
    connection.query('SELECT * from recommendations ORDER BY id', function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});
// Get recommendations per warning
router.get('/recommendations/:warningId', function(req, res, next)
{
    var query = `
		select recommendations.id, recommendations.name as title, recommendations.description
		from recommendations
		join warning_recommendations on recommendations.id = warning_recommendations.recommendation
		where warning_recommendations.warning = ?
		order by recommendations.name
	`;
    connection.query(query, [req.params.warningId], function(err, rows, fields)
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