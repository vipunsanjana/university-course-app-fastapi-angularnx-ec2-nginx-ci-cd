import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DegreeProgram, RecommendationResponse, NearbyRecommendationResponse } from '../../models/degree.model';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="recommendations || nearbyRecommendations" class="space-y-6 lg:space-y-8">
      
      <!-- Regular Recommendations -->
      <div *ngIf="recommendations" class="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
            <span class="text-2xl sm:text-3xl mr-2 sm:mr-3">🎓</span>
            Recommended Programs
          </h2>
          <div class="bg-blue-100 text-blue-800 px-3 sm:px-4 py-2 rounded-full font-semibold flex items-center text-sm sm:text-base">
            <span class="text-lg sm:text-xl mr-2">✅</span>
            {{ recommendations.total_count }} Programs Found
          </div>
        </div>

        <div *ngIf="recommendations.total_count === 0" class="text-center py-8 sm:py-12">
          <div class="text-4xl sm:text-6xl mb-4">😔</div>
          <h3 class="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Programs Found</h3>
          <p class="text-sm sm:text-base text-gray-500 mb-4 px-4">
            Unfortunately, no degree programs match your criteria in {{ recommendations.student_input.district }}.
          </p>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <p class="text-yellow-800 font-medium text-sm sm:text-base">💡 Try these options:</p>
            <ul class="text-yellow-700 text-xs sm:text-sm mt-2 space-y-1 text-left">
              <li>• Click "Include Nearby Districts" for more options</li>
              <li>• Consider a different subject stream</li>
              <li>• Check programs in other districts</li>
            </ul>
          </div>
        </div>

        <div *ngIf="recommendations.total_count > 0" class="space-y-4 sm:space-y-6">
          <!-- Summary Stats -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
              <div class="bg-white rounded-lg p-3 sm:p-4">
                <div class="text-lg sm:text-2xl font-bold text-blue-600">{{ recommendations.total_count }}</div>
                <div class="text-xs sm:text-sm text-gray-600">Total Programs</div>
              </div>
              <div class="bg-white rounded-lg p-3 sm:p-4">
                <div class="text-lg sm:text-2xl font-bold text-green-600">{{ recommendations.student_input.z_score }}</div>
                <div class="text-xs sm:text-sm text-gray-600">Your Z-Score</div>
              </div>
              <div class="bg-white rounded-lg p-3 sm:p-4">
                <div class="text-lg sm:text-2xl font-bold text-purple-600">{{ getAverageAdvantage() }}</div>
                <div class="text-xs sm:text-sm text-gray-600">Avg. Advantage</div>
              </div>
              <div class="bg-white rounded-lg p-3 sm:p-4">
                <div class="text-lg sm:text-2xl font-bold text-amber-600">{{ getBestAdvantage() }}</div>
                <div class="text-xs sm:text-sm text-gray-600">Best Advantage</div>
              </div>
            </div>
          </div>

          <!-- Programs List -->
          <div class="grid gap-3 sm:gap-4">
            <div *ngFor="let degree of recommendations.eligible_degrees; let i = index" 
                 class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-102">
              <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                <div class="flex-1">
                  <div class="flex items-center mb-3">
                    <span class="text-xl sm:text-2xl mr-2 sm:mr-3">{{ getDegreeIcon(degree.subject_stream) }}</span>
                    <h3 class="text-lg sm:text-xl font-bold text-gray-800 leading-tight">
                      {{ degree.degree_name }}
                    </h3>
                  </div>
                  <div class="space-y-2 sm:space-y-3">
                    <div class="flex flex-wrap gap-2">
                      <span class="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                        🏛️ {{ degree.university || 'University' }}
                      </span>
                      <span class="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                        📍 {{ degree.district }}
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <span class="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-100 text-purple-800">
                        📚 {{ degree.subject_stream }}
                      </span>
                      <span class="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-amber-100 text-amber-800">
                        📊 Cutoff: {{ degree.cutoff_z_score }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="lg:ml-4 text-center lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0">
                  <div class="text-2xl sm:text-3xl font-bold text-green-600">
                    {{ getEligibilityScore(degree.cutoff_z_score) }}%
                  </div>
                  <div class="text-xs text-gray-500">Eligibility</div>
                  <div class="mt-2 px-2 py-1 rounded-full text-xs font-medium inline-block"
                       [ngClass]="getCompetitivenessClass(degree.cutoff_z_score)">
                    {{ getCompetitivenessLabel(degree.cutoff_z_score) }}
                  </div>
                </div>
              </div>
              <div class="mt-4 bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm mb-2 space-y-1 sm:space-y-0">
                  <span class="text-gray-600">Your Z-Score: <strong>{{ recommendations.student_input.z_score }}</strong></span>
                  <span class="text-gray-600">Required: <strong>{{ degree.cutoff_z_score }}</strong></span>
                  <span class="font-semibold text-green-600">
                    ✅ +{{ (recommendations.student_input.z_score - degree.cutoff_z_score).toFixed(2) }} advantage
                  </span>
                </div>
                <!-- Progress bar showing advantage -->
                <div class="bg-gray-200 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full transition-all duration-500" 
                       [style.width.%]="getAdvantagePercentage(degree.cutoff_z_score)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Nearby Recommendations -->
      <div *ngIf="nearbyRecommendations" class="space-y-4 sm:space-y-6">
        
        <!-- Geographic Overview -->
        <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 sm:p-6 border border-indigo-200">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-2xl sm:text-3xl mr-2 sm:mr-3">🗺️</span>
            <span class="leading-tight">Geographic Opportunities Analysis</span>
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div class="bg-white rounded-lg p-3 sm:p-4 text-center">
              <div class="text-xl sm:text-2xl font-bold text-blue-600">{{ nearbyRecommendations.primary_district.count }}</div>
              <div class="text-xs sm:text-sm text-gray-600">Programs in {{ nearbyRecommendations.primary_district.district }}</div>
            </div>
            <div class="bg-white rounded-lg p-3 sm:p-4 text-center">
              <div class="text-xl sm:text-2xl font-bold text-green-600">{{ nearbyRecommendations.nearby_districts.count }}</div>
              <div class="text-xs sm:text-sm text-gray-600">Programs in Nearby Districts</div>
            </div>
            <div class="bg-white rounded-lg p-3 sm:p-4 text-center">
              <div class="text-xl sm:text-2xl font-bold text-purple-600">{{ getTotalNearbyPrograms() }}</div>
              <div class="text-xs sm:text-sm text-gray-600">Total Opportunities</div>
            </div>
          </div>
        </div>
        
        <!-- Primary District -->
        <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <h3 class="text-lg sm:text-2xl font-bold text-gray-800 flex items-center">
              <span class="text-2xl sm:text-3xl mr-2 sm:mr-3">🏠</span>
              <div class="flex flex-col sm:flex-row sm:items-center">
                <span>Programs in {{ nearbyRecommendations.primary_district.district }}</span>
                <span class="text-xs sm:text-sm font-normal text-gray-500 sm:ml-2">(Your District)</span>
              </div>
            </h3>
            <div class="bg-blue-100 text-blue-800 px-3 sm:px-4 py-2 rounded-full font-semibold text-sm sm:text-base shrink-0">
              {{ nearbyRecommendations.primary_district.count }} Programs
            </div>
          </div>

          <div *ngIf="nearbyRecommendations.primary_district.count === 0" class="text-center py-6 sm:py-8">
            <div class="text-3xl sm:text-4xl mb-2">🔍</div>
            <p class="text-gray-500 mb-2 text-sm sm:text-base">No programs found in your district</p>
            <p class="text-xs sm:text-sm text-gray-400">Check the nearby districts below for more opportunities</p>
          </div>

          <div *ngIf="nearbyRecommendations.primary_district.count > 0" class="grid gap-3 sm:gap-4">
            <div *ngFor="let degree of nearbyRecommendations.primary_district.degrees" 
                 class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-all duration-200">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <span class="text-lg sm:text-xl mr-2">{{ getDegreeIcon(degree.subject_stream) }}</span>
                    <h4 class="text-base sm:text-lg font-bold text-gray-800 leading-tight">{{ degree.degree_name }}</h4>
                  </div>
                  <div class="flex flex-wrap gap-2 text-xs sm:text-sm">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded">{{ degree.university || 'University' }}</span>
                    <span class="px-2 py-1 bg-amber-100 text-amber-800 rounded">Cutoff: {{ degree.cutoff_z_score }}</span>
                  </div>
                </div>
                <div class="text-center sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 sm:ml-4">
                  <div class="text-green-600 font-bold text-lg">
                    +{{ (nearbyRecommendations.student_input.z_score - degree.cutoff_z_score).toFixed(2) }}
                  </div>
                  <div class="text-xs text-gray-500">advantage</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Nearby Districts -->
        <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <h3 class="text-lg sm:text-2xl font-bold text-gray-800 flex items-center">
              <span class="text-2xl sm:text-3xl mr-2 sm:mr-3">📍</span>
              <div class="flex flex-col sm:flex-row sm:items-center">
                <span>Programs in Nearby Districts</span>
                <span class="text-xs sm:text-sm font-normal text-gray-500 sm:ml-2">(Expanded Search)</span>
              </div>
            </h3>
            <div class="bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-full font-semibold text-sm sm:text-base shrink-0">
              {{ nearbyRecommendations.nearby_districts.count }} Programs
            </div>
          </div>

          <!-- Nearby Districts List -->
          <div *ngIf="nearbyRecommendations.nearby_districts.districts.length > 0" class="mb-4 sm:mb-6">
            <p class="text-xs sm:text-sm text-gray-600 mb-3 font-medium">📍 Nearby districts included in search:</p>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let district of nearbyRecommendations.nearby_districts.districts" 
                    class="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-xs sm:text-sm font-medium border border-green-200 hover:shadow-sm transition-all duration-200">
                🌍 {{ district }}
              </span>
            </div>
          </div>

          <div *ngIf="nearbyRecommendations.nearby_districts.count === 0" class="text-center py-6 sm:py-8">
            <div class="text-3xl sm:text-4xl mb-2">🌍</div>
            <p class="text-gray-500 mb-2 text-sm sm:text-base">No programs found in nearby districts</p>
            <p class="text-xs sm:text-sm text-gray-400">Consider expanding to other subject streams or districts</p>
          </div>

          <div *ngIf="nearbyRecommendations.nearby_districts.count > 0" class="grid gap-3 sm:gap-4">
            <div *ngFor="let degree of nearbyRecommendations.nearby_districts.degrees" 
                 class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-all duration-200">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <span class="text-lg sm:text-xl mr-2">{{ getDegreeIcon(degree.subject_stream) }}</span>
                    <h4 class="text-base sm:text-lg font-bold text-gray-800 leading-tight">{{ degree.degree_name }}</h4>
                  </div>
                  <div class="flex flex-wrap gap-2 text-xs sm:text-sm">
                    <span class="px-2 py-1 bg-green-100 text-green-800 rounded flex items-center">
                      📍 {{ degree.district }}
                    </span>
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded">{{ degree.university || 'University' }}</span>
                    <span class="px-2 py-1 bg-amber-100 text-amber-800 rounded">Cutoff: {{ degree.cutoff_z_score }}</span>
                  </div>
                  <div class="mt-2 text-xs text-gray-600">
                    🚗 Distance: {{ getDistanceEstimate(degree.district) }}
                  </div>
                </div>
                <div class="text-center sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 sm:ml-4">
                  <div class="text-green-600 font-bold text-lg">
                    +{{ (nearbyRecommendations.student_input.z_score - degree.cutoff_z_score).toFixed(2) }}
                  </div>
                  <div class="text-xs text-gray-500">advantage</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Travel & Logistics Info -->
        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
          <h4 class="font-semibold text-gray-800 mb-3 flex items-center text-sm sm:text-base">
            <span class="text-lg sm:text-xl mr-2">🚗</span>
            Travel & Logistics Considerations
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <h5 class="font-medium text-gray-700 mb-2">💡 Tips for Nearby Districts:</h5>
              <ul class="space-y-1 text-gray-600">
                <li>• Consider accommodation options</li>
                <li>• Check transportation availability</li>
                <li>• Factor in travel costs</li>
                <li>• Research campus facilities</li>
              </ul>
            </div>
            <div>
              <h5 class="font-medium text-gray-700 mb-2">📋 Next Steps:</h5>
              <ul class="space-y-1 text-gray-600">
                <li>• Visit university websites</li>
                <li>• Attend information sessions</li>
                <li>• Contact admissions offices</li>
                <li>• Plan campus visits</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RecommendationsComponent implements OnChanges {
  @Input() recommendations: RecommendationResponse | null = null;
  @Input() nearbyRecommendations: NearbyRecommendationResponse | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['recommendations'] && changes['nearbyRecommendations']) {
      // Clear nearby recommendations when regular recommendations are shown
      if (this.recommendations && this.nearbyRecommendations) {
        this.nearbyRecommendations = null;
      }
    }
  }

  getEligibilityScore(cutoffScore: number): number {
    const studentScore = this.getStudentZScore();
    const maxScore = 3.0; // Maximum possible Z-score
    const eligibilityRatio = (studentScore - cutoffScore) / (maxScore - cutoffScore);
    return Math.min(100, Math.max(0, Math.round(eligibilityRatio * 100)));
  }

  getStudentZScore(): number {
    if (this.recommendations) {
      return this.recommendations.student_input.z_score;
    }
    if (this.nearbyRecommendations) {
      return this.nearbyRecommendations.student_input.z_score;
    }
    return 0;
  }

  getDegreeIcon(stream: string): string {
    switch (stream.toLowerCase()) {
      case 'BIO': return '🔬';
      case 'Maths': return '💼';
      case 'Tech': return '🎨';
      default: return '📚';
    }
  }

  getCompetitivenessClass(cutoffScore: number): string {
    const advantage = this.getStudentZScore() - cutoffScore;
    if (advantage >= 0.5) return 'bg-green-100 text-green-800';
    if (advantage >= 0.3) return 'bg-blue-100 text-blue-800';
    if (advantage >= 0.1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  getCompetitivenessLabel(cutoffScore: number): string {
    const advantage = this.getStudentZScore() - cutoffScore;
    if (advantage >= 0.5) return 'Very Safe';
    if (advantage >= 0.3) return 'Safe';
    if (advantage >= 0.1) return 'Competitive';
    return 'Challenging';
  }

  getAdvantagePercentage(cutoffScore: number): number {
    const advantage = this.getStudentZScore() - cutoffScore;
    return Math.min(100, (advantage / 1.0) * 100); // Scale to 100% for 1.0 advantage
  }

  getAverageAdvantage(): string {
    if (!this.recommendations) return '0.00';
    const advantages = this.recommendations.eligible_degrees.map(d => 
      this.recommendations!.student_input.z_score - d.cutoff_z_score
    );
    const avg = advantages.reduce((sum, adv) => sum + adv, 0) / advantages.length;
    return `+${avg.toFixed(2)}`;
  }

  getBestAdvantage(): string {
    if (!this.recommendations) return '0.00';
    const advantages = this.recommendations.eligible_degrees.map(d => 
      this.recommendations!.student_input.z_score - d.cutoff_z_score
    );
    const best = Math.max(...advantages);
    return `+${best.toFixed(2)}`;
  }

  getTotalNearbyPrograms(): number {
    if (!this.nearbyRecommendations) return 0;
    return this.nearbyRecommendations.primary_district.count + 
           this.nearbyRecommendations.nearby_districts.count;
  }

  getDistanceEstimate(district: string): string {
    // Simple distance estimates - in a real app, this could use actual distance calculations
    const distances: { [key: string]: string } = {
      'Gampaha': '30-45 km',
      'Kalutara': '45-60 km',
      'Kandy': '115 km',
      'Galle': '120 km',
      'Matara': '160 km',
      'Kurunegala': '95 km',
      'Anuradhapura': '205 km'
    };
    return distances[district] || '50-100 km';
  }
}