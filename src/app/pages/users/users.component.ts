import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from '../service/product.service';
import { User } from '../../models/user';
import { UserService } from '../service/user.service'; // Adjust the import path as necessary

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-users',
  imports: [CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [MessageService, ProductService, ConfirmationService]
})
export class UsersComponent implements OnInit {
  userDialog: boolean = false;

  users = signal<User[]>([]);

  user!: User;

  selectedUsers!: User[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private confirmationService: ConfirmationService
  ) { }

  exportCSV() {
    this.dt.exportCSV();
  }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((data) => {
      this.users.set(data);
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.user = new User();
    this.submitted = false;
    this.userDialog = true;
  }

  editUser(user: any) {
    this.user = { ...user };
    this.userDialog = true;
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users.set(this.users().filter((val) => !this.selectedUsers?.includes(val)));
        this.selectedUsers = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Users Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  deleteUser(user: any) {
  this.confirmationService.confirm({
    message: 'Are you sure you want to delete ' + user.firstname + '?',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          // Remove user from UI
          this.users.set(this.users().filter((val) => val.id !== user.id));

          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'User Deleted',
            life: 3000
          });
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete user',
            life: 3000
          });
        }
      });
    }
  });
}


  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.users().length; i++) {
      if (this.users()[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

  saveUser() {
    this.submitted = true;

    if (this.user.firstname?.trim()) {
      if (this.user.id) {
            // 🔁 Update user via backend service
          this.userService.updateUser(this.user.id, this.user).subscribe({
            next: (updatedUser) => {
              const updatedUsers = [...this.users()];
              const index = updatedUsers.findIndex(u => u.id === this.user.id);
              if (index !== -1) {
                updatedUsers[index] = updatedUser;
              }
              this.users.set(updatedUsers);

              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'User Updated',
                life: 3000
              });
              this.userDialog = false;
              this.user = new User(); // reset form
            },
            error: (err) => {
              console.error('Error updating user:', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'User update failed',
                life: 3000
              });
            }
          });
      } else {
        // Add user via backend service
        delete this.user.role;
        this.userService.addUser(this.user).subscribe({
          next: (createdUser) => {
            this.users.set([...this.users(), createdUser]); // update user list
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'User Created',
              life: 3000
            });
            this.userDialog = false;
            this.user = new User(); // reset form
          },
          error: (err) => {
            console.error('Error creating user:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'User creation failed',
              life: 3000
            });
          }
        });
      }
    }
  }


}
