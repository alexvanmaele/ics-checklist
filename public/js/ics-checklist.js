(function()
{
    var urls = {
        devices: '/api/devices/'
    };
    var devices;
    console.log('ics-checklist.js loaded');
    if (typeof jQuery == 'undefined')
    {
        console.log('jQuery failed to load or still loading...');
    }
    $(document).ready(function()
    {
        console.log('jQuery ready!');
        start();
    })

    function start()
    {
        loadDevices();
    }

    function loadDevices()
    {
        $.ajax(
        {
            dataType: 'json',
            url: urls.devices,
            success: function(data)
            {
                console.log('Got JSON!');
                console.log(JSON.stringify(data, null, 2));
                devices = data;
                populateDeviceTypeList();
            }
        });
    }

    function populateDeviceTypeList()
    {
    	$('#lst_device_types').empty();
        var deviceTypes = [];
        for(var i = 0; i < devices.length; i++)
        {
        	var type = devices[i].type;
        	if(deviceTypes.indexOf(type) == -1) deviceTypes.push(type);
        }
        $.each(deviceTypes, function(key, type)
        {
            $('#lst_device_types').append('<option value=' + type + '>' + type + '</option>');
        });
    }
})();