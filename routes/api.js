var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next)
	{
		res.send('ICS Checklist API - Please use the correct subpath for addressing the API system.');
	});
router.get('/device-types', function(req, res, next)
	{
		res.send('Devices types TODO');
	});
router.get('/vendors', function(req, res, next)
	{
		res.send('Vendors TODO');
	});

module.exports = router;