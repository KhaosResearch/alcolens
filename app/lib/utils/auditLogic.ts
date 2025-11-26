export type Sex = 'man' | 'woman'

export type AuditRiskLevel = 'green' | 'yellow' | 'ambar' | 'red';

export interface auditResult{
    riskLevel: AuditRiskLevel;
    title: string;
    message: string;
    color: string;
}

export function riskEvaluation(points: number, sex: Sex): auditResult{
    if(points == 0){
        return {
            riskLevel: 'green',
            title: 'Consumo de Bajo Riesgo',
            message: 'Cualquier consumo tiene riesgos.',
            color: 'green'
        };
    }

    if(points >=8){
        return {
            riskLevel: 'red',
            title: 'Consumo de Alto Riesgo',
            message: 'Hable con su médico.',
            color: 'red'
        };
    }

    let riesgoBajo = false;

    if(sex === 'man'){
        if(points >=1 && points <=4){
            riesgoBajo = true;
        }
    } else {
        if(points >=1 && points <=3){
            riesgoBajo = true;
        }
    }

    if(riesgoBajo){
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