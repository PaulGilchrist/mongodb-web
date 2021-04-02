import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { State } from '../../models/state.model';
import { Address, Contact } from '../../models/contact.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-user-shell',
    templateUrl: './user-shell.component.html'
})
export class UserShellComponent implements OnDestroy, OnInit {
    address: Address = null;
    addresses: Address[] = [];
    isConnected = true;
    states: State[] = [];
    subscriptions: Subscription[] = [];
    user: Contact = null;
    users: Contact[] = [];
    userSubscription: Subscription;

    constructor(private toastrService: ToastrService, public userService: UserService) { }

    ngOnInit(): void {
        this.subscriptions.push(this.userService.getStates().subscribe(
            states => this.states = states
        ));
        this.subscriptions.push(this.userService.getUsers(true).subscribe(
            users => this.users = users
        ));
    }

    ngOnDestroy(): void {
        // Unsubscribe all subscriptions to avoid memory leak
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    onSaveUser(user: Contact): void {
        // Save to API would be here
        this.userService.updateUser(user).subscribe(
            success => {
                this.toastrService.success(`User '${user.firstName} ${user.lastName}' saved to API`, `Save User`);
                console.log(`User '${user.firstName} ${user.lastName}' saved to API`);
            },
            error => {
                console.error(`Error saving user '${user.firstName} ${user.lastName}' to API`, `Save User`);
            }
        );
    }

    onSelect(user: Contact): void {
        // Let the UserFormComponent know to populate user details and scroll it into view
        window.scrollTo(0, 0);
        this.user = user;
        // Get the first address for this user
        if (user.addresses && user.addresses.length > 0) {
            this.address = user.addresses[0];
        }
    }

    reset() {
        localStorage.removeItem('users');
        localStorage.removeItem('dirtyUsers');
        this.user = null;
        this.address = null;
        this.userService.getUsers(true);
        console.log(`User list reset`);
    }

}
