import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    //Luego de importar el modulo desde imports en el modulo seed.module.ts se inyecta el servicio deseado.
    private readonly ProductsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async runSeed() {

    await this.deleteTables();
    
    const adminUser = await this.insertUsers();


    await this.insertNewproducts(adminUser);
    return 'Seed Executed';
  }

  private async deleteTables() {
    await this.ProductsService.deleteAllproducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }


  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(seedUser => {
      users.push(this.userRepository.create(seedUser));

    });

    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async insertNewproducts(user: User) {
    await this.ProductsService.deleteAllproducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.ProductsService.create(product, user));
    })

    // con esta linea se espera que cada una de las promesas anteriores se resuelva
    await Promise.all(insertPromises);

    // en caso de querer un arreglo con los resultados de cada promesa se puede usar de la siguiente manera:
    // const results = await Promise.all(insertPromises);

    return true;
  }
}
