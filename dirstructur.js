'use strict';

var fs = require('fs');

// Stop right away if no CONFIG_PATH is specified
if (process.env.CONFIG_PATH === undefined) {
    return make_error('No CONFIG_PATH specified. Please consult the documentation for correct implementation.',
        'Incomplete Data');
}

function Dirstructur() {

    var CONFIG_PATH = process.env.CONFIG_PATH,
        CONFIG_FILE = CONFIG_PATH + 'dirstructur.json';


    function read_config_file() {
        return fs.readFile(CONFIG_FILE, 'utf8', function (err, data) {
            if (err) {
                return make_error(err, 'Error reading dirstructur.json\nEnsure that CONFIG_PATH is correct and the `dirstructur.json` is inside it.');
            }
            return config_string_to_json(data);
        });
    }

    function config_string_to_json(data) {
        try {
            data = JSON.parse(data);
            return parse_data(data);
        } catch (err) {
            return make_error(err, 'Error parsing dirstructur.json\nEnsure that it is valid JSON and that no extra data is contained in it such as comments.');
        }
    }

    function parse_data(data, path) {
        try {
            var key, currItem;
            path = path || CONFIG_PATH;
            for (key in data) {
                if (data.hasOwnProperty(key)) {

                    currItem = data[key];

                    if (isNaN(parseInt(key, 10))) {
                        console.info('MakeDir: ', key);
                        console.log('path: ', path + '\n\n');
                        create_directory(path, key);
                        path = path + key + '/';
                        // fs.readdir(path, function (err, files) {
                        //     if (err) {
                        //         return make_error(err, 'Error reading directoy:\n' + path);
                        //     }
                        //     console.log('Files:');
                        //     console.log(files);
                        // });
                    }

                    if (currItem != null && typeof currItem === 'object') {
                        parse_data(currItem, path);
                    } else if (typeof currItem === 'string' && currItem.indexOf('.') !== -1) {
                        console.log('MakeFile: ', currItem);
                        console.log('path: ', path + '\n\n');
                        create_file(path, key);
                    } else if (typeof currItem === 'string' && currItem.indexOf('.') === -1) {
                        console.log('MakeDir: ', currItem);
                        console.log('path: ', path + '\n\n');
                        create_directory(path, key);
                    }
                }
            }
        } catch (err) {
            return make_error(err, 'Error parsing data');
        }
    }

    function create_directory(path, name) {
        fs.mkdir(path, function (err) {
            if (err) {
                return make_error(err, 'Error creating directoy: ' + name + 'in ' + path);
            }
        });
    }

    function create_file(path, name) {
        fs.open(path, 'w', function (err) {
            if (err) {
                return make_error(err, 'Error creating file: ' + name + 'in ' + path);
            }
        });
    }

    this.initialize = function () {
        try {
            read_config_file();
        } catch (err) {
            return make_error(err, 'Error initializing Dirstructur');
        }
    }.call(this);

}

var dirstructur = new Dirstructur();

// Error Handling

function make_error(err, msg) {
    var e = new Error(msg);
    e.code = err;
    console.error(e);
    return process.exit(1);
}

process.on('uncaughtException', function (err) {
    return make_error('An uncaughtException was found, the program will end.',
        'uncaughtException');
});
