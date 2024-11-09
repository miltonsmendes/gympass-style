
import {expect, describe, it} from 'vitest'
import { compare } from 'bcryptjs'
import { RegisterUseCase } from './register'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user-repositories'
import { UserAlreadyExistsError } from '../use-cases/errors/user-already-exists-error'

describe('Register Use Case', () => {
    it('should be able to register', async () => {
        const usersRepository = new InMemoryUserRepository()
        const registerUseCase = new RegisterUseCase(usersRepository);

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'jdoe@example.com',
            password: '123456'
        })

    
        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        const usersRepository = new InMemoryUserRepository()
        const registerUseCase = new RegisterUseCase(usersRepository);

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'jdoe@example.com',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash,
        )

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async () => {
        const usersRepository = new InMemoryUserRepository()
        const registerUseCase = new RegisterUseCase(usersRepository);

        const email = 'jdoe@example.com';

       await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456'
        })

    
        expect(() => registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456'
        })).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})