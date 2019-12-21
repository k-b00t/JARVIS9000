# Jarvis9000

Jarvis9000 is a home automation application for controlling ESP8266 devices, (compatibility with other devices will be added soon).
The app allows you to set the role of admin and user to restrict the managment of users, groups and devices.
You can create new groups (roms) to add devices, for remote control and task automation.

![](https://github.com/k-b00t/99-final-project/blob/master/screenshoot/screenshoot.png)

## How to use:

To be able to use it is your environment, it is necessary to change the enpoint of both front-end and back-end servers.
- Install node and npm on the server
- In 'angular/src/app/services/data.services.ts' you have to change the endpoint for your domain.
- In 'front-end/app.js' you have to change the endpoint for your domain.
- Inside the angular folder: ng build --prod
- The files generated in 'angular/dist', must be copied in 'front-end/public/'
- Deploy front-end and back-end folders in your server
- Finally in the back-end folder and in front-end (both) launch the command npm i


## Stack:

- HTML5
- CSS3
- Javascript
- Typescript
- Angular
- Bootstrap
- MongoDB & Mongoose
- NodeJS


## Working in progres:

- Add compatibility with other devices
- Add macros to create more commands
- Add logs and log viewAdd logs and log view
- Make more direct routes
- Change the view style
- Add graphics for stats


## Copyright y license

[The license is GLP type, you can check it here](https://github.com/k-b00t/99-final-project/blob/master/License.txt)