import {
    create,
    addDependencies,
    subtractDependencies,
    multiplyDependencies,
    divideDependencies,
    dotDependencies,
    crossDependencies,
    normDependencies,
    matrixDependencies,
    identityDependencies,
} from 'mathjs';

const {
    add, subtract, multiply, divide, dot, cross, norm, matrix, identity
} = create({
    addDependencies,
    subtractDependencies,
    multiplyDependencies,
    divideDependencies,
    dotDependencies,
    crossDependencies,
    normDependencies,
    matrixDependencies,
    identityDependencies,
});

export const mathHelper = {
    add, subtract, multiply, divide, dot, cross, norm, matrix, identity
}