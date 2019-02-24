# React-Redux chat app with WS and Mongoose as the backend

Currently running at http://react-chat-front.herokuapp.com/

<hr/>

## Prerequisites

To run this project you must first have installed mongodb and get it running, you can follow the instructions for your operating system [here](https://docs.mongodb.com/manual/installation/)

<hr/>

## Steps to run this project:

### CLIENT
1. Change directory to /client
2. Run `npm i` command
3. Create a new file named `.env.js`, following instructions of the example file `example.env.js`
4. Run `npm start` command to serve the front end or `npm run dev` for hot module reloading during development

### SERVER
1. Change directory to /server
2. Run `npm i` command
3. Create a new file named `.env` and the enviroments settings, following the instructions of the example file `example.env`
4. Run `npm start` command to start the server or `npm run dev` to use nodemon for file reloading during development


<hr/>

## Features Implemented

This application is a showcase of using websockets along side 
redux to send actions from the server to the client and most of the work was put on the router used by the server to send actions `server/src/lib/socketApp`

Some notable features of the router are 

* Middleware
* Routing 

The main implemented features for the **React Chat App** are : 

* Notifications
* Login/Register System using `jwt`
* Friend System (Invite, Accept - Reject, Delete)
* Conversations (Create a new one with a friend and invite other people to join)
