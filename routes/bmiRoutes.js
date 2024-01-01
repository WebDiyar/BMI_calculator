const express = require('express');
const router = express.Router();

let history = [];

const convertToMeters = (height, unit) => {
    switch (unit) {
        case 'cm': return height / 100;
        case 'mm': return height / 1000;
        case 'm': return height;
        default: return height;
    }
};

const convertToKilograms = (weight, unit) => {
    switch (unit) {
        case 'kg': return weight;
        case 'g': return weight / 1000;
        default: return weight;
    }
};


const getBmiCategory = (bmi, age, gender) => {
    if (age < 24) {
        if (bmi < 18.5) return "Underweight";
        else if (bmi < 24.9) return "Normal weight";
        else if (bmi < 29.9) return "Overweight";
        else if (bmi < 34.9) return "Obesity class 1";
        else if (bmi < 39.9) return "Obesity class 2";
        else if (bmi > 40) return "Obesity class 3";
    } else {
        if (gender === "male") {
            if (bmi < 20) return "Underweight";
            else if (bmi < 25) return "Normal weight";
            else if (bmi < 30) return "Overweight";
            else return "Obesity";
        } else if (gender === "female") {
            if (bmi < 18.5) return "Underweight";
            else if (bmi < 24.9) return "Normal weight";
            else if (bmi < 29.9) return "Overweight";
            else return "Obesity";
        }
    }
}


router.get('/', (req, res) => {
    res.render('home', { bmiResult: null });
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/history', (req, res) => {
    res.render('history', { history });
});

router.post('/bmicalculator', (req, res) => {
    let { height, weight, heightUnit, weightUnit, gender, firstName, lastName, age } = req.body;
    height = convertToMeters(parseFloat(height), heightUnit);
    weight = convertToKilograms(parseFloat(weight), weightUnit);

    const bmi = (weight / (height * height)).toFixed(2);

    const bmiCategory = getBmiCategory(parseFloat(bmi), parseInt(age));
    history.push({ firstName, lastName, age, gender, bmi, bmiCategory, date: new Date().toLocaleString() });

    // res.render('home', { bmiResult: `Your BMI is ${bmi}, Category: ${bmiCategory}` });
    res.render('home', { bmi: bmi, bmiCategory: bmiCategory });

});

router.post('/clear-history', (req, res) => {
    history = []; // Очистить массив истории
    res.redirect('/history'); // Перенаправить пользователя обратно на страницу истории
});


module.exports = router;
