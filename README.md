# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses
  [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast
  Refresh

## babylonjs-hook example

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```jsx
import React from 'react'
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder } from '@babylonjs/core'
import SceneComponent from 'babylonjs-hook'
import './App.css'

let box

const onSceneReady = (scene) => {
    // This creates and positions a free camera (non-mesh)
    var camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero())

    const canvas = scene.getEngine().getRenderingCanvas()

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true)

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7

    // Our built-in 'box' shape.
    box = MeshBuilder.CreateBox('box', { size: 2 }, scene)

    // Move the box upward 1/2 its height
    box.position.y = 1

    // Our built-in 'ground' shape.
    MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene)
}

/** Will run on every frame render. We are spinning the box on y-axis. */
const onRender = (scene) => {
    if (box !== undefined) {
        var deltaTimeInMillis = scene.getEngine().getDeltaTime()

        const rpm = 10
        box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
    }
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
            </header>
        </div>
    )
}

export default App
```

```js
export default tseslint.config({
    extends: [
        // Remove ...tseslint.configs.recommended and replace with this
        ...tseslint.configs.recommendedTypeChecked,
        // Alternatively, use this for stricter rules
        ...tseslint.configs.strictTypeChecked,
        // Optionally, add this for stylistic rules
        ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
        // other options...
        parserOptions: {
            project: ['./tsconfig.node.json', './tsconfig.app.json'],
            tsconfigRootDir: import.meta.dirname,
        },
    },
})
```

You can also install
[eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and
[eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for
React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
    plugins: {
        // Add the react-x and react-dom plugins
        'react-x': reactX,
        'react-dom': reactDom,
    },
    rules: {
        // other rules...
        // Enable its recommended typescript rules
        ...reactX.configs['recommended-typescript'].rules,
        ...reactDom.configs.recommended.rules,
    },
})
```
