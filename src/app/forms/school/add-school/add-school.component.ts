import { Component } from '@angular/core';
import { School } from '../../../interfaces/school';
import { SchoolService } from '../../../services/school/school.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-school',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-school.component.html',
  styleUrl: './add-school.component.css'
})
export class AddSchoolComponent {
  schools: School[] = [];
  newSchool: School = { id: "", cnpj: '', name: '', type: '' };

  constructor(private route: ActivatedRoute, private schoolService: SchoolService, private router: Router){}

  addSchool(): void {
    this.newSchool.id = Math.floor(Math.random() * 1000000000).toString();
    this.schoolService.addSchool(this.newSchool).subscribe((school) => {
      this.schools.push(school);  // Add the new School to the list
      this.newSchool = { id: "", cnpj: '', name: '', type: '' };  // Reset the form
    });

    this.loadchools()

    this.router.navigate(['/usr/registrations'])
  }

  loadchools(): void {
    this.schoolService.getSchools().subscribe((schools) => {
      this.schools = schools;
    });
  }
  // protected school!: School
  // public types = [
  //   "Fundamental",
  //   "Médio",
  //   "Graduação",
  //   "Tecnólogo",
  //   "Outro"
  // ]
  // constructor(private route: ActivatedRoute, private schoolService: SchoolService){}

  // ngOnInit(): void {
  //   this.school = this.schoolService.createSchool()
  // }

  // addSchool() {
  //   this.schoolService.addSchool(this.school)
  // }
}
