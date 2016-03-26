'use strict';

const api = require('../lib/index');
const Devices = api.Devices;
const Iso7816Application = api.Iso7816Application;

const devices = new Devices();


devices.on('device-activated', function (event) {
    const currentDevices = event.devices;
    let device = event.device;
    console.log(`Device '${device}' activated, devices: ${currentDevices}`);
    for (let prop in currentDevices) {
        console.log("Devices: " + currentDevices[prop]);
    }

    device.on('card-inserted', function (event) {
        let card = event.card;
        console.log(`Card '${card.atr()}' inserted into '${event.device}'`);

        card.on('command-issued', function (event) {
            console.log(`Command '${event.command}' issued to '${event.card}' `);
        });

        card.on('response-received', function (event) {
            console.log(`Response '${event.response}' received from '${event.card}' in response to '${event.command}'`);
        });

        card
            .issueCommand('00A404000E315041592E5359532E4444463031')
            .then(function (response) {
                console.log(`Response '${response.toString('hex')}`);
            }).catch(function (error) {
                console.error(error);
            });

        const application = new Iso7816Application(card);
        application.selectFile([0x31, 0x50, 0x41, 0x59, 0x2E, 0x53, 0x59, 0x53, 0x2E, 0x44, 0x44, 0x46, 0x30, 0x31])
            .then(function (response) {
                console.info(`Select PSE Response: '${response}' '${response.meaning()}'`);
            }).catch(function (error) {
                console.error('Error:', error, error.stack);
            });


    });
    device.on('card-removed', function (event) {
        console.log(`Card removed from '${event.name}' `);
    });

});

devices.on('device-deactivated', function (event) {
    console.log(`Device '${event.reader.name}' deactivated, devices: ${devices.listDevices()}`);
});


/*

devices.on('device-deactivated', function (event) {
    console.log(`Device '${event.reader.name}' deactivated, devices: ${devices.listDevices()}`);
});


devices.on('command-issued', function (event) {
    console.log(`Command '${event.command}' issued to '${event.reader.name}' `);
});

devices.on('response-received', function (event) {
    console.log(`Response '${event.response}' received from '${event.reader.name}' in response to '${event.command}'`);
});

devices.on('error', function (event) {
    console.log(`Error '${event.error}' received`);
});

devices.on('card-inserted', function (event) {

    console.log(`List devices: ${devices.listDevices()}`);

    let reader = event.reader;
    console.log(`Card inserted into '${reader.name}' `);

    devices
        .issueCommand(reader, '00A404000E315041592E5359532E4444463031')
        .then(function (response) {
            console.log(`Response '${response.toString('hex')}`);
        }).catch(function (error) {
            console.error(error);
        });
});
*/
