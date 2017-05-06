import React, { Component } from "react";
import { connect } from "react-redux";
import * as Three from "three";
import { ellipticParaboloid } from "./utils/elliptic_paraboloid";
import { levelSurface, projectionIntersection } from "./utils/level_surface";

const OrbitControls = require("three-orbit-controls")(Three);
const WindowResize = require('three-window-resize');

class CoordinateAxes extends Component {
    scene = new Three.Scene;
    controls = undefined;
    renderer = undefined;
    camera = undefined;

    constructor() {
        super();
    }

    componentDidMount() {
        this.createScene();
    }

    componentDidUpdate() {
        this.createScene();
    }

    createScene = () => {
        const { a, b, c, projection } = this.props.coordinateAxes;

        this.setCamera();
        this.getLight();
        this.coordinateAxes();
        this.addFigure(ellipticParaboloid(a, b), "ellipticParaboloid");
        if (c) {
            this.addFigure(levelSurface(a, b, c), "levelSurface");
        }
        if (projection) {
            const heightC = c;

            this.addFigure(projectionIntersection(a, b, heightC), "projectionIntersection");
        }
        this.reproduce();
        this.animate();
    }

    coordinateAxes = () => {
        const lineGeometryFirst = new Three.Geometry();
        const lineGeometrySecond = new Three.Geometry();
        const lineGeometryThird = new Three.Geometry();
        const pointZero = new Three.Vector3(0, 0, 0);
        const pointX = new Three.Vector3(100, 0, 0);
        const pointY = new Three.Vector3(0, 100, 0);
        const pointZ = new Three.Vector3(0, 0, 100);
        const arrowX = {
            left: new Three.Vector3(95, -5, 0),
            right: new Three.Vector3(95, 5, 0),
        };
        const arrowY = {
            left: new Three.Vector3(-5, 95, 0),
            right: new Three.Vector3(5, 95, 0),
        };
        const arrowZ = {
            left: new Three.Vector3(0, -5, 95),
            right: new Three.Vector3(0, 5, 95),
        };

        lineGeometryFirst.vertices.push(pointZero, pointX, arrowX.left, pointX, arrowX.right);
        lineGeometrySecond.vertices.push(pointZero, pointY, arrowY.left, pointY, arrowY.right);
        lineGeometryThird.vertices.push(pointZero, pointZ, arrowZ.left, pointZ, arrowZ.right);

        const axisX = new Three.Line( lineGeometryFirst, new Three.LineBasicMaterial({ color: 0xffffff, linewidth: 500 }));
        axisX.name = 'axisX';
        const axisY = new Three.Line( lineGeometrySecond, new Three.LineBasicMaterial({ color: 0x00FF00, linewidth: 500 }));
        axisY.name = 'axisY';
        const axisZ = new Three.Line( lineGeometryThird, new Three.LineBasicMaterial({ color: 0xFFFF00, linewidth: 500 }));
        axisZ.name = 'axisZ';


        this.cleanScene('axisX');
        this.cleanScene('axisY');
        this.cleanScene('axisZ');
        this.scene.add(axisX);
        this.scene.add(axisY);
        this.scene.add(axisZ);
    }

    reproduce = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer = new Three.WebGLRenderer({ canvas: this.canvas });
        this.camera = this.setCamera(width, height);

        this.renderer.setSize(width, height);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.renderScene();
        this.windowResize();
    }

    renderScene = () => {
        this.renderer.render(this.scene, this.camera);
    }

    windowResize = () => {
        new WindowResize(this.renderer, this.camera);
    }

    setCamera = (width, height) => {
        const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);

        camera.position.set(120, 50, 300);

        return camera;
    }

    getLight = () => {
        const light = new Three.AmbientLight(0xffffff);

        this.scene.add(light);
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.controls.update();
        this.renderScene();
    }

    addFigure = (figure, name) => {
        this.cleanScene(name);
        figure.name = name;
        this.scene.add(figure);
    }

    cleanScene = (name) => {
        const selectedObject = this.scene.getObjectByName(name);

        this.scene.remove( selectedObject );
    }

    render() {
        return <canvas ref={canvas => this.canvas = canvas} />;
    }
}

CoordinateAxes.defaultProps = {
    a: 0,
    b: 0,
    c: 0
}

const mapStateToProps = ({ coordinateAxes }) => ({ coordinateAxes });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CoordinateAxes);
