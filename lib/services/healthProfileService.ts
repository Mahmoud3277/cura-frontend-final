import {
    HealthProfile,
    PersonalHealthInfo,
    MedicalHistory,
    Allergy,
    CurrentMedication,
    ChronicCondition,
    EmergencyContact,
    HealthGoal,
    HealthPreferences,
    Surgery,
    Hospitalization,
    FamilyHistory,
    Vaccination,
    LabResult,
    HealthMilestone,
} from '@/lib/types';

export interface HealthInsights {
    riskFactors: {
        factor: string;
        level: 'low' | 'medium' | 'high';
        description: string;
        recommendations: string[];
    }[];
    healthScore: {
        overall: number;
        categories: {
            medication: number;
            lifestyle: number;
            preventive: number;
            chronic: number;
        };
    };
    recommendations: {
        priority: 'high' | 'medium' | 'low';
        category: string;
        title: string;
        description: string;
        actionItems: string[];
    }[];
    alerts: {
        type: 'medication' | 'appointment' | 'allergy' | 'goal' | 'checkup';
        severity: 'info' | 'warning' | 'critical';
        message: string;
        dueDate?: Date;
        actionRequired: boolean;
    }[];
}

export interface HealthMetrics {
    bmi: {
        value: number;
        category: 'underweight' | 'normal' | 'overweight' | 'obese';
        recommendation: string;
    };
    medicationAdherence: {
        overall: number;
        byMedication: {
            name: string;
            adherence: number;
            trend: 'improving' | 'stable' | 'declining';
        }[];
    };
    goalProgress: {
        active: number;
        completed: number;
        overdue: number;
        onTrack: number;
    };
    riskAssessment: {
        cardiovascular: number;
        diabetes: number;
        drugInteractions: number;
        overall: number;
    };
}

class HealthProfileService {
    // Get complete health profile
    getHealthProfile(customerId: string): HealthProfile | null {
        // Mock data - in real implementation, this would fetch from database
        return {
            id: 'hp-001',
            customerId,
            personalInfo: this.getMockPersonalInfo(),
            medicalHistory: this.getMockMedicalHistory(),
            allergies: this.getMockAllergies(),
            currentMedications: this.getMockCurrentMedications(),
            chronicConditions: this.getMockChronicConditions(),
            emergencyContacts: this.getMockEmergencyContacts(),
            healthGoals: this.getMockHealthGoals(),
            preferences: this.getMockHealthPreferences(),
            createdAt: new Date('2023-06-15'),
            updatedAt: new Date('2024-01-18'),
        };
    }

    // Update health profile sections
    updatePersonalInfo(customerId: string, personalInfo: Partial<PersonalHealthInfo>): boolean {
        // Mock implementation
        console.log('Updating personal info for customer:', customerId, personalInfo);
        return true;
    }

    updateMedicalHistory(customerId: string, medicalHistory: Partial<MedicalHistory>): boolean {
        // Mock implementation
        console.log('Updating medical history for customer:', customerId, medicalHistory);
        return true;
    }

    // Allergy management
    addAllergy(customerId: string, allergy: Omit<Allergy, 'id'>): string {
        const id = `allergy-${Date.now()}`;
        console.log('Adding allergy for customer:', customerId, { id, ...allergy });
        return id;
    }

    updateAllergy(customerId: string, allergyId: string, allergy: Partial<Allergy>): boolean {
        console.log('Updating allergy:', allergyId, 'for customer:', customerId, allergy);
        return true;
    }

    deleteAllergy(customerId: string, allergyId: string): boolean {
        console.log('Deleting allergy:', allergyId, 'for customer:', customerId);
        return true;
    }

    // Medication management
    addMedication(customerId: string, medication: Omit<CurrentMedication, 'id'>): string {
        const id = `med-${Date.now()}`;
        console.log('Adding medication for customer:', customerId, { id, ...medication });
        return id;
    }

    updateMedication(
        customerId: string,
        medicationId: string,
        medication: Partial<CurrentMedication>,
    ): boolean {
        console.log('Updating medication:', medicationId, 'for customer:', customerId, medication);
        return true;
    }

