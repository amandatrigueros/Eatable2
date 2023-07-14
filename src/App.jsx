import { Routes, Route, Navigate } from "react-router";
import Products from "./pages/products-page";
import SingleProduct from "./pages/single-product-page";
import CreateProduct from "./pages/create-page";
import DeleteProduct from "./pages/delete-page";

function App() {
  return (
    
    <Routes>
    <Route path="/">
        <Route index element={<Navigate to="/products" />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<SingleProduct />} />
        <Route path="create" element={<CreateProduct />} />
      </Route>
    </Routes>
    )
  }

export default App;
