//#!/usr/bin/env node

// TiSpork: a utility for generating app icons, splash screens, and other assets for your Titanium program.
// http://www.thinkgeek.com/images/products/zoom/spork.jpg

var program = require('commander');
var assert = require('assert');
var wrench = require('wrench');
var shell = require('shelljs');
var exec = require('../lib/execplus');

function execResults(results) {
    console.log('TiSpork: command complete: ' + results);
}

program.version('0.0.3')
    .option('-a, --android', 'Generate Android icons, splashes, backgrounds, or assets.')
    .option('-i, --ios', 'Generate iOS (iPhone/iPad) icons, splashes, backgrounds, or assets.')
    .option('-m, --mobileweb', 'Generate mobile web (HTML5) icons, splashes, backgrounds, or assets.')
    .option('-d, --debug', 'Debug output');

program.command('icons <project-dir>')
    .description('Generate from a master icon, appicon.png, program icons for all platforms.')
    .action(function IconsCommand(projectDir, options) {  
        var inFile = projectDir + 'images/appicon.png';
        var execOptions = { cwd: projectDir + '/Resources', debug: program.debug };

        assert.ok(shell.test('-f', inFile), 'TiSpork icons: missing ' + inFile);

        // Normalize flags
        program.android = program.android || false;
        program.ios = program.ios || false;
        program.mobileweb = program.mobileweb || false;
        console.log('TiSpork icons: generating for Android: ' + program.android + ' iOS: ' + program.ios + ' Mobile Web: ' + program.mobileweb);

        var cmds = [];
        
        if (program.android) {
            wrench.mkdirSyncRecursive(execOptions.cwd + '/android');
            cmds.push({ cmd: 'convert ' + inFile + ' -resize 128x128! android/appicon.png', options: execOptions});
            cmds.push({ cmd: 'convert ' + inFile + ' -resize 512x512! android/MarketplaceArtwork.png', options: execOptions}); 
        }
        if (program.ios) {
            wrench.mkdirSyncRecursive(execOptions.cwd + '/iphone');
            cmds.push({ cmd: 'convert ' + inFile + ' -resize 29x29! iphone/Icon-Small.png', options: execOptions });
            cmds.push({ cmd: 'convert ' + inFile + ' -resize 50x50! iphone/Icon-Small-50.png', options: execOptions });
            cmds.push({ cmd: 'convert ' + inFile + ' -resize 58x58! iphone/Icon-Small@2x.png', options: execOptions });
            cmds.push({ cmd: 'convert ' + inFile + ' -resize 72x72! iphone/appicon-72.png', options: execOptions });
            cmds.push({ cmd: 'convert ' + inFile + ' -resize 144x144! iphone/appicon-72@2x.png', options: execOptions });
            cmds.push({ cmd: 'convert ' + inFile + ' -resize 57x57! iphone/appicon.png', options: execOptions });
            cmds.push({ cmd: 'convert ' + inFile + ' -resize 114x114! iphone/appicon@2x.png', options: execOptions });
            cmds.push({ cmd: 'convert ' + inFile + ' -resize 1024x1024! iphone/iTunesArtwork', options: execOptions });
        }
        if (program.mobileweb) {
            wrench.mkdirSyncRecursive(execOptions.cwd + '/mobileweb');
            cmds.push({ cmd: 'convert ' + inFile + ' -resize 128x128! mobileweb/appicon.png', options: execOptions });
        }  
        
        exec.async(cmds, execResults);      
    });    

