function checkPath(array, startPoint, endPoint) { /* function to check safe path through a graph (expecting a nested  array containing arrays of xy coords.) */
    const graph = array.map(x => { //convert array to array of objects with each node and whether each node has been checked.
        return {
            xypos: x, //original data, xy coord i.e [2,4].
            hasChecked: 0, //becomes true when node is checked for neighbours. (using incrementing to catch infinite loops.)
            fullyExplored: false, //becomes true if no unvisited neighbours exist.
        }
    });
    let currentNode = graph.find(x => x.xypos[0] === startPoint[0] && x.xypos[1] === startPoint[1]); //set currentNode to startPoint in graph.
    let targetNode = graph.find(x => x.xypos[0] === endPoint[0] && x.xypos[1] === endPoint[1]); //set targetNode to endPoint in graph.

    const checkForNeighbour = (node, target) => { //function to find a neighbouring node that has not been checked.
        node.hasChecked++; //set current node to checked.
        if (node.hasChecked > 4) {
            throw new Error('I think you\'re checking the same node infinitely my guy.');
        }

        let neighboursArray = []; //array of all 4 neighbours.
        neighboursArray.push(graph.find(x => x.xypos[0] === node.xypos[0] + 1 && x.xypos[1] === node.xypos[1])); //right
        neighboursArray.push(graph.find(x => x.xypos[0] === node.xypos[0] - 1 && x.xypos[1] === node.xypos[1])); //left
        neighboursArray.push(graph.find(x => x.xypos[1] === node.xypos[1] + 1 && x.xypos[0] === node.xypos[0])); //down
        neighboursArray.push(graph.find(x => x.xypos[1] === node.xypos[1] - 1 && x.xypos[0] === node.xypos[0])); //up

        neighboursArray = neighboursArray.filter(x => x !== undefined); //removes any undefined values from the neighboursArray.

        if (neighboursArray.length <= 0) { //error checking.
            throw new Error('Checked node has no neighbours, you\'ve definitely beansed something');
        };

        let neighbour = neighboursArray.find(x => !x.hasChecked); //neighbour = first unchecked node in neighbours array.
        if (!neighbour) { //if no unchecked neighbour exists, set this node to fullyExplored and look for a neighbour that is not fully explored.
            node.fullyExplored = true;
            neighbour = neighboursArray.find(x => !x.fullyExplored);
        }
        if (!neighbour) { //if no suitable neighbour exists, return false.
            return false;
        } else if (neighbour === target) { //if we've arrived at the endPoint, return true.
            return true;
        }
        return checkForNeighbour(neighbour, target); //else run search from new node.
    };
    
    return checkForNeighbour(currentNode, targetNode);
} 

module.exports = checkPath;