import ProductCategoryEntity from "./ProductCategoryEntity";
import ProductDetailsEntity from "./ProductDetailsEntity";
import ProductOriginEntity from "./ProductOriginEntity";
import ProductTypeEntity from "./ProductTypeEntity";

export default class ProductEntity {

    /**
     * 
     * @param {Number} idProduct 
     * @param {Number} fkCategory 
     * @param {Number} fkDetails 
     * @param {String} name 
     * @param {String} description 
     * @param {Number} price 
     * @param {Number} stock 
     * @param {String} picture_path 
     * @param {ProductCategoryEntity} productCategoryByFkCategory 
     * @param {ProductDetailsEntity} productDetailsByFkDetails 
     * @param {Number} fkType 
     * @param {Number} fkOrigin 
     * @param {ProductTypeEntity} productTypeByFkType 
     * @param {ProductOriginEntity} productOriginByFkOrigin 
     */
    constructor(idProduct, fkCategory, fkDetails, name, description, price, stock, picture_path,
        productCategoryByFkCategory, productDetailsByFkDetails, fkType, fkOrigin, productTypeByFkType, productOriginByFkOrigin) {
            this.idProduct = idProduct;
            this.fkCategory = fkCategory;
            this.fkDetails = fkDetails;
            this.name = name;
            this.description = description;
            this.price = price;
            this.stock = stock;
            this.picture_path = picture_path;
            this.productCategoryByFkCategory = productCategoryByFkCategory;
            this.productDetailsByFkDetails = productDetailsByFkDetails;
            this.fkType = fkType;
            this.fkOrigin = fkOrigin;
            this.productTypeByFkType = productTypeByFkType;
            this.productOriginByFkOrigin = productOriginByFkOrigin;
        }
}