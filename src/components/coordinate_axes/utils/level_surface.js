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

export const projectionIntersection = (a, b, heightC) => {
    const geom = new Three.ParametricGeometry(intersection(a, b, 1, heightC), 25, 25);
    const math = new Three.MeshPhongMaterial({ color: 0x00FF00, wireframe: true });
    const mesh = new Three.Mesh(geom, math);

    return mesh;
}

export const levelSurface = (a, b, c) => {
    const geom = new Three.ParametricGeometry(init(c), 25, 25);
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