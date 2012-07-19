#!/usr/bin/env node

// TiSpork: a utility for generating app icons, splash screens, and other assets for your Titanium program.
// http://www.thinkgeek.com/images/products/zoom/spork.jpg

var program = require('commander');
var assert = require('assert');
var wrench = require('wrench');
var shell = require('shelljs');

function execSync(cmd) {
    if (program.debug) 
        console.log(cmd);
    shell.exec(cmd);
}

function checkOutput(error, stdout, stderr) { 
    if (error) { 
        require('util').puts(stderr); 
    }
    return (error == 0);
}

var ex = require('child_process').exec;      
function exec(cmd, options, output) {
    options = options || {};
    output = output || checkOutput;

    if (program.debug)
        console.log(cmd, options); 
    ex(cmd, options, output);
};

// Normalize the flags to true/false and handle the program.all.
function normalizeFlags() {
    if (program.all) {
        program.android = program.ios = program.mobileweb = true;
    } else {
        program.android = program.android || false;
        program.ios = program.ios || false;
        program.mobileweb = program.mobileweb || false;
    }
    program.clean = program.clean || false;
}

program.version('0.0.2')
    .option('-a, --android', 'Generate Android assets')
    .option('-i, --ios', 'Generate iOS (iPhone/iPad) assets')
    .option('-m, --mobileweb', 'Generate mobile web (HTML5) assets')
    .option('-all', 'Generate assets for all platforms')
    .option('-d, --debug', 'For debugging, output all commands to the console.')
    .option('-s, --suffix [string]', 'For assets command only, suffix to append to processed images. Smallest image has no suffix and each successive higher rez copy has the suffix appended to the file name. [@2x]', '@2x')
    .option('-w, --width <n>', 'For assets command only, width in pixels of the smallest size of the image.', parseInt)
    .option('-c, --copies [number]', 'For assets command only, 1 = single copy, 2 = two copies (second 2x larger), 3 = 3 copies (second 2x, third 4x larger) [3]', parseInt, 3)

program.command('icons <project-dir>')
    .description('Generate from a master icon, appicon.png, program icons for all platforms.')
    .usage('<project-dir>')
    .action(function(projectDir) {  
        var inFile = projectDir + '/images/appicon.png';
        var options = { cwd: projectDir + '/Resources' };

        assert.ok(shell.test('-f', inFile), 'TiSpork icons: missing ' + inFile);

        normalizeFlags();
        console.log('TiSpork icons: generating for Android: ' + program.android + ' iOS: ' + program.ios + ' Mobile Web: ' + program.mobileweb);

        if (program.android) {
            wrench.mkdirSyncRecursive(options.cwd + '/android');
            exec('convert ' + inFile + ' -resize 128x128! android/appicon.png', options);
            exec('convert ' + inFile + ' -resize 512x512! android/MarketplaceArtwork.png', options);
        }
        if (program.ios) {
            wrench.mkdirSyncRecursive(options.cwd + '/iphone');
            exec('convert ' + inFile + ' -resize 29x29! iphone/Icon-Small.png', options);
            exec('convert ' + inFile + ' -resize 50x50! iphone/Icon-Small-50.png', options);
            exec('convert ' + inFile + ' -resize 58x58! iphone/Icon-Small@2x.png', options);
            exec('convert ' + inFile + ' -resize 72x72! iphone/appicon-72.png', options);
            exec('convert ' + inFile + ' -resize 144x144! iphone/appicon-72@2x.png', options);
            exec('convert ' + inFile + ' -resize 57x57! iphone/appicon.png', options);
            exec('convert ' + inFile + ' -resize 114x114! iphone/appicon@2x.png', options);
            exec('convert ' + inFile + ' -resize 1024x1024! iphone/iTunesArtwork', options);
        }
        if (program.mobileweb) {
            wrench.mkdirSyncRecursive(options.cwd + '/mobileweb');
            exec('convert ' + inFile + ' -resize 128x128! mobileweb/appicon.png', options);
        }        
    });    