program.command('splashes <project-dir>')
    .description('Generate from two master splash screens, Portrait.png and Landscape.png, splash screens for the specified platforms.')
    .action(function SplashesCommand(projectDir, options) {  
        var inDir = projectDir + 'images/';

        assert.ok(shell.test('-f', inDir + 'Portrait.png'), 'TiSpork splashes: missing Portrait splash ' + inDir + 'Portrait.png');
        assert.ok(shell.test('-f', inDir + 'Landscape.png'), 'TiSpork splashes: missing Landscape splash ' + inDir + 'Landscape.png');

        // Normalize flags
        program.android = program.android || false;
        program.ios = program.ios || false;
        program.mobileweb = program.mobileweb || false;
        console.log('TiSpork splashes: generating for Android: ' + program.android + ' iOS: ' + program.ios + ' Mobile Web: ' + program.mobileweb);

        var temp, cmds;

        if (program.android) {
            var execOptions = { cwd: projectDir + '/Resources/android/images/' , debug: program.debug };
            console.log('TiSpork splashes: generating for Android--' + execOptions.cwd);

             // Android Portrait
            wrench.mkdirSyncRecursive(execOptions.cwd + 'res-long-port-hdpi');
            wrench.mkdirSyncRecursive(execOptions.cwd + 'res-long-port-ldpi');
            wrench.mkdirSyncRecursive(execOptions.cwd + 'res-notlong-port-hdpi');
            wrench.mkdirSyncRecursive(execOptions.cwd + 'res-notlong-port-ldpi');
            wrench.mkdirSyncRecursive(execOptions.cwd + 'res-notlong-port-mdpi');
            
            temp = 'default-temp-ap1.png';
            cmds = [];
            cmds.push({ cmd: 'convert ' + inDir + 'Portrait.png -crop 1205x2008+166 ' + temp, options: execOptions });
            cmds.push({ cmd: 'convert ' + temp + ' -resize 480x800! res-long-port-hdpi/default.png', options: execOptions });
            cmds.push({ cmd: 'convert ' + temp + ' -resize 240x400! res-long-port-ldpi/default.png', options: execOptions });
            cmds.push({ cmd: 'convert ' + temp + ' -resize 480x800! res-notlong-port-hdpi/default.png', options: execOptions }); 
            cmds.push({ cmd: 'rm ' + temp, options: execOptions }); 
            exec.sync(cmds, execResults);

            temp = 'default-temp-ap2.png';
            cmds = [];
            cmds.push({ cmd: 'convert ' + inDir + 'Portrait.png -crop 1339x2008+99 ' + temp, options: execOptions });
            cmds.push({ cmd: 'convert ' + temp + ' -resize 240x320! res-notlong-port-ldpi/default.png', options: execOptions });
            cmds.push({ cmd: 'convert ' + temp + ' -resize 320x480! res-notlong-port-mdpi/default.png', options: execOptions });
            cmds.push({ cmd: 'rm ' + temp, options: execOptions }); 
            exec.sync(cmds, execResults);

            // Android Landscape
            wrench.mkdirSyncRecursive(execOptions.cwd + 'res-long-land-hdpi');
            wrench.mkdirSyncRecursive(execOptions.cwd + 'res-long-land-ldpi');
            wrench.mkdirSyncRecursive(execOptions.cwd + 'res-notlong-land-hdpi');
            wrench.mkdirSyncRecursive(execOptions.cwd + 'res-notlong-land-ldpi');
            wrench.mkdirSyncRecursive(execOptions.cwd + 'res-notlong-land-mdpi');

            temp = 'default-temp-al1.png';
            cmds = [];
            cmds.push({ cmd: 'convert ' + inDir + 'Landscape.png -crop 2048x1229+0+134 ' + temp, options: execOptions });
            cmds.push({ cmd: 'convert ' + temp + ' -resize 800x480! res-long-land-hdpi/default.png', options: execOptions });
            cmds.push({ cmd: 'convert ' + temp + ' -resize 400x240! res-long-land-ldpi/default.png', options: execOptions });
            cmds.push({ cmd: 'convert ' + temp + ' -resize 800x480! res-notlong-land-hdpi/default.png', options: execOptions });
            cmds.push({ cmd: 'rm ' + temp, options: execOptions }); 
            exec.sync(cmds, execResults);
 
            temp = 'default-temp-al2.png';
            cmds = [];
            cmds.push({ cmd: 'convert ' + inDir + 'Landscape.png -crop 2048x1365+0+65 ' + temp, options: execOptions });
            cmds.push({ cmd: 'convert ' + temp + ' -resize 320x240! res-notlong-land-ldpi/default.png', options: execOptions });
            cmds.push({ cmd: 'convert ' + temp + ' -resize 480x320! res-notlong-land-mdpi/default.png', options: execOptions });
            cmds.push({ cmd: 'rm ' + temp, options: execOptions }); 
            exec.sync(cmds, execResults);
        }

        if (program.ios) {
            var execOptions = { cwd: projectDir + '/Resources/iPhone/', debug: program.debug };
            wrench.mkdirSyncRecursive(execOptions.cwd);
            console.log('TiSpork splashes: generating for iOS--' + execOptions.cwd);
    
            // iPhone Portrait
            cmds = [];
            cmds.push({ cmd: 'convert ' + inDir + 'Portrait.png -resize 1536x2008! Default-Portrait@2x.png', options: execOptions });
            cmds.push({ cmd: 'convert Default-Portrait@2x.png -scale 50% Default-Portrait@.png', options: execOptions });
            temp = 'default-temp-ip.png';
            cmds.push({ cmd: 'convert Default-Portrait@2x.png -crop 1339x2008+99 ' + temp, options: execOptions });
            cmds.push({ cmd: 'convert ' + temp + ' -resize 640x960! Default@2x.png', options: execOptions });
            cmds.push({ cmd: 'convert ' + temp + ' -resize 320x480! Default.png', options: execOptions });
            cmds.push({ cmd: 'rm ' + temp, options: execOptions }); 
            exec.sync(cmds, execResults);
     
            // iPhone Landscape    
            cmds = [];
            cmds.push({ cmd: 'convert ' + inDir + 'Landscape.png -resize 2048x1496! Default-Landscape@2x.png', options: execOptions });
            cmds.push({ cmd: 'convert Default-Landscape@2x.png -scale 50% Default-Landscape.png', options: execOptions });
            exec.sync(cmds, execResults);
        }      
    });    

