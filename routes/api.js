/*
    IMPORTS
*/
var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser')
var mysql = require('mysql');
/*
    SETUP
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
{
    extended: true
}));
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
    sendQueryResults('SELECT * from types ORDER BY id', null, res);
});
// Get vendors
router.get('/vendors', function(req, res, next)
{
    sendQueryResults('SELECT * from vendors ORDER BY id', null, res);
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
    sendQueryResults(query, [req.params.typeId], res);
}); 
router.get('/vendors/delete/:vendorId', function(req, res, next)
{
    var query = `
        delete from vendors
        where id = ?
    `;
    sendQueryResults(query, [req.params.vendorId], res);
});
router.post('/vendors/add/', function(req, res, next)
{
    var query = `
        insert into vendors (name)
        values (?)
    `;
    try
    {
        sendQueryResults(query, req.body.name, res);
    }
    catch (err)
    {
        console.log('Error parsing POST parameters:');
        console.log(err);
        res.send('Error in POST body');
    }
});
// Get device series per vendor
router.get('/device-series/:vendorId', function(req, res, next)
{
    var query = `
        select *
        from series
        where vendor = ?
    `;
    sendQueryResults(query, [req.params.vendorId], res);
});
router.get('/device-series/delete/:seriesId', function(req, res, next)
{
<<<<<<< HEAD
        var query = `
=======
    var query = `
>>>>>>> c9e65c07c5e5dcaf805d83ed4aceaf35136e74be
        delete from series
        where id = ?
    `;
    sendQueryResults(query, [req.params.seriesId], res);
});
router.post('/device-series/add/', function(req, res, next)
{
    var query = `
        insert into series (vendor, name)
        values (?, ?)
    `;
    try
    {
        sendQueryResults(query, [req.body.vendor, req.body.name], res);
    }
    catch (err)
    {
        console.log('Error parsing POST parameters:');
        console.log(err);
        res.send('Error in POST body');
    }
});
// Get devices
router.get('/devices', function(req, res, next)
{
    var query = `
        select devices.id, vendors.name as vendor, series.name as series, devices.name as device, types.name as type
        from devices
        join series on series.id = devices.series
        join vendors on vendors.id = devices.vendor
        join device_types on device_types.device = devices.id
        join types on device_types.type = types.id
        order by vendors.name
    `;
    sendQueryResults(query, null, res);
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
    sendQueryResults(query, [req.params.typeId], res);
});
router.get('/devices/delete/:deviceId', function(req, res, next)
{
        var query = `
        delete from devices
        where id = ?
    `;
    sendQueryResults(query, [req.params.deviceId], res);
});
router.post('/devices/add/', function(req, res, next)
{
    var query = `
        insert into devices (vendor, series, name)
        values (?, ?, ?)
    `;
    try
    {
        sendQueryResults(query, [req.body.vendor, req.body.series, req.body.name], res);
    }
    catch (err)
    {
        console.log('Error parsing POST parameters:');
        console.log(err);
        res.send('Error in POST body');
    }
});
// Get services
router.get('/services', function(req, res, next)
{
    sendQueryResults('SELECT * from services ORDER BY id', null, res);
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
    sendQueryResults(query, [req.params.deviceId], res);
});
// Get protocols
router.get('/protocols', function(req, res, next)
{
    sendQueryResults('SELECT * from protocols ORDER BY id', null, res);
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
    sendQueryResults(query, [req.params.serviceId], res);
});
// Get all services with protocols per device
router.get('/service-protocols/:deviceId', function(req, res, next)
{
    var query = `
        select protocols.id as protocol_id, services.name as service, protocols.name as protocol
        from services
        join device_services on services.id = device_services.service
        join service_protocols on services.id = service_protocols.service
        join protocols on protocols.id = service_protocols.protocol
        where device_services.device = ?
        order by service
    `;
    sendQueryResults(query, [req.params.deviceId], res);
});
// Get warnings
router.get('/warnings', function(req, res, next)
{
    sendQueryResults('SELECT * from warnings ORDER BY id', null, res);
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
    sendQueryResults(query, [req.params.protocolId], res);
});
// Get recommendations
router.get('/recommendations', function(req, res, next)
{
    sendQueryResults('SELECT * from recommendations ORDER BY id', null, res);
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
    sendQueryResults(query, [req.params.warningId], res);
});
// Get warnings and recommendations for list of protocols
router.post('/warning-recommendations/', function(req, res, next)
{
    var query = `
        select warnings.id, protocol_warnings.protocol, warnings.name, warnings.description, recommendations.description as recommendation
        from warnings
        join protocol_warnings on protocol_warnings.warning = warnings.id
        join warning_recommendations on warning_recommendations.warning = warnings.id
        join recommendations on recommendations.id = warning_recommendations.recommendation
        where protocol in 
    `;
    var protocolArray = [];
    try
    {
        for (var i = 0; i < req.body.protocols.length; i++)
        {
            protocolArray.push(parseInt(req.body.protocols[i]));
        }
        var protocolString = "(" + protocolArray.toString() + ")";
        query = query + protocolString;
        sendQueryResults(query, null, res);
    }
    catch (err)
    {
        console.log('Error parsing POST parameters:');
        console.log(err);
        res.send('Error in POST body');
    }
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
    HELPER FUNCTIONS
*/
function sendQueryResults(query, queryParams, res)
{
    connection.query(query, queryParams, function(err, rows, fields)
    {
        if (err) console.log('Error in Query');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2)); // Prettify JSON
    });
}
/*
    EXPORTS
*/
module.exports = router;