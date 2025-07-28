import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { StudentFormComponent } from './app/components/student-form/student-form.component';
import { RecommendationsComponent } from './app/components/recommendations/recommendations.component';
import { StatisticsComponent } from './app/components/statistics/statistics.component';
import { ApiService } from './app/services/api.service';
import { StudentInput, RecommendationResponse, NearbyRecommendationResponse } from './app/models/degree.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StudentFormComponent, RecommendationsComponent, StatisticsComponent],
  providers: [ApiService],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <!-- Enhanced Header -->
      <header class="bg-white shadow-lg border-b-4 border-blue-500">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">
              🎓 University Degree Recommendation System
            </h1>
            <p class="text-lg text-gray-600 mb-4">
              Find the perfect degree program based on your A/L results
            </p>
            <!-- Feature Highlights -->
            <div class="flex flex-wrap justify-center gap-4 text-sm">
              <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                📊 Advanced Z-Score Analysis
              </span>
              <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                🗺️ Nearby Districts Search
              </span>
              <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                📈 Interactive Charts
              </span>
              <span class="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
                🎯 Smart Recommendations
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Student Form -->
        <app-student-form 
          (recommendationsRequested)="onRecommendationsRequested($event)"
          (nearbyRecommendationsRequested)="onNearbyRecommendationsRequested($event)">
        </app-student-form>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex justify-center items-center py-16">
          <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600 text-lg">Finding your perfect degree matches...</p>
            <p class="text-gray-500 text-sm mt-2">Analyzing Z-scores and geographic opportunities</p>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div class="flex items-center">
            <div class="text-red-500 text-2xl mr-3">⚠️</div>
            <div>
              <h3 class="text-lg font-semibold text-red-800">Connection Error</h3>
              <p class="text-red-600">{{ error }}</p>
              <p class="text-sm text-red-500 mt-2">
                Make sure the backend server is running on port 8000.
              </p>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div class="space-y-8">
          <app-recommendations 
            [recommendations]="recommendations"
            [nearbyRecommendations]="nearbyRecommendations">
          </app-recommendations>

          <app-statistics 
            [recommendations]="recommendations"
            [nearbyRecommendations]="nearbyRecommendations">
          </app-statistics>
        </div>

        <!-- Enhanced Instructions -->
        <div *ngIf="!recommendations && !nearbyRecommendations && !isLoading" 
             class="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span class="text-3xl mr-3">🚀</span>
            How to Use This System
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div class="text-center transform hover:scale-105 transition-all duration-200">
              <div class="text-4xl mb-4">📝</div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">1. Enter Details</h3>
              <p class="text-gray-600">Fill in your Z-Score, subject stream, and district</p>
            </div>
            <div class="text-center transform hover:scale-105 transition-all duration-200">
              <div class="text-4xl mb-4">🔍</div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">2. Get Recommendations</h3>
              <p class="text-gray-600">Click to find programs you're eligible for</p>
            </div>
            <div class="text-center transform hover:scale-105 transition-all duration-200">
              <div class="text-4xl mb-4">🎯</div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">3. Choose Your Path</h3>
              <p class="text-gray-600">Review recommendations and plan your future</p>
            </div>
          </div>

          <!-- Bonus Features Highlight -->
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span class="text-2xl mr-2">✨</span>
              Bonus Features Available
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-start space-x-3">
                <div class="text-2xl">📊</div>
                <div>
                  <h4 class="font-semibold text-gray-800">Advanced Z-Score Charts</h4>
                  <p class="text-gray-600 text-sm">Interactive visualizations comparing your Z-score with program cutoffs, showing competitive advantages and success probabilities.</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="text-2xl">🗺️</div>
                <div>
                  <h4 class="font-semibold text-gray-800">Nearby Districts Search</h4>
                  <p class="text-gray-600 text-sm">Expand your opportunities by including geographically adjacent districts with travel estimates and logistics information.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Enhanced Footer -->
        <footer class="bg-gray-800 text-white py-3 mt-10 text-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
            <p class="text-gray-300 mb-1">
                ©2025 Vipun Sanjana | University Degree Recommendation System
            </p>
            <p class="text-gray-400 mb-2">
                Helping A/L students find their perfect degree programs with advanced analytics
            </p>
            <div class="flex justify-center flex-wrap gap-4">
                <span class="flex items-center">
                <span class="text-green-400 mr-1">✅</span>
                Google Sheets Integration
                </span>
                <span class="flex items-center">
                <span class="text-blue-400 mr-1">📊</span>
                Z-Score Charts
                </span>
                <span class="flex items-center">
                <span class="text-purple-400 mr-1">🗺️</span>
                Nearby Search
                </span>
            </div>
            </div>
        </div>
        </footer>

    </div>
  `
})
export class App {
  recommendations: RecommendationResponse | null = null;
  nearbyRecommendations: NearbyRecommendationResponse | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  onRecommendationsRequested(studentInput: StudentInput) {
    this.isLoading = true;
    this.error = null;
    this.nearbyRecommendations = null; // Clear nearby recommendations
    
    this.apiService.getRecommendations(studentInput).subscribe({
      next: (response) => {
        this.recommendations = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to fetch recommendations. Please check if the backend server is running.';
        this.isLoading = false;
        console.error('Error fetching recommendations:', error);
      }
    });
  }

  onNearbyRecommendationsRequested(studentInput: StudentInput) {
    this.isLoading = true;
    this.error = null;
    this.recommendations = null; // Clear regular recommendations
    
    this.apiService.getNearbyRecommendations(studentInput).subscribe({
      next: (response) => {
        this.nearbyRecommendations = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to fetch nearby recommendations. Please check if the backend server is running.';
        this.isLoading = false;
        console.error('Error fetching nearby recommendations:', error);
      }
    });
  }
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient()
  ]
});