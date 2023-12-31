import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

import eatableClient from "../services/eatable-client";
import { colors } from "../styles/colors";
import { removeProduct } from "../services/products-service";
import Button from "../components/Button/button";
import Delete from "../assets/images/delete-bin-fill.png";
import Edit from "../assets/images/edit-box-fill.png";
import DeleteProduct from "./delete-page";

const Container = styled.div`
  max-width: 1000px;
  margin: auto;
`;

const PageTitle = styled.h1`
  font-size: 1.375rem;
  font-weight: 600;
  color: ${colors.pallette.black};
  margin: 3rem 3rem 0rem;
  display: flex;
  justify-content: center;
`;

const CardsCointainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: auto;
  padding: 1.25rem;
`;

const FoodCard = styled.div`
  width: 9.75rem;
  background-color: ${colors.white};
  border-radius: 1.875rem;
  box-shadow: 0px 30px 60px 0px rgba(57, 57, 57, 0.1);
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 1px;
  margin: 0.81rem;
`;

const FoodPicture = styled.img`
  filter: drop-shadow(0px 20px 20px rgba(0, 0, 0, 0.2));
  width: 8.125rem;
  height: 8.125rem;
  border-radius: 8.125rem;
  margin: auto;
  top: -40;
  object-fit: cover;
  aspecr-ratio: 1/1;
`;

const FoodName = styled.p`
  color: ${colors.pallette.black};
  font-size: 1.375rem;
  font-weight: 600;
  display: flex;
  text-align: center;
  flex-direction: column;
`;

const FoodPrice = styled.p`
  color: ${colors.pallette.orange};
  font-size: 1.375rem;
  font-weight: 600;
  display: flex;
  text-align: center;
  flex-direction: column;
  padding: 0.5rem;
`;

const ButtonContainer = styled.div`
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0px;
  left: 0px;
  z-index: 9999;
  background-color: ${colors.pallette.lightGray};
`;

const LogoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 0px 10px 10px 10px;
`;

const DeleteModal = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: ${colors.pallette.black};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${colors.white};
  text-align: center;
  font-size: 1.125rem;
  font-weight: 600;
`;

function Products() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [productId, setProductId] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await eatableClient("/products");
        setData(response);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const capitalizeWords = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  function handleOpenDeleteModal(id) {
    setProductId(id);
    setIsOpen(true);
  }

  function handleCloseDelete() {
    setIsOpen(false);
  }

  async function handleDeleteProduct() {
    try {
      await removeProduct(productId);
      console.log(`Product with ID ${productId} deleted successfully.`);
      setData(data.filter((product) => product.productId !== productId));
      setIsOpen(false);
    } catch (error) {
      console.error(`Error deleting product with ID ${productId}:`, error);
    }
  }

  return (
    <Container>
      <PageTitle>Products Dashboard </PageTitle>

      {loading && <p>Loading data...</p>}

      {error && <p>Error: {error}</p>}

      {data && (
        <CardsCointainer>
          {data.map((product) => (
            <FoodCard key={product.id}>
              <Link to={`/products/${product.id}`}>
                <FoodPicture src={product.picture_url} />
              </Link>
              <FoodName>{capitalizeWords(product.name)}</FoodName>
              <FoodPrice>${product.price / 100}</FoodPrice>
              <LogoContainer>
                <Link to={`/edit/${product.id}`}>
                  <img src={Edit} style={{ cursor: "pointer" }} />
                </Link>
                <img
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenDeleteModal(product.id)}
                  src={Delete}
                />
              </LogoContainer>
            </FoodCard>
          ))}
        </CardsCointainer>
      )}
      <ButtonContainer>
        <StyledLink to="/create">
          <Button className="fixed" type="primary" isFullWidth>
            Create Product
          </Button>
        </StyledLink>
      </ButtonContainer>
      {isOpen ? (
        <DeleteModal>
          <DeleteProduct
            id={productId}
            onNoClick={handleCloseDelete}
            onYesClick={handleDeleteProduct}
          />
        </DeleteModal>
      ) : null}
    </Container>
  );
}

export default Products;
