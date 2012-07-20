Spork
=====

Spork is a utility by [Appcelerator](http://www.appcelerator.com) for generating images in a variety of sizes for [Titanium](http://www.appcelerator.com/platform).

It provides convenient ways of generating application icons, splash screens, and images for things like buttons at a variety of sizes and resolutions to accomodate
different platforms (iOS, Android, Mobile Web) from single sources. 

Note that Spork depends on having an install of the amazing utility [ImageMagick](http://www.imagemagick.org) and, in particular, the convert command line utility.

Current Status
--------------

*July 20, 2012* - _Unstable_

Installation
-------------

Spork is available as a Node.JS NPM module by running the following command:

	[sudo] npm install -g tispork

Local Installation
------------------

To install your own local copy (with executable), clone this repository, navigate to the top level directory, and install via:

	[sudo] npm install -g .	

Running Spork fromt the command line
------------------------------------

You can run the spork utility from the command line using node.

  Usage: tispork [options] [command]

  Commands:

    icons <project-dir>
    Generate from a master icon, appicon.png, program icons for all platforms.
    
    splashes <project-dir>
    Generate from two master splash screens, Portrait.png and Landscape.png, splash screens for the specified platforms.
    
    assets <project-dir> <assets-folder>
    Generate multiple resolutions of assets from high res assets. Assumes your assets are all in the <project-dir>/images/<asset-folder>.

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
    -r, --retina     For assets command and iOS only, source image is considered to be for retina display @2x, generate 50% scaled version. Similar to 4:8 in the 
3:4:6:8 Android ratio.
    --all            For assets command, generate assets for all sizes for the specified platforms
    
  Included in the install are three PSD files that have guides and layers that display how clipping is to occur so that you can position your logo and other assets correctly.

To Do
-----
- Need to handle variable appicon sizes for Android

Credits
-------

Legal
------

Alloy is developed by Appcelerator and the community and is Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
Alloy is made available under the Apache Public License, version 2.  See the [LICENSE](https://github.com/appcelerator/alloy/blob/master/LICENSE) file for more information.

