export type studyLevel = 'sinoprimaria' | 'secundariabach' | 'universitariosup' ;

export interface answerOptions {
    valor: number; //0 a 4
    texto: Record<studyLevel, string>; //texto en diferentes niveles de estudio
}

export interface auditQuestions {
    id: string;
    question: Record<studyLevel, string>;
    contextHelp?: Record<studyLevel, string>;
    answerOptions: answerOptions[];
}

export const auditQuestionsData: auditQuestions[] = [
    {
        id: 'q1',
        question: {
            sinoprimaria: '¿Cada cuánto tiempo bebes alcohol, como cerveza, vino o licores?',
            secundariabach: '¿Con qué frecuencia ha consumido bebidas alcohólicas en el último año?',
            universitariosup: '¿Con qué frecuencia ha ingerido alcohol durante los últimos doce meses?'
        },
        answerOptions: [
            { valor: 0, texto: { sinoprimaria: 'Nunca', secundariabach: 'Nunca', universitariosup: 'Nunca' } },
            { valor: 1, texto: { sinoprimaria: 'Una vez al mes', secundariabach: 'Mensualmente o menos', universitariosup: 'Mensualmente o menos' } },
            { valor: 2, texto: { sinoprimaria: '2-4 veces al mes', secundariabach: '2-4 veces al mes', universitariosup: '2-4 veces al mes' } },
            { valor: 3, texto: { sinoprimaria: '2-3 veces por semana', secundariabach: '2-3 veces por semana', universitariosup: '2-3 veces por semana' } },
            { valor: 4, texto: { sinoprimaria: '4 o más veces por semana', secundariabach: '4 o más veces por semana', universitariosup: '4 o más veces por semana' } },
        ]
    },

    {
        id: 'q2',
        question: {
            sinoprimaria: '¿Cuántas latas, botellines o copas sueles beber en un día bebiendo de normal?',
            secundariabach: '¿Cuántas bebidas alcohólicas sueles tomar en un día de consumo normal?',
            universitariosup: '¿Cuántas consumiciones de bebidas alcohólicas suele realizar en un día de consumo normal?'
        },
        answerOptions: [
            { valor: 0, texto: { sinoprimaria: '1-2', secundariabach: 'Uno o dos', universitariosup: 'Uno o dos' } },
            { valor: 1, texto: { sinoprimaria: '3-4', secundariabach: 'Tres o cuatro', universitariosup: 'Tres o cuatro' } },
            { valor: 2, texto: { sinoprimaria: '5-6', secundariabach: 'Cinco o seis', universitariosup: 'Cinco o seis' } },
            { valor: 3, texto: { sinoprimaria: '7-9', secundariabach: 'Siete a nueve', universitariosup: 'Siete a nueve' } },
            { valor: 4, texto: { sinoprimaria: '10 o +10', secundariabach: 'Diez o más', universitariosup: 'Diez o más' } },
        ]
    },

    {
        id: 'q3',
        question: {
            sinoprimaria: '¿Cada cuánto tiempo bebes 6 o +6 bebidas con alcohol?',
            secundariabach: '¿Con qué frecuencia toma seis o más bebidas con alcohol en una ocasión de consumo?',
            universitariosup: '¿Con qué frecuencia toma seis o más bebidas alcohólicas en una ocasión de consumo?'
        },
        answerOptions: [
            { valor: 0, texto: { sinoprimaria: 'Nunca', secundariabach: 'Nunca', universitariosup: 'Nunca' } },
            { valor: 1, texto: { sinoprimaria: 'Menos de una vez al mes', secundariabach: 'Menos de una vez al mes', universitariosup: 'Menos de una vez al mes' } },
            { valor: 2, texto: { sinoprimaria: '1 vez al mes', secundariabach: 'Una vez al mes', universitariosup: 'Mensualmente' } },
            { valor: 3, texto: { sinoprimaria: '1 vez a la semana', secundariabach: 'Una vez a la semana', universitariosup: 'Semanalmente' } },
            { valor: 4, texto: { sinoprimaria: '1 vez al día o casi 1 vez al día', secundariabach: 'Diariamente o casi', universitariosup: 'A diario o casi a diario' } },
        ]
    }
];
