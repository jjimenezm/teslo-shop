import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,

  ) { }

  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({ ...userData, password: bcrypt.hashSync(password, 10) });

      await this.userRepository.save(user);

      delete user.password;

      return {
        ...user, token: this.getJwtToken({ id: user.id })
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    });

    if (!user) throw new UnauthorizedException('Credenciales invalidas');
    const hash = user.password.replace(/^\$2y/i, '$2b');

    if (!bcrypt.compareSync(password, hash)) {
      throw new UnauthorizedException('Credenciales no coinciden');
    }else{
      if (user.password.startsWith('$2y')) {
        user.password = hash;
        await this.userRepository.save(user);
      }
    }

    return {
      ...user, token: this.getJwtToken({ id: user.id })
    };
  }

  async checkAuthStatus(user: User){
    return {
      ...user, token: this.getJwtToken({ id: user.id })
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  } 


  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Error en el servidor');
  }
}
