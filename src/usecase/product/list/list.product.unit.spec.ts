import ProductsFactory from "../../../domain/product/factory/product.factory";
import ListProductsUseCase from "./list.product.usecase";

const products1 = ProductsFactory.create("a", "Products 1", 10);
const products2 = ProductsFactory.create("a", "Products 2", 20);

const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn().mockReturnValue(Promise.resolve([products1, products2])),
      create: jest.fn(),
      update: jest.fn(),
    };
  };

describe("Unit test list products use case", () => {
    it("should list all productss", async () => {
        const productsRepository = MockRepository();
        const listProductsUseCase = new ListProductsUseCase(productsRepository);

        const output = await listProductsUseCase.execute();

        expect(output.products.length).toEqual(2);
        expect(output.products[0].id).toEqual(products1.id);
        expect(output.products[0].name).toEqual(products1.name);
        expect(output.products[0].price).toEqual(products1.price);
        expect(output.products[1].id).toEqual(products2.id);
        expect(output.products[1].name).toEqual(products2.name);
        expect(output.products[1].price).toEqual(products2.price);
        
    });
});