program.command('splashes <project-dir>')
    .description('Generate from two master splash screens, Portrait.png and Landscape.png, splash screens for the specified platforms.')
    .usage('<project-dir>')
    .action(function(projectDir) {  
        var inDir = projectDir + '/images';

        assert.ok(shell.test('-f', inDir + '/Portrait.png'), 'TiSpork splashes: missing Portrait splash ' + inDir + '/Portrait.png');
        assert.ok(shell.test('-f', inDir + '/Landscape.png'), 'TiSpork splashes: missing Landscape splash ' + inDir + '/Landscape.png');

        normalizeFlags();
        console.log('TiSpork splashes: generating for Android: ' + program.android + ' iOS: ' + program.ios + ' Mobile Web: ' + program.mobileweb);

        var outDir, temp;

        if (program.android) {
            outDir = projectDir + '/Resources/android/images/';
            console.log('TiSpork splashes: generating for Android--' + outDir);

             // Android Portrait
            wrench.mkdirSyncRecursive(outDir + 'res-long-port-hdpi');
            wrench.mkdirSyncRecursive(outDir + 'res-long-port-ldpi');
            wrench.mkdirSyncRecursive(outDir + 'res-notlong-port-hdpi');
            wrench.mkdirSyncRecursive(outDir + 'res-notlong-port-ldpi');
            wrench.mkdirSyncRecursive(outDir + 'res-notlong-port-mdpi');

            temp = outDir + 'temp-ap1.png';
            execSync('convert ' + inDir + '/Portrait.png -crop 1205x2008+166 ' + temp);
            execSync('convert ' + temp + ' -resize 480x800! ' + outDir + 'res-long-port-hdpi/default.png');
            execSync('convert ' + temp + ' -resize 240x400! ' + outDir + 'res-long-port-ldpi/default.png');
            execSync('convert ' + temp + ' -resize 480x800! ' + outDir + 'res-notlong-port-hdpi/default.png');   
            shell.rm(temp);

            temp = outDir + 'temp-ap2.png';
            execSync('convert ' + inDir + '/Portrait.png -crop 1339x2008+99 ' + temp); 
            execSync('convert ' + temp + ' -resize 240x320! ' + outDir + 'res-notlong-port-ldpi/default.png');
            execSync('convert ' + temp + ' -resize 320x480! ' + outDir + 'res-notlong-port-mdpi/default.png');
            shell.rm(temp);

            // Android Landscape
            wrench.mkdirSyncRecursive(outDir + 'res-long-land-hdpi');
            wrench.mkdirSyncRecursive(outDir + 'res-long-land-ldpi');
            wrench.mkdirSyncRecursive(outDir + 'res-notlong-land-hdpi');
            wrench.mkdirSyncRecursive(outDir + 'res-notlong-land-ldpi');
            wrench.mkdirSyncRecursive(outDir + 'res-notlong-land-mdpi');

            temp = outDir + 'temp-al.png';
            execSync('convert ' + inDir + '/Landscape.png -crop 2048x1229+0+134 ' + temp);
            execSync('convert ' + temp + ' -resize 800x480! ' + outDir + 'res-long-land-hdpi/default.png');
            execSync('convert ' + temp + ' -resize 400x240! ' + outDir + 'res-long-land-ldpi/default.png');
            execSync('convert ' + temp + ' -resize 800x480! ' + outDir + 'res-notlong-land-hdpi/default.png');

            execSync('convert ' + inDir + '/Landscape.png -crop 2048x1365+0+65 ' + temp);
            execSync('convert ' + temp + ' -resize 320x240! ' + outDir + 'res-notlong-land-ldpi/default.png');
            execSync('convert ' + temp + ' -resize 480x320! ' + outDir + 'res-notlong-land-mdpi/default.png');
            shell.rm(temp);
        }

        if (program.ios) {
            outDir = projectDir + '/Resources/iphone/';
            wrench.mkdirSyncRecursive(outDir);
            console.log('TiSpork splashes: generating for iOS--' + outDir);
    
            // iPhone Portrait
            temp = outDir + 'temp-ip.png';
            execSync('convert ' + inDir + '/Portrait.png -resize 1536x2008! ' + outDir + 'Default-Portrait@2x.png');   
            execSync('convert ' + outDir + 'Default-Portrait@2x.png -scale 50% ' + outDir + 'Default-Portrait.png');   
            execSync('convert ' + outDir + 'Default-Portrait@2x.png -crop 1339x2008+99 ' + temp);
            execSync('convert ' + temp + ' -resize 640x960! ' + outDir + 'Default@2x.png');
            execSync('convert ' + temp + ' -resize 320x480! ' + outDir + 'Default.png');
            shell.rm(temp);      
     
            // iPhone Landscape    
            //temp = outDir + 'temp-il.png';   
            execSync('convert ' + inDir + '/Landscape.png -resize 2048x1496! ' + outDir + 'Default-Landscape@2x.png');   
            execSync('convert ' + outDir + 'Default-Landscape@2x.png -scale 50% ' + outDir + 'Default-Landscape.png');   
            //execSync('convert ' + outDir + 'Default-Landscape@2x.png -crop 2048x1365+0+65 ' + temp);
            //execSync('convert ' + temp + ' -resize 960x640! ' + outDir + 'Default-Landscape@2x~iphone.png');
            //execSync('convert ' + temp + ' -resize 480x320! ' + outDir + 'Default-Landscape~iphone.png');
            //shell.rm(temp);
        }
        
        if (program.mobileweb) {
            // outDir = projectDir + '/Resources/mobileweb/';
            // wrench.mkdirSyncRecursive(outDir);
//            console.log('TiSpork splashes: generating for Android--' + outDir);
// 
            // // Mobile Web
            // wrench.mkdirSyncRecursive(outDir + 'apple_startup_images');
            // execSync('convert ' + inDir + '/Portrait.png -resize 768x1004! ' + outDir + 'apple_startup_images/Default-Portrait.png');   
            // execSync('convert ' apple_startup_images/Default-Portrait.png -resize 768x1004! apple_startup_images/Default-Portrait.jpg', options);   
        }
    });    
    
