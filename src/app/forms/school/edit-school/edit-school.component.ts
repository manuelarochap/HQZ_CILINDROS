// import { SchoolSchoolService } from './../../../services/school-School/school-School.service';
import { Component, OnInit } from '@angular/core';
import { School } from '../../../interfaces/school';
import { ActivatedRoute, Router } from '@angular/router';
import { SchoolService } from '../../../services/school/school.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-school',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-school.component.html',
  styleUrl: './edit-school.component.css'
})
export class EditSchoolComponent implements OnInit {
  schools: School[] = [];
  school: School | undefined

  constructor(
    private schoolService: SchoolService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSchools();
  }

  loadSchools(): void {
    const schoolId = this.route.snapshot.paramMap.get('id');
    if (schoolId) {
      this.schoolService.getSchoolById(+schoolId).subscribe(
        (school) => {
          this.school = school;
        },
        (error) => {
          console.error('Error loading school:', error)
        }
      );
    }
  }

  editSchool(School: School): void {
    this.schoolService.editSchool(School).subscribe((updatedSchool) => {
      const index = this.schools.findIndex((s) => s.id === updatedSchool.id);
      if (index !== -1) {
        this.schools[index] = updatedSchool;  // Update the School in the list
      }
    });

    this.router.navigate(['/usr/registrations'])
  }

  deleteSchool(id: string): void {
    this.schoolService.deleteSchool(id).subscribe(() => {
      this.schools = this.schools.filter((school) => school.id !== id);  // Remove the deleted School from the list
    });

    this.router.navigate(['/usr/registrations'])
  }

  // protected school?: School
  // constructor(private route: ActivatedRoute,
  //             private schoolService: SchoolService,
  //             private schoolSchoolService: SchoolSchoolService) { }

  // ngOnInit(): void {
  //   const id = this.route.snapshot.paramMap.get('id')
  //   const schools = this.schoolService.getSchools()
  //   this.school = schools.find(school => school.id === id)
  // }

  // editSchool() {
  //   this.schoolService.editSchool(this.school!)
  // }

  // deleteSchool() {
  //   this.schoolService.deleteSchool(this.school!)
  //   this.schoolSchoolService.deleteSchoolSchoolBySchool(this.school!)
  // }
}
