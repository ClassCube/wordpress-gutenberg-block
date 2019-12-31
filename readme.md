# MathJax Gutenberg Block

> This plugin is new and is still undergoing testing. Feel free to use it. We are. But there may be a few bugs pop up from time to time. 

Gutenberg block for WordPress that allows you to embed an image created by MathJax.

Yes, these exist but they all use the MathJax JavaScript library on client side. The goal for this is to allow you to easily create equations in posts and have them displayed as static images client side so you don't have to load the MathJax JavaScript library for your visitors. 

## Why?

There are several [MathJax plugins for WordPress]( https://wordpress.org/plugins/tags/mathjax/ ), and it's pretty easy to manually add MathJax to a theme if you don't want to use a plugin. So why another?

I really like to keep web pages as lean as possible and not load any extraneous JavaScript, especially when it's not needed. Most plugins load the MathJax scripts for every page. Not all do, but even loading it only on pages that include MathJax blocks adds overhead to the page. 

On another site I started creating images from MathJax and using those images instead. It cut the MathJax JavaScript out of the client side and sped up page load, but was pretty tedious to do. Especially when I had to go back and fix mistakes.

It seemed like a perfect use case for a WordPress Gutenberg block. 

With the block in your post you'll be able to type in MathJax like you normally would and, thanks to some help from this [CodPen]( https://codepen.io/pkra/pen/PZLyQO ), it'll save the image data with your post along with the MathJax. Client side, only the image data is used so no scripts need load.

## Requirements

It's a Gutenberg block, so you'll need to be using at least WordPress 5.0. If you're using an older version, stop reading and go upgrade. Even if you don't upgrade for this plugin, it's worth it for the security updates.

Since the image is sent as a Data URL visitors will need to be using at least IE9 or pretty much any other browser. IE8 will also work as long as the image is less than 32kb, which is should be.

## Installation

* Go to the releases page and download the most recent version
* Login to your WordPress site and click on Plugins > Add New
* Click on the `Upload Plugin` button towards the top of the page
* Click on `Choose File` to select the file you downloaded and then click on `Install Now`



## Bugs & Support

If you find a bug, please let us know about it in the [GitHub repo issues]( https://github.com/ClassCube/wordpress-mathjax-block/issues ) for this plugin. 

If you need help, you can reach out on our [support forums](https://classcube.com/forums/).

