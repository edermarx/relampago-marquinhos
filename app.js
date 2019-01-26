/**
 * This project shows one of the basic principles used in AI.
 * Eliminating individuals who do not perform well in a given task,
 * selecting individuals who best meet the requirements chosen and 
 * "breeding" from them (Natural Selection).
 */

 /**
  * In our case, we are "teaching" cars, to go to the right,
  * as fast as possible, without telling them to go to the right.
  */

const fs = require('fs'); // used to write avgs.js file that will be used to see a graph at index.html

let generation = 0; // current generation index

const Car = () => { // a 'car' is a string with directions, 0=up, 1=right, 2=down, 3=left 
  let res = '';

  for (let i = 0; i < 20; i++) { // each car has 20 random directions
    res += Math.floor(Math.random() * 4)
  }

  return res;
};

const getDist = (car) => { // distance from origin to current position at 'x' axis
  let dist = 0;


  car.split('').forEach((char) => { // 1=right, 3=left
    if (char === '1') {
      dist += 1;
    }
    if (char === '3') {
      dist -= 1;
    }
  });

  return dist;
};

const procriate = (cars) => { // make a better generations from the current one
  generation++;

  const newCars = [...cars];

  newCars.sort((a, b) => { // order the cars by their distances
    return getDist(b) - getDist(a);
  });

  
  // "kill" the second half of the cars
  // duplicate the first half
  // change one property of the "children" of the first half (mutate a gen randomly)

  const topCars = newCars.slice(0, newCars.length / 2); 
  const bottomCars = [...topCars];

  const carsModified = topCars.concat(bottomCars.map((car) => { // "mutate" one of the "gens" of the car
    const index = Math.floor(Math.random() * car.length);
    const newDirection = Math.floor(Math.random() * 4);
    return car.substr(0, index) + newDirection + car.substr(index + (newDirection + '').length);
  }));

  return carsModified;
};

const stats = (cars) => { // get stats such as best car, worst car and average
  let min = 100;
  let max = 0;
  let sum = 0;

  cars.forEach(car => {
    if (getDist(car) < min) min = getDist(car);
    if (getDist(car) > max) max = getDist(car);
    sum += getDist(car);
  });

  const name = `generation ${generation}`;
  const avg = (sum / cars.length).toFixed(2);

  return {
    name,
    min,
    max,
    avg,
  };
}

// ================================================= //

const myCars = [];

for (let i = 0; i < 50; i++) { // generate a generation with 50 cars
  myCars.push(Car());
}

let currentGeneration = [...myCars];

const avgs = [];

for (let i = 0; i < 100; i++) { // evolve them 100 times
  avgs.push(stats(currentGeneration).avg); // used to make a graph in index.html
  currentGeneration = procriate(currentGeneration);
}

fs.writeFile("./avgs.js", `const avgs = ${JSON.stringify(avgs)};`, (err) => { // data of the graph
  if (err) {
    return console.log(err);
  }
});




