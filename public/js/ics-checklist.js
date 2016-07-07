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
                $('#lst_device_types').change(function()
                {
                    var vendors = getVendorsFor(this.value); //for device type
                    populateVendorListWith(vendors);
                    $('#lst_vendors').change(); //force update
                });
                $('#lst_vendors').change(function()
                {
                	selectedVendor = this.value;
                    var selectedType = $('#lst_device_types option:selected').text();
                    var deviceSeries = getDeviceSeriesFor(selectedVendor, selectedType);
                    populateDeviceSeriesListWith(deviceSeries);
                });
                $('#lst_device_series').change(function()
                {
                	//todo
                });
                $('#lst_device_types').change(); //update immediately after receiving JSON 
            }
        });
    }

    function populateDeviceTypeList()
    {
        $('#lst_device_types').empty();
        var deviceTypes = [];
        for (var i = 0; i < devices.length; i++)
        {
            var type = devices[i].type;
            if (deviceTypes.indexOf(type) == -1) deviceTypes.push(type);
        }
        $.each(deviceTypes, function(key, type)
        {
            $('#lst_device_types').append('<option value="' + type + '">' + type + '</option>');
        });
    }

    function getVendorsFor(type)
    {
        var vendorsForType = [];
        for (var i = 0; i < devices.length; i++)
        {
            var vendor = devices[i].vendor;
            if (devices[i].type == type &&
                vendorsForType.indexOf(vendor) == -1)
            {
                vendorsForType.push(vendor);
            }
        }
        return vendorsForType;
    }

    function populateVendorListWith(vendors)
    {
        $('#lst_vendors').empty();
        $.each(vendors, function(key, vendor)
        {
            $('#lst_vendors').append('<option value="' + vendor + '">' + vendor + '</option>');
        });
    }

    function getDeviceSeriesFor(vendor, type)
    {
        var deviceSeriesForVendor = [];
        for (var i = 0; i < devices.length; i++)
        {
            var series = devices[i].series;
            if (devices[i].vendor == vendor &&
            	devices[i].type == type &&
                deviceSeriesForVendor.indexOf(series) == -1)
            {
                deviceSeriesForVendor.push(series);
            }
        }
        return deviceSeriesForVendor;
    }

    function populateDeviceSeriesListWith(deviceSeries)
    {
        $('#lst_device_series').empty();
        $.each(deviceSeries, function(key, series)
        {
            $('#lst_device_series').append('<option value="' + series + '">' + series + '</option>');
        });
    }
})();