    deleteMedication(customerId: string, medicationId: string): boolean {
        console.log('Deleting medication:', medicationId, 'for customer:', customerId);
        return true;
    }

    // Chronic condition management
    addChronicCondition(customerId: string, condition: Omit<ChronicCondition, 'id'>): string {
        const id = `condition-${Date.now()}`;
        console.log('Adding chronic condition for customer:', customerId, { id, ...condition });
        return id;
    }

    updateChronicCondition(
        customerId: string,
        conditionId: string,
        condition: Partial<ChronicCondition>,
    ): boolean {
        console.log(
            'Updating chronic condition:',
            conditionId,
            'for customer:',
            customerId,
            condition,
        );
        return true;
    }

    deleteChronicCondition(customerId: string, conditionId: string): boolean {
        console.log('Deleting chronic condition:', conditionId, 'for customer:', customerId);
        return true;
    }

    // Emergency contact management
    addEmergencyContact(customerId: string, contact: Omit<EmergencyContact, 'id'>): string {
        const id = `contact-${Date.now()}`;
        console.log('Adding emergency contact for customer:', customerId, { id, ...contact });
        return id;
    }

    updateEmergencyContact(
        customerId: string,
        contactId: string,
        contact: Partial<EmergencyContact>,
    ): boolean {
        console.log('Updating emergency contact:', contactId, 'for customer:', customerId, contact);
        return true;
    }

    deleteEmergencyContact(customerId: string, contactId: string): boolean {
        console.log('Deleting emergency contact:', contactId, 'for customer:', customerId);
        return true;
    }

    // Health goal management
    addHealthGoal(
        customerId: string,
        goal: Omit<HealthGoal, 'id' | 'progress' | 'milestones' | 'createdAt'>,
    ): string {
        const id = `goal-${Date.now()}`;
        const newGoal: HealthGoal = {
            id,
            ...goal,
            progress: 0,
            milestones: [],
            createdAt: new Date(),
        };
        console.log('Adding health goal for customer:', customerId, newGoal);
        return id;
    }

    updateHealthGoal(customerId: string, goalId: string, goal: Partial<HealthGoal>): boolean {
        console.log('Updating health goal:', goalId, 'for customer:', customerId, goal);
        return true;
    }

    deleteHealthGoal(customerId: string, goalId: string): boolean {
        console.log('Deleting health goal:', goalId, 'for customer:', customerId);
        return true;
    }

    addHealthMilestone(
        customerId: string,
        goalId: string,
        milestone: Omit<HealthMilestone, 'id'>,
    ): string {
        const id = `milestone-${Date.now()}`;
        console.log('Adding milestone for goal:', goalId, 'customer:', customerId, {
            id,
            ...milestone,
        });
        return id;
    }

