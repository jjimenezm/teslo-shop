import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/index';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { RawHeaders, GetUser, Auth } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { JwtPayload, ValidRoles } from './interfaces';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
    ){
      return this.authService.checkAuthStatus( user)
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // @Req() request: Express.Request
    // @GetUser(['email', 'role', 'fullName']) user: User
    @GetUser() user: User,
    @GetUser(['email']) userEmail: String,

    @RawHeaders() headers: string[]
  ){
    // console.log({user: request.user});
    return {
      message: 'Esta es una ruta privada',
      user: user,
      userEmail,
      headers
    };
  }

  @Get('private2') 
  @RoleProtected( ValidRoles.admin, ValidRoles.superUser, ValidRoles.sac)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User,
    
  ){
    return {
      message: 'Esta es una ruta privada',
      user: user
    }; 
  }

  @Get('private3') 
  // @Auth( ValidRoles.admin)
  @Auth()
  privateRoute3(
    @GetUser() user: User,
    
  ){
    return {
      message: 'Esta es una ruta privada',
      user: user
    }; 
  }
} 
