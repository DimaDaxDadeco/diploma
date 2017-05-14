import React, { Component } from "react";
import { connect } from "react-redux";
import * as Three from "three";
import { ellipticParaboloid } from "./utils/elliptic_paraboloid";
import {
    levelSurface,
    projectionIntersection,
    projectionIntersection2,
    intersectionMain
} from "./utils/level_surface";

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
            this.intersection();
            // this.addFigure(levelSurface(a, b, c), "levelSurface");
        }
        if (projection) {
            // this.addFigure(projectionIntersection2(a, b, heightC), "projectionIntersection2");
            // this.addFigure(projectionIntersection(a, b, heightC), "projectionIntersection");
            this.projection();
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

    intersection = () => {
        const group = new Three.Group();
        var planeGeom = new Three.PlaneGeometry(300, 300);
        planeGeom.rotateX(0);
        var plane = new Three.Mesh(planeGeom, new Three.MeshBasicMaterial({
          color: "lightgray",
          transparent: true,
          opacity: 0.75,
          side: Three.DoubleSide
        }));
        plane.position.y = this.props.coordinateAxes.c;
        plane.rotation.x = Math.PI / 2;
        group.add(plane);

        const obj = ellipticParaboloid(this.props.coordinateAxes.a, this.props.coordinateAxes.b);
        group.add(obj);

        var pointsOfIntersection = new Three.Geometry();

        var a = new Three.Vector3(),
          b = new Three.Vector3(),
          c = new Three.Vector3();
        var planePointA = new Three.Vector3(),
          planePointB = new Three.Vector3(),
          planePointC = new Three.Vector3();
        var lineAB = new Three.Line3(),
          lineBC = new Three.Line3(),
          lineCA = new Three.Line3();

        var pointOfIntersection = new Three.Vector3();

        this.addFigure(group, 'intersection');

        const drawIntersectionPoints = () => {
          var mathPlane = new Three.Plane();
          plane.localToWorld(planePointA.copy(plane.geometry.vertices[plane.geometry.faces[0].a]));
          plane.localToWorld(planePointB.copy(plane.geometry.vertices[plane.geometry.faces[0].b]));
          plane.localToWorld(planePointC.copy(plane.geometry.vertices[plane.geometry.faces[0].c]));
          mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC);

          obj.geometry.faces.forEach(function(face) {
            obj.localToWorld(a.copy(obj.geometry.vertices[face.a]));
            obj.localToWorld(b.copy(obj.geometry.vertices[face.b]));
            obj.localToWorld(c.copy(obj.geometry.vertices[face.c]));
            lineAB = new Three.Line3(a, b);
            lineBC = new Three.Line3(b, c);
            lineCA = new Three.Line3(c, a);
            setPointOfIntersection(lineAB, mathPlane);
            setPointOfIntersection(lineBC, mathPlane);
            setPointOfIntersection(lineCA, mathPlane);
          });

          var pointsMaterial = new Three.PointsMaterial({
            size: 3,
            color: 'blue'
          });
          var points = new Three.Points(pointsOfIntersection, pointsMaterial);
          group.add(points);

          var lines = new Three.LineSegments(pointsOfIntersection, new Three.LineBasicMaterial({
            color: 'red'
          }));
          group.add(lines);
          this.addFigure(group, 'intersection');
        }

        function setPointOfIntersection(line, plane) {
          pointOfIntersection = plane.intersectLine(line);
          if (pointOfIntersection) {
            pointsOfIntersection.vertices.push(pointOfIntersection.clone());
          };
        }

        setTimeout(drawIntersectionPoints, 0);
    }

    projection = () => {
        const group = new Three.Group();

        var planeGeom = new Three.PlaneGeometry(300, 300);
        planeGeom.rotateX(0);
        var plane = new Three.Mesh(planeGeom, new Three.MeshBasicMaterial({
          color: "lightgray",
          transparent: true,
          opacity: 0.75,
          side: Three.DoubleSide
        }));
        plane.position.y = this.props.coordinateAxes.c
        plane.rotation.x = Math.PI / 2;
        group.add(plane);

        //TODO пунктир start
        let num = this.props.coordinateAxes.c;
        const dottedPlanes = [];
        while (num--) {
            const dottedGeom = new Three.PlaneGeometry(70, 70);
            const dottedPlane = new Three.Mesh(dottedGeom, new Three.MeshBasicMaterial({
              color: 0xc0c0c0,
              transparent: true,
              opacity: 1,
              side: Three.DoubleSide
            }));

            dottedPlanes.push(dottedPlane);
            dottedPlanes[dottedPlanes.length - 1].position.y = Number(num);
            dottedPlanes[dottedPlanes.length - 1].rotation.x = Math.PI / 2;
        }
        group.add(...dottedPlanes);
        //TODO пунктир end

        //TODO основная плоскость XoY
        var planeGeom1 = new Three.PlaneGeometry(70, 70);
        var bottomPlane = new Three.Mesh(planeGeom1, new Three.MeshBasicMaterial({
          color: 0xc0c0c0,
          transparent: true,
          opacity: 0,
          side: Three.DoubleSide
        }));
        bottomPlane.position.y = 0;
        bottomPlane.rotation.x = Math.PI / 2;
        group.add(bottomPlane);

        const obj = ellipticParaboloid(this.props.coordinateAxes.a, this.props.coordinateAxes.b);

        group.add(obj);

        var pointsOfIntersection = new Three.Geometry();
        var projectionGeom = new Three.Geometry();

        var a = new Three.Vector3(),
          b = new Three.Vector3(),
          c = new Three.Vector3();
        var planePointA = new Three.Vector3(),
          planePointB = new Three.Vector3(),
          planePointC = new Three.Vector3();
        var lineAB = new Three.Line3(),
          lineBC = new Three.Line3(),
          lineCA = new Three.Line3();

        var pointOfIntersection = new Three.Vector3();

        var projectionPlaneNormal = new Three.Vector3(0, 1, 0);

        this.addFigure(group, 'projection');

        function getProjectMatrix(n) {
          var projectMatrix = new Three.Matrix3();
          projectMatrix.set(
            1 - Math.pow(n.x, 2), -1 * n.x * n.y, -1 * n.x * n.z, -1 * n.x * n.y, 1 - Math.pow(n.y, 2), -1 * n.y * n.z, -1 * n.x * n.z, -1 * n.y * n.z, 1 - Math.pow(n.z, 2)
          );
          return projectMatrix;
        }

        function applyProjectionMatrix() {
          var mathPlane = new Three.Plane();
          bottomPlane.localToWorld(planePointA.copy(bottomPlane.geometry.vertices[bottomPlane.geometry.faces[0].a]));
          bottomPlane.localToWorld(planePointB.copy(bottomPlane.geometry.vertices[bottomPlane.geometry.faces[0].b]));
          bottomPlane.localToWorld(planePointC.copy(bottomPlane.geometry.vertices[bottomPlane.geometry.faces[0].c]));
          mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC);
          const transformMatrix = getProjectMatrix(mathPlane.normal);
          for (var i = 0; i < pointsOfIntersection.vertices.length; i++) {
            projectionGeom.vertices[i] = new Three.Vector3().copy(pointsOfIntersection.vertices[i]).applyMatrix3(transformMatrix);
            projectionGeom.vertices[i].addScaledVector(mathPlane.normal, mathPlane.constant * -1);
          }
        }

        const drawIntersectionPoints = () => {
          var mathPlane = new Three.Plane();
          plane.localToWorld(planePointA.copy(plane.geometry.vertices[plane.geometry.faces[0].a]));
          plane.localToWorld(planePointB.copy(plane.geometry.vertices[plane.geometry.faces[0].b]));
          plane.localToWorld(planePointC.copy(plane.geometry.vertices[plane.geometry.faces[0].c]));
          mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC)

          obj.geometry.faces.forEach(function(face) {
            obj.localToWorld(a.copy(obj.geometry.vertices[face.a]));
            obj.localToWorld(b.copy(obj.geometry.vertices[face.b]));
            obj.localToWorld(c.copy(obj.geometry.vertices[face.c]));
            lineAB = new Three.Line3(a, b);
            lineBC = new Three.Line3(b, c);
            lineCA = new Three.Line3(c, a);
            setPointOfIntersection(lineAB, mathPlane);
            setPointOfIntersection(lineBC, mathPlane);
            setPointOfIntersection(lineCA, mathPlane);
          });

          applyProjectionMatrix();

            //TODO пунктир start
            let num = this.props.coordinateAxes.c;
            const dottedPoints = [];
            while (num--) {
                const pointsOfIntersectionClone = new Three.Geometry();
                const pointsMaterial = new Three.PointsMaterial({
                    size: 1,
                    color: 'blue'
                });
                for (let i = 0; i < pointsOfIntersection.vertices.length; i++) {
                    const vector = new Three.Vector3().copy(pointsOfIntersection.vertices[i]);

                    vector.y = vector.y - num;

                    pointsOfIntersectionClone.vertices[i] = vector;
                }

                const points = new Three.Points(pointsOfIntersectionClone, pointsMaterial);

                dottedPoints.push(points);
            }
            group.add(...dottedPoints);
            //TODO пунктир end

          var pointsMaterial = new Three.PointsMaterial({
            size: 3,
            color: 'blue'
          });
          var points = new Three.Points(pointsOfIntersection, pointsMaterial);
          group.add(points);

          var lines = new Three.LineSegments(pointsOfIntersection, new Three.LineBasicMaterial({
            color: 'red'
          }));
          group.add(lines);

          var projectionLines = new Three.LineSegments(projectionGeom, new Three.LineBasicMaterial({
            color: 'red'
          }));
          group.add(projectionLines);
          this.addFigure(group, 'projection');
        }

        function setPointOfIntersection(line, plane) {
          pointOfIntersection = plane.intersectLine(line);
          if (pointOfIntersection) {
            pointsOfIntersection.vertices.push(pointOfIntersection.clone());
          };
        }

        setTimeout(drawIntersectionPoints, 0);
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