    // Health insights and analytics
    getHealthInsights(customerId: string): HealthInsights {
        return {
            riskFactors: [
                {
                    factor: 'Hypertension',
                    level: 'medium',
                    description: 'Blood pressure readings indicate moderate risk',
                    recommendations: [
                        'Monitor blood pressure daily',
                        'Reduce sodium intake',
                        'Increase physical activity',
                        'Take medications as prescribed',
                    ],
                },
                {
                    factor: 'Diabetes Type 2',
                    level: 'medium',
                    description: 'Blood sugar levels require ongoing management',
                    recommendations: [
                        'Monitor blood glucose regularly',
                        'Follow diabetic diet plan',
                        'Maintain medication schedule',
                        'Regular eye and foot examinations',
                    ],
                },
                {
                    factor: 'Drug Interactions',
                    level: 'low',
                    description: 'Current medications have minimal interaction risk',
                    recommendations: [
                        'Continue current medication regimen',
                        'Inform doctors of all medications',
                        'Regular medication reviews',
                    ],
                },
            ],
            healthScore: {
                overall: 78,
                categories: {
                    medication: 85,
                    lifestyle: 72,
                    preventive: 80,
                    chronic: 75,
                },
            },
            recommendations: [
                {
                    priority: 'high',
                    category: 'Medication',
                    title: 'Improve Medication Adherence',
                    description: 'Your Vitamin D3 adherence has declined to 78%',
                    actionItems: [
                        'Set daily reminders for Vitamin D3',
                        'Consider pill organizer',
                        'Link to daily routine (e.g., breakfast)',
                    ],
                },
                {
                    priority: 'medium',
                    category: 'Lifestyle',
                    title: 'Increase Physical Activity',
                    description: 'Regular exercise can help manage both diabetes and hypertension',
                    actionItems: [
                        'Start with 15-minute daily walks',
                        'Consider joining a fitness program',
                        'Track activity with smartphone app',
                    ],
                },
                {
                    priority: 'medium',
                    category: 'Preventive',
                    title: 'Schedule Annual Eye Exam',
                    description: 'Important for diabetes management and early detection',
                    actionItems: [
                        'Book appointment with ophthalmologist',
                        'Bring list of current medications',
                        'Discuss diabetic retinopathy screening',
                    ],
                },
            ],
            alerts: [
                {
                    type: 'medication',
                    severity: 'warning',
                    message: 'Vitamin D3 adherence has declined to 78%',
                    actionRequired: true,
                },
                {
                    type: 'appointment',
                    severity: 'info',
                    message: 'Annual cardiology checkup due next month',
                    dueDate: new Date('2024-02-15'),
                    actionRequired: true,
                },
                {
                    type: 'goal',
                    severity: 'info',
                    message: 'Weight loss goal is 65% complete - great progress!',
                    actionRequired: false,
                },
            ],
        };
    }

    getHealthMetrics(customerId: string): HealthMetrics {
        const profile = this.getHealthProfile(customerId);
        if (!profile) {
            throw new Error('Health profile not found');
        }

        const bmi = this.calculateBMI(profile.personalInfo.height, profile.personalInfo.weight);

        return {
            bmi: {
                value: bmi,
                category: this.getBMICategory(bmi),
                recommendation: this.getBMIRecommendation(bmi),
            },
            medicationAdherence: {
                overall: 83.5,
                byMedication: [
                    { name: 'Metformin 500mg', adherence: 92, trend: 'stable' },
                    { name: 'Lisinopril 10mg', adherence: 85, trend: 'improving' },
                    { name: 'Vitamin D3 1000IU', adherence: 78, trend: 'declining' },
                ],
            },
            goalProgress: {
                active: 3,
                completed: 2,
                overdue: 1,
                onTrack: 2,
            },
            riskAssessment: {
                cardiovascular: 65,
                diabetes: 70,
                drugInteractions: 25,
                overall: 53,
            },
        };
    }

    // Utility methods
    private calculateBMI(height: number, weight: number): number {
        const heightInMeters = height / 100;
        return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
    }

    private getBMICategory(bmi: number): 'underweight' | 'normal' | 'overweight' | 'obese' {
        if (bmi < 18.5) return 'underweight';
        if (bmi < 25) return 'normal';
        if (bmi < 30) return 'overweight';
        return 'obese';
    }

    private getBMIRecommendation(bmi: number): string {
        const category = this.getBMICategory(bmi);
        switch (category) {
            case 'underweight':
                return 'Consider consulting with a nutritionist to develop a healthy weight gain plan.';
            case 'normal':
                return 'Maintain your current healthy weight through balanced diet and regular exercise.';
            case 'overweight':
                return 'Consider gradual weight loss through diet modification and increased physical activity.';
            case 'obese':
                return 'Consult with healthcare provider for a comprehensive weight management plan.';
            default:
                return 'Maintain a healthy lifestyle with balanced nutrition and regular exercise.';
        }
    }

    // Mock data generators
    private getMockPersonalInfo(): PersonalHealthInfo {
        return {
            dateOfBirth: new Date('1985-03-15'),
            gender: 'male',
            height: 175,
            weight: 78,
            bloodType: 'A+',
            smokingStatus: 'never',
            alcoholConsumption: 'occasional',
            exerciseFrequency: 'weekly',
            occupation: 'Software Engineer',
            maritalStatus: 'married',
        };
    }

