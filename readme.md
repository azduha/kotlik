# Kotlik

Kotlik is a simple API for CTF games (sifrovacky). It is written to be a modular state-machine based API, which can be easily extended and modified.

## Setup

You can install the package using `npm install kotlik` command.

## Usage

To use Kotlik, you need to call the `createServer` function and pass the configuration object to it. The configuration object should contain the following properties:

-   `port`: The port on which the server should listen
-   `sql`: MySQL configuration object (`host`, `user`, `password`, `database`, `port`)
-   `handlers`: Message handlers definition
-   `dashboard`: Dashboard configuration object (`password`)
-   `onCreated`: Function that is called when the server is created
-   `defaultTeamState`: Default team state object
-   `defaultAppState`: Default app state object
-   `additionalAdminInfo`: Additional information sent to the admin dashboard

## Handlers

Handlers are the core of the Kotlik API. They are used to define the behavior of the server. The handlers are defined in the `handlers` property of the configuration object. The `handlers` property should be an object, where the keys are the messages the server should react to and the values are the handler functions. The keys must be in lowercase and without spaces or diactitics. The function takes the following parameters:

-   `state` - The current team state
-   `modules` - Server modules for handling different actions
-   `server` - object containing access to the MySql database and the http server

The function should return a promise that resolves to the new state of the team.

## Modules

Modules provide functionality on top of the core server behavior. Currently, the following modules are available:

-   `scheduler` - Handling scheduled events
-   `messenger` - Sending messages to the teams
-   `events` - Storing checkpoint times
-   `state` - Handling the app state sent to the players

## Example

A simple example can be found in the `example` directory.
