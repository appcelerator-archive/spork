Spork
=====

Spork is a utility by [Appcelerator](http://www.appcelerator.com) for generating images in a variety of sizes for [Titanium](http://www.appcelerator.com/platform).

It provides convenient ways of generating application icons, splash screens, and images for things like buttons at a variety of sizes and resolutions to accomodate different platforms (iOS, Android, Mobile Web) from single sources. 

Note that Spork depends on having an install of the amazing utility [ImageMagick](http://www.imagemagick.org) and, in particular, the convert command line utility.

Current Status
--------------

| Date | Version | Status | Comments |
| ---: | ------- | ------ | -------- |
| 09/18/2012 | 0.0.4 | Unstable | Updated for iPhone 5 splash screen, added support for Titanium Alloy projects|
| 08/02/2012 | 0.0.3 | Unstable | Initial release |

Installation
-------------

Spork is available as a Node.JS NPM module by running the following command:

	[sudo] npm install -g tispork

Local Installation
------------------

To install your own local copy (with executable), clone this repository, navigate to the top level directory, and install via:

	[sudo] npm install -g .	

Running Spork from the command line
-----------------------------------

You can run the spork utility from the command line using node.

  Usage: tispork [options] [command]

  Commands:

    icons <project-dir>
Generate from a master icon, appicon.png, program icons for all platforms. 

    splashes <project-dir>
Generate from two master splash screens, Portrait.png and Landscape.png, splash screens for the specified platforms.
    
    assets <project-dir> <assets-folder>
Generate multiple resolutions of assets from high res assets. Assumes your assets are all in the <project-dir>/images/<asset-folder>.

    backgrounds [options] <project-dir>,<bkgnd-folder>
Traverse the <project-dir>/images/<bkgnd-folder> directory and generate cropped and scaled background images appropriate to  devices. Images should be suffixed with -Portrait or -Landscape.

  Options:

    -h, --help       output usage information
    -V, --version    output the version number
    -a, --android    Generate Android assets
    -i, --ios        Generate iOS (iPhone/iPad) assets
    -m, --mobileweb  Generate mobile web (HTML5) assets
    -d, --debug      For debugging, output all commands to the console.
    
    -w, --width <n>  For assets command only, width in pixels of the smallest size of the image.
    -3, --three      For assets command and Android only, generate image at scale 3 in the 3:4:6:8 ratio, where 8 is the original size
    -4, --four       For assets command and Android only, generate image at scale 4 in the 3:4:6:8 ratio, where 8 is the original size
    -6, --six        For assets command and Android only, generate image at scale 6 in the 3:4:6:8 ratio, where 8 is the original size
    -8, --eight      For assets command and Android only, generate image at scale 8 in the 3:4:6:8 ratio, where 8 is the original size
    -r, --retina     For assets command and iOS only, source image is considered to be for retina display @2x, generate 50% scaled version. Similar to 4:8 in the 3:4:6:8 Android ratio.
    --all            For assets command, generate assets for all sizes for the specified platforms
    
Included in the install are three PSD files that have guides and layers that display how clipping is to occur so that you can position your logo and other assets correctly.

Using Backgrounds
-----------------
Part of the problem that Spork is trying to solve is to ensure that you have a consistent naming scheme for backgrounds. These are images that are used for the background of various windows and views in your app. The naming convention for those backgrounds is:

	<name>[-Portrait | -Landscape][-Phone | -Tablet].png

Typically you'll want to choose the right background based on the resolution, form factor, and the orientation of the device. Titanium and/or the OS handles the resolution automatically. For orientation, you will need to hook into the Ti.Gesture event queue to catch `orientationchange` events.

Here's a code snippet for Alloy-based Ti applications that will handle both the form factor and orientation:

    function getBackgroundImage(name) {
        var orientation = Ti.Gesture.getOrientation();
        var isLandscape = (orientation == Ti.UI.LANDSCAPE_LEFT || 
        	orientation == Ti.UI.LANDSCAPE_RIGHT);
        
        name = '/images/backgrounds/' + name;        
        name += (isLandscape ? '-Landscape' : '-Portrait');
        if (OS_IOS) {
            name += (Alloy.isTablet ? '-Tablet' : '-Phone');
        }
    
        return name + '.png';
    }
    
    // Set background image and hook orientation change event.
	$.index.backgroundImage = getBackgroundImage('MyBackground');
	Ti.Gesture.addEventListener('orientationchange', 
		function IndexOrientationChange(e) {
    		$.index.backgroundImage = getBackgroundImage('Mars');
	});

This would be something similar for regular Ti applications but you would need to determine tablet vs handheld via code instead.


To Do
-----
- Need to handle variable appicon sizes for Android

Credits
-------

Main sporker: Carl Orthlieb

Many thanks to the node community, the commander.js folks, and suggestions from Chris Barber, Rick Blalock, and the rest of the Appcelerator team.

Legal
------

Spork is developed by Appcelerator and the community and is Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
Alloy is made available under the Apache Public License, version 2.  See the [LICENSE](https://github.com/appcelerator/alloy/blob/master/LICENSE) file for more information.

