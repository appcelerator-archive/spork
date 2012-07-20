#!/usr/bin/env node

// TiSpork: a utility for generating app icons, splash screens, and other assets for your Titanium program.
// http://www.thinkgeek.com/images/products/zoom/spork.jpg

var program = require('commander');
var assert = require('assert');
var wrench = require('wrench');
var shell = require('shelljs');

function execSync(cmd) {
    if (program.debug) {
        console.log(cmd);
    }
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
        program.three = program.four = program.six = program.eight = program.retina = true;
    } 
    program.noscale = !(program.three || program.four || program.six || program.eight); // Just copy over assets for Android
}

program.version('0.0.2')
    .option('-a, --android', 'Generate Android assets')
    .option('-i, --ios', 'Generate iOS (iPhone/iPad) assets')
    .option('-m, --mobileweb', 'Generate mobile web (HTML5) assets')
    .option('-d, --debug', 'For debugging, output all commands to the console.')
    .option('-w, --width <n>', 'For assets command only, width in pixels of the smallest size of the image.', parseInt)
    .option('-3, --three', 'For assets command and Android only, generate image at scale 3 in the 3:4:6:8 ratio, where 8 is the original size')
    .option('-4, --four', 'For assets command and Android only, generate image at scale 4 in the 3:4:6:8 ratio, where 8 is the original size')
    .option('-6, --six', 'For assets command and Android only, generate image at scale 6 in the 3:4:6:8 ratio, where 8 is the original size')
    .option('-8, --eight', 'For assets command and Android only, generate image at scale 8 in the 3:4:6:8 ratio, where 8 is the original size')
    .option('-r, --retina', 'For assets command and iOS only, source image is considered to be for retina display @2x, generate 50% scaled version. Similar to 4:8 in the 3:4:6:8 Android ratio.')
    .option('--all', 'For assets command, generate assets for all sizes for the specified platforms')

program.command('icons <project-dir>')
    .description('Generate from a master icon, appicon.png, program icons for all platforms.')
    .usage('<project-dir>')
    .action(function IconsCommand(projectDir) {  
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
    .action(function SplashesCommand(projectDir) {  
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
            execSync('convert ' + inDir + '/Landscape.png -resize 2048x1496! ' + outDir + 'Default-Landscape@2x.png');   
            execSync('convert ' + outDir + 'Default-Landscape@2x.png -scale 50% ' + outDir + 'Default-Landscape.png');   
        }      
    });    
    
program.command('assets <project-dir> <assets-folder>')
    .description('Generate multiple resolutions of assets from high res assets. Assumes your assets are all in the <project-dir>/images/<asset-folder>.')
    .action(function AssetsCommand(projectDir, assetFolder) {  
        var assetsDir = projectDir + '/images/' + assetFolder;
        
        assert.ok(shell.test('-d', assetsDir), 'TiSpork assets: missing asset folder ' + assetsDir);

        normalizeFlags();

        console.log('TiSpork assets: processing folder ' + assetFolder + ' width: ' + program.width);

        if (program.android) {
            var outDir = projectDir + '/Resources/android/images/';                        
            var ratios = (program.three ? '3:' : '') + (program.four ? '4:' : '') + (program.six ? '6:' : '') + (program.eight ? '8' : '') + (program.noscale ? 'no scaling' : '');
            console.log('TiSpork assets: Android generating images with ' + ratios);

            if (program.noscale) {
                wrench.mkdirSyncRecursive(outDir + assetFolder);
            }
            if (program.three) {
                // ldpi    Resources for low-density (ldpi) screens (~120dpi).
                wrench.mkdirSyncRecursive(outDir + 'res-ldpi/' + assetFolder);
            }
            if (program.four) {
                // mdpi    Resources for medium-density (mdpi) screens (~160dpi). (This is the baseline density.)
                wrench.mkdirSyncRecursive(outDir + 'res-mdpi/' + assetFolder);
            }
            if (program.six) {
                // hdpi    Resources for high-density (hdpi) screens (~240dpi).
                wrench.mkdirSyncRecursive(outDir + 'res-hdpi/' + assetFolder);
            }
            if (program.eight) {
                // xhdpi   Resources for extra high-density (xhdpi) screens (~320dpi).
                wrench.mkdirSyncRecursive(outDir + 'res-xhdpi/' + assetFolder);
            }
        }
        
        if (program.ios) {
            var ratios = program.retina ? 'retina (@2x)' : 'no scaling';
            console.log('TiSpork assets: iOS generating images with ' + ratios);
            wrench.mkdirSyncRecursive(projectDir + '/Resources/iphone/images/' + assetFolder);
        }
        
        if (program.mobileweb) {
            console.log('TiSpork assets: Mobile Web generating images with no scaling');
            wrench.mkdirSyncRecursive(projectDir + '/Resources/mobileweb/images/' + assetFolder);
        }     
        
        var fs = require('fs');
        fs.readdir(assetsDir, function(error, curFiles) {
            if (error) {
                throw error;
            }
            
            var i;
            for (i = 0; i < curFiles.length; i++) {
                console.log('TiSpork assets: processing ' + curFiles[i]);                
                
                var inFile = assetsDir + '/' + curFiles[i];
                var splitName = curFiles[i].split('.');
                var fileType = splitName.pop();
                var fileName = splitName.pop();
                
                if (fileType == 'jpg' || fileType == 'png' || fileType == 'gif') {
                    if (program.android) {
                        if (program.noscale) {
                            exec('convert ' + inFile + ' -resize ' + program.width + ' ' + projectDir + '/Resources/android/images/' + assetFolder + '/' + curFiles[i]);                        
                        }   
                        if (program.three) {
                            exec('convert ' + inFile + ' -resize ' + (program.width * 0.375) + ' ' + projectDir + '/Resources/android/images/res-ldpi/' + assetFolder + '/' + curFiles[i]);                        
                        }   
                        if (program.four) {
                            exec('convert ' + inFile + ' -resize ' + (program.width * 0.5) + ' ' + projectDir + '/Resources/android/images/res-mdpi/' + assetFolder + '/' + curFiles[i]);                        
                        }   
                        if (program.six) {
                            exec('convert ' + inFile + ' -resize ' + (program.width * 0.75) + ' ' + projectDir + '/Resources/android/images/res-hdpi/' + assetFolder + '/' + curFiles[i]);                        
                        }   
                        if (program.eight) {
                            exec('convert ' + inFile + ' -resize ' + program.width + ' ' + projectDir + '/Resources/android/images/res-xhdpi/' + assetFolder + '/' + curFiles[i]);                                               
                        }   
                    }
                    
                    if (program.ios) {
                        var outDir = projectDir + '/Resources/iphone/images/' + assetFolder + '/';
                        if (program.retina) {
                            exec('convert ' + inFile + ' -resize ' + (program.width / 2) + ' ' + outDir  + curFiles[i]);
                            exec('convert ' + inFile + ' -resize ' + program.width + ' ' + outDir  + fileName + '@2x.' + fileType);
                        } else {
                            exec('convert ' + inFile + ' -resize ' + program.width + ' ' + outDir  + curFiles[i]);                           
                        }
                    }
                    
                    if (program.mobileweb) {
                        var outDir = projectDir + '/Resources/mobileweb/images/' + assetFolder + '/';
                        exec('convert ' + inFile + ' -resize ' + program.width + ' ' + outDir  + curFiles[i]);                                                  
                    }
                }
            }
        });         
    });

program.parse(process.argv);

