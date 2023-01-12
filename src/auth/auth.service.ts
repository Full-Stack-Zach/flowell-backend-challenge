import { Injectable, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto'
import { HashService } from './hash.service';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.hashService.comparePassword(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserDocument) {
    try {
      const payload = { username: user.email, sub: user._id };
      return {
        token: this.jwtService.sign(payload),
      };
    } catch(err){
      console.log(err)
      throw new InternalServerErrorException
    }
  }

  async register(createUserDto: CreateUserDto) {

      if (!createUserDto.email || !createUserDto.password){
        throw new BadRequestException
      }

      if (createUserDto.password.length < 8){
        throw new BadRequestException
      }

      const existingEmail = await this.usersService.findByEmail(createUserDto.email)
      const existingUsername = await this.usersService.findByUsername(createUserDto.username)

      if (existingEmail || existingUsername) {
        throw new ConflictException
      }

      try {

        const hashedPassword = await this.hashService.hashPassword(createUserDto.password);
      
        await this.usersService.create({
          email: createUserDto.email,
          username: createUserDto.username,
          password: hashedPassword
        })

        return {message: "User created successfully"}

      } catch (err){
        console.log(err)
        throw new InternalServerErrorException
      }
  }
}