program.command('backgrounds <project-dir> <bkgnd-folder>')
    .description('Traverse the <project-dir>/images/<bkgnd-folder> directory and generate cropped and scaled background images appropriate to the device in the right device specific folders.')
    .action(function SplashesCommand(projectDir, bkgndFolder, options) {  
        var bkgndFolder = bkgndFolder || '';
        var inDir = projectDir + 'images/' + bkgndFolder + '/';

        assert.ok(shell.test('-d', inDir), 'TiSpork backgrounds: missing backgrounds folder ' + inDir + bkgndFolder);

        // Normalize flags
        program.android = program.android || false;
        program.ios = program.ios || false;
        program.mobileweb = program.mobileweb || false;
        console.log('TiSpork backgrounds: generating for Android: ' + program.android + ' iOS: ' + program.ios + ' Mobile Web: ' + program.mobileweb);

        var execOptions, temp;

        var fs = require('fs');
        fs.readdir(inDir, function(error, curFiles) {
            if (error) {
                throw error;
            }
            
            for (var i = 0; i < curFiles.length; i++) {
                var isPortrait = curFiles[i].indexOf('-Portrait') > -1;
                var isLandscape = curFiles[i].indexOf('-Landscape') > -1;

                console.log("--" + curFiles[i]);                
                
                if (program.android) {     
                    execOptions = { cwd: projectDir + 'Resources/android/images/', debug: program.debug };

                    wrench.mkdirSyncRecursive(execOptions.cwd + 'low/' + bkgndFolder);
                    wrench.mkdirSyncRecursive(execOptions.cwd + 'medium/' + bkgndFolder);
                    wrench.mkdirSyncRecursive(execOptions.cwd + 'high/' + bkgndFolder);

                    if (isPortrait) {
                        // Android Portrait
                        var outFile = curFiles[i];
                        var index = curFiles[i].indexOf('-Portrait');
                        if (index != -1)
                            outFile = curFiles[i].slice(0, index) + curFiles[i].slice(index + '-Portrait'.length);
                        outFile = outFile.split('.');
                        outFile.pop();
                        outFile = outFile.join('.');   // Lop off the filetype
                      
                        cmds = [];
                        temp = 'temp-ap1.png';      // 3/5 Aspect ratio
                        cmds.push({ cmd: 'convert ' + inDir + curFiles[i] + ' -crop 1229x2048+154 ' + temp, options: execOptions });
                        cmds.push({ cmd: 'convert ' + temp + ' -resize 480x800! high/' + bkgndFolder + '/' + outFile + '-Portrait.png', options: execOptions });
                        cmds.push({ cmd: 'convert ' + temp + ' -resize 240x400! low/' + bkgndFolder + '/' + outFile + '-Portrait.png', options: execOptions });
                        cmds.push({ cmd: 'rm ' + temp, options: execOptions }); 
                 
                        temp = 'temp-ap2.png';      // 3/4 Aspect ratio
                        cmds.push({ cmd: 'convert ' + inDir + curFiles[i] + ' -crop 1536x2048 ' + temp, options: execOptions });
                        cmds.push({ cmd: 'convert ' + temp + ' -resize 240x320! low/' + bkgndFolder + '/' + outFile + '-Portrait-Short.png', options: execOptions });
                        cmds.push({ cmd: 'rm ' + temp, options: execOptions }); 
 
                        temp = 'temp-ap3.png'       // 2/3 Aspect ratio
                        cmds.push({ cmd: 'convert ' + inDir + curFiles[i] + ' -crop 1365x2048+85 ' + temp, options: execOptions });
                        cmds.push({ cmd: 'convert ' + temp + ' -resize 320x480! medium/' + bkgndFolder + '/' + outFile + '-Portrait.png', options: execOptions });
                        cmds.push({ cmd: 'rm ' + temp, options: execOptions }); 
 
                        exec.sync(cmds, execResults);
                    }
                    if (isLandscape) {           
                        var outFile = curFiles[i];
                        var index = curFiles[i].indexOf('-Landscape');
                        if (index != -1)
                            outFile = curFiles[i].slice(0, index) + curFiles[i].slice(index + '-Landscape'.length);
                        outFile = outFile.split('.');
                        outFile.pop()
                        outFile = outFile.join('.');   // Lop off the filetype

                        cmds = [];
                        temp = 'temp-al1.png';      // 3/5 Aspect ratio
                        cmds.push({ cmd: 'convert ' + inDir + curFiles[i] + ' -crop 2048x1229+0+154 ' + temp, options: execOptions });
                        cmds.push({ cmd: 'convert ' + temp + ' -resize 800x480! high/' + bkgndFolder + '/' + outFile + '-Landscape.png', options: execOptions });
                        cmds.push({ cmd: 'convert ' + temp + ' -resize 400x240! low/' + bkgndFolder + '/' + outFile + '-Landscape.png', options: execOptions });
                        cmds.push({ cmd: 'rm ' + temp, options: execOptions }); 
            
                        temp = 'temp-al2.png';      // 3/4 Aspect ratio
                        cmds.push({ cmd: 'convert ' +  inDir + curFiles[i] + ' -crop 2048x1536 ' + temp, options: execOptions });
                        cmds.push({ cmd: 'convert ' + temp + ' -resize 320x240! low/' + bkgndFolder + '/' + outFile + '-Landscape-Short.png', options: execOptions });
                        cmds.push({ cmd: 'rm ' + temp, options: execOptions }); 
                        
                        temp = 'temp-al3.png';      // 2/3 Aspect ratio
                        cmds.push({ cmd: 'convert ' +  inDir + curFiles[i] + ' -crop 2048x1365+0+85 ' + temp, options: execOptions });
                        cmds.push({ cmd: 'convert ' + temp + ' -resize 480x320! medium/' + bkgndFolder + '/' + outFile + '-Landscape.png', options: execOptions });
                        cmds.push({ cmd: 'rm ' + temp, options: execOptions }); 

                        exec.sync(cmds, execResults);
                   }
                }
                if (program.ios) {
                    execOptions = { cwd: projectDir + 'Resources/iphone/images/' + bkgndFolder + '/', debug: program.debug };
                    wrench.mkdirSyncRecursive(execOptions.cwd);
    
                    if (isPortrait) {
                        var outFile = curFiles[i];
                        var index = curFiles[i].indexOf('-Portrait');
                        if (index != -1)
                            outFile = curFiles[i].slice(0, index) + curFiles[i].slice(index + '-Portrait'.length);
                        outFile = outFile.split('.');
                        outFile.pop()
                        outFile = outFile.join('.');   // Lop off the filetype

                        cmds = [];                  // 3/4 Aspect ratio
                        cmds.push({ cmd: 'convert ' +  inDir + curFiles[i] + ' -crop 1536x2048 ' + outFile + '-Portrait-Tablet@2x.png', options: execOptions });
                        cmds.push({ cmd: 'convert ' + outFile + '-Portrait-Tablet@2x.png -scale 50% ' + outFile + '-Portrait-Tablet.png', options: execOptions });
 
                        temp = 'temp-ip1.png';      // 2/3 Aspect ratio
                        cmds.push({ cmd: 'convert ' +  inDir + curFiles[i] + ' -crop 1365x2048+85 ' + temp, options: execOptions });
                        cmds.push({ cmd: 'convert ' + temp + ' -resize 640x960! ' + outFile + '-Portrait-Phone@2x.png', options: execOptions });
                        cmds.push({ cmd: 'convert ' + temp + ' -resize 320x480! ' + outFile + '-Portrait-Phone.png', options: execOptions });
                        cmds.push({ cmd: 'rm ' + temp, options: execOptions }); 
                        
                        exec.sync(cmds, execResults);
                    }
                    if (isLandscape) {
                        var index = curFiles[i].indexOf('-Landscape');
                        var outFile = curFiles[i].slice(0, index) + curFiles[i].slice(index + '-Landscape'.length);
                        outFile = outFile.split('.')[0];

                        cmds = [];                  // 4/3 Aspect ratio
                        cmds.push({ cmd: 'convert ' + inDir + curFiles[i] + ' -crop 2048x1536 ' + outFile + '-Landscape-Tablet@2x.png', options: execOptions });
                        cmds.push({ cmd: 'convert ' + outFile + '-Landscape-Tablet@2x.png -scale 50% ' + outFile + '-Landscape-Tablet.png', options: execOptions });
  
                        temp = 'temp-il1.png';      // 3/2 Aspect ratio                 
                        cmds.push({ cmd: 'convert ' + inDir + curFiles[i] + ' -crop 2048x1365+0+85 ' + temp, options: execOptions });
                        cmds.push({ cmd: 'convert ' + temp + ' -resize 960x640 ' + outFile + '-Landscape-Phone@2x.png', options: execOptions });
                        cmds.push({ cmd: 'convert ' + temp + ' -resize 480x320 ' + outFile + '-Landscape-Phone.png', options: execOptions });
                        cmds.push({ cmd: 'rm ' + temp, options: execOptions }); 

                        exec.sync(cmds, execResults);                                          
                     }  
                }
                if (program.mobileweb) {
                    execOptions = { cwd: projectDir + 'Resources/mobileweb/images/' + bkgndFolder + '/', debug: program.debug };
                    wrench.mkdirSyncRecursive(execOptions.cwd);

                    cmds = [];   
                    cmds.push({ cmd: 'cp ' + inDir + curFiles[i] + ' ' + curFiles[i], options: execOptions });
 
                    exec.sync(cmds, execResults);
                }
            }
        });
    });    
    
