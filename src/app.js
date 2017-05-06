import React from "react";

import { Toolbar } from "./components";

const App = ({ children }) => (
    <div>
        <Toolbar />
        {children}
    </div>
);

export default App;
