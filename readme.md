#Find Your Hat

This is a simple terminal game where you must navigate a character through a field full of holes to find its hat. 
To start, run hatGame.js. This will generate a 5x5 grid with 20% of the tiles replaced with holes.
To customise the size of the grid and the proportion of holes, add additional arguments when running hatGame.js. For example, 'node hatGame.js 10 10 0.3' will generate a 10x10 grid with 30% holes.

This project was extended from the initial objective by the inclusion of a pathChecker, that checks that the generated field has a valid path from the start to the hat. If the pathChecker fails, the user is prompted to try regenerating the field, or reduce the proportion of holes.