import { userService } from "./user.service";

describe('GET - User Service', () => {
    const user_id = '17';

    test('This should return all users ', async () => {
        const result  = await userService.getAll();
        
        expect(result).toBeInstanceOf(Array);
    });

    test('This should return a user by id', async () => {
        const result  = await userService.getById(user_id);
        
        expect(result).toBeInstanceOf(Object);
    });

    // test('This should create a user', async () => {
    //     const result  = await userService.create({
    //         name: 'test',
    //         last_name: 'Gutierritos',
    //         nickname: 'littletest',
    //         email: 'littletest@example.com',
    //         phone: '1234567890',
    //         avatar: ""
    //     })

    //     expect(result).toBeInstanceOf(Object);
    // });

    test('This should update a user', async () => {
        const result  = await userService.update(user_id, {
            // name: 'test',
            // last_name: 'Gutierritos',
            nickname: 'littletest',
            // email: 'soylaposha@gmail.com',
            // phone: '1234567890',
            // avatar: ""
        });

        expect(result).toBeInstanceOf(Object);
    });

    test('This should delete a user', async () => {
        const result  = await userService.delete(user_id);
        
        expect(result).toBeInstanceOf(Object);
    });

});