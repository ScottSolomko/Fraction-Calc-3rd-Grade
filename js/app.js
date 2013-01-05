'use strict';

// greatest common divisor
function gcd(a, b) {
    if (b === 0) {
        return a;
    } else {
        return gcd(b, a % b);
    }
}

// least common multiple
function lcm(a, b) {
    return (a / gcd(a, b)) * b;
}

function Fraction() {
    this.numerator      = '';         // original numerator
    this.denominator    = '';         // original denominator
    this.reduced        = false;      // was this fraction reduced
    this.rNumerator     = '';         // the reduced numerator
    this.rDenominator   = '';         // the reduced denominator
    this.multiplier     = '';         // the multiplier used to get common denominators
    this.nNumerator     = '';         // the new numerator after multiplying by 1
    this.nDenominator   = '';         // the new denominator after multiplying by 1
};

function reduce(fraction) {
    fraction.reduced = false;

    var divisor = gcd(fraction.numerator, fraction.denominator);

    if (divisor > 1) {
        fraction.reduced = true;
    }

    fraction.rNumerator   = fraction.numerator / divisor;
    fraction.rDenominator = fraction.denominator / divisor

    return fraction;
}

function addition(a, b) {
    var sum = new Fraction();

    sum.numerator   = a.nNumerator + b.nNumerator;
    sum.denominator = a.nDenominator;

    return sum;
}

function subtraction(a, b) {
    var diff = new Fraction();

    diff.numerator   = a.nNumerator - b.nNumerator;
    diff.denominator = a.nDenominator;

    return diff;
}

function multiplication(a, b) {
    var product = new Fraction();

    product.numerator   = a.rNumerator * b.rNumerator;
    product.denominator = a.rDenominator * b.rDenominator;

    return product;
}

function division(a, b) {
    var quotient = new Fraction();

    quotient.numerator   = a.rNumerator * b.rDenominator;
    quotient.denominator = a.rDenominator * b.rNumerator;

    return quotient;
}

function Controller($scope) {

    $scope.f1 = new Fraction();
    $scope.f2 = new Fraction();

    $scope.answer;
    $scope.answerType = '';      // possible answers are: regular, compound or whole
    $scope.showAnswer = false;

    $scope.display = [{'whole':'', 'numerator':'', 'denominator':''}];
    $scope.lcd;
    $scope.showSolution = false;
    $scope.showLCM = false;

    // add = &#43; subtract = &#8722;
    // figure out to to get angular to display those entities
    $scope.operators  = [
        {'op':'add', 'value':'+'},
        {'op':'subtract', 'value':'-'},
        {'op':'multiply', 'value':'x'},
        {'op':'divide', 'value':'/'}
    ];
    $scope.selectedOp = $scope.operators[0];

    $scope.preOp = function(a, b) {
        // reduce both fractions
        a = reduce(a);
        b = reduce(b);

        if ($scope.selectedOp.op == 'add' || $scope.selectedOp.op == 'subtract') {
            // find the least common denominator
            var lcd = lcm(a.rDenominator, b.rDenominator);
            $scope.lcd = lcd;

            a.multiplier = lcd / a.rDenominator;
            b.multiplier = lcd / b.rDenominator;

            // mutiply both fractions by 1, where 1 is expressed as a fraction
            a.nNumerator    = a.rNumerator * a.multiplier;
            a.nDenominator  = a.rDenominator * a.multiplier;
            b.nNumerator    = b.rNumerator * b.multiplier;
            b.nDenominator  = b.rDenominator * b.multiplier;
        }

        // perform the operation
        if ($scope.selectedOp.op == 'add') {
            $scope.answer = reduce(addition(a, b));
        } else if ($scope.selectedOp.op == 'subtract') {
            $scope.answer = reduce(subtraction(a, b));
        } else if ($scope.selectedOp.op == 'multiply') {
            $scope.answer = reduce(multiplication(a, b));
        } else {
            $scope.answer = reduce(division(a, b));
        }

        $scope.postOp($scope.answer);

        $scope.showAnswer = true;
        $scope.showSolution = true;
        if ($scope.f1.rDenominator === $scope.f2.rDenominator) {
            $scope.showLCM = false;
        } else {
            $scope.showLCM = true;
        }
    }

    $scope.postOp = function(fraction) {
        // is the fraction a whole number
        if (fraction.rDenominator === 1) {
            $scope.answerType = 'whole';
            $scope.display.whole = fraction.rNumerator;
            return;
        }

        // is the fraction irregular
        if (fraction.rNumerator > fraction.rDenominator) {
            var wholeNumber = Math.floor(fraction.rNumerator / fraction.rDenominator);

            $scope.answerType = 'compound';
            $scope.display.whole = wholeNumber;
            $scope.display.numerator = fraction.rNumerator - wholeNumber * fraction.rDenominator;
            $scope.display.denominator = fraction.rDenominator;
            return;
        }

        // its a normal fraction
        $scope.answerType = 'regular';
    }

}
