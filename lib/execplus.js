var exec = require('child_process').exec;

// Serial processes
function series(callbacks, last) {
    var results = [];
    function next() {
        var callback = callbacks.shift();
        if (callback) {
            callback(function() {
                results.push(Array.prototype.slice.call(arguments));
                next();
            });
        } else {
            last(results);
        }
    }
    next();
}

// Limited parallel processes.
function limited(limit, callbacks, last) {
    var results = [];
    var running = 1;
    var task = 0;
    function next(){
        running--;
        if (task == callbacks.length && running == 0) {
            last(results);
        }
        while(running < limit && callbacks[task]) {
            var callback = callbacks[task];
            (function(index) {
                callback(function() {
                    results[index] = Array.prototype.slice.call(arguments);
                    next();
                });
            })(task);
            task++;
            running++;
        }
    }
    next();
}

function makeFunction(cmd, options) {
    return function callback(next) {
        if (options.debug)
            console.log('command: ' + cmd);
        exec(cmd, options, next);
    };
}

function execSync(cmds, last) {
    var fns = [];

    cmds = (typeof cmds == 'string') ? [ cmds ] : cmds;
    
    for (var i = 0; i < cmds.length; i++) {
        var cmd = (typeof cmds[i] == 'object') ? cmds[i].cmd : cmds[i]; 
        var options = (typeof cmds[i] == 'object' && typeof cmds[i].options == 'object') ? cmds[i].options : {};
             
        fns.push(makeFunction(cmd, options));
    }
    series(fns, last ? last : function (results) {
        console.log('exec.sync complete: ' + results);
    });
}

function execASync(cmds, last) {
    var fns = [];
 
    cmds = (typeof cmds == 'string') ? [ cmds ] : cmds;
    
    for (var i = 0; i < cmds.length; i++) {
        var cmd = (typeof cmds[i] == 'object') ? cmds[i].cmd : cmds[i]; 
        var options = (typeof cmds[i] == 'object' && typeof cmds[i].options == 'object') ? cmds[i].options : {};
                 
        fns.push(makeFunction(cmd, options));
    }
    limited(4, fns, last ? last : function (results) {
        console.log('exec.async complete: ' + results);
    });
}

exports.sync = execSync;
exports.async = execASync;
