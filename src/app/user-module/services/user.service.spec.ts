import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

// import 'rxjs/Rx';
import {} from 'jasmine';

import { IdentityService } from '../../services/identity.service';
import { UserService } from './user.service';
import { Address } from '../models/address.model';
import { User } from '../models/contact.model';

describe('UserService', () => {
    let users: User[];
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                IdentityService,
                UserService
            ]
        });
    });
    // it('Successfully pulled correct number of users from remote API', inject([UserService], (service: any) => {
    //     service.getUsers().subscribe((data: User[]) => {
    //         users = data;
    //         expect(users.length).toBe(241);
    //     });
    // }));
    // it('Successfully pulled the correct first user from remote API', inject([UserService], (service: any) => {
    //     // Assumes the API has already pulled user info
    //     service.getUsers().subscribe((data: User[]) => {
    //         users = data;
    //         expect(users[0].firstName).toEqual('Aaron');
    //     });
    // }));
    // it('Successfully pulled addresses for a given user from remote API', inject([UserService], (service: any) => {
    //     service.getUsers().subscribe((data: User[]) => {
    //         users = data;
    //         service.getUserAddresses(users[0]).subscribe((addresses: Address[]) => {
    //             expect(addresses.length).toBe(2);
    //         });
    //     });
    // }));
});
