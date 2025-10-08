import { Test } from '@nestjs/testing';
import { RoleEnum, StatusEnum, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { DatabaseUserRepository } from './user.repository';
import { UserService } from './user.service';


const prismaMock = {
    user: {
        findUniqueOrThrow: jest.fn(),
        create: jest.fn()
    }
}

describe('UserService', () => {

    let service: UserService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UserService,
                DatabaseUserRepository,
                {
                    provide: PrismaService,
                    useValue: prismaMock
                }
            ]
        }).compile();

        service = moduleRef.get<UserService>(UserService);

    });



    describe('When the getUserByEmail method is called', () => {

        it('When the getUserByEmail return user', async () => {
            const emailExist = 'john.doe@mail.com';
            const user: User = {
                id: '1321sdf-563s5d4f6sf',
                email: emailExist,
                password: 'hashPass',
                firstName: 'john',
                lastName: 'Doe',
                hiredAt: new Date(),
                isConnected: true,
                isActive: true,
                status: StatusEnum.CONFIRMED,
                createdAt: new Date(),
                updatedAt: new Date(),
                avatarUrl: null,
                role: RoleEnum.DRIVER

            };
            prismaMock.user.findUniqueOrThrow.mockResolvedValue(user)

            const result = await service.getUserByEmail(emailExist);
            expect(result).toBe(user)
            expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledTimes(1);
            expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledWith({
                where: {
                    email: emailExist
                }
            })
        })


    })


});

