oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g alephium-cli
$ alephium-cli COMMAND
running command...
$ alephium-cli (--version)
alephium-cli/0.0.0 linux-x64 node-v18.3.0
$ alephium-cli --help [COMMAND]
USAGE
  $ alephium-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`alephium-cli hello PERSON`](#alephium-cli-hello-person)
* [`alephium-cli hello world`](#alephium-cli-hello-world)
* [`alephium-cli help [COMMAND]`](#alephium-cli-help-command)
* [`alephium-cli plugins`](#alephium-cli-plugins)
* [`alephium-cli plugins:install PLUGIN...`](#alephium-cli-pluginsinstall-plugin)
* [`alephium-cli plugins:inspect PLUGIN...`](#alephium-cli-pluginsinspect-plugin)
* [`alephium-cli plugins:install PLUGIN...`](#alephium-cli-pluginsinstall-plugin-1)
* [`alephium-cli plugins:link PLUGIN`](#alephium-cli-pluginslink-plugin)
* [`alephium-cli plugins:uninstall PLUGIN...`](#alephium-cli-pluginsuninstall-plugin)
* [`alephium-cli plugins:uninstall PLUGIN...`](#alephium-cli-pluginsuninstall-plugin-1)
* [`alephium-cli plugins:uninstall PLUGIN...`](#alephium-cli-pluginsuninstall-plugin-2)
* [`alephium-cli plugins update`](#alephium-cli-plugins-update)

## `alephium-cli hello PERSON`

Say hello

```
USAGE
  $ alephium-cli hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/h0ngcha0/alephium-cli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `alephium-cli hello world`

Say hello world

```
USAGE
  $ alephium-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `alephium-cli help [COMMAND]`

Display help for alephium-cli.

```
USAGE
  $ alephium-cli help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for alephium-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `alephium-cli plugins`

List installed plugins.

```
USAGE
  $ alephium-cli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ alephium-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `alephium-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ alephium-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ alephium-cli plugins add

EXAMPLES
  $ alephium-cli plugins:install myplugin 

  $ alephium-cli plugins:install https://github.com/someuser/someplugin

  $ alephium-cli plugins:install someuser/someplugin
```

## `alephium-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ alephium-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ alephium-cli plugins:inspect myplugin
```

## `alephium-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ alephium-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ alephium-cli plugins add

EXAMPLES
  $ alephium-cli plugins:install myplugin 

  $ alephium-cli plugins:install https://github.com/someuser/someplugin

  $ alephium-cli plugins:install someuser/someplugin
```

## `alephium-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ alephium-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ alephium-cli plugins:link myplugin
```

## `alephium-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ alephium-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ alephium-cli plugins unlink
  $ alephium-cli plugins remove
```

## `alephium-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ alephium-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ alephium-cli plugins unlink
  $ alephium-cli plugins remove
```

## `alephium-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ alephium-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ alephium-cli plugins unlink
  $ alephium-cli plugins remove
```

## `alephium-cli plugins update`

Update installed plugins.

```
USAGE
  $ alephium-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
