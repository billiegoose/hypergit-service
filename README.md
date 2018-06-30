# hypergit-service
Runs the hypergit seeder as a background OS service

**Only Windows and Linux supported.**
This package uses [`os-service`](https://npm.im/os-service) under the hood, so Mac support would need to be added to that package, not this one.

This will start the hypergit seeder on boot, so you don't have to run `hypergit seed` in a terminal somewhere everytime you want to share your hypergit repos.

## Installation

First, make sure you have [`hypergit`](https://npm.im/hypergit) installed globally.
(Or if not globally, somewhere that `hypergit-service` can still `require()` it as a peer-dependency.)

```
npm i -g hypergit
```

Next, install this package:

```
npm i -g hypergit-service
```

Finally, run the installer. It will prompt you for sudo/admin privileges.

```
hypergit-service install
```

## Uninstall

If you want to remove the service run:

```
hypergit-service remove
```

It will prompt you for sudo/admin privileges in order to remove it.

## View Log File

To confirm that the service is working, you can inspect the log file:

```
cd $(hypergit-service logdir)
cat log.txt
```

If the log file does not exist, you may need to tweak the OS service to make sure it is running as the currently logged in user and not as root/Administrator.
(I didn't figure out how to do that auto-magically.)

## License

Copyright 2018 William Hilton.
Licensed under the MIT License