program.command('assets <project-dir> <assets-folder>')
    .description('Generate low res assets from high res assets. Assumes your assets are all in the <project-dir>/images/<asset-folder>. Generates to your <project-dir>/Resources/images/<assets-folder> a total of --copies of your images, each one a scaled down multiple of the original.')
    .usage('<project-dir> <assets-folder>')
    .action(function(projectDir, assetFolder) {  
        var assetsDir = projectDir + '/images/' + assetFolder;
        var outDir = projectDir + '/Resources/images/' + assetFolder;
        
        assert.ok(shell.test('-d', assetsDir), 'TiSpork assets: missing asset folder ' + assetsDir);
        wrench.mkdirSyncRecursive(outDir);
        
        console.log('TiSpork assets: processing folder ' + assetFolder + ' suffix: ' + program.suffix + ' width: ' + program.width);
        
        var fs = require('fs');
        fs.readdir(assetsDir, function(error, curFiles) {
            if (error) 
                throw error;
            
            for (var i in curFiles) {
                var inFile = assetsDir + '/' + curFiles[i];
                var splitName = curFiles[i].split('.');
                var fileType = splitName.pop();
                var fileName = splitName.pop();
                
                if (fileType == 'jpg' || fileType == 'png' || fileType == 'gif') {
                    console.log('TiSpork assets: generating ' + program.copies + ' copies of '+ fileName + '.' + fileType);
                    var suffix = '';
                    for (var j = program.copies - 1; j >= 0; j--) {
                        exec('convert ' + inFile + ' -resize ' + program.width / Math.pow(2, j) + ' ' + outDir + '/' + fileName + suffix + '.' + fileType);
                        suffix += program.suffix;
                    }
                }
            }
        });         
   });

program.parse(process.argv);

