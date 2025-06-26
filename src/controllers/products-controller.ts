import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { knex } from "@/database/knex"
import { AppError } from "@/utils/AppError";

class ProductsController {
    async index(request: Request, response: Response, next: NextFunction) {
        try {
            const { name } = request.query;

            const products = await knex<productRepository>("products")
                .select()
                .whereLike("name", `%${name ?? ""}%`)
                .orderBy("name");
            return response.json(products)
        } catch (error) {
            next(error);
        }
    }

    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                name: z.string().trim().min(6),
                price: z.number().gt(0),
            });

            const { name, price } = bodySchema.parse(request.body);
            await knex<productRepository>("products").insert({ name, price });

            return response.status(201).json();
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const id = z.string()
                .transform((value) => Number(value))
                .refine((value) => !isNaN(value), { message: "Id must be a number" })
                .parse(request.params.id);

            const product = await knex<productRepository>("products")
                .select()
                .where({ id })
                .first();

            if (!product) {
                throw new AppError("Product not found");
            }

            const bodySchema = z.object({
                name: z.string().trim().min(2),
                price: z.number().gt(0),
            });

            const { name, price } = bodySchema.parse(request.body);

            await knex<productRepository>("products").update({ name, price, updated_at: knex.fn.now() }).where({ id })

            return response.json();
        } catch (error) {
            next(error);
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            const id = z
                .string()
                .transform((value) => Number(value))
                .refine((value) => !isNaN(value), { message: "Id must be a number" })
                .parse(request.params.id);

            const product = await knex<productRepository>("products")
                .select()
                .where({ id })
                .first();

            if (!product) {
                throw new AppError("Product not found");
            }

            await knex<productRepository>("products").delete().where({ id });

            return response.json();
        } catch (error) {
            next(error);
        }
    }
}

export { ProductsController }