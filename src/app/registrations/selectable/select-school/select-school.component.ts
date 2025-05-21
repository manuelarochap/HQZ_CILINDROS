import { SchoolService } from './../../../services/school/school.service';
import { Component, OnInit } from '@angular/core';
import { School } from '../../../interfaces/school';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-school',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './select-school.component.html',
  styleUrl: './select-school.component.css'
})
export class SelectSchoolComponent implements OnInit{
  protected schools: School[] = []

  constructor(private active: ActivatedRoute, private schoolService: SchoolService){}

  ngOnInit(): void {
    this.loadchools();
  }

  loadchools(): void {
    this.schoolService.getSchools().subscribe((schools) => {
      this.schools = schools;
    });
  }
}
