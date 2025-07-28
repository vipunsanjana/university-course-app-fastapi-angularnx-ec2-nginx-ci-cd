export interface DegreeProgram {
  degree_name: string;
  subject_stream: string;
  district: string;
  cutoff_z_score: number;
  university?: string;
}

export interface StudentInput {
  z_score: number;
  subject_stream: string;
  district: string;
}

export interface RecommendationResponse {
  eligible_degrees: DegreeProgram[];
  total_count: number;
  student_input: StudentInput;
}

export interface NearbyRecommendationResponse {
  primary_district: {
    district: string;
    degrees: DegreeProgram[];
    count: number;
  };
  nearby_districts: {
    districts: string[];
    degrees: DegreeProgram[];
    count: number;
  };
  student_input: StudentInput;
}