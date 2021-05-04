import React from 'react';
import noData from '../imgs/noData.png';

import DataService from '../api/data-service'

class ProductsList extends React.Component {
  constructor(props) {
    super(props)
    this.ds = new DataService();

    this.state = {
      showCart: false,
      searchString: '',
      products: [],
      originalProducts: []
    };

    this.handleInputChanges = this.handleInputChanges.bind(this);
    this.routeChange = this.routeChange.bind(this);
    this.resetCart = this.resetCart.bind(this);
  }

  /**
   * Whenever the component mounts, do the api call and get the 
   * products available for shopping 
  */
  componentDidMount() {
    this.getProductsList();
  }

  /**
   * Redirects the user to cart page where he can perform the buy operation
   */
  routeChange() {
    const products = this.state.products.filter((product) => { return product.addedCount > 0});
    this.ds.setUpdatedProducts(products);
    this.props.history.push('/cart');
  }

  /**
   * 
   * @param {*} event => Contains the input string and based on the length
   * filter is applied.
  */
  handleInputChanges(event) {
    this.setState({
      searchString: event.target.value.toLowerCase()

    }, () => {
      if (this.state.searchString.length >=3) {
        this.filterProducts();

      } else if (!this.state.searchString) {
        this.getProductsList();
      }
    });
  }

  /**
   * Filters the exisiting product list with the string enetred in the search bar
   * IMP => The filter functionality happes IF AND ONLY IF the string length is >= 3
   * If no results are found, png said no data is displayed. 
  */
  filterProducts() {
    let result = this.state.products.filter((product) => {
      if (
        product.title.toString().toLowerCase().indexOf(this.state.searchString) !== -1 ||
        product.category.toString().toLowerCase().indexOf(this.state.searchString) !== -1
      ) {
        return product
      }
    });

    this.setState({
      products: result
    });
  }

  /**
   * 1. This function retrieves the available products list for shopping
   * 2. If the list has been updaed i.e some item(s) and their quantities are modified,
   * this function compares the list and updates the quantity of the items.
  */
  getProductsList() {
    const result = this.ds.getProducts();

    let retrievedProducts = this.ds.getProductsList();
    console.log(retrievedProducts);

    if (result && result.length) {
      result.forEach((prod) => {
        retrievedProducts.filter((product) => {
          if (product.id === prod.id) {
            product.addedCount = prod.addedCount;
            product.remaningCount = prod.remaningCount;
            product.inventory = product.remaningCount;
          }
        });
      });

      this.setState({
        products: retrievedProducts,
      });

    } else {
      this.setState({
        products: retrievedProducts,
      });
    }
  }

  /**
   * 
   * @param {*} product => The product that has been modified
   * @param {*} index => The idndex of that product that is being modified
   * Logic added for modifiying the quantity for the the purchased and remaining against the 
   * inventory quantity present.
   * Is visible basically helps to toggle between the view and reset cart options.
  */
  addToCart(product, index) {
    let isVisible = false;
    if (!product.addedCount) {
      product.addedCount = 1;
      product.remaningCount = product.inventory - 1;
      isVisible = true;

    } else if (product.addedCount && product.addedCount < product.inventory) {
      product.addedCount = product.addedCount + 1;
      product.remaningCount = product.inventory - product.addedCount;
      isVisible = true;

    } else if (product.addedCount === product.inventory) {
      product.addedCount = product.inventory;
      product.remaningCount = 0;
      isVisible = true;

    } else {
      isVisible = false;
    }

    let products = this.state.products;
    products[index] = product;
    this.setState({
      products: products,
      showCart: isVisible
    });
  }

  /**
   * Function removes all the added quantity from the existing list and 
   * simultaneously updated the quantity of the inventory to initial state 
  */
  resetList() {
    let originalList = this.state.products;
    originalList.forEach((product) => {
      if (!product.addedCount) {
        product.inventory = product.inventory;

      } else if (product.addedCount && product.inventory === 0) {
        product.inventory = product.addedCount;
        delete product.addedCount;
        delete product.remaningCount;

      } else {
        product.inventory = product.addedCount + product.remaningCount;
        delete product.addedCount;
        delete product.remaningCount;
      }
    });

    this.setState({
      products: originalList
    });
  } 

  /**
   * Resets the cart and removes the updated products list 
  */
  resetCart() {
    this.ds.emptyProducts();
    this.resetList();
  }

  render() {
    return (
      <div>
        <div className="d-flex justify-content-center">
          <nav>
            <form>
              <input 
                className="form-control mr-sm-2" 
                type="search" 
                placeholder="Search Product"
                value={this.state.searchString}
                onChange={this.handleInputChanges}
              />
            </form>
          </nav>

          {
            this.state.showCart ?  
              <button 
                className="btn btn-outline-success my-sm-0 ml-2" 
                type="submit"
                onClick={this.routeChange}
              >
                View Cart
              </button>
            : 
            <button 
              className="btn btn-outline-success my-sm-0 ml-2" 
              type="submit"
              onClick={this.resetCart}
            >
              Reset Cart
            </button>
          }
        </div>

        <div className="d-flex">
          {
            this.state.products && this.state.products.length ? 
            <div className="container mt-2 border">
              <div className="row border-bottom font-weight-bold p-2">
                <div className="col-3">
                  Item Name
                </div>

                <div className="col-2">
                  Category
                </div>

                <div className="col-2">
                  Price
                </div>

                <div className="col-3">
                  Available Quantity
                </div>

                <div className="col-2"></div>
              </div>

              {
                this.state.products.map((product, index) => {
                  return (
                    <div 
                      key={index} 
                      className='row align-items-center border-bottom p-2'
                    >
                      <div className="col-3">
                        { product.title }
                      </div>

                      <div className="col-2">
                        { product.category }
                      </div>

                      <div className="col-2">
                        { product.price }
                      </div>

                      <div className="col-3">
                        { product.inventory }
                      </div>

                      <div className="col-2">
                        <button 
                          className="btn btn-outline-success my-sm-0 ml-2" 
                          type="submit"
                          onClick={() => {this.addToCart(product, index)}}
                          disabled={product.remaningCount === 0 ? true : false}
                        >
                          {product.remaningCount === 0 ? 'Sold Out' : 'Add to Cart'} 
                        </button>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            : ''
          }
        </div>

        <div className="d-flex justify-content-center mt-4">
          {
            this.state.products && !this.state.products.length && this.state.searchString ?
              <img 
                src={noData} 
                alt="No Data" 
              />
            : ''
          }
        </div>
      </div>
    )
  }
}

export default ProductsList;