program.command('assets <project-dir> <assets-folder> <width>')
    .description('Generate multiple resolutions of assets from high res assets. Assumes your assets are all in the <project-dir>/images/<asset-folder>. <width> is the width in pixels of the smallest size of the image you want to generate.')
    .option('-3, --three', 'For Android only, generate image at scale 3 in the 3:4:6:8 ratio, where 8 is the original size')
    .option('-4, --four', 'For Android only, generate image at scale 4 in the 3:4:6:8 ratio, where 8 is the original size')
    .option('-6, --six', 'For Android only, generate image at scale 6 in the 3:4:6:8 ratio, where 8 is the original size')
    .option('-8, --eight', 'For Android only, generate image at scale 8 in the 3:4:6:8 ratio, where 8 is the original size')
    .option('-r, --retina', 'For iOS only, source image is considered to be for retina display @2x, generate 50% scaled version. Similar to 4:8 in the 3:4:6:8 Android ratio.')
    .option('-x, --all', 'Generate assets for all sizes for the specified platforms (equivalent to -3468r)')
    .action(function AssetsCommand(projectDir, assetFolder, width, options) {  
        
        var assetsDir = projectDir + 'images/' + assetFolder + '/';
  
        assert.ok(shell.test('-d', assetsDir), 'TiSpork assets: missing asset folder ' + assetsDir);

        // Normalize flags        
        if (options.all) {
            options.three = options.four = options.six = options.eight = options.retina = true;
        } 
        program.android = program.android || false;
        program.ios = program.ios || false;
        program.mobileweb = program.mobileweb || false;
        var noScale = !(options.three || options.four || options.six || options.eight); // Just copy over assets for Android
        console.log('TiSpork assets: generating for Android: ' + program.android + ' iOS: ' + program.ios + ' Mobile Web: ' + program.mobileweb);

        console.log('TiSpork assets: processing folder ' + assetFolder + ' width: ' + width);

        var execOptions;

        if (program.android) {
            var outDir = projectDir + '/Resources/android/images/';                        
            var ratios = (options.three ? '3:' : '') + (options.four ? '4:' : '') + (options.six ? '6:' : '') + (options.eight ? '8' : '') + (noScale ? 'no scaling' : '');
            console.log('TiSpork assets: Android generating images with ' + ratios);

            if (noScale)
                wrench.mkdirSyncRecursive(outDir + assetFolder);
            if (options.three)
                // ldpi    Resources for low-density (ldpi) screens (~120dpi).
                wrench.mkdirSyncRecursive(outDir + 'low/' + assetFolder);
            if (options.four)
                // mdpi    Resources for medium-density (mdpi) screens (~160dpi). (This is the baseline density.)
                wrench.mkdirSyncRecursive(outDir + 'medium/' + assetFolder);
            if (options.six)
                // hdpi    Resources for high-density (hdpi) screens (~240dpi).
                wrench.mkdirSyncRecursive(outDir + 'high/' + assetFolder);
            if (options.eight)
                // xhdpi   Resources for extra high-density (xhdpi) screens (~320dpi).
                wrench.mkdirSyncRecursive(outDir + 'res-xhdpi/' + assetFolder);
        }
        
        if (program.ios) {
            var ratios = options.retina ? 'retina (@2x)' : 'no scaling';
            console.log('TiSpork assets: iOS generating images with ' + ratios);
            wrench.mkdirSyncRecursive(projectDir + '/Resources/iphone/images/' + assetFolder);
        }
        
        if (program.mobileweb) {
            console.log('TiSpork assets: Mobile Web generating images with no scaling');
            wrench.mkdirSyncRecursive(projectDir + '/Resources/mobileweb/images/' + assetFolder);
        }     
        
        var cmds = [];
        var fs = require('fs');
        fs.readdir(assetsDir, function(error, curFiles) {
            if (error)
                throw error;

            cmds = [];               
            for (var i = 0; i < curFiles.length; i++) {
                console.log("--" + curFiles[i]);  
                     
                var inFile = assetsDir + curFiles[i];
                var splitName = curFiles[i].split('.');
                var fileType = splitName.pop();
                var fileName = splitName.pop();
                
                if (fileType != 'jpg' && fileType != 'png' && fileType != 'gif')
                    continue;
                
                if (program.android) {
                    execOptions = { cwd: projectDir + '/Resources/android/images/', debug: program.debug };
                    if (noScale) 
                        cmds.push({ cmd: 'convert ' + inFile + ' -resize ' + width + ' '  + assetFolder + '/' + curFiles[i], options: execOptions });
                    if (options.three)
                        cmds.push({ cmd: 'convert ' + inFile + ' -resize ' + (width * 0.375) + ' low/' + assetFolder + '/' + curFiles[i], options: execOptions });
                    if (options.four)
                        cmds.push({ cmd: 'convert ' + inFile + ' -resize ' + (width * 0.5) + ' medium/' + assetFolder + '/' + curFiles[i], options: execOptions });
                    if (options.six)
                        cmds.push({ cmd: 'convert ' + inFile + ' -resize ' + (width * 0.75) + ' high/' + assetFolder + '/' + curFiles[i], options: execOptions });
                    if (options.eight)
                        cmds.push({ cmd: 'convert ' + inFile + ' -resize ' + width + ' res-xhdpi/' + assetFolder + '/' + curFiles[i], options: execOptions });
                }
                
                if (program.ios) {
                    execOptions = { cwd: projectDir + '/Resources/iphone/images/' + assetFolder + '/', debug: program.debug };
                    if (options.retina) {
                        cmds.push({ cmd: 'convert ' + inFile + ' -resize ' + (width / 2) + ' ' + curFiles[i], options: execOptions });
                        cmds.push({ cmd: 'convert ' + inFile + ' -resize ' + width + ' ' + fileName + '@2x.' + fileType, options: execOptions });
                    } else {
                        cmds.push({ cmd: 'convert ' + inFile + ' -resize ' + width + ' ' + curFiles[i], options: execOptions });
                    }
                }
                
                if (program.mobileweb) {
                    execOptions = { cwd: projectDir + '/Resources/mobileweb/images/' + assetFolder + '/', debug: program.debug };

                    cmds.push({ cmd: 'convert ' + inFile + ' -resize ' + width + ' ' + curFiles[i], options: execOptions });
                }             
            }
            exec.async(cmds, execResults);         
       });
    });

program.command('*')
    .action(function AssetsGeneral(options) { 
        console.log('TiSpork: unknown command '); 
    });

program.parse(process.argv);