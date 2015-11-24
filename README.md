# README #

This README will discuss what needs to be done to get a template project up and running with the MEAN stack.

### What is this repository for? ###

* Quick template for new projects to use the MEAN stack

### How do I get set up? ###

+ Install the following packages so that the latest versions are installed in your package.json
    * Delete the package.json file contents so that you can run the --save commands and get the latest versions.
    * npm install express --save 
    * npm install mongoose --save 
    * npm install body-parser --save
    * npm install winston --save
    * npm install path --save
+ To Run
    * npm start.  This will run with only one api endpoint responding.
* Database configurations will need to be setup.  Currently mongoose is commented out in the server.js file.