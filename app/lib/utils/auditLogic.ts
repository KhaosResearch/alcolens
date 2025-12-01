import { studyLevel } from '@/app/api/audit';

export type Sex = 'man' | 'woman'

export type AuditRiskLevel = 'green' | 'yellow' | 'ambar' | 'red';

export interface auditResult {
    riskLevel: AuditRiskLevel;
    title: string;
    message: string;
    color: string;
}

export function calculateAuditScore(answers: Record<string, number>): number {
    return Object.values(answers).reduce((acc, curr) => acc + curr, 0);
}

export function riskEvaluation(points: number, sex: Sex): auditResult {
    if (points == 0) {
        return {
            riskLevel: 'green',
            title: 'Consumo de Bajo Riesgo',
            message: 'Cualquier consumo tiene riesgos.',
            color: 'green'
        };
    }

    if (points >= 8) {
        return {
            riskLevel: 'red',
            title: 'Consumo de Alto Riesgo',
            message: 'Hable con su médico.',
            color: 'red'
        };
    }

    let riesgoBajo = false;

    if (sex === 'man') {
        if (points >= 1 && points <= 4) {
            riesgoBajo = true;
        }
    } else {
        if (points >= 1 && points <= 3) {
            riesgoBajo = true;
        }
    }

    if (riesgoBajo) {
        return {
            riskLevel: 'yellow',
            title: 'Consumo de Bajo Riesgo',
            message: 'Cualquier consumo tiene riesgos',
            color: 'yellow'
        };
    }

    return {
        riskLevel: 'ambar',
        title: 'Consumo de Riesgo Medio',
        message: 'Reduzca su consumo.',
        color: 'amber'
    };
}

export async function saveAuditResult(
    patientId: string,
    score: number,
    risk: AuditRiskLevel,
    answers: Record<string, number>,
    sex: Sex,
    studyLevel: studyLevel
): Promise<boolean> {
    try {
        const response = await fetch('/api/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                patientId,
                sex,
                studyLevel,
                answers,
                totalScore: score,
                levelResult: risk
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save results');
        }

        const data = await response.json();
        console.log("Data saved successfully:", data);
        return true;
    } catch (error) {
        console.error("Error saving audit result:", error);
        return false;
    }
}