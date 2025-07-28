import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { StudentInput } from '../../models/degree.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Enter Your Details</h2>

      <form (ngSubmit)="onSubmit()" #studentForm="ngForm" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Z-Score Input -->
          <div class="space-y-2">
            <label for="zScore" class="block text-sm font-medium text-gray-700">Z-Score *</label>
            <input
              type="number"
              id="zScore"
              name="zScore"
              [(ngModel)]="studentInput.z_score"
              step="0.01"
              min="0"
              max="3"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., 1.75"
            />
            <p class="text-xs text-gray-500">Enter your A/L Z-Score (0.00 - 3.00)</p>
          </div>

          <!-- Subject Stream -->
          <div class="space-y-2">
            <label for="stream" class="block text-sm font-medium text-gray-700">Subject Stream *</label>
            <select
              id="stream"
              name="stream"
              [(ngModel)]="studentInput.subject_stream"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select Stream</option>
              <option *ngFor="let stream of streams" [value]="stream">{{ stream }}</option>
            </select>
          </div>

          <!-- District -->
          <div class="space-y-2">
            <label for="district" class="block text-sm font-medium text-gray-700">District *</label>
            <select
              id="district"
              name="district"
              [(ngModel)]="studentInput.district"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select District</option>
              <option *ngFor="let district of districts" [value]="district">{{ district }}</option>
            </select>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 pt-4">
          <!-- 🎯 Get Recommendations -->
          <button
            type="submit"
            [disabled]="!studentForm.valid || isLoadingRecommendations"
            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            <span *ngIf="!isLoadingRecommendations">🎯 Get Recommendations</span>
            <span *ngIf="isLoadingRecommendations" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
          </button>

          <!-- 📍 Include Nearby Districts -->
          <button
            type="button"
            (click)="onGetNearbyRecommendations()"
            [disabled]="!studentForm.valid || isLoadingNearby"
            class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            <span *ngIf="!isLoadingNearby">📍 Include Nearby Districts</span>
            <span *ngIf="isLoadingNearby" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
          </button>
        </div>
      </form>
    </div>
  `
})
export class StudentFormComponent implements OnInit {
  @Output() recommendationsRequested = new EventEmitter<StudentInput>();
  @Output() nearbyRecommendationsRequested = new EventEmitter<StudentInput>();

  studentInput: StudentInput = {
    z_score: 0,
    subject_stream: '',
    district: ''
  };

  streams: string[] = [];
  districts: string[] = [];

  isLoadingRecommendations = false;
  isLoadingNearby = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadStreams();
    this.loadDistricts();
  }

  loadStreams() {
    this.apiService.getSubjectStreams().subscribe({
      next: (response) => {
        this.streams = response.streams;
      },
      error: (error) => {
        console.error('Error loading streams:', error);
        this.streams = ['Bio Science', 'Physical Science', 'Technology'];
      }
    });
  }

  loadDistricts() {
    this.apiService.getDistricts().subscribe({
      next: (response) => {
        this.districts = response.districts;
      },
      error: (error) => {
        console.error('Error loading districts:', error);
        this.districts = ['Colombo', 'Kandy', 'Gampaha', 'Galle', 'Matara', 'Jaffna', 'Kurunegala', 'Anuradhapura'];
      }
    });
  }

  onSubmit() {
    if (this.isValidInput()) {
      this.isLoadingRecommendations = true;
      this.recommendationsRequested.emit(this.studentInput);
      setTimeout(() => this.isLoadingRecommendations = false, 1000);
    }
  }

  onGetNearbyRecommendations() {
    if (this.isValidInput()) {
      this.isLoadingNearby = true;
      this.nearbyRecommendationsRequested.emit(this.studentInput);
      setTimeout(() => this.isLoadingNearby = false, 1000);
    }
  }

  private isValidInput(): boolean {
    return this.studentInput.z_score > 0 &&
           this.studentInput.subject_stream !== '' &&
           this.studentInput.district !== '';
  }
}
