import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-images.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: 'd078b615-2ede-4ca8-b20a-560d899c414e',
        description: 'This is the id of the product',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;



    @ApiProperty({
        example: 'T-shirt teslo',
        description: 'This is the name of the product',
        uniqueItems: true
    })
    @Column('text', { unique: true })
    title: string;



    @ApiProperty({
        example: 20.00,
        description: 'This is the price of the product',
        uniqueItems: true
    })
    @Column('float', { default: 0 })
    price: number;

    @ApiProperty({
        example: 'This is a t-shirt from teslo',
        description: 'This is the description of the product',
        uniqueItems: true
    })
    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiProperty({
        example: 't-shirt_teslo',
        description: 'This is the slug of the product',
        uniqueItems: true
    })
    @Column('text', { unique: true })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'This is the stock of the product',
        uniqueItems: true
    })
    @Column('int', { default: 0 })
    stock: number;

    @ApiProperty({
        example: ['S', 'M', 'L'],
        description: 'This is the size of the product',
        uniqueItems: true
    })
    @Column('text', { array: true })
    sizes: string[];

    @ApiProperty({
        example: 'Female',
        description: 'This is the gender of the product',
        uniqueItems: true
    })
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text', { array: true, default: [] })
    tags: string[];

    @ApiProperty({
        example: 'https://www.google.com',
        description: 'This is the link of the product',
        uniqueItems: true
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];


    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User;


    @BeforeInsert()
    checkSlug() {
        if (!this.slug) {
            this.slug = this.title;
        }
        this.slug = this.title.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }
}
