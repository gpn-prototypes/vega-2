*Containerized Build "System" with `.npmrc` rollout*

**Abstract**

The main goal is to use containerized build utilities as simple as native. 



Example:
- `yarn --version` is a native call
- `$YARN --version` is a containerized call


**Motivation**

The project requirements assume a few heterogeneous deployment environments(stages) with different package repositories. 
Which was lead us to
- use universal build system
- build components inside a one-off container
- generate `.npmrc` for a current build enviroment on the fly


**Explanation**

Under the hood of the variable `$YARN` was encapsulated a run of one-off container with `yarn` utility call inside them. 
Mechanism also propages some required resources from a host to one-off container. E.g. current execution directory mount, a list of env variables, etc.
So this allow to use containerized utility `$YARN` as simple as native `yarn` utility.


**Docker Container Image**

One-off container uses predefined docker image with already installed utilities. Docker image could be build as it required by the build system.


**And a one significant moment - `.npmrc` rollout**

- default `.npmrc` does't exist anymore, it was .gitignor'ed 
- `.npmrc` for a target build env will be generated
