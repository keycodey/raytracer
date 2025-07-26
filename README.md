# Ray tracer written in JavaScript

This web application has a built-in ray tracer, and a UI that showcases some of the ray tracer's features. Pretty much all the mathy bits of the ray tracer were developed in a test-driven way, and the user interface is mostly React with Material UI components.

Links to the documentation for the key resources that were used:

- [The Ray Tracer Challenge](https://pragprog.com/titles/jbtracer/the-ray-tracer-challenge/) book by Jamis Buck (what a great book, massive thanks!)
- [Jest](https://jestjs.io/)
- [React](https://react.dev/)
- [Material UI](https://mui.com/material-ui/getting-started/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
- [Vite](https://vite.dev/)

## The how-to stuff

### Install dependencies

First, in the root folder (the one with package.json in it) run:

```bash
npm install
```

### Run tests

The tests that formed the foundation for developing the ray tracer can be executed all at once:

```bash
npm test
```

Please, refer to the Jest documentation to see how to run individual tests, create coverage reports, etc.

### Start developing

Oh yes, you got to have Node.js and npm installed on your workstation. Then, to get cracking, type:

```bash
npm run dev
```

## Miscellaneous info

### BrowserRouter vs HashRouter

Apparently, if published on GitHub pages an app like this works better with a HashRouter instead of a BrowserRouter. Hence, the hashtag '#' in the app's urls.

### Take it for a spin

A live demo is available at <https://keycodey.github.io/raytracer/>.
