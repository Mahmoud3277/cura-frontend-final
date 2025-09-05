export interface MedicineForInteractionCheck {
    id: string;
    name: string;
    activeIngredient: string;
    category: string;
}

export interface DrugInteraction {
    medicine1: string;
    medicine2: string;
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
    recommendation?: string;
}

export interface InteractionCheckResult {
    hasInteractions: boolean;
    interactions: DrugInteraction[];
    warnings: string[];
}

export class MedicineInteractionService {
    // Mock interaction database - in a real app, this would come from a medical database
    private static interactionDatabase: DrugInteraction[] = [
        {
            medicine1: 'Warfarin',
            medicine2: 'Aspirin',
            severity: 'severe',
            description: 'Increased risk of bleeding when used together',
            recommendation: 'Monitor INR closely and consider alternative pain relief',
        },
        {
            medicine1: 'Metformin',
            medicine2: 'Alcohol',
            severity: 'moderate',
            description: 'May increase risk of lactic acidosis',
            recommendation: 'Limit alcohol consumption',
        },
        {
            medicine1: 'Paracetamol',
            medicine2: 'Alcohol',
            severity: 'moderate',
            description: 'Increased risk of liver damage with chronic alcohol use',
            recommendation: 'Avoid alcohol or reduce paracetamol dose',
        },
        {
            medicine1: 'Ibuprofen',
            medicine2: 'Warfarin',
            severity: 'severe',
            description: 'Increased bleeding risk',
            recommendation: 'Use alternative pain relief or monitor closely',
        },
        {
            medicine1: 'Amoxicillin',
            medicine2: 'Methotrexate',
            severity: 'moderate',
            description: 'May increase methotrexate toxicity',
            recommendation: 'Monitor methotrexate levels',
        },
        {
            medicine1: 'Omeprazole',
            medicine2: 'Clopidogrel',
            severity: 'moderate',
            description: 'May reduce effectiveness of clopidogrel',
            recommendation: 'Consider alternative PPI or antiplatelet',
        },
    ];

    static async checkInteractions(
        medicines: MedicineForInteractionCheck[],
    ): Promise<InteractionCheckResult> {
        try {
            const interactions: DrugInteraction[] = [];
            const warnings: string[] = [];

            // Check all possible pairs of medicines
            for (let i = 0; i < medicines.length; i++) {
                for (let j = i + 1; j < medicines.length; j++) {
                    const med1 = medicines[i];
                    const med2 = medicines[j];

                    // Check for direct interactions
                    const directInteraction = this.findInteraction(med1.name, med2.name);
                    if (directInteraction) {
                        interactions.push(directInteraction);
                    }

                    // Check for active ingredient interactions
                    const ingredientInteraction = this.findInteraction(
                        med1.activeIngredient,
                        med2.activeIngredient,
                    );
                    if (ingredientInteraction && !directInteraction) {
                        interactions.push({
                            ...ingredientInteraction,
                            medicine1: med1.name,
                            medicine2: med2.name,
                        });
                    }

                    // Check for category-based warnings
                    const categoryWarning = this.checkCategoryInteractions(med1, med2);
                    if (categoryWarning) {
                        warnings.push(categoryWarning);
                    }
                }
            }

            return {
                hasInteractions: interactions.length > 0,
                interactions,
                warnings,
            };
        } catch (error) {
            console.error('Error checking drug interactions:', error);
            return {
                hasInteractions: false,
                interactions: [],
                warnings: ['Unable to check interactions at this time'],
            };
        }
    }

    private static findInteraction(medicine1: string, medicine2: string): DrugInteraction | null {
        // Check both directions (A-B and B-A)
        const interaction = this.interactionDatabase.find(
            (interaction) =>
                (interaction.medicine1.toLowerCase().includes(medicine1.toLowerCase()) &&
                    interaction.medicine2.toLowerCase().includes(medicine2.toLowerCase())) ||
                (interaction.medicine1.toLowerCase().includes(medicine2.toLowerCase()) &&
                    interaction.medicine2.toLowerCase().includes(medicine1.toLowerCase())),
        );

        return interaction || null;
    }

    private static checkCategoryInteractions(
        med1: MedicineForInteractionCheck,
        med2: MedicineForInteractionCheck,
    ): string | null {
        // Check for same category warnings
        if (med1.category === med2.category && med1.category === 'pain-relief') {
            return `Multiple pain relief medications detected. Monitor for increased side effects.`;
        }

        if (med1.category === 'antibiotics' && med2.category === 'antibiotics') {
            return `Multiple antibiotics detected. Ensure appropriate combination therapy.`;
        }

        if (med1.category === 'cardiovascular' && med2.category === 'cardiovascular') {
            return `Multiple cardiovascular medications. Monitor blood pressure and heart rate.`;
        }

        return null;
    }

    static async getAlternatives(
        medicine: MedicineForInteractionCheck,
    ): Promise<MedicineForInteractionCheck[]> {
        try {
            // Mock alternatives based on category
            const alternatives: MedicineForInteractionCheck[] = [];

            switch (medicine.category) {
                case 'pain-relief':
                    alternatives.push(
                        {
                            id: 'alt-1',
                            name: 'Paracetamol 500mg',
                            activeIngredient: 'Paracetamol',
                            category: 'pain-relief',
                        },
                        {
                            id: 'alt-2',
                            name: 'Ibuprofen 400mg',
                            activeIngredient: 'Ibuprofen',
                            category: 'pain-relief',
                        },
                    );
                    break;
                case 'antibiotics':
                    alternatives.push(
                        {
                            id: 'alt-3',
                            name: 'Amoxicillin 500mg',
                            activeIngredient: 'Amoxicillin',
                            category: 'antibiotics',
                        },
                        {
                            id: 'alt-4',
                            name: 'Azithromycin 250mg',
                            activeIngredient: 'Azithromycin',
                            category: 'antibiotics',
                        },
                    );
                    break;
                default:
                    break;
            }

            // Filter out the original medicine
            return alternatives.filter((alt) => alt.id !== medicine.id);
        } catch (error) {
            console.error('Error getting alternatives:', error);
            return [];
        }
    }

    static getSeverityColor(severity: 'mild' | 'moderate' | 'severe'): string {
        switch (severity) {
            case 'severe':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'moderate':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'mild':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    static getSeverityIcon(severity: 'mild' | 'moderate' | 'severe'): string {
        switch (severity) {
            case 'severe':
                return '🚨';
            case 'moderate':
                return '⚠️';
            case 'mild':
                return 'ℹ️';
            default:
                return '❓';
        }
    }
}
