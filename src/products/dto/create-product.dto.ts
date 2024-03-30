import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        example: 'T-shirt teslo',
        description: 'This is the name of the product',
        uniqueItems: true
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        example: 20.00,
        description: 'This is the price of the product',
        uniqueItems: true
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        example: 'This is a t-shirt from teslo',
        description: 'This is the description of the product',
        uniqueItems: true
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 't-shirt_teslo',
        description: 'This is the slug of the product'
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        example: 10,
        description: 'This is the stock of the product',
        uniqueItems: true
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;


    @ApiProperty({
        example: ['S', 'M', 'L'],
        description: 'This is the size of the product',
        uniqueItems: true
    
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty()
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
