import * as Three from "three";

const init = (c) => {
    return (u, v) => {
        const height = 300;
        const size = 1;

        u = u * height;
        v = v * height;

        const x = size * u - height / 2;
        const y = c;
        const z = size * v - height / 2;

        return new Three.Vector3(x, y, z);
    }
}

const intersection = (a, b, c, heightC) => {
    return (u, v) => {
        const height = heightC || c;
        const size = 5;

        u = u * height;
        v = 2 * v * Math.PI;

        const x = a * size * Math.sqrt(u) * Math.cos(v);
        const y = c;
        const z = b * size * Math.sqrt(u) * Math.sin(v);

        return new Three.Vector3(x, y, z);
    }
}
const geometry = new Three.Geometry();
const intersection2 = (a, b, c, heightC) => {
    return (u, v) => {
        const height = heightC || c;
        const size = 5;

        u = u * height;
        v = 2 * v * Math.PI;

        const x = a * size * Math.sqrt(u) * Math.cos(v);
        const y = c;
        const z = b * size * Math.sqrt(u) * Math.sin(v);

        geometry.vertices.push(new Three.Vector3(x, y, z));

        return new Three.Vector3(x, y, z);
    }
}

export const projectionIntersection = (a, b, heightC) => {
    const geom = new Three.ParametricGeometry(intersection2(a, b, 1, heightC), 1, 25);
    const material = new Three.LineBasicMaterial({
        color: 'black'
    });
    const line = new Three.Line(geometry , material );
    const group = new Three.Group();

    group.add(line);

    // group.add(mesh);
    return group;
}

export const projectionIntersection2 = (a, b, heightC) => {
    const geom = new Three.ParametricGeometry(intersection(a, b, 1, heightC), 1, 25);
    const mat = new Three.MeshPhongMaterial({ color: 0x00FF00, wireframe: true });
    const mesh = new Three.Mesh(geom, mat);

    return mesh;
}
export const levelSurface = (a, b, c) => {
    const geom = new Three.ParametricGeometry(init(c), 100, 100);
    const math = new Three.MeshPhongMaterial({ color: 0x00ff0000, wireframe: true });
    const mesh = new Three.Mesh(geom, math);
    const geomIntersection = new Three.ParametricGeometry(intersection(a, b, c), 25, 25);
    const mathIntersection = new Three.MeshPhongMaterial({ color: 0x00FF00, wireframe: true });
    const meshIntersection = new Three.Mesh(geomIntersection, mathIntersection);
    const group = new Three.Group();

    group.add(mesh);
    group.add(meshIntersection);

    return group;
}

const planeF = () => {
    var planeGeom = new Three.PlaneGeometry(222, 222);
    planeGeom.rotateX(0);
    var plane = new Three.Mesh(planeGeom, new Three.MeshBasicMaterial({
      color: "lightgray",
      transparent: true,
      opacity: 0.75,
      side: Three.DoubleSide
    }));
    plane.position.y = 20;
    plane.rotation.x = Math.PI / 2;

    return plane;
}

const init333 = (a, b) => {
    return (u, v) => {
        const height = 100;
        const size = 5;

        u = u * height;
        v = 2 * v * Math.PI;

        const x = a * size * Math.sqrt(u) * Math.cos(v);
        const y = u;
        const z = b * size * Math.sqrt(u) * Math.sin(v);

        return new Three.Vector3(x, y, z);
    }
}


export const intersectionMain = () => {
    const group = new Three.Group();
    var planeGeom = new Three.PlaneGeometry(222, 222);
    planeGeom.rotateX(0);
    var plane = new Three.Mesh(planeGeom, new Three.MeshBasicMaterial({
      color: "lightgray",
      transparent: true,
      opacity: 0.75,
      side: Three.DoubleSide
    }));
    plane.position.y = 20;
    plane.rotation.x = Math.PI / 2;
    group.add(plane);

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

    const geom = new Three.ParametricGeometry(init333(2, 3), 25, 25);
    const mat = new Three.MeshPhongMaterial({ color: 0xcc3333a, wireframe: true });
    const obj = new Three.Mesh(geom, mat);

    group.add(obj);

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
        color: 0xffffff
      }));
      group.add(lines);
    }

    function setPointOfIntersection(line, plane) {
      pointOfIntersection = plane.intersectLine(line);
      if (pointOfIntersection) {
        pointsOfIntersection.vertices.push(pointOfIntersection.clone());
      };
    }

    drawIntersectionPoints();

    return group;

}