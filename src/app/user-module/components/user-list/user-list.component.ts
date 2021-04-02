import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Contact } from '../../models/contact.model';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
    @Input() users: Contact[];
    @Output() readonly choose = new EventEmitter<Contact>();
    id: string;

    errorMessage: string;
    isOpen = true;  // Used to toggle open and closed the bootstrap panel
    sortType = 'firstName';
    sortReverse = false;
    searchString = '';
    selectedUser: Contact = null;
    shrink =  window.innerWidth < 768;

    ngOnInit(): void {
        // Track screen size  changes to adjust button size
        window.onresize = () => this.shrink = window.innerWidth < 768;
    }

    changeSort(newSortType: string) {
        if (newSortType === this.sortType) {
            // clicking the same column twice toggles the sort order
            this.sortReverse = !this.sortReverse;
        } else {
            this.sortType = newSortType;
        }
    }

    selectUser(user: Contact): void {
        // Keep track of the selected user so it can be highlighted in the HTML
        this.selectedUser = user;
        // Bubble up to the parent that a new user was selected
        this.choose.emit(user);
    }

}
