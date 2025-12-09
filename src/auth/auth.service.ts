import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/database/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }
    

    async register(dto: RegisterDto) {
        const existing = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        })
        if (existing) {
            throw new BadRequestException('Email already exists');
        }
        const hash = await bcrypt.hash(dto.password, 10);
        
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                username: dto.email,
                password: hash,
                name: dto.name,
            }
        })
        return user;
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        })

        if (!user) {
            throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }

        const payload = { 
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        }

        const token = await this.jwtService.signAsync(payload);
        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
        }
    }
}

