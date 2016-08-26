(function()
{
    var apiUrl = '/api';
    var urls = {
        'deviceTypes': apiUrl + '/device-types/',
        'devices': apiUrl + '/devices/',
        'serviceProtocols': apiUrl + '/service-protocols/',
        'warningRecommendations': apiUrl + '/warning-recommendations/',
        'vendors': apiUrl + '/vendors/',
        'deviceSeries': apiUrl + '/device-series/'
    };
    var currentDevice = {};
    var configuredDevices = [];
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
        loadVendors();
        loadDeviceTypes();
        bindListEventHandlers();
    }

    function loadDeviceTypes()
    {
        $.ajax(
        {
            dataType: 'json',
            url: urls.deviceTypes,
            success: function(data)
            {
                console.log('Got JSON!');
                console.log(JSON.stringify(data, null, 2));
                populateDeviceTypeList(data);
                $('#lst_device_types').change(); //update immediately after receiving JSON 
            }
        });
    }

    function loadVendors()
    {
        $.ajax(
        {
            dataType: 'json',
            url: urls.vendors,
            success: function(data)
            {
                console.log('Got JSON!');
                console.log(JSON.stringify(data, null, 2));
                populateVendorList(data);
                $('#lst_device_types').change(); //update immediately after receiving JSON 
            }
        });
    }

    function populateDeviceTypeList(data)
    {
        $('#lst_device_types').empty();
        var deviceTypes = [];
        for (var i = 0; i < data.length; i++)
        {
            var type = data[i].name;
            if (deviceTypes.indexOf(type) == -1) deviceTypes.push(type);
        }
        $.each(deviceTypes, function(key, type)
        {
            $('#lst_device_types').append('<option value="' + type + '">' + type + '</option>');
        });
    }

    function bindListEventHandlers()
    {
        $('#lst_vendors').change(function()
        {
            var selectedVendor = this.value;
            loadDeviceSeriesFor(selectedVendor);
            $('#lst_device_series').change(); //force update
            $('#div_new_device_series').removeClass('hidden');
        });
        $('#lst_device_series').change(function()
        {
            var selectedVendor = $('#lst_vendors option:selected').text();
            var selectedSeries = $(this).children('option').filter(':selected').text();
            loadDevicesFor(selectedVendor, selectedSeries);
            $('#lst_devices').change(); //force update
            $('#div_new_device').removeClass('hidden');
        });
        /*$('#lst_devices').change(function()
        {
            loadProtocolsForDevice(this.value); //device ID
        });*/
    }

    function populateVendorList(data)
    {
        $('#lst_vendors').empty();
        var vendors = [];
        for (var i = 0; i < data.length; i++)
        {
            vendors.push(data[i]);
        }
        $.each(vendors, function(key, vendor)
        {
            $('#lst_vendors').append('<option value="' + vendor.id + '">' + vendor.name + '</option>');
        });
    }

    function loadDeviceSeriesFor(vendor)
    {
        $.ajax(
        {
            dataType: 'json',
            url: urls.deviceSeries + vendor,
            success: function(data)
            {
                console.log('Got JSON!');
                console.log(JSON.stringify(data, null, 2));
                populateDeviceSeriesListWith(data); 
                $('#lst_device_series').change(); //update immediately after receiving JSON 
            }
        });
    }

    function populateDeviceSeriesListWith(deviceSeries)
    {
        $('#lst_device_series').empty();
        $.each(deviceSeries, function(key, series)
        {
            $('#lst_device_series').append('<option value="' + series.id + '">' + series.name + '</option>');
        });
    }

    function loadDevicesFor(vendor, series)
    {
        $.ajax(
        {
            dataType: 'json',
            url: urls.devices,
            success: function(data)
            {
                console.log('Got JSON!');
                console.log(JSON.stringify(data, null, 2));
                var filteredData = data.filter(function(e)
                {
                    return e.vendor == vendor && e.series == series;
                });
                populateDevicesListWith(filteredData); 
                $('#lst_devices').change(); //update immediately after receiving JSON 
            }
        });
    }

    function populateDevicesListWith(filteredDevices)
    {
        $('#lst_devices').empty();
        $.each(filteredDevices, function(key, device)
        {
            $('#lst_devices').append('<option value="' + device.id + '">' + device.device + '</option>');
        });
    }

    function loadProtocolsForDevice(deviceID)
    {
        $.ajax(
        {
            dataType: 'json',
            url: urls.serviceProtocols + deviceID,
            success: function(data)
            {
                console.log('Got JSON!');
                console.log(JSON.stringify(data, null, 2));
                if (data && data.length > 0)
                {
                    var serviceProtocols = getServiceProtocolsListFor(data);
                    generateProtocolSelectionMenuFor(serviceProtocols);
                    $('#btn_submit_protocols').removeClass('hidden');
                    $('#btn_submit_protocols').show();
                }
                else
                {
                    $('#sctn_services').html('<p>No services found. Please select another device.</p>');
                    $('#btn_submit_protocols').hide();
                }
            }
        });
    }

    function getServiceProtocolsListFor(data)
    {
        var serviceProtocols = [];
        for (var i = 0; i < data.length; i++)
        {
            var service = data[i].service;
            if (serviceProtocols.hasOwnProperty(service) == false)
            {
                serviceProtocols[service] = [];
            }
            var protocol = {
                'id': data[i].protocol_id,
                'name': data[i].protocol
            };
            serviceProtocols[service].push(protocol);
        }
        console.log(serviceProtocols);
        return serviceProtocols;
    }
})();