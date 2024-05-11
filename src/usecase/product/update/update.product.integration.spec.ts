import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import UpdateProductUseCase from "./update.product.usecase";

describe("Integration Test (Sequelize) - Update Product Use Case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const createUseCase = new CreateProductUseCase(productRepository);
        const updateUseCase = new UpdateProductUseCase(productRepository);

        const inputCreate = {
            name: "Shampoo",
            price: 100,
        };

        const createdProduct = await createUseCase.execute(inputCreate);

        const inputUpdate = {
            id: createdProduct.id,
            name: "Shampoo 2",
            price: 200,
        };

        const updatedProduct = await updateUseCase.execute(inputUpdate);

        expect(updatedProduct).toEqual({
            id: createdProduct.id,
            name: inputUpdate.name,
            price: inputUpdate.price,
        });
    });
    
    it("should thrown an error when name is missing", async () => {
        const productRepository = new ProductRepository();
        const createUseCase = new CreateProductUseCase(productRepository);
        const usecase = new UpdateProductUseCase(productRepository);

        const inputCreate = {
            name: "Shampoo",
            price: 100,
        };

        const createdProduct = await createUseCase.execute(inputCreate);

        const inputUpdate = {
            id: createdProduct.id,
            name: "",
            price: 100,
        };

        await expect(usecase.execute(inputUpdate)).rejects.toThrow(
            "Name is required"
        );
    });

    
    it("should throw an error when price is less than zero", async () => {
        const productRepository = new ProductRepository();
        const createUseCase = new CreateProductUseCase(productRepository);
        const usecase = new UpdateProductUseCase(productRepository);

        const inputCreate = {
            name: "Shampoo",
            price: 100,
        };

        const createdProduct = await createUseCase.execute(inputCreate);

        const inputUpdate = {
            id: createdProduct.id,
            name: "Shampoo",
            price: -1,
        };

        await expect(usecase.execute(inputUpdate)).rejects.toThrow(
            "Price must be greater than zero"
        );
    });

    it("should throw an error when product is not found", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const input = {
            id: "1",
            name: "Shampoo",
            price: 100,
        };

        await expect(usecase.execute(input)).rejects.toThrow(
            "Product not found"
        );
    });
    
});