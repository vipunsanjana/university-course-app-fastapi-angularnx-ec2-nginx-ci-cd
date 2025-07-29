import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DegreeProgram, RecommendationResponse, NearbyRecommendationResponse } from '../../models/degree.model';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="(recommendations && recommendations.total_count > 0) || (nearbyRecommendations)" class="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">📊 Z-Score Analysis & Statistics</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <!-- Enhanced Statistics Cards -->
        <div class="space-y-3 sm:space-y-4">
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 transform hover:scale-105 transition-all duration-200">
            <h3 class="font-semibold text-gray-800 mb-2 flex items-center text-sm sm:text-base">
              <span class="text-lg sm:text-2xl mr-2">🎯</span>
              Your Performance
            </h3>
            <div class="text-2xl sm:text-3xl font-bold text-blue-600">{{ getStudentZScore() }}</div>
            <p class="text-xs sm:text-sm text-gray-600">Your Z-Score</p>
            <div class="mt-2 bg-blue-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                   [style.width.%]="(getStudentZScore() / 3.0) * 100"></div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 sm:p-4 transform hover:scale-105 transition-all duration-200">
            <h3 class="font-semibold text-gray-800 mb-2 flex items-center text-sm sm:text-base">
              <span class="text-lg sm:text-2xl mr-2">✅</span>
              Total Eligibility
            </h3>
            <div class="text-2xl sm:text-3xl font-bold text-green-600">{{ getTotalEligiblePrograms() }}</div>
            <p class="text-xs sm:text-sm text-gray-600">Programs Available</p>
            <div class="flex items-center mt-2">
              <span class="text-xs sm:text-sm text-green-700 bg-green-200 px-2 py-1 rounded-full">
                {{ getEligibilityPercentage() }}% of all programs
              </span>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4 transform hover:scale-105 transition-all duration-200">
            <h3 class="font-semibold text-gray-800 mb-2 flex items-center text-sm sm:text-base">
              <span class="text-lg sm:text-2xl mr-2">📈</span>
              Competitive Advantage
            </h3>
            <div class="text-2xl sm:text-3xl font-bold text-purple-600">+{{ averageAdvantage.toFixed(2) }}</div>
            <p class="text-xs sm:text-sm text-gray-600">Average Above Cutoff</p>
            <div class="mt-2">
              <div class="text-xs sm:text-sm text-purple-700">
                Range: +{{ minAdvantage.toFixed(2) }} to +{{ maxAdvantage.toFixed(2) }}
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-3 sm:p-4 transform hover:scale-105 transition-all duration-200">
            <h3 class="font-semibold text-gray-800 mb-2 flex items-center text-sm sm:text-base">
              <span class="text-lg sm:text-2xl mr-2">🏆</span>
              Best Match
            </h3>
            <div class="text-base sm:text-lg font-bold text-amber-600 leading-tight">{{ bestMatch?.degree_name || 'N/A' }}</div>
            <p class="text-xs sm:text-sm text-gray-600">Highest Safety Margin</p>
            <div *ngIf="bestMatch" class="text-xs sm:text-sm text-amber-700 mt-1">
              +{{ (getStudentZScore() - bestMatch.cutoff_z_score).toFixed(2) }} above cutoff
            </div>
          </div>

          <!-- Nearby Districts Summary (if available) -->
          <div *ngIf="nearbyRecommendations" class="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-3 sm:p-4 transform hover:scale-105 transition-all duration-200">
            <h3 class="font-semibold text-gray-800 mb-2 flex items-center text-sm sm:text-base">
              <span class="text-lg sm:text-2xl mr-2">🗺️</span>
              Geographic Reach
            </h3>
            <div class="text-2xl sm:text-3xl font-bold text-indigo-600">{{ nearbyRecommendations.nearby_districts.districts.length + 1 }}</div>
            <p class="text-xs sm:text-sm text-gray-600">Districts Covered</p>
            <div class="text-xs sm:text-sm text-indigo-700 mt-1">
              {{ nearbyRecommendations.primary_district.district }} + {{ nearbyRecommendations.nearby_districts.districts.length }} nearby
            </div>
          </div>
        </div>
        
        <!-- UX-Enhanced Chart Section -->
        <div class="bg-gray-50 rounded-lg p-3 sm:p-4 overflow-hidden">
          <h3 class="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
            <span class="text-lg sm:text-xl mr-2">📊</span>
            Z-Score Comparison Chart
          </h3>

          <!-- Mobile-optimized chart container -->
          <div class="w-full overflow-x-auto">
            <div class="min-w-[320px] sm:min-w-[600px] w-full">
              <canvas #chartCanvas class="w-full h-[250px] sm:h-[320px]"></canvas>
            </div>
          </div>

          <!-- Legend -->
          <div class="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
            <div class="flex items-center">
              <div class="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded mr-1 sm:mr-2"></div>
              <span>Program Cutoffs</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded mr-1 sm:mr-2"></div>
              <span>Your Z-Score</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded mr-1 sm:mr-2"></div>
              <span>Safety Margin</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Insights -->
      <div class="mt-6 sm:mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 sm:p-6">
        <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
          <span class="text-xl sm:text-2xl mr-2">💡</span>
          Performance Insights
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div class="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <h4 class="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Competitiveness Level</h4>
            <div class="text-base sm:text-lg font-bold" [ngClass]="getCompetitivenessColor()">
              {{ getCompetitivenessLevel() }}
            </div>
            <p class="text-xs sm:text-sm text-gray-600 mt-1 leading-tight">{{ getCompetitivenessDescription() }}</p>
          </div>
          
          <div class="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <h4 class="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Recommendation</h4>
            <div class="text-xs sm:text-sm text-gray-700 leading-tight">
              {{ getRecommendationText() }}
            </div>
          </div>
          
          <div class="bg-white rounded-lg p-3 sm:p-4 shadow-sm sm:col-span-2 lg:col-span-1">
            <h4 class="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Success Probability</h4>
            <div class="text-base sm:text-lg font-bold text-green-600">{{ getSuccessProbability() }}%</div>
            <div class="mt-2 bg-gray-200 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full transition-all duration-500" 
                   [style.width.%]="getSuccessProbability()"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StatisticsComponent implements OnChanges {
  @Input() recommendations: RecommendationResponse | null = null;
  @Input() nearbyRecommendations: NearbyRecommendationResponse | null = null;
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: Chart | null = null;
  averageAdvantage = 0;
  minAdvantage = 0;
  maxAdvantage = 0;
  bestMatch: DegreeProgram | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['recommendations'] && this.recommendations) || 
        (changes['nearbyRecommendations'] && this.nearbyRecommendations)) {
      this.calculateStatistics();
      setTimeout(() => this.createChart(), 100);
    }
  }

  private calculateStatistics() {
    const degrees = this.getAllDegrees();
    if (degrees.length === 0) return;

    const studentScore = this.getStudentZScore();

    // Calculate advantages
    const advantages = degrees.map(d => studentScore - d.cutoff_z_score);
    this.averageAdvantage = advantages.reduce((sum, adv) => sum + adv, 0) / advantages.length;
    this.minAdvantage = Math.min(...advantages);
    this.maxAdvantage = Math.max(...advantages);

    // Find best match (highest advantage)
    let maxAdvantage = -1;
    this.bestMatch = null;
    degrees.forEach(degree => {
      const advantage = studentScore - degree.cutoff_z_score;
      if (advantage > maxAdvantage) {
        maxAdvantage = advantage;
        this.bestMatch = degree;
      }
    });
  }

  private createChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (this.chart) {
      this.chart.destroy();
    }

    const degrees = this.getAllDegrees();
    if (degrees.length === 0) return;

    const studentScore = this.getStudentZScore();

    // Prepare data for chart
    const labels = degrees.map(d => d.degree_name.length > 12 ? 
      d.degree_name.substring(0, 12) + '...' : d.degree_name);
    
    const cutoffScores = degrees.map(d => d.cutoff_z_score);
    const studentScores = degrees.map(() => studentScore);
    const safetyMargins = degrees.map(d => studentScore - d.cutoff_z_score);

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Program Cutoff Z-Score',
          data: cutoffScores,
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          type: 'bar' as ChartType
        },
        {
          label: 'Your Z-Score',
          data: studentScores,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 3,
          type: 'line' as ChartType,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Safety Margin',
          data: safetyMargins,
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2,
          type: 'bar' as ChartType
        }
      ]
    };

    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: window.innerWidth < 640 ? 10 : 12
              }
            }
          },
          title: {
            display: true,
            text: 'Z-Score Analysis: Your Performance vs Program Requirements',
            font: {
              size: window.innerWidth < 640 ? 12 : 16,
              weight: 'bold'
            }
          },
          tooltip: {
            callbacks: {
              afterLabel: (context) => {
                if (context.datasetIndex === 2) {
                  return `Advantage: +${context.parsed.y.toFixed(2)} points`;
                }
                return '';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(3.0, studentScore + 0.5),
            title: {
              display: true,
              text: 'Z-Score',
              font: {
                size: window.innerWidth < 640 ? 10 : 14,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Degree Programs',
              font: {
                size: window.innerWidth < 640 ? 10 : 14,
                weight: 'bold'
              }
            },
            ticks: {
              maxRotation: window.innerWidth < 640 ? 90 : 45,
              minRotation: 0
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private getAllDegrees(): DegreeProgram[] {
    if (this.recommendations) {
      return this.recommendations.eligible_degrees;
    }
    if (this.nearbyRecommendations) {
      return [
        ...this.nearbyRecommendations.primary_district.degrees,
        ...this.nearbyRecommendations.nearby_districts.degrees
      ];
    }
    return [];
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

  getTotalEligiblePrograms(): number {
    if (this.recommendations) {
      return this.recommendations.total_count;
    }
    if (this.nearbyRecommendations) {
      return this.nearbyRecommendations.primary_district.count + 
             this.nearbyRecommendations.nearby_districts.count;
    }
    return 0;
  }

  getEligibilityPercentage(): number {
    const totalPrograms = this.getTotalEligiblePrograms();
    // Assuming there are approximately 50 total programs (this could be made dynamic)
    return Math.round((totalPrograms / 50) * 100);
  }

  getCompetitivenessLevel(): string {
    const studentScore = this.getStudentZScore();
    if (studentScore >= 2.5) return 'Highly Competitive';
    if (studentScore >= 2.0) return 'Very Competitive';
    if (studentScore >= 1.5) return 'Competitive';
    if (studentScore >= 1.0) return 'Moderately Competitive';
    return 'Building Competitiveness';
  }

  getCompetitivenessColor(): string {
    const level = this.getCompetitivenessLevel();
    switch (level) {
      case 'Highly Competitive': return 'text-purple-600';
      case 'Very Competitive': return 'text-blue-600';
      case 'Competitive': return 'text-green-600';
      case 'Moderately Competitive': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  }

  getCompetitivenessDescription(): string {
    const level = this.getCompetitivenessLevel();
    switch (level) {
      case 'Highly Competitive': return 'Excellent performance, top-tier programs available';
      case 'Very Competitive': return 'Strong performance, many quality options';
      case 'Competitive': return 'Good performance, solid program choices';
      case 'Moderately Competitive': return 'Fair performance, several options available';
      default: return 'Focus on improvement for more opportunities';
    }
  }

  getRecommendationText(): string {
    const totalPrograms = this.getTotalEligiblePrograms();
    if (totalPrograms > 15) {
      return 'You have excellent choices! Consider programs that align with your career goals.';
    } else if (totalPrograms > 8) {
      return 'Good selection available. Research each program thoroughly.';
    } else if (totalPrograms > 3) {
      return 'Limited but viable options. Consider nearby districts for more choices.';
    } else if (totalPrograms > 0) {
      return 'Few options available. Strongly consider expanding your search area.';
    }
    return 'Consider improving your Z-score or exploring different streams/districts.';
  }

  getSuccessProbability(): number {
    const avgAdvantage = this.averageAdvantage;
    if (avgAdvantage >= 0.5) return 95;
    if (avgAdvantage >= 0.3) return 85;
    if (avgAdvantage >= 0.2) return 75;
    if (avgAdvantage >= 0.1) return 65;
    if (avgAdvantage >= 0.05) return 55;
    return 45;
  }
}