import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const Layout = React.lazy(() => import("./components/layout"));
const HomeP = React.lazy(() => import("./pages/HomeP"));
const CurrencyP = React.lazy(() => import("./pages/CurrencyP"));
const Transactions = React.lazy(() => import("./pages/Transactions"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeP />} />
          <Route path="currency" element={<CurrencyP />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
