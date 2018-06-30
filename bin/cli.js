#!/usr/bin/env node
var fs = require('fs')
var path = require('path')
var console2file = require('console2file').default
var os_service = require('os-service')
var sudo = require('sudo-prompt')
var isElevated = require('is-elevated')
var hypergit = require('hypergit')
var envpaths = require('env-paths')('hypergit')
var commandJoin = require('command-join')
var minimisted = require('minimisted')

var usage = `
USAGE: hypergit-service [--version] [command] [--help]

Commands:
  install       Install an OS service (Windows and Linux supported) that starts hypergit seed on boot

  remove        Uninstall that OS service

  logdir        Print out the directory where the hyperdbs and log file are saved

  seed          (Not meant to be run directly)
                The wrapper around hypergit seed that is invoked by the OS service manager

`

function logresult (status) {
  return function (error) {
    if (error) {
      console.log(error)
    } else {
      console.log(status)
    }
  }
}

function logoutput (err, stdout, stderr) {
  if (err) {
    console.log(err)
  } else {
    if (stderr) {
      console.log(stderr)
    }
    console.log(stdout)
  }
}

function rerunAsAdmin () {
  sudo.exec(commandJoin(process.argv), {}, logoutput)
}

function main ({_: [command]}) {
  switch (command) {
    case 'install':
      isElevated().then(function (elevated) {
        if (elevated) {
          os_service.add("hypergit-service", { programArgs: ["seed"] }, logresult('installed'))
        } else {
          rerunAsAdmin()
        }
      })
      break
    case 'remove':
      isElevated().then(function (elevated) {
        if (elevated) {
          os_service.remove("hypergit-service", logresult('removed'))
        } else {
          rerunAsAdmin()
        }
      })
      break
    case 'seed':
      // I'm using the callback versions because they let us conveniently ignore errors.
      fs.mkdir(envpaths.log, () => {
        fs.unlink(path.join(envpaths.log, 'log.txt'), () => {
          console2file({
            filePath: path.join(envpaths.log, 'log.txt'),
            timestamp: true,
            fileOnly: false
          })
          console.log('Running with CLI arguments: ' + commandJoin(process.argv))
          os_service.run(() => os_service.stop())
          // seed ALL repos
          hypergit.seed()
        })
      })
      break
    case 'logdir':
      console.log(envpaths.log)
      break
    default:
      console.log(usage)
      break
  }
}

minimisted(main)
