import productList from './products.json';

/**
 * This entire class can be replaced with the REDUX operations, in later stage,
 * Because as the product list with increase it's not a good option to store in local storage.
 */
class DataService {
  /**
   * 
   * @param {*} products  Basically sets the updated products in the local storage,
   * this can later be replaced wwith the REDUX.
  */
  setUpdatedProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }

  /**
   * 
   * @returns The updates list of products that were stored while the user tried to add
   * the same in the cart
  */
  getProducts() {
    try {
      const products = JSON.parse(localStorage.getItem('products'))
      return products !== null ? products : [];

    } catch {
      return [];
    }
  }

  /***
   * It clears the local storage 
  */
  emptyProducts() {
    localStorage.clear();
  }

  /**
   * 
   * @returns  The original list of the products
  */
  getProductsList() {
    return productList;
  }
}

export default DataService;