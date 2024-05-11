import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";

describe("Integration Test (Sequelize) - Create Product Use Case", () => {
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

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input = {
            name: "Shampoo",
            price: 100,
        };

        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });
    });

    it("should thrown an error when name is missing", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input = {
            name: "",
            price: 100,
        };

        await expect(usecase.execute(input)).rejects.toThrow(
            "Name is required"
        );
    });

    it("should throw an error when price is less than zero", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input = {
            name: "Shampoo",
            price: -1,
        };

        await expect(usecase.execute(input)).rejects.toThrow(
            "Price must be greater than zero"
        );
    });

});