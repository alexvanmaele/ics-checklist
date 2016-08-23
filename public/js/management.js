(function()
{
    var apiUrl = '/api';
    var urls = {
        'deviceTypes': apiUrl + '/device-types/',
        'devices': apiUrl + '/devices/',
        'serviceProtocols': apiUrl + '/service-protocols/',
        'warningRecommendations': apiUrl + '/warning-recommendations/',
        'vendors': apiUrl + '/vendors/'
    };
    //var devices;
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
        loadDeviceTypes();
        loadVendors();
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
                //devices = data;
                populateDeviceTypeList(data);
                //TODO: update later
                //bindListEventHandlers();
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
        $('#lst_device_types').change(function()
        {
            //TODO: remove getVendorsFor call
            var vendors = getVendorsFor(this.value); //for device type
            console.log(this);
            populateVendorListWith(vendors);
            $('#lst_vendors').change(); //force update
        });
        $('#lst_vendors').change(function()
        {
            var selectedVendor = this.value;
            var selectedType = $('#lst_device_types option:selected').text();
            var deviceSeries = getDeviceSeriesFor(selectedVendor, selectedType);
            populateDeviceSeriesListWith(deviceSeries);
            $('#lst_device_series').change(); //force update
        });
        $('#lst_device_series').change(function()
        {
            var selectedVendor = $('#lst_vendors option:selected').text();;
            var selectedType = $('#lst_device_types option:selected').text();
            var selectedSeries = this.value;
            var filteredDevices = getDevicesFor(selectedVendor, selectedType, selectedSeries);
            populateDevicesListWith(filteredDevices);
            $('#lst_devices').change(); //force update
        });
        $('#lst_devices').change(function()
        {
            loadProtocolsForDevice(this.value); //device ID
        });
    }

    function populateVendorList(data)
    {
        $('#lst_vendors').empty();
        var vendors = [];
        for (var i = 0; i < data.length; i++)
        {
            var name = data[i].name;
            if (vendors.indexOf(name) == -1) vendors.push(name);
        }
        $.each(vendors, function(key, name)
        {
            $('#lst_vendors').append('<option value="' + name + '">' + name + '</option>');
        });
    }

    /*function getVendorsFor(type)
    {
        var vendorsForType = [];
        for (var i = 0; i < devices.length; i++)
        {
            var vendor = devices[i].vendor;
            if (devices[i].type == type && vendorsForType.indexOf(vendor) == -1)
            {
                vendorsForType.push(vendor);
            }
        }
        return vendorsForType;
    }*/

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
            if (devices[i].vendor == vendor && devices[i].type == type && deviceSeriesForVendor.indexOf(series) == -1)
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

    function getDevicesFor(vendor, type, series)
    {
        var filteredDevices = [];
        for (var i = 0; i < devices.length; i++)
        {
            if (devices[i].vendor == vendor && devices[i].type == type && devices[i].series == series && filteredDevices.indexOf(devices[i]) == -1)
            {
                filteredDevices.push(devices[i]);
            }
        }
        return filteredDevices;
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