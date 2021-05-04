import React from 'react';
import DataService from '../api/data-service';

class Cart extends React.Component {
  constructor(props) {
    super(props)
    this.ds = new DataService();
    this.state = {
      products: [],
    }
  }

  /**
   * Retrieved the updated list of products 
  */
  componentDidMount() {
    const result = this.ds.getProducts();
    this.setState({
      products: result
    });
  }

  /**
   * 
   * @param {*} product => The product on with the update operation is held
   * @param {*} index => The index of the product to be modified
   * @param {*} event => Contains the value for the updated quantity
  */
  handleInputChange(product, index, event) {
    // If entered event is negative make it positive
    event.target.value = Math.abs(event.target.value)
    let result = this.state.products;

    // If the limit is alreaday exhausted for the exisiting product display alert for same
    if (event.target.value > product.inventory) {
      alert(
        `Caution!!\nCannot add more units as maximum available quantity for ${product.title} is ${product.inventory}!`
      );
    }

    // Whenever the input field is cleared set the addedCount to 0 and initialize inventory
    if (isNaN(event.target.value)) {
      product.addedCount = 0;
      product.remaningCount = product.inventory;
    }

    // Make update operations only if the target value is LESS EQUAL to inventory
    if (event.target.value <= product.inventory) {
      if (event.target.value) {
        product.addedCount = event.target.value;
        product.remaningCount = product.inventory - product.addedCount;
  
      } else {
        product.remaningCount = product.inventory - product.addedCount;
        product.addedCount = 1;
      }
      
      result[index] = product;
      this.setState({
        products: result,
      });
    }
  }

  // On buy click redirect the user to product list page
  handleClick() {
    this.ds.setUpdatedProducts(this.state.products);
    this.props.history.push("/");
  }

  render() {
    return (
      <div>
        <div className="d-flex">
          {
            this.state.products && this.state.products.length ? 
              <div className="container mt-2 border">
                <div className="row border-bottom font-weight-bold p-2">
                  <div className="col-4">
                    Item Name
                  </div>

                  <div className="col-4">
                    Price
                  </div>

                  <div className="col-4">
                    Available Quantity
                  </div>
                </div>

                {
                  this.state.products.map((product, index) => {
                    return (
                      <div 
                        key={index} 
                        className='row align-items-center border-bottom p-2'
                      >
                        <div className="col-4">
                          { product.title }
                        </div>

                        <div className="col-4">
                          { product.price }
                        </div>

                        <div className="col-4">
                          <input
                            type="number"
                            min="1"
                            className="form-control"
                            value={product.addedCount} 
                            onChange={(e) => this.handleInputChange(product, index, e)}
                          >
                          </input>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            : ''
          }
        </div>

        <div className="col-6 offset-3 mt-2">
          <button 
            type="button" 
            className="btn btn-outline-success btn-sm btn-block"
            onClick={() => this.handleClick()}
          >
            Buy
          </button>
        </div>
      </div>
    )
  }
}

export default Cart;