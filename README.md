Spork
=====

Spork is a utility by [Appcelerator](http://www.appcelerator.com) for generating images in a variety of sizes for [Titanium](http://www.appcelerator.com/platform).

It provides convenient ways of generating application icons, splash screens, and images for things like buttons at a variety of sizes and resolutions to accomodate
different platforms (iOS, Android, Mobile Web) from single sources. 

Note that Spork depends on having an install of the amazing utility [ImageMagick](http://www.imagemagick.org) and, in particular, the convert command line utility.

Current Status
--------------

*July 16, 2012* - _Unstable_

Installation
-------------

Spork is available as a Node.JS NPM module by running the following command:

	[sudo] npm install -g spork

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
    Generate low res assets from high res assets. Assumes your assets are all in the <project-dir>/images/<asset-folder>. Generates to your <project-dir>/Resources/images/<assets-folder> a total of --copies of your images, each one a scaled down multiple of the original.

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -a, --android          Generate Android assets
    -i, --ios              Generate iOS (iPhone/iPad) assets
    -m, --mobileweb        Generate mobile web (HTML5) assets
    -all                   Generate assets for all platforms
    -d, --debug            For debugging, output all commands to the console.
    -s, --suffix [string]  For assets command only, suffix to append to processed images. Smallest image has no suffix and each successive higher rez copy has the suffix appended to the file name. [@2x]
    -w, --width <n>        For assets command only, width in pixels of the smallest size of the image.
    -c, --copies [number]  For assets command only, 1 = single copy, 2 = two copies (second 2x larger), 3 = 3 copies (second 2x, third 4x larger) [3]

To Do
-----
- Need to think more about the assets command and use of images on the Android platform

Credits
-------

Legal
------

Alloy is developed by Appcelerator and the community and is Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
Alloy is made available under the Apache Public License, version 2.  See the [LICENSE](https://github.com/appcelerator/alloy/blob/master/LICENSE) file for more information.