    private getMockMedicalHistory(): MedicalHistory {
        return {
            surgeries: [
                {
                    id: 'surgery-001',
                    procedure: 'Appendectomy',
                    date: new Date('2010-08-15'),
                    hospital: 'Cairo University Hospital',
                    surgeon: 'Dr. Mohamed Ali',
                    complications: 'None',
                    notes: 'Routine procedure, full recovery',
                },
            ],
            hospitalizations: [
                {
                    id: 'hosp-001',
                    reason: 'Pneumonia',
                    admissionDate: new Date('2018-12-10'),
                    dischargeDate: new Date('2018-12-15'),
                    hospital: 'Ain Shams University Hospital',
                    diagnosis: 'Community-acquired pneumonia',
                    treatment: 'Antibiotics and supportive care',
                    notes: 'Full recovery, no complications',
                },
            ],
            familyHistory: [
                {
                    id: 'family-001',
                    relation: 'parent',
                    condition: 'Type 2 Diabetes',
                    ageOfOnset: 55,
                    notes: 'Father diagnosed at age 55',
                },
                {
                    id: 'family-002',
                    relation: 'grandparent',
                    condition: 'Hypertension',
                    ageOfOnset: 60,
                    notes: 'Maternal grandmother',
                },
            ],
            vaccinations: [
                {
                    id: 'vacc-001',
                    vaccine: 'COVID-19 (Pfizer)',
                    date: new Date('2021-06-15'),
                    provider: 'Ministry of Health',
                    batchNumber: 'PF123456',
                    notes: 'Second dose',
                },
                {
                    id: 'vacc-002',
                    vaccine: 'Influenza',
                    date: new Date('2023-10-01'),
                    provider: 'Local Clinic',
                    nextDue: new Date('2024-10-01'),
                    notes: 'Annual flu shot',
                },
            ],
            labResults: [
                {
                    id: 'lab-001',
                    testName: 'HbA1c',
                    date: new Date('2024-01-10'),
                    value: '6.8',
                    unit: '%',
                    referenceRange: '<7.0',
                    status: 'normal',
                    provider: 'MediLab',
                    notes: 'Good diabetes control',
                },
                {
                    id: 'lab-002',
                    testName: 'Total Cholesterol',
                    date: new Date('2024-01-10'),
                    value: '195',
                    unit: 'mg/dL',
                    referenceRange: '<200',
                    status: 'normal',
                    provider: 'MediLab',
                    notes: 'Within normal range',
                },
            ],
        };
    }

    private getMockAllergies(): Allergy[] {
        return [
            {
                id: 'allergy-001',
                allergen: 'Penicillin',
                type: 'drug',
                severity: 'severe',
                symptoms: ['Rash', 'Swelling', 'Difficulty breathing'],
                firstOccurrence: new Date('2005-06-20'),
                lastOccurrence: new Date('2005-06-20'),
                treatment: 'Epinephrine, corticosteroids',
                notes: 'Avoid all penicillin-based antibiotics',
            },
            {
                id: 'allergy-002',
                allergen: 'Shellfish',
                type: 'food',
                severity: 'moderate',
                symptoms: ['Hives', 'Nausea', 'Stomach cramps'],
                firstOccurrence: new Date('2012-03-10'),
                lastOccurrence: new Date('2020-08-15'),
                treatment: 'Antihistamines',
                notes: 'Avoid all shellfish and cross-contaminated foods',
            },
        ];
    }

    private getMockCurrentMedications(): CurrentMedication[] {
        return [
            {
                id: 'med-001',
                medicationName: 'Metformin 500mg',
                dosage: '500mg',
                frequency: 'Twice daily',
                route: 'oral',
                startDate: new Date('2022-03-15'),
                prescribedBy: 'Dr. Ahmed Hassan',
                indication: 'Type 2 Diabetes',
                adherence: 92,
                notes: 'Take with meals to reduce stomach upset',
            },
            {
                id: 'med-002',
                medicationName: 'Lisinopril 10mg',
                dosage: '10mg',
                frequency: 'Once daily',
                route: 'oral',
                startDate: new Date('2022-06-01'),
                prescribedBy: 'Dr. Fatima Ali',
                indication: 'Hypertension',
                adherence: 85,
                notes: 'Take in the morning, monitor blood pressure',
            },
            {
                id: 'med-003',
                medicationName: 'Vitamin D3 1000IU',
                dosage: '1000IU',
                frequency: 'Once daily',
                route: 'oral',
                startDate: new Date('2023-01-10'),
                prescribedBy: 'Dr. Ahmed Hassan',
                indication: 'Vitamin D deficiency',
                adherence: 78,
                notes: 'Take with fatty meal for better absorption',
            },
        ];
    }

