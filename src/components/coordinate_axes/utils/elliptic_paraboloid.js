import * as Three from "three";

const init = (a, b) => {
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

export const ellipticParaboloid = (a, b) => {
    const geom = new Three.ParametricGeometry(init(a, b), 25, 25);
    const mat = new Three.MeshPhongMaterial({ color: 0xcc3333a, wireframe: true });
    const mesh = new Three.Mesh(geom, mat);

    return mesh;
}
