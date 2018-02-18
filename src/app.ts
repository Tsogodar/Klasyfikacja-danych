// importy bibliotek
import * as synaptic from 'synaptic'
import * as fs from 'fs';
import * as path from 'path';
//deklarackja zmiennych globalnych
let perceptron: object;
let trainData: any[][] = [];
let trainingSet: object[] = [];
let testData: any[][] = [];
let testingSet: object[] = [];
let hiddenDecisions: number[] = [];

function loadTrainData(name: string): void {
// deklaracja zmiennych funkcji
    let file: string;
    let fileRows: string[];
// wczytanie danych z pliku jako string
    file = fs.readFileSync(path.join(`data/${name}`), 'utf8');
// rozbicie łańcucha na znaki typu string
    fileRows = file.split('\n');
// zapis znaków w tablicy 2d
    fileRows.forEach((row: string) => {
        trainData.push((row.trim().split(' ')));
    });
// konwersja znaków na liczby
    for (let i: number = 0; i < trainData.length; i++) {
        for (let j: number = 0; j < trainData[i].length; j++) {
            trainData[i][j] = parseInt(trainData[i][j]);
        }
    }
}

function createTrainingSet(trainData: number[][]): void {
// deklaracja zmiennych funkcji
    let decisions: number[] = [];
// wyodrębnienie decyzji
    for (let i: number = 0; i < trainData.length; i++) {
        decisions.push(trainData[i][trainData[i].length - 1]);
    }
// stworzenie struktury treningowych danych
    for (let i: number = 0; i < trainData.length; i++) {
        trainData[i].pop();
        trainingSet.push({
            input: trainData[i],
            output: [decisions[i]]
        });
    }
}

function loadTestData(name: string): void {
// deklaracja zmiennych funkcji
    let file: string;
    let fileRows: string[];
// wczytanie danych z pliku jako string
    file = fs.readFileSync(path.join(`data/${name}`), 'utf8');
// rozbicie łańcucha na znaki typu string
    fileRows = file.split('\n');
// zapis znaków w tablicy 2d
    fileRows.forEach((row: string) => {
        testData.push((row.trim().split(' ')));
    });
// konwersja znaków na liczby
    for (let i: number = 0; i < testData.length; i++) {
        for (let j: number = 0; j < testData[i].length; j++) {
            testData[i][j] = parseInt(testData[i][j]);
        }
    }
}

function createTestingSet(testData: number[][]): void {
// wyodrębnienie decyzji
    for (let i: number = 0; i < testData.length; i++) {
        hiddenDecisions.push(testData[i][testData[i].length - 1]);
    }
// stworzenie struktury treningowych danych
    for (let i: number = 0; i < testData.length; i++) {
        testData[i].pop();
        testingSet.push(testData[i]);
    }
}

function train(perceptron: object, trainingSet: object[]): void {
// deklaracja zmiennych funkcji
    let options: object;
// obiekt przechowujący opcję treningowe
    options = {
        rate: .0005,
        iterations: 8000,
        error: .2,
        cost: synaptic.Trainer.cost.MSE,
        schedule: {
            every: 1000,
            do: (data) => {
                // console.log(`Iteracja: ${data.iterations} Błąd: ${data.error}`);
            }
        }
    };
// inicjalizacja nauki perceptronu
    new synaptic.Trainer(perceptron).train(trainingSet, options);
}

function initPerceptron(input: number, hidden: number[], output: number): void {
// inicjalizacja perceptronu z wykorzystaniem architekta
    perceptron = new synaptic.Architect.Perceptron(input, hidden.join(), output);
}

function results(testingSet) {
    let correct: number = 0;
    let testingLenght: number;
    testingLenght = testingSet.length;
//podanie  danych testowych i wyświetlenie winików
    for (let key in testingSet) {
        let networkResult: number = perceptron['activate'](testingSet[key]);
        if (networkResult > 0.50) {
            let result = Math.ceil(perceptron['activate'](testingSet[key]));
            if (result == hiddenDecisions[key]) {
                correct++;
                console.log(`${parseInt(key) + 1}. Decyzja sieci: ${result} - Decyzja uryta: ${hiddenDecisions[key]} - OK`)
            } else {
                console.log(`${parseInt(key) + 1}. Decyzja sieci: ${result} - Decyzja uryta: ${hiddenDecisions[key]} - BŁĄD`)
            }
        } else {
            let result = Math.floor(perceptron['activate'](testingSet[key]));
            if (result == hiddenDecisions[key]) {
                correct++;
                console.log(`${parseInt(key) + 1}. Decyzja sieci: ${result} - Decyzja uryta: ${hiddenDecisions[key]} - OK`)
            } else {
                console.log(`${parseInt(key) + 1}. Decyzja sieci: ${result} - Decyzja uryta: ${hiddenDecisions[key]} - BŁĄD`)
            }
        }
    }
    console.log(`Poprawność klasyfikacji na poziomie ${((correct * 100) / testingLenght).toFixed(2)}%`)
}

//wywołanie metod
loadTrainData('SystemTreningowy.txt');
loadTestData('SystemTestowy.txt');

createTrainingSet(trainData);
createTestingSet(testData);
initPerceptron(4, [10], 1);
train(perceptron, trainingSet);
results(testingSet);