    private getMockChronicConditions(): ChronicCondition[] {
        return [
            {
                id: 'condition-001',
                condition: 'Type 2 Diabetes',
                diagnosisDate: new Date('2022-03-15'),
                diagnosedBy: 'Dr. Ahmed Hassan',
                severity: 'moderate',
                status: 'controlled',
                medications: ['Metformin 500mg'],
                lastCheckup: new Date('2024-01-10'),
                nextCheckup: new Date('2024-04-10'),
                notes: 'Well controlled with medication and diet',
            },
            {
                id: 'condition-002',
                condition: 'Hypertension',
                diagnosisDate: new Date('2022-06-01'),
                diagnosedBy: 'Dr. Fatima Ali',
                severity: 'mild',
                status: 'controlled',
                medications: ['Lisinopril 10mg'],
                lastCheckup: new Date('2024-01-15'),
                nextCheckup: new Date('2024-04-15'),
                notes: 'Blood pressure well controlled',
            },
        ];
    }

    private getMockEmergencyContacts(): EmergencyContact[] {
        return [
            {
                id: 'contact-001',
                name: 'Sarah Ahmed',
                relationship: 'Spouse',
                phone: '+20 100 123 4567',
                email: 'sarah.ahmed@email.com',
                address: '123 Tahrir Square, Cairo',
                isPrimary: true,
            },
            {
                id: 'contact-002',
                name: 'Mohamed Ahmed',
                relationship: 'Brother',
                phone: '+20 101 234 5678',
                email: 'mohamed.ahmed@email.com',
                isPrimary: false,
            },
        ];
    }

    private getMockHealthGoals(): HealthGoal[] {
        return [
            {
                id: 'goal-001',
                title: 'Lose 10kg',
                description: 'Reduce weight from 78kg to 68kg for better health',
                category: 'weight',
                targetValue: 68,
                currentValue: 75,
                unit: 'kg',
                targetDate: new Date('2024-06-01'),
                status: 'active',
                progress: 65,
                milestones: [
                    {
                        id: 'milestone-001',
                        title: 'Lost first 5kg',
                        date: new Date('2023-12-01'),
                        value: 73,
                        notes: 'Great progress with diet changes',
                        achieved: true,
                    },
                ],
                createdAt: new Date('2023-09-01'),
            },
            {
                id: 'goal-002',
                title: 'Exercise 5 times per week',
                description: 'Increase physical activity for better cardiovascular health',
                category: 'exercise',
                targetValue: 5,
                currentValue: 3,
                unit: 'times/week',
                targetDate: new Date('2024-03-01'),
                status: 'active',
                progress: 60,
                milestones: [],
                createdAt: new Date('2024-01-01'),
            },
        ];
    }

    private getMockHealthPreferences(): HealthPreferences {
        return {
            reminderSettings: {
                medicationReminders: true,
                appointmentReminders: true,
                healthTips: true,
                goalReminders: true,
            },
            privacySettings: {
                shareWithDoctors: true,
                shareWithPharmacies: true,
                allowResearch: false,
                allowMarketing: false,
            },
            communicationPreferences: {
                preferredLanguage: 'en',
                preferredContactMethod: 'email',
                timeZone: 'Africa/Cairo',
            },
            healthDataSharing: {
                emergencyAccess: true,
                familyAccess: true,
                doctorAccess: true,
                pharmacyAccess: true,
            },
        };
    }
}

export const healthProfileService = new HealthProfileService();
