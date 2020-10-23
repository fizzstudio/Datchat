function negationDetect(markers, text) {
    let negated = false;
    markers.forEach((negator) => {
        if (text.includes(negator)) {
            negated = true;
        }
    });
    return negated;
}

function keywordDetect(options, text) {
    let selections = [];
    let split_text = text.split(" ");
    options.forEach((option) => {
        option.keywords.forEach((keyword) => {

            let contained = false;
            split_text.forEach(word => {
                if (word.includes(keyword)) {
                    contained = true;
                } else if (LevenshteinDistance(word, keyword) < 2) {
                    contained = true;
                }
            })

            if (contained) {
                selections.push(option);
                if (keyword == "table" || keyword == "chart") {
                    if (selections.length > 1) {
                        let popped = selections.pop();
                        selections.unshift(popped);             // make sure making table always happens first
                    }
                }
            }
        });
    });
    return selections;
}

function compareAnswers(response, history) {
    if (history.length > 0) {
        if (history[history.length - 1].answer.includes(response)) {
            return true; // current answer = last answer
        }
    }
    return false;
}

async function resultAnswer(option) {
    let response = await option.callback();
    if (option.getState() !== states.UNIFORM) {
        option.updateState(states.ASKED);
        option.addCount();
        if (compareAnswers(response, option.getAnswerRecords())) {
            response = "still, " + response;
        }
    }
    return response;
}

function LevenshteinDistance(a, b) {
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }
    return matrix[b.length][a.length];
};