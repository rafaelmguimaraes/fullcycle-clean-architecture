import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";

const product = new Product("123", "Product 1", 10);

const input = {
    id: "123",
    name: "Product 1 Updated",
    price: 20,
};

const MockRepository = () => {
    return {
      create: jest.fn(),
      findAll: jest.fn(),
      find: jest.fn().mockReturnValue(Promise.resolve(product)),
      update: jest.fn(),
    };
  };

describe("Unit test update product use case", () => {
    it("should update a product", async () => {
        const productRepository = MockRepository();
        const updateProductUseCase = new UpdateProductUseCase(productRepository);

        const output = await updateProductUseCase.execute(input);

        expect(output).toEqual(input);
    });
});