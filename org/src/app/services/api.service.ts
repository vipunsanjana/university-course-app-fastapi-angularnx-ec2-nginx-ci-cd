import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DegreeProgram, StudentInput, RecommendationResponse, NearbyRecommendationResponse } from '../models/degree.model';
import { environment } from '../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getAllDegrees(): Observable<DegreeProgram[]> {
    return this.http.get<DegreeProgram[]>(`${this.baseUrl}/degrees`);
  }

  getSubjectStreams(): Observable<{ streams: string[] }> {
    return this.http.get<{ streams: string[] }>(`${this.baseUrl}/streams`);
  }

  getDistricts(): Observable<{ districts: string[] }> {
    return this.http.get<{ districts: string[] }>(`${this.baseUrl}/districts`);
  }

  getRecommendations(studentInput: StudentInput): Observable<RecommendationResponse> {
    return this.http.post<RecommendationResponse>(`${this.baseUrl}/recommend`, studentInput);
  }

  getNearbyRecommendations(studentInput: StudentInput): Observable<NearbyRecommendationResponse> {
    return this.http.post<NearbyRecommendationResponse>(`${this.baseUrl}/recommend-nearby`, studentInput);
  }
}